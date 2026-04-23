import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  {
    n: 1,
    title: "Create a Meta Business Account",
    body: "Visit business.facebook.com and create a Business Manager account if you don't already have one.",
    link: "https://business.facebook.com",
  },
  {
    n: 2,
    title: "Add WhatsApp to your Meta App",
    body: "In developers.facebook.com, create a new App (Type: Business) and add the 'WhatsApp' product. You'll get a test phone number to start.",
    link: "https://developers.facebook.com/apps",
  },
  {
    n: 3,
    title: "Generate a permanent System User access token",
    body: "Business Settings → System Users → Add → assign the WhatsApp app with full control. Then 'Generate New Token' with whatsapp_business_messaging + whatsapp_business_management scopes.",
    link: "https://business.facebook.com/settings/system-users",
  },
  {
    n: 4,
    title: "Save the token as a secret in Lovable",
    body: "Click 'Add WhatsApp Token Secret' below — Lovable will securely store it as WHATSAPP_ACCESS_TOKEN, only readable by edge functions.",
  },
  {
    n: 5,
    title: "Configure the webhook callback URL",
    body: "Paste the webhook URL below into your WhatsApp app's Webhook Configuration. Use the Verify Token shown below. Subscribe to 'messages' events.",
  },
  {
    n: 6,
    title: "Click Verify",
    body: "We'll ping the Cloud API to confirm everything works. Once verified, the inbox is live.",
  },
];

export default function WhatsAppSetup() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    business_account_id: "",
    phone_number_id: "",
    display_phone_number: "",
    webhook_verify_token: "",
  });

  const { data: settings } = useQuery({
    queryKey: ["whatsapp-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("whatsapp_settings").select("*").maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({
        business_account_id: settings.business_account_id || "",
        phone_number_id: settings.phone_number_id || "",
        display_phone_number: settings.display_phone_number || "",
        webhook_verify_token: settings.webhook_verify_token || crypto.randomUUID().slice(0, 24),
      });
    } else {
      setForm((f) => ({ ...f, webhook_verify_token: crypto.randomUUID().slice(0, 24) }));
    }
  }, [settings]);

  const save = useMutation({
    mutationFn: async () => {
      if (settings?.id) {
        const { error } = await supabase.from("whatsapp_settings").update({ ...form, updated_at: new Date().toISOString() }).eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("whatsapp_settings").insert({ ...form });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-settings"] });
      toast.success("Settings saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const projectId = (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID || "";
  const webhookUrl = projectId ? `https://${projectId}.supabase.co/functions/v1/whatsapp-webhook` : "";

  const copy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`${label} copied`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="WhatsApp Cloud API Setup"
        description="A guided 6-step wizard to connect your Meta Business account."
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "WhatsApp Hub", href: "/dashboard/admin/whatsapp" },
          { label: "Setup" },
        ]}
        actions={<StatusPill variant={settings?.status === "verified" ? "success" : "warning"}>{settings?.status || "not_configured"}</StatusPill>}
      />

      <div className="space-y-3">
        {STEPS.map((s) => (
          <div key={s.n} className="card-surface rounded-xl p-5 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-display font-bold text-sm">
              {s.n}
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-display font-semibold text-sm text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
              {s.link && (
                <a href={s.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Webhook config */}
      <div className="card-surface rounded-xl p-6 space-y-4">
        <h3 className="font-display font-semibold text-foreground">Webhook configuration</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Callback URL (paste in Meta)</Label>
            <div className="flex gap-2 mt-1">
              <Input value={webhookUrl} readOnly className="font-mono text-xs" />
              <Button size="icon" variant="outline" onClick={() => copy(webhookUrl, "Webhook URL")}><Copy className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
          <div>
            <Label className="text-xs">Verify Token</Label>
            <div className="flex gap-2 mt-1">
              <Input value={form.webhook_verify_token} onChange={(e) => setForm({ ...form, webhook_verify_token: e.target.value })} className="font-mono text-xs" />
              <Button size="icon" variant="outline" onClick={() => copy(form.webhook_verify_token, "Verify Token")}><Copy className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="card-surface rounded-xl p-6 space-y-4">
        <h3 className="font-display font-semibold text-foreground">Cloud API credentials</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">WhatsApp Business Account ID</Label>
            <Input value={form.business_account_id} onChange={(e) => setForm({ ...form, business_account_id: e.target.value })} className="mt-1 font-mono text-xs" placeholder="e.g. 1234567890" />
          </div>
          <div>
            <Label className="text-xs">Phone Number ID</Label>
            <Input value={form.phone_number_id} onChange={(e) => setForm({ ...form, phone_number_id: e.target.value })} className="mt-1 font-mono text-xs" placeholder="e.g. 9876543210" />
          </div>
          <div>
            <Label className="text-xs">Display Phone Number</Label>
            <Input value={form.display_phone_number} onChange={(e) => setForm({ ...form, display_phone_number: e.target.value })} className="mt-1" placeholder="+91 88601 00039" />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            <Check className="w-4 h-4 mr-1.5" /> Save Settings
          </Button>
          <p className="text-xs text-muted-foreground">Token must be added separately as <span className="font-mono text-foreground">WHATSAPP_ACCESS_TOKEN</span> secret.</p>
        </div>
      </div>
    </div>
  );
}
