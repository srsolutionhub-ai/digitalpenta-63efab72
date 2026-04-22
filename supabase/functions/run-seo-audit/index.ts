import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PAGESPEED_API_KEY = Deno.env.get("PAGESPEED_API_KEY") ?? "";

// Simple in-memory rate limit (per cold start)
const buckets = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

function normalizeUrl(input: string): string | null {
  try {
    const u = new URL(input.startsWith("http") ? input : `https://${input}`);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

async function runLighthouse(url: string, strategy: "mobile" | "desktop") {
  const params = new URLSearchParams({
    url,
    strategy,
    category: "performance",
  });
  // Add more categories
  ["seo", "accessibility", "best-practices"].forEach((c) => params.append("category", c));
  if (PAGESPEED_API_KEY) params.set("key", PAGESPEED_API_KEY);

  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
  const r = await fetch(endpoint);
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`PageSpeed API ${r.status}: ${txt.slice(0, 200)}`);
  }
  return r.json();
}

function pickScores(json: any) {
  const cats = json?.lighthouseResult?.categories ?? {};
  const audits = json?.lighthouseResult?.audits ?? {};
  const pct = (v: any) => (typeof v === "number" ? Math.round(v * 100) : null);
  return {
    performance: pct(cats.performance?.score),
    seo: pct(cats.seo?.score),
    accessibility: pct(cats.accessibility?.score),
    best_practices: pct(cats["best-practices"]?.score),
    fcp_ms: Math.round(audits["first-contentful-paint"]?.numericValue ?? 0),
    lcp_ms: Math.round(audits["largest-contentful-paint"]?.numericValue ?? 0),
    cls: audits["cumulative-layout-shift"]?.numericValue ?? 0,
    tbt_ms: Math.round(audits["total-blocking-time"]?.numericValue ?? 0),
    speed_index: Math.round(audits["speed-index"]?.numericValue ?? 0),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    if (!rateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const url = normalizeUrl(String(body?.url ?? ""));
    if (!url) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create audit row
    const { data: audit, error: auditErr } = await supabase
      .from("audits")
      .insert({
        url,
        status: "running",
        ip_address: ip === "unknown" ? null : ip,
        user_agent: req.headers.get("user-agent"),
      })
      .select()
      .single();
    if (auditErr) throw auditErr;

    // Fetch mobile + desktop in parallel
    const [mobileJson, desktopJson] = await Promise.all([
      runLighthouse(url, "mobile").catch((e) => ({ __error: String(e) })),
      runLighthouse(url, "desktop").catch((e) => ({ __error: String(e) })),
    ]);

    const mobile = (mobileJson as any).__error ? null : pickScores(mobileJson);
    const desktop = (desktopJson as any).__error ? null : pickScores(desktopJson);

    if (!mobile && !desktop) {
      await supabase.from("audits").update({ status: "failed" }).eq("id", audit.id);
      return new Response(
        JSON.stringify({ error: "Lighthouse fetch failed for both devices", details: mobileJson }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Persist runs
    const runs = [];
    if (mobile)
      runs.push({
        audit_id: audit.id,
        device: "mobile",
        performance_score: mobile.performance,
        seo_score: mobile.seo,
        accessibility_score: mobile.accessibility,
        best_practices_score: mobile.best_practices,
        fcp_ms: mobile.fcp_ms,
        lcp_ms: mobile.lcp_ms,
        cls: mobile.cls,
        tbt_ms: mobile.tbt_ms,
        speed_index: mobile.speed_index,
      });
    if (desktop)
      runs.push({
        audit_id: audit.id,
        device: "desktop",
        performance_score: desktop.performance,
        seo_score: desktop.seo,
        accessibility_score: desktop.accessibility,
        best_practices_score: desktop.best_practices,
        fcp_ms: desktop.fcp_ms,
        lcp_ms: desktop.lcp_ms,
        cls: desktop.cls,
        tbt_ms: desktop.tbt_ms,
        speed_index: desktop.speed_index,
      });
    if (runs.length) await supabase.from("audit_lighthouse_runs").insert(runs);

    const primary = mobile ?? desktop!;
    const overall = Math.round(
      ((primary.performance ?? 0) + (primary.seo ?? 0) + (primary.accessibility ?? 0) + (primary.best_practices ?? 0)) / 4
    );

    // Pull a compact set of failing/opportunity audits for AI input
    const lhAudits = (mobileJson as any)?.lighthouseResult?.audits ?? {};
    const opportunities = Object.entries(lhAudits)
      .filter(([, a]: any) => a?.score !== null && a?.score < 0.9 && a?.title)
      .slice(0, 25)
      .map(([id, a]: any) => ({
        id,
        title: a.title,
        description: a.description,
        score: a.score,
        displayValue: a.displayValue,
      }));

    await supabase
      .from("audits")
      .update({
        status: "scored",
        overall_score: overall,
        performance_score: primary.performance,
        seo_score: primary.seo,
        accessibility_score: primary.accessibility,
        best_practices_score: primary.best_practices,
      })
      .eq("id", audit.id);

    return new Response(
      JSON.stringify({
        audit_id: audit.id,
        url,
        overall,
        mobile,
        desktop,
        opportunities,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("run-seo-audit error", e);
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
