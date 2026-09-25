# Sprint 9 — Admin panel, Client portal and Agency CRM (with WhatsApp + Email)

Rule for the whole sprint: no fake numbers. Every chart, count and list reads real saved data; empty states say "No data yet" instead of sample figures.

## Current state (audit summary)
- Admin panel has 21 pages: Home, Leads, CRM Pipeline, Audits, Bookings, Quotations, Invoices, Billing, Projects, Time Tracking, Tool Runs, SEO Rank Tracker, Funnel Analytics, Blog, Newsletter, Email Log, WhatsApp Hub + Setup, Voice Studio, Settings.
- Client portal has 5 pages: Home, Invoices, Support, Files, Knowledge base.
- Gaps: no single contact/company record joining leads, visits, emails, WhatsApp and deals; visitor tracking is saved but not shown per person; no tasks/reminders tied to leads; no email sequences; WhatsApp has sending + webhook but no inbox rules, chatbot, templates approval view or delivery analytics; client portal has no reports, projects, approvals or messaging with the assigned manager; no role-based page access check on every admin page.

## How the work is split (parallel agents)
1. Lead auditor (me): reference research on agency CRMs and WhatsApp Cloud API CRMs, gap list, final checks.
2. CRM core agent: contacts, companies, deals, tasks, activity timeline.
3. Tracking agent: visitor journey, page visits per lead, source/UTM, add-on slots for GA4, Tag Manager and Meta Pixel.
4. Email marketing agent: segments, campaigns, sequences, open/click tracking, unsubscribe.
5. WhatsApp agent: shared inbox, templates, broadcasts, own chatbot/auto-replies, delivery analytics.
6. Client portal agent: projects, reports, approvals, messages, files, invoices.
7. QA agent: signs in as admin and as client, opens every page, checks for errors and real data.

## What gets built

### 1. CRM (admin)
- Contacts and Companies lists with search, filters, owner, tags, lifecycle stage (subscriber, lead, qualified, customer, lost).
- Contact profile: timeline of every page visit, form, audit, tool run, email, WhatsApp message, booking, deal and note.
- Deals board (existing pipeline upgraded): drag between stages, value, expected close, won/lost reason.
- Tasks and reminders: due today / overdue view, linked to contact or deal.
- Automatic linking: a form submission joins the visitor's earlier anonymous visits to the new contact.
- Lead routing: assign by service and city; notification to the owner.

### 2. Audience tracking
- Visitor journey page: sessions, pages viewed, time, source, device, city (from existing tracking, consent-respecting).
- Page performance: which pages bring leads, per city and service page.
- Integrations page with add-on slots for GA4, Tag Manager and Meta Pixel IDs — stored, turned on only after consent; shows "Not connected" until you add IDs (these stay on hold as you asked).

### 3. Email marketing
- Segments built from CRM filters (stage, service, city, source, tags).
- Campaigns (existing newsletter upgraded) and automated sequences (e.g. after audit: day 0, 3, 7).
- Real open/click/unsubscribe tracking; stats only from actual sends.

### 4. WhatsApp (Meta Cloud API, no BSP)
- Shared inbox: conversations, assign to team member, status, notes, 24-hour window indicator.
- Templates page with Meta approval status; broadcast to a segment using approved templates only.
- Own chatbot: keyword and menu rules (e.g. "1 = SEO pricing"), business-hours auto-reply, hand-over to a human, lead capture into CRM.
- Analytics built from real delivery webhooks: sent, delivered, read, replied, failed.
- Works once you add your Meta access token; until then pages show a setup screen.

### 5. Admin panel upgrade
- Home: real KPIs only (new leads, open deals value, tasks due, unread WhatsApp, emails sent).
- Consistent sidebar grouped as CRM, Marketing, Delivery, Finance, Content, Settings.
- Team and roles page; each page checks the user's role.
- Global search (contacts, deals, invoices).

### 6. Client portal upgrade
- Home: their projects, tasks in progress, latest report, open invoices.
- Projects & deliverables with approval buttons; monthly reports; message thread with their account manager; files; invoices; knowledge base.
- Clients see only their own company's data.

### 7. Verification
- Sign in as admin and as a client; open every page on desktop and phone; zero errors, no sample numbers.

## Technical details
- New tables: crm_contacts, crm_companies, crm_tasks, crm_notes, crm_activity (timeline), email_sequences, email_sequence_steps, email_sequence_enrollments, wa_bot_rules, wa_broadcasts, integration_settings, client_approvals, client_reports. Reuse accounts, crm_deals, leads, visitor_*, whatsapp_*, newsletter_*.
- Every table: GRANTs, RLS by has_role for staff, account_team_members / client mapping for clients.
- submit-lead and track-visitor write crm_activity; whatsapp-webhook writes delivery statuses and runs bot rules; new email-track function for opens/clicks; sequence runner via scheduled job.
- Lazy-loaded admin pages to keep the public site fast; shared DataTable, filters and empty-state components.
- Meta token added as a secret when you are ready; GTM/Pixel IDs stay on hold.

## Built in this order
1 CRM core → 2 tracking → 6 client portal → 5 admin polish → 3 email → 4 WhatsApp → 7 full QA.
