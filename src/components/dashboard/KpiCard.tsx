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
    <div className={cn("group relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-b from-card to-card/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-16px_hsl(var(--primary)/0.45)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums tracking-tight text-foreground">{value}</p>
      {delta && (
        <p className={cn("mt-1 text-xs font-medium", delta.positive ? "text-emerald-400" : "text-rose-400")}>
          {delta.positive ? "↑" : "↓"} {delta.value}
        </p>
      )}
    </div>
  );
}
