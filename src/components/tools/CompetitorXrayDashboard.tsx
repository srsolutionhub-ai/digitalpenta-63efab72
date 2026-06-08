import { lazy, Suspense } from "react";
import { TrendingUp, Search, FileText, Target } from "lucide-react";

// Lazy load recharts — keeps competitor tool page TTI under 1s on cold load.
const LazyCharts = lazy(() => import("./CompetitorXrayCharts"));

interface Result {
  summary: string;
  gaps: { category: string; you: string; competitor: string; opportunity: string; priority: string }[];
  quick_wins?: string[];
  content_gaps?: string[];
  keyword_opportunities?: string[];
}

export default function CompetitorXrayDashboard({ r }: { r: Result }) {
  const highPriority = r.gaps?.filter((g) => g.priority === "High").length ?? 0;
  const mediumPriority = r.gaps?.filter((g) => g.priority === "Medium").length ?? 0;

  return (
    <div className="space-y-5 text-sm">
      <p className="text-foreground/80">{r.summary}</p>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-2">
        <Kpi icon={Target} label="Total gaps" value={r.gaps?.length ?? 0} tone="primary" />
        <Kpi icon={TrendingUp} label="High priority" value={highPriority} tone="rose" />
        <Kpi icon={Search} label="Keywords" value={r.keyword_opportunities?.length ?? 0} tone="sky" />
        <Kpi icon={FileText} label="Content gaps" value={r.content_gaps?.length ?? 0} tone="emerald" />
      </div>

      {/* Lazy charts mount only when the result is visible */}
      <Suspense fallback={<div className="h-[220px] rounded-lg bg-card/30 animate-pulse" />}>
        <LazyCharts gaps={r.gaps ?? []} />
      </Suspense>

      {/* Gap list */}
      {r.gaps?.length > 0 && (
        <div>
          <p className="type-label text-primary mb-2 font-mono">Gap analysis</p>
          <div className="space-y-2">
            {r.gaps.map((g, i) => (
              <div key={i} className="border border-border/30 rounded-lg p-3 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-semibold text-foreground">{g.category}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                    g.priority === "High" ? "bg-rose-500/10 text-rose-400" :
                    g.priority === "Medium" ? "bg-amber-500/10 text-amber-400" :
                    "bg-white/5 text-muted-foreground"
                  }`}>{g.priority}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs mt-1">
                  <div><span className="text-muted-foreground">You: </span>{g.you}</div>
                  <div><span className="text-muted-foreground">Them: </span>{g.competitor}</div>
                </div>
                <div className="text-foreground/80 text-xs mt-2">→ {g.opportunity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {r.keyword_opportunities && r.keyword_opportunities.length > 0 && (
        <div>
          <p className="type-label text-sky-400 mb-1.5 font-mono">Keyword opportunities</p>
          <div className="flex flex-wrap gap-1.5">
            {r.keyword_opportunities.map((k, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-white/[0.04] text-xs text-foreground/80 border border-border/30">{k}</span>
            ))}
          </div>
        </div>
      )}

      {r.content_gaps && r.content_gaps.length > 0 && (
        <div>
          <p className="type-label text-emerald-400 mb-1.5 font-mono">Content gaps</p>
          <ul className="list-disc list-inside text-foreground/80 space-y-1">
            {r.content_gaps.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {r.quick_wins && (
        <div>
          <p className="type-label text-amber-400 mb-1.5 font-mono">Quick wins (next 30 days)</p>
          <ul className="list-disc list-inside text-foreground/80 space-y-1">
            {r.quick_wins.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: string }) {
  const map: Record<string, string> = {
    primary: "text-primary bg-primary/10",
    rose: "text-rose-400 bg-rose-500/10",
    sky: "text-sky-400 bg-sky-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
  };
  return (
    <div className="rounded-lg border border-border/30 p-3">
      <div className={`w-7 h-7 rounded-md flex items-center justify-center mb-1.5 ${map[tone]}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
      <p className="font-display font-bold text-xl text-foreground">{value}</p>
    </div>
  );
}
