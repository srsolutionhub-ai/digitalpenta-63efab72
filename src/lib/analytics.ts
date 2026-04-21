/**
 * GA4-compatible event tracker (Phase 9 — analytics & tracking).
 *
 * Pushes events to `window.dataLayer` (Google Tag Manager / GA4 native).
 * Falls back to a console table in dev so we can verify firing without GA loaded.
 *
 * All events are tagged with:
 *   - page_path:     current pathname
 *   - locale:        "ar" if path starts with /ar, else "en"
 *   - market:        "in" | "ae" | "sa" | "global" inferred from URL segments
 *   - cta_text:      visible button label (when relevant)
 *   - cta_target:    href / form-id (when relevant)
 *
 * The `attachAutoTrackers()` listener wires up:
 *   - outbound link clicks   → "outbound_click"
 *   - WhatsApp / tel / mailto→ "whatsapp_click" | "phone_click" | "email_click"
 *   - any [data-cta] click   → "cta_click"
 *   - any [data-audit-cta]   → "free_audit_click"
 *   - <form> submit          → "generate_lead"
 *
 * Usage:
 *   import { initAnalytics } from "@/lib/analytics";
 *   initAnalytics();   // call once in App
 */

type GA4Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ORIGIN_HOST = "digitalpenta.com";

function getLocale(): "en" | "ar" {
  if (typeof window === "undefined") return "en";
  return window.location.pathname.startsWith("/ar") ? "ar" : "en";
}

function getMarket(): "in" | "ae" | "sa" | "qa" | "bh" | "global" {
  if (typeof window === "undefined") return "global";
  const path = window.location.pathname.toLowerCase();
  if (/(dubai|abu-dhabi)/.test(path)) return "ae";
  if (/(riyadh|saudi)/.test(path)) return "sa";
  if (/doha/.test(path)) return "qa";
  if (/bahrain/.test(path)) return "bh";
  if (/(delhi|mumbai|bangalore|pune|hyderabad|noida|gurgaon|jaipur|lucknow|kota|india)/.test(path)) return "in";
  return "global";
}

/** Push an event into dataLayer (GTM) and gtag if present. */
export function trackEvent(eventName: string, params: GA4Params = {}): void {
  if (typeof window === "undefined") return;

  const enriched: GA4Params = {
    page_path: window.location.pathname,
    page_location: window.location.href,
    locale: getLocale(),
    market: getMarket(),
    ...params,
  };

  // GTM / GA4 dataLayer push
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...enriched });

  // gtag fallback (when GA4 loaded directly)
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, enriched);
  }

  // Dev visibility
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[analytics]", eventName, enriched);
  }
}

/** Convenience wrappers for the events called out in the SEO master plan. */
export const track = {
  ctaClick: (ctaText: string, ctaTarget?: string) =>
    trackEvent("cta_click", { cta_text: ctaText, cta_target: ctaTarget }),

  freeAuditClick: (ctaText: string) =>
    trackEvent("free_audit_click", { cta_text: ctaText }),

  generateLead: (formId: string, service?: string) =>
    trackEvent("generate_lead", { form_id: formId, service }),

  phoneClick: (phone: string) => trackEvent("phone_click", { phone_number: phone }),
  whatsappClick: (phone: string) => trackEvent("whatsapp_click", { phone_number: phone }),
  emailClick: (email: string) => trackEvent("email_click", { email }),

  outboundClick: (href: string, ctaText?: string) =>
    trackEvent("outbound_click", { outbound_url: href, cta_text: ctaText }),

  scrollDepth: (percent: 25 | 50 | 75 | 100) =>
    trackEvent("scroll_depth", { percent }),

  pageView: (path: string) => trackEvent("page_view", { page_path: path }),
};

/* ─────────────────────── auto-trackers ─────────────────────── */

function isOutbound(url: string): boolean {
  try {
    const u = new URL(url, window.location.origin);
    return u.host !== window.location.host && !u.host.endsWith(ORIGIN_HOST);
  } catch {
    return false;
  }
}

function getCtaText(el: HTMLElement): string {
  return (el.getAttribute("aria-label") || el.innerText || el.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function handleClick(ev: MouseEvent): void {
  const target = ev.target as HTMLElement | null;
  if (!target) return;

  // Find the nearest actionable ancestor.
  const anchor = target.closest("a") as HTMLAnchorElement | null;
  const button = target.closest("button") as HTMLButtonElement | null;
  const el = anchor || button;
  if (!el) return;

  const ctaText = getCtaText(el);

  // Free-audit CTA marker
  if (el.matches("[data-audit-cta]") || /audit/i.test(ctaText)) {
    track.freeAuditClick(ctaText);
  }

  // Generic CTA marker
  if (el.matches("[data-cta]") || el.matches("button")) {
    const href = anchor?.getAttribute("href") || undefined;
    track.ctaClick(ctaText, href);
  }

  if (anchor) {
    const href = anchor.getAttribute("href") || "";
    if (href.startsWith("tel:")) {
      track.phoneClick(href.replace("tel:", ""));
      return;
    }
    if (href.startsWith("mailto:")) {
      track.emailClick(href.replace("mailto:", ""));
      return;
    }
    if (/wa\.me|api\.whatsapp/i.test(href)) {
      track.whatsappClick(href);
      return;
    }
    if (href && /^https?:\/\//i.test(href) && isOutbound(href)) {
      track.outboundClick(href, ctaText);
    }
  }
}

function handleSubmit(ev: SubmitEvent): void {
  const form = ev.target as HTMLFormElement | null;
  if (!form) return;
  const formId = form.id || form.getAttribute("name") || form.getAttribute("data-form") || "unknown_form";
  const service =
    (form.querySelector('[name="service"]') as HTMLInputElement | null)?.value || undefined;
  track.generateLead(formId, service);
}

let scrollMarks = new Set<number>();
let lastPath = "";

function handleScroll(): void {
  if (window.location.pathname !== lastPath) {
    scrollMarks = new Set();
    lastPath = window.location.pathname;
  }
  const doc = document.documentElement;
  const scrolled = (doc.scrollTop + window.innerHeight) / doc.scrollHeight;
  ([25, 50, 75, 100] as const).forEach(p => {
    if (scrolled * 100 >= p && !scrollMarks.has(p)) {
      scrollMarks.add(p);
      track.scrollDepth(p);
    }
  });
}

let attached = false;
export function attachAutoTrackers(): void {
  if (attached || typeof window === "undefined") return;
  attached = true;
  document.addEventListener("click", handleClick, { capture: true });
  document.addEventListener("submit", handleSubmit, { capture: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
}

/** SPA route-change tracker — call from a route effect. */
export function trackPageView(path: string): void {
  scrollMarks = new Set();
  lastPath = path;
  track.pageView(path);
}

/** One-shot bootstrap used by App. */
export function initAnalytics(): void {
  attachAutoTrackers();
}
