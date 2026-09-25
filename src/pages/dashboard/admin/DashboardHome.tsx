import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, Kanban, CheckSquare, MessageCircle, Mail, FileSearch, CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

const db = supabase as any;

const LiveActivityTicker = lazy(() => import("@/components/dashboard/LiveActivityTicker"));

function KPICard({ icon: Icon, label, value, sub, to, loading }: { icon: any; label: string; value: string | number; sub?: string; to: string; loading: boolean }) {
  if (loading) return <Skeleton className="h-28 rounded-2xl" />;
  return (
    <Link to={to} className="card-surface rounded-2xl p-5 hover-lift block">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </Link>
  );
}

const formatCurrency = (v: number) => {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
};

export default function DashboardHome() {
  const now = new Date();
  const iso7d = new Date(now.getTime() - 7 * 86400000).toISOString();
  const iso30d = new Date(now.getTime() - 30 * 86400000).toISOString();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 10);

  const { data: leadStats, isLoading: loadingLeads } = useQuery({
    queryKey: ["admin-leads-kpi"],
    queryFn: async () => {
      const [c7, c30] = await Promise.all([
        db.from("leads").select("*", { count: "exact", head: true }).gte("created_at", iso7d),
        db.from("leads").select("*", { count: "exact", head: true }).gte("created_at", iso30d),
      ]);
      return { last7: c7.count ?? 0, last30: c30.count ?? 0 };
    },
    refetchInterval: 60000,
  });

  const { data: dealStats, isLoading: loadingDeals } = useQuery({
    queryKey: ["admin-open-deals-kpi"],
    queryFn: async () => {
      const { data } = await db.from("crm_deals").select("value").is("closed_at", null);
      const rows = data ?? [];
      return { count: rows.length, value: rows.reduce((s: number, d: any) => s + Number(d.value ?? 0), 0) };
    },
    refetchInterval: 60000,
  });

  const { data: taskStats, isLoading: loadingTasks } = useQuery({
    queryKey: ["admin-tasks-kpi"],
    queryFn: async () => {
      const { data } = await db.from("crm_tasks").select("due_at").neq("status", "done");
      const rows = data ?? [];
      const dueToday = rows.filter((t: any) => t.due_at && t.due_at >= todayStart && t.due_at < todayEnd).length;
      const overdue = rows.filter((t: any) => t.due_at && t.due_at < todayStart).length;
      return { dueToday, overdue };
    },
    refetchInterval: 60000,
  });

  const { data: unreadWhatsapp, isLoading: loadingWa } = useQuery({
    queryKey: ["admin-whatsapp-kpi"],
    queryFn: async () => {
      const { data } = await db.from("whatsapp_conversations").select("unread_count");
      return (data ?? []).reduce((s: number, c: any) => s + Number(c.unread_count ?? 0), 0);
    },
    refetchInterval: 60000,
  });

  const { data: emailsSent30d, isLoading: loadingEmails } = useQuery({
    queryKey: ["admin-emails-kpi"],
    queryFn: async () => {
      const { count } = await db.from("email_send_log").select("*", { count: "exact", head: true }).gte("created_at", iso30d);
      return count ?? 0;
    },
    refetchInterval: 60000,
  });

  const { data: audits30d, isLoading: loadingAudits } = useQuery({
    queryKey: ["admin-audits-kpi"],
    queryFn: async () => {
      const { count } = await db.from("audits").select("*", { count: "exact", head: true }).gte("created_at", iso30d);
      return count ?? 0;
    },
    refetchInterval: 60000,
  });

  const { data: bookingsUpcoming, isLoading: loadingBookings } = useQuery({
    queryKey: ["admin-bookings-kpi"],
    queryFn: async () => {
      const { count } = await db.from("strategy_call_bookings").select("*", { count: "exact", head: true }).gte("preferred_date", todayDate);
      return count ?? 0;
    },
    refetchInterval: 60000,
  });

  const { data: recentLeads, isLoading: loadingRecent } = useQuery({
    queryKey: ["admin-recent-leads"],
    queryFn: async () => {
      const { data } = await db
        .from("leads")
        .select("id, name, email, company, service, created_at")
        .not("email", "is", null)
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
    refetchInterval: 60000,
  });

  const { data: topPages, isLoading: loadingTopPages } = useQuery({
    queryKey: ["admin-top-lead-pages"],
    queryFn: async () => {
      const { data } = await db.from("leads").select("first_touch").gte("created_at", iso30d);
      const counts: Record<string, number> = {};
      (data ?? []).forEach((l: any) => {
        const ft = l.first_touch;
        const page = ft?.landing_page || ft?.page || ft?.path;
        if (page) counts[page] = (counts[page] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([page, count]) => ({ page, count }));
    },
    refetchInterval: 60000,
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          label="New Leads"
          value={leadStats?.last7 ?? 0}
          sub={`${leadStats?.last30 ?? 0} in 30 days`}
          to="/dashboard/admin/leads"
          loading={loadingLeads}
        />
        <KPICard
          icon={Kanban}
          label="Open Deals"
          value={dealStats?.count ?? 0}
          sub={formatCurrency(dealStats?.value ?? 0)}
          to="/dashboard/admin/crm"
          loading={loadingDeals}
        />
        <KPICard
          icon={CheckSquare}
          label="Tasks Due Today"
          value={taskStats?.dueToday ?? 0}
          sub={`${taskStats?.overdue ?? 0} overdue`}
          to="/dashboard/admin/tasks"
          loading={loadingTasks}
        />
        <KPICard
          icon={MessageCircle}
          label="Unread WhatsApp"
          value={unreadWhatsapp ?? 0}
          to="/dashboard/admin/whatsapp"
          loading={loadingWa}
        />
        <KPICard
          icon={Mail}
          label="Emails Sent (30d)"
          value={emailsSent30d ?? 0}
          to="/dashboard/admin/email-log"
          loading={loadingEmails}
        />
        <KPICard
          icon={FileSearch}
          label="Audits (30d)"
          value={audits30d ?? 0}
          to="/dashboard/admin/audits"
          loading={loadingAudits}
        />
        <KPICard
          icon={CalendarDays}
          label="Upcoming Bookings"
          value={bookingsUpcoming ?? 0}
          to="/dashboard/admin/bookings"
          loading={loadingBookings}
        />
      </div>

      {/* Live Bloomberg-style activity ticker */}
      <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
        <LiveActivityTicker />
      </Suspense>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Recent Leads</h3>
          {loadingRecent ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
            </div>
          ) : (recentLeads ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="divide-y divide-border/10">
              {(recentLeads ?? []).map((l: any) => (
                <Link
                  key={l.id}
                  to={`/dashboard/admin/contacts/${encodeURIComponent(l.email)}`}
                  className="flex items-center justify-between py-2.5 hover:bg-muted/20 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">{l.name || l.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{l.company || l.email} {l.service ? `· ${l.service}` : ""}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-3">
                    {new Date(l.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top lead pages */}
        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Top Lead Pages (30d)</h3>
          {loadingTopPages ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 rounded-lg" />)}
            </div>
          ) : (topPages ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No landing page data captured yet.</p>
          ) : (
            <div className="space-y-2">
              {(topPages ?? []).map((p) => (
                <div key={p.page} className="flex items-center justify-between text-sm">
                  <span className="text-foreground truncate max-w-[70%]" title={p.page}>{p.page}</span>
                  <span className="text-muted-foreground font-mono text-xs">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
