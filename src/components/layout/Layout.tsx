import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgressBar from "@/components/ui/scroll-progress-bar";
import WhatsAppFloat from "@/components/ui/whatsapp-float";
import MobileStickyBar from "@/components/ui/mobile-sticky-bar";
import ExitIntentPopup from "@/components/ui/exit-intent-popup";
import LeadCaptureBar from "@/components/ui/lead-capture-bar";
import CookieConsent from "@/components/ui/cookie-consent";
import SmartCTA from "@/components/ui/smart-cta";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgressBar />
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <MobileStickyBar />
      <ExitIntentPopup />
      <LeadCaptureBar />
      <CookieConsent />
      <SmartCTA />
    </div>
  );
}
