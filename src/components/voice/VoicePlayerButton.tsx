import { useRef, useState, useEffect } from "react";
import { Volume2, Loader2, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface VoicePlayerButtonProps {
  text: string;
  voiceId?: string;
  label?: string;
  className?: string;
  variant?: "ghost" | "premium" | "inline";
}

/**
 * Reusable voice playback button. Fetches audio from the elevenlabs-tts
 * edge function and plays via HTMLAudioElement. Caches per-text within the
 * component lifetime.
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

  const stop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setState("idle");
  };

  const play = async () => {
    if (state === "playing") { stop(); return; }
    if (state === "loading") return;
    setState("loading");
    try {
      if (!urlRef.current) {
        const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
          body: { text, voiceId },
        });
        if (error) throw error;
        const blob = data instanceof Blob ? data : new Blob([data], { type: "audio/mpeg" });
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
