# Roadmap — Full SEO Audit & Optimization (Oct 2026) ✅ COMPLETE

## Phase 1 — Research (evidence first)
- [x] Keyword research via Semrush (80+ keywords, India + US DBs) → `docs/seo/KEYWORD_RESEARCH_2026-10.md`
- [x] Domain snapshot: digitalpenta.lovable.app — no Semrush data yet (not indexed)
- [x] Page inventory via sub-agent: 360 public URLs, full SEO state per family

## Phase 2 — Audit findings (all fixed)
- [x] Unknown blog slugs rendered indexable placeholders → now noindex 404 view
- [x] Invalid location pages (EN + AR) had no SEO handling → now noindex + canonical to /locations
- [x] robots.txt: named bot groups bypassed wildcard Disallows → single wildcard group
- [x] Blog/Contact/About missing page-type schema → Blog, ContactPage, AboutPage nodes added
- [x] 8 blog articles thin (169–258 words) → expanded to ~700–950 words each, human style
- [x] Keyword gaps vs research → 6 new landing pages

## Phase 3 — Implementation
- [x] 6 new keyword LPs (growth-marketing-agency, pr-agency-delhi, seo-company-noida,
      branding-agency-delhi, online-reputation-management-india, email-marketing-services-india)
      with deepSections long-form content (~1,100 rendered words each)
- [x] KeywordLandingPage template: deepSections renderer added
- [x] Sitemap regenerated: 155 → 161 URLs; schema validation 26/26 passed

## Phase 4 — Verification (evidence)
- [x] tsgo clean, build OK
- [x] Playwright: new LPs render correct title/canonical/robots; blog+location 404s noindex; 0 page errors

## Phase 5 — Existing-page optimization per keyword research
- [x] Sub-service titles: "SEO Services Agency in India" → "SEO Services in India" (targets "seo services" 18.1k/mo)
- [x] Matrix SEO pages: "SEO company in {city}" variant woven into descriptions ("seo company in delhi" 3.6k/mo)

## Phase 6 — Premium graphics
- [x] 6 on-theme hero visuals generated (dark navy + purple, 75–99KB each) and wired into new LPs (desktop grid hero, eager LCP, width/height set)

## Phase 7 — Performance
- [x] Images lean (≤99KB); lazy-loading/chunking from earlier sprints intact; build OK

## Phase 8 — End-to-end QA
- [x] 18 routes × desktop + 4 × mobile 360px: 0 failures, 0 overflow, 1 H1 each, 8–14 schemas per page
- [x] LP hero image verified loading; screenshots captured
- [x] Console ref warnings traced to Lovable preview harness (click-to-edit), not app code — no app change needed

## Phase 9 — LP funnel upgrade (user feedback round)
- [x] LP template: serviceBreakdown (linked service cards), processSteps (90-day funnel), midCta, inline LpLeadForm (submit-lead pipeline, honeypot, attribution)
- [x] All 6 LPs: +1 deepSection each, service breakdown with real /services/ links, process funnel, mid-page CTA
- [x] Verified: 1,430–1,614 words/page (was ~1,100), 13 H2 sections, 12–13 internal service links, lead form fillable, hero img loads, 0 overflow desktop+360px, 0 page errors
- [x] Sitemap regenerated (161 URLs incl. all 6 LPs); robots.txt confirmed not blocking /lp/

## Standing constraints
- No publish unless asked. No fake claims/gamification; preserve confirmed real claims.
- Skip GSC/GTM/Resend/Meta setup.

## CRM Deep Investigation (24 Oct 2026)
- [x] Admin panel pages: investigate bugs, broken flows, RLS issues
- [x] Client panel: investigate bugs, broken flows, RLS issues
- [x] Backend: RLS policies, edge functions, data errors
- [x] Fix + improve all found issues
- [x] Verify build/typecheck; report
