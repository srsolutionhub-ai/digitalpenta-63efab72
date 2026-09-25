import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, MessageSquare, ClipboardCheck, ExternalLink, Building2 } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-green-500/15 text-green-400",
  changes_requested: "bg-red-500/15 text-red-400",
};

export default function ClientApprovals() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [comments, setComments] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["client-approvals-page", user?.id],
    queryFn: async () => {
      if (!user) return { linked: false, approvals: [] as any[] };
      const { data: memberships } = await db.from("account_team_members").select("account_id").eq("user_id", user.id);
      const accountIds = (memberships ?? []).map((m: any) => m.account_id);
      if (accountIds.length === 0) return { linked: false, approvals: [] };

      const { data: approvals, error } = await db
        .from("client_approvals")
        .select("*, projects(name)")
        .in("account_id", accountIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return { linked: true, approvals: approvals ?? [] };
    },
    enabled: !!user,
  });

  const decide = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "changes_requested" }) => {
      if (!user) return;
      const { error } = await db
        .from("client_approvals")
        .update({
          status,
          client_comment: comments[id] || null,
          decided_by: user.id,
          decided_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      toast.success(vars.status === "approved" ? "Approved" : "Changes requested");
      qc.invalidateQueries({ queryKey: ["client-approvals-page", user?.id] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!data?.linked) {
    return (
      <div className="space-y-6">
        <PageHeader title="Approvals" description="Review and sign off on deliverables." />
        <EmptyState icon={Building2} title="Not linked to a company yet" description="Ask your account manager to add you to your team's workspace." />
      </div>
    );
  }

  const pending = data.approvals.filter((a: any) => a.status === "pending");
  const past = data.approvals.filter((a: any) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" description="Review and sign off on deliverables from your team." />

      {data.approvals.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No approvals yet" description="Items needing your sign-off will show up here." />
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Pending ({pending.length})</h3>
              {pending.map((a: any) => (
                <div key={a.id} className="card-surface rounded-2xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h4 className="font-display font-semibold text-foreground">{a.title}</h4>
                      {a.projects?.name && <p className="text-[11px] text-muted-foreground">Project: {a.projects.name}</p>}
                      {a.description && <p className="text-sm text-muted-foreground mt-1">{a.description}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize self-start ${STATUS_STYLE[a.status]}`}>{a.status.replace("_", " ")}</span>
                  </div>
                  {a.file_url && (
                    <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> View file
                    </a>
                  )}
                  <Textarea
                    placeholder="Optional comment…"
                    rows={2}
                    value={comments[a.id] || ""}
                    onChange={(e) => setComments((c) => ({ ...c, [a.id]: e.target.value }))}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => decide.mutate({ id: a.id, status: "changes_requested" })} disabled={decide.isPending}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Request changes
                    </Button>
                    <Button size="sm" className="w-full sm:w-auto" onClick={() => decide.mutate({ id: a.id, status: "approved" })} disabled={decide.isPending}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">History</h3>
              {past.map((a: any) => (
                <div key={a.id} className="card-surface rounded-xl p-4 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="font-display font-medium text-sm text-foreground">{a.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize self-start ${STATUS_STYLE[a.status]}`}>{a.status.replace("_", " ")}</span>
                  </div>
                  {a.client_comment && <p className="text-xs text-muted-foreground">"{a.client_comment}"</p>}
                  {a.decided_at && <p className="text-[11px] text-muted-foreground">Decided {new Date(a.decided_at).toLocaleDateString()}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
