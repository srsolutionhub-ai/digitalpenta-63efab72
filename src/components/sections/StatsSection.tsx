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
      };
      requestAnimationFrame(animate);
    }
  }, [value, inView]);

  return (
    <span className="font-mono font-extrabold text-4xl md:text-5xl lg:text-6xl text-gradient tracking-tight">
      {prefix}{count}{suffix}
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

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:px-8 relative"
            >
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={isInView} />
              <p className="text-sm font-display font-semibold text-foreground/80 mt-2">{stat.label}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{stat.sub}</p>
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16">
                  <div className="w-full h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link to="/get-proposal">
            <Button variant="outline" className="rounded-full font-display font-semibold text-sm gap-2 border-primary/30 hover:bg-primary/5">
              Join 500+ brands scaling with Digital Penta <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
