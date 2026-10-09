import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgressBar from "@/components/ui/scroll-progress-bar";
import WhatsAppFloat from "@/components/ui/whatsapp-float";
import VoiceAgentButton from "@/components/voice/VoiceAgentButton";
import MobileStickyBar from "@/components/ui/mobile-sticky-bar";
import LeadCaptureBar from "@/components/ui/lead-capture-bar";


/**
 * Bottom-of-viewport overlay layout (single source of truth):
 *   bottom-right : Penta AI chat FAB              (App.tsx, z-60)
 *   bottom-left  : Voice above WhatsApp on desktop; voice above sticky bar on mobile (z-40)
 *   bottom-edge  : LeadCaptureBar (rotates w/ bus, mobile sits above sticky)
 *   bottom-strip : MobileStickyBar (mobile only)
 * SmartCTA and AiStrategistChat were removed — they duplicated PentaAiChat
 * and collided with the chat FAB on the right edge.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grain-overlay" aria-hidden />
      <ScrollProgressBar />
      <Navbar />
      <main id="main-content" className="flex-1 relative">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <VoiceAgentButton />
      <MobileStickyBar />
      <LeadCaptureBar />
    </div>
  );
}
