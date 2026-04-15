import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, DollarSign, TrendingUp, FileText, Clock, Send,
  Plus, Receipt, PenLine
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const COLORS = ["hsl(256,90%,62%)", "hsl(162,100%,44%)", "hsl(18,100%,60%)", "hsl(45,100%,50%)", "hsl(210,100%,50%)"];

function KPICard({ icon: Icon, label, value, loading }: { icon: any; label: string; value: string | number; loading: boolean }) {
  if (loading) return <Skeleton className="h-28 rounded-2xl" />;
  return (
    <div className="card-surface rounded-2xl p-5 hover-lift">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
    </div>
  );
}

export default function DashboardHome() {
  const { data: contactStats, isLoading: loadingContacts } = useQuery({
    queryKey: ["admin-contact-stats"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_contact_stats");
      return data?.[0] ?? null;
    },
    refetchInterval: 60000,
  });

  const { data: leadsData, isLoading: loadingLeads } = useQuery({
    queryKey: ["admin-leads-count"],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth);
      return count ?? 0;
    },
    refetchInterval: 60000,
  });

  const { data: invoiceStats, isLoading: loadingInvoices } = useQuery({
    queryKey: ["admin-invoice-stats"],
    queryFn: async () => {
      const { data: invoices } = await supabase.from("invoices").select("total, status, paid_at, created_at");
      if (!invoices) return { revenue: 0, openCount: 0, openTotal: 0 };

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const revenue = invoices
        .filter((i) => i.paid_at && i.paid_at >= startOfMonth)
        .reduce((s, i) => s + Number(i.total), 0);
      const open = invoices.filter((i) => i.status === "sent");
      return { revenue, openCount: open.length, openTotal: open.reduce((s, i) => s + Number(i.total), 0) };
    },
    refetchInterval: 60000,
  });

  const { data: quotationCount, isLoading: loadingQuotations } = useQuery({
    queryKey: ["admin-quotation-count"],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count } = await supabase.from("quotations").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth);
      return count ?? 0;
    },
    refetchInterval: 60000,
  });

  // Revenue trend (mock since we may not have 12 months data)
  const { data: revenueTrend } = useQuery({
    queryKey: ["admin-revenue-trend"],
    queryFn: async () => {
      const { data: invoices } = await supabase.from("invoices").select("total, status, paid_at, created_at");
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (11 - i));
        return { month: d.toLocaleString("default", { month: "short" }), invoiced: 0, collected: 0 };
      });

      invoices?.forEach((inv) => {
        const created = new Date(inv.created_at);
        const mIdx = months.findIndex((m) =>
          m.month === created.toLocaleString("default", { month: "short" })
        );
        if (mIdx >= 0) {
          months[mIdx].invoiced += Number(inv.total);
          if (inv.paid_at) months[mIdx].collected += Number(inv.total);
        }
      });

      return months;
    },
  });

  // Lead sources
  const { data: leadSources } = useQuery({
    queryKey: ["admin-lead-sources"],
    queryFn: async () => {
      const { data: contacts } = await supabase.from("contacts").select("source");
      const sourceCounts: Record<string, number> = {};
      contacts?.forEach((c) => {
        const src = c.source || "Direct";
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      });
      return Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));
    },
  });

  const formatCurrency = (v: number) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
    return `₹${v}`;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard icon={Users} label="Total Contacts" value={contactStats?.total_contacts ?? 0} loading={loadingContacts} />
        <KPICard icon={DollarSign} label="Monthly Revenue" value={formatCurrency(invoiceStats?.revenue ?? 0)} loading={loadingInvoices} />
        <KPICard icon={TrendingUp} label="New Leads (Month)" value={leadsData ?? 0} loading={loadingLeads} />
        <KPICard icon={Clock} label="This Week" value={contactStats?.this_week_contacts ?? 0} loading={loadingContacts} />
        <KPICard icon={FileText} label="Open Invoices" value={`${invoiceStats?.openCount ?? 0} (${formatCurrency(invoiceStats?.openTotal ?? 0)})`} loading={loadingInvoices} />
        <KPICard icon={Send} label="Proposals Sent" value={quotationCount ?? 0} loading={loadingQuotations} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/admin/leads">
          <Button size="sm" className="font-display"><Plus className="w-3 h-3 mr-1" /> Add Lead</Button>
        </Link>
        <Link to="/dashboard/admin/billing">
          <Button size="sm" variant="outline" className="font-display"><Receipt className="w-3 h-3 mr-1" /> Create Invoice</Button>
        </Link>
        <Link to="/dashboard/admin/blog">
          <Button size="sm" variant="outline" className="font-display"><PenLine className="w-3 h-3 mr-1" /> Write Blog Post</Button>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220,15%,55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,15%,55%)" }} />
              <Tooltip
                contentStyle={{ background: "hsl(240,12%,8%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="invoiced" stroke="hsl(256,90%,62%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="collected" stroke="hsl(162,100%,44%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources */}
        <div className="card-surface rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={leadSources ?? []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {(leadSources ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(240,12%,8%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
