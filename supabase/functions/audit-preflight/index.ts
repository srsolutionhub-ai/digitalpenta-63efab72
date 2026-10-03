import { createClient } from "npm:@supabase/supabase-js@2";
import { underHourlyLimit } from "../_shared/rateLimit.ts";
// Lightweight preflight check: verifies that we can reach the URL and that
// Google PageSpeed Insights is responsive before kicking off a full audit.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PAGESPEED_API_KEY = Deno.env.get("PAGESPEED_API_KEY") ?? "";

function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (["localhost", "ip6-localhost", "ip6-loopback", "metadata.google.internal",
       "metadata", "metadata.goog", "0.0.0.0"].includes(h)) return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1]), parseInt(m[2])];
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true;
    return false;
  }
  if (h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return false;
}

function normalizeUrl(input: string): string | null {
  try {
    const u = new URL(input.trim().startsWith("http") ? input.trim() : `https://${input.trim()}`);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    if (isPrivateHost(u.hostname)) return null;
    if (u.port && !["80", "443"].includes(u.port)) return null;
    if (u.username || u.password) return null;
    return u.toString();
  } catch {
    return null;
  }
}


// Resolves the host and refuses addresses on private or internal networks.
async function resolvesPublic(host: string): Promise<boolean> {
  if (/^[\d.]+$/.test(host) || host.includes(":")) return !isPrivateHost(host);
  try {
    const [a, aaaa] = await Promise.all([
      Deno.resolveDns(host, "A").catch(() => [] as string[]),
      Deno.resolveDns(host, "AAAA").catch(() => [] as string[]),
    ]);
    const all = [...a, ...aaaa];
    return all.length > 0 && all.every((ip) => !isPrivateHost(ip));
  } catch { return false; }
}

// Follows up to 4 redirects by hand, re-checking each destination.
async function safeFetch(url: string, init: RequestInit): Promise<Response> {
  let current = url;
  for (let hop = 0; hop < 5; hop++) {
    const u = new URL(current);
    if (!["http:", "https:"].includes(u.protocol) || isPrivateHost(u.hostname) || !(await resolvesPublic(u.hostname))) {
      throw new Error("blocked destination");
    }
    const res = await fetch(current, { ...init, redirect: "manual" });
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) { current = new URL(loc, current).toString(); continue; }
    return res;
  }
  throw new Error("too many redirects");
}

async function checkCrawl(url: string) {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await safeFetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DigitalPentaPreflight/1.0; +https://digitalpenta.com/audit)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);
    return {
      reachable: res.ok,
      status: res.status,
      final_url: res.url,
      response_time_ms: Date.now() - start,
      blocked_by_bot_protection:
        res.status === 403 ||
        res.status === 401 ||
        res.headers.get("server")?.toLowerCase().includes("cloudflare") &&
          res.status >= 400,
    };
  } catch (e) {
    clearTimeout(timeout);
    return {
      reachable: false,
      status: 0,
      final_url: url,
      response_time_ms: Date.now() - start,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function checkLighthouse(url: string) {
  // Use a "fieldData only" lite call for fast availability check
  const params = new URLSearchParams({ url, strategy: "mobile", category: "performance" });
  if (PAGESPEED_API_KEY) params.set("key", PAGESPEED_API_KEY);
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
  const controller = new AbortController();
  // PSI is often slow; use a shorter probe — we just want to know if the API is up
  // and willing to fetch the URL. We hit a real call but only category=performance.
  const timeout = setTimeout(() => controller.abort(), 25_000);
  const start = Date.now();
  try {
    // We only need the response status for availability — but we also try to read
    // any error message PSI returns (e.g. "FAILED_DOCUMENT_REQUEST")
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);
    let detail: string | null = null;
    let psiCode: string | null = null;
    if (!res.ok) {
      try {
        const j = await res.json();
        detail = j?.error?.message ?? null;
        psiCode = j?.error?.errors?.[0]?.reason ?? null;
      } catch {
        detail = await res.text().catch(() => null);
      }
    }
    return {
      available: res.ok,
      status: res.status,
      response_time_ms: Date.now() - start,
      throttled: res.status === 429,
      auth_key_used: !!PAGESPEED_API_KEY,
      psi_error_code: psiCode,
      detail: detail ? String(detail).slice(0, 240) : null,
    };
  } catch (e) {
    clearTimeout(timeout);
    return {
      available: false,
      status: 0,
      response_time_ms: Date.now() - start,
      throttled: false,
      auth_key_used: !!PAGESPEED_API_KEY,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const url = normalizeUrl(String(body?.url ?? "").slice(0, 500));
    const limiter = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    if (!(await underHourlyLimit(limiter, req, "audit_preflight", 15))) {
      return new Response(JSON.stringify({ error: "Too many checks. Please try again in an hour." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!url || !(await resolvesPublic(new URL(url).hostname))) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid URL." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const [crawl, lighthouse] = await Promise.all([checkCrawl(url), checkLighthouse(url)]);

    // Build user-facing readiness verdict + warnings
    const warnings: string[] = [];
    if (!crawl.reachable) {
      warnings.push(
        `We couldn't reach ${url} directly (HTTP ${crawl.status || "no response"}). The site may be down or blocking bots.`,
      );
    } else if (crawl.response_time_ms > 6000) {
      warnings.push("Your site responded slowly — the audit may take longer than usual.");
    }
    if (!lighthouse.available) {
      if (lighthouse.throttled) {
        warnings.push("Google Lighthouse is rate-limiting right now. Please retry in a minute.");
      } else if ((lighthouse as any).psi_error_code === "FAILED_DOCUMENT_REQUEST") {
        warnings.push(
          "Google Lighthouse couldn't fetch this URL — the origin likely blocks Google's bot.",
        );
      } else {
        warnings.push("Google Lighthouse is temporarily unavailable. You can still try the audit.");
      }
    }

    const ready = crawl.reachable && lighthouse.available;
    const partial = crawl.reachable !== lighthouse.available;

    return new Response(
      JSON.stringify({
        url,
        ready,
        partial,
        crawl,
        lighthouse,
        warnings,
        verdict: ready ? "ready" : partial ? "partial" : "blocked",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
