// Premium printable / PDF-via-browser-print layout for quotations & invoices.
// Renders inside a Dialog; the print stylesheet (src/index.css) isolates #print-document.
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Printer, X } from "lucide-react";
import { COMPANY, amountInWords, calcGstSplit, formatCurrency } from "@/lib/billingUtils";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  hsn_sac?: string;
  discount_percent?: number;
}

interface DocProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: "Quotation" | "Tax Invoice";
  number: string;
  date: string;
  validityOrDueLabel?: string;
  validityOrDueValue?: string;
  clientName: string;
  clientEmail: string;
  clientGstin?: string | null;
  placeOfSupply?: string | null;
  items: LineItem[];
  taxRate: number;
  currency: string;
  notes?: string | null;
  status?: string;
}

export function DocumentPrintView(props: DocProps) {
  const { open, onOpenChange, kind, number, date, validityOrDueLabel, validityOrDueValue, clientName, clientEmail, clientGstin, placeOfSupply, items, taxRate, currency, notes, status } = props;

  const lines = items.map((it) => {
    const gross = it.quantity * it.unit_price;
    const discount = gross * ((it.discount_percent || 0) / 100);
    const taxable = gross - discount;
    return { ...it, gross, discount, taxable };
  });
  const subtotal = lines.reduce((s, l) => s + l.taxable, 0);
  const gst = calcGstSplit(subtotal, taxRate, placeOfSupply);
  const total = subtotal + gst.totalTax;
  const isIndianClient = currency === "INR" && !gst.isExport;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="no-print flex items-center justify-between p-4 border-b border-border/20 sticky top-0 bg-background z-10">
          <p className="text-sm font-medium">{kind} preview</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()}><Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Save PDF</Button>
            <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}><X className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
        <div id="print-document" className="bg-white text-slate-900 p-10 text-sm">
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{COMPANY.legalName}</h1>
              <p className="text-slate-500 text-xs mt-1 max-w-xs">{COMPANY.address}</p>
              <p className="text-slate-500 text-xs">GSTIN: {COMPANY.gstin} · PAN: {COMPANY.pan}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold uppercase text-slate-700">{kind}</h2>
              <p className="text-xs text-slate-500 font-mono mt-1">{number}</p>
              <p className="text-xs text-slate-500">{date}</p>
              {status && <p className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-slate-100 uppercase tracking-wide">{status}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Billed to</p>
              <p className="font-semibold">{clientName}</p>
              <p className="text-slate-500 text-xs">{clientEmail}</p>
              {clientGstin && <p className="text-slate-500 text-xs">GSTIN: {clientGstin}</p>}
            </div>
            <div className="text-right">
              {placeOfSupply && (
                <p className="text-xs text-slate-500"><span className="text-slate-400">Place of Supply:</span> {placeOfSupply}</p>
              )}
              {validityOrDueLabel && (
                <p className="text-xs text-slate-500"><span className="text-slate-400">{validityOrDueLabel}:</span> {validityOrDueValue || "—"}</p>
              )}
              <p className="text-xs text-slate-500"><span className="text-slate-400">Currency:</span> {currency}</p>
            </div>
          </div>

          <table className="w-full text-xs mb-6 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">HSN/SAC</th>
                <th className="text-right p-2">Qty</th>
                <th className="text-right p-2">Rate</th>
                <th className="text-right p-2">Disc %</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-2">{l.description}</td>
                  <td className="p-2 font-mono">{l.hsn_sac || "998314"}</td>
                  <td className="p-2 text-right">{l.quantity}</td>
                  <td className="p-2 text-right">{formatCurrency(l.unit_price, currency)}</td>
                  <td className="p-2 text-right">{l.discount_percent || 0}%</td>
                  <td className="p-2 text-right font-medium">{formatCurrency(l.taxable, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-64 text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatCurrency(subtotal, currency)}</span></div>
              {isIndianClient && gst.isIntraState && (
                <>
                  <div className="flex justify-between"><span className="text-slate-500">CGST ({(taxRate / 2).toFixed(1)}%)</span><span>{formatCurrency(gst.cgst, currency)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">SGST ({(taxRate / 2).toFixed(1)}%)</span><span>{formatCurrency(gst.sgst, currency)}</span></div>
                </>
              )}
              {isIndianClient && !gst.isIntraState && !gst.isExport && (
                <div className="flex justify-between"><span className="text-slate-500">IGST ({taxRate}%)</span><span>{formatCurrency(gst.igst, currency)}</span></div>
              )}
              {gst.isExport && (
                <div className="flex justify-between text-slate-400"><span>GST</span><span>Zero-rated export (LUT)</span></div>
              )}
              <div className="flex justify-between font-bold text-base pt-1.5 border-t border-slate-200"><span>Total</span><span>{formatCurrency(total, currency)}</span></div>
            </div>
          </div>

          <div className="mb-6 p-3 bg-slate-50 rounded-lg">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Amount in words</p>
            <p className="text-xs font-medium">{amountInWords(total, currency)}</p>
          </div>

          {kind === "Tax Invoice" && (
            <div className="mb-6 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Bank Details</p>
                <p>{COMPANY.bank.accountName}</p>
                <p>A/c: {COMPANY.bank.accountNumber}</p>
                <p>IFSC: {COMPANY.bank.ifsc} · {COMPANY.bank.bankName}</p>
                <p>SWIFT: {COMPANY.bank.swift}</p>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">UPI</p>
                <p className="font-mono">{COMPANY.upi}</p>
              </div>
            </div>
          )}

          {notes && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Notes</p>
              <p className="text-xs text-slate-600 whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          <p className="text-[10px] text-slate-400 border-t border-slate-200 pt-3">
            This is a computer-generated {kind.toLowerCase()} and does not require a signature. For queries, contact support@digitalpenta.com.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
