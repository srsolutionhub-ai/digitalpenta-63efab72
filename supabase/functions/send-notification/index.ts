import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  type: "new_lead" | "invoice_created" | "abandoned_draft" | "booking_confirmed";
  data: Record<string, unknown>;
}

// Per-cold-start in-memory rate limit by IP to prevent unauth email spam abuse.
const sendBuckets = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = sendBuckets.get(ip);
  if (!b || now > b.reset) {
    sendBuckets.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

/* ----------------------------- ICS helpers ------------------------------ */
function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function toIcsUtc(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}
/** Build a minimal RFC-5545 VEVENT for a 30-min strategy call. */
function buildIcs(opts: { summary: string; description: string; startUtc: Date; durationMin: number; organizer: string; attendee: string; uid: string; location?: string; }) {
  const end = new Date(opts.startUtc.getTime() + opts.durationMin * 60_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Digital Penta//Strategy Call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(opts.startUtc)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${opts.summary.replace(/[\n,;]/g, " ")}`,
    `DESCRIPTION:${opts.description.replace(/\n/g, "\\n")}`,
    `ORGANIZER;CN=Digital Penta:mailto:${opts.organizer}`,
    `ATTENDEE;CN=${opts.attendee};RSVP=TRUE:mailto:${opts.attendee}`,
    opts.location ? `LOCATION:${opts.location}` : "LOCATION:Google Meet (link to follow)",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
function b64(s: string) {
  return btoa(unescape(encodeURIComponent(s)));
}

/** Escape user-supplied strings before embedding in HTML email templates. */
function esc(s: unknown): string {
  return String(s ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

    // Anti-abuse rate limit (per IP, per cold start)
    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 5, 60_000)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: EmailPayload = await req.json();

    // For payload types that send to arbitrary emails, validate the recipient
    // exists in our DB to prevent the function being used as an open relay.
    if (payload.type === "booking_confirmed" || payload.type === "abandoned_draft") {
      const recip = String((payload.data as any)?.email || "").trim().toLowerCase();
      if (!recip) {
        return new Response(JSON.stringify({ error: "Email required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const guard = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      if (payload.type === "booking_confirmed") {
        const { data: booking } = await guard
          .from("strategy_call_bookings")
          .select("id, created_at")
          .eq("email", recip)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!booking || (Date.now() - new Date(booking.created_at).getTime()) > 10 * 60_000) {
          return new Response(JSON.stringify({ error: "No matching recent booking" }), {
            status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else {
        // abandoned_draft → must match a recent contact (last 24h)
        const { data: c } = await guard
          .from("contacts")
          .select("id, created_at")
          .eq("email", recip)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!c || (Date.now() - new Date(c.created_at).getTime()) > 24 * 60 * 60_000) {
          return new Response(JSON.stringify({ error: "No matching recent draft" }), {
            status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }


    let subject = "";
    let html = "";
    let to: string | string[] = "support@digitalpenta.com";
    const internalTo = "support@digitalpenta.com";
    const from = "Digital Penta <notifications@digitalpenta.com>";
    let bcc: string | undefined;
    let replyTo: string | undefined;

    if (payload.type === "new_lead") {
      const d = payload.data;
      subject = `🔥 New Lead: ${esc(d.name || "Unknown")} — ${esc(d.service || "General")}`;
      html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6C3BF5, #4F1CD4); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Lead Received</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${esc(d.name || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Email</td><td style="padding: 8px 0;">${esc(d.email || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Phone</td><td style="padding: 8px 0;">${esc(d.phone || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Company</td><td style="padding: 8px 0;">${esc(d.company || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Service</td><td style="padding: 8px 0; color: #6C3BF5; font-weight: 600;">${esc(d.service || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Budget</td><td style="padding: 8px 0;">${esc(d.budget_range || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Message</td><td style="padding: 8px 0;">${esc(d.message || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Source</td><td style="padding: 8px 0;">${esc(d.source || "Website")}</td></tr>
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
      subject = `💰 Invoice Created: ${esc(d.invoice_number || "")} — ${esc(d.client_name || "Client")}`;
      html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #059669, #047857); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Invoice Created</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Invoice #</td><td style="padding: 8px 0; font-weight: 600;">${esc(d.invoice_number || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Client</td><td style="padding: 8px 0;">${esc(d.client_name || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Email</td><td style="padding: 8px 0;">${esc(d.client_email || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Amount</td><td style="padding: 8px 0; color: #10B981; font-weight: 700; font-size: 18px;">₹${esc(d.total || "0")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Due Date</td><td style="padding: 8px 0;">${esc(d.due_date || "—")}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF; font-size: 14px;">Status</td><td style="padding: 8px 0;">${esc(d.status || "draft")}</td></tr>
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
      const greet = d.name ? `Hi ${esc(d.name)},` : "Hi there,";
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
    } else if (payload.type === "booking_confirmed") {
      const d = payload.data as {
        name?: string; email?: string; phone?: string; company?: string;
        preferred_date?: string; preferred_slot?: string; timezone?: string;
        topic?: string; source?: string;
      };
      const recipient = (d.email || "").trim().toLowerCase();
      if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        return new Response(JSON.stringify({ error: "Invalid recipient email" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Compose the start time from preferred_date (YYYY-MM-DD) + preferred_slot (HH:MM, IST).
      // We intentionally treat the slot as IST (Asia/Kolkata = UTC+5:30) and convert to UTC for the ICS.
      let startUtc = new Date();
      try {
        const [Y, M, D] = (d.preferred_date || "").split("-").map(Number);
        const [hh, mm] = (d.preferred_slot || "00:00").split(":").map(Number);
        if (Y && M && D) {
          // IST = UTC+5:30 → subtract to get UTC
          startUtc = new Date(Date.UTC(Y, (M - 1), D, hh - 5, mm - 30));
        }
      } catch (_) { /* fallback to now */ }

      const summary = "Digital Penta — Free Strategy Call (30 min)";
      const desc = [
        `Hi ${esc(d.name || "there")},`,
        ``,
        `Your 30-minute strategy call with Digital Penta is confirmed.`,
        `Topic: ${esc(d.topic || "Growth strategy")}`,
        ``,
        `A senior strategist will join via Google Meet — link will be shared 10 minutes before the call.`,
        ``,
        `Need to reschedule? Reply to this email or WhatsApp +91-88601-00039.`,
      ].join("\n");

      const ics = buildIcs({
        summary,
        description: desc,
        startUtc,
        durationMin: 30,
        organizer: "support@digitalpenta.com",
        attendee: recipient,
        uid: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@digitalpenta.com`,
      });

      to = recipient;
      bcc = internalTo;
      replyTo = "support@digitalpenta.com";
      subject = `✅ Strategy call confirmed — ${esc(d.preferred_date)} at ${esc(d.preferred_slot)} IST`;
      html = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0D0D1A; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6C3BF5, #4F1CD4); padding: 32px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Your strategy call is booked 🎉</h1>
            <p style="margin: 8px 0 0; opacity: .85; font-size: 13px;">A senior strategist will join you on the dot.</p>
          </div>
          <div style="padding: 28px 32px;">
            <p style="margin: 0 0 14px; font-size: 15px;">Hi ${esc(d.name || "there")},</p>
            <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #D1D5DB;">
              Thanks for booking — we've reserved your slot and added an invite to your calendar.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: rgba(108,59,245,0.08); border: 1px solid rgba(108,59,245,0.25); border-radius: 12px;">
              <tr><td style="padding: 12px 16px; color: #9CA3AF; font-size: 13px; width: 30%;">When</td><td style="padding: 12px 16px; font-weight: 600;">${esc(d.preferred_date)} · ${esc(d.preferred_slot)} IST</td></tr>
              <tr><td style="padding: 12px 16px; color: #9CA3AF; font-size: 13px;">Duration</td><td style="padding: 12px 16px;">30 minutes</td></tr>
              <tr><td style="padding: 12px 16px; color: #9CA3AF; font-size: 13px;">Where</td><td style="padding: 12px 16px;">Google Meet (link sent 10 min prior)</td></tr>
              <tr><td style="padding: 12px 16px; color: #9CA3AF; font-size: 13px;">Topic</td><td style="padding: 12px 16px;">${esc(d.topic || "Growth strategy")}</td></tr>
            </table>
            <p style="margin: 18px 0 6px; font-size: 13px; color: #D1D5DB;">📅 The .ics calendar invite is attached — opens directly in Google / Apple / Outlook calendar.</p>
            <p style="margin: 16px 0 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
              Need to reschedule? Reply to this email or WhatsApp <span style="color:#fff;">+91-88601-00039</span>.
            </p>
          </div>
          <div style="padding: 14px 32px; background: rgba(255,255,255,0.03); text-align: center; font-size: 11px; color: #6B7280;">
            Digital Penta · Delhi, India · digitalpenta.com
          </div>
        </div>
      `;

      const body: Record<string, unknown> = {
        from,
        to: [to],
        bcc: [internalTo],
        reply_to: replyTo,
        subject,
        html,
        attachments: [
          {
            filename: "strategy-call.ics",
            content: b64(ics),
            content_type: "text/calendar; charset=utf-8; method=REQUEST",
          },
        ],
      };

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
        console.error("Resend booking error:", result);
        return new Response(JSON.stringify({ error: "Failed to send", details: result }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ success: true, id: result.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
