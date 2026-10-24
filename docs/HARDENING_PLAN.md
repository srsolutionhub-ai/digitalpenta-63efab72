# Hardening Plan — Document Numbering, Sequence Runner, Notification Endpoint

Date: 2026-10-24 · Status: approved by owner, implementing

Three deferred items, planned with enterprise risk analysis before any code change.
Research basis: SaaS billing compliance literature (gap-free numbering), Postgres
queue patterns (`FOR UPDATE SKIP LOCKED`), Supabase edge-function auth guidance.

---

## 1. Document numbering → atomic counter table

**Problem:** `generate_quote_number` / `generate_invoice_number` use
`SELECT MAX(...) + 1`. Two concurrent inserts read the same MAX → duplicate
numbers or a unique-violation crash. The `SUBSTRING` parse also silently breaks
past 999 documents per year.

**Options considered (from billing-compliance research):**

| Mechanism | Gap-free? | Verdict |
|---|---|---|
| Bare Postgres `SEQUENCE` | No — leaks numbers on rollback | Rejected (GST/tax audits expect no gaps) |
| Counter row + row lock | Yes, transactional | **Chosen** — simplest compliant option |
| Advisory lock | Yes | Rejected — no hot row here, counter row is clearer |
| External coordinator | Yes | Rejected — overkill for one database |

**Design:**
- New table `public.doc_counters (kind, year, last_value, PK(kind, year))`.
- No anon/authenticated access at all (RLS enabled, zero policies, no grants);
  only the trigger functions (SECURITY DEFINER) and service_role touch it.
- `next_doc_number(kind, year)` does `INSERT ... ON CONFLICT DO UPDATE
  last_value = last_value + 1 RETURNING last_value` — one atomic statement,
  no race, rollback-safe.
- Triggers call it instead of MAX+1. Format unchanged: `QT-2026-001`,
  `INV-2026-001`. Existing numbers untouched; counters seeded from current max.

**Risk factors & mitigation:**
- *Risk:* seed wrong → number collision. *Mitigation:* seed from the same
  MAX query the old trigger used, in the same migration.
- *Risk:* year rollover. *Mitigation:* counter is keyed by year; a new year
  row starts at 0 automatically — same behavior as before.
- *Risk:* trigger failure blocks inserts. *Mitigation:* function is trivial
  SQL, no external calls; tested post-migration with a real insert.

## 2. Sequence runner → atomic claiming

**Problem:** the runner SELECTs due enrollments, then sends. If two runs
overlap (cron + manual trigger, or a slow run crossing the next cron tick),
both SELECT the same rows → **duplicate emails to the same subscriber**.

**Design (standard Postgres job-queue pattern):**
- Add `processing_at timestamptz` to `email_sequence_enrollments` (a lease).
- New SECURITY DEFINER function `claim_due_sequence_enrollments(limit)`:
  `UPDATE ... SET processing_at = now() WHERE id IN (SELECT ... FOR UPDATE
  SKIP LOCKED) RETURNING *` — the claim and the lock are one statement, so a
  second runner physically cannot take the same rows.
- Stale-lease recovery: rows with `processing_at` older than 10 minutes are
  claimable again (a crashed run never strands an enrollment forever).
- Runner clears `processing_at` on every terminal update (sent/failed/completed).

**Risk factors & mitigation:**
- *Risk:* runner crashes mid-send → enrollment stuck. *Mitigation:* 10-minute
  lease expiry re-claims it; worst case one duplicate after a crash, same as
  today's best case.
- *Risk:* claimed rows belonging to inactive sequences. *Mitigation:* runner
  still filters by active sequence and just releases the claim.
- *Risk:* schema change breaks existing cron. *Mitigation:* column is
  nullable, additive only; cron job untouched.

## 3. send-notification → staff-authenticated, DB-derived invoice emails

**Problem:** `invoice_created` is callable by anyone on the internet with a
crafted payload — recipient, amount, and invoice number all came from the
request body. The function could be used to send spoofed "invoice" emails
from our domain to arbitrary addresses.

**Design:**
- `invoice_created` now requires a valid staff JWT (same pattern as
  sequence-runner: `auth.getUser()` + `user_roles` check for
  super_admin / account_manager / finance).
- The payload carries only `invoice_id`. The function fetches the invoice
  from the database and derives client email, name, number, total, and due
  date itself — nothing client-supplied reaches the email.
- Public types (`new_lead`, `booking_confirmed`, `abandoned_draft`) stay
  public but keep their existing DB-existence guards and per-IP rate limit.
- `Billing.tsx` updated to send `{ invoice_id }` only.

**Risk factors & mitigation:**
- *Risk:* breaking the only caller (Billing page). *Mitigation:* single call
  site, updated in the same change; failure is fire-and-forget so invoice
  creation itself never breaks.
- *Risk:* staff session expiry blocks the email. *Mitigation:* the invoice
  insert already succeeded by then; email failure only logs.

---

## Rollout order

1. Migration A (counters + trigger rewrite) — independent.
2. Migration B (lease column + claim function) + sequence-runner edit — deploy together.
3. send-notification edit + Billing.tsx edit — deploy together.
4. Verify: typecheck, build, live insert test for numbering, function deploys.

Rollback: each migration is additive or function-only; old behavior restorable
by re-deploying the previous function source. No data is deleted or renumbered.
