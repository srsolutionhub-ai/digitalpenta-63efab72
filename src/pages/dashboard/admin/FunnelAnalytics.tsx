import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, TrendingUp, Users, Target } from "lucide-react";

const FUNNEL_STAGES = [
  { key: "page_view", label: "Page View", icon: Activity },
  { key: "tool_view", label: "Tool View", icon: Target },
  { key: "tool_submit", label: "Tool Submit", icon: TrendingUp },
  { key: "lead_capture", label: "Lead Capture", icon: Users },
  { key: "booking_request", label: "Booking", icon: Users },
];

export default function FunnelAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["funnel-analytics"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data: events } = await supabase
        .from("analytics_events")
        .select("event_name, custom_properties, created_at")
        .gte("created_at", since)
        .limit(5000);

      const counts: Record<string, number> = {};
      const sources: Record<string, number> = {};
      events?.forEach((e: any) => {
        counts[e.event_name] = (counts[e.event_name] || 0) + 1;
        const src = e.custom_properties?.utm_source || "direct";
        sources[src] = (sources[src] || 0) + 1;
      });

      const { count: leadsTotal } = await supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", since);
      const { count: bookingsTotal } = await supabase.from("strategy_call_bookings").select("*", { count: "exact", head: true }).gte("created_at", since);
      const { count: toolRunsTotal } = await (supabase.from("tool_runs" as any).select("*", { count: "exact", head: true }).gte("created_at", since) as any);

      return {
        events: counts,
        sources: Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 8),
        leadsTotal: leadsTotal ?? 0,
        bookingsTotal: bookingsTotal ?? 0,
        toolRunsTotal: toolRunsTotal ?? 0,
      };
    },
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;

  const stageCounts: Record<string, number> = {
    page_view: data?.events.page_view || 0,
    tool_view: data?.events.tool_view || 0,
    tool_submit: data?.toolRunsTotal || 0,
    lead_capture: data?.leadsTotal || 0,
    booking_request: data?.bookingsTotal || 0,
  };
  const max = Math.max(...Object.values(stageCounts), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl text-foreground">Funnel Analytics</h1>
        <p className="text-xs text-muted-foreground mt-1">Last 30 days · live data from analytics_events, leads, bookings, tool_runs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Page Views" value={stageCounts.page_view} />
        <KPI label="Tool Submits" value={stageCounts.tool_submit} />
        <KPI label="Leads" value={stageCounts.lead_capture} />
        <KPI label="Bookings" value={stageCounts.booking_request} />
      </div>

      <div className="card-surface rounded-2xl p-6">
        <p className="font-display font-semibold text-foreground mb-4 text-sm">Conversion Funnel</p>
        <div className="space-y-3">
          {FUNNEL_STAGES.map((s) => {
            const c = stageCounts[s.key];
            const pct = (c / max) * 100;
            return (
              <div key={s.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 text-foreground"><s.icon className="w-3 h-3" /> {s.label}</span>
                  <span className="text-muted-foreground font-mono">{c.toLocaleString()}</span>
                </div>
                <div className="h-3 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-surface rounded-2xl p-6">
        <p className="font-display font-semibold text-foreground mb-4 text-sm">Top Sources</p>
        <div className="space-y-2">
          {data?.sources.map(([src, count]) => (
            <div key={src} className="flex items-center justify-between text-sm">
              <span className="text-foreground capitalize">{src}</span>
              <span className="font-mono text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-surface rounded-2xl p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-2xl text-foreground mt-1">{value.toLocaleString()}</p>
    </div>
  );
}
