import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const db = supabase as any;
const PROVIDERS = [
  { id: "ga4", name: "Google Analytics 4", hint: "Measurement ID, e.g. G-XXXXXXX", pattern: /^G-[A-Z0-9]{4,}$/ },
  { id: "gtm", name: "Google Tag Manager", hint: "Container ID, e.g. GTM-XXXXXX", pattern: /^GTM-[A-Z0-9]{4,}$/ },
  { id: "meta_pixel", name: "Meta Pixel", hint: "Pixel ID (numbers only)", pattern: /^\d{8,20}$/ },
  { id: "linkedin", name: "LinkedIn Insight Tag", hint: "Partner ID (numbers only)", pattern: /^\d{4,12}$/ },
];

export default function Integrations() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => (await db.from("integration_settings").select("*")).data ?? [],
  });
  const [draft, setDraft] = useState<Record<string, { id: string; enabled: boolean }>>({});
  useEffect(() => {
    const d: any = {};
    PROVIDERS.forEach((p) => { const r = rows.find((x: any) => x.provider === p.id); d[p.id] = { id: r?.public_id ?? "", enabled: !!r?.enabled }; });
    setDraft(d);
  }, [rows]);

  const save = async (pid: string) => {
    const p = PROVIDERS.find((x) => x.id === pid)!;
    const v = draft[pid];
    if (v.id && !p.pattern.test(v.id.trim())) return toast.error(`That doesn't look like a valid ${p.name} ID`);
    const { error } = await db.from("integration_settings").upsert({ provider: pid, public_id: v.id.trim() || null, enabled: v.enabled && !!v.id.trim() }, { onConflict: "provider" });
    if (error) return toast.error(error.message);
    toast.success(`${p.name} saved`);
    qc.invalidateQueries({ queryKey: ["integrations"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Tracking integrations</h1>
        <p className="text-sm text-muted-foreground">Add IDs when you're ready. Tags only load for visitors who accept analytics or marketing cookies.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {PROVIDERS.map((p) => {
          const v = draft[p.id] ?? { id: "", enabled: false };
          const saved = rows.find((x: any) => x.provider === p.id);
          return (
            <div key={p.id} className="rounded-xl border border-border/30 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">{p.name}</h2>
                <span className={`text-xs ${saved?.enabled ? "text-primary" : "text-muted-foreground"}`}>{saved?.enabled ? "Connected" : "Not connected"}</span>
              </div>
              <Input placeholder={p.hint} value={v.id} onChange={(e) => setDraft({ ...draft, [p.id]: { ...v, id: e.target.value } })} />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Switch checked={v.enabled} onCheckedChange={(c) => setDraft({ ...draft, [p.id]: { ...v, enabled: c } })} />Turn on
                </label>
                <Button size="sm" onClick={() => save(p.id)}>Save</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
