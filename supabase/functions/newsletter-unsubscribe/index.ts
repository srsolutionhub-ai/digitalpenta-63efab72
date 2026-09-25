import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { token } = await req.json().catch(() => ({}));
    if (typeof token !== "string" || token.length < 16 || token.length > 200) {
      return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await admin
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString(), status: "unsubscribed" })
      .eq("unsub_token", token)
      .select("id");
    const ok = !error && (data?.length ?? 0) > 0;
    return new Response(JSON.stringify({ ok }), { status: ok ? 200 : 404, headers: { ...cors, "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
