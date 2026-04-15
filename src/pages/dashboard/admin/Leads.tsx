import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Download, X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STATUSES = ["new", "contacted", "demo_scheduled", "proposal_sent", "negotiation", "won", "lost"];
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  demo_scheduled: "bg-purple-500/20 text-purple-400",
  proposal_sent: "bg-orange-500/20 text-orange-400",
  negotiation: "bg-teal-500/20 text-teal-400",
  won: "bg-green-500/20 text-green-400",
  lost: "bg-red-500/20 text-red-400",
};

function LeadScoreDot({ score }: { score: number }) {
  const color = score >= 7 ? "bg-green-500" : score >= 4 ? "bg-yellow-500" : "bg-red-500";
  return <div className={`w-2.5 h-2.5 rounded-full ${color}`} title={`Score: ${score}`} />;
}

export default function Leads() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const perPage = 50;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads", search, statusFilter, page],
    queryFn: async () => {
      let query = supabase.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(page * perPage, (page + 1) * perPage - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
      }
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data: leads, count, error } = await query;
      if (error) throw error;
      return { leads: leads ?? [], total: count ?? 0 };
    },
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("leads").update({
        name: updates.name || null,
        email: updates.email || null,
        phone: updates.phone || null,
        company: updates.company || null,
        website: updates.website || null,
        source: updates.source || null,
        budget: updates.budget_range || null,
        service: updates.service || "General",
        status: updates.status || "new",
        notes: updates.notes || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast.success("Lead updated");
    },
  });

  const createLead = useMutation({
    mutationFn: async (lead: Record<string, any>) => {
      let score = 0;
      if (lead.budget_range === "5L+") score += 3;
      else if (lead.budget_range === "1L-5L") score += 2;
      if (lead.website) score += 1;
      if (lead.phone) score += 1;
      if (lead.source === "referral") score += 2;
      score = Math.min(score + 1, 10);

      const { error } = await supabase.from("leads").insert({
        name: lead.name || null,
        email: lead.email || null,
        phone: lead.phone || null,
        company: lead.company || null,
        website: lead.website || null,
        source: lead.source || null,
        budget: lead.budget_range || null,
        service: lead.service || "General",
        status: lead.status || "new",
        lead_score: score,
        notes: lead.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast.success("Lead created");
      setShowModal(false);
    },
  });

  const totalPages = Math.ceil((data?.total ?? 0) / perPage);

  const exportCSV = () => {
    if (!data?.leads.length) return;
    const headers = ["Name", "Email", "Phone", "Company", "Source", "Score", "Status", "Created"];
    const rows = data.leads.map((l: any) => [l.name, l.email, l.phone, l.company, l.source, l.lead_score, l.status, l.created_at]);
    const csv = [headers.join(","), ...rows.map((r: any[]) => r.map((c: any) => `"${c ?? ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-foreground">Leads & Contacts</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportCSV}><Download className="w-3 h-3 mr-1" /> Export</Button>
          <Button size="sm" onClick={() => { setSelectedLead(null); setShowModal(true); }}><Plus className="w-3 h-3 mr-1" /> Add Lead</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name, email, company..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9 min-h-[40px]" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Name</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Company</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Email</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Source</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Score</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Status</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="p-3"><Skeleton className="h-8" /></td></tr>
                ))
              ) : data?.leads.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No leads found</td></tr>
              ) : (
                data?.leads.map((lead: any) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border/10 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => { setSelectedLead(lead); setShowModal(true); }}
                  >
                    <td className="p-3 font-medium text-foreground">{lead.name || "—"}</td>
                    <td className="p-3 text-muted-foreground">{lead.company || "—"}</td>
                    <td className="p-3 text-muted-foreground">{lead.email || "—"}</td>
                    <td className="p-3 text-muted-foreground">{lead.source || "—"}</td>
                    <td className="p-3"><div className="flex items-center gap-2"><LeadScoreDot score={lead.lead_score} />{lead.lead_score}</div></td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[lead.status] || "bg-muted text-muted-foreground"}`}>
                        {(lead.status || "new").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t border-border/20">
            <p className="text-xs text-muted-foreground">Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, data?.total ?? 0)} of {data?.total}</p>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft className="w-3 h-3" /></Button>
              <Button size="sm" variant="ghost" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}><ChevronRight className="w-3 h-3" /></Button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Modal */}
      <LeadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        lead={selectedLead}
        onSave={(data: any) => {
          if (selectedLead) {
            updateLead.mutate({ id: selectedLead.id, updates: data });
          } else {
            createLead.mutate(data);
          }
        }}
      />
    </div>
  );
}

function LeadModal({ open, onClose, lead, onSave }: { open: boolean; onClose: () => void; lead: any; onSave: (data: any) => void }) {
  const [form, setForm] = useState<Record<string, string>>({});

  const handleOpen = () => {
    if (lead) {
      setForm({ name: lead.name || "", email: lead.email || "", phone: lead.phone || "", company: lead.company || "", website: lead.website || "", source: lead.source || "", budget_range: lead.budget_range || "", service: lead.service || "", status: lead.status || "new", notes: lead.notes || "" });
    } else {
      setForm({ name: "", email: "", phone: "", company: "", website: "", source: "", budget_range: "", service: "", status: "new", notes: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); else handleOpen(); }}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" onOpenAutoFocus={handleOpen as any}>
        <DialogHeader>
          <DialogTitle className="font-display">{lead ? "Edit Lead" : "New Lead"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Name</Label><Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Website</Label><Input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <div><Label>Source</Label><Input value={form.source || ""} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Budget</Label>
              <Select value={form.budget_range || ""} onValueChange={(v) => setForm({ ...form, budget_range: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="<50k">Under ₹50K</SelectItem>
                  <SelectItem value="50k-1L">₹50K – 1L</SelectItem>
                  <SelectItem value="1L-5L">₹1L – 5L</SelectItem>
                  <SelectItem value="5L+">₹5L+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status || "new"} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Service</Label><Input value={form.service || ""} onChange={(e) => setForm({ ...form, service: e.target.value })} /></div>
          <div><Label>Notes</Label><Textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave(form)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
