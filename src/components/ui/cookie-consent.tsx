import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Shield } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dp-cookie-consent");
    if (consent) return;
    const showTimer = setTimeout(() => setShow(true), 2000);
    // Auto-dismiss after 8 seconds of being visible if no interaction
    const autoHideTimer = setTimeout(() => {
      const stillNoConsent = !localStorage.getItem("dp-cookie-consent");
      if (stillNoConsent) {
        localStorage.setItem("dp-cookie-consent", "auto-dismissed");
        setShow(false);
      }
    }, 10000); // 2s delay + 8s visible
    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoHideTimer);
    };
  }, []);

  const handle = (choice: "accepted" | "rejected") => {
    localStorage.setItem("dp-cookie-consent", choice);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:p-0"
        >
          <div className="max-w-4xl mx-auto lg:mb-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/40 px-6 py-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
