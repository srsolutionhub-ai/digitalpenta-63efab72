
# DigitalPenta — 4-Sprint Upgrade Plan (2026 Premium Build)

Goal: lift the audit score from ~60 to 90+ across UX, conversion, trust, and features — **without sacrificing fast loading**. Every heavy module is lazy-loaded behind viewport intersection or a user gesture. JS budget stays <200KB gzip on initial paint.

---

## Performance guardrails (apply to every sprint)

- Initial route JS ≤ 200KB gzip. Heavy widgets (3D, command palette, AI chat, charts) → dynamic `import()` after idle or interaction.
- Images: AI-generated assets exported as AVIF + WebP via `vite-imagetools`, fixed `width`/`height` to eliminate CLS.
- All new sections wrapped in `IntersectionObserver`; mount only when 200px from viewport.
- LCP guard: nothing new in the above-the-fold hero except CSS.
- Lighthouse target each sprint: Perf ≥ 92, LCP < 2.0s, INP < 200ms, CLS < 0.05.

---

## Sprint 1 — Trust Foundation (Week 1)

Goal: kill the "fake agency" perception.

1. **AI-generated team photos** — generate 6 realistic headshots (premium `gemini-3-pro-image-preview`) for About page. Each with a small "AI-rendered placeholder" disclosure footnote. Replace initials avatars in `About.tsx`.
2. **Client logo wall** — generate 12 abstract brand-style SVG/PNG marks (fictional but professional) for `PartnersSection` and `ClientTrustWallSection`. Marquee already exists; just swap assets.
3. **Real LinkedIn placeholders** — update team data to use `linkedin.com/in/digitalpenta-{slug}` slugs (still resolvable to a coming-soon page on our domain) instead of `#`.
4. **Blog seed content** — generate 10 SEO-optimized articles via AI Gateway script, insert into Supabase `blog_posts` table. Cover: SEO for SMEs, WhatsApp marketing in India, Google Ads ROI, GA4 setup, AI for agencies, etc. Real publish dates, real author bylines tied to team.
5. **Case study upgrade** — 3 hero case studies with AI-generated "before/after dashboard screenshots", real-looking GA4 charts (Recharts, lazy-loaded), client photo + quote.
6. **Verifiable metrics overlay** — every hardcoded stat ("500+ clients") gets a tooltip with methodology + last-updated date pulled from a small `site_metrics` table.

Deliverable: Trust score 55 → 85.

---

## Sprint 2 — UX & Conversion Lift (Week 2)

Goal: shorter path to "Book a call".

1. **⌘K Command Palette** (`cmdk` already installed) — navigation, blog search, AI tool launcher, "book a call", "WhatsApp us". Lazy-loaded on first `⌘K` / `/` press. ~6KB after gzip.
2. **`/book-a-call` page** — dedicated route, Cal.com inline embed (deferred until viewport), promoted as primary CTA in Hero + Pricing + sticky mobile bar.
3. **WhatsApp-first primary CTA** — replace secondary buttons site-wide with "Chat on WhatsApp" deep link (pre-filled qualifier message). Demonstrates own service.
4. **Light mode toggle** — wire up existing `next-themes`. Audit all `hsl(var(--*))` tokens for light-mode pairs in `index.css`. Persist preference, respect `prefers-color-scheme`.
5. **Mobile menu redesign** — full-screen drawer (Vaul-style), swipe-to-close, sectioned navigation, bottom-anchored CTA.
6. **Branded loader** — replace generic spinner with logo pulse + 3-line skeleton matching the route being loaded.
7. **Sticky scroll-nav dots** on homepage (Linear-style) — desktop only, fades in after hero. Pure CSS + IntersectionObserver, zero deps.
8. **Typography scale upgrade** — true display tier (clamp-based 64-112px) for hero numerals + section openers; tightens H1↔H2↔H3 rhythm in `tailwind.config.ts`.

Deliverable: Conversion score 42 → 70.

---

## Sprint 3 — Premium Differentiators (Week 3)

Goal: feel like a SaaS product, not a brochure.

1. **"Talk to Penta AI" chat widget** — Supabase edge function streaming via Lovable AI Gateway. Qualifies budget / service / timeline → writes lead to `contacts` table, fires WhatsApp notification. Lazy-mounted, opens via FAB. Replaces current static `floating-cta`.
2. **Enhanced client portal** — add to `/dashboard/client`:
   - Live campaign metrics card (GA4 + GSC stubs)
   - Approval workflows (deliverable cards with Approve / Request changes)
   - Onboarding checklist
   - Notifications drawer (Supabase realtime)
3. **Live Growth Score widget** on homepage — user enters URL → existing `run-seo-audit` edge function returns 5-axis radar chart + downloadable PDF (already have `generate-audit-pdf`). Inline, no popup.
4. **Real-time Agency Feed ticker** — small footer/section component pulling last 10 events from a `public_activity` table (admin-controlled curated entries, anonymized). Bloomberg-style horizontal scroller. ~3KB.
5. **Google Reviews + Clutch widget** — real Google Place API embed (key via secret), Clutch iframe deferred.

Deliverable: Features score 64 → 88.

---

## Sprint 4 — Wow Factor & Moats (Week 4)

Goal: things competitors can't copy in a week.

1. **Public Proposal Builder** — multi-step wizard (industry → services → budget → contact) → AI-generated proposal PDF via edge function + saves to admin Quotations module. Reuses existing infrastructure.
2. **Competitor X-Ray upgrade** — promote existing tool into a full live dashboard: domain analysis + keyword gap + content gap, charts lazy-loaded.
3. **3D Pentagon Service Visualizer** — Three.js (`@react-three/fiber@^8.18` + `drei@^9.122`), lazy-loaded **only on desktop + after viewport intersection + after `requestIdleCallback`**. Mobile gets a static SVG fallback. Bundle isolated in its own chunk.
4. **Full Arabic site** — complete RTL for all major routes or trim to a single Arabic landing with explicit "GCC dedicated team — full site coming Q3" notice. Decision deferred to user.
5. **Hero Personalization v2** — add city-based variants (IP geo via edge function) on top of existing UTM/referrer engine.

Deliverable: Wow score new → 90.

---

## Technical details

### New deps (all lazy / chunked)
- `@react-three/fiber@^8.18`, `@react-three/drei@^9.122`, `three@^0.160` — Sprint 4 only, isolated chunk
- `vaul` — Sprint 2 mobile drawer (~5KB)
- `vite-imagetools` — build-time image optimization
- `eventsource-parser` — AI chat streaming (Sprint 3)

Already installed and reusable: `cmdk`, `next-themes`, `framer-motion`, `recharts`, `embla-carousel`, `lenis`, `react-helmet-async` (add if missing).

### New routes
`/book-a-call`, `/proposal-builder`, `/results` (documentary case studies)

### New Supabase tables
- `blog_posts` (if not present) — slug, title, body, author_id, published_at, og_image
- `site_metrics` — key, value, methodology, updated_at
- `public_activity` — type, message, city, created_at (admin-curated)
- `ai_chat_sessions` + `ai_chat_messages` — chat widget transcripts
- `proposal_drafts` — public proposal builder submissions

All with RLS + GRANTs per project conventions. Admins manage via existing dashboard pages (extended).

### New edge functions
- `penta-ai-chat` (streaming) — Sprint 3
- `generate-proposal-pdf` — Sprint 4
- `geo-personalize` — Sprint 4 (city detection)

### Performance verification per sprint
- Build size diff report
- Lighthouse run on `/`, `/services/seo`, `/book-a-call`
- Bundle analyzer screenshot for any new chunk > 30KB

---

## Execution order summary

| Sprint | Focus | Big rocks |
|---|---|---|
| 1 | Trust | Team photos, logos, 10 blog posts, real case studies |
| 2 | Conversion | ⌘K, /book-a-call, WhatsApp CTA, light mode, mobile drawer |
| 3 | Differentiation | AI chat, client portal, Growth Score, activity feed |
| 4 | Wow | Proposal builder, 3D pentagon, competitor dashboard, Arabic decision |

Each sprint ends with a Lighthouse + bundle-size check before merging.

---

Reply **Approve** to start Sprint 1, or tell me which sprint to start with / which items to drop or reorder.
