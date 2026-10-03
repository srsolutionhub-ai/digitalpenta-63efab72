import { lazy, Suspense, useState } from "react";
import { AudioLines } from "lucide-react";

// The ElevenLabs SDK is only downloaded when a visitor opens the panel,
// so it never affects page load speed.
const VoiceAgentPanel = lazy(() => import("./VoiceAgentPanel"));

export default function VoiceAgentButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Talk to our voice assistant"
          className="fixed z-50 left-4 bottom-36 md:left-6 md:bottom-24 flex items-center gap-2 rounded-full border border-primary/40 bg-card/90 backdrop-blur px-4 py-3 text-sm font-medium text-foreground shadow-lg transition hover:-translate-y-0.5 hover:border-primary"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <AudioLines className="h-4 w-4 text-primary" aria-hidden />
          <span className="hidden sm:inline">Talk to us</span>
        </button>
      )}
      {open && (
        <Suspense fallback={null}>
          <VoiceAgentPanel onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
