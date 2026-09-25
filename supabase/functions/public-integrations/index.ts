// public-integrations — exposes only the enabled tracking tag IDs
// (GA4 / GTM / Meta Pixel / LinkedIn Insight) to the anonymous website.
// integration_settings is locked down to super_admin reads via RLS, so this
// function reads it with the service role and returns nothing but
// {provider, public_id} for rows that are enabled.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await supabase
      .from("integration_settings")
      .select("provider, public_id")
      .eq("enabled", true)
      .not("public_id", "is", null);
    if (error) throw error;
    return json((data ?? []).map((r) => ({ provider: r.provider, public_id: r.public_id })));
  } catch (e) {
    console.error("public-integrations error", e);
    return json([], 200); // fail soft — never break the site over tracking tags
  }
});
