import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, BarChart3, Plus, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-green-500/15 text-green-400",
  changes_requested: "bg-red-500/15 text-red-400",
};

type MetricRow = { key: string; value: string };

export default function ClientDeliverables() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [accountId, setAccountId] = useState<string>("");

  const [approvalForm, setApprovalForm] = useState({ title: "", description: "", file_url: "", project_id: "" });
  const [reportForm, setReportForm] = useState({ period_month: "", title: "", summary: "", file_url: "", published: false });
  const [metricRows, setMetricRows] = useState<MetricRow[]>([{ key: "", value: "" }]);

  const { data: accounts = [] } = useQuery({
    queryKey: ["deliverables-accounts"],
    queryFn: async () => {
      const { data, error } = await db.from("accounts").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["deliverables-projects", accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const { data } = await db.from("projects").select("id,name").eq("account_id", accountId);
      return data ?? [];
    },
    enabled: !!accountId,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ["deliverables-approvals", accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const { data, error } = await db.from("client_approvals").select("*, projects(name)").eq("account_id", accountId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!accountId,
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["deliverables-reports", accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const { data, error } = await db.from("client_reports").select("*").eq("account_id", accountId).order("period_month", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!accountId,
  });

  const createApproval = useMutation({
    mutationFn: async () => {
      if (!accountId || !approvalForm.title.trim()) return;
      const { error } = await db.from("client_approvals").insert({
        account_id: accountId,
        title: approvalForm.title.trim(),
        description: approvalForm.description || null,
        file_url: approvalForm.file_url || null,
        project_id: approvalForm.project_id || null,
        created_by: user?.id ?? null,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Approval request created");
      setApprovalForm({ title: "", description: "", file_url: "", project_id: "" });
      qc.invalidateQueries({ queryKey: ["deliverables-approvals", accountId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const createReport = useMutation({
    mutationFn: async () => {
      if (!accountId || !reportForm.title.trim() || !reportForm.period_month) return;
      const metrics = metricRows.reduce((acc: Record<string, string>, r) => {
        if (r.key.trim()) acc[r.key.trim()] = r.value;
        return acc;
      }, {});
      const { error } = await db.from("client_reports").insert({
        account_id: accountId,
        period_month: reportForm.period_month,
        title: reportForm.title.trim(),
        summary: reportForm.summary || null,
        file_url: reportForm.file_url || null,
        metrics,
        published: reportForm.published,
        created_by: user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Report saved");
      setReportForm({ period_month: "", title: "", summary: "", file_url: "", published: false });
      setMetricRows([{ key: "", value: "" }]);
      qc.invalidateQueries({ queryKey: ["deliverables-reports", accountId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await db.from("client_reports").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deliverables-reports", accountId] }),
  });

  const accountOptions = useMemo(() => accounts, [accounts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Deliverables"
        description="Create approval requests and publish monthly reports for a client account."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Deliverables" }]}
      />

      <div className="card-surface rounded-2xl p-4 space-y-2 max-w-md">
        <Label>Account</Label>
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger><SelectValue placeholder="Select a client account" /></SelectTrigger>
          <SelectContent>
            {accountOptions.map((a: any) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!accountId ? (
        <EmptyState icon={Building2} title="Pick an account" description="Select a client account above to manage its approvals and reports." />
      ) : (
        <Tabs defaultValue="approvals">
          <TabsList>
            <TabsTrigger value="approvals"><ClipboardCheck className="w-3.5 h-3.5 mr-1.5" /> Approvals</TabsTrigger>
            <TabsTrigger value="reports"><BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="mt-4 space-y-6">
            <div className="card-surface rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-semibold text-foreground text-sm">New Approval Request</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Title</Label>
                  <Input value={approvalForm.title} onChange={(e) => setApprovalForm({ ...approvalForm, title: e.target.value })} placeholder="e.g. Homepage redesign draft" />
                </div>
                <div>
                  <Label>Project (optional)</Label>
                  <Select value={approvalForm.project_id} onValueChange={(v) => setApprovalForm({ ...approvalForm, project_id: v })}>
                    <SelectTrigger><SelectValue placeholder="No project" /></SelectTrigger>
                    <SelectContent>
                      {projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea rows={2} value={approvalForm.description} onChange={(e) => setApprovalForm({ ...approvalForm, description: e.target.value })} />
              </div>
              <div>
                <Label>File URL (optional)</Label>
                <Input value={approvalForm.file_url} onChange={(e) => setApprovalForm({ ...approvalForm, file_url: e.target.value })} placeholder="https://…" />
              </div>
              <Button size="sm" onClick={() => createApproval.mutate()} disabled={!approvalForm.title.trim() || createApproval.isPending}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Approval Request
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Existing Approvals</h3>
              {approvals.length === 0 ? (
                <EmptyState icon={ClipboardCheck} title="No approvals yet" description="Requests you create will appear here with the client's decision." />
              ) : (
                approvals.map((a: any) => (
                  <div key={a.id} className="card-surface rounded-xl p-4 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <p className="font-display font-medium text-sm text-foreground">{a.title}{a.projects?.name ? ` · ${a.projects.name}` : ""}</p>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize self-start ${STATUS_STYLE[a.status]}`}>{a.status.replace("_", " ")}</span>
                    </div>
                    {a.client_comment && <p className="text-xs text-muted-foreground">Client comment: "{a.client_comment}"</p>}
                    {a.decided_at && <p className="text-[11px] text-muted-foreground">Decided {new Date(a.decided_at).toLocaleDateString()}</p>}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-4 space-y-6">
            <div className="card-surface rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-semibold text-foreground text-sm">New Report</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Period Month</Label>
                  <Input type="month" value={reportForm.period_month} onChange={(e) => setReportForm({ ...reportForm, period_month: e.target.value ? `${e.target.value}-01` : "" })} />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={reportForm.title} onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })} placeholder="e.g. March Performance Report" />
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea rows={2} value={reportForm.summary} onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })} />
              </div>
              <div>
                <Label>File URL (optional)</Label>
                <Input value={reportForm.file_url} onChange={(e) => setReportForm({ ...reportForm, file_url: e.target.value })} placeholder="https://…" />
              </div>

              <div className="space-y-2">
                <Label>Metrics</Label>
                {metricRows.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="Metric name" value={row.key} onChange={(e) => setMetricRows((rows) => rows.map((r, idx) => idx === i ? { ...r, key: e.target.value } : r))} />
                    <Input placeholder="Value" value={row.value} onChange={(e) => setMetricRows((rows) => rows.map((r, idx) => idx === i ? { ...r, value: e.target.value } : r))} />
                    <Button size="icon" variant="ghost" onClick={() => setMetricRows((rows) => rows.filter((_, idx) => idx !== i))} disabled={metricRows.length === 1}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setMetricRows((rows) => [...rows, { key: "", value: "" }])}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Metric
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={reportForm.published} onCheckedChange={(v) => setReportForm({ ...reportForm, published: v })} />
                <Label className="cursor-pointer">Publish immediately</Label>
              </div>

              <Button size="sm" onClick={() => createReport.mutate()} disabled={!reportForm.title.trim() || !reportForm.period_month || createReport.isPending}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Save Report
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Existing Reports</h3>
              {reports.length === 0 ? (
                <EmptyState icon={BarChart3} title="No reports yet" description="Reports you create will appear here." />
              ) : (
                reports.map((r: any) => (
                  <div key={r.id} className="card-surface rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-display font-medium text-sm text-foreground">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(r.period_month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{r.published ? "Published" : "Draft"}</span>
                      <Switch checked={r.published} onCheckedChange={(v) => togglePublished.mutate({ id: r.id, published: v })} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
