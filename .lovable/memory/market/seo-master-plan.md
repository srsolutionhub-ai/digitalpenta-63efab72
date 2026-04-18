---
name: seo-master-plan
description: Comprehensive SEO master plan v2.0 — keyword tiers, title/meta formulas, schema requirements, hreflang strategy, content plan
type: reference
---

# Digital Penta SEO Master Plan v2.0

Full plan saved at `.lovable/seo-master-plan.json`.

## Title formulas (apply on every page)
- **Homepage**: `Digital Penta | Digital Marketing Agency in Delhi | 2026 — Get Free Audit`
- **Service category**: `{Service} Services in India | Delhi Agency | Digital Penta`
- **Sub-service**: `{Service} Agency in Delhi | Digital Penta | 2026`
- **Location**: `Best Digital Marketing Agency in {City} | Digital Penta`
- **Industry**: `Digital Marketing for {Industry} in India | Digital Penta`
- **Blog**: `{Post Title} — Digital Penta Blog`
- Max 60 chars, primary keyword in first 40 chars, brand at end with `|`.

## Meta description rules
- 150–160 chars max, include target keyword, include numeric proof + CTA.
- Every page UNIQUE.

## Schema requirements
- **Homepage**: Organization + LocalBusiness + FAQPage + WebSite (in `index.html`)
- **Service / sub-service pages**: Service + BreadcrumbList + FAQPage
- **Industry pages**: Service + BreadcrumbList + FAQPage
- **Location pages**: LocalBusiness + BreadcrumbList + FAQPage (+ hreflang for MENA)
- **Blog posts**: Article + BreadcrumbList

## Hreflang policy
- All English pages: `<link rel="alternate" hreflang="en" href="...">` and `hreflang="x-default"`.
- Indian pages: also `hreflang="en-IN"`.
- UAE/MENA location pages: `hreflang="en-AE"` (or country variant) + `hreflang="ar-AE"` (when Arabic page exists; for now point ar to the same English URL with Arabic meta titles/descriptions surfaced via `title:ar` + `description:ar` meta).

## Tier 1 priority keywords
- digital marketing agency in Delhi (8.1k)
- best digital marketing agency in Delhi (5.4k)
- digital marketing agency India (12.1k)
- SEO agency Delhi (4.4k)
- digital marketing agency Mumbai (6.6k)
- digital marketing agency Dubai (5.4k)
- Google Ads agency Delhi (2.4k)

## Internal linking
- Homepage → all 5 service category pages.
- Service category → all sub-services + 3 related industries.
- Location pages link to relevant services + nearby cities.
- Blog → contextual service / industry links.

## NAP (must be identical everywhere)
- Name: Digital Penta
- Address: 124 C Katwaria Sarai, New Delhi, Delhi 110016, India
- Phone: +91-88601-00039

## Local SEO actions (off-platform)
- GBP: Internet Marketing Service primary; respond to reviews <24h; weekly posts.
- Citations: Justdial, IndiaMart, Sulekha, Clutch, GoodFirms, Trustpilot.
- Reviews target: 100+ Google @ 4.9+, 25+ Clutch, 50+ Trustpilot.
