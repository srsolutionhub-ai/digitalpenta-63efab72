import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileSearch, Sparkles, CalendarDays, Mail, MessageSquare, StickyNote, UserPlus, CheckSquare } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;
type Item = { at: string; kind: string; title: string; detail?: string; icon: any; link?: string };

export default function ContactDetail() {
  const { email: raw = "" } = useParams();
  const email = decodeURIComponent(raw).toLowerCase();
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [task, setTask] = useState({ title: "", due: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["crm-contact", email],
    queryFn: async () => {
      const [leads, audits, tools, bookings, emails, notes, tasks, deals] = await Promise.all([
        db.from("leads").select("*").ilike("email", email).order("created_at", { ascending: false }),
        db.from("audits").select("id,url,overall_score,status,created_at,visitor_name,visitor_phone,visitor_company").ilike("visitor_email", email),
        db.from("tool_runs").select("id,tool_slug,status,created_at").ilike("email", email),
        db.from("strategy_call_bookings").select("*").ilike("email", email),
        db.from("email_send_log").select("id,template,subject,status,created_at").ilike("to_email", email),
        db.from("crm_notes").select("*").ilike("contact_email", email),
        db.from("crm_tasks").select("*").ilike("contact_email", email).order("due_at", { ascending: true }),
        db.from("crm_deals").select("id,title,value,currency,created_at,closed_at"),
      ]);
      const lead = leads.data?.[0];
      const items: Item[] = [];
      (leads.data ?? []).forEach((l: any) => items.push({ at: l.created_at, kind: "lead", icon: UserPlus, title: `Enquiry: ${l.service ?? "general"}`, detail: [l.notes, l.source && `Source: ${l.source}`, l.utm_campaign && `Campaign: ${l.utm_campaign}`].filter(Boolean).join(" · ") }));
      (audits.data ?? []).forEach((a: any) => items.push({ at: a.created_at, kind: "audit", icon: FileSearch, title: `SEO audit of ${a.url}`, detail: a.overall_score != null ? `Score ${a.overall_score}` : a.status, link: `/dashboard/admin/audits/${a.id}` }));
      (tools.data ?? []).forEach((t: any) => items.push({ at: t.created_at, kind: "tool", icon: Sparkles, title: `Used AI tool: ${t.tool_slug}`, detail: t.status }));
      (bookings.data ?? []).forEach((b: any) => items.push({ at: b.created_at, kind: "booking", icon: CalendarDays, title: `Booked a call for ${b.preferred_date} (${b.preferred_slot})`, detail: b.status }));
      (emails.data ?? []).forEach((e: any) => items.push({ at: e.created_at, kind: "email", icon: Mail, title: `Email: ${e.subject ?? e.template}`, detail: e.status }));
      (notes.data ?? []).forEach((n: any) => items.push({ at: n.created_at, kind: "note", icon: StickyNote, title: "Note", detail: n.body }));
      items.sort((a, b) => b.at.localeCompare(a.at));
      const a0 = audits.data?.[0];
      return {
        profile: { name: lead?.name ?? a0?.visitor_name, company: lead?.company ?? a0?.visitor_company, phone: lead?.phone ?? a0?.visitor_phone, website: lead?.website, score: lead?.lead_score, status: lead?.status, summary: lead?.ai_summary, firstTouch: lead?.first_touch, utm: lead?.utm },
        items, tasks: tasks.data ?? [], phone: lead?.phone ?? a0?.visitor_phone,
      };
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["crm-contact", email] });

  const addNote = async () => {
    if (!note.trim()) return;
    const { error } = await db.from("crm_notes").insert({ contact_email: email, body: note.trim().slice(0, 4000) });
    if (error) return toast.error(error.message);
    setNote(""); refresh();
  };
  const addTask = async () => {
    if (!task.title.trim()) return;
    const { error } = await db.from("crm_tasks").insert({ title: task.title.trim().slice(0, 200), contact_email: email, due_at: task.due ? new Date(task.due).toISOString() : null });
    if (error) return toast.error(error.message);
    setTask({ title: "", due: "" }); refresh();
  };
  const toggleTask = async (t: any) => {
    const done = t.status !== "done";
    await db.from("crm_tasks").update({ status: done ? "done" : "open", completed_at: done ? new Date().toISOString() : null }).eq("id", t.id);
    refresh();
  };

  const p = data?.profile;
  return (
    <div className="space-y-6">
      <Link to="/dashboard/admin/contacts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Contacts</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground break-all">{p?.name || email}</h1>
          <p className="text-sm text-muted-foreground break-all">{email}{p?.phone ? ` · ${p.phone}` : ""}{p?.company ? ` · ${p.company}` : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><a href={`mailto:${email}`}><Mail className="w-4 h-4 mr-1" />Email</a></Button>
          {data?.phone && <Button asChild variant="outline" size="sm"><Link to={`/dashboard/admin/whatsapp?phone=${encodeURIComponent(data.phone)}`}><MessageSquare className="w-4 h-4 mr-1" />WhatsApp</Link></Button>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border/30 bg-card p-4 space-y-2">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about this contact…" rows={2} />
            <Button size="sm" onClick={addNote} disabled={!note.trim()}>Save note</Button>
          </div>
          <div className="rounded-xl border border-border/30 bg-card p-4">
            <h2 className="font-semibold text-foreground mb-3">Activity timeline</h2>
            {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!isLoading && !data?.items.length && <p className="text-sm text-muted-foreground">No activity yet</p>}
            <ol className="space-y-4">
              {data?.items.map((i, idx) => (
                <li key={idx} className="flex gap-3">
                  <i.icon className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{i.link ? <Link to={i.link} className="hover:text-primary">{i.title}</Link> : i.title}</p>
                    {i.detail && <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">{i.detail}</p>}
                    <p className="text-[11px] text-muted-foreground/70">{new Date(i.at).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/30 bg-card p-4 text-sm space-y-2">
            <h2 className="font-semibold text-foreground">Profile</h2>
            <Row k="Lead score" v={p?.score} /><Row k="Status" v={p?.status} /><Row k="Website" v={p?.website} />
            <Row k="First source" v={p?.firstTouch?.source ?? p?.utm?.utm_source} />
            <Row k="First page" v={p?.firstTouch?.landing_page ?? p?.firstTouch?.page} />
            {p?.summary && <p className="text-xs text-muted-foreground pt-2 border-t border-border/20">{p.summary}</p>}
          </div>
          <div className="rounded-xl border border-border/30 bg-card p-4 space-y-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><CheckSquare className="w-4 h-4" />Tasks</h2>
            <Input value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} placeholder="e.g. Call back with pricing" />
            <Input type="datetime-local" value={task.due} onChange={(e) => setTask({ ...task, due: e.target.value })} />
            <Button size="sm" onClick={addTask} disabled={!task.title.trim()}>Add task</Button>
            <ul className="space-y-2">
              {data?.tasks.map((t: any) => (
                <li key={t.id} className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={t.status === "done"} onChange={() => toggleTask(t)} className="mt-1" aria-label={`Mark ${t.title} done`} />
                  <span className={t.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}>
                    {t.title}{t.due_at && <span className="block text-xs text-muted-foreground">{new Date(t.due_at).toLocaleString()}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: any }) {
  return <div className="flex justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="text-foreground text-right break-all">{v ?? "—"}</span></div>;
}
