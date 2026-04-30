import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  type: "new_lead" | "invoice_created" | "abandoned_draft";
  data: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("resend-email");
    if (!RESEND_API_KEY) {
      throw new Error("Resend API key not configured");
    }

    const payload: EmailPayload = await req.json();

    let subject = "";
    let html = "";
    let to: string | string[] = "support@digitalpenta.com";
    const internalTo = "support@digitalpenta.com";
    const from = "Digital Penta <notifications@digitalpenta.com>";
    let bcc: string | undefined;
    let replyTo: string | undefined;

    if (payload.type === "new_lead") {
      const d = payload.data;
      subject = `🔥 New Lead: ${d.name || "Unknown"} — ${d.service || "General"}`;
      html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6C3BF5, #4F1CD4); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Lead Received</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${d.name || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Email</td><td style="padding: 8px 0;">${d.email || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Phone</td><td style="padding: 8px 0;">${d.phone || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Company</td><td style="padding: 8px 0;">${d.company || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Service</td><td style="padding: 8px 0; color: #6C3BF5; font-weight: 600;">${d.service || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Budget</td><td style="padding: 8px 0;">${d.budget_range || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Message</td><td style="padding: 8px 0;">${d.message || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Source</td><td style="padding: 8px 0;">${d.source || "Website"}</td></tr>
            </table>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://digitalpenta.com/dashboard/admin/leads" style="display: inline-block; background: #6C3BF5; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                View in Dashboard →
              </a>
            </div>
          </div>
          <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); text-align: center; font-size: 12px; color: #6B7280;">
            Digital Penta — Automated Notification
          </div>
        </div>
      `;
    } else if (payload.type === "invoice_created") {
      const d = payload.data;
      subject = `💰 Invoice Created: ${d.invoice_number || ""} — ${d.client_name || "Client"}`;
      html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #059669, #047857); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Invoice Created</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Invoice #</td><td style="padding: 8px 0; font-weight: 600;">${d.invoice_number || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Client</td><td style="padding: 8px 0;">${d.client_name || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Email</td><td style="padding: 8px 0;">${d.client_email || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Amount</td><td style="padding: 8px 0; color: #10B981; font-weight: 700; font-size: 18px;">₹${d.total || "0"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Due Date</td><td style="padding: 8px 0;">${d.due_date || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Status</td><td style="padding: 8px 0;">${d.status || "draft"}</td></tr>
            </table>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://digitalpenta.com/dashboard/admin/billing" style="display: inline-block; background: #6C3BF5; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                View in Billing →
              </a>
            </div>
          </div>
          <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); text-align: center; font-size: 12px; color: #6B7280;">
            Digital Penta — Automated Notification
          </div>
        </div>
      `;
    } else if (payload.type === "abandoned_draft") {
      const d = payload.data as {
        email?: string; name?: string; resumeUrl?: string; source?: string;
      };
      const recipient = (d.email || "").trim();
      // Basic email guard
      if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        return new Response(
          JSON.stringify({ error: "Invalid recipient email" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      to = recipient;
      bcc = internalTo;
      replyTo = "support@digitalpenta.com";
      const greet = d.name ? `Hi ${d.name},` : "Hi there,";
      const resumeUrl = d.resumeUrl || "https://digitalpenta.com/get-proposal";
      subject = "Your Digital Penta proposal draft is waiting 👋";
      html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0D0D1A; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6C3BF5, #4F1CD4); padding: 28px 32px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Your draft is saved</h1>
            <p style="margin: 6px 0 0; opacity: .85; font-size: 13px;">Pick up right where you left off.</p>
          </div>
          <div style="padding: 28px 32px;">
            <p style="margin: 0 0 14px; font-size: 15px;">${greet}</p>
            <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.6; color: #D1D5DB;">
              We noticed you started a custom proposal request on Digital Penta. Your answers are
              safely saved — finish in under 2 minutes and our strategy team will send back a tailored
              growth plan within 48 hours.
            </p>
            <div style="margin: 22px 0; text-align: center;">
              <a href="${resumeUrl}" style="display: inline-block; background: #6C3BF5; color: white; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Resume my proposal →
              </a>
            </div>
            <p style="margin: 16px 0 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
              Prefer to chat? Reply to this email or WhatsApp us at +91-88601-00039.
              If this wasn't you, just ignore this message.
            </p>
          </div>
          <div style="padding: 14px 32px; background: rgba(255,255,255,0.03); text-align: center; font-size: 11px; color: #6B7280;">
            Digital Penta · Delhi, India · digitalpenta.com
          </div>
        </div>
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid notification type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: Record<string, unknown> = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };
    if (bcc) body.bcc = [bcc];
    if (replyTo) body.reply_to = replyTo;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Email notification error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
