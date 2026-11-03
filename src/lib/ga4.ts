/**
 * GA4 forwarding — consent-first.
 *
 * Nothing loads until the visitor grants Analytics consent in the cookie
 * banner. Consent Mode v2 defaults are set to "denied" before the tag boots,
 * so even a pre-consent load cannot write cookies.
 *
 * Every event carries the same identifiers we store first-party
 * (`visitor_id` → GA4 `user_id`, `session_id` → `dp_session_id`) so the
 * database audience and the GA4 audience can be reconciled row-for-row.
 */

import { getVisitorId, getSessionId } from "./visitorTracking";

const ENV_MEASUREMENT_ID =
  (import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined) ||
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined) ||
  "";
let dynamicMeasurementId = "";
function MEASUREMENT_ID_(): string { return ENV_MEASUREMENT_ID || dynamicMeasurementId; }

let loaded = false;
let granted = false;

// gtag.js / GTM only honour commands pushed as a real `arguments` object —
// an array is silently ignored, which used to drop Consent Mode commands.
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer as unknown[]).push(arguments);
}

/**
 * GTM mode: when a Google Tag Manager container is configured, GA4 is
 * expected to be configured *inside* GTM. We then never load gtag.js directly
 * (prevents double-counted page views/conversions); events still reach GTM
 * through the dataLayer pushes in analytics.ts.
 */
let gtmMode = false;
export function setGa4GtmMode(on: boolean): void { gtmMode = on; }
export function isGa4GtmMode(): boolean { return gtmMode; }

export function isGa4Configured(): boolean {
  return Boolean(MEASUREMENT_ID_());
}

/** Sets Consent Mode v2 defaults. Safe to call before the tag exists. */
export function initGa4ConsentDefaults(): void {
  if (typeof window === "undefined") return;
  window.gtag = window.gtag ?? (gtag as unknown as Window["gtag"]);
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
}

function loadTag(): void {
  const id = MEASUREMENT_ID_();
  if (loaded || !id || gtmMode) return;
  loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", id, {
    send_page_view: false, // SPA — we send page_view manually on route change
    user_id: getVisitorId(),
    dp_session_id: getSessionId(),
  });
}

/** Called by the cookie banner whenever analytics consent changes. */
/** Applies a measurement ID discovered via integration_settings (DB-configured tag). Env var always wins. */
export function setGa4MeasurementId(id: string): void {
  if (typeof window === "undefined" || ENV_MEASUREMENT_ID || !id) return;
  dynamicMeasurementId = id;
  if (granted) loadTag();
}

export function setGa4Consent(analytics: boolean, marketing = false): void {
  if (typeof window === "undefined") return;
  granted = analytics;
  gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "dp_consent_update",
    dp_consent_analytics: analytics ? "granted" : "denied",
    dp_consent_marketing: marketing ? "granted" : "denied",
  });
  if (analytics) {
    // Wait briefly for DB-configured GTM ID so GA4 is never loaded twice.
    import("./trackingIntegrations").then((m) => m.whenIntegrationsReady()).then(() => loadTag());
  }
}

/** Forwards one event to GA4. No-op until consent + measurement ID exist. */
export function forwardToGa4(eventName: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined" || !granted || gtmMode || !MEASUREMENT_ID_()) return;
  gtag("event", eventName, {
    ...params,
    user_id: getVisitorId(),
    dp_session_id: getSessionId(),
  });
}

export function forwardPageViewToGa4(path: string, title?: string): void {
  forwardToGa4("page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}
