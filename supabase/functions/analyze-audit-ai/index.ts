import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const RECOMMENDATION_TOOL = {
  type: "function",
  function: {
    name: "emit_seo_recommendations",
    description: "Return prioritized SEO/performance fix recommendations.",
    parameters: {
      type: "object",
      properties: {
        recommendations: {
          type: "array",
          minItems: 3,
          maxItems: 12,
          items: {
            type: "object",
            properties: {
              priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
              category: {
                type: "string",
                enum: ["Performance", "SEO", "Accessibility", "Best Practices", "Content", "Technical"],
              },
              title: { type: "string" },
              impact: { type: "string", description: "Why this matters in plain English" },
              fix_steps: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 6 },
              estimated_effort: { type: "string", enum: ["1 hour", "2-4 hours", "1 day", "2-3 days", "1 week+"] },
            },
            required: ["priority", "category", "title", "impact", "fix_steps", "estimated_effort"],
            additionalProperties: false,
          },
        },
      },
      required: ["recommendations"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { audit_id, url, scores, opportunities, on_page } = await req.json();
    if (!audit_id || !url) {
      return new Response(JSON.stringify({ error: "audit_id and url required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a senior SEO and Web Performance consultant at Digital Penta, a top-tier digital marketing agency. You produce actionable, prioritized recommendations for clients. Be concrete, technical, and reference industry best practices. Avoid generic advice. When on-page issues are present (missing meta description, multiple H1s, missing alt text, no robots/sitemap, missing security headers), surface them as concrete fixes.`;

    const onPageSummary = on_page
      ? `\nOn-page audit:\n- Title: ${on_page?.meta?.title ?? "missing"} (${on_page?.meta?.title_length ?? 0} chars)\n- Meta description: ${on_page?.meta?.meta_description ? `${on_page.meta.meta_description_length} chars` : "MISSING"}\n- Canonical: ${on_page?.meta?.canonical ?? "missing"}\n- Viewport: ${on_page?.meta?.viewport ?? "missing"}\n- Lang attr: ${on_page?.meta?.lang ?? "missing"}\n- H1 count: ${on_page?.headings?.h1_count ?? 0}\n- Images without alt: ${on_page?.content?.images_without_alt ?? 0}/${on_page?.content?.images_total ?? 0}\n- Word count: ${on_page?.content?.word_count ?? 0}\n- Internal links: ${on_page?.content?.internal_links ?? 0}, external: ${on_page?.content?.external_links ?? 0}\n- Structured data blocks: ${on_page?.content?.structured_data_blocks ?? 0}\n- robots.txt: ${on_page?.technical?.robots_txt ? "present" : "MISSING"}\n- sitemap.xml: ${on_page?.technical?.sitemap_xml ? "present" : "MISSING"}\n- HTTPS: ${on_page?.technical?.https}\n- HSTS: ${on_page?.technical?.hsts}, X-Frame-Options: ${on_page?.technical?.x_frame_options}, CSP: ${on_page?.technical?.content_security_policy}\n- OG tags: title=${!!on_page?.social?.og_title}, image=${!!on_page?.social?.og_image}\n`
      : "";

    const userPrompt = `Website: ${url}

Lighthouse scores (0-100):
- Performance: ${scores?.performance ?? "n/a"}
- SEO: ${scores?.seo ?? "n/a"}
- Accessibility: ${scores?.accessibility ?? "n/a"}
- Best Practices: ${scores?.best_practices ?? "n/a"}
- LCP: ${scores?.lcp_ms ?? "n/a"}ms, CLS: ${scores?.cls ?? "n/a"}, TBT: ${scores?.tbt_ms ?? "n/a"}ms, INP: ${scores?.inp_ms ?? "n/a"}ms
${onPageSummary}
Failing audits / opportunities (top issues):
${(opportunities ?? [])
  .map((o: any) => `- [${Math.round((o.score ?? 0) * 100)}] ${o.title}${o.displayValue ? ` (${o.displayValue})` : ""}`)
  .join("\n")}

Generate 6-10 prioritized recommendations the website owner should action this quarter. Order by ROI (highest impact + lowest effort first). Each must include concrete fix steps a developer or marketer can execute.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [RECOMMENDATION_TOOL],
        tool_choice: { type: "function", function: { name: "emit_seo_recommendations" } },
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      if (r.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit on AI gateway. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (r.status === 402)
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Lovable workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      throw new Error(`AI gateway ${r.status}: ${txt.slice(0, 300)}`);
    }

    const data = await r.json();
    const tc = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = tc?.function?.arguments;
    let recommendations: any[] = [];
    if (args) {
      try {
        recommendations = JSON.parse(args).recommendations ?? [];
      } catch (e) {
        console.error("Failed to parse tool args", e);
      }
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await supabase
      .from("audits")
      .update({ ai_recommendations: recommendations, status: "complete" })
      .eq("id", audit_id);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-audit-ai error", e);
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
