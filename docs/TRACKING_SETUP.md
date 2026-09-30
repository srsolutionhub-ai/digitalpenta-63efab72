# Digital Penta — Complete Tracking Setup Guide (2026 edition)

**Who this is for:** the person setting up Google Analytics 4, Google Tag Manager, Google Ads conversions, Meta Pixel + Conversions API, LinkedIn Insight Tag and UTM links for `https://digitalpenta.com`.

**How to use it:** do the parts in order, and tick each box before moving on. Parts 1–6 need no coding. Parts 7–9 are for a developer.

> Menu names in Google, Meta and LinkedIn change often. If a button has a slightly different name, look for the closest match. The **goal** of each step is written in bold so you always know what you're trying to reach.

---

## Contents

0. [Before you start (accounts, access, what the site already does)](#0-before-you-start)
1. [Cookie consent — how tags are allowed to load](#1-cookie-consent--consent-mode-v2)
2. [Google Analytics 4 (GA4)](#2-google-analytics-4-ga4)
3. [Google Tag Manager (GTM)](#3-google-tag-manager-gtm)
4. [Google Ads conversions + Enhanced Conversions](#4-google-ads-conversions--enhanced-conversions)
5. [Meta Pixel + Conversions API](#5-meta-facebook--instagram-pixel--conversions-api)
6. [LinkedIn Insight Tag + Conversions](#6-linkedin-insight-tag--conversions)
7. [UTM and ad-click URL tracking](#7-utm-and-ad-click-url-tracking)
8. [Event reference (every event the site sends)](#8-event-reference)
9. [Testing — full QA script](#9-testing--full-qa-script)
10. [Reports to build after setup](#10-reports-to-build-after-setup)
11. [Troubleshooting](#11-troubleshooting)
12. [Maintenance checklist (monthly / quarterly)](#12-maintenance-checklist)

---

## 0. Before you start

### 0.1 Accounts you need (create them with the **company** Google / Meta account, not a personal one)

| Tool | URL | Who should own it |
|---|---|---|
| Google Analytics | https://analytics.google.com | Company Google account (e.g. `support@digitalpenta.com`) |
| Google Tag Manager | https://tagmanager.google.com | Same Google account |
| Google Ads | https://ads.google.com | Same Google account |
| Google Search Console | https://search.google.com/search-console | Same Google account |
| Meta Business Manager | https://business.facebook.com | Company Meta Business portfolio |
| LinkedIn Campaign Manager | https://www.linkedin.com/campaignmanager | Company page admin |

- [ ] Every account has **at least two admins** (owner + one backup). If only one person has access and they leave, the data is lost.
- [ ] Two-step verification is on for every admin.

### 0.2 What the website already does for you (no need to add code)

| Feature | Status |
|---|---|
| Cookie banner with Accept / Reject / Customise | Built in |
| Google Consent Mode v2 defaults (everything "denied" until accepted) | Built in |
| GA4 loads only after **Analytics** consent | Built in |
| GTM, Meta Pixel, LinkedIn load only after **Marketing** consent | Built in |
| Page views on every page change (single-page app) | Built in |
| Button, phone, WhatsApp, email, scroll and form events | Built in |
| `generate_lead` fired **only after the server confirms** the enquiry was saved | Built in |
| UTM + click IDs (`gclid`, `fbclid`, etc.) remembered and saved with each lead | Built in |
| Admin page to paste tag IDs | **Admin → Settings → Integrations** (`/dashboard/admin/integrations`) |

### 0.3 Where IDs are entered

Admin dashboard → **Integrations** → for each provider: paste ID → switch **Turn on** → **Save**.
The public site picks up changes within about **5 minutes** (the list is cached).

| Provider | ID format | Example | Loads after |
|---|---|---|---|
| Google Analytics 4 | `G-` + letters/numbers | `G-AB12CD34EF` | Analytics consent |
| Google Tag Manager | `GTM-` + letters/numbers | `GTM-5XK9P2L` | Marketing consent |
| Meta Pixel | 15–16 digits | `123456789012345` | Marketing consent |
| LinkedIn Insight | 6–8 digits | `5123456` | Marketing consent |

> **Developer alternative:** build variables `VITE_GTM_ID`, `VITE_META_PIXEL_ID`, `VITE_LINKEDIN_PARTNER_ID`. If set, they win over the dashboard values.

### 0.4 One important decision — pick ONE way to run GA4

| Option | When to choose | What to do |
|---|---|---|
| **A. GA4 direct (recommended to start)** | You only need analytics + Meta/LinkedIn | Put `G-…` in Integrations. **Do not** add a GA4 tag inside GTM. |
| **B. Everything through GTM** | You'll run Google Ads, remarketing, heatmaps (Clarity/Hotjar) etc. | Leave GA4 **empty** in Integrations. Add GA4 inside GTM (Part 3). |

Doing both = every visit is counted twice.

- [ ] Decision made: **A** / **B** (write it here: ______ )

---

## 1. Cookie consent — Consent Mode v2

**Goal: tags only collect data from people who said yes, and Google still gets modelled (anonymous) data from people who said no.**

Since March 2024, Google requires Consent Mode v2 for anyone advertising to visitors in the EEA/UK, and India's DPDP Act (rules phased in from 2025) also requires clear consent. The site already sends these signals:

| Signal | Default (before choice) | After "Accept analytics" | After "Accept marketing" |
|---|---|---|---|
| `analytics_storage` | denied | granted | — |
| `ad_storage` | denied | — | granted |
| `ad_user_data` | denied | — | granted |
| `ad_personalization` | denied | — | granted |
| `functionality_storage` / `security_storage` | granted | granted | granted |

Steps:
1. Open the site in a private window. The cookie banner must appear.
2. Click **Reject** → open browser DevTools → **Network** → filter `google-analytics|facebook|licdn`. No requests should load (only a cookieless Google ping if Option B with GTM advanced mode).
3. Clear site data, reload, click **Accept all** → requests to those domains now appear.
4. In GA4 later (Part 2.9) you will see the **Consent settings** card showing "Consent signals active".

- [ ] Reject = no tracking requests
- [ ] Accept = tags load
- [ ] Privacy page (`/privacy`) lists GA4, GTM, Meta, LinkedIn as processors

---

## 2. Google Analytics 4 (GA4)

### 2.1 Create the account and property
1. Go to https://analytics.google.com → **Admin** (gear icon, bottom left) → **Create → Account**.
2. Account name: `Digital Penta`. Leave data-sharing boxes as you prefer → **Next**.
3. Property name: `digitalpenta.com — Website`. Reporting time zone: **India (GMT+5:30)**. Currency: **Indian Rupee (₹)** → **Next**.
4. Business details: industry **Business & Industrial Markets** (or Marketing/Advertising), size **Small/Medium** → **Next**.
5. Business objectives: tick **Generate leads** and **Understand web traffic** → **Create** → accept terms.

### 2.2 Create the web data stream
1. Choose platform **Web**.
2. Website URL: `https://digitalpenta.com`. Stream name: `Website`.
3. Keep **Enhanced measurement** ON → click the gear next to it and set:
   - Page views: ON → Advanced → **Page changes based on browser history events: ON** (needed — the site changes pages without full reloads).
   - Scrolls: **OFF** (the site sends its own `scroll_depth` at 25/50/75/100 %).
   - Outbound clicks: ON · Site search: ON · Video engagement: ON · File downloads: ON
   - Form interactions: **OFF** (the site sends accurate `form_submit_attempt` and `generate_lead` itself; Google's automatic one double-counts).
4. **Create stream** → copy the **Measurement ID** (`G-…`).

### 2.3 Connect to the website
- Option A: Admin → Integrations → **Google Analytics 4** → paste `G-…` → Turn on → Save.
- Option B: skip this; add it in GTM (Part 3.4).

### 2.4 Data settings (do these on day 1 — they can't be applied backwards)
1. **Admin → Data collection and modification → Data retention** → Event data retention: **14 months** → Save.
2. **Admin → Data collection → Google signals**: turn ON only if your privacy policy mentions it (needed for demographics and cross-device).
3. **Admin → Data streams → Website → Configure tag settings → Show more:**
   - **List unwanted referrals:** add `razorpay.com`, `checkout.stripe.com`, `accounts.google.com`, `l.facebook.com` is NOT needed (keep it as a source).
   - **Define internal traffic:** rule name `Office`, traffic_type `internal`, IP address = your office/home public IP(s) (find it by searching "what is my IP").
   - **Adjust session timeout:** 30 minutes (default) is fine.
4. **Admin → Data filters** → the "Internal traffic" filter → change state from *Testing* to **Active** after one week of checking.
5. **Admin → Reporting identity**: choose **Blended**.

### 2.5 Mark key events (GA4's name for conversions since 2024)
Events only appear here **after they fire at least once** — submit a test form first (Part 9), wait up to 24 h, then:
1. **Admin → Data display → Events** (or **Key events**).
2. Click the star / **Mark as key event** for:

| Event | Suggested value (₹) — optional | Counting |
|---|---|---|
| `generate_lead` | 1000 | Once per session |
| `book_call` | 2000 | Once per session |
| `request_proposal` | 2500 | Once per session |
| `request_audit` | 800 | Once per session |
| `contact_whatsapp` | 300 | Once per session |
| `contact_phone` | 300 | Once per session |

Tip: to create a key event before it has fired, use **Key events → New key event** and type the exact name.

### 2.6 Custom dimensions (so you can filter reports by these values)
**Admin → Data display → Custom definitions → Create custom dimension** — scope **Event**:

| Dimension name | Event parameter |
|---|---|
| Locale | `locale` |
| Market | `market` |
| CTA text | `cta_text` |
| CTA target | `cta_target` |
| Form ID | `form_id` |
| Service | `service` |
| Scroll percent | `percent` |

### 2.7 Link Google products
**Admin → Product links:**
1. **Google Ads links** → Link → pick your Ads account → turn on **Enable personalized advertising** and **auto-tagging** → Submit.
2. **Search Console links** → Link → choose the `digitalpenta.com` property → web stream `Website` → Submit.
3. **BigQuery links** (optional, free export) → daily export → useful for long-term history.

### 2.8 Audiences (for remarketing)
**Admin → Data display → Audiences → New audience:**
- `Engaged visitors – 30d`: session_engaged = true, membership 30 days.
- `Pricing viewers`: page_path contains `/pricing` or `/get-proposal`.
- `Leads – exclude`: event `generate_lead` (use to exclude converted people from ads).
- `Visited service page, no lead`: page_path contains `/services/` **and not** event `generate_lead`.

### 2.9 Verify
- **Reports → Realtime overview**: open the site with `?utm_source=test&utm_medium=qa`, accept cookies, click around → you appear within ~30 s with source `test`.
- **Admin → DebugView**: install the Chrome extension **Google Analytics Debugger** (or add `?gtm_debug=x` in Option B) → events stream live.
- **Admin → Data streams → Website** → a green "Receiving traffic" note, and **Consent settings** shows consent signals active.

- [ ] Realtime shows visits
- [ ] DebugView shows `page_view`, `cta_click`, `generate_lead`
- [ ] Key events marked
- [ ] Internal traffic filter active
- [ ] Ads + Search Console linked

---

## 3. Google Tag Manager (GTM)

Use GTM if you chose Option B, or need Google Ads conversion tags, remarketing, Microsoft Clarity, Hotjar, etc.

### 3.1 Create the container
1. https://tagmanager.google.com → **Create account**.
2. Account name `Digital Penta`, country **India**. Container name `digitalpenta.com`, target platform **Web** → Create → accept terms.
3. A code-snippet popup appears — **close it**. Do **not** paste the snippet into the site; the site loads GTM itself after consent.
4. Copy the container ID (`GTM-…`, top bar) → Admin → Integrations → **Google Tag Manager** → paste → Turn on → Save.

### 3.2 Turn on consent features
1. **Admin → Container settings → Additional settings → Enable consent overview** ✔ → Save.
2. In **Tags**, click the shield icon (Consent overview) — every tag must show its required consent. Google tags have built-in consent checks; for non-Google tags (Clarity, Hotjar) set **Additional consent checks → Require additional consent → `analytics_storage`** (or `ad_storage` for ad pixels).

### 3.3 Create variables
**Variables → Built-in variables → Configure** → tick: Page Path, Page URL, Page Hostname, Referrer, Click Text, Click URL, Event.

**Variables → User-defined → New → Data Layer Variable** — create one per row (Data Layer Variable Name exactly as below, version 2):

| Variable name in GTM | Data Layer Variable Name |
|---|---|
| DLV - page_path | `page_path` |
| DLV - locale | `locale` |
| DLV - market | `market` |
| DLV - cta_text | `cta_text` |
| DLV - cta_target | `cta_target` |
| DLV - form_id | `form_id` |
| DLV - service | `service` |
| DLV - percent | `percent` |
| DLV - phone_number | `phone_number` |
| DLV - email | `email` |

Create one **Constant** variable: `CONST - GA4 ID` = your `G-…`.

### 3.4 Google tag (GA4 base) — Option B only
1. **Tags → New → Tag configuration → Google Tag**.
2. Tag ID: `{{CONST - GA4 ID}}`.
3. Configuration settings → add parameter `send_page_view` = `false` (the site sends its own page_view event on every page change).
4. Trigger: **Initialization – All Pages**. Name: `Google Tag – GA4` → Save.

### 3.5 Triggers (Custom Event)
**Triggers → New → Custom Event**, Event name exactly as below, "All Custom Events":

| Trigger name | Event name |
|---|---|
| CE - page_view | `page_view` |
| CE - generate_lead | `generate_lead` |
| CE - book_call | `book_call` |
| CE - request_proposal | `request_proposal` |
| CE - request_audit | `request_audit` |
| CE - cta_click | `cta_click` |
| CE - phone_click | `phone_click` |
| CE - whatsapp_click | `whatsapp_click` |
| CE - email_click | `email_click` |
| CE - scroll_depth | `scroll_depth` |

Tip: one regex trigger instead of many — Event name `^(generate_lead|book_call|request_proposal|request_audit)$` with **Use regex matching** ✔, named `CE - conversions`.

### 3.6 GA4 event tags — Option B only
For each event: **Tags → New → Google Analytics: GA4 Event**
- Measurement ID `{{CONST - GA4 ID}}`
- Event name: `{{Event}}` (reuses the dataLayer name)
- Event parameters: `page_path`={{DLV - page_path}}, `locale`, `market`, `cta_text`, `form_id`, `service`, `percent` (map each to its DLV)
- Trigger: the matching CE trigger (you can attach many triggers to one tag)

### 3.7 Optional: Microsoft Clarity (free heatmaps + session recordings)
1. https://clarity.microsoft.com → New project → copy project ID.
2. GTM → Tags → New → Community Template Gallery → search **Microsoft Clarity – Official** → add → project ID → trigger **All Pages** → Additional consent `analytics_storage`.

### 3.8 Preview and publish
1. Click **Preview** → enter `https://digitalpenta.com` → **Connect**.
2. In the new tab accept cookies → click a button → submit a test form.
3. In Tag Assistant confirm each tag shows **Fired** on the right event, and **Consent** tab shows granted values.
4. Close → **Submit** → Version name `v1 – base tracking` → description of what you added → **Publish**.

- [ ] Preview shows tags firing only after consent
- [ ] Version published with a clear name

---

## 4. Google Ads conversions + Enhanced Conversions

**Goal: Google Ads knows which clicks became leads, so Smart Bidding optimises for enquiries, not clicks.**

### 4.1 Easiest path — import from GA4
1. Google Ads → **Goals → Conversions → Summary → + New conversion action → Import → Google Analytics 4 properties → Web**.
2. Tick `generate_lead`, `book_call`, `request_proposal` → Import.
3. Set `generate_lead` (or `book_call`) as **Primary**; others **Secondary**.

### 4.2 Better accuracy — Google Ads tag in GTM (Option B)
1. Google Ads → **+ New conversion action → Website** → enter `digitalpenta.com` → **Add a conversion action manually**:
   - Goal: **Submit lead form** · Name `Lead – website form` · Value: use same value (₹1000) · Count: **One** · Click-through window 90 days · Attribution **Data-driven** → Done.
2. Choose **Use Google Tag Manager** → copy **Conversion ID** and **Conversion label**.
3. GTM → Tags → New → **Conversion Linker** → trigger **All Pages** (keeps `gclid`).
4. GTM → Tags → New → **Google Ads Conversion Tracking** → paste ID + label → trigger `CE - generate_lead`.
5. Repeat for `book_call` (goal: **Book appointment**).

### 4.3 Enhanced Conversions for leads
Sends a **hashed** (SHA-256) email/phone with the conversion so Google can match it even when cookies are blocked.
1. Google Ads → **Goals → Settings → Enhanced conversions → Turn on for leads** → method **Google Tag Manager** → accept terms.
2. The site pushes `user_data` (email + phone) in the `generate_lead` dataLayer event **only when marketing consent is granted**. *(Developer: if not yet present, add `window.dataLayer.push({ event: "generate_lead", user_data: { email, phone_number } })` inside `submitLead()` after success, consent-gated.)*
3. In the Google Ads conversion tag → tick **Include user-provided data from your website** → New variable → **Manual configuration** → Email = `{{DLV - user_data.email}}`, Phone = `{{DLV - user_data.phone_number}}`.
4. After 72 h, Google Ads → Conversions → your action → **Diagnostics** shows "Enhanced conversions: Recording".

### 4.4 Offline conversions (when a lead becomes a paying client)
Each lead stores `gclid`. Every month: Admin → Leads → filter status **Won** → export → Google Ads → **Conversions → Uploads** → upload CSV (`Google Click ID, Conversion Name, Conversion Time, Conversion Value, Currency`). This teaches Google which leads actually paid.

- [ ] Primary conversion chosen
- [ ] Conversion Linker on All Pages
- [ ] Enhanced conversions: Recording
- [ ] Auto-tagging ON (Google Ads → Admin → Account settings)

---

## 5. Meta (Facebook / Instagram) Pixel + Conversions API

### 5.1 Create the dataset (Pixel)
1. https://business.facebook.com → **Events Manager** → **Connect data sources** (green +) → **Web** → Connect.
2. Name: `Digital Penta Website` → enter `https://digitalpenta.com` → Check.
3. Choose **Set up manually → Meta Pixel only** (the site installs the base code) → copy the **Pixel / Dataset ID**.
4. Admin → Integrations → **Meta Pixel** → paste → Turn on → Save.

### 5.2 Verify the domain (required for ads and event control)
1. Business Settings → **Brand safety and suitability → Domains → Add** → `digitalpenta.com`.
2. Choose **DNS TXT record** → copy the `facebook-domain-verification=…` value.
3. At your domain provider's DNS panel add a **TXT** record, host `@`, value as copied → save → wait 10–60 min → click **Verify**.

### 5.3 Events the site sends automatically

| Site action | Meta standard event |
|---|---|
| Page change (after consent) | `PageView` |
| `generate_lead`, `request_audit` | `Lead` |
| `book_call` | `Schedule` |
| `request_proposal` | `SubmitApplication` |
| `contact_whatsapp`, `contact_phone` | `Contact` |

### 5.4 Event setup in Events Manager
1. Events Manager → your dataset → **Settings**:
   - **Automatic advanced matching: ON** → allow Email and Phone.
   - **Track events automatically without code: OFF** (prevents duplicate button events).
   - **First-party cookies: ON**.
2. **Traffic permissions** → Allow list → add `digitalpenta.com` and `www.digitalpenta.com` (blocks others from sending fake events with your Pixel).

### 5.5 Conversions API (server-side — strongly recommended in 2026)
Browser pixels lose 20–40 % of events to ad blockers and iOS privacy. Conversions API sends the same events from the server.
1. Events Manager → dataset → **Settings → Conversions API → Generate access token** → copy it (shown once).
2. Save it as a backend secret named **`META_CAPI_TOKEN`**, and the dataset ID as **`META_PIXEL_ID`** (Supabase → Project settings → Edge Functions → Secrets).
3. *(Developer)* In the `submit-lead` edge function, after a lead is saved, POST to `https://graph.facebook.com/v21.0/<PIXEL_ID>/events?access_token=<token>` with:
   ```json
   { "data": [{
       "event_name": "Lead",
       "event_time": 1767225600,
       "event_id": "<same id the browser sent>",
       "action_source": "website",
       "event_source_url": "https://digitalpenta.com/contact",
       "user_data": { "em": ["<sha256 lowercase email>"], "ph": ["<sha256 digits-only phone>"],
                      "client_ip_address": "<ip>", "client_user_agent": "<ua>", "fbc": "<_fbc cookie>", "fbp": "<_fbp cookie>" }
   }]}
   ```
   Send only if the visitor gave marketing consent (pass a `consent_marketing` flag from the form).
4. **Deduplication:** the browser `fbq('track','Lead',{…},{eventID: X})` and the server event must share the same `event_id`, or Meta counts twice.
5. Events Manager → **Overview** → event `Lead` shows **Browser • Server** and "Deduplicated". Aim for **Event Match Quality ≥ 6.0**.

### 5.6 Custom conversions & audiences
- **Custom conversions → Create** → event `Lead` → URL contains `/get-proposal` → name `Lead – Proposal page`.
- **Audiences → Create → Custom audience → Website** → "All visitors 30 days", "Visited /pricing 60 days", "Lead 180 days" (exclude from prospecting).

### 5.7 Test
Events Manager → **Test events** → enter `https://digitalpenta.com` → Open website → accept cookies → submit test form → `PageView` and `Lead` appear within seconds. Copy the test code into the CAPI call (`test_event_code`) while testing the server side.

- [ ] Domain verified
- [ ] Traffic allow-list set
- [ ] Browser `Lead` shows in Test events
- [ ] CAPI token saved as secret (server events: ____ done / pending)

---

## 6. LinkedIn Insight Tag + Conversions

1. https://www.linkedin.com/campaignmanager → choose ad account → **Data → Signals manager** (older menus: **Analyze → Insight Tag**).
2. **Install Insight Tag → I will install the tag myself** → copy the **Partner ID** (number).
3. Admin → Integrations → **LinkedIn Insight Tag** → paste → Turn on → Save.
4. **Data → Conversion tracking → Create conversion:**
   - Name `Website lead` · Category **Lead** · Value optional · Attribution: 30-day click / 7-day view.
   - Method: **Event-specific (JavaScript)** → the site calls `lintrk('track', { conversion_id: … })`. Copy the numeric conversion ID LinkedIn gives you and send it to the developer to map `generate_lead`, `book_call`, `request_proposal`, `request_audit` → their IDs.
5. **Data → Audiences → Create → Website** → "All visitors 90 days" and "Pricing visitors".
6. Optional (2026): **LinkedIn Conversions API** — Signals manager → Conversions API → Generate token → save as secret `LINKEDIN_CAPI_TOKEN`; developer sends hashed email with each lead like Meta CAPI.
7. Test: after 24 h, Signals manager shows the tag as **Active**.

- [ ] Tag Active
- [ ] Conversion IDs mapped

---

## 7. UTM and ad-click URL tracking

### 7.1 What is captured (built in)

`utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id, gclid, gbraid, wbraid, fbclid, msclkid, li_fat_id, ttclid, ref`

| Stored | Where | How long |
|---|---|---|
| **Last touch** (this visit) | browser session | until tab closes; survives page changes |
| **First touch** (first campaign ever) | browser local storage | 90 days |
| Landing page + referrer | with both | — |
| Saved with each lead | `utm` field on the lead → **Admin → Leads** and contact timeline | forever |

### 7.2 Naming rules (write them down and share with anyone who makes links)
1. **lowercase only** — `facebook`, never `Facebook` (GA4 treats them as different sources).
2. **hyphens, no spaces** — `diwali-offer-2026`.
3. **fixed list of sources and mediums** (below). Don't invent new ones.
4. Campaign format: `<goal>-<audience/market>-<yyyy-mm>` e.g. `leadgen-dubai-2026-10`.
5. Never put UTMs on **internal** links inside the website — it restarts the session and wrecks attribution.

| utm_source | utm_medium | Use for |
|---|---|---|
| `google` | `cpc` | Google Search/PMax ads |
| `bing` | `cpc` | Microsoft Ads |
| `facebook` / `instagram` | `paid_social` | Meta ads |
| `facebook` / `instagram` | `social` | organic posts, bio link |
| `linkedin` | `paid_social` / `social` | LinkedIn |
| `youtube` | `video` / `social` | YouTube |
| `whatsapp` | `broadcast` / `chat` | WhatsApp campaigns / 1-to-1 |
| `newsletter` | `email` | Newsletter |
| `sequence` | `email` | Automated follow-up emails |
| `partner-<name>` | `referral` | Partners |
| `qr` | `offline` | Brochures, events, visiting cards |

GA4 uses the medium to place traffic in its **default channel groups** — `cpc` → Paid Search, `paid_social` → Paid Social, `email` → Email, `referral` → Referral. Wrong mediums end up in "Unassigned".

### 7.3 Platform setup

**Google Ads**
1. Admin → Account settings → **Auto-tagging: ON** (adds `gclid`, required).
2. Account-level **Final URL suffix**:
   `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}`
   (Replace `{campaignid}` with `{_campaign}` custom parameter if you want names.)

**Meta Ads** — each ad → **Tracking → URL parameters** → *Build a URL parameter*:
`utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}`

**LinkedIn Ads** — campaign → ad → **Destination URL** add:
`?utm_source=linkedin&utm_medium=paid_social&utm_campaign=<name>&utm_content=<ad-name>` (LinkedIn also adds `li_fat_id` automatically when enabled in Signals settings).

**Microsoft Ads** — Settings → **Auto-tagging of UTM + msclkid: ON**.

**WhatsApp broadcasts / emails** — add UTMs to every link in the template body, e.g.
`https://digitalpenta.com/book-a-call?utm_source=whatsapp&utm_medium=broadcast&utm_campaign=festive-offer-2026-10`

### 7.4 Link builder
Google's free tool: https://ga-dev-tools.google/campaign-url-builder/ — or keep a shared Google Sheet with columns *Base URL · source · medium · campaign · content · term · Final URL* and formula
`=A2&"?utm_source="&B2&"&utm_medium="&C2&"&utm_campaign="&D2&IF(E2="","","&utm_content="&E2)`

### 7.5 Verify
1. Open `https://digitalpenta.com/?utm_source=qa&utm_medium=test&utm_campaign=setup-check`.
2. Click to 2–3 other pages, then submit the contact form with a test email.
3. Admin → Leads → open the test lead → UTM shows `qa / test / setup-check` + landing page `/`.
4. GA4 → Realtime → **First user source** = `qa`.
5. Delete the test lead.

---

## 8. Event reference

All events are pushed to `window.dataLayer` and include `page_path`, `page_location`, `locale` (`en`/`ar`) and `market` (`in`, `ae`, `sa`, `qa`, `bh`, `global`).

| Event | Fires when | Extra parameters | Key event? |
|---|---|---|---|
| `page_view` | every page change | — | no |
| `cta_click` | any button / `[data-cta]` link | `cta_text`, `cta_target` | no |
| `free_audit_click` | audit buttons | `cta_text` | no |
| `form_submit_attempt` | any form submitted (before server check) | `form_id`, `service` | no |
| `generate_lead` | server **confirmed** lead saved | `form_id`, `service` | **yes** |
| `book_call` | strategy call booked | `service` | **yes** |
| `request_proposal` | proposal form confirmed | `service` | **yes** |
| `request_audit` | website audit requested | — | **yes** |
| `contact_whatsapp` / `whatsapp_click` | WhatsApp link clicked | `phone_number` | yes (low value) |
| `contact_phone` / `phone_click` | phone link clicked | `phone_number` | yes (low value) |
| `email_click` | mailto link clicked | `email` | no |
| `outbound_click` | link to another website | `outbound_url`, `cta_text` | no |
| `scroll_depth` | 25 / 50 / 75 / 100 % of page | `percent` | no |

Marketing mirror (only with marketing consent): Meta and LinkedIn receive the conversion events listed in Parts 5.3 and 6.4.

---

## 9. Testing — full QA script

Do this in **Chrome, private window**, then repeat once on a **phone**.

| # | Action | Expected |
|---|---|---|
| 1 | Open `/?utm_source=qa&utm_medium=test&utm_campaign=full-qa` | Cookie banner shows |
| 2 | DevTools → Network, filter `collect\|fbevents\|licdn\|gtm.js` | Nothing loaded |
| 3 | Click **Reject** | Still nothing loaded |
| 4 | Clear site data, reload same URL, click **Accept all** | gtag/gtm, fbevents, insight.min.js load |
| 5 | Console: type `dataLayer` | Array with `page_view` and consent `update` |
| 6 | Visit `/services`, `/pricing` | a `page_view` per page (GA4 DebugView) |
| 7 | Click WhatsApp and phone buttons | `whatsapp_click`, `phone_click` |
| 8 | Scroll to bottom | `scroll_depth` 25→100 |
| 9 | Submit contact form with `qa+<date>@digitalpenta.com` | `form_submit_attempt` then `generate_lead`; Meta Test events shows `Lead` |
| 10 | Admin → Leads | Test lead with UTM `qa/test/full-qa` |
| 11 | GTM Preview (Option B) | Conversion tags fired once, not twice |
| 12 | Next day: GA4 Reports → Engagement → Events | `generate_lead` counted as key event |
| 13 | Delete test lead | — |

---

## 10. Reports to build after setup

**GA4 → Explore → Blank** (save each):
1. **Lead sources:** rows = Session source/medium, Session campaign; values = Sessions, Key events (`generate_lead`), Session key event rate.
2. **Landing page performance:** rows = Landing page; values = Sessions, Engagement rate, Key events.
3. **Market split:** rows = custom dimension *Market*, *Locale*; values = Users, Key events.
4. **Funnel:** Funnel exploration → steps `page_view` (service page) → `cta_click` → `form_submit_attempt` → `generate_lead`. Shows where people drop off.
5. **CTA performance:** rows = *CTA text*; values = event count of `cta_click`.

**Looker Studio** (free dashboard): https://lookerstudio.google.com → Create → Data source **Google Analytics** → pick property → use the GA4 template → add Google Ads and Search Console as extra sources → share view-only with the team.

---

## 11. Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Nothing in GA4 Realtime | Consent not accepted / wrong ID / switch off | Accept cookies; check `G-` ID; Integrations switch ON + Save; wait 5 min |
| Visits counted twice | GA4 in Integrations **and** in GTM | Keep one (see 0.4) |
| `generate_lead` not in key-event list | It hasn't fired yet | Submit a test lead, wait 24 h, or create key event by name |
| Traffic shows "(not set)" / "Unassigned" | Wrong/mixed-case `utm_medium` | Follow the table in 7.2 |
| Google Ads shows 0 conversions | Auto-tagging off, no Conversion Linker, or import not done | Check 4.1–4.2 |
| Meta "No recent activity" | Marketing consent not given, ad blocker, domain not allow-listed | Test in clean browser; check 5.4 traffic permissions |
| Meta counts Lead twice | Browser + server events without shared `event_id` | Add dedup (5.5 step 4) |
| LinkedIn tag "Unverified" | Needs 24 h and a consented visit | Visit site, accept marketing, wait |
| Lead saved without UTM | Visitor arrived without parameters or in a new session more than 90 days later | Expected; check `first_source` |
| Self visits in reports | Internal filter still "Testing" | Activate filter (2.4) |

---

## 12. Maintenance checklist

**Monthly**
- [ ] GA4 → Admin → **Data stream → Tag coverage / diagnostics**: no warnings
- [ ] Google Ads → Conversions → all "Recording conversions"
- [ ] Meta → Event Match Quality ≥ 6; no "Deduplication" warnings
- [ ] Upload offline "Won" conversions (4.4)
- [ ] Check "Unassigned" channel in GA4 — fix any bad UTM links

**Quarterly**
- [ ] Remove ex-employees from GA4, GTM, Ads, Meta, LinkedIn
- [ ] Review GTM: delete paused/unused tags, publish with a clear version name
- [ ] Re-test the full QA script (Part 9)
- [ ] Update the privacy page if a new tool was added

**Whenever a new form or page type is added**
- [ ] Form must call `submitLead()` (so `generate_lead` + UTMs work)
- [ ] Buttons that matter get a `data-cta` attribute
- [ ] Add any new event to Part 8 of this file
