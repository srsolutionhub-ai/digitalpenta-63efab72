import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: 500, suffix: "+", label: "Projects Delivered", sub: "Across 5 pillars" },
  { value: 12, suffix: "+", label: "Countries Served", sub: "India & MENA" },
  { value: 100, prefix: "₹", suffix: "Cr+", label: "Revenue Generated", sub: "For our clients" },
  { value: 98, suffix: "%", label: "Client Retention", sub: "Year over year" },
];

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
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
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="relative border-y border-border/50 bg-card/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02]" />
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border/30">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:px-8" data-reveal>
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="text-sm font-display font-semibold text-foreground/80 mt-2">
                {stat.label}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
