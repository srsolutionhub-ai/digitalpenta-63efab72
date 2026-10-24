// Due-date reminder hook for invoices. Intended to be triggered by a daily
// pg_cron job (see report SQL) hitting this endpoint with the service role,
// or manually/from an admin "Send reminders now" button.
// Sends "due soon" (T-3 days) and "overdue" reminders via send-email, and
// (best-effort) stamps a reminder_sent_at column if it exists on invoices.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { formatCurrency } from "../_shared/format.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    const token = req.headers.get("x-cron-token") ?? "";
    const { data: ok } = token ? await sb.rpc("verify_cron_token", { _token: token }) : { data: false };
    if (!ok) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const today = new Date().toISOString().slice(0, 10);
    const in3Days = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

    const { data: invoices, error } = await sb
      .from("invoices")
      .select("id, invoice_number, client_name, client_email, total, currency, due_date, status, reminder_sent_at")
      .not("status", "in", '("paid","cancelled","draft")')
      .not("due_date", "is", null)
      .lte("due_date", in3Days);

    if (error) throw error;

    let sent = 0;
    for (const inv of invoices ?? []) {
      const overdue = inv.due_date < today;
      // Don't resend a reminder already sent in the last 3 days.
      if (inv.reminder_sent_at && Date.now() - new Date(inv.reminder_sent_at).getTime() < 3 * 86400000) continue;
      const total = formatCurrency(Number(inv.total), inv.currency || "INR");
      try {
        const { data: sendRes, error: sendErr } = await sb.functions.invoke("send-email", {
          body: {
            template: "invoice-reminder",
            to: inv.client_email,
            data: { name: inv.client_name, invoiceNumber: inv.invoice_number, total, dueDate: inv.due_date, overdue },
          },
        });
        if (sendErr || (sendRes && sendRes.ok === false)) {
          throw sendErr ?? new Error("send-email reported failure");
        }
        sent++;
        await sb.from("invoices").update({
          reminder_sent_at: new Date().toISOString(),
          ...(overdue && inv.status !== "overdue" ? { status: "overdue" } : {}),
        }).eq("id", inv.id);
      } catch (e) {
        console.error(`reminder failed for ${inv.invoice_number}:`, e);
      }
    }

    return json({ ok: true, checked: invoices?.length ?? 0, sent });
  } catch (e) {
    console.error("invoice-reminders error:", e);
    return json({ error: e instanceof Error ? e.message : "internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
