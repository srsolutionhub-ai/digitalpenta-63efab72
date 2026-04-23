// Time tracking & weekly workload report. Engineers log minutes per task,
// admins see team-wide hours by week.
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["hsl(256,90%,62%)", "hsl(162,100%,44%)", "hsl(18,100%,60%)", "hsl(45,100%,50%)", "hsl(210,100%,50%)"];

export default function TimeTracking() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState<any>({ task_id: "", duration_minutes: 30, notes: "", billable: true, entry_date: new Date().toISOString().slice(0, 10) });

  const { data: tasks = [] } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("id, title, project_id, projects(name)").order("created_at", { ascending: false }).limit(200);
      return data ?? [];
    },
  });

  const { data: entries = [] } = useQuery({
    queryKey: ["time-entries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("time_entries")
        .select("id, task_id, user_id, duration_minutes, billable, entry_date, notes, created_at, tasks(title, project_id, projects(name))")
        .order("entry_date", { ascending: false })
        .limit(500);
      return data ?? [];
    },
  });

  const { data: workload = [] } = useQuery({
    queryKey: ["team-workload"],
    queryFn: async () => {
      const { data } = await supabase
        .from("team_workload_weekly" as any)
        .select("*")
        .order("week_start", { ascending: false })
        .limit(60);
      return (data as any[]) ?? [];
    },
  });

  const { data: projectBilling = [] } = useQuery({
    queryKey: ["project-billing"],
    queryFn: async () => {
      const { data } = await supabase.rpc("project_billing_summary", { p_account_id: null });
      return data ?? [];
    },
  });

  const log = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!form.task_id) throw new Error("Pick a task");
      const { error } = await supabase.from("time_entries").insert({
        task_id: form.task_id,
        user_id: user.id,
        duration_minutes: Number(form.duration_minutes),
        billable: form.billable,
        notes: form.notes || null,
        entry_date: form.entry_date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["time-entries"] });
      qc.invalidateQueries({ queryKey: ["team-workload"] });
      qc.invalidateQueries({ queryKey: ["project-billing"] });
      toast.success("Time logged");
      setShowLog(false);
      setForm({ task_id: "", duration_minutes: 30, notes: "", billable: true, entry_date: new Date().toISOString().slice(0, 10) });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Aggregate workload by week for chart
  const weeklyTotals = workload.reduce((acc: Record<string, number>, w: any) => {
    const k = w.week_start;
    acc[k] = (acc[k] || 0) + Number(w.total_hours || 0);
    return acc;
  }, {});
  const chartData = Object.entries(weeklyTotals)
    .map(([week, hours]) => ({ week: new Date(week).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), hours: Number(hours) }))
    .reverse()
    .slice(-8);

  const totalThisWeek = workload
    .filter((w: any) => {
      const start = new Date(w.week_start);
      const now = new Date();
      const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < 7;
    })
    .reduce((s: number, w: any) => s + Number(w.total_hours || 0), 0);

  const billingExportRows = (projectBilling as any[]).map((p) => ({
    project: p.project_name,
    estimated_hours: Number(p.estimated_hours).toFixed(1),
    logged_hours: Number(p.logged_hours).toFixed(1),
    billable_hours: Number(p.billable_hours).toFixed(1),
    budget_inr: p.budget ? Number(p.budget).toLocaleString() : "—",
    utilization_pct: p.estimated_hours > 0 ? `${Math.round((Number(p.logged_hours) / Number(p.estimated_hours)) * 100)}%` : "—",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time & Workload"
        description="Log billable hours, monitor team capacity, and review project burn rate."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Time" }]}
        actions={
          <div className="flex gap-2">
            <ExportMenu
              filename={`project-billing-${new Date().toISOString().slice(0, 10)}`}
              title="Project Billing Report"
              rows={billingExportRows}
              subtitle={`${billingExportRows.length} active projects`}
            />
            <Button size="sm" onClick={() => setShowLog(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Log time
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="This week" value={`${totalThisWeek.toFixed(1)}h`} />
        <Stat label="Active projects" value={String((projectBilling as any[]).length)} />
        <Stat label="Logged entries" value={String(entries.length)} />
        <Stat label="Tracked weeks" value={String(Object.keys(weeklyTotals).length)} />
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries"><Clock className="w-3.5 h-3.5 mr-1.5" /> My entries</TabsTrigger>
          <TabsTrigger value="workload"><BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Team workload</TabsTrigger>
          <TabsTrigger value="billing">Project billing</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-4">
          {entries.length === 0 ? (
            <EmptyState icon={Clock} title="No entries yet" description="Track your first hour to feed reports." action={<Button size="sm" onClick={() => setShowLog(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> Log time</Button>} />
          ) : (
            <DataTable
              rowKey={(r: any) => r.id}
              rows={entries}
              columns={[
                { key: "entry_date", header: "Date" },
                { key: "task", header: "Task", render: (r: any) => r.tasks?.title || "—" },
                { key: "project", header: "Project", render: (r: any) => r.tasks?.projects?.name || "—" },
                { key: "duration", header: "Hours", render: (r: any) => `${(r.duration_minutes / 60).toFixed(2)}h` },
                { key: "billable", header: "Billable", render: (r: any) => r.billable ? "✓" : "—" },
                { key: "notes", header: "Notes", render: (r: any) => <span className="text-xs text-muted-foreground line-clamp-1">{r.notes || "—"}</span> },
              ]}
            />
          )}
        </TabsContent>

        <TabsContent value="workload" className="mt-4 space-y-4">
          <div className="card-surface rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm mb-4">Hours per week (team total)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(220,15%,55%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220,15%,55%)" }} />
                <Tooltip contentStyle={{ background: "hsl(240,12%,8%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {workload.length === 0 ? (
            <EmptyState icon={BarChart3} title="No workload yet" description="Once team members log time, weekly summaries appear here." />
          ) : (
            <DataTable
              rowKey={(r: any) => `${r.user_id}-${r.week_start}`}
              rows={workload}
              columns={[
                { key: "week_start", header: "Week of" },
                { key: "user_id", header: "User", render: (r: any) => <span className="font-mono text-[11px]">{String(r.user_id).slice(0, 8)}…</span> },
                { key: "total_hours", header: "Total", render: (r: any) => `${Number(r.total_hours).toFixed(1)}h` },
                { key: "billable_hours", header: "Billable", render: (r: any) => `${Number(r.billable_hours).toFixed(1)}h` },
                { key: "tasks_worked", header: "Tasks" },
              ]}
            />
          )}
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          {projectBilling.length === 0 ? (
            <EmptyState icon={BarChart3} title="No project billing yet" description="Create projects, log time on tasks, and reports appear here." />
          ) : (
            <DataTable
              rowKey={(r: any) => r.project_id}
              rows={projectBilling}
              columns={[
                { key: "project_name", header: "Project" },
                { key: "estimated_hours", header: "Estimated", render: (r: any) => `${Number(r.estimated_hours).toFixed(1)}h` },
                { key: "logged_hours", header: "Logged", render: (r: any) => `${Number(r.logged_hours).toFixed(1)}h` },
                { key: "billable_hours", header: "Billable", render: (r: any) => `${Number(r.billable_hours).toFixed(1)}h` },
                { key: "budget", header: "Budget", render: (r: any) => r.budget ? `₹${Number(r.budget).toLocaleString()}` : "—" },
                {
                  key: "utilization", header: "Utilization", render: (r: any) => {
                    if (!r.estimated_hours || Number(r.estimated_hours) === 0) return "—";
                    const pct = (Number(r.logged_hours) / Number(r.estimated_hours)) * 100;
                    return <span className={pct > 100 ? "text-amber-400" : "text-foreground"}>{pct.toFixed(0)}%</span>;
                  },
                },
              ]}
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showLog} onOpenChange={setShowLog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">Log time</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Task</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.task_id} onChange={(e) => setForm({ ...form, task_id: e.target.value })}>
                <option value="">Select task…</option>
                {tasks.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.projects?.name ? `${t.projects.name} · ` : ""}{t.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Duration (min)</Label>
                <Input type="number" min={1} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Date</Label>
                <Input type="date" value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/20">
              <Label className="text-xs">Billable</Label>
              <Switch checked={form.billable} onCheckedChange={(v) => setForm({ ...form, billable: v })} />
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button className="w-full" onClick={() => log.mutate()} disabled={log.isPending || !form.task_id}>Log entry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-2xl text-foreground mt-1">{value}</p>
    </div>
  );
}
