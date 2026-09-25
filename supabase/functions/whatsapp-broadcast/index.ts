// Sends a WhatsApp template broadcast to a lead audience.
// Body: { broadcast_id: string }
// The broadcast row (name, template_id, audience_filter) must already exist in wa_broadcasts.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_RECIPIENTS = 500;
const SEND_DELAY_MS = 250;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

function renderBody(bodyText: string, leadName: string | null) {
  if (!bodyText.includes("{{1}}")) return bodyText;
  return bodyText.replace(/\{\{1\}\}/g, leadName || "there");
}

async function runBroadcast(supa: any, broadcastId: string) {
  const { data: broadcast } = await supa.from("wa_broadcasts").select("*").eq("id", broadcastId).single();
  if (!broadcast) return;

  const { data: template } = await supa.from("whatsapp_templates").select("*").eq("id", broadcast.template_id).maybeSingle();
  if (!template) {
    await supa.from("wa_broadcasts").update({ status: "failed" }).eq("id", broadcastId);
    return;
  }

  const { data: settings } = await supa.from("whatsapp_settings").select("*").maybeSingle();
  const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  if (!settings?.phone_number_id || !accessToken) {
    await supa.from("wa_broadcasts").update({ status: "failed" }).eq("id", broadcastId);
    return;
  }

  const filter = broadcast.audience_filter || {};
  let q = supa.from("leads").select("id,name,phone,service,status,source").not("phone", "is", null).neq("phone", "");
  if (filter.service) q = q.eq("service", filter.service);
  if (filter.status) q = q.eq("status", filter.status);
  if (filter.source) q = q.eq("source", filter.source);
  const { data: leads } = await q.limit(MAX_RECIPIENTS);
  const recipients = leads ?? [];

  await supa.from("wa_broadcasts").update({ status: "sending", recipient_count: recipients.length }).eq("id", broadcastId);

  let sent = 0;
  let failed = 0;

  const components: any[] = [];
  if (Array.isArray(template.variables) && template.variables.length) {
    // We only support a single {{1}} = lead name for now.
  }

  for (const lead of recipients) {
    try {
      const phone = String(lead.phone).replace(/[^\d+]/g, "");
      const bodyParams = Array.isArray(template.variables) && template.variables.length
        ? [{ type: "text", text: lead.name || "there" }]
        : [];

      const templatePayload: any = {
        name: template.name,
        language: { code: template.language || "en" },
      };
      if (bodyParams.length) {
        templatePayload.components = [{ type: "body", parameters: bodyParams }];
      }

      const res = await fetch(`https://graph.facebook.com/v20.0/${settings.phone_number_id}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "template", template: templatePayload }),
      });
      const result = await res.json();

      // Find or create conversation
      let convId: string | undefined;
      const { data: existingConv } = await supa.from("whatsapp_conversations").select("id").eq("phone_number", phone).maybeSingle();
      if (existingConv?.id) {
        convId = existingConv.id;
      } else {
        const { data: created } = await supa.from("whatsapp_conversations").insert({
          phone_number: phone,
          contact_name: lead.name || null,
          status: "open",
          last_message_at: new Date().toISOString(),
          last_message_text: renderBody(template.body_text, lead.name),
        }).select("id").single();
        convId = created?.id;
      }

      const renderedBody = renderBody(template.body_text, lead.name);
      if (convId) {
        await supa.from("whatsapp_messages_v2").insert({
          conversation_id: convId,
          direction: "outbound",
          body: renderedBody,
          template_id: template.id,
          meta_message_id: result.messages?.[0]?.id ?? null,
          status: res.ok ? "sent" : "failed",
          error_message: res.ok ? null : JSON.stringify(result).slice(0, 500),
        });
        await supa.from("whatsapp_conversations").update({
          last_message_at: new Date().toISOString(),
          last_message_text: renderedBody,
        }).eq("id", convId);
      }

      if (res.ok) sent++; else { failed++; console.error("Broadcast send failed:", JSON.stringify(result)); }
    } catch (e) {
      failed++;
      console.error("Broadcast recipient error:", e);
    }

    await supa.from("wa_broadcasts").update({ sent_count: sent, failed_count: failed }).eq("id", broadcastId);
    await new Promise((r) => setTimeout(r, SEND_DELAY_MS));
  }

  await supa.from("wa_broadcasts").update({
    status: "completed",
    sent_count: sent,
    failed_count: failed,
    sent_at: new Date().toISOString(),
  }).eq("id", broadcastId);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: userData, error: userErr } = await supa.auth.getUser(token);
    const user = userData?.user;
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    const { data: roles } = await supa.from("user_roles").select("role").eq("user_id", user.id);
    const allowed = (roles ?? []).some((r: any) => ["super_admin", "account_manager"].includes(r.role));
    if (!allowed) return json({ error: "Forbidden" }, 403);

    const { broadcast_id } = await req.json();
    if (!broadcast_id) return json({ error: "broadcast_id required" }, 400);

    const { data: settings } = await supa.from("whatsapp_settings").select("phone_number_id").maybeSingle();
    if (!settings?.phone_number_id) return json({ error: "WhatsApp not configured" }, 400);
    if (!Deno.env.get("WHATSAPP_ACCESS_TOKEN")) return json({ error: "WHATSAPP_ACCESS_TOKEN secret not set" }, 400);

    // Run in the background so large broadcasts don't hit the request timeout;
    // progress is tracked via wa_broadcasts.sent_count/failed_count/status.
    // deno-lint-ignore no-explicit-any
    (globalThis as any).EdgeRuntime?.waitUntil(runBroadcast(supa, broadcast_id));
    if (!(globalThis as any).EdgeRuntime) {
      // Fallback: await inline if EdgeRuntime.waitUntil isn't available in this env.
      await runBroadcast(supa, broadcast_id);
    }

    return json({ ok: true, status: "started" });
  } catch (e: any) {
    console.error("whatsapp-broadcast error:", e);
    return json({ error: e.message }, 500);
  }
});
