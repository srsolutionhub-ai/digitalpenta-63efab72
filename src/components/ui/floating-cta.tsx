import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 600 && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 animate-[slideUp_0.5s_ease-out]">
      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-background/90 backdrop-blur-2xl border border-border/30 shadow-2xl shadow-primary/10">
        <span className="text-xs font-display font-medium text-muted-foreground hidden sm:block">
          Ready to grow?
        </span>
        <Link to="/get-proposal">
          <Button size="sm" className="rounded-full px-5 text-xs font-display font-bold gap-1.5 h-8">
            Get Proposal <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
