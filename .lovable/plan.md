# Sprint 6 — Voice, Email, SEO Hardening

Six tracks. Order minimizes rework: schema/CI first (they gate publish), then email + voice (they share edge-function patterns), then internal linking, then QA + publish.

---

## Track 1 — SEO: Service + OfferCatalog on dedicated service pages (Task C)

**Current gap:** `MatrixPage` (city × service) has `serviceWithAreaSchema` and `gmbBusinessSchema`, but the dedicated service surfaces do not:
- `src/pages/ServiceCategory.tsx` (e.g. `/services/seo`)
- `src/pages/SubServicePage.tsx` (e.g. `/services/seo/technical-seo`)
- `src/pages/KeywordLandingPage.tsx` (`/lp/:slug`)

**Plan:**
1. Extend `src/components/seo/SEOHead.tsx` with two new helpers:
   - `serviceOfferCatalogSchema({ serviceName, description, offers[] })` — emits `Service` with nested `hasOfferCatalog` → `OfferCatalog` → `itemListElement: Offer[]`.
   - Each schema uses `@id` refs: `provider: { "@id": "https://digitalpenta.com/#organization" }` and `author/founder: { "@id": "https://digitalpenta.com/#harish-kumar" }` — matching the anchor IDs already in `index.html`.
2. Add stable `@id` anchors to the sitewide graph in `index.html` (`#organization`, `#localbusiness`, `#harish-kumar`) so per-page schemas can `@id`-reference them instead of duplicating.
3. Wire the helper into `ServiceCategory.tsx`, `SubServicePage.tsx`, and `KeywordLandingPage.tsx` — pulling pricing/features from existing `matrixData` / `subServiceData` / `keywordLandingData` sources.

## Track 2 — CI schema validation (Task B)

**Plan:**
1. New script `scripts/seo-schema-check.mjs`:
   - Boots a mini SSR pass using JSDOM + Vite build output — OR simpler: crawls a static allow-list of routes via `curl http://localhost:4173` after `vite preview`.
   - For each route, extracts every `<script type="application/ld+json">` and validates:
     - Valid JSON.
     - Has `@context` + `@type`.
     - Organization / LocalBusiness / Service / Person shapes each pass a small schema (required fields per type).
     - `@id` references resolve to a node emitted elsewhere in the graph.
   - Extends the existing `scripts/seo-qa.mjs` style (exits non-zero on error).
2. Wire into `package.json` script `seo:schema` and reference from README. Because Lovable auto-builds, we won't hook it into `build` itself but expose it as a manual + CI-friendly check.

## Track 3 — Internal entity-based linking (Task D)

**Current:** `RelatedLinks.tsx` and `SeoLinkHub.tsx` exist but are generic.

**Plan:**
1. New `src/lib/entityLinks.ts` — maps entities → canonical URLs. E.g. `"SEO in Delhi" → /seo/delhi`, `"PPC in Dubai" → /ppc/dubai`, `"Harish Kumar" → /about#founder`.
2. New component `src/components/seo/EntityLinker.tsx` — takes markdown/HTML body, auto-links first occurrence of each entity keyword using semantic anchor text ("SEO agency in Delhi" not "click here").
3. Apply to:
   - `BlogArticle.tsx` — run body through EntityLinker before render.
   - `About.tsx` — add a "Where we work" grid with entity links to top 8 city matrix pages.
   - `ServiceCategory.tsx` — add a "Service areas" strip linking `/{service}/{city}` for all cities in `matrixData`.
4. Reciprocal: matrix pages already link back to service parent; verify + add if missing.

## Track 4 — Resend email system (Task 2)

Resend connector is connected → `RESEND_API_KEY` present, gateway auth via `LOVABLE_API_KEY` (both confirmed in secrets). All email flows go through edge functions using the connector gateway pattern.

**Sender identity:** `from` must be a Resend-verified domain. We'll use `Digital Penta <hello@digitalpenta.com>` and note the user must verify `digitalpenta.com` in Resend dashboard before first send. Fallback while unverified: `onboarding@resend.dev` (owner-only test).

**Email surfaces & templates (all React-Email-style HTML with Digital Penta dark-editorial branding — pentagon logo, gradient headers, Plus Jakarta Sans, purple/pink accents):**

| Trigger | Recipient | Template |
|---|---|---|
| Contact form submit (`contacts` insert) | Prospect + team | `contact-received.html` + `contact-notify-team.html` |
| Audit submitted (`audit_reports` insert) | Prospect | `audit-ready.html` (with PDF link + top 3 issues) |
| Booking confirmed | Prospect + team | `booking-confirmed.html` (with ICS attachment) |
| Quotation sent (from admin dashboard) | Client | `quotation-sent.html` |
| Invoice generated | Client | `invoice.html` (with PDF) |
| Newsletter subscribe (new table `newsletter_subscribers`) | Subscriber | `newsletter-welcome.html` |
| Weekly newsletter broadcast | All subscribers | `newsletter-issue.html` (admin composer) |

**Plan:**
1. **Edge function `send-email`** (unified): input `{ template, to, data }`, renders template server-side, calls Resend via gateway, logs to new `email_send_log` table (id, template, to, status, resend_id, error, created_at).
2. **Templates:** store as TypeScript template functions in `supabase/functions/send-email/templates/*.ts` — each exports `render(data) → { subject, html, text }`. Design system: dark navy background (`#0a0a1a`), gradient headers (purple→pink), glass card, footer with unsub link, mobile-first (600px max-width, single-column, safe fonts stack).
3. **Newsletter:**
   - Migration: `newsletter_subscribers` table (email, name, source, subscribed_at, unsubscribed_at, unsub_token). GRANTs + RLS (public insert for signup, admin select).
   - New section `src/components/sections/NewsletterSection.tsx` on homepage + blog.
   - `newsletter_issues` table + admin composer at `/dashboard/admin/newsletter` (title, body markdown, sent_at, recipient_count). Broadcast via edge function `send-newsletter` (batched to Resend, 100/sec).
   - Public unsub route `/unsubscribe?token=…`.
4. **Wire existing flows:**
   - `HomepageLeadCaptureSection.tsx`, `Contact.tsx`, `AuditLeadForm.tsx`, `BookACall.tsx`, `Quotations.tsx`, `Invoices.tsx` → call `supabase.functions.invoke("send-email", ...)`.
   - Retire legacy `resend-email` secret usage if any.
5. **Admin email logs page** at `/dashboard/admin/emails` — lists `email_send_log` with status filter.

## Track 5 — ElevenLabs voice suite (Task 1)

Current: only `elevenlabs-tts` edge function + opt-in Listen button in `PentaAiChat`. Expand to a premium 2026-era voice layer.

**Surfaces:**
1. **Voice-narrated hero intro** — hero has a "▶ Hear our pitch" ghost button that streams a 15-second brand narration (pre-generated, cached in Supabase Storage bucket `voice-cache`).
2. **Audit report voiceover** — on `SeoAuditTool` results, "🎧 Listen to your report" button TTSes top 3 issues + recommendation.
3. **Voice-cloneable strategist demo on About page** — pre-recorded Harish Kumar sample voice ("Hi, I'm Harish…") via cloned voice ID (user provides voice ID after cloning in ElevenLabs dashboard, stored in secret `ELEVENLABS_HARISH_VOICE_ID`).
4. **Full conversational agent on Book-a-Call** — `@elevenlabs/react` `useConversation` (WebRTC), lazy-loaded, mic permission gated. New edge function `elevenlabs-conv-token` mints Convai token.
5. **Voice cloning admin tool** at `/dashboard/admin/voice-studio` — upload sample → clone via `POST /v1/voices/add` → store voice_id in `voice_profiles` table. Test playback. Delete voice.
6. **Design:** Futuristic waveform visualizer using Web Audio API `AnalyserNode` → animated pentagon-shaped equalizer (matches brand pentagon). Purple→pink gradient bars. Ambient glow. All audio components lazy + suspense.

**Plan:**
1. New edge functions:
   - `elevenlabs-conv-token` — Convai WebRTC token
   - `elevenlabs-voice-clone` — proxy `POST /v1/voices/add` (admin-only, JWT-gated)
   - Extend `elevenlabs-tts` to optionally cache to Supabase Storage keyed by hash(text+voice)
2. New components:
   - `src/components/voice/PentagonWaveform.tsx` — CSS/canvas visualizer
   - `src/components/voice/VoicePlayerButton.tsx` — reusable button with waveform + loading/playing states
   - `src/components/voice/ConversationalAgent.tsx` (Book-a-Call, lazy)
   - `src/components/voice/VoiceStudio.tsx` (admin)
3. Migrations: `voice_profiles` (id, name, voice_id, kind, created_by, created_at) + storage bucket `voice-cache` (private, signed URLs).
4. Perf: all voice code behind `React.lazy` + Suspense. Homepage hero button imports only the tiny player, not the full waveform, until clicked.

## Track 6 — QA, publish, monitoring

1. Run `scripts/seo-qa.mjs` and new `scripts/seo-schema-check.mjs`.
2. Playwright smoke tests: submit contact form → email received in log; play hero voice → audio plays; book call → conv agent connects; visit `/services/seo` → OfferCatalog present.
3. `seo_chat--trigger_scan` for fresh SEO audit.
4. Security scan (`security--run_security_scan`) — new tables + edge functions must pass.
5. **Publish** via `preview_ui--publish` (Task A).
6. Post-publish: GSC Rich Results Test on `/`, `/about`, `/seo/delhi`, `/services/seo`; instruct user to resubmit sitemap.

---

## Technical Notes

- **DB migrations:** `newsletter_subscribers`, `newsletter_issues`, `email_send_log`, `voice_profiles` — each with GRANTs + RLS.
- **Edge functions:** `send-email`, `send-newsletter`, `elevenlabs-conv-token`, `elevenlabs-voice-clone`; extend `elevenlabs-tts`.
- **Storage:** private `voice-cache` bucket with 30-day signed URLs.
- **Deps:** `@elevenlabs/react` (lazy chunk only), no email library (raw HTML strings — smaller and full control).
- **Perf budget:** all voice + admin surfaces lazy-loaded. Bundle stays under 200KB gzip.
- **Secrets to confirm:** `RESEND_API_KEY`, `LOVABLE_API_KEY`, `ELEVENLABS_API_KEY` (all present). Optional `ELEVENLABS_HARISH_VOICE_ID` once cloned.

## Execution Order

Track 1 → 2 → 3 → 4 → 5 → 6. I will not stop until all tracks are done, then give a short completion summary.

Confirm to proceed.
