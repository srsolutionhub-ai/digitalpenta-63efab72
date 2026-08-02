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

const MEASUREMENT_ID =
  (import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined) ||
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined) ||
  "";

let loaded = false;
let granted = false;

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // GA4 requires the raw arguments object shape.
  (window.dataLayer as unknown[]).push(args);
}

export function isGa4Configured(): boolean {
  return Boolean(MEASUREMENT_ID);
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
  if (loaded || !MEASUREMENT_ID) return;
  loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    send_page_view: false, // SPA — we send page_view manually on route change
    user_id: getVisitorId(),
    dp_session_id: getSessionId(),
  });
}

/** Called by the cookie banner whenever analytics consent changes. */
export function setGa4Consent(analytics: boolean, marketing = false): void {
  if (typeof window === "undefined") return;
  granted = analytics;
  gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
  if (analytics) loadTag();
}

/** Forwards one event to GA4. No-op until consent + measurement ID exist. */
export function forwardToGa4(eventName: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined" || !granted || !MEASUREMENT_ID) return;
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
