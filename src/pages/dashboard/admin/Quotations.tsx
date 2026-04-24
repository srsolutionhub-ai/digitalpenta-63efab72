import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Plus, Trash2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface LineItem { description: string; quantity: number; unit_price: number; }

const STATUS: Record<string, any> = { draft: "default", sent: "info", accepted: "success", rejected: "danger", expired: "warning" };

export default function Quotations() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<any>({ client_name: "", client_email: "", validity_date: "", tax_rate: 18, currency: "INR", notes: "", items: [{ description: "", quantity: 1, unit_price: 0 }] });

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data } = await supabase.from("quotations").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const subtotal = (form.items as LineItem[]).reduce((s, i) => s + i.quantity * i.unit_price, 0);
      const tax_amount = subtotal * (Number(form.tax_rate) / 100);
      const total = subtotal + tax_amount;
      const { error } = await supabase.from("quotations").insert({
        client_name: form.client_name,
        client_email: form.client_email,
        items: form.items,
        subtotal,
        tax_rate: Number(form.tax_rate),
        tax_amount,
        total,
        currency: form.currency,
        notes: form.notes || null,
        validity_date: form.validity_date || null,
        status: "draft",
        quote_number: "DRAFT",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quotations"] });
      toast.success("Quotation created");
      setShowCreate(false);
      setForm({ client_name: "", client_email: "", validity_date: "", tax_rate: 18, currency: "INR", notes: "", items: [{ description: "", quantity: 1, unit_price: 0 }] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("quotations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["quotations"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      if (vars.status === "accepted") toast.success("Quote accepted — draft invoice auto-created");
      else if (vars.status === "sent") toast.success("Quote marked as sent");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const addItem = () => setForm({ ...form, items: [...form.items, { description: "", quantity: 1, unit_price: 0 }] });
  const removeItem = (i: number) => setForm({ ...form, items: form.items.filter((_: any, idx: number) => idx !== i) });
  const updateItem = (i: number, key: string, val: any) => {
    const next = [...form.items];
    next[i] = { ...next[i], [key]: key === "description" ? val : Number(val) };
    setForm({ ...form, items: next });
  };

  const previewSubtotal = (form.items as LineItem[]).reduce((s, i) => s + (i.quantity || 0) * (i.unit_price || 0), 0);
  const previewTotal = previewSubtotal * (1 + Number(form.tax_rate) / 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Build, send & track proposals. Auto-numbered as QT-YYYY-NNN on save."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Quotations" }]}
        actions={<Button size="sm" onClick={() => setShowCreate(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> New Quote</Button>}
      />

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : quotes.length === 0 ? (
        <EmptyState icon={Briefcase} title="No quotations yet" description="Create your first quote to send a branded PDF to a prospect." action={<Button size="sm" onClick={() => setShowCreate(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> Create Quotation</Button>} />
      ) : (
        <DataTable
          rowKey={(r: any) => r.id}
          rows={quotes}
          columns={[
            { key: "quote_number", header: "Quote #", render: (r: any) => <span className="font-mono text-xs">{r.quote_number}</span> },
            { key: "client_name", header: "Client" },
            { key: "total", header: "Total", render: (r: any) => <span className="font-mono">{r.currency} {Number(r.total).toLocaleString()}</span> },
            { key: "status", header: "Status", render: (r: any) => <StatusPill variant={STATUS[r.status] || "default"}>{r.status}</StatusPill> },
            { key: "validity_date", header: "Valid Till", render: (r: any) => r.validity_date || "—" },
            {
              key: "actions",
              header: "",
              render: (r: any) => (
                <div className="flex gap-1">
                  {r.status === "draft" && (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: r.id, status: "sent" })} title="Mark as sent">
                      <Send className="w-3 h-3" />
                    </Button>
                  )}
                  {(r.status === "sent" || r.status === "draft") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-emerald-400 hover:text-emerald-300"
                      onClick={() => updateStatus.mutate({ id: r.id, status: "accepted" })}
                      title="Accept (auto-creates draft invoice)"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Accept
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">New Quotation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Client Name</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
              <div><Label>Client Email</Label><Input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} /></div>
              <div><Label>Validity Date</Label><Input type="date" value={form.validity_date} onChange={(e) => setForm({ ...form, validity_date: e.target.value })} /></div>
              <div><Label>Tax Rate (%)</Label><Input type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Line Items</Label>
              {form.items.map((it: LineItem, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-6" placeholder="Description" value={it.description} onChange={(e) => updateItem(i, "description", e.target.value)} />
                  <Input className="col-span-2" type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} />
                  <Input className="col-span-3" type="number" placeholder="Price" value={it.unit_price} onChange={(e) => updateItem(i, "unit_price", e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" className="col-span-1" onClick={() => removeItem(i)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-3 h-3 mr-1" /> Add Line</Button>
            </div>
            <div><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="text-xs text-muted-foreground">Subtotal: ₹{previewSubtotal.toLocaleString()}</p>
                <p className="font-display font-bold text-lg">Total: ₹{previewTotal.toLocaleString()}</p>
              </div>
              <Button onClick={() => create.mutate()} disabled={create.isPending || !form.client_name || !form.client_email}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
