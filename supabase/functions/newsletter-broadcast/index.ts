// Newsletter broadcast: sends a subject + HTML body to all matching subscribers
// via the send-email function. Admin-only. Logs to newsletter_campaigns.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    const userClient = createClient(supaUrl, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) return json({ error: "unauthorized" }, 401);

    const admin = createClient(supaUrl, service);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id);
    const allowed = (roles ?? []).some((r: any) => r.role === "super_admin" || r.role === "content_writer");
    if (!allowed) return json({ error: "forbidden" }, 403);

    const { subject, bodyHtml, audience } = await req.json().catch(() => ({}));
    if (!subject || !bodyHtml) return json({ error: "subject + bodyHtml required" }, 400);

    let subQ = admin.from("newsletter_subscribers").select("email,name,unsub_token").is("unsubscribed_at", null);
    if (audience === "confirmed") subQ = subQ.eq("status", "confirmed");
    const { data: subs, error: subErr } = await subQ;
    if (subErr) return json({ error: subErr.message }, 500);
    const recipients = subs ?? [];

    // Create campaign row
    const { data: campaign } = await admin
      .from("newsletter_campaigns")
      .insert({
        subject, body_html: bodyHtml,
        audience_filter: { type: audience },
        status: "sending",
        recipient_count: recipients.length,
        created_by: userData.user.id,
      })
      .select().single();

    let sent = 0, failed = 0;
    for (const r of recipients) {
      try {
        const resp = await admin.functions.invoke("send-email", {
          body: {
            template: "newsletter-broadcast",
            to: r.email,
            data: {
              subject,
              bodyHtml,
              name: r.name ?? "Friend",
              unsubUrl: `https://digitalpenta.com/unsubscribe?token=${r.unsub_token}`,
            },
          },
        });
        if (resp.error) failed++; else sent++;
      } catch (e) {
        console.error("send failed", r.email, e);
        failed++;
      }
    }

    await admin
      .from("newsletter_campaigns")
      .update({ status: "sent", sent_count: sent, failed_count: failed, sent_at: new Date().toISOString() })
      .eq("id", campaign?.id);

    return json({ ok: true, sent, failed, total: recipients.length });
  } catch (e) {
    console.error("newsletter-broadcast error", e);
    return json({ error: e instanceof Error ? e.message : "internal error" }, 500);
  }
});
