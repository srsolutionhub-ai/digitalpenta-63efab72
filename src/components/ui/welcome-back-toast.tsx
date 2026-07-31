import { useEffect, useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getVisitInfo } from "@/lib/visitorTracking";
import { useOverlaySlot } from "@/hooks/useOverlaySlot";
import { overlayBus } from "@/lib/overlayOrchestrator";

const SEEN_KEY = "dp_welcome_back_shown";

/**
 * "Welcome back" recognition card for returning visitors.
 * Shows once per browser session, only after the cookie banner is resolved,
 * and defers to any higher-priority bottom overlay via the orchestrator.
 */
export default function WelcomeBackToast() {
  const [show, setShow] = useState(false);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* noop */ }
    if (seen) return;

    const info = getVisitInfo();
    if (!info.isReturning) return;

    const t = setTimeout(() => {
      if (!overlayBus.isCookieResolved()) return;
      setVisits(info.visitCount);
      setShow(true);
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* noop */ }
      setTimeout(() => setShow(false), 14000);
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  const visible = useOverlaySlot("welcome-back", show);
  if (!visible) return null;

  return (
    <div
      className="fixed z-[55] bottom-24 md:bottom-6 left-4 right-4 md:right-auto md:left-6 md:max-w-sm motion-safe:animate-[riseFade_.6s_cubic-bezier(.16,1,.3,1)_both]"
      role="status"
      aria-live="polite"
    >
      <div
        className="rounded-2xl p-[1px] shadow-[0_20px_60px_-24px_hsl(256_90%_30%/0.6)]"
        style={{ background: "linear-gradient(135deg, hsl(256 90% 65% / .55), hsl(192 95% 60% / .25) 55%, hsl(322 90% 65% / .4))" }}
      >
        <div className="relative rounded-2xl bg-background/90 backdrop-blur-xl p-4 overflow-hidden">
          <button
            onClick={() => setShow(false)}
            aria-label="Dismiss welcome message"
            className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-3 pr-5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-display font-semibold text-foreground leading-tight">
                Welcome back{visits > 2 ? ` — visit #${visits}` : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                Want us to turn your research into a plan? Grab a free 30-minute strategy call.
              </p>
              <Link
                to="/book-a-call"
                onClick={() => setShow(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-2.5 hover:gap-2 transition-all"
              >
                Book my strategy call <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
