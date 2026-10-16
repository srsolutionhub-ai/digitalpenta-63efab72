import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

interface Props {
  account: { id: string; name: string } | null;
  onClose: () => void;
}

/** Links client logins to a company so they can use the client portal. */
export function CompanyLoginsDialog({ account, onClose }: Props) {
  const qc = useQueryClient();
  const [pick, setPick] = useState("");

  const { data: clients = [] } = useQuery({
    queryKey: ["client-logins"],
    enabled: !!account,
    queryFn: async () => {
      const { data: roles, error } = await db.from("user_roles").select("user_id").eq("role", "client");
      if (error) throw error;
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (!ids.length) return [];
      const { data: profiles } = await db.from("profiles").select("id,email,full_name").in("id", ids);
      return (profiles ?? []) as { id: string; email: string; full_name: string | null }[];
    },
  });

  const { data: members = [] } = useQuery({
    queryKey: ["company-members", account?.id],
    enabled: !!account,
    queryFn: async () => {
      const { data, error } = await db.from("account_team_members").select("id,user_id").eq("account_id", account!.id);
      if (error) throw error;
      return (data ?? []) as { id: string; user_id: string }[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["company-members", account?.id] });
    qc.invalidateQueries({ queryKey: ["companies-member-counts"] });
  };

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await db.from("account_team_members").insert({ account_id: account!.id, user_id: pick, role_on_account: "client" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Login linked — they can now use the client portal"); setPick(""); refresh(); },
    onError: (e: any) => toast.error(e.message?.includes("duplicate") ? "Already linked" : e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("account_team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Login removed"); refresh(); },
    onError: (e: any) => toast.error(e.message),
  });

  const label = (uid: string) => {
    const c = clients.find((x) => x.id === uid);
    return c ? (c.full_name ? `${c.full_name} · ${c.email}` : c.email) : uid;
  };
  const available = clients.filter((c) => !members.some((m) => m.user_id === c.id));

  return (
    <Dialog open={!!account} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Client logins — {account?.name}</DialogTitle>
          <DialogDescription>
            Linked logins see this company's projects, approvals, reports and files. Only logins with the Client role are listed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {members.length === 0 && <p className="text-sm text-muted-foreground">No logins linked yet.</p>}
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/30 px-3 py-2">
                <span className="text-sm text-foreground truncate">{label(m.user_id)}</span>
                <Button variant="ghost" size="icon" aria-label="Remove login" onClick={() => remove.mutate(m.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={pick} onValueChange={setPick}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={available.length ? "Choose a client login" : "No unlinked client logins"} />
              </SelectTrigger>
              <SelectContent>
                {available.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.full_name ? `${c.full_name} · ${c.email}` : c.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => add.mutate()} disabled={!pick || add.isPending}>
              <UserPlus className="w-4 h-4 mr-1.5" /> Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
