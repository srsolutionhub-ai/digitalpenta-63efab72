import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { StatusPill } from "@/components/dashboard/StatusPill";

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

export function AuditIssueCard({ rec }: { rec: AuditRecommendation }) {
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
