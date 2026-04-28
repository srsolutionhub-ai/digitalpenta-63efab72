import { motion } from "motion/react";
import { TrendingUp, MousePointerClick, Megaphone, Sparkles } from "lucide-react";

/**
 * HeroKpiTicker
 * -------------
 * A live "scoreboard" ribbon for under the hero CTAs.
 * Shows rolling, recent campaign metrics with color-coded glow chips.
 * Heavy on visual hierarchy, light on motion (no infinite marquee — duplicate-render
 * with subtle individual pulse instead, so it stays calm and premium).
 */

const items = [
  {
    icon: TrendingUp,
    metric: "+312%",
    label: "Organic traffic",
    sub: "SaaS · 90d",
    glow: "hsl(162 100% 50%)",
  },
  {
    icon: MousePointerClick,
    metric: "4.2×",
    label: "ROAS on Google Ads",
    sub: "D2C · Q1 2025",
    glow: "hsl(192 95% 70%)",
  },
  {
    icon: Megaphone,
    metric: "₹1.2 Cr",
    label: "Pipeline generated",
    sub: "B2B · this quarter",
    glow: "hsl(322 90% 75%)",
  },
  {
    icon: Sparkles,
    metric: "−45%",
    label: "Cost per lead",
    sub: "Fintech · 60d",
    glow: "hsl(48 100% 65%)",
  },
];

export default function HeroKpiTicker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-8 w-full max-w-5xl px-2"
      role="region"
      aria-label="Recent client results scoreboard"
    >
      <div className="relative">
        {/* Frame */}
        <div className="glass-card-pro overflow-hidden rounded-2xl">
          <div className="grid grid-cols-2 divide-y divide-white/[0.06] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group relative flex items-center gap-3 px-4 py-4 md:px-5 md:py-5"
                >
                  {/* Pulsing dot */}
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                      style={{ background: item.glow }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{
                        background: item.glow,
                        boxShadow: `0 0 10px ${item.glow}`,
                      }}
                    />
                  </span>

                  {/* Icon */}
                  <Icon
                    className="hidden h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100 md:block"
                    style={{ color: item.glow }}
                    strokeWidth={1.8}
                  />

                  {/* Numbers + label */}
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="font-display text-lg font-extrabold tracking-tight md:text-xl"
                        style={{
                          color: item.glow,
                          textShadow: `0 0 24px ${item.glow}40`,
                        }}
                      >
                        {item.metric}
                      </span>
                    </div>
                    <p className="truncate text-[11px] font-medium leading-tight text-foreground/75 md:text-xs">
                      {item.label}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/40 md:text-[10px]">
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Soft ground-glow under the ribbon */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-12 -bottom-6 h-12 blur-2xl opacity-50"
          style={{
            background:
              "linear-gradient(90deg, hsl(162 100% 50% / 0.25), hsl(192 95% 70% / 0.25), hsl(322 90% 75% / 0.25), hsl(48 100% 65% / 0.25))",
          }}
        />
      </div>
    </motion.div>
  );
}
