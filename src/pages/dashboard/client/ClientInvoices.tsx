import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/20 text-blue-400",
  paid: "bg-green-500/20 text-green-400",
  overdue: "bg-red-500/20 text-red-400",
};

export default function ClientInvoices() {
  const { user } = useAuth();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["client-invoices", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const today = new Date().toISOString().slice(0, 10);
      return (data ?? []).map((inv: any) => ({
        ...inv,
        displayStatus: inv.status === "sent" && inv.due_date && inv.due_date < today ? "overdue" : inv.status,
      }));
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-foreground">Invoices</h1>

      <div className="card-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/20">
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Invoice #</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Date</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Amount</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Status</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <tr key={i}><td colSpan={5} className="p-3"><Skeleton className="h-8" /></td></tr>)
            ) : invoices?.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No invoices yet</td></tr>
            ) : (
              invoices?.map((inv: any) => (
                <tr key={inv.id} className="border-b border-border/10">
                  <td className="p-3 font-mono text-foreground">{inv.invoice_number}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-foreground">₹{Number(inv.total).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[inv.displayStatus] || ""}`}>{inv.displayStatus}</span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{inv.due_date || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
