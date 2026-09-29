# Tracking Setup Guide — GA4, Google Tag Manager, Meta Pixel, LinkedIn & UTM links

Read top to bottom. No coding needed for steps 1–4. Everything loads **only after the visitor accepts cookies** (Consent Mode v2 / DPDP / GDPR safe).

---

## 0. Where IDs are entered

Admin dashboard → **Settings → Integrations** (`/dashboard/admin/integrations`).
Each provider has: ID box → **Turn on** switch → **Save**. Changes go live within ~5 minutes (cached).

| Provider | ID format | Consent needed |
|---|---|---|
| Google Analytics 4 | `G-XXXXXXXXXX` | Analytics |
| Google Tag Manager | `GTM-XXXXXXX` | Marketing |
| Meta Pixel | 15–16 digits | Marketing |
| LinkedIn Insight | 6–8 digits | Marketing |

> Developer alternative: set `VITE_GTM_ID`, `VITE_META_PIXEL_ID`, `VITE_LINKEDIN_PARTNER_ID` build variables. Env values override the dashboard.

---

## 1. Google Analytics 4

1. Go to https://analytics.google.com → **Admin** → **Create → Property**. Name: `Digital Penta`, time zone India, currency INR.
2. Choose **Web** stream → URL `https://digitalpenta.com` → stream name `Website`.
3. Keep **Enhanced measurement** ON, but turn **Page changes based on browser history** ON too (site is a single-page app).
4. Copy the **Measurement ID** (`G-…`) → paste in Integrations → GA4 → Turn on → Save.
5. **Admin → Events → Mark as key event:** `generate_lead`, `book_call`, `request_proposal`, `request_audit`, `contact_whatsapp`, `contact_phone`.
6. **Admin → Data streams → Configure tag settings → List unwanted referrals:** add `razorpay.com`, `checkout.stripe.com` (if used).
7. **Admin → Custom definitions → Create custom dimensions** (event scope): `locale`, `market`, `cta_text`, `form_id`, `service`.
8. Test: open the site with `?utm_source=test`, accept cookies, then GA4 → **Reports → Realtime**. You should see yourself within 30 seconds.

> Do **not** also add GA4 inside GTM — you would count every visit twice. Use one or the other.

---

## 2. Google Tag Manager (optional — only if you want extra tags)

1. https://tagmanager.google.com → **Create account** → Container `digitalpenta.com` → **Web**.
2. Copy the container ID (`GTM-…`) → Integrations → GTM → Turn on → Save. (Do **not** paste GTM's code snippet into the site — it's loaded for you.)
3. The site pushes these events to `dataLayer` — use them as **Custom Event** triggers:

| Event | When | Useful variables |
|---|---|---|
| `page_view` | every page change | `page_path`, `locale`, `market` |
| `cta_click` | any button click | `cta_text`, `cta_target` |
| `free_audit_click` | audit buttons | `cta_text` |
| `form_submit_attempt` | form submitted | `form_id`, `service` |
| `generate_lead` | lead **confirmed** by server | `form_id`, `service` |
| `phone_click` / `whatsapp_click` / `email_click` | contact links | `phone_number` / `email` |
| `scroll_depth` | 25/50/75/100 % | `percent` |

4. In GTM: **Variables → New → Data Layer Variable** for each name above.
5. Example — Google Ads conversion: Tag = *Google Ads Conversion Tracking* → Conversion ID + Label from Google Ads → Trigger = Custom Event `generate_lead`.
6. **Admin → Container settings → Consent overview** ON. Mark ad tags as requiring `ad_storage`.
7. Click **Preview**, open the site, accept cookies, submit a test form, confirm the tag fired → **Submit / Publish**.

---

## 3. Meta (Facebook / Instagram) Pixel

1. https://business.facebook.com → **Events Manager** → **Connect data sources → Web** → name `Digital Penta Pixel`.
2. Choose **Set up manually** → copy the **Pixel ID** (numbers only).
3. Integrations → Meta Pixel → paste → Turn on → Save.
4. **Events Manager → Settings → Domains:** verify `digitalpenta.com` (Business Settings → Brand safety → Domains → add DNS TXT record).
5. **Aggregated Event Measurement:** prioritise `Lead` → `Schedule` → `Contact` → `SubmitApplication`.
6. Events the site sends automatically:

| Site event | Meta event |
|---|---|
| page change | `PageView` |
| `generate_lead`, `request_audit` | `Lead` |
| `book_call` | `Schedule` |
| `request_proposal` | `SubmitApplication` |
| `contact_whatsapp`, `contact_phone` | `Contact` |

7. Test: Events Manager → **Test events** → enter `https://digitalpenta.com` → accept cookies → submit a form → `Lead` appears.

---

## 4. LinkedIn Insight Tag (optional)

1. https://www.linkedin.com/campaignmanager → **Analyze → Insight Tag → Install my Insight Tag → I will install myself**.
2. Copy the **Partner ID** → Integrations → LinkedIn → Turn on → Save.
3. **Analyze → Conversion tracking → Create conversion** → method *Event-specific* → names used by the site: `generate_lead`, `book_call`, `request_proposal`, `request_audit`.

---

## 5. UTM & ad-click URL tracking (already built in)

Every visit with these URL parameters is remembered and attached to the lead when a form is submitted:

`utm_source, utm_medium, utm_campaign, utm_term, utm_content, utm_id, gclid, gbraid, wbraid, fbclid, msclkid, li_fat_id, ttclid, ref`

- **Last touch** (current visit) is kept even after the visitor clicks to other pages.
- **First touch** (first ad/campaign that ever brought them, kept 90 days) is saved as `first_source` / `first_campaign`.
- Also saved: landing page and referrer. Visible in **Admin → Leads** and the contact's timeline.

### How to build links

Format: `https://digitalpenta.com/<page>?utm_source=<where>&utm_medium=<type>&utm_campaign=<name>`

| Channel | Example |
|---|---|
| Google Ads | turn on **auto-tagging** (adds `gclid`) + Final URL suffix `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}` |
| Meta Ads | URL parameters: `utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}` |
| LinkedIn Ads | `utm_source=linkedin&utm_medium=paid_social&utm_campaign=q4-leadgen` |
| WhatsApp broadcast | `utm_source=whatsapp&utm_medium=broadcast&utm_campaign=diwali-offer` |
| Email / newsletter | `utm_source=newsletter&utm_medium=email&utm_campaign=oct-2026` |
| Instagram bio | `utm_source=instagram&utm_medium=social&utm_campaign=bio` |

Rules: lowercase only, hyphens not spaces, same names every time (`facebook`, not `Facebook`/`fb`). Free builder: https://ga-dev-tools.google/campaign-url-builder/

---

## 6. Final checklist

- [ ] GA4 Realtime shows visits after accepting cookies
- [ ] Key events marked in GA4
- [ ] Meta Test events shows `PageView` + `Lead`
- [ ] Domain verified in Meta Business
- [ ] Test lead in Admin → Leads shows `utm_source`
- [ ] Declining cookies → no requests to google-analytics / facebook (check browser Network tab)

## Troubleshooting

| Problem | Fix |
|---|---|
| Nothing in GA4 | Accept cookies first; check ID starts with `G-`; switch is ON and saved; wait 5 min |
| Double counting | GA4 added both in Integrations **and** inside GTM — remove one |
| Pixel "not active" | Needs marketing consent; ad blockers hide it — test in a clean browser |
| Lead has no UTM | Link was missing parameters, or visitor opened a different link later in a new tab session |
