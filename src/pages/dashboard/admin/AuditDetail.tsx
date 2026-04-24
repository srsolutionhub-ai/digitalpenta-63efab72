import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AuditScoreRing } from "@/components/audit/AuditScoreRing";
import { AuditIssueCard, type AuditRecommendation, type RecommendationStatus } from "@/components/audit/AuditIssueCard";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function AuditDetail() {
  const { id } = useParams<{ id: string }>();
  const [audit, setAudit] = useState<any>(null);
  const [statuses, setStatuses] = useState<Record<string, RecommendationStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("audits").select("*").eq("id", id).single();
      setAudit(data);
      setStatuses(((data as any)?.recommendation_statuses ?? {}) as Record<string, RecommendationStatus>);
      setLoading(false);
    })();
  }, [id]);

  // Persist status changes immediately so the team can collaborate live.
  const updateStatus = async (recIndex: number, next: RecommendationStatus) => {
    const key = String(recIndex);
    const optimistic = { ...statuses, [key]: next };
    setStatuses(optimistic);
    const { error } = await supabase.from("audits").update({ recommendation_statuses: optimistic }).eq("id", id!);
    if (error) {
      toast.error("Could not save status");
      setStatuses(statuses);
    } else {
      toast.success(`Marked as ${next.replace("_", " ")}`);
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!audit) return <div className="text-sm text-muted-foreground">Audit not found.</div>;

  const recs: AuditRecommendation[] = audit.ai_recommendations ?? [];
  const counts = recs.reduce(
    (acc, _r, i) => {
      const s = (statuses[String(i)] ?? "open") as RecommendationStatus;
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    { open: 0, planned: 0, in_progress: 0, done: 0 } as Record<RecommendationStatus, number>
  );

  return (
    <div className="space-y-6">
      <Link to="/dashboard/admin/audits" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back to audits
      </Link>
      <PageHeader
        title={audit.url}
        description={audit.visitor_email ? `${audit.visitor_name ?? ""} · ${audit.visitor_email}` : "Anonymous visitor"}
        actions={
          <a href={audit.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            Open site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        }
      />

      <div className="rounded-xl border border-border/30 bg-card p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <AuditScoreRing score={audit.performance_score ?? 0} label="Performance" />
          <AuditScoreRing score={audit.seo_score ?? 0} label="SEO" />
          <AuditScoreRing score={audit.accessibility_score ?? 0} label="Accessibility" />
          <AuditScoreRing score={audit.best_practices_score ?? 0} label="Best Practices" />
        </div>
      </div>

      {audit.pdf_url && (
        <a href={audit.pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20">
          Download PDF report
        </a>
      )}

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-foreground">AI Recommendations ({recs.length})</h3>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full border border-border/40 px-2 py-0.5 text-muted-foreground">{counts.open} open</span>
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary">{counts.planned} planned</span>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-amber-400">{counts.in_progress} in progress</span>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">{counts.done} done</span>
          </div>
        </div>
        <div className="space-y-3">
          {recs.map((r, i) => (
            <AuditIssueCard
              key={i}
              rec={r}
              status={(statuses[String(i)] ?? "open") as RecommendationStatus}
              onStatusChange={(s) => updateStatus(i, s)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
