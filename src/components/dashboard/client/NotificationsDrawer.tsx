/**
 * Notifications drawer for the client portal.
 * Reads from `notifications` table (RLS: user sees their own).
 * Marks all as read on open.
 */
import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  type: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

export default function NotificationsDrawer() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: items = [] } = useQuery<Notification[]>({
    queryKey: ["client-notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, body, type, link, read, created_at")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
  });

  const unread = items.filter((n) => !n.read).length;

  // Mark as read after opening
  useEffect(() => {
    if (!open || unread === 0 || !user) return;
    const ids = items.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;
    supabase
      .from("notifications")
      .update({ read: true })
      .in("id", ids)
      .then(() => {
        qc.invalidateQueries({ queryKey: ["client-notifications", user.id] });
      });
  }, [open, unread, items, user, qc]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}>
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-display font-bold flex items-center justify-center"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(380px,100vw)] flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display">Notifications</SheetTitle>
          <SheetDescription className="text-xs">
            Updates from your account manager and the Digital Penta team.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-4 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground space-y-2">
              <Bell className="w-7 h-7 mx-auto opacity-50" aria-hidden />
              <p className="text-sm">You're all caught up.</p>
            </div>
          ) : (
            items.map((n) => (
              <a
                key={n.id}
                href={n.link ?? "#"}
                target={n.link?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`block p-3 rounded-lg border transition-colors ${
                  n.read
                    ? "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]"
                    : "bg-primary/[0.06] border-primary/20 hover:bg-primary/[0.10]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-display font-semibold text-foreground leading-snug">{n.title}</p>
                  {!n.read && (
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-label="Unread" />
                  )}
                </div>
                {n.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>}
                <p className="text-[10px] font-mono text-muted-foreground/70 mt-1.5">
                  {new Date(n.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </a>
            ))
          )}
        </div>

        {unread > 0 && (
          <div className="pt-3 border-t border-white/[0.05]">
            <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Check className="w-3 h-3" /> Marked as read
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
