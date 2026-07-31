/**
 * visitorTracking — consent-gated first-party audience tracking.
 *
 * Responsibilities:
 *   1. Stable `visitor_id` (localStorage) + `session_id` (sessionStorage)
 *   2. Visit counting → powers "Welcome back" + returning-hero personalization
 *   3. UTM / referrer / device / locale capture (first-touch preserved)
 *   4. Batched, keepalive delivery to the `track-visitor` edge function which
 *      writes visitor_profiles + visitor_interactions + analytics_events
 *
 * Nothing is sent until the visitor grants Analytics consent. Consent is
 * pushed in from CookiePreferenceModal via `setTrackingConsent()`.
 * Events fired before consent are buffered in memory and dropped on reject.
 */

const VISITOR_KEY = "visitor_id";
const VISITS_KEY = "dp_visits_v1";
const FIRST_TOUCH_KEY = "dp_first_touch_v1";
const SESSION_KEY = "dp_session_v1";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-visitor`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export interface VisitInfo {
  visitCount: number;
  isReturning: boolean;
  lastVisitAt: number | null;
  daysSinceLastVisit: number | null;
}

interface QueuedEvent {
  action: string;
  pageUrl: string;
  sessionId: string;
  data?: Record<string, unknown>;
  category?: string;
  label?: string;
  value?: number;
  ts: number;
}

interface FirstTouch {
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landing: string;
  at: number;
}

const ls = {
  get(k: string): string | null {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  set(k: string, v: string) {
    try { localStorage.setItem(k, v); } catch { /* noop */ }
  },
};

function uuid(): string {
  try { return crypto.randomUUID(); } catch { /* noop */ }
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId(): string {
  let id = ls.get(VISITOR_KEY);
  if (!id) { id = uuid(); ls.set(VISITOR_KEY, id); }
  return id;
}

function getSessionId(): string {
  try {
    let s = sessionStorage.getItem(SESSION_KEY);
    if (!s) { s = uuid(); sessionStorage.setItem(SESSION_KEY, s); }
    return s;
  } catch { return "no-session"; }
}

function deviceType(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (/iPad|Tablet/i.test(navigator.userAgent) || (w >= 768 && w < 1024)) return "tablet";
  if (w < 768) return "mobile";
  return "desktop";
}

/* ── visit history (also used by hero personalization + welcome-back) ── */

interface VisitRecord { count: number; last: number }

function readVisits(): VisitRecord {
  try {
    const raw = JSON.parse(ls.get(VISITS_KEY) || "null");
    if (raw && typeof raw.count === "number") return raw as VisitRecord;
  } catch { /* noop */ }
  return { count: 0, last: 0 };
}

let cachedVisit: VisitInfo | null = null;

/** Increments the session-level visit counter exactly once per browser session. */
export function registerVisit(): VisitInfo {
  if (cachedVisit) return cachedVisit;
  const prev = readVisits();
  let counted = false;
  try {
    counted = sessionStorage.getItem("dp_visit_counted") === "1";
    if (!counted) sessionStorage.setItem("dp_visit_counted", "1");
  } catch { /* noop */ }

  const nextCount = counted ? prev.count : prev.count + 1;
  if (!counted) ls.set(VISITS_KEY, JSON.stringify({ count: nextCount, last: Date.now() }));

  const days = prev.last ? Math.floor((Date.now() - prev.last) / 86_400_000) : null;
  cachedVisit = {
    visitCount: nextCount,
    isReturning: prev.count > 0,
    lastVisitAt: prev.last || null,
    daysSinceLastVisit: days,
  };
  return cachedVisit;
}

export function getVisitInfo(): VisitInfo {
  return cachedVisit ?? registerVisit();
}

function firstTouch(): FirstTouch {
  try {
    const raw = JSON.parse(ls.get(FIRST_TOUCH_KEY) || "null");
    if (raw?.at) return raw as FirstTouch;
  } catch { /* noop */ }
  const params = new URLSearchParams(window.location.search);
  const ft: FirstTouch = {
    referrer: document.referrer || "direct",
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    landing: window.location.pathname,
    at: Date.now(),
  };
  ls.set(FIRST_TOUCH_KEY, JSON.stringify(ft));
  return ft;
}

/** Derives soft interest tags from the pages a visitor browses. */
function interestsFromPath(path: string): string[] {
  const out: string[] = [];
  const p = path.toLowerCase();
  if (/seo/.test(p)) out.push("seo");
  if (/ppc|google-ads|ads/.test(p)) out.push("ppc");
  if (/social/.test(p)) out.push("social-media");
  if (/web-development|website|app/.test(p)) out.push("web-development");
  if (/ai-solutions|chatbot|automation/.test(p)) out.push("ai");
  if (/pricing|proposal|book-a-call|contact/.test(p)) out.push("high-intent");
  const city = p.match(/(delhi|mumbai|bangalore|pune|hyderabad|noida|gurgaon|lucknow|jaipur|kota|dubai|abu-dhabi|riyadh|doha|bahrain)/);
  if (city) out.push(`city:${city[1]}`);
  return out;
}

/* ── queue + delivery ── */

let consented = false;
let started = Date.now();
let pageViewCount = 0;
const queue: QueuedEvent[] = [];
const interests = new Set<string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function buildBody() {
  const ft = firstTouch();
  return JSON.stringify({
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    events: queue.splice(0, queue.length),
    profile: {
      referrer: ft.referrer,
      utmSource: ft.utmSource,
      utmMedium: ft.utmMedium,
      utmCampaign: ft.utmCampaign,
      deviceType: deviceType(),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pageViews: pageViewCount,
      timeOnSite: Math.round((Date.now() - started) / 1000),
      interests: Array.from(interests),
      visitorType: interests.has("high-intent") ? "lead" : "anonymous",
    },
  });
}

function send(useBeacon = false) {
  if (!consented || queue.length === 0) return;
  const body = buildBody();
  const headers = {
    "Content-Type": "application/json",
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
  };
  // sendBeacon can't set headers, so keepalive fetch is used even on unload.
  void fetch(FN_URL, { method: "POST", headers, body, keepalive: true }).catch(() => { /* silent */ });
  if (useBeacon) { /* keepalive fetch already handles unload */ }
}

function scheduleFlush(delay = 4000) {
  if (!consented) return;
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => { flushTimer = null; send(); }, delay);
}

/** Queue an event. Held in memory until consent is granted. */
export function queueVisitorEvent(
  action: string,
  opts: { data?: Record<string, unknown>; category?: string; label?: string; value?: number } = {},
): void {
  if (typeof window === "undefined") return;
  queue.push({
    action,
    pageUrl: window.location.href,
    sessionId: getSessionId(),
    ts: Date.now(),
    ...opts,
  });
  if (queue.length >= 12) send();
  else scheduleFlush();
}

/** Called by the cookie banner. Enables or permanently discards tracking. */
export function setTrackingConsent(granted: boolean): void {
  consented = granted;
  if (!granted) { queue.length = 0; return; }
  scheduleFlush(1200);
}

export function trackPagePath(path: string): void {
  pageViewCount += 1;
  interestsFromPath(path).forEach((i) => interests.add(i));
  scheduleFlush();
}

let booted = false;
/** One-shot bootstrap; safe to call repeatedly. */
export function initVisitorTracking(): void {
  if (booted || typeof window === "undefined") return;
  booted = true;
  started = Date.now();
  getVisitorId();
  firstTouch();
  const visit = registerVisit();

  queueVisitorEvent("session_start", {
    category: "session",
    label: visit.isReturning ? "returning" : "new",
    value: visit.visitCount,
    data: {
      visit_count: visit.visitCount,
      days_since_last_visit: visit.daysSinceLastVisit,
      screen: `${window.screen.width}x${window.screen.height}`,
    },
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") send(true);
  });
  window.addEventListener("pagehide", () => send(true));
}
