import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { BookTemplate, Plus, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { TemplateBuilder } from "@/components/whatsapp/TemplateBuilder";
import { toast } from "sonner";

const db = supabase as any;

const STATUS_VARIANT: Record<string, any> = {
  approved: "success",
  pending: "warning",
  draft: "default",
  rejected: "danger",
};

export default function WhatsAppTemplates() {
  const qc = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["whatsapp-settings"],
    queryFn: async () => (await db.from("whatsapp_settings").select("*").maybeSingle()).data,
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["wa-templates"],
    queryFn: async () => (await db.from("whatsapp_templates").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const isConfigured = !!settings?.phone_number_id;

  const syncFromMeta = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-templates-sync", { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Synced ${data?.synced ?? 0} template${data?.synced === 1 ? "" : "s"} from Meta`);
      qc.invalidateQueries({ queryKey: ["wa-templates"] });
    } catch (e: any) {
      toast.error(e.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Templates"
        description="Message templates approved by Meta for marketing, utility & authentication messages."
        breadcrumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "WhatsApp Hub", href: "/dashboard/admin/whatsapp" },
          { label: "Templates" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={syncFromMeta} disabled={!isConfigured || syncing}>
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`} /> Sync from Meta
            </Button>
            <Button size="sm" onClick={() => { setEditingTemplate(null); setShowBuilder(true); }}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New Template
            </Button>
          </div>
        }
      />

      {!isConfigured && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold text-amber-200">WhatsApp not connected yet</p>
            <p className="text-xs text-muted-foreground mt-1">Connect your Meta Business account to sync live templates and their approval status.</p>
          </div>
          <Link to="/dashboard/admin/whatsapp/setup">
            <Button size="sm" variant="outline"><SettingsIcon className="w-3.5 h-3.5 mr-1.5" /> Go to setup</Button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading templates…</div>
      ) : templates.length === 0 ? (
        <EmptyState
          icon={BookTemplate}
          title="No templates yet"
          description={isConfigured ? "Create a template here, or sync approved templates already created in Meta Business Manager." : "Templates are pre-approved by Meta and used for marketing & utility messages."}
          action={<Button size="sm" onClick={() => { setEditingTemplate(null); setShowBuilder(true); }}><Plus className="w-3.5 h-3.5 mr-1.5" /> Create Template</Button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t: any) => (
            <button
              key={t.id}
              onClick={() => { setEditingTemplate(t); setShowBuilder(true); }}
              className="card-surface rounded-xl p-4 space-y-2 text-left hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <StatusPill variant={STATUS_VARIANT[t.meta_status] || "default"}>{t.meta_status || "draft"}</StatusPill>
              </div>
              <p className="text-[11px] uppercase text-muted-foreground tracking-wide">{t.category} · {t.language}</p>
              <p className="text-xs text-muted-foreground line-clamp-3">{t.body_text}</p>
              {t.meta_template_id && <p className="text-[10px] text-muted-foreground/70 font-mono">meta id: {t.meta_template_id}</p>}
            </button>
          ))}
        </div>
      )}

      <TemplateBuilder open={showBuilder} onClose={() => setShowBuilder(false)} template={editingTemplate} />
    </div>
  );
}
