import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  info: "bg-primary/15 text-primary border-primary/30",
  neutral: "bg-card text-foreground border-border/40",
};

interface StatusPillProps {
  variant?: keyof typeof variants;
  children: React.ReactNode;
  className?: string;
}

export function StatusPill({ variant = "default", children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
