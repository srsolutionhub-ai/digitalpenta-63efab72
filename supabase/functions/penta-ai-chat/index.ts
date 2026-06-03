// Penta AI Chat — streaming conversational chat backed by Lovable AI Gateway.
// Persists session + transcript, qualifies the visitor, and writes hot leads to `contacts`.
// Public endpoint (verify_jwt = false). All safety + system-prompt enforced server-side.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM_PROMPT = `You are "Penta AI", the friendly senior growth advisor for Digital Penta — a top digital marketing agency in Delhi serving India and the Middle East.

ROLE
- Have a natural conversation. Qualify the visitor's growth problem in under 6 turns.
- Recommend the right service (SEO, Google Ads, Social, Content, Web Dev, AI, WhatsApp Marketing, PR, Automation).
- When you have name + a way to reach them (email OR phone/whatsapp) + their goal, surface the booking CTA.

CONVERSATION
- Keep replies short: 2–4 sentences. Light bullets allowed (max 2–3 per turn).
- ONE qualifying question per turn: industry → goal → monthly budget → timeline → website/contact.
- No emojis, no "great question", no fluff. Be direct and senior.
- Pricing: SEO from ₹35k/mo, Google Ads management from ₹40k/mo + ad spend, Social from ₹30k/mo, Web Dev from ₹1.2L. Always say "final scope depends on goals".
- Results to cite: "+312% organic in 6 months for a D2C", "4.8x ROAS for real-estate client", "−42% CPL for SaaS in 90 days".
- Locations: Delhi, Mumbai, Bangalore, Pune, Hyderabad, Noida, Gurgaon, Jaipur, Dubai, Abu Dhabi, Riyadh, Doha.
- NEVER promise specific rankings. Use ranges + "in line with industry benchmarks".

CTA
- After 3–4 turns OR when you have enough info, ask: "Want me to set up a free 30-min audit with our senior strategist? Drop your name + WhatsApp number, or book at digitalpenta.com/book-a-call."
- WhatsApp deeplink: https://wa.me/918860100039

OFF-TOPIC
- Politely redirect: "I'm focused on growth strategy — what's the biggest growth blocker for your business right now?"
`;

const QUALIFY_PROMPT = `You extract structured lead data from a chat transcript. Return ONLY valid JSON (no markdown, no commentary) matching this exact shape:
{
  "name": string | null,
  "email": string | null,
  "phone": string | null,
  "company": string | null,
  "service": string | null,
  "budget_range": string | null,
  "urgency": "urgent" | "high" | "medium" | "low" | null,
  "message": string,
  "qualified": boolean
}
"qualified" is true ONLY if the transcript contains a name AND (email OR phone). Otherwise false.
"message" is a 1–2 sentence summary of what they want.`;

// per-cold-start rate limit
const RL = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = RL.get(ip);
  if (!b || now > b.reset) {
    RL.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

interface ChatBody {
  session_id?: string | null;
  visitor_id: string;
  message: string;
  source_page?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anon";
    // 30 requests / hour / IP
    if (!checkRateLimit(ip, 30, 60 * 60 * 1000)) {
      return new Response(
        JSON.stringify({ error: "Too many requests — please retry in a few minutes." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as ChatBody;
    if (!body?.visitor_id || typeof body?.message !== "string" || !body.message.trim()) {
      return new Response(JSON.stringify({ error: "visitor_id + message required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userMessage = String(body.message).slice(0, 2000);
    const visitorId = String(body.visitor_id).slice(0, 80);
    const sourcePage = body.source_page ? String(body.source_page).slice(0, 200) : null;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── Ensure session ──
    let sessionId = body.session_id ?? null;
    if (!sessionId) {
      const { data: created, error: cErr } = await supabase
        .from("ai_chat_sessions")
        .insert({
          visitor_id: visitorId,
          source_page: sourcePage,
          user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
        })
        .select("id")
        .single();
      if (cErr) throw cErr;
      sessionId = created.id;
    }

    // ── Load prior transcript (last 12 turns) ──
    const { data: history } = await supabase
      .from("ai_chat_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(24);

    // ── Persist user message ──
    await supabase.from("ai_chat_messages").insert({
      session_id: sessionId,
      role: "user",
      content: userMessage,
    });

    const trimmed = (history ?? [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-12)
      .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content).slice(0, 2000) }));
    trimmed.push({ role: "user", content: userMessage });

    // ── Stream assistant reply ──
    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmed,
        ],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      if (upstream.status === 429) {
        return new Response(JSON.stringify({ error: "AI is busy — please retry in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (upstream.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await upstream.text();
      console.error("AI gateway error:", upstream.status, t);
      return new Response(JSON.stringify({ error: "Upstream AI error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tee the stream: forward to client + collect full text for persistence + qualification
    let fullAssistant = "";
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        // First, send session_id as an SSE meta event so client can persist it
        controller.enqueue(encoder.encode(`event: meta\ndata: ${JSON.stringify({ session_id: sessionId })}\n\n`));

        const reader = upstream.body!.getReader();
        let buffer = "";
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            // pass-through the raw SSE chunk
            controller.enqueue(value);

            // Parse for content deltas
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine.startsWith("data:")) continue;
              const payload = trimmedLine.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const json = JSON.parse(payload);
                const delta = json?.choices?.[0]?.delta?.content;
                if (typeof delta === "string") fullAssistant += delta;
              } catch {
                // ignore non-JSON keepalives
              }
            }
          }
        } catch (e) {
          console.error("stream relay error:", e);
        } finally {
          controller.close();
        }

        // ── Post-stream: persist + qualify ──
        try {
          if (fullAssistant.trim()) {
            await supabase.from("ai_chat_messages").insert({
              session_id: sessionId,
              role: "assistant",
              content: fullAssistant.slice(0, 8000),
            });
          }

          // Try lightweight qualification every turn after turn 3
          const turnCount = (trimmed.length + 1);
          if (turnCount >= 4 && turnCount % 2 === 0) {
            const transcript = [...trimmed, { role: "assistant" as const, content: fullAssistant }]
              .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
              .join("\n");

            const qRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-3-flash-preview",
                response_format: { type: "json_object" },
                messages: [
                  { role: "system", content: QUALIFY_PROMPT },
                  { role: "user", content: transcript.slice(-6000) },
                ],
              }),
            });
            if (qRes.ok) {
              const qJson = await qRes.json();
              const raw = qJson?.choices?.[0]?.message?.content ?? "{}";
              let parsed: any = {};
              try { parsed = JSON.parse(raw); } catch { /* ignore */ }
              if (parsed && typeof parsed === "object") {
                const isQualified = parsed.qualified === true && parsed.name && (parsed.email || parsed.phone);
                await supabase
                  .from("ai_chat_sessions")
                  .update({
                    qualification: parsed,
                    summary: parsed.message ?? null,
                    lead_qualified: !!isQualified,
                  })
                  .eq("id", sessionId);

                if (isQualified) {
                  // Write to contacts (idempotency: skip if same email + recent)
                  const email = String(parsed.email ?? "").trim().toLowerCase() || `chat-${sessionId}@digitalpenta.local`;
                  const { data: existing } = await supabase
                    .from("contacts")
                    .select("id")
                    .eq("email", email)
                    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
                    .maybeSingle();
                  if (!existing) {
                    const { data: contact } = await supabase
                      .from("contacts")
                      .insert({
                        name: String(parsed.name).slice(0, 120),
                        email,
                        phone: parsed.phone ? String(parsed.phone).slice(0, 40) : null,
                        company: parsed.company ? String(parsed.company).slice(0, 200) : null,
                        service: parsed.service ? String(parsed.service).slice(0, 100) : null,
                        budget_range: parsed.budget_range ? String(parsed.budget_range).slice(0, 40) : null,
                        urgency: parsed.urgency ?? "medium",
                        message: String(parsed.message ?? "Qualified via Penta AI chat").slice(0, 2000),
                        source: "Penta AI Chat",
                        status: "new",
                      })
                      .select("id")
                      .single();
                    if (contact?.id) {
                      await supabase.from("ai_chat_sessions").update({ contact_id: contact.id }).eq("id", sessionId);
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error("post-stream persistence error:", e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Session-Id": sessionId!,
      },
    });
  } catch (e) {
    console.error("penta-ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
