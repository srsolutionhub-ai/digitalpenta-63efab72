import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import {
  ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const db = supabase as any;

const RANGES = [
  { key: 7, label: "7 days" },
  { key: 30, label: "30 days" },
  { key: 90, label: "90 days" },
];

function fmtDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function fmtDuration(ms: number | null) {
  if (ms == null) return "—";
  const mins = ms / 60000;
  if (mins < 60) return `${mins.toFixed(1)} min`;
  const hrs = mins / 60;
  if (hrs < 24) return `${hrs.toFixed(1)} hr`;
  return `${(hrs / 24).toFixed(1)} d`;
}

export default function WhatsAppAnalytics() {
  const [days, setDays] = useState(30);

  const sinceIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }, [days]);

  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ["wa-analytics-conversations"],
    queryFn: async () => (await db.from("whatsapp_conversations").select("*")).data ?? [],
  });

  const { data: messages = [], isLoading: loadingMsgs } = useQuery({
    queryKey: ["wa-analytics-messages", sinceIso],
    queryFn: async () =>
      (await db.from("whatsapp_messages_v2").select("*").gte("created_at", sinceIso).order("created_at", { ascending: true })).data ?? [],
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["wa-analytics-staff"],
    queryFn: async () => (await db.from("profiles").select("id, full_name").neq("role", "client")).data ?? [],
  });

  const isLoading = loadingConvs || loadingMsgs;

  const chartData = useMemo(() => {
    const byDay: Record<string, { day: string; inbound: number; outbound: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = fmtDay(d);
      byDay[key] = { day: key, inbound: 0, outbound: 0 };
    }
    for (const m of messages) {
      if (!m.created_at) continue;
      const key = m.created_at.slice(0, 10);
      if (!byDay[key]) continue;
      if (m.direction === "inbound") byDay[key].inbound++;
      else if (m.direction === "outbound") byDay[key].outbound++;
    }
    return Object.values(byDay);
  }, [messages, days]);

  const outboundMsgs = useMemo(() => messages.filter((m: any) => m.direction === "outbound"), [messages]);
  const deliveredCount = outboundMsgs.filter((m: any) => m.status === "delivered" || m.status === "read").length;
  const readCount = outboundMsgs.filter((m: any) => m.status === "read").length;
  const failedCount = outboundMsgs.filter((m: any) => m.status === "failed").length;
  const total = outboundMsgs.length;
  const pct = (n: number) => (total ? `${((n / total) * 100).toFixed(1)}%` : "—");

  const botHandled = outboundMsgs.filter((m: any) => !m.sent_by).length;
  const humanHandled = outboundMsgs.filter((m: any) => !!m.sent_by).length;

  const medianFirstResponseMs = useMemo(() => {
    const byConv: Record<string, any[]> = {};
    for (const m of messages) {
      if (!byConv[m.conversation_id]) byConv[m.conversation_id] = [];
      byConv[m.conversation_id].push(m);
    }
    const responseTimes: number[] = [];
    for (const convId of Object.keys(byConv)) {
      const msgs = byConv[convId];
      for (let i = 0; i < msgs.length; i++) {
        if (msgs[i].direction !== "inbound") continue;
        const inboundTime = new Date(msgs[i].created_at).getTime();
        const nextOutbound = msgs.slice(i + 1).find((m) => m.direction === "outbound");
        if (nextOutbound) {
          const outTime = new Date(nextOutbound.created_at).getTime();
          if (outTime > inboundTime) responseTimes.push(outTime - inboundTime);
        }
        break; // only first inbound per conversation for a simple "first response" metric
      }
    }
    return median(responseTimes);
  }, [messages]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of conversations) {
      const s = c.status || "open";
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }, [conversations]);

  const perAgent = useMemo(() => {
    const counts: Record<string, number> = {};
    let unassigned = 0;
    for (const c of conversations) {
      if (!c.assignee_id) { unassigned++; continue; }
      counts[c.assignee_id] = (counts[c.assignee_id] || 0) + 1;
    }
    const rows = Object.entries(counts).map(([id, count]) => ({
      name: staff.find((s: any) => s.id === id)?.full_name || "Unknown",
      count,
    }));
    rows.sort((a, b) => b.count - a.count);
    if (unassigned) rows.push({ name: "Unassigned", count: unassigned });
    return rows;
  }, [conversations, staff]);

  const hasAnyData = conversations.length > 0 || messages.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Analytics"
        description="Message volume, response times and agent performance."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "WhatsApp", href: "/dashboard/admin/whatsapp" }, { label: "Analytics" }]}
        actions={
          <div className="flex gap-1 rounded-lg border border-border/30 p-0.5">
            {RANGES.map((r) => (
              <Button
                key={r.key}
                size="sm"
                variant={days === r.key ? "default" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setDays(r.key)}
              >
                {r.label}
              </Button>
            ))}
          </div>
        }
      />

      {!isLoading && !hasAnyData ? (
        <EmptyState icon={BarChart3} title="No WhatsApp data yet" description="Once conversations and messages come in, analytics will appear here." />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Delivered rate" value={pct(deliveredCount)} sub={`${deliveredCount}/${total} outbound`} />
            <StatCard label="Read rate" value={pct(readCount)} sub={`${readCount}/${total} outbound`} />
            <StatCard label="Failed rate" value={pct(failedCount)} sub={`${failedCount}/${total} outbound`} />
            <StatCard label="Median first response" value={fmtDuration(medianFirstResponseMs)} sub={`over ${days}d`} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Bot-handled replies" value={String(botHandled)} sub={total ? `${((botHandled / total) * 100).toFixed(0)}% of outbound` : "—"} />
            <StatCard label="Human-handled replies" value={String(humanHandled)} sub={total ? `${((humanHandled / total) * 100).toFixed(0)}% of outbound` : "—"} />
            {Object.entries(statusCounts).map(([status, count]) => (
              <StatCard key={status} label={`${status} conversations`} value={String(count)} sub={`of ${conversations.length} total`} />
            ))}
          </div>

          <div className="card-surface rounded-xl p-4">
            <p className="font-display font-semibold text-sm mb-4">Messages per day — inbound vs outbound</p>
            {chartData.every((d) => d.inbound === 0 && d.outbound === 0) ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No messages in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="inbound" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="outbound" fill="hsl(var(--muted-foreground))" radius={[3, 3, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card-surface rounded-xl p-4">
            <p className="font-display font-semibold text-sm mb-4">Conversations per agent</p>
            {perAgent.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No conversations assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {perAgent.map((row) => (
                  <div key={row.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{row.name}</span>
                    <span className="text-muted-foreground">{row.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card-surface rounded-xl p-4">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-display text-xl font-semibold text-foreground mt-1">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}
