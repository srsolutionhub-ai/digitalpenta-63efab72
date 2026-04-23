import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { Receipt, Check } from "lucide-react";
import { toast } from "sonner";

const STATUS: Record<string, any> = { draft: "default", sent: "info", paid: "success", overdue: "danger", cancelled: "default" };

export default function Invoices() {
  const qc = useQueryClient();
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const markPaid = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); toast.success("Marked as paid"); },
  });

  const totals = {
    paid: invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.total), 0),
    pending: invoices.filter((i: any) => i.status !== "paid" && i.status !== "cancelled").reduce((s: number, i: any) => s + Number(i.total), 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Auto-numbered INV-YYYY-NNN. Track collections in real time."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Invoices" }]}
      />

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="card-surface rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Collected</p>
          <p className="font-display font-bold text-2xl text-emerald-400 mt-1">₹{(totals.paid / 100000).toFixed(1)}L</p>
        </div>
        <div className="card-surface rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pending</p>
          <p className="font-display font-bold text-2xl text-amber-400 mt-1">₹{(totals.pending / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices yet" description="Convert an accepted quotation into an invoice from the Quotations page." />
      ) : (
        <DataTable
          rowKey={(r: any) => r.id}
          rows={invoices}
          columns={[
            { key: "invoice_number", header: "Invoice #", render: (r: any) => <span className="font-mono text-xs">{r.invoice_number}</span> },
            { key: "client_name", header: "Client" },
            { key: "total", header: "Total", render: (r: any) => <span className="font-mono">{r.currency} {Number(r.total).toLocaleString()}</span> },
            { key: "status", header: "Status", render: (r: any) => <StatusPill variant={STATUS[r.status] || "default"}>{r.status}</StatusPill> },
            { key: "due_date", header: "Due", render: (r: any) => r.due_date || "—" },
            {
              key: "actions",
              header: "",
              render: (r: any) => r.status !== "paid" ? (
                <Button size="sm" variant="ghost" onClick={() => markPaid.mutate(r.id)}><Check className="w-3 h-3 mr-1" /> Mark paid</Button>
              ) : null,
            },
          ]}
        />
      )}
    </div>
  );
}
