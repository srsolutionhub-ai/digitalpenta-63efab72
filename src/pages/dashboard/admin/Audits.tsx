import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { FileSearch, ExternalLink } from "lucide-react";

interface Audit {
  id: string;
  url: string;
  visitor_email: string | null;
  visitor_name: string | null;
  overall_score: number | null;
  status: string;
  created_at: string;
}

function scoreVariant(s: number | null) {
  if (s == null) return "neutral" as const;
  if (s >= 90) return "success" as const;
  if (s >= 50) return "warning" as const;
  return "danger" as const;
}

export default function AdminAudits() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("audits")
        .select("id,url,visitor_email,visitor_name,overall_score,status,created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      setAudits((data as Audit[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <PageHeader
        title="SEO Audits"
        description="Every audit run from the public tool. Convert hot leads into deals."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard/admin" }, { label: "Audits" }]}
      />

      {loading ? (
        <div className="rounded-xl border border-border/30 bg-card p-12 text-center text-sm text-muted-foreground">
          Loading audits…
        </div>
      ) : (
        <DataTable<Audit>
          rowKey={(r) => r.id}
          columns={[
            {
              key: "url",
              header: "URL",
              render: (r) => (
                <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-foreground hover:text-primary">
                  <span className="max-w-[280px] truncate">{r.url}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ),
            },
            { key: "visitor_email", header: "Lead", render: (r) => r.visitor_email ? (<div><div className="text-foreground">{r.visitor_name ?? "—"}</div><div className="text-xs text-muted-foreground">{r.visitor_email}</div></div>) : <span className="text-muted-foreground">Anonymous</span> },
            { key: "overall_score", header: "Score", render: (r) => (<StatusPill variant={scoreVariant(r.overall_score)}>{r.overall_score ?? "—"}</StatusPill>) },
            { key: "status", header: "Status", render: (r) => (<StatusPill variant={r.status === "complete" ? "success" : r.status === "failed" ? "danger" : "info"}>{r.status}</StatusPill>) },
            { key: "created_at", header: "Date", render: (r) => new Date(r.created_at).toLocaleString() },
            { key: "actions", header: "", render: (r) => (<Link to={`/dashboard/admin/audits/${r.id}`} className="text-xs font-medium text-primary hover:underline">View →</Link>) },
          ]}
          rows={audits}
          empty={<EmptyState icon={FileSearch} title="No audits yet" description="When visitors run the SEO audit tool, they'll appear here." />}
        />
      )}
    </div>
  );
}
