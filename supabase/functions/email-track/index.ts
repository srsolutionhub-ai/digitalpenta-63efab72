// Public tracking endpoint for sequence emails.
// GET ?e=<enrollment_id>&t=open        -> 1x1 gif, increments opens
// GET ?e=<enrollment_id>&t=click&u=<url> -> increments clicks, 302 redirects to http(s) url only
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PIXEL = Uint8Array.from(atob(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7"
), (c) => c.charCodeAt(0));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function gifResponse() {
  return new Response(PIXEL, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "image/gif", "Cache-Control": "no-store" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const enrollmentId = url.searchParams.get("e");
  const type = url.searchParams.get("t");
  const target = url.searchParams.get("u");

  if (!enrollmentId || !type) return gifResponse();

  try {
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: enrollment } = await admin
      .from("email_sequence_enrollments")
      .select("id, opens, clicks")
      .eq("id", enrollmentId)
      .maybeSingle();

    if (enrollment) {
      if (type === "open") {
        await admin.from("email_sequence_enrollments")
          .update({ opens: (enrollment.opens ?? 0) + 1 })
          .eq("id", enrollmentId);
      } else if (type === "click") {
        await admin.from("email_sequence_enrollments")
          .update({ clicks: (enrollment.clicks ?? 0) + 1 })
          .eq("id", enrollmentId);
      }
    }
  } catch (e) {
    console.error("email-track error", e);
  }

  if (type === "click" && target) {
    let safe: URL | null = null;
    try { safe = new URL(target); } catch { safe = null; }
    if (safe && (safe.protocol === "http:" || safe.protocol === "https:")) {
      return new Response(null, { status: 302, headers: { ...corsHeaders, Location: safe.toString() } });
    }
  }

  return gifResponse();
});
