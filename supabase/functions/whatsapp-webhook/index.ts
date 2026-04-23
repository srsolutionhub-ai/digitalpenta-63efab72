// WhatsApp Cloud API webhook handler.
// - GET: verifies the webhook subscription using the saved verify_token.
// - POST: persists incoming messages and updates the conversation thread.
// Deploys with verify_jwt = false (Meta cannot send a Supabase JWT).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
      const body = await req.json();
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
        }
      }

      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (e: any) {
      console.error("whatsapp-webhook error:", e);
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
