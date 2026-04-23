// Send WhatsApp message via Meta Cloud API.
// Requires: WHATSAPP_ACCESS_TOKEN secret + whatsapp_settings configured.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { conversation_id, body } = await req.json();
    if (!conversation_id || !body) {
      return new Response(JSON.stringify({ error: "conversation_id and body required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: settings } = await supa.from("whatsapp_settings").select("*").maybeSingle();
    if (!settings || settings.status !== "verified") {
      return new Response(JSON.stringify({ error: "WhatsApp not configured" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "WHATSAPP_ACCESS_TOKEN secret not set" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: conv } = await supa.from("whatsapp_conversations").select("phone_number").eq("id", conversation_id).single();
    if (!conv) {
      return new Response(JSON.stringify({ error: "Conversation not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Send via Cloud API
    const res = await fetch(`https://graph.facebook.com/v20.0/${settings.phone_number_id}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: conv.phone_number, type: "text", text: { body } }),
    });
    const result = await res.json();

    // Persist outbound message
    await supa.from("whatsapp_messages_v2").insert({
      conversation_id,
      direction: "outbound",
      body,
      meta_message_id: result.messages?.[0]?.id,
      status: res.ok ? "sent" : "failed",
      error_message: res.ok ? null : JSON.stringify(result),
      sent_at: new Date().toISOString(),
    });

    await supa.from("whatsapp_conversations").update({
      last_message_at: new Date().toISOString(),
      last_message_text: body,
    }).eq("id", conversation_id);

    return new Response(JSON.stringify({ ok: res.ok, result }), { status: res.ok ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("whatsapp-send error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
