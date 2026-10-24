import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Send, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

/** Staff inbox for client support conversations, one thread per company. */
export default function SupportInbox() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [active, setActive] = useState<string | null>(null); // account_id
  const [reply, setReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["support-threads"],
    queryFn: async () => {
      const { data, error } = await db
        .from("support_threads")
        .select("*, accounts(name)")
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["support-thread-messages", active],
    enabled: !!active,
    queryFn: async () => {
      const { data, error } = await db
        .from("support_messages")
        .select("*")
        .eq("account_id", active)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!active) return;
    const channel = supabase
      .channel(`support-inbox-${active}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages" }, () => {
        qc.invalidateQueries({ queryKey: ["support-thread-messages", active] });
        qc.invalidateQueries({ queryKey: ["support-threads"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [active, qc]);

  const setStatus = useMutation({
    mutationFn: async ({ accountId, status }: { accountId: string; status: string }) => {
      const { error } = await db.from("support_threads").update({ status, updated_at: new Date().toISOString() }).eq("account_id", accountId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["support-threads"] });
      toast.success("Conversation updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const send = useMutation({
    mutationFn: async () => {
      if (!user || !active || !reply.trim()) return;
      // Messages need a client_id — use any client login linked to the company.
      const { data: member } = await db
        .from("account_team_members")
        .select("user_id")
        .eq("account_id", active)
        .limit(1)
        .maybeSingle();
      if (!member) throw new Error("No client login is linked to this company yet");
      const { error } = await db.from("support_messages").insert({
        account_id: active,
        client_id: member.user_id,
        sender_id: user.id,
        message: reply.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setReply("");
      qc.invalidateQueries({ queryKey: ["support-thread-messages", active] });
      qc.invalidateQueries({ queryKey: ["support-threads"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const activeThread = threads.find((t: any) => t.account_id === active);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Inbox"
        description="Client conversations, one per company. Mark resolved when done — a client reply reopens it."
        breadcrumbs={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Support" }]}
      />

      {isLoading ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : threads.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No conversations yet" description="When a client sends a support message, it appears here." />
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-4">
          {/* Thread list */}
          <div className="card-surface rounded-2xl divide-y divide-border/10 overflow-hidden">
            {threads.map((t: any) => (
              <button
                key={t.id}
                onClick={() => setActive(t.account_id)}
                className={`w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors ${active === t.account_id ? "bg-primary/10" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-medium text-sm text-foreground truncate">{t.accounts?.name ?? "Company"}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === "resolved" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {t.last_message_at ? new Date(t.last_message_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "—"}
                </p>
              </button>
            ))}
          </div>

          {/* Conversation */}
          <div className="card-surface rounded-2xl flex flex-col h-[60vh] min-h-[400px]">
            {!active ? (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Choose a conversation</div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between gap-2">
                  <p className="font-display font-semibold text-sm text-foreground">{activeThread?.accounts?.name ?? "Conversation"}</p>
                  {activeThread?.status === "resolved" ? (
                    <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ accountId: active, status: "open" })}>
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reopen
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ accountId: active, status: "resolved" })}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark resolved
                    </Button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages in this conversation.</p>}
                  {messages.map((m: any) => {
                    const isStaff = m.sender_id !== m.client_id;
                    return (
                      <div key={m.id} className={`flex ${isStaff ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isStaff ? "bg-primary/20 text-foreground" : "bg-muted/30 text-foreground"}`}>
                          <p>{m.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
                <div className="p-3 border-t border-border/20 flex gap-2">
                  <Input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply to client…"
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send.mutate()}
                    className="min-h-[44px]"
                  />
                  <Button onClick={() => send.mutate()} disabled={!reply.trim() || send.isPending} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
