// Per-visitor (IP-based) hourly limit for public endpoints that cost money.
// Stores only a hash of the IP in lead_rate_limits, never the IP itself.
// Fails CLOSED: if the limiter can't be verified, the request is denied.
// deno-lint-ignore no-explicit-any
export async function underHourlyLimit(supabase: any, req: Request, feature: string, perHour: number): Promise<boolean> {
  const ip = (req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${feature}|${ip}`));
  const bucket = `${feature}:` + Array.from(new Uint8Array(digest)).slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
  const since = new Date(Date.now() - 3_600_000).toISOString();
  const { count, error: countError } = await supabase.from("lead_rate_limits").select("id", { count: "exact", head: true })
    .eq("bucket", bucket).gte("created_at", since);
  if (countError || count == null || count >= perHour) return false;
  const { error: insertError } = await supabase.from("lead_rate_limits").insert({ bucket });
  return !insertError;
}
