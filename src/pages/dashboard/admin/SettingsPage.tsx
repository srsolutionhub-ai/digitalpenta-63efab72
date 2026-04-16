import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, Shield, Trash2, Mail } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const ROLES: { value: AppRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "account_manager", label: "Account Manager" },
  { value: "finance", label: "Finance" },
  { value: "content_writer", label: "Content Writer" },
  { value: "seo_specialist", label: "SEO Specialist" },
  { value: "client", label: "Client" },
];

interface TeamMember {
  user_id: string;
  role: AppRole;
  email: string;
  full_name: string | null;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AppRole>("client");
  const [inviteFullName, setInviteFullName] = useState("");

  const { data: members, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (error) throw error;

      // Get profiles for these users
      const userIds = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      return roles.map((r) => {
        const profile = profiles?.find((p) => p.id === r.user_id);
        return {
          user_id: r.user_id,
          role: r.role,
          email: profile?.email || "Unknown",
          full_name: profile?.full_name || null,
        } as TeamMember;
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("User removed");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      // Create user via Supabase admin invite (requires edge function for production)
      // For now, insert into user_roles if user already exists
      // In production, use an edge function with service_role key to invite
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", inviteEmail)
        .maybeSingle();

      if (existingProfile) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: existingProfile.id, role: inviteRole });
        if (error) throw error;
      } else {
        throw new Error("User must sign up first. Send them the signup link, then assign a role here.");
      }
    },
    onSuccess: () => {
      toast.success("Role assigned to user");
      setInviteEmail("");
      setInviteFullName("");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-xl text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage team members and roles</p>
      </div>

      {/* Invite / Assign Role */}
      <div className="border border-border/30 rounded-xl p-6 bg-card space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">Assign Role to User</h2>
        </div>
        <p className="text-muted-foreground text-xs">
          The user must have an account first. Enter their email to assign a role.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as AppRole)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => inviteMutation.mutate()}
              disabled={!inviteEmail || inviteMutation.isPending}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-1" /> Assign Role
            </Button>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="border border-border/30 rounded-xl overflow-hidden bg-card">
        <div className="px-6 py-4 border-b border-border/20 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">Team Members</h2>
          <span className="text-xs text-muted-foreground ml-2">{members?.length ?? 0} users</span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-muted/10">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((m) => (
                <tr key={m.user_id} className="border-b border-border/10 hover:bg-muted/10">
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-foreground font-medium">{m.full_name || m.email}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={m.role}
                      onChange={(e) =>
                        updateRoleMutation.mutate({ userId: m.user_id, newRole: e.target.value as AppRole })
                      }
                      disabled={m.user_id === user?.id}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {m.user_id !== user?.id && (
                      <button
                        onClick={() => { if (confirm("Remove this user's role?")) deleteRoleMutation.mutate(m.user_id); }}
                        className="p-1.5 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {members?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No team members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
