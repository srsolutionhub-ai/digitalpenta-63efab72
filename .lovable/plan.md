# Sprint 7 — Voice, Email Ops, Schema CI

## 1. Fix ElevenLabs playback on the live site

The `elevenlabs-tts` edge function works, but `VoicePlayerButton` is **not mounted anywhere**. Also `supabase.functions.invoke()` parses `audio/mpeg` responses inconsistently across SDK versions. Fixes:

- Rewrite `VoicePlayerButton` to `fetch()` the function URL directly (bearer = anon key), read `.blob()`, and play. Falls back cleanly on 429/quota.
- Mount `<VoicePlayerButton>` on:
  - **Hero** (`HeroSection`) — "Listen to intro" pill under headline (30-sec crafted narration).
  - **Service category page** (`ServiceCategory`) — "Hear this service" chip near intro copy.
  - **Sub-service page** (`SubServicePage`) — same pattern.
  - **Blog article** (`BlogArticle`) — "Listen to this article" (first 1200 chars).
- Add a shared `getNarration(topic)` helper so pages pass real body text, not placeholders.

## 2. Admin Voice Studio (`/dashboard/admin/voice-studio`)

New page + sidebar entry under Studio group.

- **Voice library**: lists cloned + preset voices via ElevenLabs `/v1/voices`.
- **Preview**: text box + voice selector + preview player using existing TTS function.
- **Clone new voice**: file upload (mp3/wav ≤ 10MB), name + description → POST `/v1/voices/add`.
- **Enable/disable**: toggles a `voice_settings` table (voice_id, label, enabled_for_site, is_default). Only `enabled_for_site` voices show up on public pages.
- New edge function `elevenlabs-voices` handles list/clone/delete (admin-only, verify JWT + role).

## 3. Admin Email Log Viewer (`/dashboard/admin/email-log`)

Table view over `email_send_log`:
- Filters: template (dropdown), status (sent/failed), date range.
- Columns: sent_at, template, to_email, subject, status, resend_id, error preview.
- Row click → drawer with full error + template data JSON.
- CSV export via existing `exporters.ts`.

## 4. Newsletter Broadcast Composer (`/dashboard/admin/newsletter`)

- **Compose**: subject, HTML body (textarea + live iframe preview), audience selector (all confirmed subscribers / by tag).
- **Test send**: input email → sends to that address only via `send-email` (uses new `newsletter_broadcast` template).
- **Send**: confirms count, enqueues via new edge function `newsletter-broadcast` which iterates subscribers in batches of 50 and calls `send-email` per row, logs to `email_send_log`.
- New `newsletter_campaigns` table (subject, body_html, audience_filter, status, sent_count, created_by).

## 5. Schema Validation CI (`scripts/validate-schema.mjs`)

- Renders key pages (Home, About, `/services/seo`, `/locations/gurgaon`, `/seo/mumbai`) via Vite build's static HTML OR by importing `SEOHead` helpers directly.
- Uses `schema-dts` types + a small JSON-LD validator (custom checks: `@context`, `@type`, required fields for Organization/LocalBusiness/Service, ID resolution).
- Wired into `package.json` as `"validate:schema"` and called in a new `"prebuild"` script → fails build on missing/invalid schema.

## Technical details

**Files created**
- `src/pages/dashboard/admin/VoiceStudio.tsx`
- `src/pages/dashboard/admin/EmailLog.tsx`
- `src/pages/dashboard/admin/NewsletterComposer.tsx`
- `src/lib/narration.ts` (page → narration text mapping)
- `supabase/functions/elevenlabs-voices/index.ts`
- `supabase/functions/newsletter-broadcast/index.ts`
- `scripts/validate-schema.mjs`
- Migration: `voice_settings`, `newsletter_campaigns` tables + newsletter_broadcast template in `templates.ts`

**Files edited**
- `src/components/voice/VoicePlayerButton.tsx` (direct fetch, blob playback, error toast)
- `src/components/sections/HeroSection.tsx`, `ServiceCategory.tsx`, `SubServicePage.tsx`, `BlogArticle.tsx` (mount voice button)
- `src/pages/dashboard/admin/AdminLayout.tsx` (nav entries)
- `src/App.tsx` (routes)
- `supabase/functions/send-email/templates.ts` (add `newsletter_broadcast`)
- `supabase/config.toml` (register new functions)
- `package.json` (prebuild hook)

**Auth**: voice-studio + email-log + newsletter routes gated by `ADMIN_ROLES` (already existing ProtectedRoute). Edge functions verify JWT + `has_role('super_admin' | 'content_writer')`.

**Estimated scope**: ~15 files, 1 migration, 2 new edge functions.

Confirm and I'll build it end-to-end.