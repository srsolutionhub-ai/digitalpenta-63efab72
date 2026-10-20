# Roadmap — Sprint 9 (Agency CRM)

- [x] CRM core: Contacts, contact profile + timeline, notes, Tasks
- [x] Tracking integrations page + consent-gated tag loading
- [x] WhatsApp auto-replies, delivery receipts, inbox upgrade, templates sync, broadcasts
- [x] Visitor journey per contact + Audience analytics page
- [x] Email sequences with open/click tracking, auto-enroll on lead submit
- [x] Client portal: projects, approvals, reports; staff Client Deliverables page
- [x] Admin home real KPIs, global search (Ctrl/Cmd+K), Team & Roles
- [x] Scheduled sequence sending (hourly)
- [x] Unsubscribe link + one-click unsubscribe + suppression
- [x] Security pass: search filter escaping, safe links, webhook replay guard, broadcast limits, approval lock, staff-only rules
- [x] Refine WhatsApp/voice controls and verify idle/live Lottie animations across devices
- [x] Improve metadata across every public, indexable page family for stronger SERP CTR
- [x] Reconcile robots.txt and generated sitemap with current public routes

## CRM audit fix plan (2026-10-20) — user approved all steps
- [ ] Step 1 quick fixes: deal edit form empty; client position blank; forgot-password false success; leads export only 50; client notifications not clickable; login stuck on access failure; Companies + WhatsApp Setup missing from menu
- [ ] Step 2: page access by role (Finance→Billing/Invoices; Content Writer→Blog; SEO Specialist→SEO pages; super_admin/account_manager→all)
- [ ] Step 3: clients see invoices/support by company; invite-client flow from admin
- [ ] Step 4: connect lead→deal→quotation→project (convert button, links)
- [ ] Step 5: pagination for long lists; company-lookup caching; client file upload; invoice download; support status
- Blocked: WHATSAPP_ACCESS_TOKEN from Meta; GTM/Pixel IDs on hold per user; signed-in QA needs user sign-in (external Supabase)
