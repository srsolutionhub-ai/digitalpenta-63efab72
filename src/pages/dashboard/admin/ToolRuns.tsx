import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, Sparkles } from "lucide-react";

const TOOLS = ["growth-score", "ad-copy", "meta-tags", "blog-outline", "competitor-xray", "roi-predictor"];

export default function ToolRuns() {
  const [search, setSearch] = useState("");
  const [tool, setTool] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tool-runs", search, tool],
    queryFn: async () => {
      let q = supabase.from("tool_runs" as any).select("*").order("created_at", { ascending: false }).limit(200);
      if (tool !== "all") q = q.eq("tool", tool);
      if (search) q = q.or(`email.ilike.%${search}%,company.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const exportCSV = () => {
    if (!data?.length) return;
    const headers = ["Tool", "Email", "Company", "Created", "Inputs"];
    const rows = data.map((r: any) => [r.tool, r.email, r.company, r.created_at, JSON.stringify(r.inputs)]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c: any) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tool-runs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Tool Leads
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Visitor submissions from Growth Score, Ad Copy, Meta Tags, etc.</p>
        </div>
        <Button size="sm" variant="outline" onClick={exportCSV}><Download className="w-3 h-3 mr-1" /> Export</Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search email, company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 min-h-[40px]" />
        </div>
        <Select value={tool} onValueChange={setTool}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tools</SelectItem>
            {TOOLS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Tool</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Email</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Company</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">UTM</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="p-3"><Skeleton className="h-8" /></td></tr>
                ))
              ) : !data?.length ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No tool runs yet</td></tr>
              ) : (
                data.map((r: any) => (
                  <tr key={r.id} onClick={() => setSelected(r)} className="border-b border-border/10 hover:bg-muted/20 cursor-pointer transition-colors">
                    <td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono">{r.tool}</span></td>
                    <td className="p-3 text-foreground">{r.email || "—"}</td>
                    <td className="p-3 text-muted-foreground">{r.company || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{r.utm?.utm_source || "direct"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display capitalize">{selected?.tool} run</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{selected.email || "—"}</span></div>
                <div><span className="text-muted-foreground">Company:</span> <span className="text-foreground">{selected.company || "—"}</span></div>
              </div>
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Inputs</p>
                <pre className="bg-muted/30 rounded-lg p-3 text-xs overflow-auto">{JSON.stringify(selected.inputs, null, 2)}</pre>
              </div>
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Output</p>
                <pre className="bg-muted/30 rounded-lg p-3 text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(selected.output, null, 2)}</pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
