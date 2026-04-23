// WhatsApp template builder dialog with header/body/footer/buttons,
// live preview matching WhatsApp UI, and Meta submission state tracking.
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["MARKETING", "UTILITY", "AUTHENTICATION"];
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "en_US", label: "English (US)" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
];

interface TemplateButton { type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER"; text: string; url?: string; phone?: string; }
interface FormShape {
  name: string;
  category: string;
  language: string;
  header_text: string;
  body_text: string;
  footer_text: string;
  buttons: TemplateButton[];
  meta_status: string;
}

const empty: FormShape = {
  name: "",
  category: "MARKETING",
  language: "en",
  header_text: "",
  body_text: "",
  footer_text: "",
  buttons: [],
  meta_status: "draft",
};

export function TemplateBuilder({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template?: any | null;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormShape>(empty);

  useEffect(() => {
    if (template) {
      setForm({
        name: template.name || "",
        category: template.category || "MARKETING",
        language: template.language || "en",
        header_text: template.header_text || "",
        body_text: template.body_text || "",
        footer_text: template.footer_text || "",
        buttons: Array.isArray(template.buttons) ? template.buttons : [],
        meta_status: template.meta_status || "draft",
      });
    } else {
      setForm(empty);
    }
  }, [template, open]);

  const save = useMutation({
    mutationFn: async () => {
      // Meta requires lowercase, snake_case names
      const safeName = form.name.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 60);
      const payload: any = {
        name: safeName,
        category: form.category,
        language: form.language,
        header_text: form.header_text || null,
        body_text: form.body_text,
        footer_text: form.footer_text || null,
        buttons: form.buttons.length ? (form.buttons as any) : null,
        meta_status: form.meta_status,
      };
      if (template?.id) {
        const { error } = await supabase.from("whatsapp_templates").update(payload).eq("id", template.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("whatsapp_templates").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Template saved");
      qc.invalidateQueries({ queryKey: ["wa-templates"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const submitToMeta = useMutation({
    mutationFn: async () => {
      if (!template?.id) throw new Error("Save the template first");
      // Mark as submitted; actual Meta API submission happens in an edge function
      // when WhatsApp credentials are configured. For now we record the intent.
      const { error } = await supabase
        .from("whatsapp_templates")
        .update({ meta_status: "pending" })
        .eq("id", template.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Submitted for Meta review");
      qc.invalidateQueries({ queryKey: ["wa-templates"] });
      setForm((f) => ({ ...f, meta_status: "pending" }));
    },
    onError: (e: any) => toast.error(e.message),
  });

  const addButton = () => {
    if (form.buttons.length >= 3) return toast.error("Max 3 buttons per template");
    setForm({ ...form, buttons: [...form.buttons, { type: "QUICK_REPLY", text: "" }] });
  };
  const updateButton = (i: number, patch: Partial<TemplateButton>) => {
    const next = [...form.buttons];
    next[i] = { ...next[i], ...patch };
    setForm({ ...form, buttons: next });
  };
  const removeButton = (i: number) => setForm({ ...form, buttons: form.buttons.filter((_, idx) => idx !== i) });

  const placeholders = (form.body_text.match(/\{\{(\d+)\}\}/g) || []).length;
  const statusVariant = form.meta_status === "approved" ? "success" : form.meta_status === "rejected" ? "danger" : "warning";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="font-display">{template ? "Edit Template" : "New WhatsApp Template"}</DialogTitle>
            <StatusPill variant={statusVariant}>{form.meta_status}</StatusPill>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Template name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="welcome_offer"
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Lowercase, underscores only</p>
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <select
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Language</Label>
              <select
                className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
              >
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            <div>
              <Label className="text-xs">Header (optional)</Label>
              <Input
                value={form.header_text}
                onChange={(e) => setForm({ ...form, header_text: e.target.value })}
                placeholder="A short attention-grabbing header"
                maxLength={60}
              />
            </div>

            <div>
              <Label className="text-xs">Body *</Label>
              <Textarea
                rows={5}
                value={form.body_text}
                onChange={(e) => setForm({ ...form, body_text: e.target.value })}
                placeholder="Hi {{1}}, your order #{{2}} has been shipped!"
                maxLength={1024}
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                {form.body_text.length}/1024 chars · {placeholders} variable{placeholders !== 1 ? "s" : ""} (use {"{{1}}"}, {"{{2}}"}…)
              </p>
            </div>

            <div>
              <Label className="text-xs">Footer (optional)</Label>
              <Input
                value={form.footer_text}
                onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
                placeholder="Reply STOP to unsubscribe"
                maxLength={60}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Buttons (max 3)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addButton}>
                  <Plus className="w-3 h-3 mr-1" /> Add button
                </Button>
              </div>
              {form.buttons.map((b, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded-md bg-muted/20">
                  <select
                    className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                    value={b.type}
                    onChange={(e) => updateButton(i, { type: e.target.value as any })}
                  >
                    <option value="QUICK_REPLY">Quick reply</option>
                    <option value="URL">URL</option>
                    <option value="PHONE_NUMBER">Call</option>
                  </select>
                  <Input
                    placeholder="Button text"
                    className="h-9 text-xs"
                    value={b.text}
                    maxLength={25}
                    onChange={(e) => updateButton(i, { text: e.target.value })}
                  />
                  {b.type === "URL" && (
                    <Input placeholder="https://…" className="h-9 text-xs" value={b.url || ""} onChange={(e) => updateButton(i, { url: e.target.value })} />
                  )}
                  {b.type === "PHONE_NUMBER" && (
                    <Input placeholder="+91…" className="h-9 text-xs" value={b.phone || ""} onChange={(e) => updateButton(i, { phone: e.target.value })} />
                  )}
                  <Button type="button" size="icon" variant="ghost" onClick={() => removeButton(i)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <Label className="text-xs">Live preview</Label>
            <div className="rounded-2xl bg-[#0c1418] p-4 border border-border/30 min-h-[420px] flex flex-col">
              <div className="self-start max-w-[85%] rounded-2xl rounded-tl-sm bg-[#1f2c33] px-3 py-2 text-sm text-white shadow-sm">
                {form.header_text && <p className="font-semibold text-sm mb-1">{form.header_text}</p>}
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
                  {form.body_text || <span className="text-white/40 italic">Body text will appear here…</span>}
                </p>
                {form.footer_text && <p className="text-[11px] text-white/50 mt-2">{form.footer_text}</p>}
                <p className="text-[10px] text-white/40 text-right mt-1">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓
                </p>
              </div>
              {form.buttons.length > 0 && (
                <div className="mt-2 space-y-1 max-w-[85%]">
                  {form.buttons.map((b, i) => (
                    <button key={i} className="block w-full text-center text-[#00a884] text-sm py-2 bg-[#1f2c33] rounded-lg border-t border-white/5">
                      {b.text || `Button ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] text-white/40">
                <MessageSquare className="w-3 h-3" /> WhatsApp Business
              </div>
            </div>

            <div className="rounded-lg bg-muted/20 p-3 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Meta review status</p>
              <p className="text-xs text-foreground capitalize">{form.meta_status}</p>
              <p className="text-[10px] text-muted-foreground">
                {form.meta_status === "approved" && "Template is live and can be used in broadcasts."}
                {form.meta_status === "pending" && "Awaiting Meta review (typically &lt; 1 hour for utility, up to 24h for marketing)."}
                {form.meta_status === "rejected" && "Meta rejected this template — adjust the copy and resubmit."}
                {form.meta_status === "draft" && "Save the template, then submit for Meta approval."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border/20">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {template?.id && form.meta_status === "draft" && (
            <Button variant="outline" onClick={() => submitToMeta.mutate()} disabled={submitToMeta.isPending}>
              Submit for Meta review
            </Button>
          )}
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.name || !form.body_text}>
            Save template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
