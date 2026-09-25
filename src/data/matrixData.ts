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
  metaIntent: string;            // Buyer intent verb e.g. "rank higher on Google"
  iconAccent: string;            // Tailwind text-* color
  bullets: { title: string; desc: string }[];
  /** Service-specific 90-day working plan — the main block that makes each
   *  service × city page different from its sibling services in the same city. */
  approach: { phase: string; title: string; desc: string }[];
  /** Matches the channel label in cityDepth budgets (e.g. /SEO/). */
  channelMatch: RegExp;
  /** Two service-only questions; {city} is replaced at render. */
  serviceFaqs: { q: string; a: string }[];
}

export interface MatrixCityDef {
  slug: string;
  city: string;
  region: "india" | "middle-east" | "north-america" | "europe";
  countryCode: "IN" | "AE" | "SA" | "US" | "GB";
  countryName: string;            // Full country name for schema + copy
  regionLabel: string;            // Human region label used in the hero eyebrow
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
    metaIntent: "rank higher on Google",
    iconAccent: "text-emerald-400",
    bullets: [
      { title: "Technical SEO Audit & Fix", desc: "Core Web Vitals, schema, crawl architecture and indexation hygiene engineered for sustained ranking gains." },
      { title: "Topical Authority Content", desc: "Pillar + cluster maps and editorial-grade articles built for Google's helpful-content era." },
      { title: "DR60+ Link Acquisition", desc: "Digital PR, HARO and outreach to publications that move the needle for ranking and brand." },
      { title: "Local SEO + Map Pack", desc: "Google Business Profile, citations and review velocity to win the local 3-pack." },
    ],
    channelMatch: /SEO/,
    approach: [
      { phase: "Weeks 1–2", title: "Crawl + keyword audit", desc: "Full technical crawl, indexation check and a keyword map of what {city} buyers actually search, split by commercial and research intent." },
      { phase: "Weeks 3–6", title: "Fix the foundation", desc: "Page speed, internal links, schema and duplicate-page clean-up — the fixes that let existing pages rank before new content is written." },
      { phase: "Weeks 7–10", title: "Local + service pages", desc: "Google Business Profile optimisation, {city} area pages where there is real demand, and rewrites of the service pages closest to page one." },
      { phase: "Weeks 11–13", title: "Authority + review", desc: "Editorial link outreach to relevant publications and a ranking review against the keyword map set in week one." },
    ],
    serviceFaqs: [
      { q: "Do you guarantee a #1 ranking in {city}?", a: "No. Nobody controls Google's rankings, and agencies that promise a position are a red flag. We commit to the work plan, transparent reporting and movement on the keyword set agreed in week one." },
      { q: "Will you work on our Google Business Profile for {city}?", a: "Yes. Profile categories, services, photos, posting and review responses are part of every local SEO scope, because map-pack visibility drives most local enquiries." },
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
    channelMatch: /Google Ads|PPC/,
    approach: [
      { phase: "Week 1", title: "Account + tracking audit", desc: "Conversion tracking, offline-lead import and wasted-spend review so every rupee or dirham after week one is measured correctly." },
      { phase: "Weeks 2–3", title: "Restructure", desc: "Campaigns rebuilt around {city} service areas and buyer intent, with negative keywords and bid strategy matched to your real lead value." },
      { phase: "Weeks 4–8", title: "Test ads + landing pages", desc: "Structured ad-copy and landing-page tests, one variable at a time, with weekly search-term clean-up." },
      { phase: "Weeks 9–13", title: "Scale what converts", desc: "Budget moves to the campaigns with the best cost per qualified lead, plus Performance Max or Demand Gen only where the data supports it." },
    ],
    serviceFaqs: [
      { q: "Is the ad budget included in your {city} PPC fee?", a: "No. Media spend is paid directly to Google or Meta from your own account. Our fee covers strategy, build, testing and reporting, and you keep full ownership of the account." },
      { q: "What minimum ad spend do you recommend in {city}?", a: "It depends on click costs in your category. We share an estimate from keyword data before you commit, so the test budget is large enough to produce a clear result." },
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
    channelMatch: /Meta|Social|Instagram|LinkedIn/,
    approach: [
      { phase: "Weeks 1–2", title: "Audience + content audit", desc: "Review of your current channels, competitors in {city}, and which formats your audience actually engages with." },
      { phase: "Weeks 3–4", title: "Content system", desc: "Content pillars, a monthly calendar and a production workflow for reels, carousels and short video." },
      { phase: "Weeks 5–9", title: "Publish + paid amplification", desc: "Consistent posting plus small paid tests to find the creatives worth scaling, with community replies handled daily." },
      { phase: "Weeks 10–13", title: "Measure against sales", desc: "Reporting tied to enquiries, store visits or sales — not just followers — and a revised plan for the next quarter." },
    ],
    serviceFaqs: [
      { q: "Which platforms should a {city} business be on?", a: "Usually two, done well, rather than five done poorly. Consumer brands tend to lead with Instagram and YouTube Shorts; B2B firms with LinkedIn. We recommend based on where your buyers already spend time." },
      { q: "Do you create the content or do we?", a: "We plan, script, design and edit. For shoots with your team or premises, we either coordinate a local shoot or guide your team with a simple brief." },
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
    channelMatch: /Web|Development/,
    approach: [
      { phase: "Weeks 1–2", title: "Discovery + sitemap", desc: "Goals, page list, content plan and the SEO URLs to keep, so a redesign never loses existing rankings." },
      { phase: "Weeks 3–5", title: "Design", desc: "Mobile-first wireframes and visual design for your key pages, reviewed with you before any code is written." },
      { phase: "Weeks 6–10", title: "Build + integrate", desc: "Fast, accessible front end, CMS or admin panel, forms connected to your CRM, and analytics set up from day one." },
      { phase: "Weeks 11–13", title: "Launch + speed check", desc: "Redirects, Core Web Vitals testing on real phones, Search Console submission and a 30-day post-launch fix window." },
    ],
    serviceFaqs: [
      { q: "Will we be able to edit the website ourselves?", a: "Yes. Every build includes an editor or admin panel for text, images and blog posts, plus a short training session for your {city} team." },
      { q: "Who owns the website code and domain?", a: "You do. Domain, hosting and code are in your name, and we hand over full access at launch." },
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
    channelMatch: /AI|Automation|WhatsApp/,
    approach: [
      { phase: "Weeks 1–2", title: "Process mapping", desc: "We map the repetitive work in sales, support or operations and pick the one or two tasks where automation saves the most hours." },
      { phase: "Weeks 3–5", title: "Pilot build", desc: "A working pilot — for example a WhatsApp enquiry assistant or lead-scoring flow — trained on your own FAQs and documents." },
      { phase: "Weeks 6–9", title: "Test with real users", desc: "Supervised rollout with human hand-off for anything the assistant is unsure about, and weekly accuracy reviews." },
      { phase: "Weeks 10–13", title: "Connect + expand", desc: "Integration with your CRM or helpdesk, usage reporting, and a costed plan for the next process to automate." },
    ],
    serviceFaqs: [
      { q: "Is our customer data safe with AI tools?", a: "We use business-grade AI services that do not train on your data, store only what the workflow needs, and document where data goes so your {city} compliance team can review it." },
      { q: "Will an AI assistant replace our staff?", a: "It removes repetitive replies and data entry so your team handles the conversations that need judgement. Every setup includes a clear hand-off to a human." },
    ],
  },
];

export const MATRIX_CITIES: MatrixCityDef[] = [
  {
    slug: "delhi",
    city: "Delhi",
    region: "india",
    countryCode: "IN",
    countryName: "India",
    regionLabel: "India",
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
    countryName: "India",
    regionLabel: "India",
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
    countryName: "India",
    regionLabel: "India",
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
    countryName: "United Arab Emirates",
    regionLabel: "Middle East",
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
    countryName: "Saudi Arabia",
    regionLabel: "Middle East",
    currency: "SAR ",
    budgetMin: "SAR 9,000",
    budgetMax: "SAR 60,000",
    industries: ["Government", "Banking & Finance", "Tourism", "Logistics", "F&B"],
    marketAngle: "Vision 2030's epicentre — Arabic-first content, Snapchat + TikTok-led paid social and giga-project adjacencies.",
  },
  {
    slug: "new-york",
    city: "New York",
    region: "north-america",
    countryCode: "US",
    countryName: "United States",
    regionLabel: "United States",
    currency: "$",
    budgetMin: "$2,500",
    budgetMax: "$15,000",
    industries: ["B2B SaaS", "Professional Services", "E-commerce & DTC", "Fintech", "Real Estate"],
    marketAngle: "The most expensive attention market in the world — agency shortlists are decided on measurable pipeline, not brand decks.",
  },
  {
    slug: "london",
    city: "London",
    region: "europe",
    countryCode: "GB",
    countryName: "United Kingdom",
    regionLabel: "United Kingdom",
    currency: "£",
    budgetMin: "£2,000",
    budgetMax: "£12,000",
    industries: ["Fintech", "B2B SaaS", "Retail & DTC", "Legal & Consulting", "Property"],
    marketAngle: "A mature, heavily contested market where GDPR-safe measurement and genuine editorial content beat volume tactics.",
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
        : city.region === "middle-east"
        ? `Yes — our regional team services ${cityName} clients with quarterly in-person reviews and weekly remote sprint check-ins. Bilingual (English + Arabic) reporting included.`
        : `We run ${cityName} accounts remote-first with a fixed overlap window in your local business hours, a named strategist on every call, and recorded weekly sprint reviews you can share internally.`,
    },
    ...service.serviceFaqs.map(f => ({ q: f.q.split("{city}").join(cityName), a: f.a.split("{city}").join(cityName) })),
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
