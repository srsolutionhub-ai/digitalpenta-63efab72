import { lazy, Suspense, useState } from "react";
import { Mic } from "lucide-react";

// The ElevenLabs SDK is only downloaded when a visitor opens the panel,
// so it never affects page load speed.
const VoiceAgentPanel = lazy(() => import("./VoiceAgentPanel"));
const VoiceAnimation = lazy(() => import("./VoiceAnimation"));

export default function VoiceAgentButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Talk to our voice assistant"
          title="Talk to Penta"
          className="fixed z-50 left-4 bottom-36 h-16 w-16 overflow-hidden rounded-full border border-primary/40 bg-card/95 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:left-6 lg:bottom-44"
        >
          <Suspense fallback={<Mic className="m-auto h-6 w-6 text-primary" aria-hidden="true" />}>
            <VoiceAnimation state="idle" className="h-full w-full scale-110" />
          </Suspense>
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
