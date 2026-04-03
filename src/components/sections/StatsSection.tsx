import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: 500, suffix: "+", label: "Projects Delivered", sub: "Across 5 pillars" },
  { value: 12, suffix: "+", label: "Countries Served", sub: "India & MENA" },
  { value: 100, prefix: "₹", suffix: "Cr+", label: "Revenue Generated", sub: "For our clients" },
  { value: 98, suffix: "%", label: "Client Retention", sub: "Year over year" },
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
    <span className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative border-y border-border/50 bg-card/10 overflow-hidden cv-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02]" />
      
      {/* Decorative dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border/30">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:px-8"
            >
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={isInView} />
              <p className="text-sm font-display font-semibold text-foreground/80 mt-2">{stat.label}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
