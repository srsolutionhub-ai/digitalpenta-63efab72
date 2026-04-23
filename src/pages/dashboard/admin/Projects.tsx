import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderKanban, Plus, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const TASK_COLS = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "In Review" },
  { key: "done", label: "Done" },
];

const PRIORITY: Record<string, any> = { low: "default", medium: "info", high: "warning", urgent: "danger" };

export default function Projects() {
  const qc = useQueryClient();
  const [showProject, setShowProject] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showTask, setShowTask] = useState(false);
  const [pForm, setPForm] = useState({ name: "", service_line: "", description: "", status: "planning", budget: 0 });
  const [tForm, setTForm] = useState<any>({ title: "", description: "", priority: "medium", status: "todo", estimate_hours: 0 });
  const [drag, setDrag] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects-all"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", activeProject],
    queryFn: async () => {
      if (!activeProject) return [];
      const { data } = await supabase.from("tasks").select("*").eq("project_id", activeProject).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!activeProject,
  });

  const createProject = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert(pForm);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects-all"] });
      toast.success("Project created");
      setShowProject(false);
      setPForm({ name: "", service_line: "", description: "", status: "planning", budget: 0 });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const createTask = useMutation({
    mutationFn: async () => {
      if (!activeProject) return;
      const { error } = await supabase.from("tasks").insert({ ...tForm, project_id: activeProject, estimate_hours: Number(tForm.estimate_hours) });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", activeProject] });
      toast.success("Task added");
      setShowTask(false);
      setTForm({ title: "", description: "", priority: "medium", status: "todo", estimate_hours: 0 });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const moveTask = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("tasks").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", activeProject] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects & Tasks"
        description="Hub-and-spoke delivery board. Drag tasks across columns to update status."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Projects" }]}
        actions={<Button size="sm" onClick={() => setShowProject(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> New Project</Button>}
      />

      <Tabs value={activeProject || "list"} onValueChange={(v) => setActiveProject(v === "list" ? null : v)}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="list">All Projects</TabsTrigger>
          {projects.slice(0, 5).map((p: any) => (
            <TabsTrigger key={p.id} value={p.id}>{p.name}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="list" className="mt-4">
          {projects.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No projects yet" description="Spin up your first delivery board." action={<Button size="sm" onClick={() => setShowProject(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> Create Project</Button>} />
          ) : (
            <DataTable
              rowKey={(r: any) => r.id}
              rows={projects}
              onRowClick={(r: any) => setActiveProject(r.id)}
              columns={[
                { key: "name", header: "Project" },
                { key: "service_line", header: "Service" },
                { key: "status", header: "Status", render: (r: any) => <StatusPill variant="info">{r.status}</StatusPill> },
                { key: "budget", header: "Budget", render: (r: any) => r.budget ? `₹${Number(r.budget).toLocaleString()}` : "—" },
                { key: "start_date", header: "Start", render: (r: any) => r.start_date || "—" },
              ]}
            />
          )}
        </TabsContent>

        {projects.map((p: any) => (
          <TabsContent key={p.id} value={p.id} className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-lg">{p.name}</h2>
                <p className="text-xs text-muted-foreground">{p.service_line || "—"} · {p.status}</p>
              </div>
              <Button size="sm" onClick={() => setShowTask(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Task</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {TASK_COLS.map((col) => (
                <div
                  key={col.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (drag) { moveTask.mutate({ id: drag, status: col.key }); setDrag(null); } }}
                  className="rounded-xl bg-card/40 border border-border/20 p-2 min-h-[400px]"
                >
                  <div className="px-2 py-1.5 mb-2 flex items-center justify-between">
                    <p className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground">{col.label}</p>
                    <span className="text-[10px] text-muted-foreground">{tasks.filter((t: any) => t.status === col.key).length}</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter((t: any) => t.status === col.key).map((t: any) => (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={() => setDrag(t.id)}
                        className="rounded-lg bg-card border border-border/30 p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground mb-1.5">{t.title}</p>
                        <div className="flex items-center justify-between">
                          <StatusPill variant={PRIORITY[t.priority]}>{t.priority}</StatusPill>
                          {t.estimate_hours > 0 && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {t.estimate_hours}h</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showProject} onOpenChange={setShowProject}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">New Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Project Name</Label><Input value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} /></div>
            <div><Label>Service Line</Label><Input value={pForm.service_line} onChange={(e) => setPForm({ ...pForm, service_line: e.target.value })} placeholder="SEO, PPC, Web…" /></div>
            <div><Label>Description</Label><Textarea rows={2} value={pForm.description} onChange={(e) => setPForm({ ...pForm, description: e.target.value })} /></div>
            <div><Label>Budget (₹)</Label><Input type="number" value={pForm.budget} onChange={(e) => setPForm({ ...pForm, budget: Number(e.target.value) })} /></div>
            <Button className="w-full" onClick={() => createProject.mutate()} disabled={!pForm.name}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTask} onOpenChange={setShowTask}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">New Task</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={tForm.title} onChange={(e) => setTForm({ ...tForm, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={2} value={tForm.description} onChange={(e) => setTForm({ ...tForm, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Priority</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={tForm.priority} onChange={(e) => setTForm({ ...tForm, priority: e.target.value })}>
                  {["low", "medium", "high", "urgent"].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div><Label>Estimate (hrs)</Label><Input type="number" value={tForm.estimate_hours} onChange={(e) => setTForm({ ...tForm, estimate_hours: e.target.value })} /></div>
            </div>
            <Button className="w-full" onClick={() => createTask.mutate()} disabled={!tForm.title}>Add Task</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
