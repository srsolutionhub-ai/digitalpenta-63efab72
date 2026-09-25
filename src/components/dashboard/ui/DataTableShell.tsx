import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableShellProps {
  title?: string;
  description?: string;
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Consistent chrome (header/toolbar/footer) wrapping any table content.
 * Pages control the table body/rows; this only standardizes the shell.
 */
export function DataTableShell({ title, description, toolbar, footer, children, className }: DataTableShellProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/30 bg-card", className)}>
      {(title || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-border/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {title && (
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
              {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {footer && <div className="border-t border-border/20 px-4 py-3">{footer}</div>}
    </div>
  );
}
