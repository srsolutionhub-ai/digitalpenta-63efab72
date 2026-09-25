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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { QuotationActivityLog } from "@/components/dashboard/QuotationActivityLog";
import { DocumentPrintView } from "@/components/dashboard/DocumentPrintView";
import { Briefcase, Plus, Trash2, Send, CheckCircle2, History, XCircle, Printer, Mail } from "lucide-react";
import { toast } from "sonner";
import { PLACE_OF_SUPPLY_OPTIONS, calcGstSplit, formatCurrency, isMissingColumnError } from "@/lib/billingUtils";

interface LineItem { description: string; quantity: number; unit_price: number; hsn_sac?: string; discount_percent?: number; }

const STATUS: Record<string, any> = { draft: "default", sent: "info", viewed: "info", accepted: "success", declined: "danger", rejected: "danger", expired: "warning" };

export default function Quotations() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [activityFor, setActivityFor] = useState<{ id: string; quote_number: string; client_name: string } | null>(null);
  const [printFor, setPrintFor] = useState<any>(null);
  const [declineFor, setDeclineFor] = useState<any>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [form, setForm] = useState<any>({ client_name: "", client_email: "", client_gstin: "", place_of_supply: "", validity_date: "", tax_rate: 18, currency: "INR", notes: "", items: [{ description: "", quantity: 1, unit_price: 0, hsn_sac: "998314", discount_percent: 0 }] });

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data } = await supabase.from("quotations").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const subtotal = (form.items as LineItem[]).reduce((s, i) => s + i.quantity * i.unit_price * (1 - (i.discount_percent || 0) / 100), 0);
      const gst = calcGstSplit(subtotal, Number(form.tax_rate), form.place_of_supply);
      const tax_amount = gst.totalTax;
      const total = subtotal + tax_amount;
      const base: any = {
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
      };
      const extended = { ...base, client_gstin: form.client_gstin || null, place_of_supply: form.place_of_supply || null, cgst_amount: gst.cgst, sgst_amount: gst.sgst, igst_amount: gst.igst };
      let { error } = await supabase.from("quotations").insert(extended);
      if (error && isMissingColumnError(error)) {
        // DB not yet upgraded with GST columns — fall back to base fields only.
        ({ error } = await supabase.from("quotations").insert(base));
      }
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
      qc.invalidateQueries({ queryKey: ["quotation-activity"] });
      if (vars.status === "accepted") toast.success("Quote accepted — draft invoice auto-created");
      else if (vars.status === "sent") toast.success("Quote marked as sent");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const decline = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const base: any = { status: "declined" };
      let { error } = await supabase.from("quotations").update({ ...base, decline_reason: reason || null }).eq("id", id);
      if (error && isMissingColumnError(error)) {
        ({ error } = await supabase.from("quotations").update(base).eq("id", id));
      }
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quotations"] });
      qc.invalidateQueries({ queryKey: ["quotation-activity"] });
      toast.success("Quote declined");
      setDeclineFor(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const sendEmail = useMutation({
    mutationFn: async (r: any) => {
      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          template: "quotation-sent",
          to: r.client_email,
          data: {
            name: r.client_name,
            quoteNumber: r.quote_number,
            total: formatCurrency(Number(r.total), r.currency),
            validityDate: r.validity_date,
            viewUrl: `${window.location.origin}/dashboard/client/quotations`,
          },
        },
      });
      if (error) throw error;
      if (r.status === "draft") await supabase.from("quotations").update({ status: "sent" }).eq("id", r.id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["quotations"] }); toast.success("Quotation emailed to client"); },
    onError: (e: any) => toast.error(e.message),
  });

  const addItem = () => setForm({ ...form, items: [...form.items, { description: "", quantity: 1, unit_price: 0, hsn_sac: "998314", discount_percent: 0 }] });
  const removeItem = (i: number) => setForm({ ...form, items: form.items.filter((_: any, idx: number) => idx !== i) });
  const updateItem = (i: number, key: string, val: any) => {
    const next = [...form.items];
    next[i] = { ...next[i], [key]: key === "description" || key === "hsn_sac" ? val : Number(val) };
    setForm({ ...form, items: next });
  };

  const previewSubtotal = (form.items as LineItem[]).reduce((s, i: any) => s + (i.quantity || 0) * (i.unit_price || 0) * (1 - (i.discount_percent || 0) / 100), 0);
  const previewGst = calcGstSplit(previewSubtotal, Number(form.tax_rate), form.place_of_supply);
  const previewTotal = previewSubtotal + previewGst.totalTax;

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
                  <Button size="sm" variant="ghost" onClick={() => setActivityFor({ id: r.id, quote_number: r.quote_number, client_name: r.client_name })} title="View activity log">
                    <History className="w-3 h-3" />
                  </Button>
                  {r.status === "draft" && (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: r.id, status: "sent" })} title="Mark as sent">
                      <Send className="w-3 h-3" />
                    </Button>
                  )}
                  {(r.status === "sent" || r.status === "draft" || r.status === "viewed") && (
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
                  {(r.status === "sent" || r.status === "draft" || r.status === "viewed") && (
                    <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-300" onClick={() => { setDeclineFor(r); setDeclineReason(""); }} title="Decline">
                      <XCircle className="w-3 h-3" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setPrintFor(r)} title="Print / Download PDF">
                    <Printer className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => sendEmail.mutate(r)} title="Email to client">
                    <Mail className="w-3 h-3" />
                  </Button>
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
              <div><Label>Client GSTIN (optional)</Label><Input value={form.client_gstin} onChange={(e) => setForm({ ...form, client_gstin: e.target.value })} /></div>
              <div>
                <Label>Place of Supply</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={form.place_of_supply} onChange={(e) => setForm({ ...form, place_of_supply: e.target.value })}>
                  <option value="">Select…</option>
                  {PLACE_OF_SUPPLY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><Label>Validity Date</Label><Input type="date" value={form.validity_date} onChange={(e) => setForm({ ...form, validity_date: e.target.value })} /></div>
              <div><Label>Tax Rate (%)</Label><Input type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} /></div>
              <div>
                <Label>Currency</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  {["INR", "USD", "AED", "GBP", "EUR"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Line Items</Label>
              {form.items.map((it: any, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Input className="col-span-4" placeholder="Description" value={it.description} onChange={(e) => updateItem(i, "description", e.target.value)} />
                  <Input className="col-span-2" placeholder="SAC" value={it.hsn_sac || ""} onChange={(e) => updateItem(i, "hsn_sac", e.target.value)} />
                  <Input className="col-span-1" type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} />
                  <Input className="col-span-2" type="number" placeholder="Price" value={it.unit_price} onChange={(e) => updateItem(i, "unit_price", e.target.value)} />
                  <Input className="col-span-2" type="number" placeholder="Disc %" value={it.discount_percent || 0} onChange={(e) => updateItem(i, "discount_percent", e.target.value)} />
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

      <Sheet open={!!activityFor} onOpenChange={(v) => { if (!v) setActivityFor(null); }}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display">Activity · {activityFor?.quote_number}</SheetTitle>
            <p className="text-xs text-muted-foreground">{activityFor?.client_name}</p>
          </SheetHeader>
          <div className="mt-6">
            {activityFor && <QuotationActivityLog quotationId={activityFor.id} />}
          </div>
        </SheetContent>
      </Sheet>

      {printFor && (
        <DocumentPrintView
          open={!!printFor}
          onOpenChange={(v) => { if (!v) setPrintFor(null); }}
          kind="Quotation"
          number={printFor.quote_number}
          date={new Date(printFor.created_at).toLocaleDateString("en-IN")}
          validityOrDueLabel="Valid Till"
          validityOrDueValue={printFor.validity_date}
          clientName={printFor.client_name}
          clientEmail={printFor.client_email}
          clientGstin={printFor.client_gstin}
          placeOfSupply={printFor.place_of_supply}
          items={printFor.items || []}
          taxRate={Number(printFor.tax_rate) || 18}
          currency={printFor.currency}
          notes={printFor.notes}
          status={printFor.status}
        />
      )}

      <Dialog open={!!declineFor} onOpenChange={(v) => { if (!v) setDeclineFor(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">Decline {declineFor?.quote_number}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Reason (optional)</Label><Textarea rows={3} value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} /></div>
            <Button variant="destructive" className="w-full" onClick={() => decline.mutate({ id: declineFor.id, reason: declineReason })} disabled={decline.isPending}>Confirm Decline</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
