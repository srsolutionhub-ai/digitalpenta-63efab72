/**
 * Entity → canonical-URL map used for internal linking with semantic
 * anchor text (better than "click here"). Powers auto-linking in blog
 * bodies, About page, and service-area strips.
 */
export interface EntityLink {
  keyword: string;      // exact-match phrase (case-insensitive)
  href: string;
  title: string;        // link title attribute
}

const SERVICES = ["seo", "ppc", "social-media", "web-development", "ai-solutions"];
const CITIES = [
  { slug: "delhi", name: "Delhi" },
  { slug: "mumbai", name: "Mumbai" },
  { slug: "bangalore", name: "Bangalore" },
  { slug: "gurgaon", name: "Gurgaon" },
  { slug: "noida", name: "Noida" },
  { slug: "hyderabad", name: "Hyderabad" },
  { slug: "pune", name: "Pune" },
  { slug: "chennai", name: "Chennai" },
  { slug: "dubai", name: "Dubai" },
  { slug: "abu-dhabi", name: "Abu Dhabi" },
  { slug: "riyadh", name: "Riyadh" },
  { slug: "doha", name: "Doha" },
  { slug: "manama", name: "Manama" },
];
const SERVICE_LABELS: Record<string, string> = {
  seo: "SEO",
  ppc: "Google Ads",
  "social-media": "social media marketing",
  "web-development": "web development",
  "ai-solutions": "AI solutions",
};

// Fixed high-value entities
const FIXED: EntityLink[] = [
  { keyword: "Harish Kumar", href: "/about", title: "About Harish Kumar, Founder & CEO" },
  { keyword: "Digital Penta", href: "/", title: "Digital Penta — Digital Marketing Agency" },
  { keyword: "case studies", href: "/portfolio", title: "Digital Penta client case studies" },
  { keyword: "free growth audit", href: "/tools/seo-audit", title: "Free SEO audit tool" },
  { keyword: "growth audit", href: "/tools/seo-audit", title: "Free growth audit" },
  { keyword: "SEO audit", href: "/tools/seo-audit", title: "Free SEO audit tool" },
  { keyword: "book a strategy call", href: "/book-a-call", title: "Book a free strategy call" },
];

// Auto-generate service×city entity links
const CITY_SERVICE: EntityLink[] = CITIES.flatMap((c) =>
  SERVICES.map((s) => ({
    keyword: `${SERVICE_LABELS[s]} in ${c.name}`,
    href: `/${s}/${c.slug}`,
    title: `${SERVICE_LABELS[s]} agency in ${c.name}`,
  }))
);

// City hub entries
const CITY_HUBS: EntityLink[] = CITIES.map((c) => ({
  keyword: `digital marketing in ${c.name}`,
  href: `/seo/${c.slug}`,
  title: `Digital marketing agency in ${c.name}`,
}));

export const ENTITY_LINKS: EntityLink[] = [...CITY_SERVICE, ...CITY_HUBS, ...FIXED];

/** Get top city service links for a service area strip. */
export function getServiceAreaLinks(serviceSlug: string, limit = 8): EntityLink[] {
  return CITIES.slice(0, limit).map((c) => ({
    keyword: `${SERVICE_LABELS[serviceSlug] ?? serviceSlug} in ${c.name}`,
    href: `/${serviceSlug}/${c.slug}`,
    title: `${SERVICE_LABELS[serviceSlug] ?? serviceSlug} agency in ${c.name}`,
  }));
}

export function getTopCityLinks(limit = 8) {
  return CITIES.slice(0, limit).map((c) => ({
    slug: c.slug,
    name: c.name,
    href: `/seo/${c.slug}`,
  }));
}
