import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Download, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

const STATUS_VARIANT: Record<string, any> = { draft: "default", sent: "info", viewed: "info", accepted: "success", declined: "danger", expired: "warning" };

export default function ClientQuotations() {
  const { user } = useAuth();
  const qc = useQueryClient();

  /** Client decision on a sent quote — the trigger enforces allowed transitions. */
  const decide = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "declined" }) => {
      const { data, error } = await db
        .from("quotations")
        .update({ status })
        .eq("id", id)
        .select("id")
        .single();
      if (error) throw error;
      if (!data) throw new Error("This quotation couldn't be updated");
    },
    onSuccess: (_d, vars) => {
      toast.success(vars.status === "accepted" ? "Quotation accepted — your team has been notified" : "Quotation declined");
      qc.invalidateQueries({ queryKey: ["client-quotations"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Couldn't save your decision"),
  });

  const { data: quotes, isLoading, isError, refetch } = useQuery({
    queryKey: ["client-quotations", user?.id, user?.email],
    queryFn: async () => {
      if (!user) return [];
      // No personal filter: access rules already scope this list to quotes
      // addressed to the client or anyone at their company.
      const { data, error } = await db
        .from("quotations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Proposals and quotes shared with you by your account manager."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : isError ? (
        <div className="card-surface rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Couldn't load your quotations.</p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>Try again</Button>
        </div>
      ) : !quotes?.length ? (
        <EmptyState
          icon={FileText}
          title="No quotations yet"
          description="Quotes your account manager sends you will appear here."
        />
      ) : (
        <div className="space-y-3">
          {quotes.map((q: any) => (
            <div key={q.id} className="card-surface rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display font-semibold text-foreground">{q.quote_number}</p>
                  <StatusPill variant={STATUS_VARIANT[q.status] || "default"}>{q.status}</StatusPill>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(q.created_at).toLocaleDateString()}
                  {q.validity_date ? ` · valid until ${new Date(q.validity_date).toLocaleDateString()}` : ""}
                </p>
                {Array.isArray(q.items) && q.items.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">{q.items.length} line item{q.items.length === 1 ? "" : "s"}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg font-display font-bold text-foreground">
                  {q.currency || "INR"} {Number(q.total).toLocaleString()}
                </p>
                {(q.status === "sent" || q.status === "viewed") && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={decide.isPending}
                      onClick={() => decide.mutate({ id: q.id, status: "declined" })}>
                      <XCircle className="w-3.5 h-3.5 mr-1.5" /> Decline
                    </Button>
                    <Button size="sm" disabled={decide.isPending}
                      onClick={() => decide.mutate({ id: q.id, status: "accepted" })}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Accept
                    </Button>
                  </div>
                )}
                {q.pdf_url && (
                  <Button asChild size="sm" variant="outline">
                    <a href={q.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
