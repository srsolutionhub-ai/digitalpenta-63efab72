import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useOverlaySlot } from "@/hooks/useOverlaySlot";
import { overlayBus } from "@/lib/overlayOrchestrator";

export default function LeadCaptureBar() {
  const [wantsShow, setWantsShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("dp-lead-bar-dismissed")) return;
    const tick = () => {
      if (overlayBus.isCookieResolved()) setWantsShow(true);
      else setTimeout(tick, 5000);
    };
    const timer = setTimeout(tick, 45000);
    return () => clearTimeout(timer);
  }, []);

  const show = useOverlaySlot("lead-capture", wantsShow);

  const dismiss = () => {
    setWantsShow(false);
    localStorage.setItem("dp-lead-bar-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-[calc(56px+env(safe-area-inset-bottom))] lg:bottom-4 left-0 lg:left-4 right-0 lg:right-4 z-50 lg:rounded-2xl bg-card/95 backdrop-blur-xl border-t lg:border border-primary/20 px-6 py-4 flex items-center justify-between gap-4 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-sm font-display font-bold text-foreground">Want a FREE Website Audit?</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Discover what's holding your website back from ranking #1</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href="/contact">
              <Button size="sm" className="rounded-full font-display font-bold text-xs bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white">
                Yes, Audit My Website!
              </Button>
            </a>
            <button onClick={dismiss} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
