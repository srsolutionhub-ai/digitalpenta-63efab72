// Activity feed for a single quotation — pulled from audit_log entries.
// Surfaces status transitions and the auto-invoice creation event.
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, ArrowRight, FileCheck2, FilePlus2, Pencil, Send, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  quotationId: string;
}

const ICON_MAP: Record<string, { icon: any; tone: string; label: (after: any) => string }> = {
  "status_changed:sent": { icon: Send, tone: "text-primary", label: () => "Marked as sent" },
  "status_changed:accepted": { icon: FileCheck2, tone: "text-emerald-400", label: () => "Quote accepted" },
  "status_changed:rejected": { icon: XCircle, tone: "text-rose-400", label: () => "Marked as rejected" },
  "status_changed:expired": { icon: Clock, tone: "text-amber-400", label: () => "Marked as expired" },
  "status_changed:draft": { icon: Pencil, tone: "text-muted-foreground", label: () => "Reverted to draft" },
  invoice_auto_created: { icon: FilePlus2, tone: "text-emerald-400", label: (a) => `Draft invoice ${a?.invoice_number ?? ""} auto-created · ₹${Number(a?.total ?? 0).toLocaleString()}` },
};

export function QuotationActivityLog({ quotationId }: Props) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["quotation-activity", quotationId],
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_log")
        .select("id, action, actor_id, before_state, after_state, created_at")
        .eq("entity_type", "quotation")
        .eq("entity_id", quotationId)
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  if (isLoading) {
    return <div className="text-xs text-muted-foreground">Loading activity…</div>;
  }
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/30 p-4 text-center">
        <Activity className="mx-auto h-4 w-4 text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">No activity yet. Status changes will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((e: any) => {
        const cfg = ICON_MAP[e.action] ?? { icon: Activity, tone: "text-muted-foreground", label: () => e.action };
        const Icon = cfg.icon;
        const before = e.before_state ?? {};
        const after = e.after_state ?? {};
        const showTransition = before.status && after.status && before.status !== after.status;
        return (
          <div key={e.id} className="flex items-start gap-3 rounded-lg border border-border/20 bg-card/40 p-3">
            <div className={`mt-0.5 rounded-full bg-muted/40 p-1.5 ${cfg.tone}`}>
              <Icon className="h-3 w-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">{cfg.label(after)}</p>
              {showTransition && (
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="rounded bg-muted/40 px-1.5 py-0.5 font-mono">{before.status}</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-primary">{after.status}</span>
                </p>
              )}
              <p className="mt-1 text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                {e.actor_id && <span className="ml-2 font-mono">· by {String(e.actor_id).slice(0, 8)}…</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
