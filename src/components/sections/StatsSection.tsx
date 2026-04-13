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
    <span className="font-mono font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="results" ref={ref} className="py-28 md:py-36">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:px-8 relative"
            >
              <div>
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={isInView} />
                <p className="text-sm font-display font-semibold text-foreground/80 mt-3">{stat.label}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{stat.sub}</p>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
