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

// ─────────────────────────────────────────────
// Rate limiting (per cold start, per IP)
// ─────────────────────────────────────────────
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
    const u = new URL(input.trim().startsWith("http") ? input.trim() : `https://${input.trim()}`);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Server-side lead validation
// Returns field-level errors so the form can render them inline.
// ─────────────────────────────────────────────
const PHONE_RE = /^[+]?[\d\s\-().]{8,20}$/;
const COMPANY_RE = /^[a-zA-Z0-9 .,&'\-]{2,100}$/;
const DISPOSABLE_DOMAINS = /@(mailinator|guerrillamail|10minutemail|tempmail|trashmail|yopmail)\./i;

interface LeadInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  consent?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

function validateLead(lead: LeadInput | null): { ok: true; lead: LeadInput } | { ok: false; field_errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!lead || typeof lead !== "object") {
    return { ok: false, field_errors: { _form: "Missing lead details." } };
  }

  const name = String(lead.name ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your full name.";
  if (name.length > 100) errors.name = "Name is too long.";

  const email = String(lead.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (DISPOSABLE_DOMAINS.test(email)) {
    errors.email = "Please use a real work email — disposable inboxes aren't accepted.";
  } else if (email.length > 255) {
    errors.email = "Email is too long.";
  }

  const phone = String(lead.phone ?? "").trim();
  if (!phone) errors.phone = "Phone number is required so we can share your report.";
  else if (!PHONE_RE.test(phone)) errors.phone = "Use 8–20 digits, optional +, spaces or dashes.";

  const company = String(lead.company ?? "").trim();
  if (company && !COMPANY_RE.test(company)) {
    errors.company = "Use letters, numbers and . , & ' - (2–100 chars).";
  }

  if (lead.consent !== true) {
    errors.consent = "Please accept the privacy notice to continue.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, field_errors: errors };
  return {
    ok: true,
    lead: {
      name,
      email,
      phone,
      company: company || undefined,
      consent: true,
      utm_source: lead.utm_source,
      utm_medium: lead.utm_medium,
      utm_campaign: lead.utm_campaign,
    },
  };
}

// ─────────────────────────────────────────────
// Google PageSpeed Insights (Lighthouse) with retry
// ─────────────────────────────────────────────
async function runLighthouse(
  url: string,
  strategy: "mobile" | "desktop",
  attempt = 1,
): Promise<any> {
  const params = new URLSearchParams({ url, strategy });
  ["performance", "seo", "accessibility", "best-practices"].forEach((c) =>
    params.append("category", c),
  );
  if (PAGESPEED_API_KEY) params.set("key", PAGESPEED_API_KEY);

  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 75_000);
  try {
    const r = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);
    if (!r.ok) {
      const txt = await r.text();
      // Retry once on 429/5xx
      if ((r.status === 429 || r.status >= 500) && attempt < 2) {
        await new Promise((res) => setTimeout(res, 2000));
        return runLighthouse(url, strategy, attempt + 1);
      }
      throw new Error(`PageSpeed API ${r.status}: ${txt.slice(0, 200)}`);
    }
    return await r.json();
  } catch (e) {
    clearTimeout(timeout);
    if (attempt < 2) {
      await new Promise((res) => setTimeout(res, 1500));
      return runLighthouse(url, strategy, attempt + 1);
    }
    throw e;
  }
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
    cls: Number(audits["cumulative-layout-shift"]?.numericValue ?? 0),
    tbt_ms: Math.round(audits["total-blocking-time"]?.numericValue ?? 0),
    speed_index: Math.round(audits["speed-index"]?.numericValue ?? 0),
    inp_ms: Math.round(audits["interaction-to-next-paint"]?.numericValue ?? 0),
    ttfb_ms: Math.round(audits["server-response-time"]?.numericValue ?? 0),
  };
}

// ─────────────────────────────────────────────
// On-page SEO checks (direct fetch + parse)
// ─────────────────────────────────────────────
async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DigitalPentaAuditBot/1.0; +https://digitalpenta.com/audit)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);
    const html = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      headers: Object.fromEntries(res.headers.entries()),
      html: html.slice(0, 500_000), // cap 500KB
      size_kb: Math.round(html.length / 1024),
    };
  } catch (e) {
    clearTimeout(timeout);
    return { ok: false, status: 0, finalUrl: url, headers: {}, html: "", size_kb: 0, error: String(e) };
  }
}

function getMatch(html: string, regex: RegExp): string | null {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}
function getAll(html: string, regex: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) out.push(m[1].trim());
  return out;
}

async function urlExists(url: string): Promise<boolean> {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 8_000);
    const r = await fetch(url, { signal: c.signal, method: "GET", redirect: "follow" });
    clearTimeout(t);
    return r.ok;
  } catch {
    return false;
  }
}

async function runOnPageChecks(url: string) {
  const fetched = await fetchHtml(url);
  if (!fetched.ok || !fetched.html) {
    return {
      reachable: false,
      status_code: fetched.status,
      error: (fetched as any).error ?? `HTTP ${fetched.status}`,
    };
  }

  const html = fetched.html;
  const u = new URL(url);
  const origin = `${u.protocol}//${u.host}`;

  // Title
  const title = getMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  // Meta description
  const metaDesc = getMatch(
    html,
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  ) ?? getMatch(
    html,
    /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
  );
  // Canonical
  const canonical = getMatch(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  // Viewport
  const viewport = getMatch(html, /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i);
  // Charset
  const charset = getMatch(html, /<meta[^>]+charset=["']?([^"'\s>]+)["']?/i);
  // Lang
  const lang = getMatch(html, /<html[^>]+lang=["']([^"']+)["']/i);
  // OG tags
  const ogTitle = getMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const ogDesc = getMatch(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
  const ogImage = getMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  const twitterCard = getMatch(html, /<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i);
  // Favicon
  const favicon = getMatch(html, /<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
  // H1 / H2
  const h1s = getAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((s) => s.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
  const h2s = getAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).map((s) => s.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
  // Images / alts
  const imgTags = html.match(/<img[^>]+>/gi) ?? [];
  const imagesWithoutAlt = imgTags.filter((t) => !/\salt\s*=/i.test(t)).length;
  // Links
  const linkTags = html.match(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi) ?? [];
  let internalLinks = 0;
  let externalLinks = 0;
  let nofollowLinks = 0;
  linkTags.forEach((tag) => {
    const href = (tag.match(/href=["']([^"']+)["']/i) ?? [, ""])[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const linkUrl = new URL(href, origin);
      if (linkUrl.host === u.host) internalLinks++;
      else externalLinks++;
    } catch { /* ignore */ }
    if (/rel=["'][^"']*nofollow/i.test(tag)) nofollowLinks++;
  });
  // Structured data
  const jsonLd = getAll(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const wordCount = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

  // Robots & sitemap
  const [robotsExists, sitemapExists] = await Promise.all([
    urlExists(`${origin}/robots.txt`),
    urlExists(`${origin}/sitemap.xml`),
  ]);

  // Security headers
  const h = (fetched.headers ?? {}) as Record<string, string>;
  const securityHeaders = {
    https: u.protocol === "https:",
    hsts: !!h["strict-transport-security"],
    x_frame_options: !!h["x-frame-options"],
    x_content_type_options: !!h["x-content-type-options"],
    content_security_policy: !!h["content-security-policy"],
    referrer_policy: !!h["referrer-policy"],
    permissions_policy: !!h["permissions-policy"],
  };

  return {
    reachable: true,
    status_code: fetched.status,
    final_url: fetched.finalUrl,
    page_size_kb: fetched.size_kb,
    meta: {
      title,
      title_length: title?.length ?? 0,
      meta_description: metaDesc,
      meta_description_length: metaDesc?.length ?? 0,
      canonical,
      viewport,
      charset,
      lang,
      favicon: !!favicon,
    },
    social: {
      og_title: ogTitle,
      og_description: ogDesc,
      og_image: ogImage,
      twitter_card: twitterCard,
    },
    headings: {
      h1_count: h1s.length,
      h1_samples: h1s.slice(0, 3),
      h2_count: h2s.length,
    },
    content: {
      word_count: wordCount,
      images_total: imgTags.length,
      images_without_alt: imagesWithoutAlt,
      internal_links: internalLinks,
      external_links: externalLinks,
      nofollow_links: nofollowLinks,
      structured_data_blocks: jsonLd.length,
    },
    technical: {
      robots_txt: robotsExists,
      sitemap_xml: sitemapExists,
      ...securityHeaders,
    },
  };
}

// ─────────────────────────────────────────────
// Lead score helper (mirrors DB calculate_lead_score logic, simplified)
// ─────────────────────────────────────────────
function quickLeadScore(payload: { email: string; company?: string; phone?: string; overall?: number }): number {
  let score = 25; // baseline for using audit tool
  if (payload.email && !/@(gmail|yahoo|hotmail|outlook)\./i.test(payload.email)) score += 20;
  if (payload.company && payload.company.length > 1) score += 15;
  if (payload.phone && payload.phone.length >= 8) score += 10;
  if (typeof payload.overall === "number" && payload.overall < 60) score += 20; // worse score = hotter lead
  return Math.min(score, 100);
}

// ─────────────────────────────────────────────
// Verification — cross-check sources before showing pass/fail
// ─────────────────────────────────────────────
type Verdict = "pass" | "warn" | "fail" | "unknown";
interface CheckVerdict {
  id: string;
  label: string;
  verdict: Verdict;
  detail?: string;
  sources: string[]; // which evidence we used
  agreement: "agree" | "partial" | "single" | "conflict";
}

function buildVerification(input: {
  mobile: any;
  desktop: any;
  onPage: any;
  mobileRaw: any;
  desktopRaw: any;
}): { checks: CheckVerdict[]; reachability: { lighthouse_mobile: boolean; lighthouse_desktop: boolean; crawl: boolean }; trust_score: number } {
  const { mobile, desktop, onPage } = input;
  const checks: CheckVerdict[] = [];
  const reach = {
    lighthouse_mobile: !!mobile,
    lighthouse_desktop: !!desktop,
    crawl: !!onPage?.reachable,
  };

  const agreement = (sources: number) => (sources >= 2 ? "agree" : sources === 1 ? "single" : "conflict");

  // HTTPS — confirm via crawl URL + Lighthouse audit if present
  const crawlHttps = onPage?.technical?.https === true;
  const lhHttps = input.mobileRaw?.lighthouseResult?.audits?.["is-on-https"]?.score;
  const httpsSources: string[] = [];
  if (onPage?.reachable) httpsSources.push("crawl");
  if (typeof lhHttps === "number") httpsSources.push("lighthouse");
  let httpsVerdict: Verdict = "unknown";
  if (httpsSources.length === 0) httpsVerdict = "unknown";
  else if (crawlHttps && (lhHttps === undefined || lhHttps === 1)) httpsVerdict = "pass";
  else if (!crawlHttps && lhHttps === 0) httpsVerdict = "fail";
  else httpsVerdict = "warn";
  checks.push({
    id: "https",
    label: "HTTPS / TLS",
    verdict: httpsVerdict,
    sources: httpsSources,
    agreement: agreement(httpsSources.length),
    detail: crawlHttps ? "Site served over HTTPS" : "Not served over HTTPS",
  });

  // Viewport (mobile)
  const crawlVp = !!onPage?.meta?.viewport;
  const lhVp = input.mobileRaw?.lighthouseResult?.audits?.viewport?.score;
  const vpSources: string[] = [];
  if (onPage?.reachable) vpSources.push("crawl");
  if (typeof lhVp === "number") vpSources.push("lighthouse");
  let vpVerdict: Verdict = "unknown";
  if (!vpSources.length) vpVerdict = "unknown";
  else if (crawlVp && (lhVp === undefined || lhVp === 1)) vpVerdict = "pass";
  else if (!crawlVp && lhVp === 0) vpVerdict = "fail";
  else vpVerdict = "warn";
  checks.push({ id: "viewport", label: "Mobile viewport", verdict: vpVerdict, sources: vpSources, agreement: agreement(vpSources.length) });

  // Title tag
  const titleLen = onPage?.meta?.title_length ?? 0;
  const lhTitle = input.mobileRaw?.lighthouseResult?.audits?.["document-title"]?.score;
  const titleSources: string[] = [];
  if (onPage?.reachable) titleSources.push("crawl");
  if (typeof lhTitle === "number") titleSources.push("lighthouse");
  let titleVerdict: Verdict = "unknown";
  if (!titleSources.length) titleVerdict = "unknown";
  else if (titleLen >= 30 && titleLen <= 65 && lhTitle !== 0) titleVerdict = "pass";
  else if (!titleLen) titleVerdict = "fail";
  else titleVerdict = "warn";
  checks.push({ id: "title", label: "Title tag", verdict: titleVerdict, sources: titleSources, agreement: agreement(titleSources.length), detail: titleLen ? `${titleLen} chars` : "Missing" });

  // Meta description
  const descLen = onPage?.meta?.meta_description_length ?? 0;
  const lhDesc = input.mobileRaw?.lighthouseResult?.audits?.["meta-description"]?.score;
  const descSources: string[] = [];
  if (onPage?.reachable) descSources.push("crawl");
  if (typeof lhDesc === "number") descSources.push("lighthouse");
  let descVerdict: Verdict = "unknown";
  if (!descSources.length) descVerdict = "unknown";
  else if (descLen >= 70 && descLen <= 160 && lhDesc !== 0) descVerdict = "pass";
  else if (!descLen) descVerdict = "fail";
  else descVerdict = "warn";
  checks.push({ id: "meta_description", label: "Meta description", verdict: descVerdict, sources: descSources, agreement: agreement(descSources.length), detail: descLen ? `${descLen} chars` : "Missing" });

  // H1
  const h1c = onPage?.headings?.h1_count ?? 0;
  const h1Sources: string[] = onPage?.reachable ? ["crawl"] : [];
  checks.push({
    id: "h1",
    label: "Single H1",
    verdict: h1c === 1 ? "pass" : h1c > 1 ? "warn" : h1c === 0 ? "fail" : "unknown",
    sources: h1Sources,
    agreement: agreement(h1Sources.length),
    detail: `${h1c} found`,
  });

  // Canonical
  const canon = !!onPage?.meta?.canonical;
  const lhCanon = input.mobileRaw?.lighthouseResult?.audits?.["canonical"]?.score;
  const canonSources: string[] = [];
  if (onPage?.reachable) canonSources.push("crawl");
  if (typeof lhCanon === "number") canonSources.push("lighthouse");
  checks.push({
    id: "canonical",
    label: "Canonical URL",
    verdict: !canonSources.length ? "unknown" : canon && lhCanon !== 0 ? "pass" : canon ? "warn" : "fail",
    sources: canonSources,
    agreement: agreement(canonSources.length),
  });

  // Image alts
  const noAlt = onPage?.content?.images_without_alt ?? 0;
  const lhAlt = input.mobileRaw?.lighthouseResult?.audits?.["image-alt"]?.score;
  const altSources: string[] = [];
  if (onPage?.reachable) altSources.push("crawl");
  if (typeof lhAlt === "number") altSources.push("lighthouse");
  checks.push({
    id: "image_alt",
    label: "Image alt attributes",
    verdict: !altSources.length ? "unknown" : noAlt === 0 && lhAlt !== 0 ? "pass" : noAlt <= 3 ? "warn" : "fail",
    sources: altSources,
    agreement: agreement(altSources.length),
    detail: `${noAlt} missing`,
  });

  // robots.txt + sitemap
  checks.push({
    id: "robots",
    label: "robots.txt",
    verdict: onPage?.technical?.robots_txt ? "pass" : onPage?.reachable ? "warn" : "unknown",
    sources: onPage?.reachable ? ["crawl"] : [],
    agreement: "single",
  });
  checks.push({
    id: "sitemap",
    label: "sitemap.xml",
    verdict: onPage?.technical?.sitemap_xml ? "pass" : onPage?.reachable ? "warn" : "unknown",
    sources: onPage?.reachable ? ["crawl"] : [],
    agreement: "single",
  });

  // Performance — only badge if Lighthouse + crawl both reachable
  const perf = mobile?.performance ?? desktop?.performance;
  const perfSources: string[] = [];
  if (mobile) perfSources.push("lighthouse_mobile");
  if (desktop) perfSources.push("lighthouse_desktop");
  checks.push({
    id: "performance",
    label: "Performance score",
    verdict: typeof perf !== "number" ? "unknown" : perf >= 90 ? "pass" : perf >= 50 ? "warn" : "fail",
    sources: perfSources,
    agreement: agreement(perfSources.length),
    detail: typeof perf === "number" ? `${perf}/100` : undefined,
  });

  const total = checks.length;
  const trustScore = total === 0
    ? 0
    : Math.round(
        (checks.filter((c) => c.agreement === "agree").length * 100 +
          checks.filter((c) => c.agreement === "single").length * 60) /
          total,
      );

  return { checks, reachability: reach, trust_score: trustScore };
}

// ─────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────
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

    const body = await req.json().catch(() => ({}));
    const url = normalizeUrl(String(body?.url ?? ""));
    if (!url) {
      return new Response(JSON.stringify({ error: "Please enter a valid URL." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lead = body?.lead ?? null;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── Create audit row ──────────────────────
    const { data: audit, error: auditErr } = await supabase
      .from("audits")
      .insert({
        url,
        status: "running",
        ip_address: ip === "unknown" ? null : ip,
        user_agent: req.headers.get("user-agent"),
        visitor_name: lead?.name ?? null,
        visitor_email: lead?.email ?? null,
        visitor_phone: lead?.phone ?? null,
        visitor_company: lead?.company ?? null,
        visitor_website: url,
      })
      .select()
      .single();
    if (auditErr) throw auditErr;

    // ── Run Lighthouse + on-page in parallel ──
    const [mobileJson, desktopJson, onPage] = await Promise.all([
      runLighthouse(url, "mobile").catch((e) => ({ __error: String(e) })),
      runLighthouse(url, "desktop").catch((e) => ({ __error: String(e) })),
      runOnPageChecks(url).catch((e) => ({ reachable: false, error: String(e) })),
    ]);

    const mobile = (mobileJson as any).__error ? null : pickScores(mobileJson);
    const desktop = (desktopJson as any).__error ? null : pickScores(desktopJson);

    if (!mobile && !desktop) {
      await supabase.from("audits").update({ status: "failed", on_page_checks: onPage }).eq("id", audit.id);
      return new Response(
        JSON.stringify({
          error:
            "We could not reach Google Lighthouse for this site. The URL may be blocking bots or unreachable. Please verify it loads in a browser and try again.",
          on_page: onPage,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Persist runs
    const runs: any[] = [];
    if (mobile) runs.push({ audit_id: audit.id, device: "mobile", ...mobile });
    if (desktop) runs.push({ audit_id: audit.id, device: "desktop", ...desktop });
    if (runs.length) await supabase.from("audit_lighthouse_runs").insert(runs);

    const primary = mobile ?? desktop!;
    const overall = Math.round(
      ((primary.performance ?? 0) +
        (primary.seo ?? 0) +
        (primary.accessibility ?? 0) +
        (primary.best_practices ?? 0)) /
        4,
    );

    // ── Verification: cross-check Lighthouse + crawl + on-page before badging ──
    const verification = buildVerification({
      mobile,
      desktop,
      onPage: onPage as any,
      mobileRaw: mobileJson,
      desktopRaw: desktopJson,
    });

    // Opportunities for AI
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

    // ── Save lead in CRM if user provided details ─
    let leadId: string | null = null;
    if (lead?.email && lead?.name) {
      try {
        const score = quickLeadScore({
          email: lead.email,
          company: lead.company,
          phone: lead.phone,
          overall,
        });
        const { data: leadRow } = await supabase
          .from("leads")
          .insert({
            name: lead.name,
            email: lead.email,
            phone: lead.phone ?? null,
            company: lead.company ?? null,
            website: url,
            service: "SEO Audit",
            source: "seo_audit_tool",
            lead_score: score,
            status: "new",
            notes: `Ran free SEO audit. Overall: ${overall}/100. Performance: ${primary.performance}, SEO: ${primary.seo}.`,
            utm_source: lead.utm_source ?? null,
            utm_medium: lead.utm_medium ?? null,
            utm_campaign: lead.utm_campaign ?? null,
            meta_data: {
              audit_id: audit.id,
              audit_url: url,
              overall,
              scores: primary,
              on_page_summary: {
                title: (onPage as any)?.meta?.title ?? null,
                h1_count: (onPage as any)?.headings?.h1_count ?? 0,
                images_without_alt: (onPage as any)?.content?.images_without_alt ?? 0,
                robots_txt: (onPage as any)?.technical?.robots_txt ?? false,
                sitemap_xml: (onPage as any)?.technical?.sitemap_xml ?? false,
                https: (onPage as any)?.technical?.https ?? false,
              },
            },
          })
          .select("id")
          .single();
        leadId = leadRow?.id ?? null;
      } catch (e) {
        console.error("lead insert error", e);
      }
    }

    // ── Update audit (store verification inside on_page_checks JSONB) ──
    const onPageWithVerification = { ...(onPage as any), verification };
    await supabase
      .from("audits")
      .update({
        status: "scored",
        overall_score: overall,
        performance_score: primary.performance,
        seo_score: primary.seo,
        accessibility_score: primary.accessibility,
        best_practices_score: primary.best_practices,
        on_page_checks: onPageWithVerification,
        lead_id: leadId,
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
        on_page: onPage,
        verification,
        lead_id: leadId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("run-seo-audit error", e);
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
