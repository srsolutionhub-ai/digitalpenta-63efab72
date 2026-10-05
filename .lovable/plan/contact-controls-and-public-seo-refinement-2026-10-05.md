# Contact Controls and Public SEO Refinement

## Outcome
- WhatsApp and voice controls will use correct brand visuals, balanced spacing, and reliable idle/live animation states across screen sizes.
- Every public, indexable page family will receive clearer search titles and descriptions aimed at qualified clicks without invented claims.
- `robots.txt` and the existing generated sitemap will accurately reflect public routes and indexing intent.

## Implementation
1. **Floating contact controls**
   - Replace generic message bubbles with the official WhatsApp mark in desktop and mobile controls.
   - Align desktop controls to one shared rail with equal sizing and spacing; keep mobile voice access clear of the sticky action bar.
   - Repair Lottie rendering by validating embedded assets, sizing/view boxes, and active/idle state transitions; retain lazy loading for page speed.
   - Make the voice panel use the idle animation before a call and the waveform while connecting, listening, or speaking.

2. **Public-page search metadata**
   - Inventory static, service, sub-service, industry, location, city/service, keyword, blog, tool, legal, and utility page metadata.
   - Improve titles around the page’s primary search intent, location where relevant, and Digital Penta branding; keep titles concise and distinct.
   - Rewrite descriptions with specific services, verified proof, regional relevance, and a natural next step; avoid duplication and unsupported promises.
   - Mark account, submission-confirmation, unsubscribe, and other non-search utility states appropriately rather than trying to rank them.
   - Keep canonical and social metadata self-referencing through the existing page metadata system.

3. **Crawler files**
   - Refine the existing `robots.txt` without replacing its crawler-specific policy.
   - Update the existing sitemap generator, preserving its mechanism and omitting false build-time `lastmod` values.
   - Ensure all indexable public routes are included once, while auth, dashboard, redirect, confirmation, invalid, and canonicalized intent routes remain excluded.
   - Regenerate `public/sitemap.xml` from the source-of-truth generator.

4. **Verification**
   - Check desktop and mobile control placement visually and confirm both Lottie states render.
   - Validate title/description lengths and duplicates across generated public pages.
   - Run sitemap, schema, SEO, and focused type/test checks, then confirm the preview has no new build or runtime errors.

## Technical details
- Keep Vite/React client-side route metadata behavior unchanged; `index.html` remains the static homepage/social fallback.
- Preserve the existing generator-based sitemap architecture and the established `https://digitalpenta.com` canonical domain.
- This updates the preview source only; the live URL changes after the next publish.