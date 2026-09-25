/**
 * Consent-gated marketing tags: Google Tag Manager, Meta Pixel, LinkedIn Insight.
 *
 * Nothing loads unless (a) the ID is configured via env and (b) the visitor
 * granted *marketing* consent. IDs are read from:
 *   VITE_GTM_ID            e.g. GTM-XXXXXXX
 *   VITE_META_PIXEL_ID     numeric
 *   VITE_LINKEDIN_PARTNER_ID numeric
 */
declare global {
  interface Window {
    fbq?: ((...a: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: (...a: unknown[]) => void; push?: unknown };
    _fbq?: unknown;
    lintrk?: ((...a: unknown[]) => void) & { q?: unknown[] };
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
  }
}

const ENV_GTM_ID = (import.meta.env.VITE_GTM_ID as string | undefined)?.trim() || "";
const ENV_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim() || "";
const ENV_LI_ID = (import.meta.env.VITE_LINKEDIN_PARTNER_ID as string | undefined)?.trim() || "";
let dynamicGtmId = "";
let dynamicPixelId = "";
let dynamicLiId = "";
function GTM_ID_(): string { return ENV_GTM_ID || dynamicGtmId; }
function PIXEL_ID_(): string { return ENV_PIXEL_ID || dynamicPixelId; }
function LI_ID_(): string { return ENV_LI_ID || dynamicLiId; }

let marketingGranted = false;
const loaded = { gtm: false, pixel: false, li: false };

function inject(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function loadGtm() {
  const id = GTM_ID_();
  if (loaded.gtm || !/^GTM-[A-Z0-9]+$/.test(id)) return;
  loaded.gtm = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  inject(`https://www.googletagmanager.com/gtm.js?id=${id}`);
}

function loadPixel() {
  const id = PIXEL_ID_();
  if (loaded.pixel || !/^\d+$/.test(id)) return;
  loaded.pixel = true;
  const q: unknown[] = [];
  const fbq = ((...a: unknown[]) => { q.push(a); }) as NonNullable<Window["fbq"]>;
  fbq.queue = q; fbq.loaded = true; fbq.version = "2.0";
  window.fbq = fbq; window._fbq = fbq;
  inject("https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", id);
  fbq("track", "PageView");
}

function loadLinkedIn() {
  const id = LI_ID_();
  if (loaded.li || !/^\d+$/.test(id)) return;
  loaded.li = true;
  window._linkedin_partner_id = id;
  window._linkedin_data_partner_ids = [...(window._linkedin_data_partner_ids ?? []), id];
  const q: unknown[] = [];
  const l = ((...a: unknown[]) => { q.push(a); }) as NonNullable<Window["lintrk"]>;
  l.q = q;
  window.lintrk = l;
  inject("https://snap.licdn.com/li.lms-analytics/insight.min.js");
}

/** Applies IDs discovered via integration_settings (DB-configured tags). Env vars always win. */
export function setGtmId(id: string): void { if (!ENV_GTM_ID && id) { dynamicGtmId = id; if (marketingGranted) loadGtm(); } }
export function setPixelId(id: string): void { if (!ENV_PIXEL_ID && id) { dynamicPixelId = id; if (marketingGranted) loadPixel(); } }
export function setLinkedInId(id: string): void { if (!ENV_LI_ID && id) { dynamicLiId = id; if (marketingGranted) loadLinkedIn(); } }

/** Called from the cookie banner when marketing consent changes. */
export function setMarketingConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  marketingGranted = granted;
  if (!granted) return; // already-loaded tags stay dormant; Consent Mode handles Google
  loadGtm();
  loadPixel();
  loadLinkedIn();
}

/** Mirrors a confirmed conversion into ad platforms (no-op without consent). */
export function forwardConversionToAds(name: string, params: Record<string, unknown>): void {
  if (!marketingGranted) return;
  const metaMap: Record<string, string> = {
    generate_lead: "Lead", book_call: "Schedule", request_proposal: "SubmitApplication",
    request_audit: "Lead", contact_whatsapp: "Contact", contact_phone: "Contact",
  };
  if (window.fbq && metaMap[name]) window.fbq("track", metaMap[name], params);
  if (window.lintrk && ["generate_lead", "book_call", "request_proposal", "request_audit"].includes(name)) {
    window.lintrk("track", { conversion_id: name });
  }
}

export const marketingTagsConfigured = { gtm: !!GTM_ID_(), pixel: !!PIXEL_ID_(), linkedin: !!LI_ID_() };
