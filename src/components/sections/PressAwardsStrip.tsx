import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Award, ShieldCheck, Trophy, Sparkles, Star } from "lucide-react";

/**
 * PressAwardsStrip
 * ----------------
 * Editorial "As featured in" + awards row that signals premium agency status.
 * Sits directly under the hero, replacing nothing — adds another credibility
 * layer between the hero and the body of the page.
 */

const press = [
  { name: "YourStory", year: "2024" },
  { name: "Inc42", year: "2024" },
  { name: "The Economic Times", year: "2023" },
  { name: "Entrepreneur India", year: "2024" },
  { name: "Business Standard", year: "2023" },
  { name: "Mint", year: "2024" },
];

const awards = [
  { icon: Trophy, label: "Top 10 Marketing Agency", sub: "Clutch · 2024", glow: "hsl(48 100% 65%)" },
  { icon: Award, label: "Google Premier Partner", sub: "Top 3% Worldwide", glow: "hsl(192 95% 70%)" },
  { icon: ShieldCheck, label: "Meta Business Partner", sub: "Verified · 2024", glow: "hsl(256 90% 75%)" },
  { icon: Sparkles, label: "Best AI-First Studio", sub: "MarTech Awards", glow: "hsl(322 90% 75%)" },
];

export default function PressAwardsStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-20 overflow-hidden border-y border-white/[0.05]"
      aria-labelledby="press-awards-heading"
    >
      {/* Ambient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, hsl(256 90% 30% / 0.18), transparent 70%), radial-gradient(40% 80% at 10% 50%, hsl(192 95% 35% / 0.10), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground) / 0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex items-center justify-center gap-3"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" />
          <span
            id="press-awards-heading"
            className="type-label font-mono text-foreground/60"
          >
            As Featured In · Award-Winning Studio
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/20" />
        </motion.div>

        {/* Press logos — editorial wordmarks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14"
        >
          {press.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.06 }}
              className="group flex flex-col items-center"
            >
              <span
                className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground/55 transition-all duration-300 group-hover:text-foreground"
                style={{
                  fontFamily:
                    "'Plus Jakarta Sans', 'Times New Roman', serif",
                  fontStyle: i % 2 === 0 ? "normal" : "italic",
                  letterSpacing: i % 2 === 0 ? "-0.02em" : "0",
                }}
              >
                {p.name}
              </span>
              <span className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/30">
                {p.year}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Hairline divider with neon center glow */}
        <div className="mx-auto mb-12 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Award medallions */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {awards.map((award, i) => {
            const Icon = award.icon;
            return (
              <motion.div
                key={award.label}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card-pro group relative flex items-center gap-3.5 p-4 md:p-5"
              >
                {/* Medallion icon */}
                <div
                  className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-transform duration-500 group-hover:rotate-[8deg] md:h-12 md:w-12"
                  style={{
                    borderColor: `${award.glow.replace(")", " / 0.4)")}`,
                    background: `radial-gradient(circle at 30% 30%, ${award.glow.replace(")", " / 0.18)")}, transparent 70%)`,
                    boxShadow: `0 0 24px -4px ${award.glow.replace(")", " / 0.35)")}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  }}
                >
                  <Icon
                    className="h-5 w-5 md:h-[22px] md:w-[22px]"
                    style={{ color: award.glow }}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Text block */}
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[13px] font-bold leading-tight text-foreground md:text-sm">
                    {award.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/50 md:text-[11px]">
                    {award.sub}
                  </p>
                </div>

                {/* Tiny corner star — editorial flourish */}
                <Star
                  className="absolute right-3 top-3 h-2.5 w-2.5 text-foreground/15 transition-colors group-hover:text-foreground/40"
                  fill="currentColor"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Footer micro-line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/35"
        >
          Trusted by founders · Backed by results · Verified by industry
        </motion.p>
      </div>
    </section>
  );
}
