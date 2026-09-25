/**
 * Intent-specific CTA copy — one source of truth so every page asks for the
 * action that matches what the visitor came for (never a generic "Contact Us").
 */
export interface IntentCta {
  primary: string;      // main button label
  secondary: string;    // softer alternative
  href: string;         // primary destination
}

const DEFAULT: IntentCta = { primary: "Request Growth Strategy", secondary: "Talk to a Strategist", href: "/get-proposal" };

const MAP: Record<string, IntentCta> = {
  seo: { primary: "Get Free SEO Audit", secondary: "Improve My Rankings", href: "/tools/seo-audit" },
  "local-seo": { primary: "Get Free Local SEO Audit", secondary: "Win the Map Pack", href: "/tools/seo-audit" },
  ppc: { primary: "Get Free Ads Account Audit", secondary: "Lower My Cost per Lead", href: "/get-proposal" },
  "social-media": { primary: "Request Social Growth Plan", secondary: "See Content Examples", href: "/get-proposal" },
  "digital-marketing": { primary: "Request Digital Strategy", secondary: "Get Free SEO Audit", href: "/get-proposal" },
  "web-development": { primary: "Get Website Estimate", secondary: "Discuss My Build", href: "/pricing-calculator" },
  development: { primary: "Get Website Estimate", secondary: "Start App Consultation", href: "/pricing-calculator" },
  "app-development": { primary: "Start App Consultation", secondary: "Get Build Estimate", href: "/get-proposal" },
  "ai-solutions": { primary: "Discuss My AI Project", secondary: "Try a Free AI Tool", href: "/get-proposal" },
  automation: { primary: "Automate My Business", secondary: "Map My Workflows", href: "/get-proposal" },
  "ai-automation": { primary: "Automate My Business", secondary: "Discuss My AI Project", href: "/get-proposal" },
  branding: { primary: "Request Brand Strategy", secondary: "See Our Work", href: "/get-proposal" },
  "public-relations": { primary: "Request PR Strategy", secondary: "Protect My Reputation", href: "/get-proposal" },
  pr: { primary: "Request PR Strategy", secondary: "Protect My Reputation", href: "/get-proposal" },
  "growth-hacking": { primary: "Request Growth Experiment Plan", secondary: "Talk to a Growth Lead", href: "/get-proposal" },
};

/** Resolve a CTA from any service slug; falls back to partial matches, then default. */
export function getIntentCta(slug?: string | null): IntentCta {
  if (!slug) return DEFAULT;
  const key = slug.toLowerCase();
  if (MAP[key]) return MAP[key];
  const hit = Object.keys(MAP).find((k) => key.includes(k));
  return hit ? MAP[hit] : DEFAULT;
}
