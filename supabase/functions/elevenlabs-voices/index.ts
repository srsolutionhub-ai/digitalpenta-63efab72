// Admin-only: list ElevenLabs voices, clone new voices, delete voices.
// Requires the caller to be super_admin or content_writer.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const ELEVEN_API = "https://api.elevenlabs.io/v1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) return json({ error: "ElevenLabs not configured" }, 500);

    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Auth: caller must be super_admin or content_writer
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supaUrl, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) return json({ error: "unauthorized" }, 401);

    const admin = createClient(supaUrl, serviceKey);
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const allowed = (roles ?? []).some((r: any) => r.role === "super_admin" || r.role === "content_writer");
    if (!allowed) return json({ error: "forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (action === "list") {
      const res = await fetch(`${ELEVEN_API}/voices`, { headers: { "xi-api-key": apiKey } });
      if (!res.ok) return json({ error: `elevenlabs ${res.status}: ${await res.text()}` }, res.status);
      const data = await res.json();
      const voices = (data.voices ?? []).map((v: any) => ({
        voice_id: v.voice_id,
        name: v.name,
        category: v.category,
        description: v.description,
        preview_url: v.preview_url,
      }));
      return json({ voices });
    }

    if (action === "clone") {
      const { name, description, fileB64, fileName, mime } = body;
      if (!name || !fileB64) return json({ error: "name + fileB64 required" }, 400);
      const bin = Uint8Array.from(atob(fileB64), (c) => c.charCodeAt(0));
      const form = new FormData();
      form.append("name", name);
      if (description) form.append("description", description);
      form.append("files", new Blob([bin], { type: mime || "audio/mpeg" }), fileName || "sample.mp3");
      const res = await fetch(`${ELEVEN_API}/voices/add`, {
        method: "POST",
        headers: { "xi-api-key": apiKey },
        body: form,
      });
      if (!res.ok) return json({ error: `elevenlabs ${res.status}: ${await res.text()}` }, res.status);
      const data = await res.json();
      // Persist to voice_settings
      await admin.from("voice_settings").upsert({
        voice_id: data.voice_id,
        label: name,
        description: description ?? null,
        is_cloned: true,
        enabled_for_site: false,
        created_by: userData.user.id,
      }, { onConflict: "voice_id" });
      return json({ ok: true, voice_id: data.voice_id });
    }

    if (action === "delete") {
      const { voice_id } = body;
      if (!voice_id) return json({ error: "voice_id required" }, 400);
      const res = await fetch(`${ELEVEN_API}/voices/${voice_id}`, {
        method: "DELETE",
        headers: { "xi-api-key": apiKey },
      });
      if (!res.ok) return json({ error: `elevenlabs ${res.status}: ${await res.text()}` }, res.status);
      await admin.from("voice_settings").delete().eq("voice_id", voice_id);
      return json({ ok: true });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    console.error("elevenlabs-voices error", e);
    return json({ error: e instanceof Error ? e.message : "internal error" }, 500);
  }
});
