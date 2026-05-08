import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, Users, Target, Download, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import { toast } from "sonner";

const FUNNEL_STAGES = [
  { key: "page_view", label: "Page View", icon: Activity },
  { key: "tool_view", label: "Tool View", icon: Target },
  { key: "tool_submit", label: "Tool Submit", icon: TrendingUp },
  { key: "lead_capture", label: "Lead Capture", icon: Users },
  { key: "booking_request", label: "Booking", icon: Users },
];

function fmt(n: number) { return n.toLocaleString(); }
function pct(n: number) { return `${(n * 100).toFixed(1)}%`; }

export default function FunnelAnalytics() {
  const reportRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["funnel-analytics-v2"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data: events } = await supabase
        .from("analytics_events")
        .select("event_name, custom_properties, created_at")
        .gte("created_at", since)
        .limit(10000);

      const counts: Record<string, number> = {};
      const sources: Record<string, number> = {};
      const dailyEvents: Record<string, Record<string, number>> = {};
      events?.forEach((e: any) => {
        counts[e.event_name] = (counts[e.event_name] || 0) + 1;
        const src = e.custom_properties?.utm_source || "direct";
        sources[src] = (sources[src] || 0) + 1;
        const day = e.created_at.slice(0, 10);
        dailyEvents[day] = dailyEvents[day] || {};
        dailyEvents[day][e.event_name] = (dailyEvents[day][e.event_name] || 0) + 1;
      });

      const { count: leadsTotal } = await supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", since);
      const { count: bookingsTotal } = await supabase.from("strategy_call_bookings").select("*", { count: "exact", head: true }).gte("created_at", since);
      const { count: toolRunsTotal } = await (supabase.from("tool_runs" as any).select("*", { count: "exact", head: true }).gte("created_at", since) as any);

      return {
        events: counts,
        dailyEvents,
        sources: Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 8),
        leadsTotal: leadsTotal ?? 0,
        bookingsTotal: bookingsTotal ?? 0,
        toolRunsTotal: toolRunsTotal ?? 0,
      };
    },
  });

  const stages = useMemo(() => {
    const c: Record<string, number> = {
      page_view: data?.events.page_view || 0,
      tool_view: data?.events.tool_view || 0,
      tool_submit: data?.toolRunsTotal || 0,
      lead_capture: data?.leadsTotal || 0,
      booking_request: data?.bookingsTotal || 0,
    };
    return FUNNEL_STAGES.map((s, i) => {
      const count = c[s.key];
      const prev = i > 0 ? c[FUNNEL_STAGES[i - 1].key] : count;
      const top = c.page_view || 1;
      return {
        ...s,
        count,
        fromPrev: i === 0 ? 1 : prev > 0 ? count / prev : 0,
        fromTop: top > 0 ? count / top : 0,
        dropoff: i === 0 ? 0 : Math.max(prev - count, 0),
      };
    });
  }, [data]);

  const trend = useMemo(() => {
    if (!data?.dailyEvents) return [];
    return Object.entries(data.dailyEvents)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([day, ev]) => ({ day: day.slice(5), views: ev.page_view || 0, submits: ev.tool_submit || 0 }));
  }, [data]);

  const downloadPDF = () => {
    if (!data) return;
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const margin = 40;
      const dateStr = new Date().toLocaleDateString();

      // Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, W, 70, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold").setFontSize(18);
      doc.text("Digital Penta — Weekly KPI Funnel Report", margin, 40);
      doc.setFont("helvetica", "normal").setFontSize(10);
      doc.text(`Generated ${dateStr}  ·  Trailing 30-day window`, margin, 58);

      // KPIs
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.text("Key metrics", margin, 110);
      const kpis = [
        ["Page views", fmt(stages[0].count)],
        ["Tool submits", fmt(stages[2].count)],
        ["Leads", fmt(stages[3].count)],
        ["Bookings", fmt(stages[4].count)],
      ];
      kpis.forEach(([label, val], i) => {
        const x = margin + (i % 4) * ((W - margin * 2) / 4);
        doc.setDrawColor(220).rect(x, 120, (W - margin * 2) / 4 - 8, 50);
        doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(100);
        doc.text(label, x + 8, 138);
        doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(15, 23, 42);
        doc.text(val, x + 8, 160);
      });

      // Funnel
      doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(15, 23, 42);
      doc.text("Conversion funnel", margin, 200);
      let y = 215;
      const max = stages[0].count || 1;
      stages.forEach((s) => {
        const w = ((W - margin * 2) * s.count) / max;
        doc.setFillColor(139, 92, 246).rect(margin, y, w || 1, 18, "F");
        doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(15, 23, 42);
        doc.text(`${s.label}`, margin + 4, y + 13);
        doc.text(`${fmt(s.count)}  ·  ${pct(s.fromTop)} of top  ·  step CR ${pct(s.fromPrev)}`, margin + 200, y + 13);
        y += 24;
      });

      // Drop-offs
      y += 12;
      doc.setFont("helvetica", "bold").setFontSize(12);
      doc.text("Stage drop-off", margin, y);
      y += 16;
      doc.setFont("helvetica", "normal").setFontSize(9);
      stages.slice(1).forEach((s, i) => {
        const prev = stages[i];
        doc.setTextColor(80);
        doc.text(`${prev.label} → ${s.label}: lost ${fmt(s.dropoff)}  (retained ${pct(s.fromPrev)})`, margin, y);
        y += 14;
      });

      // Top sources
      y += 12;
      doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(15, 23, 42);
      doc.text("Top sources (30d)", margin, y);
      y += 14;
      doc.setFont("helvetica", "normal").setFontSize(9);
      data.sources.forEach(([src, n]) => {
        doc.text(`• ${src}`, margin, y);
        doc.text(String(n), W - margin - 40, y);
        y += 12;
      });

      // Footer
      doc.setDrawColor(220).line(margin, H - 50, W - margin, H - 50);
      doc.setFontSize(8).setTextColor(120);
      doc.text("Digital Penta · digitalpenta.com · support@digitalpenta.com", margin, H - 32);
      doc.text(`Page 1 of 1`, W - margin - 60, H - 32);

      doc.save(`funnel-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Report downloaded");
    } catch (e: any) {
      toast.error("Failed to generate PDF");
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;

  return (
    <div ref={reportRef} className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">Funnel Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days · live data with stage conversion + drop-off insights</p>
        </div>
        <Button size="sm" onClick={downloadPDF}><Download className="w-3 h-3 mr-1" /> Download Weekly Report (PDF)</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Page Views" value={stages[0].count} />
        <KPI label="Tool Submits" value={stages[2].count} sub={`${pct(stages[2].fromTop)} of views`} />
        <KPI label="Leads" value={stages[3].count} sub={`${pct(stages[3].fromTop)} CR`} />
        <KPI label="Bookings" value={stages[4].count} sub={`${pct(stages[4].fromTop)} CR`} />
      </div>

      <div className="card-surface rounded-2xl p-6">
        <p className="font-display font-semibold text-foreground mb-4 text-sm">Conversion funnel & drop-off</p>
        <div className="space-y-4">
          {stages.map((s, i) => {
            const max = stages[0].count || 1;
            const widthPct = (s.count / max) * 100;
            return (
              <div key={s.key}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-2 text-foreground"><s.icon className="w-3 h-3" /> {s.label}</span>
                  <span className="font-mono text-muted-foreground flex items-center gap-3">
                    <span>{fmt(s.count)}</span>
                    <span className="text-[10px] uppercase">top {pct(s.fromTop)}</span>
                    {i > 0 && <span className="text-[10px] uppercase text-primary">step {pct(s.fromPrev)}</span>}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all" style={{ width: `${widthPct}%` }} />
                </div>
                {i > 0 && s.dropoff > 0 && (
                  <p className="text-[10px] text-destructive/80 mt-1 flex items-center gap-1">
                    <ArrowDownRight className="w-3 h-3" /> Dropped {fmt(s.dropoff)} from {stages[i - 1].label}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card-surface rounded-2xl p-6">
          <p className="font-display font-semibold text-foreground mb-4 text-sm">14-day trend</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 11 }} />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="submits" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6">
          <p className="font-display font-semibold text-foreground mb-4 text-sm">Top sources</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(data?.sources || []).map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 11 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="card-surface rounded-2xl p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-2xl text-foreground mt-1">{fmt(value)}</p>
      {sub && <p className="text-[10px] text-primary mt-1 font-mono">{sub}</p>}
    </div>
  );
}
