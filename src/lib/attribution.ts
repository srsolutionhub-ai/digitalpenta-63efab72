/**
 * URL-parameter attribution (UTM + ad click IDs).
 *
 * Captured once on app boot, before SPA navigation strips the query string.
 *  - last touch  → sessionStorage "dp_utm"      (current visit)
 *  - first touch → localStorage  "dp_attr_first" (first ever tracked visit, 90 days)
 * submitLead() reads these so every enquiry carries its campaign source.
 */
export const ATTRIBUTION_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
  "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "li_fat_id", "ttclid", "ref",
] as const;

const LAST_KEY = "dp_utm";
const FIRST_KEY = "dp_attr_first";
const FIRST_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type Attribution = Record<string, string>;

export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const p = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    ATTRIBUTION_KEYS.forEach((k) => {
      const v = p.get(k);
      if (v) found[k] = v.slice(0, 200);
    });
    if (!Object.keys(found).length) return null;
    found.landing_path = window.location.pathname;
    found.referrer = (document.referrer || "").slice(0, 300);
    found.captured_at = new Date().toISOString();
    sessionStorage.setItem(LAST_KEY, JSON.stringify(found));

    const firstRaw = localStorage.getItem(FIRST_KEY);
    const first = firstRaw ? JSON.parse(firstRaw) : null;
    if (!first || Date.now() - Date.parse(first.captured_at) > FIRST_TTL_MS) {
      localStorage.setItem(FIRST_KEY, JSON.stringify(found));
    }
    return found;
  } catch {
    return null;
  }
}

export function getLastTouch(): Attribution {
  try { return JSON.parse(sessionStorage.getItem(LAST_KEY) || "{}"); } catch { return {}; }
}

export function getFirstTouchAttribution(): Attribution {
  try { return JSON.parse(localStorage.getItem(FIRST_KEY) || "{}"); } catch { return {}; }
}
