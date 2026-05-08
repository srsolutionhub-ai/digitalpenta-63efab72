/**
 * Phase 4: typed analytics event taxonomy for the funnel.
 *
 * Every interaction worth measuring goes through `trackEvent()` so the
 * admin Funnel dashboard can chart conversion stages without scraping
 * loose strings out of GA.
 */
import { trackEvent as legacyTrackEvent } from "@/lib/analytics";

export type FunnelStage =
  | "visit"
  | "engage"           // clicked CTA, scrolled past 50%
  | "tool_open"        // opened an AI tool form
  | "tool_submit"      // submitted a tool with email gate
  | "tool_result"      // received an AI result
  | "lead_capture"     // generic lead form submission
  | "booking_created"
  | "deal_created";

export interface FunnelEvent {
  stage: FunnelStage;
  source?: string;     // page or component identifier
  tool?: string;       // tool slug when stage starts with tool_
  value?: number;      // optional monetary or score value
  meta?: Record<string, unknown>;
}

export function trackFunnel(evt: FunnelEvent) {
  legacyTrackEvent(`funnel_${evt.stage}`, {
    source: evt.source,
    tool: evt.tool,
    value: evt.value,
    ...(evt.meta ?? {}),
  });
}

/** Helper: capture UTM + page context once per session for downstream attribution. */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"]
    .forEach(k => {
      const v = url.searchParams.get(k);
      if (v) utm[k] = v;
    });
  utm.referrer = document.referrer || "";
  utm.landing_path = window.location.pathname;
  return utm;
}
