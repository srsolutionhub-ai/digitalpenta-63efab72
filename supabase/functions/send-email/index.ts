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

    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supaUrl, service);

    // --- Who is calling? Internal functions (service key) and staff may send any template.
    const bearer = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    let trusted = bearer.length > 0 && bearer === service;
    if (!trusted && bearer) {
      const { data: u } = await sb.auth.getUser(bearer);
      if (u?.user) {
        const { data: staff } = await sb.rpc("is_staff", { _uid: u.user.id });
        trusted = staff === true;
      }
    }
    if (!trusted) {
      // Public visitors may only trigger their own newsletter welcome email, right after subscribing.
      if (template !== "newsletter-welcome" || typeof to !== "string") return json({ error: "Not allowed" }, 403);
      const email = to.trim().toLowerCase();
      const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: sub } = await sb.from("newsletter_subscribers").select("id").eq("email", email).gte("created_at", since).maybeSingle();
      if (!sub) return json({ error: "Not allowed" }, 403);
      const { count } = await sb.from("email_send_log").select("id", { count: "exact", head: true })
        .eq("template", "newsletter-welcome").eq("to_email", email);
      if ((count ?? 0) > 0) return json({ ok: true, skipped: true });
    }

    const templateData = sanitizeData(body?.data ?? {}, trusted);

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
      return json({ error: "Send failed" }, 502);
    }

    return json({ ok: true, id: parsed?.id, subject: rendered.subject });
  } catch (e) {
    console.error("send-email error:", e);
    return json({ error: "internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const ALLOWED_LINK_HOSTS = ["digitalpenta.com", "www.digitalpenta.com", "digitalpenta.lovable.app", "ygoxxqkcxunuowtuwdxr.supabase.co", "cal.com", "meet.google.com", "zoom.us"];

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function safeLink(v: string): string | undefined {
  try {
    const u = new URL(v);
    if (u.protocol !== "https:") return undefined;
    const ok = ALLOWED_LINK_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith("." + h));
    return ok ? u.toString() : undefined;
  } catch { return undefined; }
}

/** Escapes every text value placed into email HTML and only keeps links to our own trusted sites. */
function sanitizeData(data: Record<string, unknown>, trusted: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data ?? {})) {
    if (typeof v === "string") {
      if (k === "bodyHtml") { if (trusted) out[k] = v; continue; }
      if (/Url$/.test(k)) { const l = safeLink(v); if (l) out[k] = l; continue; }
      out[k] = escapeHtml(v.slice(0, 2000));
    } else if (typeof v === "number" || typeof v === "boolean") {
      out[k] = v;
    }
  }
  return out;
}
