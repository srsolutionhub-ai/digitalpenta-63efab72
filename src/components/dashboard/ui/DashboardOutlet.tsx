import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

/** Skeleton shown inside the dashboard shell while a page chunk loads —
 *  the sidebar and top bar stay on screen instead of a full-page spinner. */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading page">
      <div className="space-y-2">
        <div className="h-7 w-56 rounded-lg bg-muted/50" />
        <div className="h-4 w-80 max-w-full rounded bg-muted/30" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-border/20 bg-card/60" />
        ))}
      </div>
      <div className="h-72 rounded-2xl border border-border/20 bg-card/60" />
    </div>
  );
}

/** Outlet with in-shell loading + a soft enter transition per page. */
export default function DashboardOutlet() {
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </Suspense>
  );
}
