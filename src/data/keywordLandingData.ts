/**
 * Tier-2/3 keyword landing pages (Phase 6 of SEO master plan).
 *
 * Each entry powers a /lp/{slug} URL. Designed to capture mid-funnel
 * commercial keywords that don't justify a full hub page but deserve a
 * dedicated, conversion-optimised landing page with unique meta + content.
 */
export interface KeywordLandingData {
  slug: string;
  primaryKeyword: string;       // Exact match keyword the page targets
  city?: string;                // Geo modifier when applicable
  metaTitle: string;            // <60 chars
  metaDescription: string;      // <160 chars
  h1: string;
  heroSubhead: string;
  bullets: { title: string; desc: string }[];
  proofPoints: { value: string; label: string }[];
  whyUs: string[];
  faqs: { q: string; a: string }[];
  serviceCategory: string;      // For schema serviceType
  relatedServiceHref: string;   // Internal link back to canonical hub
  cta: string;
}

const keywordLandingPages: KeywordLandingData[] = [
  {
    slug: "seo-agency-bangalore",
    primaryKeyword: "SEO agency Bangalore",
    city: "Bangalore",
    metaTitle: "SEO Agency Bangalore | Rank #1 on Google | Digital Penta",
    metaDescription:
      "Bangalore's top SEO agency. Technical SEO, content & link building for SaaS, tech & e-commerce brands. 300%+ organic growth. Free audit.",
    h1: "SEO Agency in Bangalore That Actually Ranks You #1",
    heroSubhead:
      "We help Bangalore SaaS, tech and D2C brands dominate Google search through technical SEO, topical authority content, and high-quality link building — measured against revenue, not vanity rankings.",
    bullets: [
      { title: "Technical SEO Built for Speed", desc: "Core Web Vitals, schema, crawl budget — engineered for the Indian Googlebot crawl pattern." },
      { title: "Bangalore-Specific Content Engine", desc: "Topical clusters mapped to Bangalore + Karnataka + India search intent across English & regional queries." },
      { title: "DR40+ Backlink Acquisition", desc: "Digital PR, HARO and outreach to Indian publications that move the needle for tech brands." },
      { title: "Local SEO for Multi-Location Brands", desc: "GBP optimisation, citation building and hyper-local landing pages for every Bangalore branch." },
    ],
    proofPoints: [
      { value: "300%+", label: "Avg. organic growth in 12 months" },
      { value: "60+", label: "SaaS & tech clients" },
      { value: "DR70+", label: "Backlinks acquired" },
      { value: "4.9★", label: "Google rating" },
    ],
    whyUs: [
      "Specialists in B2B SaaS and product-led SEO — the dominant Bangalore vertical",
      "In-house content team that understands developer + buyer search intent",
      "Transparent monthly reporting with live ranking, traffic and conversion dashboards",
      "No long-term lock-ins — month-to-month contracts after the 90-day foundation phase",
    ],
    faqs: [
      { q: "How much does an SEO agency in Bangalore cost?", a: "Bangalore SEO retainers typically range from ₹40,000 to ₹3,00,000+/month based on competition and scope. Our packages start at ₹35,000/month with full transparency on what's included." },
      { q: "How long until I see SEO results in Bangalore?", a: "Most clients see ranking movement within 60-90 days. For competitive SaaS keywords, expect 6-9 months to reach page 1, with compounding traffic growth thereafter." },
      { q: "Do you handle SEO for SaaS startups?", a: "Yes — SaaS is a core specialty. We've helped 60+ B2B and B2C SaaS brands build organic acquisition pipelines that scale predictably." },
    ],
    serviceCategory: "SEO",
    relatedServiceHref: "/services/digital-marketing/seo",
    cta: "Get Your Free Bangalore SEO Audit",
  },
  {
    slug: "google-ads-agency-delhi",
    primaryKeyword: "Google Ads agency Delhi",
    city: "Delhi",
    metaTitle: "Google Ads Agency Delhi | Certified PPC Experts | Digital Penta",
    metaDescription:
      "Delhi's #1 Google Ads agency. Search, Shopping, YouTube & Performance Max campaigns. 8x avg ROAS. Google Premier Partner. Free strategy call.",
    h1: "Google Ads Agency in Delhi — Every Rupee Optimised for ROAS",
    heroSubhead:
      "Certified Google Ads specialists managing ₹15Cr+ in annual ad spend across Search, Shopping, YouTube and Performance Max for Delhi-based brands. Average client ROAS: 8.2x.",
    bullets: [
      { title: "Account Restructure & Audit", desc: "We rebuild bloated campaigns from scratch — tight ad groups, conversion-grade tracking, negative keyword hygiene." },
      { title: "Smart Bidding + Manual Hybrid", desc: "AI bidding paired with human strategy for the Indian buyer journey — the highest-ROAS combination today." },
      { title: "Conversion-Grade Landing Pages", desc: "Quality Score lift via in-house landing page builds — paid + organic compounding together." },
      { title: "Weekly Optimisation Sprints", desc: "Bid adjustments, ad copy A/Bs, audience refreshes — every week, with documented changelog." },
    ],
    proofPoints: [
      { value: "8.2x", label: "Avg client ROAS" },
      { value: "₹15Cr+", label: "Ad spend managed/year" },
      { value: "200+", label: "Active campaigns" },
      { value: "47%", label: "Avg CPA reduction" },
    ],
    whyUs: [
      "Google Premier Partner with certified Search, Display, Shopping and Video specialists",
      "Delhi-based account managers — face-to-face strategy reviews when you need them",
      "Performance-based pricing options for qualifying e-commerce brands",
      "Live ROAS dashboard — no waiting for monthly decks to know how you're performing",
    ],
    faqs: [
      { q: "How much should I spend on Google Ads in Delhi?", a: "Minimum effective spend is ₹50,000/month for meaningful learning data. Most Delhi SMBs run ₹1L–₹5L/month, while enterprise accounts go ₹10L+/month." },
      { q: "Do you charge a percentage of ad spend?", a: "We offer two models: flat retainer (₹35K-₹2L/month) or 12-15% of ad spend for accounts above ₹3L/month. The model that costs you less is the model we recommend." },
      { q: "Can you take over an existing Google Ads account?", a: "Yes — we typically run a 14-day audit + restructure on existing accounts. Most see 30-50% CPA reduction within 60 days of takeover." },
    ],
    serviceCategory: "PPC Management",
    relatedServiceHref: "/services/digital-marketing/ppc",
    cta: "Get Your Free Google Ads Audit",
  },
  {
    slug: "whatsapp-marketing-india",
    primaryKeyword: "WhatsApp marketing service India",
    metaTitle: "WhatsApp Marketing India | Business API Experts | Digital Penta",
    metaDescription:
      "WhatsApp Business API setup, broadcasts, chatbots & catalog commerce for Indian brands. 60%+ open rates. Meta Tech Partner. Get started.",
    h1: "WhatsApp Marketing Service for Indian Brands That Actually Sells",
    heroSubhead:
      "From Business API onboarding to AI-powered chatbots, broadcast automation and catalog commerce — we run the full WhatsApp marketing stack for 200+ Indian brands.",
    bullets: [
      { title: "WhatsApp Business API Setup", desc: "End-to-end onboarding through Meta Tech Partners — green tick application, template approvals, opt-in flows." },
      { title: "Broadcast Campaigns That Convert", desc: "Segmented broadcasts with 60-80% open rates and 25%+ click-through — far beyond email." },
      { title: "AI Chatbots & Sales Flows", desc: "24/7 lead qualification, FAQ handling and product discovery flows that close in-app." },
      { title: "Abandoned Cart + Order Updates", desc: "Automated transactional flows that recover 35%+ of abandoned carts and slash support tickets." },
    ],
    proofPoints: [
      { value: "60%+", label: "Avg open rate" },
      { value: "25%+", label: "Avg CTR" },
      { value: "200+", label: "Indian brands served" },
      { value: "35%", label: "Cart recovery rate" },
    ],
    whyUs: [
      "Meta Tech Partner — direct API access without third-party markups",
      "Hindi + English + regional language template libraries pre-approved",
      "Built-in compliance with WhatsApp's strict opt-in and messaging policies",
      "End-to-end: API setup, automation, creative, broadcast and analytics",
    ],
    faqs: [
      { q: "How much does WhatsApp Business API cost in India?", a: "Meta charges per conversation (~₹0.65-₹2.50 depending on category). Our service fee starts at ₹15,000/month including API setup, automation and broadcast management." },
      { q: "How long does WhatsApp API setup take?", a: "API approval typically takes 5-7 business days. Green tick verification adds another 2-3 weeks. We handle the full process including documentation." },
      { q: "Can I send promotional messages on WhatsApp?", a: "Yes — through pre-approved Marketing template messages to opted-in users. We handle template design, approval and the full opt-in collection workflow." },
    ],
    serviceCategory: "WhatsApp Marketing",
    relatedServiceHref: "/services/automation/whatsapp",
    cta: "Get Your WhatsApp Marketing Plan",
  },
];

export function getKeywordLanding(slug: string): KeywordLandingData | undefined {
  return keywordLandingPages.find(p => p.slug === slug);
}

export function getAllKeywordLandings(): KeywordLandingData[] {
  return keywordLandingPages;
}
