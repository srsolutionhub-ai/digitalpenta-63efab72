import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

const EMPTY_FORM = { name: "", keywords: "", reply: "", handover: false, priority: 0 };

const BOOK_CALL_URL = "https://digitalpenta.com/book-call";

const DEFAULT_RULES = [
  { name: "Greeting", match_type: "keyword", keywords: ["hi", "hello", "hey", "good morning", "good afternoon"], reply_text: "👋 Hi! Thanks for messaging Digital Penta. How can we help — pricing, services, or book a call?", handover: false, priority: 10 },
  { name: "Pricing & services", match_type: "keyword", keywords: ["price", "pricing", "cost", "quote", "services", "seo", "packages"], reply_text: `Our packages are tailored to your goals — SEO, web design, ads and more. Book a free strategy call and we'll send a custom quote: ${BOOK_CALL_URL}`, handover: false, priority: 8 },
  { name: "Office hours", match_type: "keyword", keywords: ["hours", "open", "office hours", "when are you open"], reply_text: "We're online Mon–Fri, 9:00–18:00 (UK time). Outside those hours we'll reply as soon as we're back!", handover: false, priority: 6 },
  { name: "Talk to a human", match_type: "keyword", keywords: ["human", "agent", "talk to someone", "representative", "support"], reply_text: "Sure — connecting you with our team now. Someone will reply here shortly.", handover: true, priority: 20 },
  { name: "Book a call", match_type: "keyword", keywords: ["book", "call", "meeting", "schedule", "demo"], reply_text: `You can grab a slot that suits you here: ${BOOK_CALL_URL}`, handover: false, priority: 8 },
  { name: "Away / out of hours", match_type: "away", keywords: ["days=1,2,3,4,5", "start=09:00", "end=18:00", "tz=Europe/London"], reply_text: "Thanks for reaching out! We're outside office hours right now (Mon–Fri, 9:00–18:00 UK time) — we'll get back to you first thing. For urgent matters, book a call: " + BOOK_CALL_URL, handover: false, priority: 0 },
  { name: "Fallback (no keyword matched)", match_type: "fallback", keywords: [], reply_text: `Thanks for your message! A team member will get back to you shortly. Meanwhile, you can check our services or book a call: ${BOOK_CALL_URL}`, handover: false, priority: 0 },
];

// Mirrors the matching logic used by supabase/functions/whatsapp-webhook so the
// preview here is a faithful (but pure client-side / no-send) simulation.
function findMatchingRule(rules: any[], message: string) {
  const text = message.toLowerCase();
  if (!text) return null;
  const words = text.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const active = (rules || []).filter((r: any) => r.is_active && (r.match_type || "keyword") === "keyword");
  const hit = active.find((r: any) =>
    (r.keywords || []).some((k: string) => (k.includes(" ") ? text.includes(k) : words.includes(k)))
  );
  if (hit) return hit;
  return (rules || []).find((r: any) => r.is_active && r.match_type === "fallback") || null;
}

export default function WhatsAppBot() {
  const qc = useQueryClient();
  const [f, setF] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState("");

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

  const startEdit = (r: any) => {
    setEditingId(r.id);
    setF({ name: r.name, keywords: (r.keywords || []).join(", "), reply: r.reply_text, handover: r.handover, priority: r.priority });
  };
  const cancelEdit = () => { setEditingId(null); setF(EMPTY_FORM); };

  const save = async () => {
    const keywords = f.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    if (!f.name.trim() || !keywords.length || !f.reply.trim()) return toast.error("Name, at least one keyword and a reply are needed");
    const payload = { name: f.name.trim(), keywords, reply_text: f.reply.trim().slice(0, 1000), handover: f.handover, priority: f.priority };
    const { error } = editingId
      ? await db.from("wa_bot_rules").update(payload).eq("id", editingId)
      : await db.from("wa_bot_rules").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Rule updated" : "Rule added");
    cancelEdit();
    refresh();
  };

  const matchedRule = useMemo(() => findMatchingRule(rules, testMessage), [rules, testMessage]);

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
        <h2 className="font-semibold text-foreground">{editingId ? "Edit rule" : "New rule"}</h2>
        <div className="grid md:grid-cols-2 gap-2">
          <Input placeholder="Rule name, e.g. SEO pricing" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <Input placeholder="Keywords, comma separated: seo, 1, pricing" value={f.keywords} onChange={(e) => setF({ ...f, keywords: e.target.value })} />
        </div>
        <Textarea rows={3} placeholder="Reply text" value={f.reply} onChange={(e) => setF({ ...f, reply: e.target.value })} />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><Switch checked={f.handover} onCheckedChange={(c) => setF({ ...f, handover: c })} />Hand over to a person</label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">Priority <Input type="number" className="w-20" value={f.priority} onChange={(e) => setF({ ...f, priority: Number(e.target.value) || 0 })} /></label>
          <Button size="sm" onClick={save}>{editingId ? "Save changes" : "Add rule"}</Button>
          {editingId && <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="w-3.5 h-3.5 mr-1" />Cancel</Button>}
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
            <button aria-label={`Edit ${r.name}`} onClick={() => startEdit(r)} className="text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
            <button aria-label={`Delete ${r.name}`} onClick={async () => { await db.from("wa_bot_rules").delete().eq("id", r.id); if (editingId === r.id) cancelEdit(); refresh(); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-border/30 bg-card p-4 space-y-3">
        <h2 className="font-semibold text-foreground">Test a message</h2>
        <p className="text-xs text-muted-foreground">Type a sample inbound message to see which rule would match. This is a local preview only — nothing is sent.</p>
        <Input placeholder="e.g. What's your SEO pricing?" value={testMessage} onChange={(e) => setTestMessage(e.target.value)} />
        {testMessage.trim() && (
          matchedRule ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="text-sm text-foreground">Matched rule: <span className="font-semibold">{matchedRule.name}</span>{matchedRule.handover && <span className="ml-2 text-xs text-primary">hand-over</span>}</p>
              <p className="text-xs text-muted-foreground mt-1">Bot would reply:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{matchedRule.reply_text}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
              <p className="text-sm text-muted-foreground">No active rule matches this message — it would be routed to a human.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
