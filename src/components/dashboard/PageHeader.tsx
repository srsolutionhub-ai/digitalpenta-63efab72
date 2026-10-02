import { ReactNode } from "react";
import { usePublishDashboardTitle } from "@/components/dashboard/ui/dashboard-title-context";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  // Publishes this page's title into the sticky dashboard top bar, if inside one.
  usePublishDashboardTitle(title, description);

  return (
    <div className="mb-5 flex min-w-0 flex-col sm:mb-6 gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.href ? (
                  <a href={b.href} className="hover:text-foreground transition-colors">
                    {b.label}
                  </a>
                ) : (
                  <span>{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-xl font-bold text-foreground break-words sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 [&>*]:shrink-0">{actions}</div>}
    </div>
  );
}
