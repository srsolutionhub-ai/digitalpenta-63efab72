import { useEffect } from "react";

/**
 * Centralized SEO head injector.
 *
 * Manages: <title>, meta description, robots, canonical, Open Graph,
 * Twitter card, hreflang alternates, JSON-LD schema blocks.
 *
 * Cleans up entries it injected (marked with data-seo) on unmount.
 */
export interface HreflangAlternate {
  hreflang: string;          // e.g. "en", "en-IN", "ar-AE", "x-default"
  href: string;              // absolute URL
}

export interface SEOHeadProps {
  title: string;             // <60 chars
  description: string;       // <160 chars
  canonical: string;         // absolute URL
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noindex?: boolean;
  hreflangs?: HreflangAlternate[];
  schemas?: Record<string, unknown>[];      // JSON-LD blocks
  arabicTitle?: string;     // optional bilingual title for MENA pages
  arabicDescription?: string;
}

const SEO_MARKER = "data-seo";

function setMeta(selector: string, attrName: "name" | "property", attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    el.setAttribute(SEO_MARKER, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    el.setAttribute(SEO_MARKER, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = "https://digitalpenta.com/og-image.png",
  ogType = "website",
  noindex = false,
  hreflangs,
  schemas,
  arabicTitle,
  arabicDescription,
}: SEOHeadProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Robots
    setMeta('meta[name="robots"]', "name", "robots",
      noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1");

    // Description
    setMeta('meta[name="description"]', "name", "description", description);

    // Open Graph
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "Digital Penta");

    // Twitter
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // Optional Arabic alternates
    if (arabicTitle) {
      setMeta('meta[property="og:locale:alternate"]', "property", "og:locale:alternate", "ar_AE");
      setMeta('meta[name="title:ar"]', "name", "title:ar", arabicTitle);
    }
    if (arabicDescription) {
      setMeta('meta[name="description:ar"]', "name", "description:ar", arabicDescription);
    }

    // Canonical
    setLink("canonical", canonical);

    // Hreflang alternates — clear old then re-add to prevent stale entries
    document.head.querySelectorAll(`link[rel="alternate"][hreflang][${SEO_MARKER}]`).forEach(n => n.remove());
    if (hreflangs && hreflangs.length) {
      hreflangs.forEach(h => setLink("alternate", h.href, h.hreflang));
    }

    // JSON-LD schemas — wipe any prior SEOHead schemas, re-inject
    document.head.querySelectorAll(`script[type="application/ld+json"][${SEO_MARKER}="page"]`).forEach(n => n.remove());
    if (schemas && schemas.length) {
      schemas.forEach(s => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute(SEO_MARKER, "page");
        script.text = JSON.stringify(s);
        document.head.appendChild(script);
      });
    }

    return () => {
      // Cleanup page-scoped schemas + hreflang alternates on unmount.
      document.head.querySelectorAll(`script[type="application/ld+json"][${SEO_MARKER}="page"]`).forEach(n => n.remove());
      document.head.querySelectorAll(`link[rel="alternate"][hreflang][${SEO_MARKER}]`).forEach(n => n.remove());
    };
  }, [
    title, description, canonical, ogImage, ogType, noindex,
    JSON.stringify(hreflangs), JSON.stringify(schemas),
    arabicTitle, arabicDescription,
  ]);

  return null;
}

/* ────────────── Schema builder helpers ────────────── */

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    provider: {
      "@type": "Organization",
      name: "Digital Penta",
      url: "https://digitalpenta.com",
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "Bahrain" },
    ],
    serviceType: opts.serviceType ?? opts.name,
    url: opts.url,
  };
}

export function localBusinessSchema(data: {
  city: string;
  countryCode: string;
  url: string;
  phone: string;
  email: string;
  streetAddress: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Digital Penta — ${data.city}`,
    description: data.description,
    url: data.url,
    telephone: data.phone,
    email: data.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.streetAddress,
      addressLocality: data.city,
      postalCode: data.postalCode,
      addressCountry: data.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "87",
    },
    priceRange: "₹₹-₹₹₹₹",
  };
}

/* ────────────── Phase 7: rich-snippet schema helpers ────────────── */

const SOCIAL_PROFILES = [
  "https://www.linkedin.com/company/digitalpenta",
  "https://www.instagram.com/digitalpenta",
  "https://twitter.com/digitalpenta",
  "https://www.youtube.com/@digitalpenta",
  "https://facebook.com/digitalpenta",
];

/**
 * Author Person schema for blog articles. Provides E-E-A-T signals to Google
 * by linking author name + role + publisher relationship.
 */
export function personSchema(opts: {
  name: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    jobTitle: opts.jobTitle,
    url: opts.url ?? "https://digitalpenta.com/about",
    worksFor: {
      "@type": "Organization",
      name: "Digital Penta",
      url: "https://digitalpenta.com",
    },
    sameAs: opts.sameAs,
  };
}

/**
 * Reusable Organization block with sameAs social profiles + aggregateRating.
 * Use on inner pages (About, Contact, Portfolio) to reinforce brand entity.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://digitalpenta.com/#organization",
    name: "Digital Penta",
    url: "https://digitalpenta.com",
    logo: "https://digitalpenta.com/logo.png",
    description:
      "Digital Penta is India's integrated digital marketing agency offering SEO, Google Ads, social media, web development, AI solutions and automation across India and the Middle East.",
    foundingDate: "2019",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-88601-00039",
      email: "support@digitalpenta.com",
      contactType: "sales",
      areaServed: ["IN", "AE", "SA", "QA", "BH"],
      availableLanguage: ["English", "Hindi", "Arabic"],
    },
    sameAs: SOCIAL_PROFILES,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "87",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * Individual customer review schema. Pair with aggregateRatingSchema or embed
 * inside a Product/Service block to win star ratings in SERPs.
 *
 * Google requires reviews to be tied to a real product/service entity and
 * include name, ratingValue, reviewBody, datePublished, and author.
 */
export interface CustomerReview {
  author: string;
  rating: number;          // 1-5
  body: string;
  datePublished: string;   // ISO 8601 e.g. "2025-09-12"
  location?: string;
}

export function reviewedItemSchema(opts: {
  itemName: string;
  itemUrl: string;
  itemType?: "Service" | "Product" | "LocalBusiness" | "Organization";
  description?: string;
  reviews: CustomerReview[];
  ratingValue?: string;
  reviewCount?: string;
}) {
  const itemType = opts.itemType ?? "Service";
  const block: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": itemType,
    name: opts.itemName,
    url: opts.itemUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: opts.ratingValue ?? "4.9",
      reviewCount: opts.reviewCount ?? String(opts.reviews.length),
      bestRating: "5",
      worstRating: "1",
    },
    review: opts.reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: r.body,
      datePublished: r.datePublished,
    })),
  };
  if (itemType === "Service") {
    block.provider = {
      "@type": "Organization",
      name: "Digital Penta",
      url: "https://digitalpenta.com",
    };
  }
  if (opts.description) block.description = opts.description;
  return block;
}

/**
 * Aggregate review schema standalone — useful for service / location pages
 * where you want to surface the rating without re-declaring the org block.
 */
export function aggregateRatingSchema(opts: {
  itemName: string;
  itemUrl: string;
  ratingValue?: string;
  reviewCount?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@type": "Service", name: opts.itemName, url: opts.itemUrl },
    ratingValue: opts.ratingValue ?? "4.9",
    reviewCount: opts.reviewCount ?? "87",
    bestRating: "5",
    worstRating: "1",
  };
}
