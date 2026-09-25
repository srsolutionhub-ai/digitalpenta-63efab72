import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple";

const variantClasses: Record<StatusBadgeVariant, string> = {
  default: "bg-muted text-muted-foreground border-transparent",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  info: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  neutral: "bg-card text-foreground border-border/40",
  purple: "bg-primary/15 text-primary border-primary/30",
};

interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

/** Token-based status badge for use across admin & client dashboards. */
export function StatusBadge({ variant = "default", children, className, dot }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-normal",
        variantClasses[variant],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", variantClasses[variant].split(" ")[1])} />}
      {children}
    </span>
  );
}
