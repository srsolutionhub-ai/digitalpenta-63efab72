// Penta AI TTS — proxies ElevenLabs Text-to-Speech.
// Returns audio/mpeg bytes. Lightweight, no DB. Rate-limited via daily budget.
//
// POST /functions/v1/elevenlabs-tts
// body: { text: string, voiceId?: string, mode?: "story"|"chat" }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const ELEVEN_API = "https://api.elevenlabs.io/v1";
const DEFAULT_VOICE = "JBFqnCBsd6RMkjVDRZzb"; // George — warm, conversational
const MAX_CHARS = 1200;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ElevenLabs not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const voiceId = typeof body?.voiceId === "string" && body.voiceId.length > 0
      ? body.voiceId
      : DEFAULT_VOICE;

    if (!text) {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (text.length > MAX_CHARS) {
      return new Response(JSON.stringify({ error: `text too long (max ${MAX_CHARS} chars)` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Daily budget cap to prevent abuse
    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supaUrl, serviceKey);
    const { data: budget } = await supabase.rpc("bump_ai_budget", {
      _feature: "elevenlabs_tts",
      _cap: 200,
    });
    if (budget && Array.isArray(budget) && budget[0] && budget[0].allowed === false) {
      return new Response(
        JSON.stringify({ error: "Daily voice quota reached. Try again tomorrow." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ttsRes = await fetch(
      `${ELEVEN_API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
            style: 0.35,
            use_speaker_boost: true,
            speed: 1.0,
          },
        }),
      }
    );

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.error("ElevenLabs TTS failed:", ttsRes.status, errText);
      return new Response(JSON.stringify({ error: "TTS upstream failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audio = await ttsRes.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("tts error", e);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
