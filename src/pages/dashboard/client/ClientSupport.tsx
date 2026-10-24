import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react";

export default function ClientSupport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Conversation status (open / resolved) for the client's company.
  const { data: thread } = useQuery({
    queryKey: ["client-support-thread", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("support_threads").select("status").limit(1).maybeSingle();
      return data;
    },
  });
  const resolved = thread?.status === "resolved";

  const { data: messages, isLoading } = useQuery({
    queryKey: ["client-support", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // No client_id filter: access rules now cover the whole company, so
      // colleagues at the same company share one support conversation.
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("support-messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "support_messages",
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["client-support", user.id] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user || !message.trim()) return;
      const { error } = await supabase.from("support_messages").insert({
        client_id: user.id,
        sender_id: user.id,
        message: message.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["client-support", user?.id] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-foreground">Support</h1>

      <div className="card-surface rounded-2xl flex flex-col h-[60vh]">
        {resolved && (
          <div className="px-4 py-2.5 border-b border-border/20 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            This conversation is marked resolved. Send a message and it reopens automatically.
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
          ) : messages?.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No messages yet. Send a message to your account manager.</p>
          ) : (
            messages?.map((msg: any) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary/20 text-foreground" : "bg-muted/30 text-foreground"}`}>
                    <p>{msg.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-border/20 flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage.mutate()}
            className="min-h-[44px]"
          />
          <Button onClick={() => sendMessage.mutate()} disabled={!message.trim()} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
