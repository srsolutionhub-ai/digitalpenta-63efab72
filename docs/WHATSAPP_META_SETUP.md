# WhatsApp Cloud API Setup Guide

This guide walks a developer through connecting Meta's WhatsApp Cloud API to this website end-to-end: Meta app creation, permanent token, Supabase secrets, admin UI configuration, webhook verification, template creation, and troubleshooting.

This project's WhatsApp integration lives in:
- `supabase/functions/whatsapp-webhook` — receives inbound messages + Meta's webhook verification handshake (GET) and inbound events (POST, HMAC-verified with `WHATSAPP_APP_SECRET`).
- `supabase/functions/whatsapp-send` — sends a single text/template message via `POST https://graph.facebook.com/v20.0/{phone_number_id}/messages`.
- `supabase/functions/whatsapp-broadcast` — bulk sends.
- `supabase/functions/whatsapp-templates-sync` — pulls templates from `GET https://graph.facebook.com/v20.0/{business_account_id}/message_templates` into the `whatsapp_templates` table.
- `src/pages/dashboard/admin/WhatsAppSetup.tsx` — admin UI at **Dashboard → Admin → WhatsApp Hub → Setup** where you enter `business_account_id` (WABA ID), `phone_number_id`, `display_phone_number`, and `webhook_verify_token` (stored in the `whatsapp_settings` table).

The webhook URL for this project is fixed:

```
https://ygoxxqkcxunuowtuwdxr.supabase.co/functions/v1/whatsapp-webhook
```

---

## 1. Prerequisites

1. A **Meta Business Account** at [business.facebook.com](https://business.facebook.com) — create one if you don't have it.
2. Your business must be **verified** in Meta Business Manager (Business Settings → Business Info → Security Center) — required to go beyond test mode and increase messaging limits.
3. A **phone number dedicated to WhatsApp Business API** that is:
   - Not currently registered on the regular WhatsApp or WhatsApp Business consumer app (must be removed from those apps first, or use a number that has never had WhatsApp installed).
   - Able to receive an SMS or voice call for OTP verification during registration.
4. Admin access to this project's Supabase (to set secrets) and to the app's `/dashboard/admin/whatsapp/setup` page.

---

## 2. Create the Meta App

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Create App**.
2. Choose app type **Business**.
3. Fill in app name and the Business Account from Step 1 as the associated business, then **Create App**.
4. From the app dashboard, click **Add Product** → find **WhatsApp** → **Set Up**.
5. Meta will provision a **test WhatsApp Business Account (WABA)** and a **test phone number** automatically so you can send test messages immediately.

---

## 3. Get the Phone Number ID and WhatsApp Business Account ID

1. In the app dashboard, go to **WhatsApp → API Setup**.
2. Under "Send and receive messages" you'll see:
   - **Phone number ID** — a numeric ID (e.g. `109876543210987`). This is `phone_number_id`.
   - **WhatsApp Business Account ID** — shown near the top of the page or under **WhatsApp → Configuration**. This is `business_account_id` (WABA ID).
3. To use your own production number instead of the test number: **WhatsApp → API Setup → Add phone number**, enter your business number, verify via SMS/voice OTP, then use its Phone Number ID going forward.
4. Copy both IDs — you will paste them into the admin Setup page in Step 6.

---

## 4. Create a System User and generate a permanent access token

The token generated in "API Setup" is temporary (24 hours). For production you need a **permanent System User token**.

1. Go to [business.facebook.com/settings/system-users](https://business.facebook.com/settings/system-users).
2. Click **Add** → name it (e.g. `whatsapp-api-bot`) → role **Admin** (or Employee, if you'll assign granular asset permissions) → **Create System User**.
3. Click **Add Assets** → **Apps** → select the app created in Step 2 → grant **Full Control**.
4. Also click **Add Assets** → **WhatsApp Accounts** → select the WABA from Step 3 → grant **Full Control**.
5. With the System User selected, click **Generate New Token**.
6. Select the app from Step 2, and check these scopes:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
7. Click **Generate Token** and copy it immediately — Meta shows it only once.
8. This token does not auto-expire (as long as the System User and its asset assignments remain in place), which is what makes it suitable for a server-side integration like this one.

---

## 5. Store secrets in Supabase

This project reads two environment secrets in its edge functions — the names must match **exactly**:

| Secret name | Used in | Value |
|---|---|---|
| `WHATSAPP_ACCESS_TOKEN` | `whatsapp-send`, `whatsapp-broadcast`, `whatsapp-webhook`, `whatsapp-templates-sync` | The permanent System User token from Step 4 |
| `WHATSAPP_APP_SECRET` | `whatsapp-webhook` (HMAC signature verification of inbound webhooks) | Already configured — App Dashboard → App Settings → Basic → App Secret |

To set `WHATSAPP_ACCESS_TOKEN`:

1. In the app's admin UI, open **Dashboard → Admin → WhatsApp Hub → Setup**.
2. Use the **"Add WhatsApp Token Secret"** action on that page (it stores the value as the Supabase Edge Function secret `WHATSAPP_ACCESS_TOKEN`, readable only by edge functions — never exposed to the browser).
3. Alternatively, a project maintainer can set it directly via the Supabase CLI:

```bash
supabase secrets set WHATSAPP_ACCESS_TOKEN="EAAG..." --project-ref ygoxxqkcxunuowtuwdxr
```

Do **not** put the token in `.env`, frontend code, or the `whatsapp_settings` table — only IDs and the verify token go there.

---

## 6. Configure the admin WhatsApp Setup page

Open **Dashboard → Admin → WhatsApp Hub → Setup** (`/dashboard/admin/whatsapp/setup`) and fill in the **Cloud API credentials** card:

| Field | Where it came from |
|---|---|
| WhatsApp Business Account ID | Step 3 (WABA ID) |
| Phone Number ID | Step 3 |
| Display Phone Number | The human-readable number, e.g. `+91 88601 00039` |

Click **Save Settings**. These are written to the `whatsapp_settings` table and used by every edge function at send/sync time.

The **Webhook configuration** card on the same page shows:
- **Callback URL** — pre-filled, read-only: `https://ygoxxqkcxunuowtuwdxr.supabase.co/functions/v1/whatsapp-webhook`.
- **Verify Token** — auto-generated (editable). Copy this value; you'll paste it into Meta in Step 7.

---

## 7. Register the webhook in Meta and subscribe to `messages`

1. In the app dashboard, go to **WhatsApp → Configuration**.
2. Under **Webhook**, click **Edit**.
3. **Callback URL**: paste `https://ygoxxqkcxunuowtuwdxr.supabase.co/functions/v1/whatsapp-webhook`.
4. **Verify token**: paste the exact value shown in the admin Setup page's Verify Token field.
5. Click **Verify and Save**. Meta immediately sends a `GET` request with `hub.mode=subscribe`, `hub.verify_token`, and `hub.challenge`; the `whatsapp-webhook` function checks the token against `whatsapp_settings.webhook_verify_token` and, if it matches, echoes back the challenge and marks the settings row `status = "verified"`.
6. Still on the Configuration page, under **Webhook fields**, click **Manage** and subscribe to the **`messages`** field (this delivers inbound messages and delivery/read status updates). No other fields are required for this integration.
7. Back in the admin Setup page, refresh — the status pill should now read **verified**.

> If verification fails, re-check that the Verify Token in Meta matches the one in the admin page character-for-character, and that `whatsapp_settings` has exactly one row (the webhook looks up the first/only row).

---

## 8. Test sending a message with curl

Use the permanent token and Phone Number ID from Steps 3–4. Replace `<PHONE_NUMBER_ID>`, `<ACCESS_TOKEN>`, and `<RECIPIENT_E164>` (recipient must have messaged you in the last 24h for free-form text, otherwise use a template — see below).

```bash
curl -X POST "https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "<RECIPIENT_E164>",
    "type": "text",
    "text": { "body": "Hello from the Cloud API test!" }
  }'
```

A successful response looks like:

```json
{ "messaging_product": "whatsapp", "contacts": [{ "input": "...", "wa_id": "..." }], "messages": [{ "id": "wamid...." }] }
```

To test a template message (works even outside the 24-hour window):

```bash
curl -X POST "https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "<RECIPIENT_E164>",
    "type": "template",
    "template": {
      "name": "welcome_lead_en",
      "language": { "code": "en" },
      "components": [
        { "type": "body", "parameters": [ { "type": "text", "text": "Riya" } ] }
      ]
    }
  }'
```

To test the app's own `whatsapp-send` edge function (requires a logged-in admin/account_manager Supabase session token and an existing `conversation_id`):

```bash
curl -X POST "https://ygoxxqkcxunuowtuwdxr.supabase.co/functions/v1/whatsapp-send" \
  -H "Authorization: Bearer <SUPABASE_USER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{ "conversation_id": "<uuid>", "body": "Test message" }'
```

To pull approved templates from Meta into the app's `whatsapp_templates` table, call `whatsapp-templates-sync` the same way (no body required).

---

## 9. Go-live checklist

1. [ ] Business verified in Meta Business Manager (Security Center shows "Verified").
2. [ ] Production phone number added and OTP-verified under **WhatsApp → API Setup** (not the Meta test number).
3. [ ] Display name approved (WhatsApp Manager → Phone Numbers → your number → Profile — display name review can take up to 24–48h).
4. [ ] Permanent System User token generated with `whatsapp_business_messaging` + `whatsapp_business_management`, stored as `WHATSAPP_ACCESS_TOKEN`.
5. [ ] `WHATSAPP_APP_SECRET` set (already done for this project).
6. [ ] `business_account_id`, `phone_number_id`, `display_phone_number` saved on the admin Setup page.
7. [ ] Webhook verified (`status = verified` in admin Setup) and subscribed to `messages`.
8. [ ] At least the required transactional templates (Section 10) submitted and **Approved** in WhatsApp Manager.
9. [ ] Test send + test inbound reply confirmed end-to-end via curl and the admin Inbox.
10. [ ] Rate limits reviewed — new numbers start in **Tier 1** (250 business-initiated conversations/24h) and scale automatically with quality rating and volume; check **WhatsApp Manager → Overview → Messaging Limits**.
11. [ ] Business profile (About, address, category, logo) filled in under WhatsApp Manager for a fully verified look.

---

## 10. Message templates to submit

Templates are created in **Meta Business Suite → WhatsApp Manager → Account Tools → Message Templates → Create Template** (or via the Graph API `POST /{business_account_id}/message_templates`). Each language variant of a template must be submitted separately with the **same template name**. Meta reviews templates, usually within minutes to a few hours.

General fields for every template below:
- **Category**: as noted per template (`UTILITY` for transactional/status updates, `MARKETING` for re-engagement).
- Variables use `{{1}}`, `{{2}}`, … in the body; provide one sample value per variable when submitting.
- Buttons are optional — Quick Reply or Call-to-Action (URL/Phone) as noted.

### 10.1 Welcome / Lead acknowledgement

**Name**: `welcome_lead`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, thanks for reaching out to us! We've received your enquiry about {{2}} and our team will get back to you within 24 hours." | `{{1}}`: Riya, `{{2}}`: Digital Marketing | Quick Reply: "Talk to us now" |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, हमसे संपर्क करने के लिए धन्यवाद! हमें {{2}} से जुड़ी आपकी पूछताछ मिल गई है और हमारी टीम 24 घंटे में आपसे संपर्क करेगी।" | `{{1}}`: रिया, `{{2}}`: डिजिटल मार्केटिंग | Quick Reply: "अभी बात करें" |

### 10.2 Strategy call booking confirmation

**Name**: `call_booking_confirmation`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, your strategy call is confirmed for {{2}} at {{3}}. We'll call you on this number. Reply RESCHEDULE if you need a different time." | `{{1}}`: Aman, `{{2}}`: 12 March 2025, `{{3}}`: 4:00 PM IST | Quick Reply: "Add to calendar" |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, आपकी स्ट्रैटेजी कॉल {{2}} को {{3}} बजे के लिए कन्फर्म हो गई है। हम इसी नंबर पर कॉल करेंगे। समय बदलने के लिए RESCHEDULE लिखें।" | `{{1}}`: अमन, `{{2}}`: 12 मार्च 2025, `{{3}}`: शाम 4:00 बजे | Quick Reply: "कैलेंडर में जोड़ें" |

### 10.3 Call reminder

**Name**: `call_reminder`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Reminder: your strategy call with {{1}} is in {{2}} at {{3}}. Please be ready to join." | `{{1}}`: our team, `{{2}}`: 30 minutes, `{{3}}`: 4:00 PM IST | Quick Reply: "Confirm" / "Reschedule" |
| Hindi (`hi`) | UTILITY | "रिमाइंडर: {{1}} के साथ आपकी स्ट्रैटेजी कॉल {{2}} में {{3}} बजे है। कृपया जुड़ने के लिए तैयार रहें।" | `{{1}}`: हमारी टीम, `{{2}}`: 30 मिनट, `{{3}}`: शाम 4:00 बजे | Quick Reply: "पुष्टि करें" / "रीशेड्यूल करें" |

### 10.4 Quotation sent

**Name**: `quotation_sent`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, your quotation #{{2}} for {{3}} is ready — total {{4}}. Please review it at the link below." | `{{1}}`: Priya, `{{2}}`: Q-1042, `{{3}}`: SEO Package, `{{4}}`: ₹45,000 | CTA URL: "View Quotation" → `https://yourdomain.com/quotations/{{1}}` |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, {{3}} के लिए आपका कोटेशन #{{2}} तैयार है — कुल राशि {{4}}। कृपया नीचे दिए गए लिंक पर इसे देखें।" | `{{1}}`: प्रिया, `{{2}}`: Q-1042, `{{3}}`: SEO पैकेज, `{{4}}`: ₹45,000 | CTA URL: "कोटेशन देखें" |

### 10.5 Invoice sent

**Name**: `invoice_sent`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, invoice #{{2}} for {{3}} of amount {{4}} has been generated. Due date: {{5}}." | `{{1}}`: Karan, `{{2}}`: INV-2201, `{{3}}`: March services, `{{4}}`: ₹60,000, `{{5}}`: 20 March 2025 | CTA URL: "View Invoice" |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, {{3}} के लिए इनवॉइस #{{2}}, राशि {{4}}, तैयार हो गया है। भुगतान की अंतिम तिथि: {{5}}।" | `{{1}}`: करण, `{{2}}`: INV-2201, `{{3}}`: मार्च सेवाएं, `{{4}}`: ₹60,000, `{{5}}`: 20 मार्च 2025 | CTA URL: "इनवॉइस देखें" |

### 10.6 Payment reminder

**Name**: `payment_reminder`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, this is a reminder that invoice #{{2}} of {{3}} is due on {{4}}. Please make the payment to avoid service interruption." | `{{1}}`: Neha, `{{2}}`: INV-2201, `{{3}}`: ₹60,000, `{{4}}`: 20 March 2025 | CTA URL: "Pay Now" |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, यह एक रिमाइंडर है कि इनवॉइस #{{2}}, राशि {{3}}, की अंतिम तिथि {{4}} है। सेवा बाधित होने से बचने के लिए कृपया भुगतान करें।" | `{{1}}`: नेहा, `{{2}}`: INV-2201, `{{3}}`: ₹60,000, `{{4}}`: 20 मार्च 2025 | CTA URL: "अभी भुगतान करें" |

### 10.7 Payment received

**Name**: `payment_received`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, we've received your payment of {{2}} for invoice #{{3}}. Thank you!" | `{{1}}`: Sanjay, `{{2}}`: ₹60,000, `{{3}}`: INV-2201 | Quick Reply: "Get receipt" |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, हमें इनवॉइस #{{3}} के लिए आपका {{2}} का भुगतान मिल गया है। धन्यवाद!" | `{{1}}`: संजय, `{{2}}`: ₹60,000, `{{3}}`: INV-2201 | Quick Reply: "रसीद प्राप्त करें" |

### 10.8 Monthly report ready

**Name**: `monthly_report_ready`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, your performance report for {{2}} is ready. Key highlight: {{3}}. Click below to view the full report." | `{{1}}`: Tanya, `{{2}}`: February 2025, `{{3}}`: 32% traffic growth | CTA URL: "View Report" |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, {{2}} के लिए आपकी परफॉर्मेंस रिपोर्ट तैयार है। मुख्य हाइलाइट: {{3}}। पूरी रिपोर्ट देखने के लिए नीचे क्लिक करें।" | `{{1}}`: तान्या, `{{2}}`: फरवरी 2025, `{{3}}`: 32% ट्रैफ़िक वृद्धि | CTA URL: "रिपोर्ट देखें" |

### 10.9 Approval needed

**Name**: `approval_needed`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | UTILITY | "Hi {{1}}, we need your approval on {{2}} before we proceed. Please review and approve at your earliest convenience." | `{{1}}`: Rohit, `{{2}}`: the March content calendar | Quick Reply: "Approve" / "Request changes" |
| Hindi (`hi`) | UTILITY | "नमस्ते {{1}}, आगे बढ़ने से पहले हमें {{2}} पर आपकी मंज़ूरी चाहिए। कृपया जल्द से जल्द इसे देखें और मंज़ूर करें।" | `{{1}}`: रोहित, `{{2}}`: मार्च कंटेंट कैलेंडर | Quick Reply: "मंज़ूर करें" / "बदलाव चाहिए" |

### 10.10 Re-engagement

**Name**: `reengagement_checkin`
| Language | Category | Body | Sample values | Buttons |
|---|---|---|---|---|
| English (`en`) | MARKETING | "Hi {{1}}, it's been a while! We've launched new {{2}} services that could help grow {{3}}. Want a quick free consult?" | `{{1}}`: Meera, `{{2}}`: performance marketing, `{{3}}`: your business | Quick Reply: "Yes, book a call" / "Not now" |
| Hindi (`hi`) | MARKETING | "नमस्ते {{1}}, काफी समय हो गया! हमने नई {{2}} सेवाएं शुरू की हैं जो {{3}} को बढ़ाने में मदद कर सकती हैं। क्या आप एक मुफ्त कंसल्ट बुक करना चाहेंगे?" | `{{1}}`: मीरा, `{{2}}`: परफॉर्मेंस मार्केटिंग, `{{3}}`: आपके बिज़नेस | Quick Reply: "हां, कॉल बुक करें" / "अभी नहीं" |

> After submission, run the app's **whatsapp-templates-sync** function (or the "Sync Templates" button in **Dashboard → Admin → WhatsApp Hub → Templates**) to pull the approved templates and their status into the app's `whatsapp_templates` table.

---

## 11. Troubleshooting

| Error code | Meaning | Fix |
|---|---|---|
| **131047** | Message failed — outside the 24-hour customer service window (re-engagement window closed). | Only a pre-approved **template** message can be sent to reopen the conversation; free-form text only works within 24h of the customer's last inbound message. |
| **132000** | Template parameter count/format mismatch. | Ensure the number and order of `{{n}}` parameters sent in the API call exactly matches the approved template body (and any header/button variables), and that parameter `type` (text/currency/date_time) matches. |
| **190** | Access token expired or invalid. | The temporary token from "API Setup" expires in ~24h — always use the permanent System User token (Section 4). If it still fails, regenerate the token and update `WHATSAPP_ACCESS_TOKEN` in Supabase secrets. |
| **131026** | Message undeliverable (e.g. recipient's number not on WhatsApp, or number opted out). | Verify the recipient number is in valid E.164 format and has WhatsApp installed; check if the user has blocked the business number. |
| **Webhook not verifying (403 on GET)** | `hub.verify_token` sent by Meta doesn't match `webhook_verify_token` in `whatsapp_settings`, or there are multiple/zero rows in that table. | Re-copy the Verify Token from the admin Setup page into Meta exactly (no extra spaces), confirm `whatsapp_settings` has exactly one row, and retry **Verify and Save** in Meta. |
| **131009** | Parameter value invalid (e.g. bad phone number format). | Recipient numbers must be in international format without `+` or leading zeros stripped correctly, e.g. `919876543210`. |
| **Signature check failing on inbound webhook (silent 403 from `whatsapp-webhook`)** | `WHATSAPP_APP_SECRET` in Supabase doesn't match the app's actual App Secret. | Re-copy App Secret from **App Dashboard → Settings → Basic** and update the Supabase secret. |

---

## 12. Pricing and the 24-hour window

1. WhatsApp Cloud API charges **per conversation** (a 24-hour session), not per message — categorized as **Marketing**, **Utility**, **Authentication**, or **Service** conversations, each priced differently by country. Pricing is billed to the Meta Business/WhatsApp Manager's linked payment method.
2. A **user-initiated (service) conversation** opens for free-form replies for **24 hours** from the customer's last inbound message; you can send unlimited free-form text within that window at no extra template cost (service conversation pricing may still apply in some markets).
3. To message a customer **outside** that 24-hour window (e.g. reminders, re-engagement, proactive notifications), you must use an **approved template message**, which opens a new business-initiated conversation and is billed accordingly.
4. First 1,000 business-initiated conversations per WABA per month are typically free (subject to Meta's current pricing terms — verify current rates in **WhatsApp Manager → Billing**, as Meta has periodically changed this policy).
5. Template messages sent to numbers that never messaged you first still count as business-initiated conversations and are billed even if delivered successfully.
6. Keep template **quality rating** high (avoid spammy/rejected sends) — poor quality ratings can pause your ability to send templates and cap your messaging tier.
