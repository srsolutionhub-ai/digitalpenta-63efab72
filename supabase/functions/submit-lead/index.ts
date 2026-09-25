// submit-lead — single, hardened entry point for every public website form.
// Validation → spam checks → rate limit → dedupe → AI scoring → routing → emails.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { Output, streamText } from "npm:ai";

const MODEL = "openai/gpt-6-astra";
const RATE_LIMIT_PER_HOUR = 5;
const MIN_FILL_MS = 2500;
const HOT_SCORE = 70;

const Body = z.object({
  form: z.enum(["contact", "homepage", "audit", "proposal", "data_request", "tool"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(255),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/, "Invalid phone").optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  timeline: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  page: z.string().max(500).optional(),
  utm: z.record(z.string().max(200)).optional(),
  first_touch: z.record(z.string().max(500)).optional(),
  extra: z.record(z.unknown()).optional(),
  // spam signals
  hp: z.string().max(200).optional(),          // honeypot, must be empty
  started_at: z.number().optional(),           // ms timestamp form was rendered
});
type LeadInput = z.infer<typeof Body>;

const Score = z.object({
  score: z.number().int().min(0).max(100),
  intent: z.enum(["seo", "ads", "social", "web_dev", "app_dev", "ai", "automation", "branding", "pr", "other"]),
  budget_band: z.enum(["unknown", "starter", "growth", "enterprise"]),
  summary: z.string(),
});
type ScoreT = z.infer<typeof Score>;

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function sha(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/** Deterministic fallback so a lead is never lost if AI is unavailable. */
function ruleScore(l: LeadInput): ScoreT {
  let s = 20;
  if (l.company) s += 15;
  if (l.website) s += 10;
  if (l.phone) s += 10;
  if (!/@(gmail|yahoo|hotmail|outlook)\./i.test(l.email)) s += 15;
  if ((l.message ?? "").length > 120) s += 10;
  if (/5l|10l|enterprise|\$10|\$5|50k|100k/i.test(l.budget ?? "")) s += 20;
  const svc = `${l.service} ${l.message}`.toLowerCase();
  const intent: ScoreT["intent"] =
    /seo|rank/.test(svc) ? "seo" : /ppc|ads|google ads|meta/.test(svc) ? "ads" : /social/.test(svc) ? "social"
    : /app|mobile/.test(svc) ? "app_dev" : /web|site|shopify|wordpress/.test(svc) ? "web_dev"
    : /automat|n8n|zapier|workflow/.test(svc) ? "automation" : /\bai\b|chatbot|agent/.test(svc) ? "ai"
    : /brand/.test(svc) ? "branding" : /pr\b|reputation/.test(svc) ? "pr" : "other";
  return { score: Math.min(s, 100), intent, budget_band: "unknown", summary: "Rule-based score (AI unavailable)." };
}

async function aiScore(l: LeadInput, apiKey: string): Promise<ScoreT> {
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses(MODEL),
    output: Output.object({ schema: Score }),
    system:
      "You qualify inbound B2B leads for Digital Penta, a digital marketing, AI automation and software agency (India, UAE, KSA, US, UK). " +
      "Score 0-100 on buying intent, budget fit, company legitimacy and urgency. Spam or vague one-liners score under 20. " +
      "budget_band: starter (<₹50k/mo or <$1k), growth, enterprise (>₹3L/mo or >$5k). Summary: one sentence, under 25 words, for the sales team.",
    prompt: JSON.stringify({
      form: l.form, service: l.service, budget: l.budget, timeline: l.timeline,
      company: l.company, website: l.website, email_domain: l.email.split("@")[1],
      message: (l.message ?? "").slice(0, 1500), utm: l.utm,
    }),
    providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low" } },
  });
  // drain stream, then read the validated structured output
  for await (const _ of result.textStream) { /* consume */ }
  return Score.parse(await result.output);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const raw = await req.json().catch(() => null);
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, 400);
  const lead = parsed.data;

  // Spam: honeypot + too-fast submissions. Respond 200 so bots learn nothing.
  if (lead.hp || (lead.started_at && Date.now() - lead.started_at < MIN_FILL_MS)) {
    return json({ ok: true });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const ipBucket = `ip:${await sha(ip)}`;
  const emailBucket = `email:${await sha(lead.email)}`;

  // Rate limit (per IP and per email, rolling hour)
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await supabase.from("lead_rate_limits").select("id", { count: "exact", head: true })
    .in("bucket", [ipBucket, emailBucket]).gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_PER_HOUR * 2) {
    return json({ error: "Too many requests. Please try again in an hour or WhatsApp us." }, 429);
  }
  await supabase.from("lead_rate_limits").insert([{ bucket: ipBucket }, { bucket: emailBucket }]);

  // Dedupe: same email + form within 24h → append note instead of new lead
  const dedupe_key = await sha(`${lead.email}|${lead.form}`);
  const { data: existing } = await supabase.from("leads").select("id, notes")
    .eq("dedupe_key", dedupe_key).gte("created_at", new Date(Date.now() - 86_400_000).toISOString())
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (existing) {
    await supabase.from("leads").update({
      notes: `${existing.notes ?? ""}\n\n[${new Date().toISOString()}] Follow-up: ${lead.message ?? ""}`.slice(0, 8000),
    }).eq("id", existing.id);
    return json({ ok: true, lead_id: existing.id, duplicate: true });
  }

  // Score
  let score: ScoreT;
  const key = Deno.env.get("LOVABLE_API_KEY");
  try {
    score = key ? await aiScore(lead, key) : ruleScore(lead);
  } catch (e) {
    console.error("AI scoring failed, using rules:", (e as Error).message);
    score = ruleScore(lead);
  }

  // Contact record (CRM source of truth)
  const { data: contact } = await supabase.from("contacts").insert({
    name: lead.name, email: lead.email, phone: lead.phone || null, company: lead.company || null,
    message: lead.message || `(${lead.form} form)`, service: lead.service || null, source: lead.form,
    budget_range: lead.budget || null, urgency: lead.timeline || null,
    utm_source: lead.utm?.utm_source ?? null, utm_medium: lead.utm?.utm_medium ?? null, utm_campaign: lead.utm?.utm_campaign ?? null,
  }).select("id").single();

  // Route hot leads to the least-loaded account manager
  let assigned_to: string | null = null;
  if (score.score >= HOT_SCORE) {
    const { data: ams } = await supabase.from("user_roles").select("user_id").eq("role", "account_manager");
    if (ams?.length) {
      const loads = await Promise.all(ams.map(async (a) => {
        const { count: c } = await supabase.from("leads").select("id", { count: "exact", head: true })
          .eq("assigned_to", a.user_id).gte("created_at", new Date(Date.now() - 7 * 86_400_000).toISOString());
        return { id: a.user_id, c: c ?? 0 };
      }));
      assigned_to = loads.sort((a, b) => a.c - b.c)[0].id;
    }
  }

  const { data: row, error } = await supabase.from("leads").insert({
    contact_id: contact?.id ?? null,
    name: lead.name, email: lead.email, phone: lead.phone || null, company: lead.company || null,
    website: lead.website || null, service: lead.service || score.intent, budget: lead.budget || null,
    timeline: lead.timeline || null, notes: lead.message || null, source: lead.form,
    lead_score: score.score, intent: score.intent, budget_band: score.budget_band, ai_summary: score.summary,
    status: "new", assigned_to, dedupe_key,
    utm: lead.utm ?? null, first_touch: lead.first_touch ?? null,
    utm_source: lead.utm?.utm_source ?? null, utm_medium: lead.utm?.utm_medium ?? null, utm_campaign: lead.utm?.utm_campaign ?? null,
    meta_data: { page: lead.page, extra: lead.extra ?? null },
  }).select("id").single();
  if (error) {
    console.error("lead insert failed", error);
    return json({ error: "We couldn't save your request. Please try again or WhatsApp us." }, 500);
  }

  // Notifications (fire-and-forget, never block the visitor)
  const invoke = (fn: string, body: unknown) =>
    supabase.functions.invoke(fn, { body }).catch((e) => console.error(fn, e));
  const tasks: Promise<unknown>[] = [
    invoke("send-email", { template: "contact-received", to: lead.email, data: { name: lead.name, service: lead.service } }),
    invoke("send-email", {
      template: "contact-notify-team", to: "support@digitalpenta.com",
      data: { name: lead.name, email: lead.email, phone: lead.phone, service: lead.service, source: lead.form,
        message: `[Score ${score.score} · ${score.intent} · ${score.budget_band}] ${score.summary}\n\n${lead.message ?? ""}` },
    }),
  ];
  if (assigned_to) {
    tasks.push(supabase.from("notifications").insert({
      user_id: assigned_to, title: `Hot lead (${score.score}) — ${lead.company || lead.name}`,
      body: score.summary, type: "lead", link: "/dashboard/admin/leads", related_entity_type: "lead", related_entity_id: row.id,
    }));
  }
  // @ts-ignore EdgeRuntime is provided by Supabase
  (globalThis.EdgeRuntime?.waitUntil ?? ((p: Promise<unknown>) => p))(Promise.allSettled(tasks));

  return json({ ok: true, lead_id: row.id });
});
