

# Foundation + SEO Audit Tool (Round 1 of 5)

You picked **Foundation + 1 system fully**, and the highest-ROI first system is the **public SEO Audit tool** — it's visitor-facing (drives leads), uses free APIs, and exercises the foundation we'll lay for the other 4 systems.

This round delivers: shared dashboard foundation (DB schema, navigation shell, role guards, design tokens) + a complete public SEO Audit product (visitor input → Lighthouse + AI analysis → branded PDF report → captured lead in CRM).

---

## What gets built this round

### 1. Foundation (reusable by all 5 future systems)

- **Database schema** for the full agency stack (tables created now, populated by future rounds): `accounts`, `account_team_members`, `projects`, `tasks`, `time_entries`, `audits`, `audit_lighthouse_runs`, `whatsapp_templates`, `whatsapp_conversations`, `whatsapp_messages_v2`, `crm_deals`, `crm_pipeline_stages`, `crm_activities`, `notifications`, `audit_log`. RLS policies on every table using existing `has_role()` and `user_roles`.
- **Admin dashboard shell V2** — replaces current `AdminLayout.tsx` with a denser command-bar + collapsible sidebar matching marketing-site dark navy + purple. Adds: global search (⌘K), notifications dropdown wired to `notifications` table, breadcrumbs, account switcher placeholder.
- **Client dashboard shell V2** — mirrors admin shell, scoped to a single client account.
- **Shared dashboard primitives** in `src/components/dashboard/`: `DataTable`, `KpiCard`, `EmptyState`, `PageHeader`, `StatusPill`, `Drawer`, `ConfirmDialog`. Built on existing shadcn — no new design tokens.

### 2. SEO Audit Tool (public, lead-gen)

**Public flow** at `/tools/seo-audit`:
```text
URL input → "Run free audit" → loading state (live progress)
  → Lighthouse fetch (PageSpeed Insights API)
  → AI recommendations (Lovable AI Gateway, Gemini Flash)
  → Score dashboard (Performance / SEO / Accessibility / Best Practices)
  → Issues list with severity + fix instructions
  → Email-gated full report (PDF download + saved to CRM)
```

**Components:**
- `src/pages/SeoAuditTool.tsx` — public landing + audit runner
- `src/components/audit/AuditScoreRing.tsx` — animated 0-100 scores
- `src/components/audit/AuditIssueCard.tsx` — issue + AI fix
- `src/components/audit/EmailGate.tsx` — captures lead before PDF
- `src/components/audit/AuditPdfPreview.tsx` — branded report

**Edge functions:**
- `supabase/functions/run-seo-audit/index.ts` — calls PageSpeed Insights API for mobile + desktop, normalizes scores, persists to `audit_lighthouse_runs`. Public (no JWT).
- `supabase/functions/analyze-audit-ai/index.ts` — sends Lighthouse audit data to Lovable AI Gateway, returns prioritized fix recommendations as structured JSON (tool calling). Public.
- `supabase/functions/generate-audit-pdf/index.ts` — renders HTML report → PDF via Deno PDF library, uploads to `reports` bucket, returns signed URL. Email-gated (creates `contacts` + `audits` row first).

**Admin side** at `/dashboard/admin/audits`:
- Table of every audit ever run (visitor email, URL, scores, date)
- Click row → full report drawer with scores, issues, AI recommendations, "Convert to lead" button (creates CRM deal — wired in Round 4)

### 3. Integration points wired now (used by future rounds)

- Audits captured here flow into the `crm_deals` table (Round 4 builds the pipeline UI)
- Audit emails captured here populate `accounts.email` (Round 3 client dashboard reads from this)
- `notifications` table gets a row on every new audit (notification dropdown shown in shell)

### 4. SEO master plan note

The `.lovable/seo-master-plan.json` Phases 1–9 were all completed in prior rounds (verified in audit). One **new SEO surface** added this round: `/tools/seo-audit` becomes a Tier-2 keyword landing page targeting "free SEO audit tool" — added to `sitemap.xml` and `keywordLandingData.ts`.

---

## Out of scope this round (queued for next rounds)

| Round | System |
|-------|--------|
| 2 | WhatsApp Hub — UI, templates library, Meta setup wizard, webhook handler (send/receive deferred until Meta credentials supplied) |
| 3 | Client Dashboard full — campaign reports, live KPI feeds, support chat, invoice viewer, file vault |
| 4 | Admin CRM — deals pipeline (Kanban), quotation builder, invoice generator, activity timeline, lead inbox |
| 5 | Admin SaaS deep — projects/tasks, time tracking, team workload, content calendar, white-label client reports, finance/P&L views |

---

## Technical details

**DB migrations** — single migration file creating ~15 tables with full RLS. Uses existing `has_role(uuid, app_role)` security-definer function. Every table gets `created_at`, `updated_at`, `id uuid`. Foreign keys across tables, indexes on `account_id`, `created_at`, `status` columns.

**Edge function security** — `run-seo-audit` and `analyze-audit-ai` are public (visitor flow) but rate-limited via simple in-memory token bucket per IP (warned not for production-scale; can add Redis later). `generate-audit-pdf` requires email + URL params, creates contact row first.

**Free API used** — Google PageSpeed Insights API v5 (`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`). Works without API key for low volume; if rate-limited, prompt user to add `PAGESPEED_API_KEY` secret.

**AI integration** — Lovable AI Gateway, model `google/gemini-3-flash-preview`, structured output via tool calling, schema returns `{ priority, category, title, impact, fix_steps[], estimated_effort }[]`.

**PDF generation** — `jspdf` + `html2canvas` rendered server-side via Deno's DOM polyfill, or simpler: `@react-pdf/renderer` in an edge function. Branded with Digital Penta logo, score visuals, AI recommendations, CTA to book a strategy call.

**Routes added**
```text
/tools/seo-audit              public, lead capture
/dashboard/admin/audits       admin list + drawer
/dashboard/admin/audits/:id   permalink to single report
```

**Files created**: ~30 (5 pages, 12 components, 3 edge functions, 1 migration, 5 hooks/lib, sitemap update, route registration)
**Files edited**: `App.tsx`, `AdminLayout.tsx`, `Navbar.tsx` (add Tools link), `sitemap.xml`, `keywordLandingData.ts`

---

## After approval, I will

1. Run the DB migration (15 tables + RLS) — you'll see the approval prompt
2. Build the foundation shell + primitives
3. Build the 3 edge functions and test each
4. Build the public audit tool flow
5. Build the admin audits view
6. Verify with a real audit run on `digitalpenta.com` and screenshot the resulting PDF for QA

