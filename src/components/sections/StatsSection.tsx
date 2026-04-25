import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

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
    <span className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl tracking-tighter text-gradient-hero">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="results" ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(192 95% 56% / 0.12), transparent 60%)" }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card type-label text-accent font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            By the Numbers
          </span>
          <h2 className="font-display font-extrabold tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.1 }}
          >
            Real results. <span className="text-gradient">Real impact.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center glass-card p-8 hover-lift"
            >
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={isInView} />
              <p className="text-sm font-display font-semibold text-foreground mt-4">{stat.label}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
