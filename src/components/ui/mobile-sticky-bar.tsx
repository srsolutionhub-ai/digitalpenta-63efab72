import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl">
      <div className="grid grid-cols-3">
        <a
          href="https://wa.me/918860100039?text=Hi%20Digital%20Penta%2C%20I%27d%20like%20to%20discuss%20my%20project"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 h-14 text-emerald-400 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-display font-semibold">WhatsApp</span>
        </a>
        <a
          href="tel:+918860100039"
          className="flex flex-col items-center justify-center gap-1 h-14 text-muted-foreground border-x border-border/30 active:scale-95 transition-transform"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-display font-semibold">Call Now</span>
        </a>
        <Link
          to="/get-proposal"
          className="flex flex-col items-center justify-center gap-1 h-14 bg-primary text-primary-foreground active:scale-95 transition-transform"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-[10px] font-display font-bold">Get Proposal</span>
        </Link>
      </div>
    </div>
  );
}
