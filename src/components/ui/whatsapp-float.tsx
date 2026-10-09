import { useEffect, useState, useSyncExternalStore } from "react";
import { overlayBus } from "@/lib/overlayOrchestrator";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

/**
 * WhatsApp floating button.
 * Desktop-only (mobile uses MobileStickyBar's WhatsApp slot).
 * Hides when Penta AI chat is open (right-side collision) or any modal overlay owns the screen.
 */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const activeOverlay = useSyncExternalStore(
    overlayBus.subscribe,
    () => overlayBus.active(),
    () => null
  );
  const suppressed = activeOverlay === "penta-ai-chat" || activeOverlay === "exit-intent";

  if (!visible || suppressed) return null;

  return (
    <a
      href="https://wa.me/918860100039?text=Hi%20Digital%20Penta%2C%20I%27d%20like%20to%20discuss%20my%20project"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-24 left-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105 lg:flex"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-accent/30 motion-safe:animate-ping" />
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
