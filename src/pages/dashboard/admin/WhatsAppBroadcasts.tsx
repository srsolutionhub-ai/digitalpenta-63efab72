import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Settings as SettingsIcon, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const db = supabase as any;

const STATUS_VARIANT: Record<string, any> = {
  draft: "default",
  sending: "warning",
  completed: "success",
  failed: "danger",
};

export default function WhatsAppBroadcasts() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [counting, setCounting] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["whatsapp-settings"],
    queryFn: async () => (await db.from("whatsapp_settings").select("*").maybeSingle()).data,
  });
  const isConfigured = !!settings?.phone_number_id;

  const { data: templates = [] } = useQuery({
    queryKey: ["wa-templates-approved"],
    queryFn: async () => (await db.from("whatsapp_templates").select("*").eq("meta_status", "approved").order("name")).data ?? [],
  });

  const { data: leadFacets } = useQuery({
    queryKey: ["lead-facets"],
    queryFn: async () => {
      const { data } = await db.from("leads").select("service,status,source").not("phone", "is", null).neq("phone", "").limit(5000);
      const rows = data ?? [];
      const uniq = (k: string) => Array.from(new Set(rows.map((r: any) => r[k]).filter(Boolean))).sort();
      return { services: uniq("service"), statuses: uniq("status"), sources: uniq("source") };
    },
  });

  const { data: broadcasts = [] } = useQuery({
    queryKey: ["wa-broadcasts"],
    queryFn: async () => {
      const { data } = await db
        .from("wa_broadcasts")
        .select("*, whatsapp_templates(name)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    refetchInterval: 4000,
  });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setCounting(true);
      let q = db.from("leads").select("id", { count: "exact", head: true }).not("phone", "is", null).neq("phone", "");
      if (service) q = q.eq("service", service);
      if (status) q = q.eq("status", status);
      if (source) q = q.eq("source", source);
      const { count } = await q;
      if (!cancelled) { setRecipientCount(count ?? 0); setCounting(false); }
    };
    run();
    return () => { cancelled = true; };
  }, [service, status, source]);

  const createAndSend = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Give the broadcast a name");
      if (!templateId) throw new Error("Choose an approved template");
      const audience_filter: Record<string, string> = {};
      if (service) audience_filter.service = service;
      if (status) audience_filter.status = status;
      if (source) audience_filter.source = source;

      const { data: created, error } = await db
        .from("wa_broadcasts")
        .insert({
          name: name.trim(),
          template_id: templateId,
          audience_filter,
          recipient_count: recipientCount ?? 0,
          status: "draft",
        })
        .select("id")
        .single();
      if (error) throw error;

      const { data: sendData, error: sendErr } = await supabase.functions.invoke("whatsapp-broadcast", {
        body: { broadcast_id: created.id },
      });
      if (sendErr) throw sendErr;
      if (sendData?.error) throw new Error(sendData.error);
    },
    onSuccess: () => {
      toast.success("Broadcast started");
      setName(""); setTemplateId(""); setService(""); setStatus(""); setSource("");
      qc.invalidateQueries({ queryKey: ["wa-broadcasts"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to start broadcast"),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Broadcasts"
        description="Send an approved template to a segmented list of leads."
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "WhatsApp Hub", href: "/dashboard/admin/whatsapp" },
          { label: "Broadcasts" },
        ]}
      />

      {!isConfigured && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold text-amber-200">WhatsApp not connected yet</p>
            <p className="text-xs text-muted-foreground mt-1">Connect your Meta Business account before sending broadcasts.</p>
          </div>
          <Link to="/dashboard/admin/whatsapp/setup">
            <Button size="sm" variant="outline"><SettingsIcon className="w-3.5 h-3.5 mr-1.5" /> Go to setup</Button>
          </Link>
        </div>
      )}

      <div className="card-surface rounded-xl p-6 space-y-4">
        <h3 className="font-display font-semibold text-foreground">New broadcast</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Broadcast name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Diwali offer — SEO leads" className="mt-1" disabled={!isConfigured} />
          </div>
          <div>
            <Label className="text-xs">Template (approved only)</Label>
            <select
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              disabled={!isConfigured}
            >
              <option value="">Select a template…</option>
              {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name} ({t.language})</option>)}
            </select>
            {templates.length === 0 && (
              <p className="text-[11px] text-muted-foreground mt-1">
                No approved templates yet. <Link to="/dashboard/admin/whatsapp/templates" className="text-primary hover:underline">Sync or create one</Link>.
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs">Service</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={service} onChange={(e) => setService(e.target.value)} disabled={!isConfigured}>
              <option value="">Any service</option>
              {(leadFacets?.services ?? []).map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Lead status</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)} disabled={!isConfigured}>
              <option value="">Any status</option>
              {(leadFacets?.statuses ?? []).map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Source</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={source} onChange={(e) => setSource(e.target.value)} disabled={!isConfigured}>
              <option value="">Any source</option>
              {(leadFacets?.sources ?? []).map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users2 className="w-4 h-4" />
            {counting ? "Counting…" : `${recipientCount ?? 0} lead${recipientCount === 1 ? "" : "s"} with a phone number match this audience`}
          </div>
          <Button
            onClick={() => createAndSend.mutate()}
            disabled={!isConfigured || createAndSend.isPending || !recipientCount}
          >
            <Send className="w-4 h-4 mr-1.5" /> {createAndSend.isPending ? "Starting…" : "Create & Send"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-semibold text-foreground">Past broadcasts</h3>
        {broadcasts.length === 0 ? (
          <EmptyState icon={Send} title="No broadcasts sent yet" description="Send a marketing or utility template to a segmented contact list above." />
        ) : (
          <div className="card-surface rounded-xl divide-y divide-border/10 overflow-hidden">
            {broadcasts.map((b: any) => (
              <div key={b.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Template: {b.whatsapp_templates?.name || "—"} · {b.sent_at ? new Date(b.sent_at).toLocaleString() : new Date(b.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{b.recipient_count} recipients</span>
                  <span className="text-emerald-400">{b.sent_count} sent</span>
                  {b.failed_count > 0 && <span className="text-red-400">{b.failed_count} failed</span>}
                  <StatusPill variant={STATUS_VARIANT[b.status] || "default"}>{b.status}</StatusPill>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
