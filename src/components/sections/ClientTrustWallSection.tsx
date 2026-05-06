import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck, Award, Trophy, Sparkles, BadgeCheck, ArrowRight, TrendingUp,
} from "lucide-react";

/**
 * ClientTrustWallSection
 * ----------------------
 * Dense, high-density social-proof block placed between PressAwardsStrip
 * and the deeper sections of the homepage. Three layers:
 *   1. Logo wall (24 brands, 4 rows × 6 cols on desktop)
 *   2. Certified-partner badge row with verified ticks
 *   3. Auto-rotating results metrics carousel
 *
 * No external image deps — all marks are wordmark-style SVG text on
 * frosted-glass tiles to keep the bundle tiny and look premium.
 */

const BRANDS = [
  "Zomato", "Lenskart", "PharmEasy", "Vedantu", "CarDekho", "Urban Company",
  "BoAt", "Mamaearth", "Cure.fit", "Razorpay", "Cred", "Groww",
  "Nykaa", "Swiggy", "Paytm", "MakeMyTrip", "Byju's", "MPL",
  "Bewakoof", "Pepperfry", "Practo", "OYO", "Treebo", "Ola",
];

const CERTS = [
  { icon: Trophy, label: "Google Premier Partner", sub: "Top 3% Worldwide", glow: "hsl(48 100% 65%)" },
  { icon: Award, label: "Meta Business Partner", sub: "Verified · 2024", glow: "hsl(192 95% 70%)" },
  { icon: ShieldCheck, label: "HubSpot Solutions", sub: "Platinum Tier", glow: "hsl(16 100% 65%)" },
  { icon: Sparkles, label: "Shopify Plus Partner", sub: "Certified Builder", glow: "hsl(162 100% 50%)" },
  { icon: BadgeCheck, label: "AWS Select Partner", sub: "Cloud Verified", glow: "hsl(38 100% 60%)" },
  { icon: TrendingUp, label: "Semrush Agency Partner", sub: "Top 50 in India", glow: "hsl(322 90% 75%)" },
];

const RESULTS = [
  { metric: "+312%", label: "Organic traffic", client: "B2B SaaS, Bangalore", color: "hsl(162 100% 50%)" },
  { metric: "4.2X",   label: "Return on ad spend", client: "D2C Beauty, Mumbai", color: "hsl(322 90% 70%)" },
  { metric: "−63%",   label: "Cost per lead", client: "Real Estate, Dubai", color: "hsl(192 95% 70%)" },
  { metric: "₹18Cr",  label: "Pipeline added in 9 months", client: "Fintech, Delhi", color: "hsl(48 100% 65%)" },
  { metric: "92K",    label: "Qualified leads", client: "EdTech, Pan-India", color: "hsl(256 90% 75%)" },
];

export default function ClientTrustWallSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [resultIdx, setResultIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setResultIdx((i) => (i + 1) % RESULTS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const current = RESULTS[resultIdx];

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden border-y border-white/[0.05]"
      aria-labelledby="trust-wall-heading"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, hsl(256 90% 30% / 0.18), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="type-label text-primary font-mono">Brands we've grown</span>
          <h2
            id="trust-wall-heading"
            className="font-display font-bold text-3xl md:text-5xl text-foreground mt-4 leading-tight"
          >
            Trusted by 500+ brands across{" "}
            <span className="text-primary">India & the Middle East</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base leading-relaxed">
            From early-stage startups to listed enterprises — the same playbook,
            the same senior team, measurable results in 90 days.
          </p>
        </motion.div>

        {/* Logo wall */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3 mb-16">
          {BRANDS.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.015 }}
              className="group relative h-14 md:h-16 flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/30 transition-all"
            >
              <span className="font-display font-semibold text-sm md:text-base text-foreground/55 group-hover:text-foreground transition-colors tracking-tight">
                {b}
              </span>
              <span
                aria-hidden
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(60% 80% at 50% 50%, hsl(256 90% 60% / 0.08), transparent 70%)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Certified-partner badge row */}
        <div className="mb-16">
          <p className="text-center type-label font-mono text-muted-foreground mb-6">
            Certified by the platforms that matter
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CERTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                  className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm p-4 hover:border-primary/30 transition-all"
                  style={{ boxShadow: `0 0 0 1px transparent` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${c.glow}25, ${c.glow}08)`,
                      border: `1px solid ${c.glow}40`,
                      boxShadow: `0 0 18px -4px ${c.glow}80`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: c.glow }} />
                  </div>
                  <p className="font-display font-semibold text-sm text-foreground leading-tight">
                    {c.label}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-1 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-primary" /> {c.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live results carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mx-auto max-w-4xl rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card/40 to-card/40 backdrop-blur-xl p-6 md:p-10 overflow-hidden"
        >
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40"
            style={{ background: current.color }}
          />
          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center relative">
            <div>
              <p className="type-label font-mono text-primary mb-2">Recent client wins</p>
              <motion.p
                key={current.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display font-extrabold text-5xl md:text-6xl tracking-tight"
                style={{ color: current.color, filter: `drop-shadow(0 0 18px ${current.color}55)` }}
              >
                {current.metric}
              </motion.p>
              <motion.p
                key={current.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-foreground font-display font-semibold text-base md:text-lg mt-1"
              >
                {current.label}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">{current.client}</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-foreground/85 leading-relaxed">
                Every result is benchmarked against pre-engagement baselines, audited monthly,
                and visible in your client dashboard in real time. No vanity metrics.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  See full case studies <ArrowRight className="w-4 h-4" />
                </a>
                <span className="text-xs text-muted-foreground">·</span>
                <div className="flex items-center gap-1">
                  {RESULTS.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Show result ${i + 1}`}
                      onClick={() => setResultIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === resultIdx ? "w-6 bg-primary" : "w-1.5 bg-white/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
