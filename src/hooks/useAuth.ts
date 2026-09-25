import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Guards against a stale async role fetch overwriting state after the
  // user has already signed out / switched accounts.
  const fetchToken = useRef(0);

  useEffect(() => {
    const fetchRole = async (userId: string, token: number) => {
      try {
        const { data } = await supabase.rpc("get_user_role", { _user_id: userId });
        if (fetchToken.current === token) setRole((data as string | null) ?? null);
      } catch {
        if (fetchToken.current === token) setRole(null);
      } finally {
        if (fetchToken.current === token) setLoading(false);
      }
    };

    // IMPORTANT: register the listener before calling getSession(), and never
    // call other Supabase methods synchronously inside this callback — that
    // can deadlock the auth client. Any follow-up Supabase call is deferred
    // with setTimeout(0) so the callback itself returns immediately.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        const token = ++fetchToken.current;
        if (newSession?.user) {
          setTimeout(() => fetchRole(newSession.user.id, token), 0);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    // Then hydrate from any existing session on load.
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      const token = ++fetchToken.current;
      if (initialSession?.user) {
        fetchRole(initialSession.user.id, token);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return { user, session, role, loading, signOut };
}
