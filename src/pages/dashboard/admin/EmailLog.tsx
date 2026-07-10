import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Search, RefreshCw, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface LogRow {
  id: string;
  template: string;
  to_email: string;
  subject: string;
  status: string;
  resend_id: string | null;
  error: string | null;
  metadata: any;
  created_at: string;
}

const TEMPLATES = [
  "all",
  "contact-received",
  "contact-notify-team",
  "newsletter-welcome",
  "newsletter-broadcast",
  "audit-ready",
  "booking-confirmed",
];

export default function EmailLog() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState("all");
  const [status, setStatus] = useState<"all" | "sent" | "failed">("all");
  const [days, setDays] = useState<number>(7);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
    let q = supabase
      .from("email_send_log")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);
    if (template !== "all") q = q.eq("template", template);
    if (status !== "all") q = q.eq("status", status);
    const { data, error } = await q;
    if (error) {
      toast({ title: "Failed to load log", description: error.message, variant: "destructive" });
    }
    setRows((data as LogRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [template, status, days]);

  const filtered = rows.filter((r) =>
    !search
      || r.to_email?.toLowerCase().includes(search.toLowerCase())
      || r.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCsv = () => {
    const header = "Sent At,Template,To,Subject,Status,Resend ID,Error\n";
    const body = filtered
      .map((r) => [
        r.created_at, r.template, r.to_email, `"${(r.subject ?? "").replace(/"/g, '""')}"`,
        r.status, r.resend_id ?? "", `"${(r.error ?? "").replace(/"/g, '""')}"`,
      ].join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `email-log-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
            <Mail className="w-7 h-7 text-primary" /> Email Send Log
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            All outbound email — transactional and broadcasts — from the past {days} days.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="glass-card p-4 grid md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search email or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-white/10 text-sm"
          />
        </div>
        <select value={template} onChange={(e) => setTemplate(e.target.value)} className="rounded-lg bg-card border border-white/10 px-3 py-2 text-sm">
          {TEMPLATES.map((t) => <option key={t} value={t}>{t === "all" ? "All templates" : t}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-lg bg-card border border-white/10 px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-lg bg-card border border-white/10 px-3 py-2 text-sm">
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card/70 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-3">Sent</th>
                <th className="text-left p-3">Template</th>
                <th className="text-left p-3">To</th>
                <th className="text-left p-3">Subject</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Resend ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No emails match your filters.</td></tr>
              ) : filtered.map((r) => (
                <>
                  <tr
                    key={r.id}
                    className="border-t border-white/5 hover:bg-white/[0.03] cursor-pointer"
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    <td className="p-3 text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-xs">{r.template}</td>
                    <td className="p-3">{r.to_email}</td>
                    <td className="p-3 text-foreground max-w-xs truncate">{r.subject}</td>
                    <td className="p-3">
                      <span className={`text-xs font-mono uppercase px-2 py-1 rounded-full ${
                        r.status === "sent"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-muted-foreground truncate max-w-[120px]">{r.resend_id ?? "—"}</td>
                  </tr>
                  {expanded === r.id && (
                    <tr key={r.id + "-x"} className="bg-black/30">
                      <td colSpan={6} className="p-4">
                        {r.error && (
                          <div className="mb-2">
                            <p className="text-xs uppercase text-red-400 mb-1">Error</p>
                            <pre className="text-xs whitespace-pre-wrap text-red-300/80">{r.error}</pre>
                          </div>
                        )}
                        <p className="text-xs uppercase text-muted-foreground mb-1">Metadata</p>
                        <pre className="text-xs whitespace-pre-wrap text-foreground/80">{JSON.stringify(r.metadata ?? {}, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
