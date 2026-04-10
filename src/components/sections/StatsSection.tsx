import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: 500, suffix: "+", label: "Clients Served", sub: "Across India & MENA" },
  { value: 3, suffix: "X", label: "Average ROI Delivered", sub: "Across all campaigns" },
  { value: 10, prefix: "₹", suffix: "Cr+", label: "Ad Budget Managed", sub: "Google + Meta Ads" },
  { value: 98, suffix: "%", label: "Client Retention Rate", sub: "Year over year" },
];

function AnimatedNumber({ value, prefix = "", suffix = "", inView }: { value: number; prefix?: string; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      const duration = 1800;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
        else setDone(true);
      };
      requestAnimationFrame(animate);
    }
  }, [value, inView]);

  return (
    <span className="font-mono font-extrabold text-4xl md:text-5xl lg:text-6xl text-gradient tracking-tight relative">
      {prefix}{count}{suffix}
      {done && (
        <svg className="absolute -top-2 -right-2 w-5 h-5 sparkle-burst" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" fill="hsl(var(--glow-cyan))" opacity="0.7" />
        </svg>
      )}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="results" ref={ref} className="relative border-y border-border/50 bg-card/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:px-8 relative"
            >
              {/* Ghosted watermark number */}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-extrabold text-[140px] md:text-[180px] text-foreground/[0.02] select-none pointer-events-none leading-none">
                {stat.prefix}{stat.value}
              </span>
              <div className="relative">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={isInView} />
                <p className="text-sm font-display font-semibold text-foreground/80 mt-3">{stat.label}</p>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">{stat.sub}</p>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20">
                  <motion.div
                    className="w-full h-full"
                    style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--glow-violet) / 0.3), hsl(var(--glow-cyan) / 0.2), transparent)" }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/get-proposal">
            <Button variant="outline" className="rounded-full font-display font-semibold text-sm gap-2 border-primary/30 hover:bg-primary/5 hover-glow">
              Join 500+ brands scaling with Digital Penta <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
