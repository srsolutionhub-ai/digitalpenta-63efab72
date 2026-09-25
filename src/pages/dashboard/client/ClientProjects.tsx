import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, CheckCircle2, Circle, Building2 } from "lucide-react";

const db = supabase as any;

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-blue-500/15 text-blue-400",
  active: "bg-primary/15 text-primary",
  on_hold: "bg-amber-500/15 text-amber-400",
  completed: "bg-green-500/15 text-green-400",
};

export default function ClientProjects() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["client-projects", user?.id],
    queryFn: async () => {
      if (!user) return { linked: false, projects: [] as any[] };
      const { data: memberships } = await db
        .from("account_team_members")
        .select("account_id")
        .eq("user_id", user.id);
      const accountIds = (memberships ?? []).map((m: any) => m.account_id);
      if (accountIds.length === 0) return { linked: false, projects: [] };

      const { data: projects, error } = await db
        .from("projects")
        .select("*")
        .in("account_id", accountIds)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const projectIds = (projects ?? []).map((p: any) => p.id);
      let tasksByProject: Record<string, any[]> = {};
      if (projectIds.length > 0) {
        const { data: tasks } = await db.from("tasks").select("*").in("project_id", projectIds);
        tasksByProject = (tasks ?? []).reduce((acc: Record<string, any[]>, t: any) => {
          (acc[t.project_id] = acc[t.project_id] || []).push(t);
          return acc;
        }, {});
      }

      const enriched = (projects ?? []).map((p: any) => {
        const tasks = tasksByProject[p.id] ?? [];
        const done = tasks.filter((t: any) => t.status === "done").length;
        return { ...p, tasks, done, total: tasks.length };
      });

      return { linked: true, projects: enriched };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!data?.linked) {
    return (
      <div className="space-y-6">
        <PageHeader title="Projects" description="Track progress on your active work." />
        <EmptyState
          icon={Building2}
          title="Not linked to a company yet"
          description="Your account isn't connected to a company workspace. Ask your account manager to add you to your team."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Track progress on your active work." />

      {data.projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Your account team will set up projects here once work kicks off." />
      ) : (
        <div className="space-y-4">
          {data.projects.map((p: any) => {
            const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
            return (
              <div key={p.id} className="card-surface rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                    {p.description && <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize self-start ${STATUS_COLORS[p.status] || "bg-muted text-muted-foreground"}`}>
                    {p.status?.replace("_", " ") || "—"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {p.start_date && <span>Start: {p.start_date}</span>}
                  {p.end_date && <span>End: {p.end_date}</span>}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{p.done}/{p.total} tasks done</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {p.tasks.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {p.tasks.slice(0, 6).map((t: any) => (
                      <div key={t.id} className="flex items-center gap-2 text-sm">
                        {t.status === "done" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={`truncate ${t.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.title}</span>
                        {t.due_date && <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{t.due_date}</span>}
                      </div>
                    ))}
                    {p.tasks.length > 6 && <p className="text-[11px] text-muted-foreground">+{p.tasks.length - 6} more tasks</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
