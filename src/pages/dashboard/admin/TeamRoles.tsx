import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Trash2, UserPlus, Link2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

const db = supabase as any;
type AppRole = Database["public"]["Enums"]["app_role"];

const ROLES: { value: AppRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "account_manager", label: "Account Manager" },
  { value: "finance", label: "Finance" },
  { value: "content_writer", label: "Content Writer" },
  { value: "seo_specialist", label: "SEO Specialist" },
  { value: "client", label: "Client" },
];

export default function TeamRoles() {
  const { user, role } = useAuth();
  const isSuperAdmin = role === "super_admin";
  const qc = useQueryClient();

  const [assignEmail, setAssignEmail] = useState("");
  const [assignRole, setAssignRole] = useState<AppRole>("client");
  const [linkEmail, setLinkEmail] = useState("");
  const [linkAccountId, setLinkAccountId] = useState("");

  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ["team-roles-profiles"],
    queryFn: async () => {
      const { data, error } = await db.from("profiles").select("id, email, full_name, created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: rolesData } = useQuery({
    queryKey: ["team-roles-user-roles"],
    queryFn: async () => {
      const { data, error } = await db.from("user_roles").select("id, user_id, role");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: accounts } = useQuery({
    queryKey: ["team-roles-accounts"],
    queryFn: async () => {
      const { data } = await db.from("accounts").select("id, name").order("name");
      return data ?? [];
    },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-roles-account-members"],
    queryFn: async () => {
      const { data } = await db.from("account_team_members").select("id, account_id, user_id, role_on_account");
      return data ?? [];
    },
  });

  const rows = (profiles ?? []).map((p: any) => ({
    ...p,
    roles: (rolesData ?? []).filter((r: any) => r.user_id === p.id),
  }));

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role: newRole }: { userId: string; role: AppRole }) => {
      const { error } = await db.from("user_roles").insert({ user_id: userId, role: newRole });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role added");
      qc.invalidateQueries({ queryKey: ["team-roles-user-roles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (roleRowId: string) => {
      const { error } = await db.from("user_roles").delete().eq("id", roleRowId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role removed");
      qc.invalidateQueries({ queryKey: ["team-roles-user-roles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const assignByEmailMutation = useMutation({
    mutationFn: async () => {
      const { data: profile } = await db.from("profiles").select("id").eq("email", assignEmail.trim()).maybeSingle();
      if (!profile) throw new Error("No user with that email found. They must sign up first.");
      const { error } = await db.from("user_roles").insert({ user_id: profile.id, role: assignRole });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role assigned");
      setAssignEmail("");
      qc.invalidateQueries({ queryKey: ["team-roles-user-roles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const linkAccountMutation = useMutation({
    mutationFn: async () => {
      const { data: profile } = await db.from("profiles").select("id").eq("email", linkEmail.trim()).maybeSingle();
      if (!profile) throw new Error("No user with that email found.");
      if (!linkAccountId) throw new Error("Select an account.");
      const { error } = await db.from("account_team_members").insert({ account_id: linkAccountId, user_id: profile.id, role_on_account: "client" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Client linked to account");
      setLinkEmail("");
      setLinkAccountId("");
      qc.invalidateQueries({ queryKey: ["team-roles-account-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const unlinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("account_team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Unlinked");
      qc.invalidateQueries({ queryKey: ["team-roles-account-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display font-bold text-xl text-foreground">Team & Roles</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage user roles and link client users to accounts.
          {!isSuperAdmin && " (Read-only — super admin required to make changes.)"}
        </p>
      </div>

      {isSuperAdmin && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border/30 rounded-xl p-6 bg-card space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground text-sm">Assign Role</h2>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} placeholder="user@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select value={assignRole} onChange={(e) => setAssignRole(e.target.value as AppRole)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <Button onClick={() => assignByEmailMutation.mutate()} disabled={!assignEmail || assignByEmailMutation.isPending} className="w-full">
              Assign Role
            </Button>
          </div>

          <div className="border border-border/30 rounded-xl p-6 bg-card space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground text-sm">Link Client to Account</h2>
            </div>
            <div className="space-y-2">
              <Label>Client Email</Label>
              <Input type="email" value={linkEmail} onChange={(e) => setLinkEmail(e.target.value)} placeholder="client@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Account</Label>
              <select value={linkAccountId} onChange={(e) => setLinkAccountId(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select account…</option>
                {(accounts ?? []).map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <Button onClick={() => linkAccountMutation.mutate()} disabled={!linkEmail || !linkAccountId || linkAccountMutation.isPending} className="w-full">
              Link to Account
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border/30 rounded-xl overflow-hidden bg-card">
        <div className="px-6 py-4 border-b border-border/20 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">Users & Roles</h2>
          <span className="text-xs text-muted-foreground ml-2">{rows.length} users</span>
        </div>
        {loadingProfiles ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-muted/30 animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-muted/10">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Roles</th>
                {isSuperAdmin && <th className="text-left px-6 py-3 font-medium text-muted-foreground">Add Role</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id} className="border-b border-border/10 hover:bg-muted/10">
                  <td className="px-6 py-3">
                    <p className="text-foreground font-medium">{r.full_name || r.email}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.roles.length === 0 && <span className="text-xs text-muted-foreground">No roles assigned</span>}
                      {r.roles.map((rr: any) => (
                        <span key={rr.id} className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {rr.role.replace(/_/g, " ")}
                          {isSuperAdmin && r.id !== user?.id && (
                            <button onClick={() => { if (confirm("Remove this role?")) removeRoleMutation.mutate(rr.id); }}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-3">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            addRoleMutation.mutate({ userId: r.id, role: e.target.value as AppRole });
                            e.target.value = "";
                          }
                        }}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="">+ Add role…</option>
                        {ROLES.filter((role) => !r.roles.some((rr: any) => rr.role === role.value)).map((role) => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="border border-border/30 rounded-xl overflow-hidden bg-card">
        <div className="px-6 py-4 border-b border-border/20 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">Client ↔ Account Links</h2>
          <span className="text-xs text-muted-foreground ml-2">{(teamMembers ?? []).length} links</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/20 bg-muted/10">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Account</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role on Account</th>
              {isSuperAdmin && <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(teamMembers ?? []).map((m: any) => {
              const account = (accounts ?? []).find((a: any) => a.id === m.account_id);
              const profile = (profiles ?? []).find((p: any) => p.id === m.user_id);
              return (
                <tr key={m.id} className="border-b border-border/10 hover:bg-muted/10">
                  <td className="px-6 py-3 text-foreground">{account?.name ?? m.account_id}</td>
                  <td className="px-6 py-3 text-foreground">{profile?.email ?? m.user_id}</td>
                  <td className="px-6 py-3 text-muted-foreground">{m.role_on_account ?? "—"}</td>
                  {isSuperAdmin && (
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => { if (confirm("Remove this link?")) unlinkMutation.mutate(m.id); }} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {(teamMembers ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No links yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
