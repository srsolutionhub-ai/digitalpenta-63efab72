import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCircle, KeyRound, Building2 } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

export default function ClientProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["client-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["client-profile-companies", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: memberships } = await db.from("account_team_members").select("account_id, role").eq("user_id", user.id);
      const accountIds = (memberships ?? []).map((m: any) => m.account_id);
      if (!accountIds.length) return [];
      const { data } = await db.from("accounts").select("id,name,tier,status").in("id", accountIds);
      return (data ?? []).map((a: any) => ({ ...a, role: memberships?.find((m: any) => m.account_id === a.id)?.role }));
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile]);

  const save = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await db.from("profiles").update({
        full_name: fullName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["client-profile", user?.id] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Profile & Settings" description="Manage your account details and security." />

      <div className="card-surface rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <UserCircle className="w-4 h-4 text-primary" /> Profile
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
        </div>
        <div>
          <Label>Avatar URL</Label>
          <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
        </div>
        <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>Save changes</Button>
      </div>

      <div className="card-surface rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Companies you have access to
        </h2>
        {companies.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not linked to any company workspace yet. Ask your account manager to add you.</p>
        ) : (
          <ul className="space-y-2">
            {companies.map((c: any) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{c.role || "member"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card-surface rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" /> Security
        </h2>
        <p className="text-sm text-muted-foreground">Change your password via a secure reset link sent to your email.</p>
        <Button size="sm" variant="outline" onClick={() => navigate("/auth/forgot-password")}>Send password reset link</Button>
      </div>
    </div>
  );
}
