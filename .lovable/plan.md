# Sprint 8 — Enterprise hardening (from the 15-agent audit brief)

Most of the brief is already delivered (entity schema, city pages, speed budget, GA4 + consent, responsive layout, RLS fixes). This sprint closes the real gaps found in a fresh check, built to scale rather than patched.

## 1. Lead pipeline (CRO + Security + Automation agents)
Today every form writes straight into the leads table from the browser: no server validation, no spam protection, no scoring, no routing.
- One server entry point, `submit-lead`, used by Contact, Get Proposal, homepage widget, audit gate, newsletter.
- Strict validation (length limits, email/phone format), hidden honeypot field + minimum fill time, rate limit per IP/email (5 per hour), duplicate merge within 24h.
- AI lead scoring (0–100) + intent tag (SEO / Ads / Dev / AI / Automation) + budget band, via Lovable AI.
- Auto-routing: hot leads (70+) assigned to the right account manager, instant admin email + WhatsApp alert; everyone gets a branded confirmation email.
- Remove the public "anyone can insert" rule on leads — only the server function writes.
- Admin Leads page: score badge, intent filter, source/UTM column.

## 2. Context-specific CTAs (CRO agent)
Replace generic "Contact Us" and repeated "Get Started" with intent CTAs from one shared map: "Get Free SEO Audit", "Automate My Business", "Get Website Estimate", "Discuss My AI Project", "Improve My Rankings". Service, city and blog pages pick theirs automatically.

## 3. Schema completeness (Schema + AI search agents)
- Add `ProfessionalService`, `WebSite` with site search, `WebPage` per route.
- `SoftwareApplication` for the 7 free AI tools (big AI-search citation win).
- Extend the build-time schema check to cover these, failing the build if broken.

## 4. Tracking & attribution (Analytics agent)
- Single conversion event dictionary (lead, booking, audit request, proposal, WhatsApp, phone, email) with consistent names for GA4.
- Consent-gated loaders for Google Tag Manager, Meta Pixel and LinkedIn Insight — only fire after marketing consent; IDs added as settings, off until you supply them.
- UTM + first-touch source saved onto each lead.

## 5. Security headers (Security agent)
- Content-Security-Policy, Referrer-Policy and Permissions-Policy via page meta tags (hosting doesn't allow custom HTTP headers; HSTS is handled by hosting).
- Dependency vulnerability scan + full security scan; fix anything critical.

## 6. Accessibility pass (A11y + Mobile agents)
Automated axe scan on 12 key pages at mobile and desktop; fix contrast, missing labels, focus rings, touch targets under 44px, reduced-motion respect.

## 7. Quality gates in the build (Architect + Performance agents)
- Bundle budget check: build fails if homepage JS exceeds 200KB gzipped.
- Add schema, SEO QA and budget to one `npm run verify` command.
- Remove dead components (old AiStrategistChat etc.) and unused packages.

## Needs you (cannot be done by me)
- Verify digitalpenta.com in Search Console and fix the "drifted" domain.
- Verify the sending domain in Resend.
- Provide GTM / Meta Pixel / LinkedIn IDs if you want those live.
- Real leadership photos.

## Technical details
- New edge function `supabase/functions/submit-lead` (zod, IP hash rate-limit table `lead_rate_limits`, AI Gateway scoring with structured output, calls `send-email` + `whatsapp-send`).
- Migration: `leads` add `score int`, `intent text`, `budget_band text`, `utm jsonb`, `first_touch jsonb`, `dedupe_key text`; drop public insert policy; `lead_rate_limits` table (service_role only, with GRANTs).
- `src/lib/submitLead.ts` client helper; forms migrate to it.
- `src/data/ctaMap.ts`; `SEOHead.tsx` new schema builders; `scripts/validate-schema.mjs` new checks.
- `src/lib/marketingTags.ts` consent-gated loader; `src/lib/events.ts` event dictionary.
- CSP meta in `index.html` allowing Supabase, Cal.com, GA/GTM, ElevenLabs.
- `scripts/check-bundle-budget.mjs`, `scripts/a11y-scan.mjs` (Playwright + axe-core, dev-only).
- Every step verified with build logs, typecheck, Playwright end-to-end lead submission read back in admin.
