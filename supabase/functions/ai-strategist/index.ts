// AI Growth Strategist — streaming chat endpoint backed by Lovable AI Gateway.
// Public endpoint (verify_jwt = false). System prompt + safety enforced server-side.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Penta Strategist", the senior digital growth advisor for Digital Penta — a top digital marketing agency in Delhi serving clients across India and the Middle East.

YOUR MISSION
- Qualify the visitor's growth problem in under 6 turns.
- Recommend the right Digital Penta service (SEO, Google Ads/PPC, Social Media, Content, Performance, Web Development, AI Chatbots, Marketing Automation, WhatsApp Marketing, PR).
- Estimate realistic outcomes (traffic %, ROAS, CPL ranges) using benchmarks below.
- ALWAYS end with a clear next step: book a free 30-min audit call, get a free SEO audit at /seo-audit, or speak to a strategist on +91-88601-00039.

CONVERSATION RULES
- Keep replies short (2-4 sentences max). Use bullets sparingly.
- Ask ONE qualifying question at a time: industry → goal → monthly budget → timeline → website URL.
- Be direct and senior — no fluff, no emojis, no "great question!".
- Mention concrete deliverables ("technical SEO audit", "GA4 + Search Console setup", "abandoned-cart automation"), not buzzwords.
- If asked about pricing: SEO from ₹35k/mo, Google Ads management from ₹40k/mo + ad spend, Social Media from ₹30k/mo, Web Dev from ₹1.2L. Always note "final scope depends on goals — let's get on a 30-min call".
- If asked about results: cite "+312% organic traffic in 6 months for a D2C brand", "4.8x ROAS for a real-estate client", "−42% CPL for a SaaS in 90 days".
- For locations: confirm we serve Delhi, Mumbai, Bangalore, Pune, Hyderabad, Noida, Gurgaon, Jaipur, Dubai, Abu Dhabi, Riyadh, Doha.
- NEVER promise specific rankings ("we'll get you #1"). Use ranges and "in line with industry benchmarks".
- If user asks something off-topic (politics, jokes, code), redirect: "I'm focused on growth strategy for your business — what's the biggest growth blocker right now?".

OUTPUT FORMAT
- Plain text only. No markdown headers. Light bullets ("• ") allowed for lists of 2-3 items max.
- After 3-4 turns OR when intent is clear, surface the CTA explicitly: "Want me to set up a free 30-min audit call with our senior strategist? Just share your name + WhatsApp number, or book directly at digitalpenta.com/get-proposal."
`;

interface ChatBody {
  messages: { role: "user" | "assistant"; content: string }[];
  context?: { url?: string; referrer?: string };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as ChatBody;

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize: keep last 12 turns, cap each message to 2000 chars
    const trimmed = body.messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 2000),
    }));

    const ctxLine = body.context
      ? `\n\nVISITOR CONTEXT: page=${body.context.url ?? "unknown"} referrer=${body.context.referrer ?? "direct"}`
      : "";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
          { role: "system", content: SYSTEM_PROMPT + ctxLine },
          ...trimmed,
        ],
      }),
    });

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're getting a lot of chats right now — please retry in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (upstream.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await upstream.text();
      console.error("AI gateway error:", upstream.status, t);
      return new Response(JSON.stringify({ error: "Upstream AI error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-strategist error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
