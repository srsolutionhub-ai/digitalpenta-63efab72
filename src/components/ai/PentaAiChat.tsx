/**
 * Penta AI Chat — lazy-mounted floating chat widget.
 * Streams replies via the `penta-ai-chat` edge function.
 * Persists session_id in localStorage so a returning visitor resumes the same thread.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { overlayBus } from "@/lib/overlayOrchestrator";

const SESSION_KEY = "penta-ai-session-id";
const VISITOR_KEY = "penta-ai-visitor-id";
const HISTORY_KEY = "penta-ai-history";

type Msg = { role: "user" | "assistant"; content: string };

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id =
      "v_" +
      Math.random().toString(36).slice(2, 10) +
      Date.now().toString(36).slice(-6);
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export default function PentaAiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [bumped, setBumped] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const visitorIdRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Init session
  useEffect(() => {
    visitorIdRef.current = getVisitorId();
    sessionIdRef.current = localStorage.getItem(SESSION_KEY);
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed)) setMessages(parsed.slice(-20));
      }
    } catch {
      /* noop */
    }
  }, []);

  // Auto-show "bump" pulse after 25s on the page
  useEffect(() => {
    const t = setTimeout(() => setBumped(true), 25_000);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Persist transcript (last 20)
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      /* noop */
    }
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const url = `https://${projectId}.supabase.co/functions/v1/penta-ai-chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          visitor_id: visitorIdRef.current,
          message: text,
          source_page: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      if (!res.ok || !res.body) {
        const errTxt = await res.text().catch(() => "");
        let parsedErr = "Something went wrong. Please try again.";
        try {
          const j = JSON.parse(errTxt);
          if (j?.error) parsedErr = j.error;
        } catch {
          /* noop */
        }
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${parsedErr}` };
          return copy;
        });
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            // meta event with session_id
            if (json?.session_id) {
              sessionIdRef.current = json.session_id;
              localStorage.setItem(SESSION_KEY, json.session_id);
              continue;
            }
            const delta = json?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta.length) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            /* skip keepalive */
          }
        }
      }
    } catch (e) {
      console.error("chat error:", e);
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "⚠️ Network error. Please retry or WhatsApp us at +91-88601-00039.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, streaming]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Claim the overlay slot while open so LeadCaptureBar / SmartCTA / WhatsApp yield.
  useEffect(() => {
    if (open) overlayBus.request("penta-ai-chat");
    else overlayBus.release("penta-ai-chat");
    return () => overlayBus.release("penta-ai-chat");
  }, [open]);

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setBumped(false);
        }}
        aria-label={open ? "Close Penta AI chat" : "Open Penta AI chat"}
        aria-expanded={open}
        className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] lg:bottom-6 right-4 lg:right-5 z-[60] flex items-center gap-2 rounded-full pl-3 pr-4 py-3 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_20px_60px_-15px_hsl(256_90%_45%/0.7)] hover:shadow-[0_24px_70px_-12px_hsl(256_90%_45%/0.9)] hover:scale-[1.03] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? (
          <X className="w-5 h-5" aria-hidden />
        ) : (
          <>
            <span className="relative flex items-center justify-center w-5 h-5">
              <Sparkles className="w-5 h-5" aria-hidden />
              {bumped && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              )}
            </span>
            <span className="text-xs font-display font-bold hidden sm:inline">Ask Penta AI</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="false"
            aria-label="Penta AI chat"
            className="fixed bottom-[calc(140px+env(safe-area-inset-bottom))] lg:bottom-24 right-4 z-[60] w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-14rem))] lg:h-[min(560px,calc(100vh-9rem))] flex flex-col rounded-2xl border border-white/[0.08] bg-background/95 backdrop-blur-3xl shadow-[0_40px_100px_-20px_hsl(256_90%_20%/0.7)] overflow-hidden"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  background:
                    "radial-gradient(60% 100% at 0% 0%, hsl(256 90% 62% / 0.20), transparent 60%), radial-gradient(50% 100% at 100% 0%, hsl(192 95% 56% / 0.15), transparent 60%)",
                }}
              />
              <div className="relative flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_18px_-4px_hsl(256_90%_62%/0.6)]">
                  <Sparkles className="w-4 h-4 text-primary-foreground" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-foreground leading-tight">Penta AI</p>
                  <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online · replies in seconds
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4" aria-hidden />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="rounded-xl rounded-tl-sm bg-white/[0.04] border border-white/[0.05] p-3 text-sm text-foreground/90">
                    Hi 👋 I'm Penta AI. Tell me your business and the biggest growth blocker — I'll suggest the right path.
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "I need more leads from SEO",
                      "Help me lower my Google Ads CPL",
                      "I want a new website + marketing",
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setInput(q)}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary/90 text-primary-foreground rounded-tr-sm"
                        : "bg-white/[0.04] border border-white/[0.05] text-foreground/95 rounded-tl-sm"
                    }`}
                  >
                    {m.content ? (
                      m.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )
                    ) : (
                      <Loader2 className="w-3.5 h-3.5 animate-spin opacity-70" aria-label="Thinking" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="relative border-t border-white/[0.06] p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] focus-within:border-primary/40 focus-within:bg-white/[0.05] transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask about SEO, ads, web dev…"
                  rows={1}
                  maxLength={1000}
                  aria-label="Message Penta AI"
                  className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none max-h-28"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || streaming}
                  className="m-1.5 h-8 w-8 p-0 rounded-lg"
                  aria-label="Send message"
                >
                  {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground/70 font-mono px-1">
                AI replies are guidance — verify before acting. Prefer a human? <a href="https://wa.me/918860100039" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp us</a>.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Re-export the FAB icon for the lazy fallback (no-op).
export { MessageCircle };
