import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { Plus, Search, Building2, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Stage {
  id: string;
  name: string;
  position: number;
  color: string;
  is_won?: boolean;
  is_lost?: boolean;
}
interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage_id: string;
  service_interest?: string;
  notes?: string;
  contact_id?: string;
  audit_id?: string;
  account_id?: string;
}

export default function CrmPipeline() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState<{ dealId: string } | null>(null);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: stages = [] } = useQuery<Stage[]>({
    queryKey: ["pipeline-stages"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_pipeline_stages").select("*").order("position");
      return (data ?? []) as Stage[];
    },
  });

  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ["pipeline-deals", search],
    queryFn: async () => {
      let q = supabase.from("crm_deals").select("*").order("created_at", { ascending: false }).limit(500);
      if (search) q = q.ilike("title", `%${search}%`);
      const { data } = await q;
      return (data ?? []) as Deal[];
    },
  });

  const moveStage = useMutation({
    mutationFn: async ({ id, stage_id }: { id: string; stage_id: string }) => {
      const { error } = await supabase.from("crm_deals").update({ stage_id, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pipeline-deals"] }),
  });

  const handleDrop = (stageId: string) => {
    if (drag) {
      moveStage.mutate({ id: drag.dealId, stage_id: stageId });
      setDrag(null);
    }
  };

  const dealsByStage = (sid: string) => deals.filter((d) => d.stage_id === sid);
  const totalValue = (sid: string) => dealsByStage(sid).reduce((s, d) => s + Number(d.value || 0), 0);

  const won = deals.filter((d) => stages.find((s) => s.id === d.stage_id)?.is_won).reduce((s, d) => s + Number(d.value || 0), 0);
  const open = deals.filter((d) => {
    const s = stages.find((x) => x.id === d.stage_id);
    return s && !s.is_won && !s.is_lost;
  }).reduce((s, d) => s + Number(d.value || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Pipeline"
        description="Drag deals between stages. Live revenue forecasting at a glance."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Pipeline" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu
              filename={`pipeline-forecast-${new Date().toISOString().slice(0, 10)}`}
              title="Sales Pipeline Forecast"
              subtitle={`Open ₹${(open / 100000).toFixed(1)}L · Won ₹${(won / 100000).toFixed(1)}L`}
              rows={deals.map((d) => {
                const stage = stages.find((s) => s.id === d.stage_id);
                return {
                  Title: d.title,
                  Stage: stage?.name ?? "—",
                  Service: d.service_interest ?? "",
                  Value: Number(d.value),
                  Currency: d.currency,
                  Status: stage?.is_won ? "Won" : stage?.is_lost ? "Lost" : "Open",
                };
              })}
            />
            <Button size="sm" onClick={() => setShowCreate(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> New Deal</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Open Pipeline" value={`₹${(open / 100000).toFixed(1)}L`} />
        <Stat label="Won (lifetime)" value={`₹${(won / 100000).toFixed(1)}L`} />
        <Stat label="Open Deals" value={String(deals.length - deals.filter((d) => stages.find((s) => s.id === d.stage_id)?.is_won || stages.find((s) => s.id === d.stage_id)?.is_lost).length)} />
        <Stat label="Win Rate" value={`${deals.length ? Math.round((deals.filter((d) => stages.find((s) => s.id === d.stage_id)?.is_won).length / deals.length) * 100) : 0}%`} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input className="pl-9 max-w-sm" placeholder="Search deals…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {stages.map((stage) => (
            <div
              key={stage.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
              className="w-72 flex-shrink-0 rounded-xl bg-card/40 border border-border/20 flex flex-col"
            >
              <div className="px-3 py-2.5 border-b border-border/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                  <p className="font-display font-semibold text-sm">{stage.name}</p>
                  <span className="text-[10px] text-muted-foreground">{dealsByStage(stage.id).length}</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">₹{(totalValue(stage.id) / 1000).toFixed(0)}k</p>
              </div>
              <div className="flex-1 p-2 space-y-2 min-h-[400px]">
                {dealsByStage(stage.id).map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => setDrag({ dealId: deal.id })}
                    onClick={() => setEditing(deal)}
                    className="rounded-lg bg-card border border-border/30 p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors"
                  >
                    <p className="font-display font-medium text-sm text-foreground line-clamp-2 mb-1">{deal.title}</p>
                    {deal.service_interest && <p className="text-[11px] text-muted-foreground">{deal.service_interest}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-mono text-xs text-primary font-semibold">₹{Number(deal.value).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {dealsByStage(stage.id).length === 0 && (
                  <p className="text-[11px] text-muted-foreground text-center py-8">Drop deals here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DealEditor
        deal={editing}
        stages={stages}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSaved={() => qc.invalidateQueries({ queryKey: ["pipeline-deals"] })}
      />
      <DealEditor
        deal={null}
        stages={stages}
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSaved={() => qc.invalidateQueries({ queryKey: ["pipeline-deals"] })}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-2xl text-foreground mt-1">{value}</p>
    </div>
  );
}

function DealEditor({ deal, stages, open, onClose, onSaved }: { deal: Deal | null; stages: Stage[]; open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({});

  const handleOpen = () => {
    if (deal) setForm(deal);
    else setForm({ title: "", value: 0, currency: "INR", stage_id: stages[0]?.id, service_interest: "", notes: "" });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        value: Number(form.value || 0),
        currency: form.currency || "INR",
        stage_id: form.stage_id,
        service_interest: form.service_interest || null,
        notes: form.notes || null,
      };
      if (deal?.id) {
        const { error } = await supabase.from("crm_deals").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", deal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("crm_deals").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Deal saved");
      onSaved();
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); else handleOpen(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display">{deal ? "Edit Deal" : "New Deal"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Value (₹)</Label><Input type="number" value={form.value || 0} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
            <div>
              <Label>Stage</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.stage_id || ""} onChange={(e) => setForm({ ...form, stage_id: e.target.value })}>
                {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div><Label>Service Interest</Label><Input value={form.service_interest || ""} onChange={(e) => setForm({ ...form, service_interest: e.target.value })} placeholder="SEO, PPC, Web Design…" /></div>
          <div><Label>Notes</Label><Textarea rows={3} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
