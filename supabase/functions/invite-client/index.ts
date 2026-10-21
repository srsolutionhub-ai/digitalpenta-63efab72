import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * invite-client — staff-only endpoint to invite a client by email.
 *
 * Body: { email: string, account_id: string, full_name?: string }
 *
 * Flow:
 *  1. Verify the caller is a signed-in super_admin or account_manager.
 *  2. If the email already has an account, reuse it; otherwise send a
 *     Supabase invite email (link lands on /auth/invite-accept).
 *  3. Ensure the user has the "client" role.
 *  4. Link the user to the company (account_team_members).
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // 1. Authenticate the caller
  const authHeader = req.headers.get("Authorization") ?? "";
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user: caller }, error: authErr } = await callerClient.auth.getUser();
  if (authErr || !caller) {
    return new Response(JSON.stringify({ error: "Sign in required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: roleRows } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", caller.id)
    .in("role", ["super_admin", "account_manager"]);
  if (!roleRows?.length) {
    return new Response(JSON.stringify({ error: "Only Super Admins and Account Managers can invite clients" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // 2. Validate input
  let body: { email?: string; account_id?: string; full_name?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const accountId = body.account_id ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !accountId) {
    return new Response(JSON.stringify({ error: "A valid email and company are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { data: account } = await admin.from("accounts").select("id,name").eq("id", accountId).maybeSingle();
  if (!account) {
    return new Response(JSON.stringify({ error: "Company not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // 3. Find or invite the user
  let userId: string | null = null;
  let invited = false;

  const { data: existingProfile } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (existingProfile) {
    userId = existingProfile.id;
  } else {
    const origin = req.headers.get("origin") || "https://digitalpenta.com";
    const { data: invite, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/auth/invite-accept`,
      data: body.full_name ? { full_name: body.full_name } : undefined,
    });
    if (inviteErr) {
      return new Response(JSON.stringify({ error: inviteErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    userId = invite.user?.id ?? null;
    invited = true;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not create or find the user" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // 4. Ensure the client role
  const { data: hasClientRole } = await admin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "client")
    .maybeSingle();
  if (!hasClientRole) {
    const { error: roleErr } = await admin.from("user_roles").insert({ user_id: userId, role: "client" });
    if (roleErr && !roleErr.message.includes("duplicate")) {
      return new Response(JSON.stringify({ error: roleErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  // 5. Link to the company
  const { data: existingMember } = await admin
    .from("account_team_members")
    .select("id")
    .eq("account_id", accountId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!existingMember) {
    const { error: memberErr } = await admin.from("account_team_members").insert({
      account_id: accountId,
      user_id: userId,
      role_on_account: "client",
    });
    if (memberErr) {
      return new Response(JSON.stringify({ error: memberErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  return new Response(
    JSON.stringify({ ok: true, invited, message: invited ? "Invite email sent" : "Existing login linked to the company" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
