// Sequence runner: sends due email_sequence_enrollments steps via the Resend gateway
// (same pattern as send-email), logs to email_send_log, adds an open pixel + click
// redirect (via email-track), then advances the enrollment.
// Callable by staff JWT or x-cron-secret header matching CRON_SECRET env (if set).
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "Digital Penta <onboarding@resend.dev>";
const BATCH_MAX = 50;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function renderMerge(html: string, name: string) {
  return html.replace(/\{\{\s*name\s*\}\}/gi, name || "there");
}

/** Rewrite <a href="http...">, adding a tracked redirect, and append an open pixel. */
function instrument(html: string, enrollmentId: string, trackBase: string) {
  const withClicks = html.replace(/href="(https?:\/\/[^"]+)"/gi, (_m, url) => {
    const tracked = `${trackBase}?e=${encodeURIComponent(enrollmentId)}&t=click&u=${encodeURIComponent(url)}`;
    return `href="${tracked}"`;
  });
  const pixel = `<img src="${trackBase}?e=${encodeURIComponent(enrollmentId)}&t=open" width="1" height="1" style="display:none" alt="" />`;
  return `${withClicks}${pixel}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const cronSecret = Deno.env.get("CRON_SECRET");
    const headerSecret = req.headers.get("x-cron-secret");
    let authorized = false;

    if (cronSecret && headerSecret && headerSecret === cronSecret) {
      authorized = true;
    } else {
      const authHeader = req.headers.get("Authorization") ?? "";
      const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(SUPABASE_URL, anon, { global: { headers: { Authorization: authHeader } } });
      const { data: userData } = await userClient.auth.getUser();
      if (userData.user) {
        const admin = createClient(SUPABASE_URL, SERVICE_KEY);
        const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id);
        authorized = (roles ?? []).some((r: any) =>
          ["super_admin", "content_writer", "account_manager"].includes(r.role));
      }
    }
    if (!authorized) return json({ error: "unauthorized" }, 401);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) return json({ error: "Email service not configured" }, 500);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const trackBase = `${SUPABASE_URL}/functions/v1/email-track`;
    const nowIso = new Date().toISOString();

    const { data: sequences } = await admin.from("email_sequences").select("id").eq("is_active", true);
    const activeSeqIds = (sequences ?? []).map((s: any) => s.id);
    if (!activeSeqIds.length) return json({ ok: true, processed: 0, message: "No active sequences" });

    const { data: due, error: dueErr } = await admin
      .from("email_sequence_enrollments")
      .select("*")
      .eq("status", "active")
      .in("sequence_id", activeSeqIds)
      .lte("next_send_at", nowIso)
      .order("next_send_at", { ascending: true })
      .limit(BATCH_MAX);
    if (dueErr) return json({ error: dueErr.message }, 500);

    let sent = 0, failed = 0, completed = 0;
    const results: unknown[] = [];

    for (const enrollment of due ?? []) {
      try {
        const { data: step } = await admin
          .from("email_sequence_steps")
          .select("*")
          .eq("sequence_id", enrollment.sequence_id)
          .eq("step_order", enrollment.current_step)
          .maybeSingle();

        if (!step) {
          await admin.from("email_sequence_enrollments").update({ status: "completed" }).eq("id", enrollment.id);
          completed++;
          continue;
        }

        const html = instrument(renderMerge(step.body_html, enrollment.name ?? ""), enrollment.id, trackBase);
        const subject = renderMerge(step.subject, enrollment.name ?? "");

        const resendRes = await fetch(`${GATEWAY_URL}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          },
          body: JSON.stringify({ from: FROM, to: [enrollment.email], subject, html }),
        });
        const resendBody = await resendRes.text();
        let parsed: any = null;
        try { parsed = JSON.parse(resendBody); } catch { /* not JSON */ }

        await admin.from("email_send_log").insert({
          template: "sequence-step",
          to_email: enrollment.email,
          subject,
          status: resendRes.ok ? "sent" : "failed",
          resend_id: parsed?.id ?? null,
          error: resendRes.ok ? null : resendBody.slice(0, 500),
          metadata: {
            sequence_id: enrollment.sequence_id,
            enrollment_id: enrollment.id,
            step_order: step.step_order,
          },
        });

        if (!resendRes.ok) {
          failed++;
          await admin.from("email_sequence_enrollments").update({ status: "failed" }).eq("id", enrollment.id);
          results.push({ enrollment: enrollment.id, ok: false, error: resendBody.slice(0, 200) });
          continue;
        }
        sent++;

        const { data: nextStep } = await admin
          .from("email_sequence_steps")
          .select("*")
          .eq("sequence_id", enrollment.sequence_id)
          .eq("step_order", enrollment.current_step + 1)
          .maybeSingle();

        if (nextStep) {
          const nextSendAt = new Date(Date.now() + (nextStep.delay_days ?? 0) * 86_400_000).toISOString();
          await admin.from("email_sequence_enrollments").update({
            current_step: nextStep.step_order,
            next_send_at: nextSendAt,
          }).eq("id", enrollment.id);
        } else {
          await admin.from("email_sequence_enrollments").update({ status: "completed" }).eq("id", enrollment.id);
          completed++;
        }
        results.push({ enrollment: enrollment.id, ok: true });
      } catch (e) {
        console.error("sequence-runner enrollment error", enrollment.id, e);
        failed++;
        await admin.from("email_sequence_enrollments").update({ status: "failed" }).eq("id", enrollment.id).catch(() => {});
      }
    }

    return json({ ok: true, processed: (due ?? []).length, sent, failed, completed, results });
  } catch (e) {
    console.error("sequence-runner error", e);
    return json({ error: e instanceof Error ? e.message : "internal error" }, 500);
  }
});
