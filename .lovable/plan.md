# Sprint 5 — Polish, Voice, SEO Fixes, Auth Recovery

Six tracks, sequenced so blocking issues (auth, overlay collisions) land first, then SEO/GSC fixes, then nice-to-haves and ElevenLabs.

---

## Track 1 — Auth recovery for super admin (BLOCKER, ship first)

**Problem:** `srsolutionhub@gmail.com` (uid `9c8cb5e5-13f4-41b0-b104-3c3cd3ac4357`) cannot log in to admin/client dashboards. Reset-password flow also unverified.

**Plan:**

1. Run diagnostic SQL: confirm the user exists in `auth.users`, has a row in `public.user_roles` with role `admin`, and `email_confirmed_at` is set. Check `profiles` row exists.
2. If role missing → insert `('9c8cb5e5-...', 'admin')` into `user_roles`.
3. If email unconfirmed → confirm via SQL update on `auth.users.email_confirmed_at`.
4. Inspect `ProtectedRoute.tsx` + `useAuth.ts` for the `get_user_role` RPC return path; verify it doesn't 401 on the role lookup (common bug: RPC not granted to `authenticated`).
5. Trigger a server-side password reset link, then verify `/reset-password` page handles `type=recovery` hash and calls `supabase.auth.updateUser({ password })`. Add the page if missing or broken.
6. Smoke-test: login → redirect to `/dashboard` (admin) or `/client` (client) based on role.

---

## Track 2 — Overlay collision fix (UI blocker shown in screenshot)

**Problem:** Bottom of viewport stacks 3–4 floating elements (WhatsApp float, exit-intent, lead-capture bar, smart-CTA, Penta AI chat launcher, mobile sticky CTA) which overlap as shown in the attached screenshot.

**Plan:**

1. Audit overlay components: `whatsapp-float`, `floating-cta`, `exit-intent-popup`, `lead-capture-bar`, `mobile-sticky-bar`, `smart-cta`, `urgency-strip`, `announce-bar`, `PentaAiChat`.
2. Centralize through existing `useOverlaySlot` / `overlayOrchestrator` — enforce a single overlay per slot (bottom-right, bottom-center, bottom-left) with priority order:
  - Bottom-right: Penta AI chat (highest)
  - Bottom-center (mobile only): sticky CTA bar
  - Bottom-left: WhatsApp float (suppressed if chat is open)
3. Remove redundant duplicates: `lead-capture-bar` + `smart-cta` + `floating-cta` doing similar jobs → keep one ("Free Website Audit" bar) and delete unused ones from `App.tsx`/`Layout.tsx`.
4. Add z-index scale tokens in `index.css` (z-overlay-low/mid/high) so stacking is deterministic.
5. Verify on mobile + desktop preview.

---

## Track 3 — SEO/GSC audit & city-page fixes

**Problem:** Location pages exist but not surfacing on SERP; need GSC health check.

**Plan:**

1. **GSC audit via connector gateway:**
  - Sites list, sitemap status, coverage (indexed vs excluded), top URLs by impressions, Core Web Vitals report, mobile usability.
  - URL Inspection API on 5–10 city pages to see indexation status & last-crawl.
2. **Trigger Lovable SEO review** (`seo_chat--trigger_scan`) and read findings.
3. **Semrush** competitive_analysis + top_pages for digitalpenta.com to confirm which queries we already rank for and identify city-keyword gaps.
4. **Fix likely causes for city pages not ranking:**
  - Add `LocalBusiness` + `Service` JSON-LD with `areaServed` per city.
  - Unique H1, title (`<60c`), meta (`<160c`) per city — audit `LocationPage.tsx` to ensure they're not templated identically.
  - Internal linking: add city links from footer, `/sitemap` page, and a "Service Areas" grid on relevant service pages.
  - Add breadcrumb schema on all city + service pages.
  - Regenerate `public/sitemap.xml` with all city URLs + correct lastmod, resubmit via GSC API.
  - Ensure each city page has a canonical pointing to itself.
5. Fix any failing findings from the SEO scan (title/desc/og/canonical/h1).

---

## Track 4 — ElevenLabs voice layer (customer-experience upgrade)

ElevenLabs key is connected. Pick high-ROI surfaces, not gimmicks. Performance-gated (lazy + on-demand).

**Plan — three additions:**

1. **Voice intro on Penta AI chat** — TTS the agent's first reply (and any reply on a "speaker" toggle) via `eleven_turbo_v2_5` streaming. Keeps text default; voice is opt-in (mute by default to protect autoplay policies & perf budget).
2. **Voice-narrated audit report** — on the Website Audit results screen, a "Listen to your report" button TTSes the top 3 issues + recommendation (~30s). Drives engagement, captures leads who skim.
3. **Voice "Talk to Penta" widget on Book-a-Call page** — `useConversation` (WebRTC) with a Conversational Agent persona, so prospects can speak with an AI consultant before booking. Mic permission gated behind explicit user click. Server token endpoint via edge function `elevenlabs-token`.

All audio components `lazy()`-loaded; bundle stays under budget. Edge functions: `elevenlabs-tts` (batch + stream), `elevenlabs-token` (Convai WebRTC token). Standard connector — read `ELEVENLABS_API_KEY` from env.

---

## Track 5 — Nice-to-haves

1. **Light-mode toggle (deferred items resolved):**
  - Add `next-themes`-style provider over existing tokens.
  - Audit `index.css` — most colors are HSL tokens already; add `.light` overrides for `--background`, `--foreground`, `--card`, `--border`, `--muted`, `--primary-foreground`. Surfaces using raw `bg-black`/`text-white` get a sweep replaced with `bg-background`/`text-foreground`.
  - Toggle in navbar (sun/moon), persisted in localStorage, default = dark.
2. **3D Pentagon Visualizer:** lightweight CSS-3D (transform: rotateY) — NOT three.js — to stay in perf budget. Renders the 5 service pillars as faces of a slowly auto-rotating pentagon on the hero or About page. Pauses on `prefers-reduced-motion`.
3. **Hero personalization A/B telemetry dashboard:** new admin route `/dashboard/admin/experiments` reading from `hero_variant_events` (add table if missing). Charts: variant exposure, CTA CTR, lead conversion per variant. Lazy `recharts`.

---

## Track 6 — QA & health check

- Run build + lint.
- Smoke-test all 6 tracks in preview.
- Re-run SEO scan and security scan.
- Final health report + remaining backlog.

---

## Technical notes

- **DB migrations:** `hero_variant_events` table (+ GRANTs + RLS), confirm `user_roles` row for super admin.
- **Edge functions:** `elevenlabs-tts`, `elevenlabs-token`.
- **No new heavy deps:** ElevenLabs uses fetch directly; `@elevenlabs/react` only on Book-a-Call (lazy).
- **Perf budget preserved:** all new widgets lazy + suspense, no top-level imports of recharts/three/elevenlabs SDKs.

---

## Execution order

1. Track 1 (auth) → 2. Track 2 (overlays) → 3. Track 3 (SEO/GSC + city pages) → 4. Track 4 (ElevenLabs) → 5. Track 5 (nice-to-haves) → 6. Track 6 (QA).

Confirm and I'll start and do not stop untill all task is finished. after finished all track 1 to track 6 do think all code is working fine then give me provide a short summery.