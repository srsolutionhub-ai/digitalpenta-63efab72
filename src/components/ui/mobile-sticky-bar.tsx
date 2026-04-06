import { Phone, MessageCircle, Calendar } from "lucide-react";

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/30">
      <div className="grid grid-cols-3 divide-x divide-border/20">
        <a href="tel:+91XXXXXXXXXX" className="flex flex-col items-center justify-center gap-1 py-3 text-primary hover:bg-primary/5 transition-colors">
          <Phone className="w-4 h-4" />
          <span className="text-[10px] font-display font-semibold">Call Now</span>
        </a>
        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 py-3 text-[#25D366] hover:bg-[#25D366]/5 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px] font-display font-semibold">WhatsApp</span>
        </a>
        <a href="/contact" className="flex flex-col items-center justify-center gap-1 py-3 text-accent hover:bg-accent/5 transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] font-display font-semibold">Book Call</span>
        </a>
      </div>
    </div>
  );
}
