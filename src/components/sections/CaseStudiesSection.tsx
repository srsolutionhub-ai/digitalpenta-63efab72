import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef } from "react";

import caseProptech from "@/assets/case-proptech.jpg";
import caseHealthcare from "@/assets/case-healthcare.jpg";
import caseEcommerce from "@/assets/case-ecommerce.jpg";
import caseFintech from "@/assets/case-fintech.jpg";

const cases = [
  {
    title: "PropTech Leader", industry: "Real Estate", metric: "340%", metricLabel: "Lead increase",
    description: "Built a full-funnel lead generation engine with SEO landing pages, Google Ads, and CRM automation that tripled qualified leads.",
    services: ["SEO", "PPC", "Automation"], image: caseProptech, glow: "hsl(256 90% 62%)",
  },
  {
    title: "Healthcare SaaS", industry: "Healthcare", metric: "₹12Cr", metricLabel: "Revenue generated",
    description: "Launched a multi-channel digital strategy combining organic growth, PR coverage, and a custom patient portal.",
    services: ["Digital Marketing", "PR", "Development"], image: caseHealthcare, glow: "hsl(162 100% 44%)",
  },
  {
    title: "D2C Fashion Brand", industry: "E-commerce", metric: "8.2x", metricLabel: "ROAS achieved",
    description: "Scaled Meta & Google ad spend profitably with influencer partnerships and performance-optimized creative.",
    services: ["Social Media", "Influencer", "Performance"], image: caseEcommerce, glow: "hsl(322 90% 62%)",
  },
  {
    title: "Fintech Startup", industry: "Finance", metric: "50K+", metricLabel: "App downloads",
    description: "Drove app installs through a combination of ASO, paid user acquisition, and an AI chatbot onboarding flow.",
    services: ["App Dev", "AI Chatbot", "Marketing"], image: caseFintech, glow: "hsl(192 95% 56%)",
  },
];

export default function CaseStudiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(50% 60% at 50% 0%, hsl(256 90% 30% / 0.18), transparent 70%)" }}
      />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-20"
        >
          <div>
            <span className="neon-chip">Case Studies</span>
            <h2 className="font-display type-h2 text-foreground mt-5">
              Real Client <span className="text-gradient-hero">Results</span>
            </h2>
          </div>
          <Link to="/portfolio" className="hidden md:flex items-center gap-1.5 text-sm font-display font-semibold neon-link bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, hsl(256 100% 80%), hsl(192 100% 75%))" }}
          >
            View all work <ArrowUpRight className="w-4 h-4 text-primary" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {cases.map((c, i) => (
            <CaseCard key={c.title} c={c} i={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseCard({ c, i, isInView }: { c: typeof cases[0]; i: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to="/portfolio"
        className="group glass-card-pro overflow-hidden block relative"
      >
        <div className="h-44 relative overflow-hidden">
          <img
            src={c.image}
            alt={c.title}
            loading="lazy"
            width={800}
            height={512}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, transparent 0%, ${c.glow}25 60%, hsl(var(--background)) 100%)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Industry chip */}
          <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-mono uppercase tracking-widest"
            style={{
              background: `${c.glow}20`,
              border: `1px solid ${c.glow}50`,
              color: c.glow,
            }}
          >
            {c.industry}
          </div>
        </div>

        <div className="p-8 relative">
          <div className="flex items-start justify-between mb-5">
            <h3 className="font-display font-bold text-xl text-foreground">{c.title}</h3>
            <ArrowUpRight className="w-5 h-5 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:rotate-12"
              style={{ color: c.glow, filter: `drop-shadow(0 0 6px ${c.glow}90)` }}
            />
          </div>
          <div className="mb-5">
            <span className="font-display font-extrabold text-5xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${c.glow}, hsl(0 0% 95%))`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 0 20px ${c.glow}50)`,
              }}
            >
              {c.metric}
            </span>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{c.metricLabel}</p>
          </div>

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.description}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 flex-wrap">
            {c.services.map((s) => (
              <span key={s} className="type-label px-3 py-1.5 rounded-full font-mono text-[10px] transition-colors"
                style={{
                  background: hovered ? `${c.glow}18` : "rgba(255,255,255,0.04)",
                  border: hovered ? `1px solid ${c.glow}40` : "1px solid rgba(255,255,255,0.06)",
                  color: hovered ? c.glow : "hsl(var(--muted-foreground))",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="mt-4"
              >
                <span className="text-sm font-display font-semibold flex items-center gap-1.5"
                  style={{ color: c.glow }}
                >
                  Read Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </motion.div>
  );
}
