import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SITE_METRICS } from "@/data/siteMetrics";

/**
 * Extracts the numeric portion from the display string for animation,
 * keeping the original prefix/suffix intact for visual continuity.
 * Examples: "500+" -> { num: 500, prefix: "", suffix: "+" }
 *           "₹10Cr+" -> { num: 10, prefix: "₹", suffix: "Cr+" }
 *           "3X" -> { num: 3, prefix: "", suffix: "X" }
 */
function parseDisplay(display: string): { num: number; prefix: string; suffix: string } {
  const match = display.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: display };
  return { num: parseFloat(match[2]), prefix: match[1], suffix: match[3] };
}

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
          <span className="neon-chip mb-4">By the Numbers · Verifiable</span>
          <h2 className="font-display font-extrabold tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.1 }}
          >
            Real results. <span className="text-gradient">Real impact.</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
            Every number below has a methodology. Hover the info icon to see how we measure it and when it was last updated.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_METRICS.map((stat, i) => {
            const parsed = parseDisplay(stat.display);
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center glass-card p-8 hover-lift"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={`How we measure ${stat.label}`}
                      className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground/60 hover:text-primary hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Info className="w-3.5 h-3.5" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-left">
                    <p className="font-display font-semibold text-xs mb-1 text-foreground">Methodology</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{stat.methodology}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/70 mt-2 pt-2 border-t border-white/[0.08]">
                      Last updated: {new Date(stat.updatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <AnimatedNumber value={parsed.num} prefix={parsed.prefix} suffix={parsed.suffix} inView={isInView} />
                <p className="text-sm font-display font-semibold text-foreground mt-4">{stat.label}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1.5">{stat.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
