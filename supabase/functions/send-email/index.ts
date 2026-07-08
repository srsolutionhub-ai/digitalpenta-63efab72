// Unified Resend email dispatcher via connector gateway.
// POST body: { template: TemplateName, to: string | string[], data: object, teamCopy?: boolean }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { templates, type TemplateName } from "./templates.ts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "Digital Penta <onboarding@resend.dev>"; // switch to hello@digitalpenta.com after domain verified

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return json({ error: "Email service not configured" }, 500);
    }

    const body = await req.json().catch(() => null);
    const template = body?.template as TemplateName;
    const to = body?.to;
    const templateData = body?.data ?? {};

    if (!template || !(template in templates)) {
      return json({ error: `Unknown template: ${template}` }, 400);
    }
    if (!to || (typeof to !== "string" && !Array.isArray(to))) {
      return json({ error: "to (email) required" }, 400);
    }

    const rendered = (templates[template] as (d: any) => { subject: string; html: string; text: string })(templateData);
    const recipients = Array.isArray(to) ? to : [to];

    const resendRes = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM,
        to: recipients,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      }),
    });

    const resendBody = await resendRes.text();
    let parsed: any = null;
    try { parsed = JSON.parse(resendBody); } catch { /* not JSON */ }

    // Log to email_send_log (best effort)
    try {
      const supaUrl = Deno.env.get("SUPABASE_URL")!;
      const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supaUrl, service);
      await sb.from("email_send_log").insert({
        template,
        to_email: recipients.join(","),
        subject: rendered.subject,
        status: resendRes.ok ? "sent" : "failed",
        resend_id: parsed?.id ?? null,
        error: resendRes.ok ? null : resendBody.slice(0, 500),
        metadata: { template_data: templateData },
      });
    } catch (logErr) {
      console.error("email log failed:", logErr);
    }

    if (!resendRes.ok) {
      console.error("Resend failed:", resendRes.status, resendBody);
      return json({ error: "Send failed", status: resendRes.status, details: resendBody }, resendRes.status);
    }

    return json({ ok: true, id: parsed?.id, subject: rendered.subject });
  } catch (e) {
    console.error("send-email error:", e);
    return json({ error: e instanceof Error ? e.message : "internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
