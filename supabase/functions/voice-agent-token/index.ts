// Issues a short-lived ElevenLabs Conversational AI token (WebRTC) for the
// public "Penta" voice agent. The API key never leaves the server.
// POST /functions/v1/voice-agent-token  -> { token }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { underHourlyLimit } from "../_shared/rateLimit.ts";

const DEFAULT_AGENT_ID = "agent_9601m41qzdz7e3db96x9rawznm5f";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) return json({ error: "Voice assistant is not configured" }, 500);
  const agentId = Deno.env.get("ELEVENLABS_AGENT_ID") || DEFAULT_AGENT_ID;

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    if (!(await underHourlyLimit(supabase, req, "voice_agent", 6))) {
      return json({ error: "Too many voice calls from your network. Please try again later or WhatsApp us." }, 429);
    }
  } catch (e) {
    console.error("rate limit check failed", e);
  }

  const r = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`,
    { headers: { "xi-api-key": apiKey } },
  );
  if (!r.ok) {
    console.error("token error", r.status, (await r.text()).slice(0, 300));
    return json({ error: "Voice assistant is temporarily unavailable" }, r.status === 429 ? 429 : 502);
  }
  const { token } = await r.json();
  return json({ token });
});
