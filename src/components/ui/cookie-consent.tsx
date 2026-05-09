import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Shield } from "lucide-react";
import { useOverlaySlot } from "@/hooks/useOverlaySlot";
import { overlayBus } from "@/lib/overlayOrchestrator";

export default function CookieConsent() {
  const [wantsShow, setWantsShow] = useState(false);

  useEffect(() => {
    if (overlayBus.isCookieResolved()) return;
    const showTimer = setTimeout(() => setWantsShow(true), 2000);
    const autoHideTimer = setTimeout(() => {
      if (!overlayBus.isCookieResolved()) {
        localStorage.setItem("dp-cookie-consent", "auto-dismissed");
        setWantsShow(false);
      }
    }, 12000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoHideTimer);
    };
  }, []);

  const show = useOverlaySlot("cookie-consent", wantsShow);

  const handle = (choice: "accepted" | "rejected") => {
    localStorage.setItem("dp-cookie-consent", choice);
    setWantsShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:p-0 lg:bottom-[max(env(safe-area-inset-bottom),1rem)]"
        >
          <div className="max-w-4xl mx-auto rounded-2xl bg-card/95 backdrop-blur-xl border border-border/40 px-6 py-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-display font-semibold text-foreground">We value your privacy</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We use cookies to enhance your experience, analyze traffic, and serve relevant ads. Read our{" "}
                  <Link to="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">Privacy Policy</Link>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handle("rejected")}
                className="rounded-full font-display font-semibold text-xs border-border/40"
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handle("accepted")}
                className="rounded-full font-display font-bold text-xs"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
