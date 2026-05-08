/**
 * ai-tools edge function — unified backend for the public AI tool suite.
 *
 * Modes (sent in the request body):
 *   • growth-score      → website URL → 0-100 score + roadmap
 *   • ad-copy           → product/audience → Google + Meta ad variants
 *   • meta-tags         → topic/url → optimized title + meta description + OG
 *   • blog-outline      → topic + audience → SEO-tuned outline
 *   • competitor-xray   → your-domain + competitor → gap analysis
 *   • roi-predictor     → industry + budget + city → 90-day forecast
 *
 * Every successful run is recorded in tool_runs as a lead capture row.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const VALID_TOOLS = new Set([
  "growth-score", "ad-copy", "meta-tags", "blog-outline", "competitor-xray", "roi-predictor",
]);

// Per-IP in-memory rate limit (best-effort — fine for a single edge instance).
const RL = new Map<string, { count: number; resetAt: number }>();
const RL_WINDOW_MS = 60 * 60 * 1000;
const RL_MAX = 12;

async function hashIP(ip: string): Promise<string> {
  const buf = new TextEncoder().encode(ip);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(hash)].slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const cur = RL.get(ip);
  if (!cur || cur.resetAt < now) {
    RL.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
    return true;
  }
  if (cur.count >= RL_MAX) return false;
  cur.count++;
  return true;
}

const PROMPTS: Record<string, (i: Record<string, unknown>) => { system: string; user: string }> = {
  "growth-score": (i) => ({
    system: "You are a senior digital marketing strategist. Output strictly valid minified JSON with the schema: {score:number(0-100), grade:'A'|'B'|'C'|'D'|'F', summary:string, strengths:string[], weaknesses:string[], roadmap:[{step:number,title:string,impact:'High'|'Medium'|'Low',timeframe:string,details:string}]}. No prose outside JSON.",
    user: `Audit this website for digital growth potential: ${i.url}. Industry: ${i.industry || "unknown"}. Goal: ${i.goal || "increase revenue"}. Return a 0-100 growth score, top 3 strengths, top 3 weaknesses, and a 6-step prioritized roadmap.`,
  }),
  "ad-copy": (i) => ({
    system: "You are a direct-response copywriter. Output strictly valid minified JSON: {google:[{headlines:string[3],descriptions:string[2]}],meta:[{primary:string,headline:string,description:string}],linkedin:[{intro:string,headline:string}]}. Generate 3 Google variants, 3 Meta variants, 2 LinkedIn variants. Headlines ≤30 chars, Google descriptions ≤90 chars.",
    user: `Write ad copy for: Product/Service = ${i.product}. Target audience = ${i.audience}. Key benefit = ${i.benefit}. Tone = ${i.tone || "confident"}. CTA = ${i.cta || "Get a free consultation"}.`,
  }),
  "meta-tags": (i) => ({
    system: "You are an SEO specialist. Output strictly valid minified JSON: {title:string(<60),description:string(<160),og_title:string,og_description:string,twitter_title:string,twitter_description:string,suggested_keywords:string[5],h1_alternatives:string[3]}. Counts must respect limits.",
    user: `Generate optimized meta tags for: Topic = ${i.topic}. Target keyword = ${i.keyword || i.topic}. Page intent = ${i.intent || "informational"}. Brand = ${i.brand || "Digital Penta"}.`,
  }),
  "blog-outline": (i) => ({
    system: "You are an SEO content strategist. Output strictly valid minified JSON: {title:string,meta_description:string(<160),target_keyword:string,search_intent:string,outline:[{h2:string,bullets:string[]}],faqs:[{q:string,a:string}],internal_link_suggestions:string[],external_authority_links:string[]}. Outline 6-8 H2 sections, 5 FAQs.",
    user: `Create an SEO-optimised blog outline. Topic: ${i.topic}. Target keyword: ${i.keyword || i.topic}. Audience: ${i.audience || "marketing decision-makers"}. Word count target: ${i.wordCount || 1500}.`,
  }),
  "competitor-xray": (i) => ({
    system: "You are a competitive intelligence analyst. Output strictly valid minified JSON: {summary:string,gaps:[{category:string,you:string,competitor:string,opportunity:string,priority:'High'|'Medium'|'Low'}],quick_wins:string[5],content_gaps:string[5],keyword_opportunities:string[10]}. Use general industry knowledge.",
    user: `Compare ${i.yourDomain} vs ${i.competitorDomain}. Industry: ${i.industry || "agency/services"}. Surface ranking, content, ads, social and CRO gaps. Return prioritized opportunities.`,
  }),
  "roi-predictor": (i) => ({
    system: "You are a marketing finance analyst. Output strictly valid minified JSON: {summary:string,scenarios:[{label:'Conservative'|'Base'|'Aggressive',monthlyLeads:number,monthlyRevenue:number,roi:number,assumptions:string}],kpis:{cpl:number,cac:number,paybackMonths:number,ltv:number},recommendations:string[5]}. Currency in user's region.",
    user: `Forecast 90-day ROI. Industry: ${i.industry}. Monthly budget: ${i.budget} ${i.currency || "INR"}. City: ${i.city}. Channels: ${i.channels || "SEO + Google Ads + Meta Ads"}. Average order value: ${i.aov || "unknown"}.`,
  }),
};

async function callAI(tool: string, inputs: Record<string, unknown>): Promise<unknown> {
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  const promptFn = PROMPTS[tool];
  if (!promptFn) throw new Error("Invalid tool");
  const { system, user } = promptFn(inputs);

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) throw new Error("AI gateway rate-limited. Try again in a minute.");
  if (res.status === 402) throw new Error("AI gateway credits exhausted. Please contact support.");
  if (!res.ok) throw new Error(`AI gateway error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    return { raw: content, _parseError: true };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { tool, inputs, email, name, company, phone, utm } = body ?? {};

    if (!tool || !VALID_TOOLS.has(tool)) {
      return new Response(JSON.stringify({ error: "Invalid tool" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!inputs || typeof inputs !== "object") {
      return new Response(JSON.stringify({ error: "Missing inputs" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait an hour." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ipHash = await hashIP(ip);
    const userAgent = req.headers.get("user-agent") ?? null;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    let output: unknown;
    let status = "completed";
    let errMsg: string | null = null;
    try {
      output = await callAI(tool, inputs);
    } catch (e) {
      status = "failed";
      errMsg = (e as Error).message;
      output = { error: errMsg };
    }

    await supabase.from("tool_runs").insert({
      tool_slug: tool,
      email,
      name: name ?? null,
      company: company ?? null,
      phone: phone ?? null,
      inputs,
      output,
      ip_hash: ipHash,
      user_agent: userAgent,
      utm: utm ?? {},
      status,
      error: errMsg,
    });

    if (status === "failed") {
      return new Response(JSON.stringify({ error: errMsg }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ result: output }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
