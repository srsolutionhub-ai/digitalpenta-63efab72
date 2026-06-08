import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, MessageCircle, FileText, UserPlus, TrendingUp } from "lucide-react";

type Event = {
  id: string;
  kind: "lead" | "chat" | "proposal" | "audit";
  label: string;
  meta?: string;
  ts: string;
};

const ICONS: Record<Event["kind"], any> = {
  lead: UserPlus,
  chat: MessageCircle,
  proposal: FileText,
  audit: TrendingUp,
};
const TONES: Record<Event["kind"], string> = {
  lead: "text-emerald-400 bg-emerald-500/10",
  chat: "text-primary bg-primary/10",
  proposal: "text-sky-400 bg-sky-500/10",
  audit: "text-amber-400 bg-amber-500/10",
};

function relTime(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return `${Math.floor(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function LiveActivityTicker() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [contacts, sessions, quotes, audits] = await Promise.all([
        supabase.from("contacts").select("id,name,source,service,created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("ai_chat_sessions").select("id,summary,lead_qualified,created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("quotations").select("id,quote_number,client_name,total,created_at,source").order("created_at", { ascending: false }).limit(6),
        supabase.from("audits").select("id,website_url,overall_score,created_at").order("created_at", { ascending: false }).limit(6),
      ]);

      const merged: Event[] = [
        ...(contacts.data ?? []).map((c: any) => ({
          id: `lead-${c.id}`,
          kind: "lead" as const,
          label: `${c.name || "New lead"} · ${c.service || c.source || "inbound"}`,
          meta: c.source,
          ts: c.created_at,
        })),
        ...(sessions.data ?? []).map((s: any) => ({
          id: `chat-${s.id}`,
          kind: "chat" as const,
          label: s.lead_qualified ? "Penta AI qualified a visitor" : "Penta AI chat started",
          meta: s.summary?.slice(0, 60),
          ts: s.created_at,
        })),
        ...(quotes.data ?? []).map((q: any) => ({
          id: `prop-${q.id}`,
          kind: "proposal" as const,
          label: `Proposal ${q.quote_number} · ${q.client_name}`,
          meta: q.source === "proposal_builder" ? "auto-built" : "manual",
          ts: q.created_at,
        })),
        ...(audits.data ?? []).map((a: any) => ({
          id: `audit-${a.id}`,
          kind: "audit" as const,
          label: `SEO audit · ${a.website_url?.replace(/^https?:\/\//, "").slice(0, 30)}`,
          meta: a.overall_score != null ? `score ${a.overall_score}` : undefined,
          ts: a.created_at,
        })),
      ]
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
        .slice(0, 20);

      if (!cancelled) setEvents(merged);
    }

    load();
    const id = setInterval(load, 30000); // refresh every 30s
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (events.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
          <h3 className="font-display font-semibold text-sm">Live activity</h3>
        </div>
        <p className="text-xs text-muted-foreground">Waiting for events…</p>
      </div>
    );
  }

  return (
    <div className="card-surface rounded-2xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <h3 className="font-display font-semibold text-sm">Live activity</h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Bloomberg-style · 30s refresh</span>
      </div>

      {/* Horizontal scrolling ticker — pauses on hover */}
      <div className="relative -mx-5 group">
        <div className="flex gap-3 px-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,#000_3%,#000_97%,transparent)]">
          <div className="flex gap-3 animate-marquee group-hover:[animation-play-state:paused]">
            {[...events, ...events].map((e, i) => {
              const Icon = ICONS[e.kind];
              return (
                <div key={`${e.id}-${i}`} className="shrink-0 w-72 rounded-lg border border-border/30 bg-card/40 p-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${TONES[e.kind]}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{e.label}</p>
                      {e.meta && <p className="text-[10px] text-muted-foreground truncate">{e.meta}</p>}
                      <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{relTime(e.ts)} ago</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
