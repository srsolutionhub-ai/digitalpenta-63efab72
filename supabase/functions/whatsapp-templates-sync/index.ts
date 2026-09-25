// Syncs WhatsApp message templates from Meta into whatsapp_templates.
// GET https://graph.facebook.com/v20.0/{business_account_id}/message_templates
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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

    const { data: settings } = await supa.from("whatsapp_settings").select("*").maybeSingle();
    if (!settings?.business_account_id) return json({ error: "WhatsApp Business Account ID not configured. Finish setup first." }, 400);

    const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    if (!accessToken) return json({ error: "WHATSAPP_ACCESS_TOKEN secret not set" }, 400);

    const url = `https://graph.facebook.com/v20.0/${settings.business_account_id}/message_templates?fields=name,category,language,status,components,id&limit=250`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const result = await res.json();
    if (!res.ok) {
      console.error("Meta template sync failed:", JSON.stringify(result));
      return json({ error: result?.error?.message || "Meta API error", meta: result }, 502);
    }

    const templates: any[] = result?.data ?? [];
    let upserted = 0;
    for (const t of templates) {
      const components: any[] = t.components ?? [];
      const bodyComp = components.find((c) => c.type === "BODY");
      const headerComp = components.find((c) => c.type === "HEADER");
      const footerComp = components.find((c) => c.type === "FOOTER");
      const buttonsComp = components.find((c) => c.type === "BUTTONS");
      const bodyText = bodyComp?.text || "";
      const varMatches = bodyText.match(/\{\{(\d+)\}\}/g) || [];

      const payload = {
        name: t.name,
        category: (t.category || "MARKETING").toUpperCase(),
        language: t.language || "en",
        header_text: headerComp?.text || null,
        body_text: bodyText,
        footer_text: footerComp?.text || null,
        buttons: buttonsComp?.buttons ?? null,
        variables: varMatches.length ? varMatches.map((_, i) => `{{${i + 1}}}`) : null,
        meta_template_id: t.id,
        meta_status: (t.status || "pending").toLowerCase(),
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await supa
        .from("whatsapp_templates")
        .select("id")
        .eq("name", t.name)
        .eq("language", t.language || "en")
        .maybeSingle();

      if (existing?.id) {
        await supa.from("whatsapp_templates").update(payload).eq("id", existing.id);
      } else {
        await supa.from("whatsapp_templates").insert(payload);
      }
      upserted++;
    }

    return json({ ok: true, synced: upserted });
  } catch (e: any) {
    console.error("whatsapp-templates-sync error:", e);
    return json({ error: e.message }, 500);
  }
});
