// WhatsApp Cloud API webhook handler.
// - GET: verifies the webhook subscription using the saved verify_token.
// - POST: persists incoming messages and updates the conversation thread.
// Deploys with verify_jwt = false (Meta cannot send a Supabase JWT).
//
// Bot rules (public.wa_bot_rules) drive auto-replies. `match_type` values:
//   "keyword"  (default) — reply_text sent when an incoming message contains
//              one of `keywords`. Set handover=true to flag the chat for a
//              human and stop further bot replies on that conversation.
//   "away"     — at most one active row. `keywords` encodes the business
//              hours window as config strings, e.g.
//              ["days=1,2,3,4,5","start=09:00","end=18:00","tz=Europe/London"].
//              When an inbound message arrives outside that window,
//              `reply_text` (the away/out-of-hours message) is sent instead
//              of the normal keyword rules.
//   "fallback" — at most one active row. Sent when the message is inside
//              business hours (or no away rule is configured) and no
//              keyword rule matched — keeps every inbound message answered
//              instead of going silent.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function parseConfig(keywords: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keywords || []) {
    const [key, ...rest] = k.split("=");
    if (key && rest.length) out[key.trim()] = rest.join("=").trim();
  }
  return out;
}

// Returns true when `now` falls outside the away-rule's configured business hours.
// Missing/unparseable config is treated as "always open" (no away message sent).
function isOutsideHours(awayRule: any, now = new Date()): boolean {
  const cfg = parseConfig(awayRule?.keywords || []);
  if (!cfg.start || !cfg.end) return false;
  const tz = cfg.tz || "UTC";
  let parts: Record<string, string> = {};
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour12: false, weekday: "short", hour: "2-digit", minute: "2-digit",
    });
    parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  } catch {
    return false;
  }
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day = dayMap[parts.weekday ?? ""] ?? now.getUTCDay();
  const allowedDays = (cfg.days || "1,2,3,4,5").split(",").map((d) => Number(d.trim()));
  if (!allowedDays.includes(day)) return true;
  const minutesNow = Number(parts.hour) * 60 + Number(parts.minute);
  const [sh, sm] = cfg.start.split(":").map(Number);
  const [eh, em] = cfg.end.split(":").map(Number);
  const startMin = sh * 60 + (sm || 0);
  const endMin = eh * 60 + (em || 0);
  return minutesNow < startMin || minutesNow > endMin;
}

async function sendBotReply(supa: any, phone: string, phoneNumberId: string, token: string, convId: string, replyText: string, handover: boolean) {
  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "text", text: { body: replyText } }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) console.error(`Bot reply failed [${res.status}]`, JSON.stringify(out));
  await supa.from("whatsapp_messages_v2").insert({
    conversation_id: convId, direction: "outbound", body: replyText,
    meta_message_id: out?.messages?.[0]?.id ?? null,
    status: res.ok ? "sent" : "failed", error_message: res.ok ? null : JSON.stringify(out).slice(0, 500),
  });
  if (handover) await supa.from("whatsapp_conversations").update({ status: "handover" }).eq("id", convId);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supa = createClient(supabaseUrl, supabaseKey);
  const url = new URL(req.url);

  // GET — Meta's verification handshake
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const { data: settings } = await supa.from("whatsapp_settings").select("webhook_verify_token").maybeSingle();

    if (mode === "subscribe" && settings?.webhook_verify_token && token === settings.webhook_verify_token) {
      // Mark verified
      await supa.from("whatsapp_settings").update({ status: "verified", last_verified_at: new Date().toISOString() }).eq("webhook_verify_token", token);
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // POST — incoming messages
  if (req.method === "POST") {
    try {
      // Read raw body for HMAC signature verification
      const rawBody = await req.arrayBuffer();
      const APP_SECRET = Deno.env.get("WHATSAPP_APP_SECRET");
      if (!APP_SECRET) {
        console.error("WHATSAPP_APP_SECRET not configured — rejecting webhook");
        return new Response("Forbidden", { status: 403 });
      }
      const sigHeader = req.headers.get("x-hub-signature-256") ?? "";
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(APP_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const sigBuf = await crypto.subtle.sign("HMAC", key, rawBody);
      const expected = "sha256=" + Array.from(new Uint8Array(sigBuf))
        .map((b) => b.toString(16).padStart(2, "0")).join("");
      // Constant-time-ish comparison
      const a = new TextEncoder().encode(sigHeader);
      const b = new TextEncoder().encode(expected);
      let mismatch = a.length ^ b.length;
      for (let i = 0; i < Math.min(a.length, b.length); i++) mismatch |= a[i] ^ b[i];
      if (mismatch !== 0) {
        return new Response("Forbidden", { status: 403 });
      }

      const body = JSON.parse(new TextDecoder().decode(rawBody));
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const messages = change?.messages || [];
      const contacts = change?.contacts || [];

      for (const msg of messages) {
        const phone = msg.from;
        const contactName = contacts.find((c: any) => c.wa_id === phone)?.profile?.name || null;
        const messageText = msg.text?.body || `[${msg.type}]`;

        // Find or create conversation
        const { data: existing } = await supa.from("whatsapp_conversations").select("id, unread_count").eq("phone_number", phone).maybeSingle();
        let convId = existing?.id;
        if (!convId) {
          const { data: created } = await supa.from("whatsapp_conversations").insert({
            phone_number: phone,
            contact_name: contactName,
            status: "open",
            last_message_at: new Date().toISOString(),
            last_message_text: messageText,
            unread_count: 1,
          }).select("id").single();
          convId = created?.id;
        } else {
          await supa.from("whatsapp_conversations").update({
            last_message_at: new Date().toISOString(),
            last_message_text: messageText,
            unread_count: (existing?.unread_count || 0) + 1,
          }).eq("id", convId);
        }

        if (convId) {
          await supa.from("whatsapp_messages_v2").insert({
            conversation_id: convId,
            direction: "inbound",
            body: messageText,
            meta_message_id: msg.id,
            status: "received",
          });

          // Auto-reply rules (skipped once a conversation is handed to a person)
          const { data: conv } = await supa.from("whatsapp_conversations").select("status").eq("id", convId).maybeSingle();
          const text = (msg.text?.body || "").toLowerCase();
          if (text && conv?.status !== "handover") {
            const { data: rules } = await supa.from("wa_bot_rules").select("*").eq("is_active", true).order("priority", { ascending: false });
            const words = text.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
            const keywordRules = (rules || []).filter((r: any) => (r.match_type || "keyword") === "keyword");
            const awayRule = (rules || []).find((r: any) => r.match_type === "away");
            const fallbackRule = (rules || []).find((r: any) => r.match_type === "fallback");

            const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
            const { data: settings } = await supa.from("whatsapp_settings").select("phone_number_id").limit(1).maybeSingle();

            if (token && settings?.phone_number_id) {
              const outOfHours = awayRule ? isOutsideHours(awayRule) : false;

              if (outOfHours) {
                // Out of business hours — send the away message, no keyword matching.
                await sendBotReply(supa, phone, settings.phone_number_id, token, convId, awayRule.reply_text, awayRule.handover);
              } else {
                const rule = keywordRules.find((r: any) => (r.keywords || []).some((k: string) => (k.includes(" ") ? text.includes(k) : words.includes(k))));
                if (rule) {
                  await sendBotReply(supa, phone, settings.phone_number_id, token, convId, rule.reply_text, rule.handover);
                } else if (fallbackRule) {
                  // No keyword matched — keep every message answered with the fallback reply.
                  await sendBotReply(supa, phone, settings.phone_number_id, token, convId, fallbackRule.reply_text, fallbackRule.handover);
                }
              }
            }
          }
        }
      }

      // Delivery receipts: sent → delivered → read / failed
      for (const st of change?.statuses || []) {
        if (!st.id || !st.status) continue;
        await supa.from("whatsapp_messages_v2").update({
          status: st.status,
          error_message: st.errors?.[0]?.title ?? null,
        }).eq("meta_message_id", st.id);
      }


      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (e: any) {
      console.error("whatsapp-webhook error:", e);
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
