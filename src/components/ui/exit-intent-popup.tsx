import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (sessionStorage.getItem("dp-exit-shown")) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setShow(true);
        sessionStorage.setItem("dp-exit-shown", "1");
        document.removeEventListener("mouseout", handler);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handler);
    }, 5000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handler);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4 rounded-2xl glass border border-primary/20 p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 mesh-gradient opacity-30" />
            <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="relative z-10">
              <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Wait! Before You Go</p>
              <h3 className="font-display font-extrabold text-2xl text-foreground mb-2">
                Get Your <span className="text-gradient">FREE</span> Digital Marketing Audit
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Worth ₹5,000 — discover exactly where your brand is losing traffic, leads & revenue.</p>
              <div className="space-y-3">
                <Input placeholder="Your Name" className="bg-secondary/40 border-border/30" />
                <Input type="email" placeholder="Email Address" className="bg-secondary/40 border-border/30" />
                <Input type="tel" placeholder="Phone Number" className="bg-secondary/40 border-border/30" />
                <Button className="w-full rounded-full font-display font-bold py-5 bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white">
                  Claim Free Audit →
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-3">No spam. Unsubscribe anytime.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
