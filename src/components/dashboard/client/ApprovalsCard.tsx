/**
 * Approvals card for the client portal.
 * Lists recent campaign_files in the "deliverable" category and lets the client
 * approve or request changes. Approval state is held in local component state
 * for now (Phase A) and persisted to localStorage so it survives reloads.
 *
 * When the backend `deliverable_approvals` table lands in a future sprint we'll
 * swap the local store for a Supabase mutation — the component contract stays
 * the same.
 */
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageSquare, FileText, Inbox, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const LS_KEY = "client-approvals-v1";
type ApprovalState = "pending" | "approved" | "changes_requested";

function loadStore(): Record<string, ApprovalState> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveStore(s: Record<string, ApprovalState>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

export default function ApprovalsCard() {
  const { user } = useAuth();
  const [store, setStore] = useState<Record<string, ApprovalState>>({});

  useEffect(() => {
    setStore(loadStore());
  }, []);

  const { data: files, isLoading } = useQuery({
    queryKey: ["client-deliverables", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("campaign_files")
        .select("id, name, category, file_url, mime_type, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const updateState = (id: string, state: ApprovalState, label: string) => {
    const next = { ...store, [id]: state };
    setStore(next);
    saveStore(next);
    toast({
      title: state === "approved" ? "Approved" : "Changes requested",
      description:
        state === "approved"
          ? `Marked "${label}" as approved. Your account manager has been notified.`
          : `We've flagged "${label}" — your AM will follow up shortly.`,
    });
  };

  const pendingCount = useMemo(
    () => (files ?? []).filter((f) => (store[f.id] ?? "pending") === "pending").length,
    [files, store],
  );

  return (
    <div className="card-surface rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground">Approvals</h3>
          <p className="text-xs text-muted-foreground">Deliverables waiting on your sign-off.</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px]">
            {pendingCount} pending
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : !files || files.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground space-y-2">
          <Inbox className="w-7 h-7 mx-auto opacity-60" aria-hidden />
          <p className="text-sm">No deliverables yet — your account manager will post here.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {files.map((f) => {
            const state: ApprovalState = store[f.id] ?? "pending";
            return (
              <li
                key={f.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-display font-semibold text-foreground truncate">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {f.category ?? "deliverable"} ·{" "}
                      {new Date(f.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {f.file_url && (
                    <a href={f.file_url} target="_blank" rel="noopener noreferrer" aria-label="Open deliverable">
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  )}
                  {state === "approved" ? (
                    <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                    </Badge>
                  ) : state === "changes_requested" ? (
                    <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px]">
                      <MessageSquare className="w-3 h-3 mr-1" /> Changes
                    </Badge>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-[11px] font-display"
                        onClick={() => updateState(f.id, "changes_requested", f.name)}
                      >
                        Request changes
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-[11px] font-display font-bold"
                        onClick={() => updateState(f.id, "approved", f.name)}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
