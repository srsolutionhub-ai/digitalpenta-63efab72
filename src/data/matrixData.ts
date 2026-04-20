/**
 * Programmatic city × service SEO matrix (Phase 8 of SEO master plan).
 *
 * Generates dedicated landing pages for: 5 hero services × 5 top cities = 25 pages.
 * Each page combines unique meta + intro + city-specific FAQs to avoid the
 * thin-content / doorway-page pattern that gets penalised by Google.
 *
 * Route: /:service/:city  e.g. /seo/delhi, /ppc/dubai
 */
export interface MatrixServiceDef {
  slug: string;                  // URL slug, also used as service path segment
  name: string;                  // Display name e.g. "SEO"
  longName: string;              // Full noun phrase e.g. "Search Engine Optimization"
  serviceType: string;           // For schema.org/Service
  hubHref: string;               // Canonical service hub for back-link
  metaIntent: string;            // Buyer intent verb e.g. "rank #1 on Google"
  iconAccent: string;            // Tailwind text-* color
  bullets: { title: string; desc: string }[];
}

export interface MatrixCityDef {
  slug: string;
  city: string;
  region: "india" | "middle-east";
  countryCode: "IN" | "AE" | "SA";
  currency: string;              // For pricing answers
  budgetMin: string;             // Minimum monthly retainer
  budgetMax: string;             // Mid-tier monthly retainer
  industries: string[];          // City's top buyer industries
  marketAngle: string;           // 1-line characterisation of the city's market
}

export const MATRIX_SERVICES: MatrixServiceDef[] = [
  {
    slug: "seo",
    name: "SEO",
    longName: "Search Engine Optimization",
    serviceType: "Search Engine Optimization",
    hubHref: "/services/digital-marketing/seo",
    metaIntent: "rank #1 on Google",
    iconAccent: "text-emerald-400",
    bullets: [
      { title: "Technical SEO Audit & Fix", desc: "Core Web Vitals, schema, crawl architecture and indexation hygiene engineered for sustained ranking gains." },
      { title: "Topical Authority Content", desc: "Pillar + cluster maps and editorial-grade articles built for Google's helpful-content era." },
      { title: "DR60+ Link Acquisition", desc: "Digital PR, HARO and outreach to publications that move the needle for ranking and brand." },
      { title: "Local SEO + Map Pack", desc: "Google Business Profile, citations and review velocity to win the local 3-pack." },
    ],
  },
  {
    slug: "ppc",
    name: "PPC",
    longName: "Pay-Per-Click Advertising",
    serviceType: "PPC Management",
    hubHref: "/services/digital-marketing/ppc",
    metaIntent: "scale spend profitably",
    iconAccent: "text-amber-400",
    bullets: [
      { title: "Account Audit + Restructure", desc: "Tight ad groups, conversion-grade tracking, negative-keyword hygiene — most accounts hit 30%+ CPA reduction in 60 days." },
      { title: "Smart Bidding + Manual Hybrid", desc: "AI bidding paired with human strategy — the highest-ROAS combination for the local buyer journey." },
      { title: "Landing Page Builds Included", desc: "In-house LP builds lift Quality Score and CVR — no external agency hand-offs." },
      { title: "Weekly Optimisation Sprints", desc: "Bid adjustments, ad copy A/Bs, audience refreshes — every week, with documented changelog." },
    ],
  },
  {
    slug: "social-media",
    name: "Social Media",
    longName: "Social Media Marketing",
    serviceType: "Social Media Marketing",
    hubHref: "/services/digital-marketing/social-media",
    metaIntent: "build brand + drive sales",
    iconAccent: "text-pink-400",
    bullets: [
      { title: "Always-On Content Engine", desc: "Reels, carousels, shorts and long-form — produced weekly by an in-house creative pod." },
      { title: "Paid Social at Scale", desc: "Meta, LinkedIn, YouTube and TikTok — managed against ROAS, not just CPM." },
      { title: "Community Management", desc: "DMs, comments and reviews answered within 2 hours, every day of the week." },
      { title: "Influencer Activations", desc: "Tier-1 to nano influencer campaigns — sourced, briefed and tracked end-to-end." },
    ],
  },
  {
    slug: "web-development",
    name: "Web Development",
    longName: "Website & Web Application Development",
    serviceType: "Website Development",
    hubHref: "/services/development/website",
    metaIntent: "ship fast, conversion-grade websites",
    iconAccent: "text-violet-400",
    bullets: [
      { title: "Conversion-Grade Builds", desc: "Pixel-perfect, accessibility-compliant websites engineered for SEO, speed and conversion." },
      { title: "Modern Stack", desc: "Next.js, React, Astro, Shopify and headless WordPress — picked for your business model, not the agency's preference." },
      { title: "CMS Your Team Can Run", desc: "Editorial-grade CMS that marketing can update without dev tickets — Sanity, Strapi, Storyblok." },
      { title: "Maintenance + Growth", desc: "Post-launch retainer covers SEO, A/B tests, perf monitoring and feature rollouts." },
    ],
  },
  {
    slug: "ai-solutions",
    name: "AI Solutions",
    longName: "AI Solutions & Automation",
    serviceType: "AI Solutions",
    hubHref: "/services/ai-solutions",
    metaIntent: "automate revenue + support",
    iconAccent: "text-cyan-400",
    bullets: [
      { title: "AI Chatbots (RAG)", desc: "GPT-4 / Claude bots with RAG over your docs — sales, support and lead-gen on autopilot, multilingual." },
      { title: "Workflow Automation", desc: "n8n, Zapier and custom Python pipelines that connect CRM, marketing, finance and ops." },
      { title: "Predictive & Analytics", desc: "Lead scoring, churn prediction, demand forecasting — production-grade ML, not notebooks." },
      { title: "AI Content + Search", desc: "Internal AI search, content generation pipelines and AI-assisted SEO at scale." },
    ],
  },
];

export const MATRIX_CITIES: MatrixCityDef[] = [
  {
    slug: "delhi",
    city: "Delhi",
    region: "india",
    countryCode: "IN",
    currency: "₹",
    budgetMin: "₹35,000",
    budgetMax: "₹3,00,000",
    industries: ["Real Estate", "Healthcare", "E-commerce", "Education", "Hospitality"],
    marketAngle: "India's capital and largest startup-services hub — fiercely competitive across every consumer vertical.",
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    region: "india",
    countryCode: "IN",
    currency: "₹",
    budgetMin: "₹40,000",
    budgetMax: "₹3,50,000",
    industries: ["BFSI & Fintech", "D2C Brands", "Entertainment & Media", "Real Estate", "Lifestyle"],
    marketAngle: "India's financial capital — BFSI, D2C and entertainment dominate the digital-spend profile.",
  },
  {
    slug: "bangalore",
    city: "Bangalore",
    region: "india",
    countryCode: "IN",
    currency: "₹",
    budgetMin: "₹35,000",
    budgetMax: "₹3,00,000",
    industries: ["B2B SaaS", "Startups", "Deep-tech", "Fintech", "EdTech"],
    marketAngle: "India's Silicon Valley — SaaS, deeptech and PLG playbooks dominate the buyer search behaviour.",
  },
  {
    slug: "dubai",
    city: "Dubai",
    region: "middle-east",
    countryCode: "AE",
    currency: "AED ",
    budgetMin: "AED 4,500",
    budgetMax: "AED 25,000",
    industries: ["Real Estate", "Hospitality", "Luxury Retail", "Banking", "F&B"],
    marketAngle: "GCC's commercial hub — bilingual (English + Arabic) demand, premium brand competition and fast-cycle decision making.",
  },
  {
    slug: "riyadh",
    city: "Riyadh",
    region: "middle-east",
    countryCode: "SA",
    currency: "SAR ",
    budgetMin: "SAR 9,000",
    budgetMax: "SAR 60,000",
    industries: ["Government", "Banking & Finance", "Tourism", "Logistics", "F&B"],
    marketAngle: "Vision 2030's epicentre — Arabic-first content, Snapchat + TikTok-led paid social and giga-project adjacencies.",
  },
];

export interface MatrixPageData {
  service: MatrixServiceDef;
  city: MatrixCityDef;
  slug: string;                 // service-slug/city-slug
  canonical: string;
  metaTitle: string;            // <60 chars
  metaDescription: string;      // <160 chars
  h1: string;
  heroSubhead: string;
  faqs: { q: string; a: string }[];
}

export function getMatrixPage(serviceSlug: string, citySlug: string): MatrixPageData | undefined {
  const service = MATRIX_SERVICES.find(s => s.slug === serviceSlug);
  const city = MATRIX_CITIES.find(c => c.slug === citySlug);
  if (!service || !city) return undefined;

  const canonical = `https://digitalpenta.com/${service.slug}/${city.slug}`;
  const cityName = city.city;

  // Unique meta per combo — kept under 60/160 char limits.
  const metaTitle = `${service.name} Agency in ${cityName} | Digital Penta`;
  const metaDescription =
    `${service.longName} services in ${cityName}. ${service.metaIntent} with our specialist team. ` +
    `Pricing from ${city.budgetMin}/month. Free strategy consultation.`;

  const h1 = `${service.name} Agency in ${cityName} — ${service.metaIntent[0].toUpperCase()}${service.metaIntent.slice(1)}`;
  const heroSubhead =
    `${service.longName} for ${cityName}'s top brands. ${city.marketAngle} ` +
    `We blend the discipline of ${service.name} with deep ${cityName} market context — measured against revenue, not vanity metrics.`;

  // City + service specific FAQs — avoid duplicate boilerplate across pages.
  const faqs = [
    {
      q: `How much does a ${service.name} agency cost in ${cityName}?`,
      a: `${cityName} ${service.name} retainers typically range from ${city.budgetMin} to ${city.budgetMax}+/month depending on scope, competition and reporting depth. Our packages start at ${city.budgetMin}/month with full transparency on what's included.`,
    },
    {
      q: `How long until we see ${service.name} results in ${cityName}?`,
      a: service.slug === "seo" || service.slug === "web-development"
        ? `Most ${cityName} clients see meaningful ranking and traffic movement within 60-90 days. Compounding growth typically kicks in around month 6-9, then accelerates from there.`
        : `Most ${cityName} clients see measurable lift within the first 30-45 days. Larger optimisation gains and creative iteration cycles compound from month 2 onwards.`,
    },
    {
      q: `Which ${cityName} industries do you work with for ${service.name}?`,
      a: `Our ${cityName} ${service.name} team has deep experience across ${city.industries.slice(0, 4).join(", ")} and ${city.industries[city.industries.length - 1]}. We typically commit to verticals where we can show prior case-study evidence.`,
    },
    {
      q: `Do you offer in-person reviews in ${cityName}?`,
      a: city.region === "india"
        ? `Yes — for ${cityName} clients on retainer, we offer monthly in-person strategy reviews plus weekly remote sprint check-ins.`
        : `Yes — our regional team services ${cityName} clients with quarterly in-person reviews and weekly remote sprint check-ins. Bilingual (English + Arabic) reporting included.`,
    },
  ];

  return {
    service,
    city,
    slug: `${service.slug}/${city.slug}`,
    canonical,
    metaTitle,
    metaDescription,
    h1,
    heroSubhead,
    faqs,
  };
}

export function getAllMatrixPages(): MatrixPageData[] {
  const out: MatrixPageData[] = [];
  for (const s of MATRIX_SERVICES) {
    for (const c of MATRIX_CITIES) {
      const p = getMatrixPage(s.slug, c.slug);
      if (p) out.push(p);
    }
  }
  return out;
}

export function isMatrixServiceSlug(slug: string): boolean {
  return MATRIX_SERVICES.some(s => s.slug === slug);
}
