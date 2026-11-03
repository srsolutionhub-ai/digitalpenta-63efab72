# Digital Penta — Google Tag Manager setup guide (GA4 + Meta Pixel through GTM)

**Website:** https://digitalpenta.app · **Last updated:** November 2026

This guide is for running **Google Analytics 4 and the Meta (Facebook) Pixel from inside one Google Tag Manager container**. Work through it from top to bottom. Every name below (event names, variable names) matches what the website sends, so copy them exactly.

> Google and Meta rename menu items often. If a button name is slightly different, pick the closest match. Each step says what it should achieve.

---

## Part 0 — What the website already does (no work needed)

| What | How it works on the site |
|---|---|
| Cookie banner | Visitors choose **Analytics**, **Marketing** and **Personalisation**. Each choice is saved in the browser and in the `cookie_consent_ledger` table (choices, policy version, browser, visitor ID, time). Visitors can change it later through **Cookie settings** in the footer. |
| Google Consent Mode v2 | Before anything loads, all four signals (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) are set to **denied**. When the visitor accepts, the site sends a consent **update**. |
| When GTM loads | Only after the visitor accepts **Analytics or Marketing**. GTM is never loaded for visitors who reject everything. |
| GTM mode (automatic) | As soon as a GTM ID is saved, the site **stops loading GA4 and the Meta Pixel by itself**, so nothing is counted twice. Everything then comes from your GTM container. |
| dataLayer events | Every page view, click, scroll and conversion is pushed into `window.dataLayer` (list in Part 3). |
| First-party CRM tracking | Separately from Google/Meta, the site stores visitor device, browser, OS, screen, language, timezone, approximate city/country, traffic source, UTM/gclid/fbclid, pages, engagement time and conversions in your CRM (Admin → Audience Analytics / Visitors). This only runs for visitors who accepted **Analytics**. |
| Personal data | Events **never** contain names, emails or phone numbers. Google and Meta do not allow personal data in normal events. |

---

## Part 1 — Create the accounts and IDs

### 1.1 Google Tag Manager container
1. Open https://tagmanager.google.com and sign in with the company Google account.
2. **Create Account** → Account name `Digital Penta` → Country `India`.
3. Container name `digitalpenta.app` → Target platform **Web** → **Create** → accept the terms.
4. Close the code-snippet popup. **You do not paste that code anywhere**; the website loads GTM itself.
5. Copy the container ID at the top (looks like `GTM-ABC1234`).

### 1.2 Google Analytics 4 property
1. Open https://analytics.google.com → **Admin** (gear) → **Create** → **Property**.
2. Name `Digital Penta Website`, time zone **India (GMT+5:30)**, currency **INR** → business details → **Create**.
3. **Data streams** → **Web** → URL `https://digitalpenta.app` → name `Website` → **Create stream**.
4. In the stream, open **Enhanced measurement** (gear) and switch **off** *Page views → "Page changes based on browser history events"*. The site already sends its own page views. Leave scrolls **off** (the site sends `scroll_depth`). Outbound clicks, site search and file downloads can stay on.
5. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
6. **Admin → Data collection and modification → Data retention** → set to **14 months** → Save.
7. **Admin → Data collection** → turn on **Google signals** only if your privacy policy mentions it (it already covers Google Analytics).

### 1.3 Meta Pixel (Dataset)
1. Open https://business.facebook.com → **Events Manager** → **Connect data sources** → **Web** → name `Digital Penta Website` → **Create**.
2. Choose **Set up manually** → **Install code manually**? No. Close it. We install through GTM.
3. Copy the **Pixel / Dataset ID** (a long number).
4. **Settings** → **Automatic advanced matching** → leave it **OFF** (the site gives no personal data to the Pixel; keep it that way unless your privacy policy and consent text change).
5. **Settings → Traffic permissions** → add `digitalpenta.app` and `www.digitalpenta.app` to the allow list.
6. Business Settings → **Brand safety → Domains** → add `digitalpenta.app` and verify it (meta-tag or DNS method).

---

## Part 2 — Tell the website your GTM ID

1. Sign in to the admin panel → **Integrations**.
2. On **Google Tag Manager**, paste `GTM-ABC1234`, switch it **On**, Save.
3. **Do not** also turn on the GA4 or Meta Pixel cards there. With GTM on, they would be ignored anyway, but keep things clean.
4. Publish nothing extra; the site reads this setting on every visit.

---

## Part 3 — Events the website sends to the dataLayer

| Event name (`event`) | When it fires | Useful parameters |
|---|---|---|
| `dp_consent_update` | Visitor saves cookie choices | `dp_consent_analytics`, `dp_consent_marketing` (`granted` / `denied`) |
| `page_view` | Every page, including in-app navigation | `page_path`, `page_location`, `locale`, `market` |
| `scroll_depth` | 25 / 50 / 75 / 100 % of page | `percent` |
| `cta_click` | Any button or marked CTA | `cta_text`, `cta_target` |
| `free_audit_click` | Audit CTA clicked | `cta_text` |
| `outbound_click` | Link to another website | `outbound_url` |
| `form_submit_attempt` | A form was submitted (not yet confirmed) | `form_id`, `service` |
| `generate_lead` ★ | Enquiry **saved on the server** | `form`, `service`, `event_id`, `meta_event_name`=`Lead` |
| `book_call` ★ | Strategy-call booking saved | `form`, `source`, `event_id`, `meta_event_name`=`Schedule` |
| `newsletter_signup` ★ | Newsletter subscription saved | `form`, `event_id`, `meta_event_name`=`Subscribe` |
| `request_proposal` ★ | Proposal brief submitted | `event_id`, `meta_event_name`=`SubmitApplication` |
| `request_audit` ★ | Free audit requested | `event_id`, `meta_event_name`=`Lead` |
| `contact_whatsapp` ★ | WhatsApp link clicked | `channel`, `event_id`, `meta_event_name`=`Contact` |
| `contact_phone` ★ | Phone link clicked | `channel`, `event_id`, `meta_event_name`=`Contact` |
| `contact_email` ★ | Email link clicked | `channel`, `event_id`, `meta_event_name`=`Contact` |

★ = conversion (also carries `conversion: true`). `event_id` is unique per conversion, so Meta can de-duplicate if you add Conversions API later.

Every event also carries `page_path`, `page_location`, `locale` (`en`/`ar`) and `market` (`in`, `ae`, `sa`, `qa`, `bh`, `global`).

---

## Part 4 — Build the GTM container

Open your container → **Workspace**.

### 4.1 Built-in variables
**Variables → Built-In Variables → Configure** → tick **Page URL, Page Path, Page Hostname, Referrer, Event, Click URL, Click Text**.

### 4.2 User-defined variables (Variables → User-Defined → New → *Data Layer Variable*)
Create each with **Data Layer Version 2**:

| Variable name in GTM | Data Layer Variable Name |
|---|---|
| `DLV - page_path` | `page_path` |
| `DLV - page_location` | `page_location` |
| `DLV - locale` | `locale` |
| `DLV - market` | `market` |
| `DLV - percent` | `percent` |
| `DLV - cta_text` | `cta_text` |
| `DLV - form` | `form` |
| `DLV - form_id` | `form_id` |
| `DLV - service` | `service` |
| `DLV - channel` | `channel` |
| `DLV - event_id` | `event_id` |
| `DLV - meta_event_name` | `meta_event_name` |
| `DLV - consent_marketing` | `dp_consent_marketing` |

Also create a **Constant** variable `CONST - GA4 ID` = your `G-XXXXXXXXXX`, and `CONST - Meta Pixel ID` = your Pixel ID.

### 4.3 Turn on consent overview
**Admin → Container Settings → Additional Settings → tick "Enable consent overview"** → Save. (The website sets the consent defaults; you do **not** need a CMP template in GTM.)

### 4.4 Triggers (Triggers → New → *Custom Event*)

| Trigger name | Event name | Notes |
|---|---|---|
| `CE - page_view` | `page_view` | All custom events |
| `CE - scroll_depth` | `scroll_depth` | |
| `CE - cta_click` | `cta_click` | |
| `CE - form_submit_attempt` | `form_submit_attempt` | |
| `CE - conversions` | `generate_lead|book_call|newsletter_signup|request_proposal|request_audit|contact_whatsapp|contact_phone|contact_email` | tick **Use regex matching** |
| `CE - consent marketing granted` | `dp_consent_update` | Some custom events → `DLV - consent_marketing` **equals** `granted` |

### 4.5 GA4 tags

**Tag 1 — `GA4 - Google tag`**
- Type **Google Tag** → Tag ID `{{CONST - GA4 ID}}`.
- **Configuration settings** → add parameter `send_page_view` = `false`.
- **Shared event settings** → add `locale` = `{{DLV - locale}}`, `market` = `{{DLV - market}}`.
- Trigger: **Initialization - All Pages**.
- Advanced → Consent settings → **No additional consent required** (Google tags read Consent Mode by themselves).

**Tag 2 — `GA4 - page_view`**
- Type **Google Analytics: GA4 Event** → Measurement ID `{{CONST - GA4 ID}}` → Event name `page_view`.
- Parameters: `page_location` = `{{DLV - page_location}}`, `page_path` = `{{DLV - page_path}}`.
- Trigger: `CE - page_view`.

**Tag 3 — `GA4 - all conversions`**
- GA4 Event → Event name `{{Event}}` (so one tag sends each conversion with its own name).
- Parameters: `form` `{{DLV - form}}`, `service` `{{DLV - service}}`, `channel` `{{DLV - channel}}`, `event_id` `{{DLV - event_id}}`.
- Trigger: `CE - conversions`.

**Tag 4 — `GA4 - engagement`**
- GA4 Event → Event name `{{Event}}`, parameters `percent` `{{DLV - percent}}`, `cta_text` `{{DLV - cta_text}}`, `form_id` `{{DLV - form_id}}`.
- Triggers: `CE - scroll_depth`, `CE - cta_click`, `CE - form_submit_attempt`.

### 4.6 Meta Pixel tags
Use the Community template: **Templates → Tag Templates → Search Gallery → "Facebook Pixel" by facebookarchive** → Add to workspace. (If you prefer Custom HTML, the code is in 4.7.)

**Tag 5 — `Meta - PageView`**
- Template Facebook Pixel → Pixel ID `{{CONST - Meta Pixel ID}}` → Event name **PageView**.
- Trigger: `CE - page_view`.
- **Advanced → Consent Settings → Require additional consent → `ad_storage`**. This is required: the Meta Pixel does not read Google Consent Mode by itself.

**Tag 6 — `Meta - conversions`**
- Template Facebook Pixel → Event name: **Custom** → `{{DLV - meta_event_name}}`.
- Event ID: `{{DLV - event_id}}`.
- Object properties: `content_name` = `{{Event}}`, `content_category` = `{{DLV - service}}`.
- Trigger: `CE - conversions`.
- Consent: **Require additional consent → `ad_storage`**.

> Meta maps: enquiry/audit → **Lead**, booking → **Schedule**, newsletter → **Subscribe**, proposal → **SubmitApplication**, WhatsApp/phone/email → **Contact**. These are Meta standard events, so you can optimise ads on them.

### 4.7 Custom HTML alternative for Meta (only if not using the template)
Tag type **Custom HTML**, trigger `CE - page_view`, consent `ad_storage`, **Tag firing options: Once per page**:
```html
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{CONST - Meta Pixel ID}}');
fbq('track', 'PageView');
</script>
```
Conversions tag (trigger `CE - conversions`, consent `ad_storage`):
```html
<script>fbq('track', {{DLV - meta_event_name}}, {content_name: {{Event}}}, {eventID: {{DLV - event_id}}});</script>
```
Withdrawal tag (Custom HTML, trigger: Custom Event `dp_consent_update` where `DLV - consent_marketing` equals `denied`): `<script>if(window.fbq)fbq('consent','revoke');</script>`

### 4.8 Preview and publish GTM
1. Click **Preview** → enter `https://digitalpenta.app` → Connect.
2. On the site, **accept all cookies**. In Tag Assistant you should see `dp_consent_update`, then `page_view`, and tags *GA4 - Google tag*, *GA4 - page_view*, *Meta - PageView* under **Tags Fired**.
3. Click a WhatsApp button → `contact_whatsapp` → *GA4 - all conversions* and *Meta - conversions* fired.
4. Repeat in a private window, **reject** cookies: GTM must not load at all.
5. Accept only Analytics: GA4 tags fire, Meta tags show **blocked by consent**.
6. **Submit** → Version name `v1 GA4 + Meta` → **Publish**.

---

## Part 5 — Settings inside GA4 after data arrives (24–48 h)

1. **Admin → Events → Key events** → mark as key event: `generate_lead`, `book_call`, `request_proposal`, `request_audit`, `newsletter_signup`, `contact_whatsapp`, `contact_phone`. (Create them with **New key event** if they do not appear yet.)
2. **Admin → Custom definitions → Create custom dimension** (scope Event): `locale`, `market`, `form`, `service`, `channel`, `cta_text`. Custom metric: `percent` (Standard).
3. **Admin → Data streams → Website → Configure tag settings → List unwanted referrals**: add `checkout.stripe.com`, `razorpay.com`, `wa.me` if they show as referrers.
4. **Admin → Reporting identity** → **Blended**.
5. **Admin → Product links**: link **Google Ads** and **Search Console** (property `https://digitalpenta.app/`, already verified).
6. **Explore → Funnel exploration**: `page_view` → `cta_click` → `form_submit_attempt` → `generate_lead`.

---

## Part 6 — Settings inside Meta Events Manager

1. **Overview** → you should see **PageView**, **Lead**, **Contact**, **Schedule**, **Subscribe** within a day of real traffic.
2. **Test events** tab → open the site from the link shown → confirm events arrive with the same Pixel ID.
3. **Custom conversions** (optional): create `Lead – city pages` with rule *URL contains `/locations/`* and event **Lead**.
4. **Audiences** (Ads Manager → Audiences → Create → Custom audience → Website): useful starters
   - All visitors 30 / 90 / 180 days.
   - Visitors of `/services/seo*` (SEO interest), `/services/ppc*`, `/ai-*` pages.
   - People who did **Contact** but not **Lead** in 30 days (warm, not converted).
   - Exclude people who did **Lead** in 30 days from prospecting campaigns.
5. Keep **Automatic advanced matching** off unless you update the privacy policy and cookie text to say email/phone are shared with Meta for ad matching.

---

## Part 7 — UTM / ad-click links

The site already captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `li_fat_id` on landing and attaches them to the visitor and any lead in the CRM.

Use this format for every ad and post:
```
https://digitalpenta.app/services/seo?utm_source=facebook&utm_medium=paid_social&utm_campaign=seo_india_nov26&utm_content=video_a
```
Rules: lowercase only, underscores not spaces, same `utm_source` spelling every time (`google`, `facebook`, `instagram`, `linkedin`, `newsletter`, `whatsapp`). In Google Ads keep **auto-tagging ON**; in Meta Ads add the UTM string under **Ad → Tracking → URL parameters**.

---

## Part 8 — Privacy checklist (do not skip)

- [ ] Privacy policy names Google Analytics, Google Tag Manager, Google Ads and Meta Pixel, what they collect (pages, clicks, device, approximate location, cookie IDs) and why (measurement and advertising).
- [ ] Cookie banner text matches the tools you actually turned on. If you add a new tool, raise the policy version in the website.
- [ ] Every Meta tag in GTM has **Require additional consent: ad_storage**.
- [ ] No tag sends names, emails or phone numbers.
- [ ] Accept Meta's Business Tools Terms: https://www.facebook.com/legal/technology_terms
- [ ] Visitors can withdraw through **Cookie settings** in the footer; enquiry contacts can ask for deletion through the Data Request page.
- [ ] CRM visitor data is kept 180 days (interactions) / 365 days (events) and cleaned automatically.

---

## Part 9 — Troubleshooting

| Problem | Fix |
|---|---|
| GTM Preview shows nothing | You rejected cookies in that browser. Open **Cookie settings** in the footer and accept, or use a private window. |
| Page views counted twice | Enhanced measurement "browser history" page views still on (Part 1.2 step 4), or a second Google tag was added. |
| Meta tags "blocked by consent" | Visitor did not accept **Marketing**. This is correct. |
| Meta shows "Lead" twice | Two Meta tags on the same trigger, or Pixel also turned on in admin Integrations. Keep only the GTM one. |
| GA4 shows `(not set)` market | The page is not a city page; `global` is normal for general pages. |
| Conversions missing in GA4 | Mark them as key events (Part 5.1) and wait 24 h. |
