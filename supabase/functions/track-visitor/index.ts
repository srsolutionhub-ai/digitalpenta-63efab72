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
    const country = req.headers.get("cf-ipcountry") ?? null;
    const city = req.headers.get("cf-ipcity") ?? null;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ── visitor profile (upsert, accumulate page views + time on site) ──
    const { data: existing } = await admin
      .from("visitor_profiles")
      .select("id, page_views, time_on_site, lead_score, interests")
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
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await admin.from("visitor_profiles").update(profileRow).eq("visitor_id", visitorId);
    } else {
      const { error: insErr } = await admin.from("visitor_profiles").insert(profileRow);
      if (insErr) console.error("visitor_profiles insert", insErr.message);
    }

    // ── interactions + analytics events ──
    if (events.length) {
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
