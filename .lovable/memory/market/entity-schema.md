---
name: entity-schema
description: CEO Person schema (Harish Kumar), GMB-aligned LocalBusiness/ProfessionalService/MarketingAgency schema, and city-level Service+areaServed pattern
type: feature
---

# Entity SEO — knowledge-panel + GMB alignment

Goal: help Google/Bing/Perplexity resolve **Digital Penta** as one entity across
the website, GMB profile, and the founder Harish Kumar — for organic + GPO + AEO
ranking.

## Schema layers in `index.html` (sitewide)
1. **Organization** with `@id=#organization`, `founder` → `#harish-kumar`, sameAs socials.
2. **Person (CEO)** with `@id=#harish-kumar`, jobTitle, worksFor → `#organization`, knowsAbout, sameAs (LinkedIn/Twitter).
3. **LocalBusiness + ProfessionalService + MarketingAgency** union type with `@id=#localbusiness`, hasMap (GMB coordinates), openingHoursSpecification (weekday + Saturday), currenciesAccepted (INR/USD/AED/SAR/QAR/BHD), paymentAccepted, hasOfferCatalog listing the 7 service offers, parentOrganization → `#organization`, founder → `#harish-kumar`.
4. **FAQPage** — homepage FAQ.
5. **WebSite + SearchAction** — sitewide search.

## Helpers in `src/components/seo/SEOHead.tsx`
- `organizationSchema()` — reusable Org block
- `ceoPersonSchema()` — Harish Kumar Person
- `gmbBusinessSchema()` — GMB-aligned LocalBusiness (used on About)
- `serviceWithAreaSchema()` — Service + areaServed City for every city/matrix page

## Rules
- Every city matrix page (`/:service/:city`) MUST inject `serviceWithAreaSchema` alongside `serviceSchema` + breadcrumbs + FAQ + aggregateRating.
- Never duplicate LocalBusiness inside per-page schemas array; homepage + About own it.
- Founder Person schema stays sitewide from `index.html` — do not re-inject from per-page SEOHead calls.
- Coordinates for HQ: `28.5391, 77.1957` (Katwaria Sarai). Do not change without confirming GMB match.
