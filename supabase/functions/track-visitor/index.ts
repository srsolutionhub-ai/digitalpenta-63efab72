// Public visitor-tracking ingest.
// Frontend (consent-gated) posts batched events; we persist them with the
// service role because visitor_profiles / visitor_interactions are read-only
// for anon under RLS. Also mirrors every event into analytics_events so the
// admin funnel dashboard has a single source of truth.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface IncomingEvent {
  action: string;
  pageUrl?: string;
  sessionId?: string;
  data?: Record<string, unknown>;
  category?: string;
  label?: string;
  value?: number;
  ts?: number;
}

interface Payload {
  visitorId?: string;
  sessionId?: string;
  events?: IncomingEvent[];
  profile?: {
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    deviceType?: string;
    language?: string;
    timezone?: string;
    pageViews?: number;
    timeOnSite?: number;
    interests?: string[];
    visitorType?: string;
    landingPage?: string;
    lastPage?: string;
    screen?: string;
    visitNumber?: number;
    utmTerm?: string;
    utmContent?: string;
    clickIds?: Record<string, string>;
    searchTerm?: string;
  };
}

function parseUA(ua: string) {
  const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const tablet = /iPad|Tablet/i.test(ua);
  const browser =
    /Edg\//i.test(ua) ? "Edge" :
    /OPR\//i.test(ua) ? "Opera" :
    /Chrome\//i.test(ua) ? "Chrome" :
    /Safari\//i.test(ua) ? "Safari" :
    /Firefox\//i.test(ua) ? "Firefox" : "Other";
  const os =
    /Windows/i.test(ua) ? "Windows" :
    /Android/i.test(ua) ? "Android" :
    /iPhone|iPad|iOS/i.test(ua) ? "iOS" :
    /Mac OS X/i.test(ua) ? "macOS" :
    /Linux/i.test(ua) ? "Linux" : "Other";
  return { deviceType: tablet ? "tablet" : mobile ? "mobile" : "desktop", browser, os };
}


/* Approximate location from the browser timezone when the network gives none.
   No third-party IP lookup — privacy friendly. */
const TZ_GEO: Record<string, [string, string | null]> = {
  "Asia/Kolkata": ["India", null], "Asia/Calcutta": ["India", null],
  "Asia/Dubai": ["United Arab Emirates", "Dubai"], "Asia/Riyadh": ["Saudi Arabia", "Riyadh"],
  "Asia/Qatar": ["Qatar", "Doha"], "Asia/Bahrain": ["Bahrain", "Manama"], "Asia/Kuwait": ["Kuwait", "Kuwait City"],
  "Asia/Muscat": ["Oman", "Muscat"], "Asia/Karachi": ["Pakistan", null], "Asia/Dhaka": ["Bangladesh", "Dhaka"],
  "Asia/Kathmandu": ["Nepal", "Kathmandu"], "Asia/Colombo": ["Sri Lanka", "Colombo"], "Asia/Singapore": ["Singapore", "Singapore"],
  "Europe/London": ["United Kingdom", "London"], "Europe/Dublin": ["Ireland", "Dublin"], "Europe/Paris": ["France", "Paris"],
  "Europe/Berlin": ["Germany", "Berlin"], "Europe/Amsterdam": ["Netherlands", "Amsterdam"],
  "America/New_York": ["United States", null], "America/Chicago": ["United States", null],
  "America/Denver": ["United States", null], "America/Los_Angeles": ["United States", null],
  "America/Toronto": ["Canada", "Toronto"], "Australia/Sydney": ["Australia", "Sydney"],
};
const CC: Record<string, string> = { IN: "India", AE: "United Arab Emirates", SA: "Saudi Arabia", QA: "Qatar", BH: "Bahrain", US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia", SG: "Singapore" };

function resolveGeo(req: Request, tz?: string) {
  const hdrCountry = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || req.headers.get("x-country-code");
  const hdrCity = req.headers.get("cf-ipcity") || req.headers.get("x-vercel-ip-city");
  if (hdrCountry && hdrCountry !== "XX") {
    return { country: CC[hdrCountry] ?? hdrCountry, city: hdrCity ? decodeURIComponent(hdrCity) : null, source: "network" };
  }
  const g = tz ? TZ_GEO[tz] : undefined;
  if (g) return { country: g[0], city: g[1], source: "timezone" };
  if (tz?.includes("/")) return { country: null, city: tz.split("/").pop()!.replace(/_/g, " "), source: "timezone" };
  return { country: null, city: null, source: null };
}

/** Classifies how the visitor arrived: paid, organic search, AI assistant, social, email, referral, direct. */
function classifyChannel(referrer: string | undefined, utmSource?: string, utmMedium?: string, clickIds: Record<string, string> = {}) {
  const m = (utmMedium ?? "").toLowerCase();
  const src = (utmSource ?? "").toLowerCase();
  let host = "";
  try { host = referrer && referrer !== "direct" ? new URL(referrer).hostname.replace(/^www\./, "") : ""; } catch { /* noop */ }
  const engine = /google\./.test(host) ? "Google" : /bing\.com/.test(host) ? "Bing" : /duckduckgo/.test(host) ? "DuckDuckGo"
    : /yahoo\./.test(host) ? "Yahoo" : /yandex/.test(host) ? "Yandex" : /ecosia/.test(host) ? "Ecosia" : null;
  if (clickIds.gclid || clickIds.gbraid || clickIds.wbraid || clickIds.msclkid || /cpc|ppc|paid_search/.test(m)) return { channel: "paid_search", engine: engine ?? (clickIds.msclkid ? "Bing" : "Google") };
  if (clickIds.fbclid && /paid/.test(m) || /paid_social|cpm/.test(m) || clickIds.li_fat_id || clickIds.ttclid) return { channel: "paid_social", engine: null };
  if (/email|newsletter/.test(m) || src === "newsletter") return { channel: "email", engine: null };
  if (/whatsapp/.test(src)) return { channel: "whatsapp", engine: null };
  if (/chatgpt|openai|perplexity|gemini\.google|copilot|claude\.ai|you\.com/.test(host + src)) return { channel: "ai_assistant", engine: null };
  if (engine) return { channel: "organic_search", engine };
  if (/facebook|instagram|linkedin|t\.co|twitter|x\.com|youtube|reddit|pinterest|quora/.test(host + " " + src) || /social/.test(m)) return { channel: "organic_social", engine: null };
  if (src || m) return { channel: "campaign", engine: null };
  if (host) return { channel: "referral", engine: null };
  return { channel: "direct", engine: null };
}

/** Cheap lead-score heuristic so the CRM can prioritise warm anonymous traffic. */
function scoreVisitor(events: IncomingEvent[], pageViews: number): number {
  let score = Math.min(pageViews * 3, 30);
  for (const e of events) {
    if (/generate_lead|form_submit/.test(e.action)) score += 35;
    else if (/free_audit_click|whatsapp_click|phone_click|booking/.test(e.action)) score += 20;
    else if (/cta_click|pricing/.test(e.action)) score += 8;
    else if (/scroll_depth/.test(e.action) && (e.value ?? 0) >= 75) score += 5;
  }
  return Math.min(score, 100);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const body = (await req.json().catch(() => ({}))) as Payload;
    const visitorId = (body.visitorId ?? "").toString().slice(0, 64);
    if (!visitorId) return json({ error: "visitorId required" }, 400);

    const events = (Array.isArray(body.events) ? body.events : []).slice(0, 50);
    const p = body.profile ?? {};

    const ua = req.headers.get("user-agent") ?? "";
    const { deviceType, browser, os } = parseUA(ua);
    const ip =
      req.headers.get("cf-connecting-ip") ??
      (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ??
      null;
    const geo = resolveGeo(req, p.timezone);
    const country = geo.country;
    const city = geo.city;
    const clickIds = (p.clickIds && typeof p.clickIds === "object") ? Object.fromEntries(Object.entries(p.clickIds).slice(0, 8).map(([k, v]) => [k.slice(0, 20), String(v).slice(0, 200)])) : {};
    const { channel, engine } = classifyChannel(p.referrer, p.utmSource, p.utmMedium, clickIds);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ── visitor profile (upsert, accumulate page views + time on site) ──
    const { data: existing } = await admin
      .from("visitor_profiles")
      .select("id, page_views, time_on_site, lead_score, interests, landing_page, source_channel, search_term, session_count, country, city")
      .eq("visitor_id", visitorId)
      .maybeSingle();

    const pageViews = Math.max(p.pageViews ?? 1, (existing?.page_views ?? 0));
    const leadScore = Math.max(scoreVisitor(events, pageViews), existing?.lead_score ?? 0);
    const interests = Array.from(
      new Set([...(existing?.interests ?? []), ...(p.interests ?? [])]),
    ).slice(0, 20);

    // visitor_profiles.type is constrained to a fixed vocabulary.
    const ALLOWED_TYPES = ["b2b_client", "local_business", "returning_visitor", "enterprise", "startup"];
    const type = ALLOWED_TYPES.includes(p.visitorType ?? "")
      ? p.visitorType!
      : existing ? "returning_visitor" : "local_business";

    const profileRow = {
      visitor_id: visitorId,
      type,
      location: [city, country].filter(Boolean).join(", ") || null,
      last_visit: new Date().toISOString(),
      page_views: pageViews,
      time_on_site: Math.max(p.timeOnSite ?? 0, existing?.time_on_site ?? 0),
      referral_source: p.referrer?.slice(0, 255) || null,
      interests,
      lead_score: leadScore,
      utm_source: p.utmSource?.slice(0, 120) || null,
      utm_medium: p.utmMedium?.slice(0, 120) || null,
      utm_campaign: p.utmCampaign?.slice(0, 120) || null,
      device_type: p.deviceType || deviceType,
      country: country ?? existing?.country ?? null,
      city: city ?? existing?.city ?? null,
      geo_source: geo.source,
      timezone: p.timezone?.slice(0, 64) || null,
      language: p.language?.slice(0, 20) || null,
      browser,
      os,
      screen: p.screen?.slice(0, 20) || null,
      landing_page: existing?.landing_page ?? p.landingPage?.slice(0, 300) ?? null,
      last_page: p.lastPage?.slice(0, 300) || null,
      // Keep the first known channel (first-touch), unless it was "direct".
      source_channel: existing?.source_channel && existing.source_channel !== "direct" ? existing.source_channel : channel,
      search_engine: engine,
      search_term: existing?.search_term ?? p.searchTerm?.slice(0, 200) ?? null,
      utm_term: p.utmTerm?.slice(0, 200) || null,
      utm_content: p.utmContent?.slice(0, 200) || null,
      click_ids: clickIds,
      session_count: Math.max(p.visitNumber ?? 1, existing?.session_count ?? 1),
      updated_at: new Date().toISOString(),
    };

    let profileOk = true;
    if (existing) {
      const { error: updErr } = await admin.from("visitor_profiles").update(profileRow).eq("visitor_id", visitorId);
      if (updErr) { profileOk = false; console.error("visitor_profiles update", updErr.message); }
    } else {
      const { error: insErr } = await admin.from("visitor_profiles").insert(profileRow);
      if (insErr) { profileOk = false; console.error("visitor_profiles insert", insErr.message); }
    }

    // ── interactions + analytics events ──
    if (events.length && profileOk) {
      const interactions = events.map((e) => ({
        visitor_id: visitorId,
        action: e.action.slice(0, 120),
        page_url: e.pageUrl ?? null,
        session_id: e.sessionId ?? body.sessionId ?? null,
        data: (e.data ?? {}) as Record<string, unknown>,
        timestamp: new Date(e.ts ?? Date.now()).toISOString(),
      }));
      const { error: iErr } = await admin.from("visitor_interactions").insert(interactions);
      if (iErr) console.error("visitor_interactions insert", iErr.message);
    }

    if (events.length) {
      const analytics = events.map((e) => ({
        event_name: e.action.slice(0, 120),
        event_category: e.category ?? "engagement",
        event_label: e.label ?? null,
        event_value: typeof e.value === "number" ? Math.round(e.value) : null,
        user_id: visitorId,
        session_id: e.sessionId ?? body.sessionId ?? null,
        page_url: e.pageUrl ?? null,
        referrer: p.referrer ?? null,
        user_agent: ua,
        ip_address: ip,
        country,
        city,
        device_type: p.deviceType || deviceType,
        browser,
        os,
        custom_properties: {
          ...(e.data ?? {}),
          utm_source: p.utmSource ?? null,
          utm_medium: p.utmMedium ?? null,
          utm_campaign: p.utmCampaign ?? null,
          language: p.language ?? null,
          source_channel: channel,
          search_engine: engine,
          search_term: p.searchTerm ?? null,
          timezone: p.timezone ?? null,
        },
      }));
      const { error: aErr } = await admin.from("analytics_events").insert(analytics);
      if (aErr) console.error("analytics_events insert", aErr.message);
    }

    return json({ ok: true, stored: events.length, lead_score: leadScore });
  } catch (e) {
    console.error("track-visitor error", e);
    return json({ error: e instanceof Error ? e.message : "internal error" }, 500);
  }
});
