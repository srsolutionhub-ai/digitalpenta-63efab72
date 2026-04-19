/**
 * Internal Linking Matrix — drives SEO authority flow between hub pages.
 *
 * Phase 3 of the Digital Penta SEO Master Plan:
 *   - Sub-service pages → 3 related services (within & across categories)
 *   - Location pages   → 3 nearby cities + 5 priority services
 *   - Industry pages   → 2 nearby industries + 5 anchor services
 *
 * All slugs match the source-of-truth data files (subServiceData.ts,
 * locationData.ts, industryData.ts). Keep this file in sync when adding new
 * services/cities/industries.
 */

export interface ServiceLink {
  category: string;
  slug: string;
  title: string;
  desc: string;
}

export interface CityLink {
  slug: string;
  city: string;
  country: string;
  blurb: string;
}

export interface IndustryLink {
  slug: string;
  title: string;
  blurb: string;
}

/* ────────────── Service catalog (used to resolve related services) ────────────── */
const SERVICE_CATALOG: ServiceLink[] = [
  // Digital Marketing
  { category: "digital-marketing", slug: "seo", title: "SEO Services", desc: "Rank #1 on Google with technical SEO, content & link building." },
  { category: "digital-marketing", slug: "ppc", title: "PPC & Google Ads", desc: "Maximise ROAS across Google, Meta & LinkedIn campaigns." },
  { category: "digital-marketing", slug: "social-media", title: "Social Media Marketing", desc: "Instagram, LinkedIn & Facebook strategy that converts." },
  { category: "digital-marketing", slug: "content", title: "Content Marketing", desc: "SEO-driven content engines that build topical authority." },
  { category: "digital-marketing", slug: "email", title: "Email Marketing", desc: "Lifecycle email automation with proven 30%+ open rates." },
  { category: "digital-marketing", slug: "influencer", title: "Influencer Marketing", desc: "Authentic creator partnerships across India & MENA." },
  { category: "digital-marketing", slug: "video", title: "Video Marketing", desc: "Short-form & long-form video that drives reach and trust." },
  { category: "digital-marketing", slug: "performance", title: "Performance Marketing", desc: "Full-funnel paid media optimised for revenue, not vanity." },
  // Public Relations
  { category: "public-relations", slug: "media-relations", title: "Media Relations", desc: "Earn coverage in tier-1 publications and trade press." },
  { category: "public-relations", slug: "brand-reputation", title: "Brand Reputation", desc: "Proactive monitoring & sentiment management at scale." },
  { category: "public-relations", slug: "crisis", title: "Crisis Management", desc: "Rapid response playbooks for brand-critical moments." },
  { category: "public-relations", slug: "digital-pr", title: "Digital PR", desc: "Link-worthy campaigns that earn coverage and backlinks." },
  { category: "public-relations", slug: "press-release", title: "Press Release Distribution", desc: "Targeted distribution across India & GCC media." },
  { category: "public-relations", slug: "thought-leadership", title: "Thought Leadership", desc: "Position founders as trusted industry voices." },
  { category: "public-relations", slug: "event-pr", title: "Event PR", desc: "Coverage strategies for product launches and summits." },
  // Development
  { category: "development", slug: "website", title: "Website Development", desc: "Conversion-optimised marketing sites built on modern stacks." },
  { category: "development", slug: "mobile-app", title: "Mobile App Development", desc: "Native & cross-platform apps with App Store optimisation." },
  { category: "development", slug: "ecommerce", title: "E-commerce Development", desc: "Shopify, WooCommerce & headless commerce builds." },
  { category: "development", slug: "web-app", title: "Web App Development", desc: "SaaS, dashboards and custom platforms at production scale." },
  { category: "development", slug: "cms", title: "CMS Development", desc: "Headless & traditional CMS for content-heavy brands." },
  { category: "development", slug: "api", title: "API Development", desc: "Robust integrations and developer-first APIs." },
  { category: "development", slug: "ui-ux", title: "UI/UX Design", desc: "Editorial-grade design systems built for conversion." },
  // AI Solutions
  { category: "ai-solutions", slug: "strategy", title: "AI Strategy", desc: "Identify high-ROI AI opportunities across your business." },
  { category: "ai-solutions", slug: "chatbot", title: "AI Chatbots", desc: "24/7 lead-qualifying conversational AI on web & WhatsApp." },
  { category: "ai-solutions", slug: "content-gen", title: "AI Content Generation", desc: "Brand-safe content workflows powered by LLMs." },
  { category: "ai-solutions", slug: "predictive", title: "Predictive Analytics", desc: "Forecast churn, LTV and demand with ML models." },
  { category: "ai-solutions", slug: "computer-vision", title: "Computer Vision", desc: "Image, video and OCR pipelines for industrial use cases." },
  { category: "ai-solutions", slug: "nlp", title: "NLP Solutions", desc: "Sentiment, classification and search powered by transformers." },
  { category: "ai-solutions", slug: "marketing", title: "AI Marketing", desc: "Personalisation, dynamic creative and attribution at scale." },
  // Automation
  { category: "automation", slug: "marketing", title: "Marketing Automation", desc: "Lifecycle workflows across email, SMS, ads and WhatsApp." },
  { category: "automation", slug: "workflow", title: "Workflow Automation", desc: "Internal ops automation with Zapier, Make & custom scripts." },
  { category: "automation", slug: "crm", title: "CRM Automation", desc: "HubSpot, Zoho & Salesforce setups that move deals faster." },
  { category: "automation", slug: "sales", title: "Sales Automation", desc: "AI-powered outreach and pipeline acceleration." },
  { category: "automation", slug: "social", title: "Social Automation", desc: "Scheduling, listening and engagement workflows." },
  { category: "automation", slug: "reporting", title: "Reporting Automation", desc: "Live dashboards that replace manual monthly decks." },
  { category: "automation", slug: "whatsapp", title: "WhatsApp Automation", desc: "Business API setups for support, sales and broadcasts." },
];

const findService = (category: string, slug: string): ServiceLink | undefined =>
  SERVICE_CATALOG.find(s => s.category === category && s.slug === slug);

/* ────────────── Sub-service → related services ────────────── */
/**
 * Curated cross-sell map. Returns 3 services that complement the current one,
 * mixing intra-category (depth) with inter-category (breadth) for topical
 * authority. Falls back to first 3 unrelated services if no curated map exists.
 */
const RELATED_SERVICE_MAP: Record<string, Array<[string, string]>> = {
  // Digital Marketing
  "digital-marketing/seo":          [["digital-marketing", "content"],     ["digital-marketing", "ppc"],         ["development", "website"]],
  "digital-marketing/ppc":          [["digital-marketing", "performance"], ["digital-marketing", "seo"],         ["automation", "marketing"]],
  "digital-marketing/social-media": [["digital-marketing", "content"],     ["digital-marketing", "influencer"],  ["automation", "social"]],
  "digital-marketing/content":      [["digital-marketing", "seo"],         ["digital-marketing", "video"],       ["ai-solutions", "content-gen"]],
  "digital-marketing/email":        [["automation", "marketing"],          ["digital-marketing", "performance"], ["automation", "crm"]],
  "digital-marketing/influencer":   [["digital-marketing", "social-media"],["digital-marketing", "video"],       ["public-relations", "digital-pr"]],
  "digital-marketing/video":        [["digital-marketing", "social-media"],["digital-marketing", "content"],     ["ai-solutions", "content-gen"]],
  "digital-marketing/performance":  [["digital-marketing", "ppc"],         ["digital-marketing", "seo"],         ["automation", "reporting"]],
  // Public Relations
  "public-relations/media-relations":    [["public-relations", "digital-pr"],         ["public-relations", "thought-leadership"], ["digital-marketing", "content"]],
  "public-relations/brand-reputation":   [["public-relations", "crisis"],             ["public-relations", "media-relations"],    ["automation", "social"]],
  "public-relations/crisis":             [["public-relations", "brand-reputation"],   ["public-relations", "media-relations"],    ["digital-marketing", "social-media"]],
  "public-relations/digital-pr":         [["public-relations", "media-relations"],    ["digital-marketing", "seo"],               ["digital-marketing", "content"]],
  "public-relations/press-release":      [["public-relations", "media-relations"],    ["public-relations", "digital-pr"],         ["digital-marketing", "content"]],
  "public-relations/thought-leadership": [["public-relations", "media-relations"],    ["digital-marketing", "content"],           ["digital-marketing", "video"]],
  "public-relations/event-pr":           [["public-relations", "media-relations"],    ["digital-marketing", "social-media"],      ["public-relations", "digital-pr"]],
  // Development
  "development/website":     [["development", "ui-ux"],     ["digital-marketing", "seo"],     ["development", "cms"]],
  "development/mobile-app":  [["development", "ui-ux"],     ["development", "api"],           ["digital-marketing", "performance"]],
  "development/ecommerce":   [["digital-marketing", "performance"], ["digital-marketing", "seo"], ["automation", "whatsapp"]],
  "development/web-app":     [["development", "api"],       ["development", "ui-ux"],         ["ai-solutions", "strategy"]],
  "development/cms":         [["development", "website"],   ["digital-marketing", "content"], ["development", "api"]],
  "development/api":         [["development", "web-app"],   ["ai-solutions", "strategy"],     ["automation", "workflow"]],
  "development/ui-ux":       [["development", "website"],   ["development", "web-app"],       ["development", "mobile-app"]],
  // AI Solutions
  "ai-solutions/strategy":        [["ai-solutions", "chatbot"],     ["ai-solutions", "predictive"],      ["automation", "workflow"]],
  "ai-solutions/chatbot":         [["automation", "whatsapp"],      ["ai-solutions", "nlp"],             ["digital-marketing", "performance"]],
  "ai-solutions/content-gen":     [["digital-marketing", "content"],["ai-solutions", "marketing"],       ["digital-marketing", "seo"]],
  "ai-solutions/predictive":      [["ai-solutions", "marketing"],   ["automation", "reporting"],         ["ai-solutions", "strategy"]],
  "ai-solutions/computer-vision": [["ai-solutions", "strategy"],    ["development", "web-app"],          ["ai-solutions", "nlp"]],
  "ai-solutions/nlp":             [["ai-solutions", "chatbot"],     ["ai-solutions", "content-gen"],     ["automation", "whatsapp"]],
  "ai-solutions/marketing":       [["digital-marketing", "performance"], ["ai-solutions", "predictive"], ["automation", "marketing"]],
  // Automation
  "automation/marketing":  [["digital-marketing", "email"],     ["automation", "crm"],         ["digital-marketing", "performance"]],
  "automation/workflow":   [["automation", "crm"],              ["development", "api"],        ["ai-solutions", "strategy"]],
  "automation/crm":        [["automation", "marketing"],        ["automation", "sales"],       ["digital-marketing", "email"]],
  "automation/sales":      [["automation", "crm"],              ["automation", "marketing"],   ["ai-solutions", "predictive"]],
  "automation/social":     [["digital-marketing", "social-media"], ["automation", "marketing"],["automation", "reporting"]],
  "automation/reporting":  [["automation", "workflow"],         ["digital-marketing", "performance"], ["ai-solutions", "predictive"]],
  "automation/whatsapp":   [["ai-solutions", "chatbot"],        ["automation", "marketing"],   ["digital-marketing", "performance"]],
};

export function getRelatedSubServices(category: string, slug: string): ServiceLink[] {
  const map = RELATED_SERVICE_MAP[`${category}/${slug}`];
  if (!map) {
    // Fallback: 3 services from other categories
    return SERVICE_CATALOG.filter(s => s.category !== category).slice(0, 3);
  }
  return map
    .map(([cat, sl]) => findService(cat, sl))
    .filter((s): s is ServiceLink => Boolean(s));
}

/* ────────────── Location → nearby cities ────────────── */
const CITY_CATALOG: CityLink[] = [
  { slug: "delhi",     city: "New Delhi", country: "India",         blurb: "HQ — full-stack digital growth across NCR." },
  { slug: "mumbai",    city: "Mumbai",    country: "India",         blurb: "BFSI, media & D2C marketing specialists." },
  { slug: "bangalore", city: "Bangalore", country: "India",         blurb: "SaaS, tech & startup growth marketing." },
  { slug: "pune",      city: "Pune",      country: "India",         blurb: "Manufacturing, IT services & education." },
  { slug: "hyderabad", city: "Hyderabad", country: "India",         blurb: "Tech, pharma & real estate digital marketing." },
  { slug: "noida",     city: "Noida",     country: "India",         blurb: "Hyper-local NCR SEO & B2B lead generation." },
  { slug: "gurgaon",   city: "Gurgaon",   country: "India",         blurb: "Enterprise, fintech & corporate clients in NCR." },
  { slug: "lucknow",   city: "Lucknow",   country: "India",         blurb: "Tier-2 city SEO with regional language strategy." },
  { slug: "jaipur",    city: "Jaipur",    country: "India",         blurb: "Tourism, jewellery & e-commerce marketing." },
  { slug: "kota",      city: "Kota",      country: "India",         blurb: "Education-focused student acquisition campaigns." },
  { slug: "dubai",     city: "Dubai",     country: "UAE",           blurb: "Bilingual GCC marketing for premium brands." },
  { slug: "abu-dhabi", city: "Abu Dhabi", country: "UAE",           blurb: "Government, finance & hospitality digital strategy." },
  { slug: "riyadh",    city: "Riyadh",    country: "Saudi Arabia",  blurb: "Vision 2030-aligned campaigns for KSA brands." },
  { slug: "doha",      city: "Doha",      country: "Qatar",         blurb: "Premium Arabic + English campaigns for Qatar." },
  { slug: "bahrain",   city: "Bahrain",   country: "Bahrain",       blurb: "Fintech-focused marketing for Gulf hub." },
];

const NEARBY_CITY_MAP: Record<string, string[]> = {
  delhi:     ["gurgaon", "noida", "jaipur"],
  mumbai:    ["pune", "bangalore", "hyderabad"],
  bangalore: ["hyderabad", "pune", "mumbai"],
  pune:      ["mumbai", "bangalore", "hyderabad"],
  hyderabad: ["bangalore", "mumbai", "pune"],
  noida:     ["delhi", "gurgaon", "lucknow"],
  gurgaon:   ["delhi", "noida", "jaipur"],
  lucknow:   ["delhi", "noida", "jaipur"],
  jaipur:    ["delhi", "gurgaon", "lucknow"],
  kota:      ["jaipur", "delhi", "lucknow"],
  dubai:     ["abu-dhabi", "doha", "bahrain"],
  "abu-dhabi": ["dubai", "riyadh", "doha"],
  riyadh:    ["abu-dhabi", "dubai", "bahrain"],
  doha:      ["dubai", "abu-dhabi", "bahrain"],
  bahrain:   ["doha", "abu-dhabi", "riyadh"],
};

export function getNearbyLocations(slug: string, limit = 3): CityLink[] {
  const ids = NEARBY_CITY_MAP[slug] ?? [];
  return ids
    .slice(0, limit)
    .map(s => CITY_CATALOG.find(c => c.slug === s))
    .filter((c): c is CityLink => Boolean(c));
}

/** Top services to surface on every location page (location → service authority flow). */
export function getLocationFeaturedServices(): ServiceLink[] {
  return [
    findService("digital-marketing", "seo")!,
    findService("digital-marketing", "ppc")!,
    findService("digital-marketing", "social-media")!,
    findService("development", "website")!,
    findService("ai-solutions", "chatbot")!,
  ];
}

/* ────────────── Industry → related industries + anchor services ────────────── */
const INDUSTRY_CATALOG: IndustryLink[] = [
  { slug: "real-estate", title: "Real Estate", blurb: "Lead generation & CRM automation for developers." },
  { slug: "healthcare",  title: "Healthcare",  blurb: "Patient acquisition with HIPAA-aware strategies." },
  { slug: "education",   title: "Education",   blurb: "Enrollment growth for institutes & ed-tech." },
  { slug: "ecommerce",   title: "E-commerce",  blurb: "ROAS-focused performance marketing & dev." },
  { slug: "finance",     title: "Finance",     blurb: "Compliant lead-gen for fintech & BFSI brands." },
  { slug: "hospitality", title: "Hospitality", blurb: "Direct-booking growth for hotels & restaurants." },
  { slug: "saas",        title: "SaaS & Tech", blurb: "Product-led growth and pipeline acceleration." },
];

const RELATED_INDUSTRY_MAP: Record<string, string[]> = {
  "real-estate": ["finance", "hospitality"],
  "healthcare":  ["education", "saas"],
  "education":   ["saas", "healthcare"],
  "ecommerce":   ["hospitality", "saas"],
  "finance":     ["real-estate", "saas"],
  "hospitality": ["real-estate", "ecommerce"],
  "saas":        ["finance", "ecommerce"],
};

export function getRelatedIndustries(slug: string): IndustryLink[] {
  return (RELATED_INDUSTRY_MAP[slug] ?? [])
    .map(s => INDUSTRY_CATALOG.find(i => i.slug === s))
    .filter((i): i is IndustryLink => Boolean(i));
}

export { SERVICE_CATALOG, CITY_CATALOG, INDUSTRY_CATALOG };
