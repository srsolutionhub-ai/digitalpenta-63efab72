import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

const db = supabase as any;

type Contact = {
  email: string; name: string | null; company: string | null; phone: string | null;
  sources: Set<string>; lastSeen: string; firstSeen: string; score: number | null; stage: string;
};

const STAGES = ["all", "subscriber", "lead", "qualified", "customer", "lost"] as const;

function stageFrom(status?: string | null, isSubscriber?: boolean) {
  const s = (status || "").toLowerCase();
  if (["won", "converted", "customer"].includes(s)) return "customer";
  if (["lost", "closed_lost", "spam"].includes(s)) return "lost";
  if (["qualified", "proposal", "negotiation", "contacted"].includes(s)) return "qualified";
  if (s) return "lead";
  return isSubscriber ? "subscriber" : "lead";
}

export default function Contacts() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("all");

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["crm-contacts"],
    queryFn: async () => {
      const [leads, audits, tools, bookings, subs] = await Promise.all([
        db.from("leads").select("email,name,company,phone,status,lead_score,source,created_at").not("email", "is", null).limit(1000),
        db.from("audits").select("visitor_email,visitor_name,visitor_company,visitor_phone,created_at").not("visitor_email", "is", null).limit(1000),
        db.from("tool_runs").select("email,name,company,phone,tool_slug,created_at").not("email", "is", null).limit(1000),
        db.from("strategy_call_bookings").select("email,name,company,phone,created_at").limit(1000),
        db.from("newsletter_subscribers").select("email,name,company,created_at").limit(1000),
      ]);
      const map = new Map<string, Contact>();
      const add = (email: string | null, src: string, row: any) => {
        if (!email) return;
        const key = email.trim().toLowerCase();
        const c = map.get(key) ?? { email: key, name: null, company: null, phone: null, sources: new Set(), lastSeen: row.created_at, firstSeen: row.created_at, score: null, stage: "" };
        c.name ||= row.name ?? null; c.company ||= row.company ?? null; c.phone ||= row.phone ?? null;
        c.sources.add(src);
        if (row.created_at > c.lastSeen) c.lastSeen = row.created_at;
        if (row.created_at < c.firstSeen) c.firstSeen = row.created_at;
        if (src === "Lead form") { c.score = Math.max(c.score ?? 0, row.lead_score ?? 0); c.stage = stageFrom(row.status); }
        map.set(key, c);
      };
      (leads.data ?? []).forEach((r: any) => add(r.email, "Lead form", r));
      (audits.data ?? []).forEach((r: any) => add(r.visitor_email, "SEO audit", { name: r.visitor_name, company: r.visitor_company, phone: r.visitor_phone, created_at: r.created_at }));
      (tools.data ?? []).forEach((r: any) => add(r.email, "AI tool", r));
      (bookings.data ?? []).forEach((r: any) => add(r.email, "Booking", r));
      (subs.data ?? []).forEach((r: any) => add(r.email, "Newsletter", r));
      return [...map.values()].map((c) => ({ ...c, stage: c.stage || stageFrom(null, c.sources.has("Newsletter") && c.sources.size === 1) }))
        .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
    },
  });

  const filtered = useMemo(() => contacts.filter((c) =>
    (stage === "all" || c.stage === stage) &&
    (!q || [c.email, c.name, c.company, c.phone].some((v) => v?.toLowerCase().includes(q.toLowerCase())))
  ), [contacts, q, stage]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Contacts</h1>
        <p className="text-sm text-muted-foreground">Every person from forms, audits, AI tools, bookings and newsletter — merged by email.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, company, phone" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {STAGES.map((s) => (
            <button key={s} onClick={() => setStage(s)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize ${stage === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
              {s} {s !== "all" && `(${contacts.filter((c) => c.stage === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/30 bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border/30">
            <tr><th className="p-3">Contact</th><th className="p-3">Company</th><th className="p-3">Stage</th><th className="p-3">Score</th><th className="p-3">Came from</th><th className="p-3">Last activity</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-muted-foreground"><Users className="w-6 h-6 mx-auto mb-2" />No contacts yet</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.email} className="border-b border-border/10 hover:bg-muted/30">
                <td className="p-3">
                  <Link to={`/dashboard/admin/contacts/${encodeURIComponent(c.email)}`} className="font-medium text-foreground hover:text-primary">{c.name || c.email}</Link>
                  <div className="text-xs text-muted-foreground">{c.email}{c.phone ? ` · ${c.phone}` : ""}</div>
                </td>
                <td className="p-3 text-muted-foreground">{c.company || "—"}</td>
                <td className="p-3 capitalize">{c.stage}</td>
                <td className="p-3 tabular-nums">{c.score ?? "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{[...c.sources].join(", ")}</td>
                <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(c.lastSeen).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
