import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Search, Plus, Settings as SettingsIcon, BookTemplate, Users as UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_VARIANT: Record<string, any> = {
  open: "info",
  pending: "warning",
  resolved: "success",
  closed: "default",
};

export default function WhatsAppHub() {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: settings } = useQuery({
    queryKey: ["whatsapp-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("whatsapp_settings").select("*").maybeSingle();
      return data;
    },
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["wa-conversations", search],
    queryFn: async () => {
      let q = supabase
        .from("whatsapp_conversations")
        .select("*")
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .limit(100);
      if (search) q = q.or(`contact_name.ilike.%${search}%,phone_number.ilike.%${search}%`);
      const { data } = await q;
      return data ?? [];
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["wa-messages", activeId],
    queryFn: async () => {
      if (!activeId) return [];
      const { data } = await supabase
        .from("whatsapp_messages_v2")
        .select("*")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
    enabled: !!activeId,
    refetchInterval: 5000,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["wa-templates"],
    queryFn: async () => {
      const { data } = await supabase.from("whatsapp_templates").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const isConfigured = settings?.status === "verified";

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Hub"
        description="Marketing, support and broadcast — all from one inbox."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "WhatsApp Hub" }]}
        actions={
          <div className="flex gap-2">
            <Link to="/dashboard/admin/whatsapp/setup">
              <Button size="sm" variant="outline"><SettingsIcon className="w-3.5 h-3.5 mr-1.5" /> Setup</Button>
            </Link>
            <Button size="sm" disabled={!isConfigured}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New Broadcast
            </Button>
          </div>
        }
      />

      {!isConfigured && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold text-amber-200">WhatsApp Cloud API not configured</p>
            <p className="text-xs text-muted-foreground mt-1">Connect your Meta Business account to send & receive messages. Inbox below shows demo data only.</p>
          </div>
          <Link to="/dashboard/admin/whatsapp/setup">
            <Button size="sm" variant="outline">Configure now</Button>
          </Link>
        </div>
      )}

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox"><MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Inbox</TabsTrigger>
          <TabsTrigger value="templates"><BookTemplate className="w-3.5 h-3.5 mr-1.5" /> Templates</TabsTrigger>
          <TabsTrigger value="broadcasts"><Send className="w-3.5 h-3.5 mr-1.5" /> Broadcasts</TabsTrigger>
          <TabsTrigger value="contacts"><UsersIcon className="w-3.5 h-3.5 mr-1.5" /> Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-4">
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
            {/* Conversations list */}
            <div className="col-span-4 lg:col-span-3 card-surface rounded-xl flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input className="pl-9 h-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">No conversations yet</div>
                ) : (
                  conversations.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveId(c.id)}
                      className={`w-full text-left px-3 py-2.5 border-b border-border/10 transition-colors ${
                        activeId === c.id ? "bg-primary/10" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium text-foreground truncate">{c.contact_name || c.phone_number}</p>
                        {c.unread_count > 0 && (
                          <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{c.unread_count}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{c.last_message_text || "No messages yet"}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Active conversation */}
            <div className="col-span-8 lg:col-span-9 card-surface rounded-xl flex flex-col overflow-hidden">
              {!activeId ? (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState icon={MessageCircle} title="Select a conversation" description="Pick a chat from the list to start messaging." />
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
                    {(() => {
                      const c = conversations.find((x: any) => x.id === activeId);
                      return (
                        <>
                          <div>
                            <p className="font-display font-semibold text-sm">{c?.contact_name || c?.phone_number}</p>
                            <p className="text-[11px] text-muted-foreground">{c?.phone_number}</p>
                          </div>
                          <StatusPill variant={STATUS_VARIANT[c?.status || "open"]}>{c?.status || "open"}</StatusPill>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background/50">
                    {messages.length === 0 ? (
                      <p className="text-center text-xs text-muted-foreground py-12">No messages in this thread.</p>
                    ) : (
                      messages.map((m: any) => (
                        <div key={m.id} className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
                            m.direction === "outbound" ? "bg-primary text-primary-foreground" : "bg-card border border-border/20 text-foreground"
                          }`}>
                            <p>{m.body}</p>
                            <p className={`text-[10px] mt-1 ${m.direction === "outbound" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              {m.status && ` · ${m.status}`}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-border/20 flex gap-2">
                    <Input placeholder={isConfigured ? "Type a message…" : "Configure WhatsApp to send messages"} disabled={!isConfigured} />
                    <Button size="icon" disabled={!isConfigured}><Send className="w-4 h-4" /></Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3">
                <EmptyState
                  icon={BookTemplate}
                  title="No templates yet"
                  description="Templates are pre-approved by Meta and used for marketing & utility messages."
                  action={<Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> Create Template</Button>}
                />
              </div>
            ) : (
              templates.map((t: any) => (
                <div key={t.id} className="card-surface rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-semibold">{t.name}</p>
                    <StatusPill variant={t.meta_status === "approved" ? "success" : "warning"}>{t.meta_status || "draft"}</StatusPill>
                  </div>
                  <p className="text-[11px] uppercase text-muted-foreground tracking-wide">{t.category} · {t.language}</p>
                  <p className="text-xs text-muted-foreground line-clamp-3">{t.body_text}</p>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="broadcasts" className="mt-4">
          <EmptyState
            icon={Send}
            title="No broadcasts sent yet"
            description="Send a marketing or utility template to a segmented contact list."
            action={<Button size="sm" disabled={!isConfigured}><Plus className="w-3.5 h-3.5 mr-1.5" /> New Broadcast</Button>}
          />
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <div className="card-surface rounded-xl p-6 text-sm text-muted-foreground">
            Contact lists & segmentation will appear here. Connect your Meta WhatsApp Business account first.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
