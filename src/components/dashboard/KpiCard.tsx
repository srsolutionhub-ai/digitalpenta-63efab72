import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  icon?: LucideIcon;
  className?: string;
}

export function KpiCard({ label, value, delta, icon: Icon, className }: KpiCardProps) {
  return (
    <div className={cn("rounded-xl border border-border/30 bg-card p-5 transition-colors hover:border-primary/40", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-foreground">{value}</p>
      {delta && (
        <p className={cn("mt-1 text-xs font-medium", delta.positive ? "text-emerald-400" : "text-rose-400")}>
          {delta.positive ? "↑" : "↓"} {delta.value}
        </p>
      )}
    </div>
  );
}
