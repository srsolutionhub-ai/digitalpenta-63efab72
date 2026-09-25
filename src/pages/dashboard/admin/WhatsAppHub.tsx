import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Search, Plus, Settings as SettingsIcon, BookTemplate, Users as UsersIcon, Clock, UserCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const db = supabase as any;

const STATUS_VARIANT: Record<string, any> = {
  open: "info",
  handover: "warning",
  closed: "default",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "handover", label: "Handover" },
  { key: "closed", label: "Closed" },
  { key: "unread", label: "Unread" },
];

const WINDOW_MS = 24 * 60 * 60 * 1000;

export default function WhatsAppHub() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedFromQuery = useRef(false);

  const { data: settings } = useQuery({
    queryKey: ["whatsapp-settings"],
    queryFn: async () => (await db.from("whatsapp_settings").select("*").maybeSingle()).data,
  });
  const isConfigured = !!settings?.phone_number_id;

  const { data: conversations = [] } = useQuery({
    queryKey: ["wa-conversations", search],
    queryFn: async () => {
      let q = db
        .from("whatsapp_conversations")
        .select("*")
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .limit(200);
      if (search) q = q.or(`contact_name.ilike.%${search}%,phone_number.ilike.%${search}%`);
      const { data } = await q;
      return data ?? [];
    },
  });

  const filteredConversations = useMemo(() => {
    if (statusFilter === "all") return conversations;
    if (statusFilter === "unread") return conversations.filter((c: any) => (c.unread_count ?? 0) > 0);
    return conversations.filter((c: any) => (c.status || "open") === statusFilter);
  }, [conversations, statusFilter]);

  const { data: messages = [] } = useQuery({
    queryKey: ["wa-messages", activeId],
    queryFn: async () => {
      if (!activeId) return [];
      const { data } = await db
        .from("whatsapp_messages_v2")
        .select("*")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
    enabled: !!activeId,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["wa-templates"],
    queryFn: async () => (await db.from("whatsapp_templates").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["wa-staff"],
    queryFn: async () => (await db.from("profiles").select("id, full_name").neq("role", "client").order("full_name")).data ?? [],
  });

  // Open (or start) a conversation from ?phone= query param, e.g. links from Leads.
  useEffect(() => {
    const phone = searchParams.get("phone");
    if (!phone || startedFromQuery.current || conversations.length === undefined) return;
    startedFromQuery.current = true;
    (async () => {
      const existing = conversations.find((c: any) => c.phone_number === phone);
      if (existing) {
        setActiveId(existing.id);
        return;
      }
      const { data: created, error } = await db
        .from("whatsapp_conversations")
        .insert({ phone_number: phone, status: "open" })
        .select("id")
        .single();
      if (error) { toast.error(error.message); return; }
      qc.invalidateQueries({ queryKey: ["wa-conversations"] });
      setActiveId(created.id);
    })();
  }, [searchParams, conversations, qc]);

  // Realtime: refresh conversation list & active thread when new rows arrive.
  useEffect(() => {
    const ch = supabase
      .channel("wa-hub")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversations" }, () => {
        qc.invalidateQueries({ queryKey: ["wa-conversations"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "whatsapp_messages_v2" }, (payload: any) => {
        if (payload.new?.conversation_id === activeId) {
          qc.invalidateQueries({ queryKey: ["wa-messages", activeId] });
        }
        qc.invalidateQueries({ queryKey: ["wa-conversations"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc, activeId]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const openConversation = async (c: any) => {
    setActiveId(c.id);
    setSelectedTemplateId("");
    if ((c.unread_count ?? 0) > 0) {
      await db.from("whatsapp_conversations").update({ unread_count: 0 }).eq("id", c.id);
      qc.invalidateQueries({ queryKey: ["wa-conversations"] });
    }
  };

  const activeConv = conversations.find((c: any) => c.id === activeId);

  const lastInboundAt = useMemo(() => {
    const inbound = messages.filter((m: any) => m.direction === "inbound");
    if (!inbound.length) return null;
    return new Date(inbound[inbound.length - 1].created_at).getTime();
  }, [messages]);

  const withinWindow = lastInboundAt ? Date.now() - lastInboundAt < WINDOW_MS : false;
  const approvedTemplates = templates.filter((t: any) => t.meta_status === "approved");

  const assignConversation = useMutation({
    mutationFn: async (assigneeId: string) => {
      if (!activeId) return;
      const { error } = await db.from("whatsapp_conversations").update({ assignee_id: assigneeId || null }).eq("id", activeId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wa-conversations"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const changeStatus = useMutation({
    mutationFn: async (status: string) => {
      if (!activeId) return;
      const { error } = await db.from("whatsapp_conversations").update({ status }).eq("id", activeId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wa-conversations"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!activeId || !draft.trim()) return;
      const { error } = await supabase.functions.invoke("whatsapp-send", {
        body: { conversation_id: activeId, body: draft.trim() },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setDraft("");
      qc.invalidateQueries({ queryKey: ["wa-messages", activeId] });
      qc.invalidateQueries({ queryKey: ["wa-conversations"] });
    },
    onError: (e: any) => toast.error(e.message || "Send failed"),
  });

  const sendTemplate = useMutation({
    mutationFn: async () => {
      if (!activeId || !selectedTemplateId) return;
      const template = templates.find((t: any) => t.id === selectedTemplateId);
      if (!template) throw new Error("Template not found");
      const { error } = await supabase.functions.invoke("whatsapp-send", {
        body: { conversation_id: activeId, body: template.body_text, template_id: template.id },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSelectedTemplateId("");
      qc.invalidateQueries({ queryKey: ["wa-messages", activeId] });
      qc.invalidateQueries({ queryKey: ["wa-conversations"] });
      toast.success("Template sent");
    },
    onError: (e: any) => toast.error(e.message || "Send failed"),
  });

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
            <Link to="/dashboard/admin/whatsapp/broadcasts">
              <Button size="sm" disabled={!isConfigured}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> New Broadcast
              </Button>
            </Link>
          </div>
        }
      />

      {!isConfigured && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold text-amber-200">WhatsApp not connected yet</p>
            <p className="text-xs text-muted-foreground mt-1">Connect your Meta Business account to send & receive messages.</p>
          </div>
          <Link to="/dashboard/admin/whatsapp/setup">
            <Button size="sm" variant="outline">Configure now</Button>
          </Link>
        </div>
      )}

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox"><MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Inbox</TabsTrigger>
          <TabsTrigger value="templates" asChild>
            <Link to="/dashboard/admin/whatsapp/templates"><BookTemplate className="w-3.5 h-3.5 mr-1.5" /> Templates</Link>
          </TabsTrigger>
          <TabsTrigger value="broadcasts" asChild>
            <Link to="/dashboard/admin/whatsapp/broadcasts"><Send className="w-3.5 h-3.5 mr-1.5" /> Broadcasts</Link>
          </TabsTrigger>
          <TabsTrigger value="bot" asChild>
            <Link to="/dashboard/admin/whatsapp/bot"><UsersIcon className="w-3.5 h-3.5 mr-1.5" /> Auto-replies</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="mt-4">
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
            {/* Conversations list */}
            <div className="col-span-4 lg:col-span-3 card-surface rounded-xl flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border/20 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input className="pl-9 h-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setStatusFilter(f.key)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        statusFilter === f.key ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">No conversations{statusFilter !== "all" ? " in this filter" : ""}</div>
                ) : (
                  filteredConversations.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => openConversation(c)}
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
                  <div className="px-4 py-3 border-b border-border/20 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display font-semibold text-sm">{activeConv?.contact_name || activeConv?.phone_number}</p>
                      <p className="text-[11px] text-muted-foreground">{activeConv?.phone_number}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md ${withinWindow ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                        <Clock className="w-3 h-3" /> {withinWindow ? "24h window open" : "Window closed — template only"}
                      </span>
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={activeConv?.status || "open"}
                        onChange={(e) => changeStatus.mutate(e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="handover">Handover</option>
                        <option value="closed">Closed</option>
                      </select>
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs max-w-[160px]"
                        value={activeConv?.assignee_id || ""}
                        onChange={(e) => assignConversation.mutate(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {staff.map((s: any) => <option key={s.id} value={s.id}>{s.full_name || "Unnamed"}</option>)}
                      </select>
                      <StatusPill variant={STATUS_VARIANT[activeConv?.status || "open"]}>{activeConv?.status || "open"}</StatusPill>
                    </div>
                  </div>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-background/50">
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
                              {m.error_message && ` · ${m.error_message}`}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-border/20 space-y-2">
                    {withinWindow ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder={isConfigured ? "Type a message…" : "Configure WhatsApp to send messages"}
                          disabled={!isConfigured}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) sendMessage.mutate(); }}
                        />
                        <Button size="icon" disabled={!isConfigured || !draft.trim() || sendMessage.isPending} onClick={() => sendMessage.mutate()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                          value={selectedTemplateId}
                          onChange={(e) => setSelectedTemplateId(e.target.value)}
                          disabled={!isConfigured}
                        >
                          <option value="">Select an approved template to re-open the chat…</option>
                          {approvedTemplates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <Button disabled={!isConfigured || !selectedTemplateId || sendTemplate.isPending} onClick={() => sendTemplate.mutate()}>
                          <Send className="w-4 h-4 mr-1.5" /> Send template
                        </Button>
                      </div>
                    )}
                    {activeConv?.assignee_id && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Assigned to {staff.find((s: any) => s.id === activeConv.assignee_id)?.full_name || "team member"}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
