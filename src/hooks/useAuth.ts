import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

/*
 * Role lookups are shared across every component that calls useAuth()
 * (ProtectedRoute + layout + pages). Previously each one fired its own
 * get_user_role request, which made dashboards feel slow. We now keep one
 * in-flight promise per user and a short sessionStorage cache so a refresh
 * renders the dashboard instantly while the role is re-validated.
 */
const ROLE_CACHE_KEY = "dp_role_cache_v1";
const rolePromises = new Map<string, Promise<string | null>>();

function readCachedRole(userId: string): string | null | undefined {
  try {
    const raw = sessionStorage.getItem(ROLE_CACHE_KEY);
    if (!raw) return undefined;
    const c = JSON.parse(raw) as { uid: string; role: string | null; at: number };
    if (c.uid !== userId || Date.now() - c.at > 10 * 60 * 1000) return undefined;
    return c.role;
  } catch { return undefined; }
}

function loadRole(userId: string, force = false): Promise<string | null> {
  if (!force && rolePromises.has(userId)) return rolePromises.get(userId)!;
  const p = (async () => {
    const { data, error } = await supabase.rpc("get_user_role", { _user_id: userId });
    if (error) throw error;
    const role = (data as string | null) ?? null;
    try { sessionStorage.setItem(ROLE_CACHE_KEY, JSON.stringify({ uid: userId, role, at: Date.now() })); } catch { /* ignore */ }
    return role;
  })();
  rolePromises.set(userId, p);
  p.catch(() => rolePromises.delete(userId));
  return p;
}

function clearRoleCache() {
  rolePromises.clear();
  try { sessionStorage.removeItem(ROLE_CACHE_KEY); } catch { /* ignore */ }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchToken = useRef(0);

  useEffect(() => {
    const applyUser = (u: User | null, force: boolean) => {
      const token = ++fetchToken.current;
      if (!u) {
        setRole(null);
        setLoading(false);
        return;
      }
      const cached = readCachedRole(u.id);
      if (cached !== undefined) {
        setRole(cached);
        setLoading(false);
      }
      loadRole(u.id, force)
        .then((r) => { if (fetchToken.current === token) setRole(r); })
        .catch(() => { if (fetchToken.current === token && cached === undefined) setRole(null); })
        .finally(() => { if (fetchToken.current === token) setLoading(false); });
    };

    // Register listener before getSession(); defer Supabase calls out of the callback.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (event === "SIGNED_OUT") clearRoleCache();
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      setTimeout(() => applyUser(newSession?.user ?? null, event === "SIGNED_IN" || event === "USER_UPDATED"), 0);
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      applyUser(initialSession?.user ?? null, false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    clearRoleCache();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return { user, session, role, loading, signOut };
}
