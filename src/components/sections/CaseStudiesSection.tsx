import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const cases = [
  {
    title: "PropTech Leader",
    industry: "Real Estate",
    metric: "340%",
    metricLabel: "Lead increase",
    services: ["SEO", "PPC", "Automation"],
    gradient: "from-violet-600/30 via-violet-500/10 to-transparent",
    accentLine: "bg-violet-500",
  },
  {
    title: "Healthcare SaaS",
    industry: "Healthcare",
    metric: "₹12Cr",
    metricLabel: "Revenue generated",
    services: ["Digital Marketing", "PR", "Development"],
    gradient: "from-cyan-600/30 via-cyan-500/10 to-transparent",
    accentLine: "bg-cyan-500",
  },
  {
    title: "D2C Fashion Brand",
    industry: "E-commerce",
    metric: "8.2x",
    metricLabel: "ROAS achieved",
    services: ["Social Media", "Influencer", "Performance"],
    gradient: "from-emerald-600/30 via-emerald-500/10 to-transparent",
    accentLine: "bg-emerald-500",
  },
  {
    title: "Fintech Startup",
    industry: "Finance",
    metric: "50K+",
    metricLabel: "App downloads",
    services: ["App Dev", "AI Chatbot", "Marketing"],
    gradient: "from-amber-600/30 via-amber-500/10 to-transparent",
    accentLine: "bg-amber-500",
  },
];

export default function CaseStudiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 cv-auto">
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

        {/* Horizontal scroll on mobile, grid on desktop */}
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
                {/* Gradient image area with SVG art */}
                <div className={`h-40 bg-gradient-to-br ${c.gradient} relative overflow-hidden`}>
                  <div className={`absolute bottom-0 left-8 w-1 h-16 ${c.accentLine} rounded-full opacity-60`} />
                  {/* Decorative SVG */}
                  <svg className="absolute right-4 top-4 w-24 h-24 opacity-10" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
                    <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.3" className="text-foreground" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.3" className="text-foreground" />
                  </svg>
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
