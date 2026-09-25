import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const db = supabase as any;
const VIEWS = ["overdue", "today", "upcoming", "done"] as const;

export default function Tasks() {
  const qc = useQueryClient();
  const [view, setView] = useState<(typeof VIEWS)[number]>("today");
  const [form, setForm] = useState({ title: "", email: "", due: "", priority: "medium" });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["crm-tasks"],
    queryFn: async () => (await db.from("crm_tasks").select("*").order("due_at", { ascending: true, nullsFirst: false }).limit(1000)).data ?? [],
  });

  const now = new Date(); const endToday = new Date(); endToday.setHours(23, 59, 59, 999);
  const bucket = (t: any) => {
    if (t.status === "done") return "done";
    if (!t.due_at) return "upcoming";
    const d = new Date(t.due_at);
    if (d < now) return "overdue";
    if (d <= endToday) return "today";
    return "upcoming";
  };
  const list = tasks.filter((t: any) => bucket(t) === view);

  const add = async () => {
    if (!form.title.trim()) return;
    const { error } = await db.from("crm_tasks").insert({
      title: form.title.trim().slice(0, 200), priority: form.priority,
      contact_email: form.email.trim().toLowerCase() || null,
      due_at: form.due ? new Date(form.due).toISOString() : null,
    });
    if (error) return toast.error(error.message);
    setForm({ title: "", email: "", due: "", priority: "medium" });
    qc.invalidateQueries({ queryKey: ["crm-tasks"] });
  };
  const toggle = async (t: any) => {
    const done = t.status !== "done";
    await db.from("crm_tasks").update({ status: done ? "done" : "open", completed_at: done ? new Date().toISOString() : null }).eq("id", t.id);
    qc.invalidateQueries({ queryKey: ["crm-tasks"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Tasks & follow-ups</h1>
        <p className="text-sm text-muted-foreground">Call-backs, proposals and reminders for your leads and clients.</p>
      </div>
      <div className="rounded-xl border border-border/30 bg-card p-4 grid gap-2 md:grid-cols-[2fr_1.5fr_1fr_auto_auto]">
        <Input placeholder="Task" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Contact email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input type="datetime-local" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
        <select aria-label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-md border border-input bg-background px-3 text-sm">
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <Button onClick={add} disabled={!form.title.trim()}>Add</Button>
      </div>
      <div className="flex gap-1">
        {VIEWS.map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${view === v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
            {v} ({tasks.filter((t: any) => bucket(t) === v).length})
          </button>
        ))}
      </div>
      <ul className="rounded-xl border border-border/30 bg-card divide-y divide-border/20">
        {isLoading && <li className="p-6 text-center text-muted-foreground text-sm">Loading…</li>}
        {!isLoading && list.length === 0 && <li className="p-8 text-center text-muted-foreground text-sm">Nothing here</li>}
        {list.map((t: any) => (
          <li key={t.id} className="p-3 flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={t.status === "done"} onChange={() => toggle(t)} aria-label={`Mark ${t.title} done`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${t.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</p>
              <p className="text-xs text-muted-foreground">
                {t.due_at ? new Date(t.due_at).toLocaleString() : "No due date"} · <span className="capitalize">{t.priority}</span>
                {t.contact_email && <> · <Link className="hover:text-primary" to={`/dashboard/admin/contacts/${encodeURIComponent(t.contact_email)}`}>{t.contact_email}</Link></>}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
