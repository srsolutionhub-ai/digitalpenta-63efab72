import { lazy, Suspense, useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

// The ElevenLabs SDK is only downloaded when a visitor opens the panel,
// so it never affects page load speed.
const VoiceAgentPanel = lazy(() => import("./VoiceAgentPanel"));
const VoiceAnimation = lazy(() => import("./VoiceAnimation"));

export default function VoiceAgentButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Talk to our voice assistant"
          title="Talk to Penta"
          className="fixed bottom-24 left-4 z-40 h-14 w-14 overflow-hidden rounded-full border-primary/40 bg-card/95 p-0 shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-card lg:bottom-44 lg:left-5"
        >
          <Suspense fallback={<Mic className="m-auto h-6 w-6 text-primary" aria-hidden="true" />}>
            <VoiceAnimation state="idle" className="h-full w-full" />
          </Suspense>
        </Button>
      )}
      {open && (
        <Suspense fallback={null}>
          <VoiceAgentPanel onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
