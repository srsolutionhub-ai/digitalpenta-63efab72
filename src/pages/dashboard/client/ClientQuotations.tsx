import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const db = supabase as any;

const STATUS_VARIANT: Record<string, any> = { draft: "default", sent: "info", accepted: "success", rejected: "danger", expired: "warning" };

export default function ClientQuotations() {
  const { user } = useAuth();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ["client-quotations", user?.id, user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await db
        .from("quotations")
        .select("*")
        .or(`client_id.eq.${user.id},client_email.ilike.${user.email}`)
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
              <div className="flex items-center gap-3">
                <p className="text-lg font-display font-bold text-foreground">
                  {q.currency || "INR"} {Number(q.total).toLocaleString()}
                </p>
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
