import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, type Column } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

const STATUS_VARIANT: Record<string, any> = { active: "success", prospect: "info", churned: "danger", paused: "warning" };

interface Account {
  id: string; name: string; website: string | null; industry: string | null; tier: string | null;
  status: string | null; mrr: number | null; primary_contact_name: string | null; primary_contact_email: string | null;
  created_at: string | null;
}

export default function Companies() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", website: "", industry: "", tier: "standard", status: "prospect",
    primary_contact_name: "", primary_contact_email: "", phone: "", notes: "",
  });

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await db.from("accounts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Account[];
    },
  });

  const { data: projectCounts = {} } = useQuery({
    queryKey: ["companies-project-counts"],
    queryFn: async () => {
      const { data } = await db.from("projects").select("account_id");
      const counts: Record<string, number> = {};
      (data ?? []).forEach((p: any) => { if (p.account_id) counts[p.account_id] = (counts[p.account_id] || 0) + 1; });
      return counts;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) return;
      const { error } = await db.from("accounts").insert({
        name: form.name.trim(),
        website: form.website || null,
        industry: form.industry || null,
        tier: form.tier || null,
        status: form.status || null,
        primary_contact_name: form.primary_contact_name || null,
        primary_contact_email: form.primary_contact_email || null,
        phone: form.phone || null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Company added");
      setOpen(false);
      setForm({ name: "", website: "", industry: "", tier: "standard", status: "prospect", primary_contact_name: "", primary_contact_email: "", phone: "", notes: "" });
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter((a) =>
      a.name?.toLowerCase().includes(q) ||
      a.primary_contact_email?.toLowerCase().includes(q) ||
      a.industry?.toLowerCase().includes(q)
    );
  }, [accounts, search]);

  const columns: Column<Account>[] = [
    { key: "name", header: "Company", render: (a) => (
      <div>
        <p className="font-medium text-foreground">{a.name}</p>
        {a.website && <p className="text-xs text-muted-foreground">{a.website}</p>}
      </div>
    ) },
    { key: "industry", header: "Industry", render: (a) => a.industry || "—" },
    { key: "tier", header: "Tier", render: (a) => a.tier ? <span className="capitalize">{a.tier}</span> : "—" },
    { key: "status", header: "Status", render: (a) => a.status ? <StatusPill variant={STATUS_VARIANT[a.status] || "default"}>{a.status}</StatusPill> : "—" },
    { key: "mrr", header: "MRR", render: (a) => a.mrr != null ? `₹${Number(a.mrr).toLocaleString()}` : "—" },
    { key: "projects", header: "Projects", render: (a) => projectCounts[a.id] || 0 },
    { key: "contact", header: "Primary Contact", render: (a) => (
      <div>
        <p>{a.primary_contact_name || "—"}</p>
        {a.primary_contact_email && <p className="text-xs text-muted-foreground">{a.primary_contact_email}</p>}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Client accounts and prospects — the source of truth for projects, invoices and reports."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Companies" }]}
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Company
          </Button>
        }
      />

      <div className="max-w-sm">
        <Input placeholder="Search by name, industry, contact email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={accounts.length === 0 ? "No companies yet" : "No matches"}
          description={accounts.length === 0 ? "Add your first client account to start linking projects, invoices and reports." : "Try a different search term."}
          action={accounts.length === 0 ? <Button size="sm" onClick={() => setOpen(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Company</Button> : undefined}
        />
      ) : (
        <DataTable columns={columns} rows={filtered} rowKey={(a) => a.id} />
      )}

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <Link to="/dashboard/admin/deliverables" className="inline-flex items-center gap-1 hover:text-foreground"><ExternalLink className="w-3 h-3" /> Manage approvals & reports per account</Link>
        <Link to="/dashboard/admin/projects" className="inline-flex items-center gap-1 hover:text-foreground"><ExternalLink className="w-3 h-3" /> View projects</Link>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Company</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Company name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Inc." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Website</Label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://…" />
              </div>
              <div>
                <Label>Industry</Label>
                <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. SaaS" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tier</Label>
                <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Primary contact name</Label>
                <Input value={form.primary_contact_name} onChange={(e) => setForm({ ...form, primary_contact_name: e.target.value })} />
              </div>
              <div>
                <Label>Primary contact email</Label>
                <Input value={form.primary_contact_email} onChange={(e) => setForm({ ...form, primary_contact_email: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button className="w-full" onClick={() => create.mutate()} disabled={!form.name.trim() || create.isPending}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
