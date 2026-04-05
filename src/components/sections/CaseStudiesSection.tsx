import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

import caseProptech from "@/assets/case-proptech.jpg";
import caseHealthcare from "@/assets/case-healthcare.jpg";
import caseEcommerce from "@/assets/case-ecommerce.jpg";
import caseFintech from "@/assets/case-fintech.jpg";

const cases = [
  {
    title: "PropTech Leader",
    industry: "Real Estate",
    metric: "340%",
    metricLabel: "Lead increase",
    services: ["SEO", "PPC", "Automation"],
    image: caseProptech,
    accentLine: "bg-violet-500",
  },
  {
    title: "Healthcare SaaS",
    industry: "Healthcare",
    metric: "₹12Cr",
    metricLabel: "Revenue generated",
    services: ["Digital Marketing", "PR", "Development"],
    image: caseHealthcare,
    accentLine: "bg-cyan-500",
  },
  {
    title: "D2C Fashion Brand",
    industry: "E-commerce",
    metric: "8.2x",
    metricLabel: "ROAS achieved",
    services: ["Social Media", "Influencer", "Performance"],
    image: caseEcommerce,
    accentLine: "bg-emerald-500",
  },
  {
    title: "Fintech Startup",
    industry: "Finance",
    metric: "50K+",
    metricLabel: "App downloads",
    services: ["App Dev", "AI Chatbot", "Marketing"],
    image: caseFintech,
    accentLine: "bg-amber-500",
  },
];

export default function CaseStudiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Case Studies</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3">
              Results That <span className="text-gradient">Speak.</span>
            </h2>
          </div>
          <Link to="/portfolio" className="hidden md:flex items-center gap-1.5 text-sm text-primary hover:text-foreground transition-colors font-display font-semibold">
            View all work <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-[85vw] sm:min-w-[60vw] md:min-w-0 snap-center"
            >
              <Link
                to="/portfolio"
                className="group relative rounded-2xl glass border border-border/30 overflow-hidden transition-all duration-500 hover:border-primary/20 hover:shadow-2xl block shimmer-card"
              >
                <div className="h-40 relative overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className={`absolute bottom-0 left-8 w-1 h-16 ${c.accentLine} rounded-full opacity-60`} />
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{c.industry}</span>
                      <h3 className="font-display font-bold text-xl text-foreground mt-1">{c.title}</h3>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="mb-5">
                    <span className="font-display font-extrabold text-5xl text-gradient">{c.metric}</span>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{c.metricLabel}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {c.services.map((s) => (
                      <span key={s} className="text-[10px] px-3 py-1.5 rounded-full bg-secondary/60 text-secondary-foreground font-mono border border-border/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
