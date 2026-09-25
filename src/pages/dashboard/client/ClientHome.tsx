import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { FolderKanban, ClipboardCheck, FileText, BarChart3, MessageCircle, Building2, ArrowRight } from "lucide-react";

const db = supabase as any;

function StatCard({ icon: Icon, label, value, to }: { icon: any; label: string; value: string; to: string }) {
  return (
    <Link to={to} className="card-surface rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 border border-transparent transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display font-bold text-lg text-foreground truncate">{value}</p>
      </div>
    </Link>
  );
}

export default function ClientHome() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["client-home", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: memberships } = await db.from("account_team_members").select("account_id").eq("user_id", user.id);
      const accountIds = (memberships ?? []).map((m: any) => m.account_id);

      if (accountIds.length === 0) {
        return { linked: false };
      }

      const [projectsRes, approvalsRes, invoicesRes, reportsRes, messagesRes] = await Promise.all([
        db.from("projects").select("id,status").in("account_id", accountIds),
        db.from("client_approvals").select("id,status").in("account_id", accountIds),
        db.from("invoices").select("id,total,status").eq("client_id", user.id),
        db.from("client_reports").select("*").in("account_id", accountIds).eq("published", true).order("period_month", { ascending: false }).limit(1).maybeSingle(),
        db.from("support_messages").select("*").eq("client_id", user.id).order("created_at", { ascending: false }).limit(3),
      ]);

      const projects = projectsRes.data ?? [];
      const approvals = approvalsRes.data ?? [];
      const invoices = invoicesRes.data ?? [];

      const activeProjects = projects.filter((p: any) => p.status === "active").length;
      const pendingApprovals = approvals.filter((a: any) => a.status === "pending").length;
      const openInvoicesTotal = invoices
        .filter((i: any) => i.status !== "paid")
        .reduce((sum: number, i: any) => sum + Number(i.total || 0), 0);

      return {
        linked: true,
        activeProjects,
        pendingApprovals,
        openInvoicesTotal,
        latestReport: reportsRes.data ?? null,
        recentMessages: messagesRes.data ?? [],
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!data?.linked) {
    return (
      <div className="space-y-6">
        <div className="card-surface rounded-2xl p-12 text-center">
          <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display font-bold text-xl text-foreground mb-2">Not linked to a company yet</h2>
          <p className="text-muted-foreground text-sm">Your account isn't connected to a workspace yet. Ask your account manager to add you to your team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening with your account.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} label="Active Projects" value={String(data.activeProjects)} to="/dashboard/client/projects" />
        <StatCard icon={ClipboardCheck} label="Pending Approvals" value={String(data.pendingApprovals)} to="/dashboard/client/approvals" />
        <StatCard icon={FileText} label="Open Invoices" value={`₹${data.openInvoicesTotal.toLocaleString()}`} to="/dashboard/client/invoices" />
        <StatCard icon={BarChart3} label="Latest Report" value={data.latestReport ? new Date(data.latestReport.period_month).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "None yet"} to="/dashboard/client/reports" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-surface rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Latest Report</h3>
            <Link to="/dashboard/client/reports" className="text-xs text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.latestReport ? (
            <div>
              <p className="text-sm font-medium text-foreground">{data.latestReport.title}</p>
              {data.latestReport.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{data.latestReport.summary}</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reports published yet.</p>
          )}
        </div>

        <div className="card-surface rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Recent Support</h3>
            <Link to="/dashboard/client/support" className="text-xs text-primary flex items-center gap-1 hover:underline">
              Open chat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <div className="space-y-2">
              {data.recentMessages.map((m: any) => (
                <p key={m.id} className="text-xs text-muted-foreground line-clamp-1">
                  <span className="text-foreground">{m.sender_id === user?.id ? "You: " : ""}</span>{m.message}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
