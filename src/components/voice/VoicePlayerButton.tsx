import { useRef, useState, useEffect } from "react";
import { Volume2, Loader2, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface VoicePlayerButtonProps {
  text: string;
  voiceId?: string;
  label?: string;
  className?: string;
  variant?: "ghost" | "premium" | "inline";
}

const SUPABASE_URL = "https://ygoxxqkcxunuowtuwdxr.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnb3h4cWtjeHVudW93dHV3ZHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mjk3NTAsImV4cCI6MjA3MTEwNTc1MH0.95NbFoK8HXaMzA1E0V9a1hpqSs_VQJRI4Z9ImqNQJ9I";

/**
 * Reusable voice playback button. Fetches audio directly from the
 * elevenlabs-tts edge function (bypasses supabase-js binary parsing quirks)
 * and plays via HTMLAudioElement. Caches per-text within component lifetime.
 */
export default function VoicePlayerButton({
  text,
  voiceId,
  label = "Listen",
  className,
  variant = "premium",
}: VoicePlayerButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  // Invalidate cache when text changes
  useEffect(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, [text, voiceId]);

  const stop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setState("idle");
  };

  const play = async () => {
    if (state === "playing") { stop(); return; }
    if (state === "loading") return;
    if (!text?.trim()) return;
    setState("loading");
    try {
      if (!urlRef.current) {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ANON_KEY}`,
            apikey: ANON_KEY,
          },
          body: JSON.stringify({ text: text.slice(0, 1200), voiceId }),
        });
        if (!res.ok) {
          const errBody = await res.text();
          if (res.status === 429) {
            toast({ title: "Voice quota reached", description: "Try again tomorrow.", variant: "destructive" });
          } else {
            toast({ title: "Voice unavailable", description: `Error ${res.status}`, variant: "destructive" });
          }
          console.error("TTS failed", res.status, errBody);
          setState("idle");
          return;
        }
        const blob = await res.blob();
        urlRef.current = URL.createObjectURL(blob);
      }
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      audio.src = urlRef.current;
      audio.onended = () => setState("idle");
      audio.onerror = () => setState("idle");
      await audio.play();
      setState("playing");
    } catch (e) {
      console.error("voice play failed", e);
      toast({ title: "Voice unavailable", description: "Please try again.", variant: "destructive" });
      setState("idle");
    }
  };

  const base = "inline-flex items-center gap-2 font-display font-semibold text-xs transition-all";
  const styles =
    variant === "premium"
      ? "px-4 py-2 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary backdrop-blur-sm"
      : variant === "ghost"
      ? "px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground"
      : "px-2 py-1 rounded text-primary hover:text-primary/80";

  return (
    <button
      type="button"
      onClick={play}
      aria-label={state === "playing" ? "Stop audio" : label}
      className={cn(base, styles, className)}
    >
      {state === "loading" ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : state === "playing" ? (
        <Square className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
      <span>{state === "playing" ? "Stop" : state === "loading" ? "Loading…" : label}</span>
    </button>
  );
}
