import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

export default function WhatsAppBot() {
  const qc = useQueryClient();
  const [f, setF] = useState({ name: "", keywords: "", reply: "", handover: false, priority: 0 });
  const { data: rules = [] } = useQuery({
    queryKey: ["wa-bot-rules"],
    queryFn: async () => (await db.from("wa_bot_rules").select("*").order("priority", { ascending: false })).data ?? [],
  });
  const { data: stats } = useQuery({
    queryKey: ["wa-stats"],
    queryFn: async () => {
      const { data } = await db.from("whatsapp_messages_v2").select("direction,status").gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()).limit(5000);
      const rows = data ?? [];
      const out = rows.filter((r: any) => r.direction === "outbound");
      const c = (s: string) => out.filter((r: any) => r.status === s).length;
      return { inbound: rows.length - out.length, sent: out.length, delivered: c("delivered") + c("read"), read: c("read"), failed: c("failed") };
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["wa-bot-rules"] });

  const add = async () => {
    const keywords = f.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    if (!f.name.trim() || !keywords.length || !f.reply.trim()) return toast.error("Name, at least one keyword and a reply are needed");
    const { error } = await db.from("wa_bot_rules").insert({ name: f.name.trim(), keywords, reply_text: f.reply.trim().slice(0, 1000), handover: f.handover, priority: f.priority });
    if (error) return toast.error(error.message);
    setF({ name: "", keywords: "", reply: "", handover: false, priority: 0 }); refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">WhatsApp auto-replies</h1>
        <p className="text-sm text-muted-foreground">When an incoming message contains a keyword, the matching reply is sent. Hand-over rules stop the bot and flag the chat for your team.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[["Received", stats?.inbound], ["Sent", stats?.sent], ["Delivered", stats?.delivered], ["Read", stats?.read], ["Failed", stats?.failed]].map(([k, v]) => (
          <div key={k as string} className="rounded-xl border border-border/30 bg-card p-3">
            <p className="text-xs text-muted-foreground">{k} · 30 days</p><p className="text-xl font-semibold text-foreground tabular-nums">{v ?? "—"}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/30 bg-card p-4 space-y-3">
        <h2 className="font-semibold text-foreground">New rule</h2>
        <div className="grid md:grid-cols-2 gap-2">
          <Input placeholder="Rule name, e.g. SEO pricing" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <Input placeholder="Keywords, comma separated: seo, 1, pricing" value={f.keywords} onChange={(e) => setF({ ...f, keywords: e.target.value })} />
        </div>
        <Textarea rows={3} placeholder="Reply text" value={f.reply} onChange={(e) => setF({ ...f, reply: e.target.value })} />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><Switch checked={f.handover} onCheckedChange={(c) => setF({ ...f, handover: c })} />Hand over to a person</label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">Priority <Input type="number" className="w-20" value={f.priority} onChange={(e) => setF({ ...f, priority: Number(e.target.value) || 0 })} /></label>
          <Button size="sm" onClick={add}>Add rule</Button>
        </div>
      </div>

      <ul className="rounded-xl border border-border/30 bg-card divide-y divide-border/20">
        {rules.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">No rules yet</li>}
        {rules.map((r: any) => (
          <li key={r.id} className="p-3 flex items-start gap-3">
            <Switch checked={r.is_active} onCheckedChange={async (c) => { await db.from("wa_bot_rules").update({ is_active: c }).eq("id", r.id); refresh(); }} aria-label={`Turn ${r.name} on or off`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{r.name}{r.handover && <span className="ml-2 text-xs text-primary">hand-over</span>}</p>
              <p className="text-xs text-muted-foreground">Keywords: {r.keywords.join(", ")} · priority {r.priority}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{r.reply_text}</p>
            </div>
            <button aria-label={`Delete ${r.name}`} onClick={async () => { await db.from("wa_bot_rules").delete().eq("id", r.id); refresh(); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
