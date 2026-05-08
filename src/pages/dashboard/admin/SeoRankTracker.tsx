import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SeoRankTracker() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [showLog, setShowLog] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: keywords, isLoading } = useQuery({
    queryKey: ["seo-tracked-keywords"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_tracked_keywords" as any)
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const { data: history } = useQuery({
    queryKey: ["seo-rank-history"],
    queryFn: async () => {
      const since = new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString();
      const { data } = await supabase
        .from("seo_rank_history" as any)
        .select("*")
        .gte("checked_at", since)
        .order("checked_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const byKeyword = useMemo(() => {
    const m: Record<string, any[]> = {};
    history?.forEach((r: any) => { (m[r.keyword] = m[r.keyword] || []).push(r); });
    return m;
  }, [history]);

  const addKeyword = useMutation({
    mutationFn: async (form: any) => {
      const { error } = await supabase.from("seo_tracked_keywords" as any).insert({
        keyword: form.keyword.trim(),
        service: form.service || null,
        city: form.city || null,
        target_url: form.target_url || null,
        priority: parseInt(form.priority) || 5,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo-tracked-keywords"] });
      setShowAdd(false);
      toast.success("Keyword added to tracker");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const logRank = useMutation({
    mutationFn: async ({ kw, position, url }: any) => {
      const { error } = await supabase.from("seo_rank_history" as any).insert({
        keyword: kw.keyword,
        service: kw.service,
        city: kw.city,
        position: parseInt(position),
        url: url || kw.target_url || null,
        device: "desktop",
        search_engine: "google",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo-rank-history"] });
      setShowLog(null);
      toast.success("Rank logged");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = (keywords || []).filter((k) =>
    !search || k.keyword.toLowerCase().includes(search.toLowerCase()) ||
    (k.city || "").toLowerCase().includes(search.toLowerCase()) ||
    (k.service || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">SEO Rank Tracker</h1>
          <p className="text-xs text-muted-foreground mt-1">Monitor positions for service × city keywords across the matrix.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search keyword/city" className="pl-8 h-9 w-56" />
          </div>
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-3 h-3 mr-1" /> Add Keyword</Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : !filtered.length ? (
        <div className="card-surface rounded-2xl p-12 text-center">
          <p className="text-sm text-muted-foreground">No tracked keywords yet. Add your first one to start monitoring.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((kw: any) => {
            const points = (byKeyword[kw.keyword] || []).map((r: any) => ({
              date: r.checked_at.slice(5, 10),
              position: r.position,
            }));
            const latest = points.at(-1)?.position;
            const prev = points.at(-2)?.position;
            const delta = latest != null && prev != null ? prev - latest : 0;
            return (
              <div key={kw.id} className="card-surface rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{kw.keyword}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {kw.service && <span className="mr-2">{kw.service}</span>}
                      {kw.city && <span className="mr-2">· {kw.city}</span>}
                      <span>· priority {kw.priority}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-2xl text-foreground">
                      {latest != null ? `#${latest}` : "—"}
                    </p>
                    {delta !== 0 && latest != null && prev != null && (
                      <p className={`text-[11px] flex items-center gap-1 justify-end ${delta > 0 ? "text-green-500" : delta < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {delta > 0 ? <TrendingUp className="w-3 h-3" /> : delta < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {Math.abs(delta)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="h-32 -mx-2">
                  {points.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={points}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={9} />
                        <YAxis reversed stroke="hsl(var(--muted-foreground))" fontSize={9} domain={[1, 'dataMax + 5']} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 11 }} />
                        <Line type="monotone" dataKey="position" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground">Log a rank to see trend</div>
                  )}
                </div>
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" onClick={() => setShowLog(kw.id)}>Log rank</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddKeywordDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={(f) => addKeyword.mutate(f)} />
      <LogRankDialog
        keyword={filtered.find((k: any) => k.id === showLog)}
        onClose={() => setShowLog(null)}
        onSave={(position, url) => logRank.mutate({ kw: filtered.find((k: any) => k.id === showLog), position, url })}
      />
    </div>
  );
}

function AddKeywordDialog({ open, onClose, onSave }: any) {
  const [form, setForm] = useState({ keyword: "", service: "", city: "", target_url: "", priority: "5" });
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-display">Track new keyword</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Keyword *</Label><Input value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} placeholder="seo agency dubai" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Service</Label><Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="seo" /></div>
            <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="dubai" /></div>
          </div>
          <div><Label>Target URL</Label><Input value={form.target_url} onChange={(e) => setForm({ ...form, target_url: e.target.value })} placeholder="/seo/dubai" /></div>
          <div>
            <Label>Priority (1-10)</Label>
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, i) => <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => form.keyword && onSave(form)}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LogRankDialog({ keyword, onClose, onSave }: any) {
  const [position, setPosition] = useState("");
  const [url, setUrl] = useState("");
  return (
    <Dialog open={!!keyword} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-display">Log rank for "{keyword?.keyword}"</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Position (Google desktop)</Label><Input type="number" min={1} max={100} value={position} onChange={(e) => setPosition(e.target.value)} placeholder="3" /></div>
          <div><Label>Ranking URL (optional)</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={keyword?.target_url || ""} /></div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => position && onSave(position, url)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
