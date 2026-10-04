import { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { Mic, PhoneOff, X, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/submitLead";

type Lang = "hi" | "en" | "ar";

const LANGS: Record<Lang, { label: string; first: string }> = {
  hi: { label: "हिन्दी", first: "Namaste! Main Penta hoon, Digital Penta ki voice assistant. Aapke business ke liye main kaise madad kar sakti hoon?" },
  en: { label: "English", first: "Hello! I'm Penta, Digital Penta's voice assistant. How can I help your business grow today?" },
  ar: { label: "العربية", first: "مرحباً! أنا بنتا، المساعدة الصوتية لشركة ديجيتال بنتا. كيف يمكنني مساعدتك في تنمية أعمالك اليوم؟" },
};

const GULF_TZ = ["Asia/Dubai", "Asia/Riyadh", "Asia/Qatar", "Asia/Bahrain", "Asia/Kuwait", "Asia/Muscat", "Africa/Cairo", "Asia/Amman"];

/** Hindi for visitors in India, Arabic for the Gulf/Arab region, English elsewhere. */
function detectLang(): Lang {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("ar") || GULF_TZ.includes(tz)) return "ar";
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta" || nav.startsWith("hi")) return "hi";
  return "en";
}
function langOptions(detected: Lang): Lang[] {
  if (detected === "ar") return ["ar", "en"];
  if (detected === "hi") return ["hi", "en"];
  return ["en", "hi", "ar"];
}

interface Line { from: "you" | "penta"; text: string }

export default function VoiceAgentPanel({ onClose }: { onClose: () => void }) {
  const detected = useRef(detectLang()).current;
  const [lang, setLang] = useState<Lang>(detected);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    clientTools: {
      save_inquiry: async (p: Record<string, string>) => {
        try {
          await submitLead({
            form: "contact",
            name: p.name || "Voice caller",
            email: p.email || "",
            phone: p.phone,
            service: p.service,
            budget: p.budget,
            message: `[Voice assistant · ${LANGS[lang].label}] ${p.summary || ""}${p.city ? ` · Location: ${p.city}` : ""}`,
            extra: { channel: "voice_agent", language: lang },
            startedAt: Date.now() - 60_000,
          });
          setSaved(true);
          return "Enquiry saved successfully.";
        } catch (e) {
          return `Could not save: ${(e as Error).message}. Ask the caller to WhatsApp +91-88601-00039.`;
        }
      },
    },
    onMessage: (m: { source?: string; message?: string }) => {
      if (!m?.message) return;
      const line: Line = { from: m.source === "user" ? "you" : "penta", text: m.message };
      setLines((l) => [...l, line].slice(-30));
    },
    onError: () => setError("Connection problem. Please try again."),
  });

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => () => { void conversation.endSession(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Please allow microphone access to talk with Penta.");
      setConnecting(false);
      return;
    }
    try {
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/voice-agent-token`,
        { method: "POST", headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string, "Content-Type": "application/json" } },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) throw new Error(data.error || "Voice assistant unavailable");
      setLines([]);
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
        overrides: { agent: { language: lang, firstMessage: LANGS[lang].first } },
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setConnecting(false);
    }
  }, [conversation, lang]);

  const live = conversation.status === "connected";

  return (
    <div
      role="dialog"
      aria-label="Penta voice assistant"
      className="fixed z-[70] left-3 right-3 bottom-24 sm:left-6 sm:right-auto sm:w-[360px] md:bottom-6 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl"
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <p className="font-semibold text-foreground">Talk to Penta</p>
          <p className="text-xs text-muted-foreground">AI voice assistant · replies in your language</p>
        </div>
        <button onClick={() => { void conversation.endSession(); onClose(); }} aria-label="Close voice assistant" className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 px-4 pt-3" role="radiogroup" aria-label="Language">
        {langOptions(detected).map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={lang === l}
            disabled={live}
            onClick={() => setLang(l)}
            className={`rounded-full border px-3 py-1.5 text-xs transition disabled:opacity-50 ${lang === l ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {LANGS[l].label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center py-5">
        <div className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 ${live ? "" : "opacity-80"}`}>
          {live && <span className={`absolute inset-0 rounded-full bg-primary/25 ${conversation.isSpeaking ? "animate-ping" : "animate-pulse"}`} />}
          <Mic className="relative h-8 w-8 text-primary" aria-hidden />
        </div>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {connecting ? "Connecting…" : live ? (conversation.isSpeaking ? "Penta is speaking…" : "Listening… speak now") : "Tap start and speak naturally"}
        </p>
      </div>

      {lines.length > 0 && (
        <div ref={logRef} className="mx-4 max-h-40 space-y-1.5 overflow-y-auto rounded-xl bg-muted/40 p-3 text-xs">
          {lines.map((l, i) => (
            <p key={i} dir="auto" className={l.from === "you" ? "text-foreground" : "text-muted-foreground"}>
              <span className="font-semibold">{l.from === "you" ? "You" : "Penta"}:</span> {l.text}
            </p>
          ))}
        </div>
      )}

      {saved && <p className="mx-4 mt-3 rounded-lg bg-primary/10 px-3 py-2 text-xs text-foreground">Your enquiry is saved. A strategist will reply within 24 hours.</p>}
      {error && <p className="mx-4 mt-3 text-xs text-destructive" role="alert">{error}</p>}

      <div className="p-4">
        {live ? (
          <button onClick={() => conversation.endSession()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-medium text-destructive-foreground">
            <PhoneOff className="h-4 w-4" /> End call
          </button>
        ) : (
          <button onClick={start} disabled={connecting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />} Start voice call
          </button>
        )}
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Uses your microphone. Calls are handled by AI; we don't store audio.</p>
      </div>
    </div>
  );
}
