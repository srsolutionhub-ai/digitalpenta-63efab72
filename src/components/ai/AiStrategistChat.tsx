import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, X, Loader2, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * AiStrategistChat — floating "Penta Strategist" assistant.
 *
 * Streams from the public ai-strategist edge function (Lovable AI Gateway).
 * Pure presentation + fetch — no DB writes. Captures conversation context
 * (page URL + referrer) for better qualification.
 */

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "dp_strategist_chat_v1";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const SUGGESTED: string[] = [
  "I want more SEO leads",
  "Lower my Google Ads CPL",
  "Grow social + content",
  "Audit my website",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi — I'm Penta Strategist, a senior growth advisor at Digital Penta. Tell me your biggest growth blocker right now and I'll point you to the right next step. What industry are you in?",
};

export default function AiStrategistChat() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Msg[];
    } catch { /* noop */ }
    return [GREETING];
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Persist
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { /* noop */ }
  }, [messages]);

  // Stop pulse after first interaction
  useEffect(() => {
    const t = window.setTimeout(() => setPulse(false), 12000);
    return () => window.clearTimeout(t);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/ai-strategist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next,
          context: {
            url: typeof window !== "undefined" ? window.location.pathname : undefined,
            referrer: typeof document !== "undefined" ? document.referrer : undefined,
          },
        }),
        signal: ctrl.signal,
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) throw new Error("Too many requests. Try again in a moment.");
        if (resp.status === 402) throw new Error("Strategist is offline. Please use WhatsApp or call us.");
        throw new Error("Couldn't reach the strategist. Please retry.");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      let done = false;

      // Append empty assistant placeholder we'll fill incrementally
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: rdDone, value } = await reader.read();
        if (rdDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistant += delta;
              setMessages((prev) => {
                const copy = prev.slice();
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      console.error(e);
      setError((e as Error).message || "Something went wrong.");
      // Remove the empty assistant placeholder if no content streamed
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "") return prev.slice(0, -1);
        return prev;
      });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([GREETING]);
    setError(null);
    setInput("");
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        aria-label="Chat with our AI Growth Strategist"
        onClick={() => { setOpen((o) => !o); setPulse(false); }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 18 }}
        className="fixed z-[60] bottom-5 right-5 md:bottom-6 md:right-6 group"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"
          style={{ background: "radial-gradient(circle, hsl(256 90% 55% / 0.6), transparent 70%)" }}
        />
        <span
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-2xl border border-white/10 backdrop-blur-sm"
        >
          <span className="relative flex w-2 h-2">
            {pulse && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
          </span>
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-display font-semibold tracking-tight">
            Ask Penta Strategist
          </span>
        </span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed z-[60] bottom-20 right-3 md:right-6 w-[calc(100vw-1.5rem)] sm:w-[400px] max-h-[80vh] flex flex-col rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="Penta Strategist chat"
          >
            {/* Header */}
            <div
              className="relative px-4 py-3 border-b border-border/40 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, hsl(256 90% 18% / 0.9), hsl(256 90% 10% / 0.6))" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="inline-flex w-9 h-9 items-center justify-center rounded-xl bg-primary/20 border border-primary/30"
                  style={{ boxShadow: "0 0 18px hsl(256 90% 55% / 0.5)" }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </span>
                <div className="min-w-0">
                  <div className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
                    Penta Strategist
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-emerald-300/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    AI-powered • Senior growth advisor
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-white/[0.04] border border-border/30 text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.content || (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" /> thinking…
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                  {error}{" "}
                  <button onClick={() => send(messages[messages.length - 1]?.content)} className="underline ml-1">
                    Retry
                  </button>
                </div>
              )}

              {/* Quick replies on first turn only */}
              {messages.length <= 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border border-border/40 bg-white/[0.03] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick CTAs */}
            <div className="px-4 pb-2 flex items-center gap-2">
              <Link
                to="/get-proposal"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30 transition-colors"
              >
                <Calendar className="w-3 h-3" /> Book audit call
              </Link>
              <a
                href="tel:+918860100039"
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-lg bg-white/[0.04] text-foreground hover:bg-white/[0.08] border border-border/40 transition-colors"
              >
                <Phone className="w-3 h-3" /> Call
              </a>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="border-t border-border/40 p-3 flex items-end gap-2 bg-background/60"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Type your growth question…"
                disabled={loading}
                className="flex-1 resize-none rounded-xl bg-white/[0.04] border border-border/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 min-h-[40px] max-h-[120px]"
                style={{ height: "auto" }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

            <div className="px-4 pb-2.5 flex items-center justify-between text-[10px] text-muted-foreground/70">
              <span>AI may be inaccurate — verify critical info.</span>
              <button onClick={reset} className="hover:text-foreground transition-colors">
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
