import { useEffect, useState, useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";
import { overlayBus } from "@/lib/overlayOrchestrator";

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
      className="fixed bottom-24 left-5 z-40 w-14 h-14 rounded-full bg-[#25D366] hidden lg:flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      <MessageCircle className="w-6 h-6 text-white relative z-10" fill="white" />
    </a>
  );
}
