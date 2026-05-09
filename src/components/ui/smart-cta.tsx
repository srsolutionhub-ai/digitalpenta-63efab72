import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Phone, Zap } from "lucide-react";
import { Button } from "./button";
import { useOverlaySlot } from "@/hooks/useOverlaySlot";
import { overlayBus } from "@/lib/overlayOrchestrator";

const ctaStages = [
  { text: "Get Free Website Audit", icon: Zap, href: "/#website-audit" },
  { text: "Book Strategy Call", icon: Phone, href: "/contact" },
  { text: "Talk to Our Expert Now", icon: ArrowRight, href: "/get-proposal" },
];

export default function SmartCTA() {
  const [stage, setStage] = useState(0);
  const [wantsShow, setWantsShow] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (overlayBus.isCookieResolved()) setWantsShow(true);
    }, 8000);
    const interval = setInterval(() => {
      setStage((s) => Math.min(s + 1, ctaStages.length - 1));
    }, 45000);
    const onScroll = () => {
      if (overlayBus.isCookieResolved()) setWantsShow(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(showTimer); clearInterval(interval); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Lowest priority — yields to any other overlay.
  const visible = useOverlaySlot("smart-cta", wantsShow);

  const current = ctaStages[stage];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-4 z-40 hidden md:block"
        >
          <Link to={current.href}>
            <Button className="rounded-full px-6 py-5 font-display font-bold text-sm gap-2 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={stage}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {current.text}
                </motion.span>
              </AnimatePresence>
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
