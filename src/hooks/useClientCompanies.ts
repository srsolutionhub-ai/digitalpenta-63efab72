import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const db = supabase as any;

/**
 * Shared, cached lookup of the companies (accounts) the signed-in client
 * belongs to. Previously every client page ran this membership query on its
 * own, one after another — this hook dedupes it through React Query with a
 * 5-minute freshness window, so client pages render noticeably faster.
 */
export function useClientCompanies() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["client-companies", user?.id],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!user) return [];
      const { data: memberships, error: memErr } = await db
        .from("account_team_members")
        .select("account_id, role_on_account")
        .eq("user_id", user.id);
      if (memErr) throw memErr;
      const ids = (memberships ?? []).map((m: any) => m.account_id);
      if (!ids.length) return [];
      const { data, error: accErr } = await db.from("accounts").select("id,name,tier,status").in("id", ids);
      if (accErr) throw accErr;
      return (data ?? []).map((a: any) => ({
        ...a,
        role: memberships?.find((m: any) => m.account_id === a.id)?.role_on_account,
      }));
    },
  });
}

/** Just the account ids — the common case for filtering queries. */
export function useClientAccountIds(): string[] {
  const { data } = useClientCompanies();
  return (data ?? []).map((a: any) => a.id);
}
