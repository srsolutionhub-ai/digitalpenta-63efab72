import { ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

import caseProptech from "@/assets/case-proptech.jpg";
import caseHealthcare from "@/assets/case-healthcare.jpg";
import caseEcommerce from "@/assets/case-ecommerce.jpg";
import caseFintech from "@/assets/case-fintech.jpg";

type CaseItem = {
  title: string;
  industry: string;
  metric: string;
  metricLabel: string;
  description: string;
  services: string[];
  image: string;
  glow: string;
  glowSoft: string;
};

const cases: CaseItem[] = [
  {
    title: "PropTech Leader",
    industry: "Real Estate",
    metric: "340%",
    metricLabel: "Lead increase",
    description:
      "A full-funnel lead engine — SEO landing pages, Google Ads, and CRM automation — that tripled qualified pipeline in two quarters.",
    services: ["SEO", "PPC", "Automation"],
    image: caseProptech,
    glow: "hsl(256 90% 65%)",
    glowSoft: "hsl(256 90% 65% / 0.18)",
  },
  {
    title: "Healthcare SaaS",
    industry: "Healthcare",
    metric: "₹12Cr",
    metricLabel: "Revenue generated",
    description:
      "Multi-channel growth: organic, PR coverage, and a custom patient portal that scaled MRR.",
    services: ["Marketing", "PR", "Dev"],
    image: caseHealthcare,
    glow: "hsl(162 100% 50%)",
    glowSoft: "hsl(162 100% 50% / 0.18)",
  },
  {
    title: "D2C Fashion Brand",
    industry: "E-commerce",
    metric: "8.2x",
    metricLabel: "ROAS achieved",
    description:
      "Scaled Meta & Google ad spend with creator partnerships and creative testing.",
    services: ["Social", "Influencer", "Performance"],
    image: caseEcommerce,
    glow: "hsl(322 90% 65%)",
    glowSoft: "hsl(322 90% 65% / 0.18)",
  },
  {
    title: "Fintech Startup",
    industry: "Finance",
    metric: "50K+",
    metricLabel: "App downloads",
    description:
      "ASO, paid UA, and AI chatbot onboarding driving installs and activation.",
    services: ["App Dev", "AI", "Marketing"],
    image: caseFintech,
    glow: "hsl(192 95% 60%)",
    glowSoft: "hsl(192 95% 60% / 0.18)",
  },
];

export default function CaseStudiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [featured, ...rest] = cases;

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, hsl(256 90% 35% / 0.18), transparent 70%), radial-gradient(45% 40% at 85% 100%, hsl(192 95% 30% / 0.14), transparent 70%)",
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, hsl(0 0% 0%) 40%, transparent 80%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20"
        >
          <div className="max-w-2xl">
            <span className="neon-chip">
              <Sparkles className="w-3 h-3" />
              Selected Work
            </span>
            <h2 className="font-display type-h2 text-foreground mt-5">
              Outcomes worth <span className="text-gradient-hero">framing</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl leading-relaxed">
              A small selection of brands we partnered with — measurable lift,
              clean execution, no fluff.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 self-start md:self-end px-5 py-2.5 rounded-full glass-card-pro hover:scale-[1.02] transition-transform"
          >
            <span
              className="text-sm font-display font-semibold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, hsl(256 100% 82%), hsl(192 100% 78%))",
              }}
            >
              View all work
            </span>
            <ArrowUpRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Magazine grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          {/* Featured - large */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 lg:row-span-2"
          >
            <FeaturedCard c={featured} />
          </motion.div>

          {/* Smaller cards */}
          {rest.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={
                i === 0
                  ? "lg:col-span-5"
                  : i === 1
                  ? "lg:col-span-2 md:col-span-1"
                  : "lg:col-span-3"
              }
            >
              <CompactCard c={c} variant={i === 1 ? "tall" : "wide"} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Featured ----------------------------- */
function FeaturedCard({ c }: { c: CaseItem }) {
  return (
    <Link
      to="/portfolio"
      className="group relative block h-full min-h-[520px] rounded-3xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        background:
          "linear-gradient(145deg, hsl(240 12% 9%), hsl(240 14% 6%))",
      }}
    >
      {/* Animated gradient border */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-3xl p-px pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, hsl(256 90% 65% / 0.5), hsl(192 95% 60% / 0.25) 40%, transparent 70%, hsl(322 90% 65% / 0.4))",
          WebkitMask:
            "linear-gradient(hsl(0 0% 0%) 0 0) content-box, linear-gradient(hsl(0 0% 0%) 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          width={1200}
          height={800}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.04] transition-[opacity,transform] duration-700 ease-out"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, hsl(240 20% 5% / 0.2) 0%, hsl(240 20% 5% / 0.55) 50%, hsl(240 20% 5%) 92%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(60% 50% at 80% 20%, ${c.glowSoft}, transparent 70%)`,
          }}
        />
      </div>

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between p-7 md:p-9">
        <div className="flex items-center gap-2.5">
          <span
            className="px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.18em]"
            style={{
              background: `${c.glow.replace(")", " / 0.14)")}`,
              border: `1px solid ${c.glow.replace(")", " / 0.45)")}`,
              color: c.glow,
            }}
          >
            {c.industry}
          </span>
          <span className="px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.18em] border border-white/10 bg-white/[0.03] text-foreground/70 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_hsl(152_100%_50%)] animate-pulse" />
            Featured
          </span>
        </div>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-500 group-hover:rotate-45"
          style={{
            background: `${c.glow.replace(")", " / 0.16)")}`,
            border: `1px solid ${c.glow.replace(")", " / 0.4)")}`,
            boxShadow: `0 0 24px ${c.glow.replace(")", " / 0.35)")}`,
          }}
        >
          <ArrowUpRight className="w-5 h-5" style={{ color: c.glow }} />
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-7 md:p-9 z-10">
        <div className="flex items-end gap-6 mb-5">
          <span
            className="font-display font-extrabold text-6xl md:text-7xl leading-none tracking-tight"
            style={{
              backgroundImage: `linear-gradient(135deg, ${c.glow}, hsl(0 0% 98%))`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 28px ${c.glow.replace(")", " / 0.45)")})`,
            }}
          >
            {c.metric}
          </span>
          <div className="pb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-foreground/60">
              <TrendingUp className="w-3 h-3" style={{ color: c.glow }} />
              {c.metricLabel}
            </div>
          </div>
        </div>

        <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
          {c.title}
        </h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mb-6">
          {c.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {c.services.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-colors"
              style={{
                background: "hsl(0 0% 100% / 0.04)",
                border: "1px solid hsl(0 0% 100% / 0.08)",
                color: "hsl(220 15% 70%)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

/* ----------------------------- Compact ----------------------------- */
function CompactCard({
  c,
  variant,
}: {
  c: CaseItem;
  variant: "wide" | "tall";
}) {
  return (
    <Link
      to="/portfolio"
      className="group relative block h-full rounded-3xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        minHeight: variant === "tall" ? 520 : 250,
        background:
          "linear-gradient(145deg, hsl(240 12% 9%), hsl(240 14% 6%))",
      }}
    >
      {/* Gradient border */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-3xl p-px pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${c.glow.replace(
            ")",
            " / 0.4)"
          )}, transparent 60%, ${c.glow.replace(")", " / 0.25)")})`,
          WebkitMask:
            "linear-gradient(hsl(0 0% 0%) 0 0) content-box, linear-gradient(hsl(0 0% 0%) 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover opacity-30 group-hover:opacity-55 group-hover:scale-[1.05] transition-[opacity,transform] duration-700"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, hsl(240 20% 5% / 0.4) 0%, hsl(240 20% 5% / 0.7) 60%, hsl(240 20% 5%) 95%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity duration-500"
          style={{
            background: `radial-gradient(80% 60% at 50% 100%, ${c.glowSoft}, transparent 70%)`,
          }}
        />
      </div>

      {/* Industry chip */}
      <div className="relative z-10 p-5 md:p-6 flex items-start justify-between">
        <span
          className="px-2.5 py-1 rounded-full backdrop-blur-md text-[9px] font-mono uppercase tracking-[0.18em]"
          style={{
            background: `${c.glow.replace(")", " / 0.12)")}`,
            border: `1px solid ${c.glow.replace(")", " / 0.4)")}`,
            color: c.glow,
          }}
        >
          {c.industry}
        </span>
        <ArrowUpRight
          className="w-4 h-4 transition-all opacity-0 group-hover:opacity-100 group-hover:rotate-12"
          style={{ color: c.glow, filter: `drop-shadow(0 0 6px ${c.glow})` }}
        />
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 z-10">
        <span
          className="font-display font-extrabold text-4xl md:text-5xl leading-none block mb-1"
          style={{
            backgroundImage: `linear-gradient(135deg, ${c.glow}, hsl(0 0% 96%))`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 18px ${c.glow.replace(")", " / 0.4)")})`,
          }}
        >
          {c.metric}
        </span>
        <p className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 mb-3">
          {c.metricLabel}
        </p>
        <h3 className="font-display font-bold text-base md:text-lg text-foreground mb-1">
          {c.title}
        </h3>
        <div className="h-px w-10 my-2.5" style={{ background: `linear-gradient(90deg, ${c.glow}, transparent)` }} />
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {c.description}
        </p>
      </div>
    </Link>
  );
}
