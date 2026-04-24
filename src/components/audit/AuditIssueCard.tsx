import { AlertTriangle, AlertCircle, Info, CheckCircle2, Circle, PlayCircle, CheckCheck } from "lucide-react";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";

export type RecommendationStatus = "open" | "planned" | "in_progress" | "done";

export interface AuditRecommendation {
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  impact: string;
  fix_steps: string[];
  estimated_effort: string;
}

const priorityConfig = {
  critical: { icon: AlertCircle, variant: "danger" as const, label: "Critical" },
  high: { icon: AlertTriangle, variant: "warning" as const, label: "High" },
  medium: { icon: Info, variant: "info" as const, label: "Medium" },
  low: { icon: CheckCircle2, variant: "neutral" as const, label: "Low" },
};

const statusConfig: Record<RecommendationStatus, { label: string; icon: any; className: string }> = {
  open: { label: "Open", icon: Circle, className: "border-border/40 text-muted-foreground hover:text-foreground" },
  planned: { label: "Planned", icon: Circle, className: "border-primary/40 bg-primary/10 text-primary" },
  in_progress: { label: "In progress", icon: PlayCircle, className: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
  done: { label: "Done", icon: CheckCheck, className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
};

interface Props {
  rec: AuditRecommendation;
  status?: RecommendationStatus;
  onStatusChange?: (next: RecommendationStatus) => void;
}

export function AuditIssueCard({ rec, status = "open", onStatusChange }: Props) {
  const cfg = priorityConfig[rec.priority] || priorityConfig.medium;
  const Icon = cfg.icon;

  return (
    <div className="rounded-xl border border-border/30 bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted/40 p-2 text-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill variant={cfg.variant}>{cfg.label}</StatusPill>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{rec.category}</span>
              <span className="text-[11px] text-muted-foreground">· {rec.estimated_effort}</span>
            </div>
            <h4 className="mt-2 font-display text-base font-semibold text-foreground">{rec.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{rec.impact}</p>
          </div>
        </div>
      </div>

      {onStatusChange && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/20 pt-3">
          <span className="mr-1 text-[10px] uppercase tracking-wide text-muted-foreground">Fix status</span>
          {(Object.keys(statusConfig) as RecommendationStatus[]).map((s) => {
            const c = statusConfig[s];
            const SI = c.icon;
            const active = status === s;
            return (
              <Button
                key={s}
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(s)}
                className={`h-7 rounded-full border px-2.5 text-[11px] transition-colors ${active ? c.className : "border-border/40 text-muted-foreground hover:text-foreground"}`}
              >
                <SI className="mr-1 h-3 w-3" />
                {c.label}
              </Button>
            );
          })}
        </div>
      )}

      {rec.fix_steps?.length > 0 && (
        <ol className="mt-4 space-y-2 border-t border-border/20 pt-4 text-sm text-foreground/90">
          {rec.fix_steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
