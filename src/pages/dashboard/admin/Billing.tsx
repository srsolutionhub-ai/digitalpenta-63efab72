import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Plus, Trash2, Download, Send, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/20 text-blue-400",
  accepted: "bg-green-500/20 text-green-400",
  paid: "bg-green-500/20 text-green-400",
  overdue: "bg-red-500/20 text-red-400",
  rejected: "bg-red-500/20 text-red-400",
};

interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export default function Billing() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-foreground">Billing</h1>
      <Tabs defaultValue="quotations">
        <TabsList>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="quotations"><QuotationsTab /></TabsContent>
        <TabsContent value="invoices"><InvoicesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function QuotationsTab() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showBuilder, setShowBuilder] = useState(false);

  const { data: quotations, isLoading } = useQuery({
    queryKey: ["admin-quotations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotations").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const convertToInvoice = useMutation({
    mutationFn: async (quote: any) => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      const { error } = await supabase.from("invoices").insert({
        invoice_number: "",
        quotation_id: quote.id,
        client_id: quote.client_id,
        client_name: quote.client_name,
        client_email: quote.client_email,
        items: quote.items,
        subtotal: quote.subtotal,
        tax_amount: quote.tax_amount,
        total: quote.total,
        currency: quote.currency,
        status: "sent",
        due_date: dueDate.toISOString().slice(0, 10),
      });
      if (error) throw error;
      await supabase.from("quotations").update({ status: "accepted" }).eq("id", quote.id);

      // Send email notification (fire-and-forget)
      supabase.functions.invoke("send-notification", {
        body: {
          type: "invoice_created",
          data: {
            invoice_number: "Auto-generated",
            client_name: quote.client_name,
            client_email: quote.client_email,
            total: quote.total,
            due_date: dueDate.toISOString().slice(0, 10),
            status: "sent",
          },
        },
      }).catch(() => {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quotations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
      toast.success("Invoice created from quotation");
    },
  });

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowBuilder(true)}><Plus className="w-3 h-3 mr-1" /> New Quote</Button>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/20">
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Quote #</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Client</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Total</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Status</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Date</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <tr key={i}><td colSpan={6} className="p-3"><Skeleton className="h-8" /></td></tr>)
            ) : quotations?.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No quotations yet</td></tr>
            ) : (
              quotations?.map((q: any) => (
                <tr key={q.id} className="border-b border-border/10">
                  <td className="p-3 font-mono text-foreground">{q.quote_number}</td>
                  <td className="p-3 text-foreground">{q.client_name}</td>
                  <td className="p-3 text-foreground">₹{Number(q.total).toLocaleString()}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[q.status] || ""}`}>{q.status}</span></td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    {q.status === "sent" && (
                      <Button size="sm" variant="ghost" onClick={() => convertToInvoice.mutate(q)}>
                        <FileText className="w-3 h-3 mr-1" /> Convert to Invoice
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <QuotationBuilder open={showBuilder} onClose={() => setShowBuilder(false)} userId={user?.id} />
    </div>
  );
}

function QuotationBuilder({ open, onClose, userId }: { open: boolean; onClose: () => void; userId?: string }) {
  const queryClient = useQueryClient();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", qty: 1, unitPrice: 0, total: 0 }]);
  const [taxRate, setTaxRate] = useState("18");
  const [currency, setCurrency] = useState("INR");
  const [notes, setNotes] = useState("");

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const taxAmount = subtotal * (Number(taxRate) / 100);
  const total = subtotal + taxAmount;

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    (updated[idx] as any)[field] = value;
    updated[idx].total = updated[idx].qty * updated[idx].unitPrice;
    setItems(updated);
  };

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("quotations").insert({
        quote_number: "",
        client_name: clientName,
        client_email: clientEmail,
        items: items as any,
        subtotal,
        tax_rate: Number(taxRate),
        tax_amount: taxAmount,
        total,
        currency,
        notes,
        status: "draft",
        created_by: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quotations"] });
      toast.success("Quotation created");
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display">New Quotation</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Client Name</Label><Input value={clientName} onChange={(e) => setClientName(e.target.value)} /></div>
            <div><Label>Client Email</Label><Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} /></div>
          </div>

          <div>
            <Label>Line Items</Label>
            <div className="space-y-2 mt-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5"><Input placeholder="Service description" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} /></div>
                  <div className="col-span-2"><Input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} /></div>
                  <div className="col-span-3"><Input type="number" placeholder="Price" value={item.unitPrice || ""} onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))} /></div>
                  <div className="col-span-1 text-right text-sm text-foreground pt-2">₹{item.total.toLocaleString()}</div>
                  <div className="col-span-1">
                    {items.length > 1 && <Button size="sm" variant="ghost" onClick={() => setItems(items.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3" /></Button>}
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setItems([...items, { description: "", qty: 1, unitPrice: 0, total: 0 }])}>
                <Plus className="w-3 h-3 mr-1" /> Add Item
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tax Rate</Label>
              <Select value={taxRate} onValueChange={setTaxRate}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18% GST (India)</SelectItem>
                  <SelectItem value="5">5% VAT (UAE)</SelectItem>
                  <SelectItem value="0">0% (Other)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="AED">AED (د.إ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="card-surface rounded-xl p-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span className="text-foreground">₹{taxAmount.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t border-border/20"><span className="text-foreground">Total</span><span className="text-foreground">₹{total.toLocaleString()}</span></div>
          </div>

          <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={!clientName || !clientEmail}>Save Draft</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InvoicesTab() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["admin-invoices", statusFilter],
    queryFn: async () => {
      let query = supabase.from("invoices").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;

      // Mark overdue
      const today = new Date().toISOString().slice(0, 10);
      return (data ?? []).map((inv: any) => ({
        ...inv,
        displayStatus: inv.status === "sent" && inv.due_date && inv.due_date < today ? "overdue" : inv.status,
      }));
    },
  });

  return (
    <div className="space-y-4 mt-4">
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/20">
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Invoice #</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Client</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Amount</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Status</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Due Date</th>
              <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <tr key={i}><td colSpan={6} className="p-3"><Skeleton className="h-8" /></td></tr>)
            ) : invoices?.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No invoices yet</td></tr>
            ) : (
              invoices?.map((inv: any) => (
                <tr key={inv.id} className="border-b border-border/10">
                  <td className="p-3 font-mono text-foreground">{inv.invoice_number}</td>
                  <td className="p-3 text-foreground">{inv.client_name}</td>
                  <td className="p-3 text-foreground">₹{Number(inv.total).toLocaleString()}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[inv.displayStatus] || ""}`}>{inv.displayStatus}</span></td>
                  <td className="p-3 text-muted-foreground text-xs">{inv.due_date || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
