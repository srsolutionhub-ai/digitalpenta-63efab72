// Email templates — dark editorial Digital Penta branding, 600px mobile-first.
// Each renderer returns { subject, html, text }.

const BRAND = {
  name: "Digital Penta",
  url: "https://digitalpenta.com",
  logo: "https://digitalpenta.com/logo.png",
  primary: "#8b5cf6", // violet
  accent: "#ec4899",  // pink
  bg: "#0a0a1a",
  card: "#141428",
  border: "#26264a",
  text: "#f4f4f8",
  muted: "#9aa0b4",
  supportEmail: "support@digitalpenta.com",
  phone: "+91-88601-00039",
  socials: [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/digitalpenta" },
    { name: "Instagram", url: "https://www.instagram.com/digitalpenta" },
    { name: "Twitter", url: "https://twitter.com/digitalpenta" },
  ],
};

function shell({
  preheader,
  bodyHtml,
  footerNote,
}: {
  preheader: string;
  bodyHtml: string;
  footerNote?: string;
}) {
  const socials = BRAND.socials
    .map(
      (s) =>
        `<a href="${s.url}" style="color:${BRAND.muted};text-decoration:none;font-size:12px;margin:0 6px;">${s.name}</a>`
    )
    .join("·");
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${BRAND.name}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${BRAND.text};">
<div style="display:none;font-size:1px;color:transparent;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <!-- Header with gradient -->
      <tr><td style="padding:0 0 24px 0;text-align:center;">
        <div style="display:inline-block;padding:2px;border-radius:16px;background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});">
          <div style="background:${BRAND.bg};border-radius:14px;padding:16px 28px;">
            <a href="${BRAND.url}" style="color:${BRAND.text};text-decoration:none;font-size:20px;font-weight:800;letter-spacing:-0.5px;">
              Digital<span style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:${BRAND.accent};">Penta</span>
            </a>
          </div>
        </div>
      </td></tr>
      <!-- Body card -->
      <tr><td style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:20px;padding:36px 32px;">
        ${bodyHtml}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:28px 8px 8px 8px;text-align:center;">
        <p style="color:${BRAND.muted};font-size:12px;margin:0 0 10px 0;line-height:1.6;">
          ${footerNote ?? "Sent with intent by Digital Penta — five disciplines, one growth engine."}
        </p>
        <p style="margin:8px 0 0 0;">${socials}</p>
        <p style="color:${BRAND.muted};font-size:11px;margin:14px 0 0 0;line-height:1.5;">
          Digital Penta · 124 C Katwaria Sarai, New Delhi 110016, India<br>
          <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.muted};">${BRAND.supportEmail}</a> · ${BRAND.phone}
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function h1(text: string) {
  return `<h1 style="font-size:26px;line-height:1.2;font-weight:800;margin:0 0 12px 0;letter-spacing:-0.5px;background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:${BRAND.accent};">${text}</h1>`;
}
function p(text: string) {
  return `<p style="font-size:15px;line-height:1.7;color:${BRAND.text};margin:0 0 16px 0;">${text}</p>`;
}
function muted(text: string) {
  return `<p style="font-size:13px;line-height:1.6;color:${BRAND.muted};margin:0 0 12px 0;">${text}</p>`;
}
function btn(label: string, href: string) {
  return `<div style="margin:24px 0;text-align:center;"><a href="${href}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});color:#fff;text-decoration:none;font-weight:700;font-size:14px;border-radius:999px;letter-spacing:0.2px;">${label}</a></div>`;
}
function divider() {
  return `<div style="height:1px;background:${BRAND.border};margin:20px 0;"></div>`;
}

// ---------- Templates ----------

export interface TemplateResult {
  subject: string;
  html: string;
  text: string;
}

export function renderContactReceived(data: { name?: string; service?: string }): TemplateResult {
  const name = data.name || "there";
  const service = data.service ? ` about ${data.service}` : "";
  const html = shell({
    preheader: "We got your message — a strategist will reach out within 1 business hour.",
    bodyHtml: `
      ${h1("Thanks for reaching out.")}
      ${p(`Hi ${name},`)}
      ${p(`We received your enquiry${service} and one of our growth strategists will get back to you within <strong>1 business hour</strong>.`)}
      ${p("In the meantime, take a look at our recent client wins:")}
      ${btn("See Case Studies", "https://digitalpenta.com/portfolio")}
      ${divider()}
      ${muted("Need urgent help? Reply to this email or WhatsApp us at +91-88601-00039.")}
    `,
  });
  const text = `Hi ${name},\n\nWe received your enquiry${service}. A strategist will reach out within 1 business hour.\n\nSee case studies: https://digitalpenta.com/portfolio\n\nDigital Penta`;
  return { subject: `We got your message${service} — Digital Penta`, html, text };
}

export function renderContactNotifyTeam(data: {
  name?: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  source?: string;
}): TemplateResult {
  const rows = [
    ["Name", data.name || "—"],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Service", data.service || "—"],
    ["Source", data.source || "website"],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:${BRAND.muted};font-size:12px;width:110px;">${k}</td><td style="padding:8px 12px;color:${BRAND.text};font-size:13px;">${v}</td></tr>`
    )
    .join("");
  const html = shell({
    preheader: `New lead: ${data.name || data.email}`,
    bodyHtml: `
      ${h1("🔥 New lead")}
      ${p("A new prospect just submitted the contact form.")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:12px;margin:12px 0;">${rows}</table>
      ${data.message ? p(`<strong>Message:</strong><br>${escapeHtml(data.message).replace(/\n/g, "<br>")}`) : ""}
      ${btn("Open CRM", "https://digitalpenta.com/dashboard/admin/crm")}
    `,
    footerNote: "Internal notification — Digital Penta OS",
  });
  return {
    subject: `🔥 New lead: ${data.name || data.email}${data.service ? " — " + data.service : ""}`,
    html,
    text: `New lead\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nService: ${data.service}\n\n${data.message || ""}`,
  };
}

export function renderNewsletterWelcome(data: { name?: string; unsubUrl?: string }): TemplateResult {
  const name = data.name || "there";
  const html = shell({
    preheader: "Welcome to the Penta insider — insights every Tuesday.",
    bodyHtml: `
      ${h1("Welcome to Penta Insider 🚀")}
      ${p(`Hey ${name},`)}
      ${p("You just joined 2,400+ founders, marketers and CMOs who get our weekly playbook on SEO, paid media, AI and MENA growth.")}
      ${p("What to expect:")}
      <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px 0;">
        <li>One tactical breakdown every Tuesday</li>
        <li>Real client case studies (no vanity metrics)</li>
        <li>India + MENA-specific market intel</li>
      </ul>
      ${btn("Explore the blog", "https://digitalpenta.com/blog")}
      ${divider()}
      ${muted(`Not for you? <a href="${data.unsubUrl || "https://digitalpenta.com/unsubscribe"}" style="color:${BRAND.muted};text-decoration:underline;">Unsubscribe anytime</a>.`)}
    `,
  });
  return {
    subject: "Welcome to Penta Insider 🚀",
    html,
    text: `Hey ${name},\n\nYou joined Penta Insider — weekly growth playbooks every Tuesday.\n\nExplore: https://digitalpenta.com/blog\n\nUnsubscribe: ${data.unsubUrl || "https://digitalpenta.com/unsubscribe"}`,
  };
}

export function renderAuditReady(data: {
  name?: string;
  url: string;
  score?: number;
  topIssues?: string[];
  reportUrl?: string;
}): TemplateResult {
  const name = data.name || "there";
  const issues = (data.topIssues || [])
    .map((i) => `<li style="color:${BRAND.text};font-size:14px;line-height:1.8;">${escapeHtml(i)}</li>`)
    .join("");
  const html = shell({
    preheader: `Your audit for ${data.url} is ready — score ${data.score ?? "—"}/100.`,
    bodyHtml: `
      ${h1("Your website audit is ready.")}
      ${p(`Hi ${name},`)}
      ${p(`We just finished analyzing <strong>${escapeHtml(data.url)}</strong>. Here's the overall health score:`)}
      <div style="text-align:center;margin:20px 0;">
        <div style="display:inline-block;padding:20px 40px;background:linear-gradient(135deg,${BRAND.primary}22,${BRAND.accent}22);border:1px solid ${BRAND.border};border-radius:16px;">
          <div style="font-size:44px;font-weight:800;background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:${BRAND.accent};">${data.score ?? "—"}/100</div>
          <div style="color:${BRAND.muted};font-size:12px;letter-spacing:0.5px;text-transform:uppercase;">Overall Health</div>
        </div>
      </div>
      ${issues ? `${p("<strong>Top 3 things to fix now:</strong>")}<ul style="padding-left:20px;margin:0 0 20px 0;">${issues}</ul>` : ""}
      ${btn("View Full Report", data.reportUrl || "https://digitalpenta.com/tools/seo-audit")}
      ${divider()}
      ${muted("Want us to fix these for you? Reply to this email — we'll send you a custom plan within 24 hours.")}
    `,
  });
  return {
    subject: `Your ${data.url} audit — ${data.score ?? "?"}/100`,
    html,
    text: `Your audit for ${data.url} is ready. Score: ${data.score ?? "—"}/100\n\nView: ${data.reportUrl || "https://digitalpenta.com/tools/seo-audit"}`,
  };
}

export function renderBookingConfirmed(data: {
  name?: string;
  when: string;
  meetingUrl?: string;
}): TemplateResult {
  const name = data.name || "there";
  const html = shell({
    preheader: `Confirmed — see you on ${data.when}.`,
    bodyHtml: `
      ${h1("Your strategy call is confirmed ✅")}
      ${p(`Hi ${name},`)}
      ${p(`We've locked in your 30-minute growth strategy call for <strong>${escapeHtml(data.when)}</strong>.`)}
      ${p("Before the call, please have ready:")}
      <ul style="color:${BRAND.text};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px 0;">
        <li>Your website URL</li>
        <li>Your top 3 growth goals for the next 6 months</li>
        <li>Current marketing channels and monthly spend</li>
      </ul>
      ${data.meetingUrl ? btn("Join the Call", data.meetingUrl) : ""}
      ${divider()}
      ${muted("Need to reschedule? Just reply to this email.")}
    `,
  });
  return {
    subject: `Confirmed: your Digital Penta strategy call — ${data.when}`,
    html,
    text: `Hi ${name},\nYour call is confirmed for ${data.when}.\n${data.meetingUrl ? `\nJoin: ${data.meetingUrl}` : ""}`,
  };
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderNewsletterBroadcast(data: {
  subject: string;
  bodyHtml: string;
  name?: string;
  unsubUrl?: string;
}): TemplateResult {
  const preheader = data.subject.slice(0, 90);
  const inner = data.bodyHtml.replace(/\{\{name\}\}/g, escapeHtml(data.name ?? "Friend"));
  const unsub = data.unsubUrl
    ? `<p style="text-align:center;margin-top:24px;font-size:11px;color:${BRAND.muted};">
         <a href="${data.unsubUrl}" style="color:${BRAND.muted};">Unsubscribe</a> ·
         <a href="${BRAND.url}" style="color:${BRAND.muted};">${BRAND.name}</a>
       </p>`
    : "";
  const html = shell({ preheader, bodyHtml: `<div style="color:${BRAND.text};font-size:15px;line-height:1.6;">${inner}</div>${unsub}` });
  const text = data.bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { subject: data.subject, html, text };
}

// Registry
export const templates = {
  "contact-received": renderContactReceived,
  "contact-notify-team": renderContactNotifyTeam,
  "newsletter-welcome": renderNewsletterWelcome,
  "newsletter-broadcast": renderNewsletterBroadcast,
  "audit-ready": renderAuditReady,
  "booking-confirmed": renderBookingConfirmed,
} as const;

export type TemplateName = keyof typeof templates;
