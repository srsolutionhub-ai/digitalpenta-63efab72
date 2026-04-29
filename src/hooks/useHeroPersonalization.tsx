/**
 * useHeroPersonalization — derives a hero variant from URL params, referrer,
 * and a few lightweight heuristics. Pure client-side, zero deps. Persists the
 * resolved variant in sessionStorage so navigation between pages keeps the
 * personalized hero stable.
 *
 * Variants are intentionally narrow and editorial — we never invent claims,
 * we just re-frame the existing value prop around the visitor's likely intent.
 */
import { useEffect, useState } from "react";

export type HeroVariant =
  | "default"
  | "google-ads"
  | "seo"
  | "social"
  | "ai-automation"
  | "ecommerce"
  | "uae"
  | "linkedin"
  | "returning";

export interface HeroCopy {
  variant: HeroVariant;
  badge: string;
  h1Top: string;
  h1Bottom: string;
  sub: React.ReactNode;
  ctaPrimary: { label: string; to: string };
  ctaSecondary: { label: string; to: string };
}

const STORAGE_KEY = "dp_hero_variant_v1";

const VARIANTS: Record<HeroVariant, Omit<HeroCopy, "variant">> = {
  default: {
    badge: "India's #1 AI-Powered Growth Studio · 2025",
    h1Top: "Marketing that",
    h1Bottom: "moves needles.",
    sub: (
      <>
        We blend{" "}
        <span className="text-foreground font-semibold">
          SEO, performance ads, social, and AI automation
        </span>{" "}
        to grow brands 10× faster — across India and the Middle East.
      </>
    ),
    ctaPrimary: { label: "Get Free Strategy Audit", to: "/contact" },
    ctaSecondary: { label: "View Case Studies", to: "/portfolio" },
  },
  "google-ads": {
    badge: "Google Premier Partner · Performance Marketing",
    h1Top: "Lower CPL.",
    h1Bottom: "Higher ROAS.",
    sub: (
      <>
        Senior Google Ads strategists rebuild your funnel —{" "}
        <span className="text-foreground font-semibold">−42% CPL in 90 days</span>{" "}
        for SaaS, D2C and real-estate brands.
      </>
    ),
    ctaPrimary: { label: "Get Free Ads Audit", to: "/seo-audit" },
    ctaSecondary: { label: "See Ads Case Studies", to: "/portfolio" },
  },
  seo: {
    badge: "500+ keywords ranked · 4.9★ Clutch",
    h1Top: "Rank #1 on Google.",
    h1Bottom: "Win compounding traffic.",
    sub: (
      <>
        Technical SEO, content clusters, and digital PR — engineered to lift{" "}
        <span className="text-foreground font-semibold">organic traffic 312%</span>{" "}
        in 6 months.
      </>
    ),
    ctaPrimary: { label: "Run Free SEO Audit", to: "/seo-audit" },
    ctaSecondary: { label: "Browse SEO Case Studies", to: "/portfolio" },
  },
  social: {
    badge: "Meta Business Partner · Creator-led growth",
    h1Top: "Social that sells —",
    h1Bottom: "not just scrolls.",
    sub: (
      <>
        Strategy, content, paid social and creator partnerships engineered for{" "}
        <span className="text-foreground font-semibold">measurable pipeline</span>, not vanity reach.
      </>
    ),
    ctaPrimary: { label: "Get Social Media Plan", to: "/contact" },
    ctaSecondary: { label: "View Social Work", to: "/portfolio" },
  },
  "ai-automation": {
    badge: "AI Solutions · Chatbots · Marketing Automation",
    h1Top: "AI-powered growth,",
    h1Bottom: "built for your stack.",
    sub: (
      <>
        Custom AI chatbots, lead-scoring, and end-to-end automations that{" "}
        <span className="text-foreground font-semibold">cut response time 80%</span>{" "}
        and scale your team.
      </>
    ),
    ctaPrimary: { label: "Book AI Strategy Call", to: "/contact" },
    ctaSecondary: { label: "Explore AI Services", to: "/services/ai-solutions/chatbot" },
  },
  ecommerce: {
    badge: "D2C / E-commerce growth specialists",
    h1Top: "Scale your store.",
    h1Bottom: "Profitably.",
    sub: (
      <>
        Shopify-grade builds, performance ads, and retention automations driving{" "}
        <span className="text-foreground font-semibold">4.8× ROAS</span> for D2C brands.
      </>
    ),
    ctaPrimary: { label: "Get E-commerce Audit", to: "/seo-audit" },
    ctaSecondary: { label: "See D2C Case Studies", to: "/industries/ecommerce" },
  },
  uae: {
    badge: "Dubai · Abu Dhabi · Riyadh · Doha",
    h1Top: "MENA growth,",
    h1Bottom: "Delhi pricing.",
    sub: (
      <>
        Bilingual SEO, paid media and social — engineered for{" "}
        <span className="text-foreground font-semibold">UAE & GCC audiences</span>{" "}
        with on-ground market insight.
      </>
    ),
    ctaPrimary: { label: "Talk to MENA Strategist", to: "/contact" },
    ctaSecondary: { label: "Dubai Services", to: "/locations/dubai" },
  },
  linkedin: {
    badge: "B2B & SaaS growth specialists",
    h1Top: "Pipeline-led",
    h1Bottom: "B2B growth.",
    sub: (
      <>
        ABM, LinkedIn ads, SEO and content engineered for{" "}
        <span className="text-foreground font-semibold">qualified pipeline</span> — not MQL vanity.
      </>
    ),
    ctaPrimary: { label: "Book B2B Strategy Call", to: "/contact" },
    ctaSecondary: { label: "B2B SaaS Marketing", to: "/lp/b2b-saas-marketing-agency-india" },
  },
  returning: {
    badge: "Welcome back — let's pick up where you left off",
    h1Top: "Ready to start?",
    h1Bottom: "Let's get you a plan.",
    sub: (
      <>
        Book a free 30-min strategy call with a senior advisor and walk away with a{" "}
        <span className="text-foreground font-semibold">customised growth roadmap</span>.
      </>
    ),
    ctaPrimary: { label: "Book Strategy Call", to: "/get-proposal" },
    ctaSecondary: { label: "View Case Studies", to: "/portfolio" },
  },
};

function detectVariant(): HeroVariant {
  if (typeof window === "undefined") return "default";

  try {
    const cached = sessionStorage.getItem(STORAGE_KEY) as HeroVariant | null;
    if (cached && cached in VARIANTS) return cached;
  } catch { /* noop */ }

  const params = new URLSearchParams(window.location.search);
  const utmSource = (params.get("utm_source") || "").toLowerCase();
  const utmMedium = (params.get("utm_medium") || "").toLowerCase();
  const utmCampaign = (params.get("utm_campaign") || "").toLowerCase();
  const ref = (document.referrer || "").toLowerCase();
  const tld = ref;

  let resolved: HeroVariant = "default";

  // UTM-driven (highest priority)
  const blob = `${utmSource} ${utmMedium} ${utmCampaign}`;
  if (/google|gads|adwords|cpc|ppc/.test(blob)) resolved = "google-ads";
  else if (/seo|organic/.test(blob)) resolved = "seo";
  else if (/insta|facebook|meta|tiktok|social/.test(blob)) resolved = "social";
  else if (/ai|automation|chatbot/.test(blob)) resolved = "ai-automation";
  else if (/ecom|shopify|d2c|woocom/.test(blob)) resolved = "ecommerce";
  else if (/uae|dubai|mena|gcc|riyadh/.test(blob)) resolved = "uae";
  else if (/linkedin|b2b|saas/.test(blob)) resolved = "linkedin";
  else if (utmSource === "google" && (utmMedium === "" || utmMedium === "organic")) resolved = "seo";

  // Referrer-based fallback
  if (resolved === "default") {
    if (/linkedin\./.test(tld)) resolved = "linkedin";
    else if (/instagram\.|facebook\.|fb\.|t\.co|tiktok\./.test(tld)) resolved = "social";
    else if (/google\./.test(tld) && /\/search/.test(tld)) resolved = "seo";
  }

  // Returning visitor detection (no other signal)
  if (resolved === "default") {
    try {
      const visited = localStorage.getItem("dp_visited_v1");
      if (visited) resolved = "returning";
      localStorage.setItem("dp_visited_v1", "1");
    } catch { /* noop */ }
  }

  try { sessionStorage.setItem(STORAGE_KEY, resolved); } catch { /* noop */ }
  return resolved;
}

export function useHeroPersonalization(): HeroCopy {
  const [variant, setVariant] = useState<HeroVariant>("default");

  useEffect(() => {
    setVariant(detectVariant());
  }, []);

  return { variant, ...VARIANTS[variant] };
}
