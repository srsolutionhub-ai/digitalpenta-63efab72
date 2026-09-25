import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Building2 } from "lucide-react";

const db = supabase as any;

function formatMonth(period: string) {
  try {
    return new Date(period).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return period;
  }
}

export default function ClientReports() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["client-reports-page", user?.id],
    queryFn: async () => {
      if (!user) return { linked: false, reports: [] as any[] };
      const { data: memberships } = await db.from("account_team_members").select("account_id").eq("user_id", user.id);
      const accountIds = (memberships ?? []).map((m: any) => m.account_id);
      if (accountIds.length === 0) return { linked: false, reports: [] };

      const { data: reports, error } = await db
        .from("client_reports")
        .select("*")
        .in("account_id", accountIds)
        .eq("published", true)
        .order("period_month", { ascending: false });
      if (error) throw error;
      return { linked: true, reports: reports ?? [] };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!data?.linked) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports" description="Monthly performance summaries from your team." />
        <EmptyState icon={Building2} title="Not linked to a company yet" description="Ask your account manager to add you to your team's workspace." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Monthly performance summaries from your team." />

      {data.reports.length === 0 ? (
        <EmptyState icon={BarChart3} title="No reports yet" description="Published monthly reports will appear here." />
      ) : (
        <div className="space-y-4">
          {data.reports.map((r: any) => {
            const metrics = (r.metrics && typeof r.metrics === "object" ? Object.entries(r.metrics) : []) as [string, any][];
            return (
              <div key={r.id} className="card-surface rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">{formatMonth(r.period_month)}</p>
                    <h3 className="font-display font-semibold text-foreground">{r.title}</h3>
                  </div>
                  {r.file_url && (
                    <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline"><Download className="w-3.5 h-3.5 mr-1.5" /> Download</Button>
                    </a>
                  )}
                </div>
                {r.summary && <p className="text-sm text-muted-foreground">{r.summary}</p>}
                {metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {metrics.map(([k, v]) => (
                      <div key={k} className="p-3 rounded-lg bg-muted/20">
                        <p className="text-[10px] text-muted-foreground uppercase font-mono truncate">{k}</p>
                        <p className="font-display font-bold text-foreground truncate">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
