import { ReactNode, lazy, Suspense } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgressBar from "@/components/ui/scroll-progress-bar";
import WhatsAppFloat from "@/components/ui/whatsapp-float";
import MobileStickyBar from "@/components/ui/mobile-sticky-bar";
import LeadCaptureBar from "@/components/ui/lead-capture-bar";
import CookieConsent from "@/components/ui/cookie-consent";

/* Deferred: appear after delays / user interaction — keep out of initial JS bundle */
const ExitIntentPopup = lazy(() => import("@/components/ui/exit-intent-popup"));
const SmartCTA = lazy(() => import("@/components/ui/smart-cta"));
const AiStrategistChat = lazy(() => import("@/components/ai/AiStrategistChat"));
const LiveActivityFeed = lazy(() => import("@/components/ui/live-activity-feed"));

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgressBar />
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <MobileStickyBar />
      <LeadCaptureBar />
      <CookieConsent />
      <Suspense fallback={null}>
        <ExitIntentPopup />
        <SmartCTA />
        <AiStrategistChat />
        <LiveActivityFeed />
      </Suspense>
    </div>
  );
}
