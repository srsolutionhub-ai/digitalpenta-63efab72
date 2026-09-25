import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  icon?: LucideIcon;
  hint?: string;
  className?: string;
}

/** Shared KPI/stat tile used across admin & client dashboard shells. */
export function StatCard({ label, value, delta, icon: Icon, hint, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/30 bg-card p-5 transition-colors hover:border-primary/40",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-foreground">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {delta && (
          <span className={cn("text-xs font-medium", delta.positive ? "text-emerald-400" : "text-rose-400")}>
            {delta.positive ? "↑" : "↓"} {delta.value}
          </span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
