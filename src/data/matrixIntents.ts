/**
 * Phase 1 — programmatic intent layer for the city × service SEO matrix.
 *
 * Adds an "intent" dimension to /{service}/{city} pages so we can spawn
 * 5 services × 5 cities × N intents = hundreds of unique landing pages
 * targeting long-tail commercial-intent queries.
 *
 * Routes powered by: /:service/:city/:intent  (handled by MatrixPage).
 */
import { MATRIX_SERVICES, MATRIX_CITIES, type MatrixCityDef, type MatrixServiceDef } from "./matrixData";

export interface MatrixIntentDef {
  slug: string;            // URL slug e.g. "for-ecommerce"
  label: string;           // Display label e.g. "for Ecommerce Brands"
  intentNoun: string;      // e.g. "ecommerce brand"
  // Service slugs this intent is RELEVANT for. Empty = all.
  appliesTo?: string[];
  // 1-line market context appended to the hero subhead
  angle: string;
  // Bullet list of 3 specialised promises
  promises: string[];
}

export const MATRIX_INTENTS: MatrixIntentDef[] = [
  {
    slug: "for-ecommerce",
    label: "for Ecommerce Brands",
    intentNoun: "ecommerce brand",
    angle: "Built for Shopify, WooCommerce and headless commerce stacks chasing repeatable ROAS.",
    promises: [
      "Product-feed and merchant-centre optimisation tuned for blended ROAS",
      "Category + PLP architecture that captures bottom-funnel buyer intent",
      "Lifecycle automations (cart, browse, win-back) integrated end-to-end",
    ],
  },
  {
    slug: "for-saas",
    label: "for B2B SaaS",
    intentNoun: "B2B SaaS company",
    appliesTo: ["seo", "ppc", "social-media", "web-development"],
    angle: "PLG + sales-led playbooks built around demo, trial and pipeline metrics — not vanity traffic.",
    promises: [
      "Bottom-of-funnel content engineered for high-intent SaaS keywords",
      "Demo-request and trial-signup CRO with measurable pipeline impact",
      "Multi-touch attribution wired into HubSpot, Salesforce or Pipedrive",
    ],
  },
  {
    slug: "for-real-estate",
    label: "for Real Estate Developers",
    intentNoun: "real estate developer",
    angle: "Project-launch playbooks that fill site visits, walk-ins and pre-launch enquiries.",
    promises: [
      "Hyper-local landing pages per project, RERA-compliant ad creative",
      "Lead-quality scoring that filters serious buyers from time-wasters",
      "WhatsApp + IVR integration so sales never miss a hot enquiry",
    ],
  },
  {
    slug: "for-healthcare",
    label: "for Healthcare & Clinics",
    intentNoun: "healthcare brand",
    appliesTo: ["seo", "ppc", "social-media", "web-development", "ai-solutions"],
    angle: "Compliant, trust-led marketing for hospitals, clinics, dental and aesthetic brands.",
    promises: [
      "DCGI / MOH-compliant ad copy and landing-page reviews",
      "Doctor-led content + reputation management strategy",
      "Appointment-booking funnels integrated with HMS / EMR systems",
    ],
  },
  {
    slug: "for-startups",
    label: "for Funded Startups",
    intentNoun: "funded startup",
    angle: "Growth playbook designed for Seed → Series B teams that need traction without bloated budgets.",
    promises: [
      "Founder-led content + paid experiments that compound month over month",
      "Investor-grade dashboards: CAC, LTV, payback period and pipeline velocity",
      "Sprint-based engagement — pivot fast, kill what doesn't work",
    ],
  },
  {
    slug: "for-enterprises",
    label: "for Enterprise Brands",
    intentNoun: "enterprise brand",
    angle: "Multi-stakeholder programmes for brands with global compliance, brand-safety and approval guardrails.",
    promises: [
      "Account-based marketing wired to your CRM + ABM tooling",
      "Brand-safe creative governance with multi-language workflows",
      "Quarterly executive readouts, monthly cross-functional reviews",
    ],
  },
];

export function getIntentDef(slug: string): MatrixIntentDef | undefined {
  return MATRIX_INTENTS.find(i => i.slug === slug);
}

export function intentAppliesToService(intent: MatrixIntentDef, serviceSlug: string): boolean {
  return !intent.appliesTo || intent.appliesTo.includes(serviceSlug);
}

/**
 * Iterates every valid (service × city × intent) tuple — used by the sitemap
 * generator and the HTML sitemap page to enumerate programmatic URLs.
 */
export function iterateMatrixIntentTuples(): Array<{
  service: MatrixServiceDef;
  city: MatrixCityDef;
  intent: MatrixIntentDef;
  url: string;
}> {
  const out: Array<{ service: MatrixServiceDef; city: MatrixCityDef; intent: MatrixIntentDef; url: string }> = [];
  for (const service of MATRIX_SERVICES) {
    for (const city of MATRIX_CITIES) {
      for (const intent of MATRIX_INTENTS) {
        if (!intentAppliesToService(intent, service.slug)) continue;
        out.push({
          service,
          city,
          intent,
          url: `https://digitalpenta.com/${service.slug}/${city.slug}/${intent.slug}`,
        });
      }
    }
  }
  return out;
}
