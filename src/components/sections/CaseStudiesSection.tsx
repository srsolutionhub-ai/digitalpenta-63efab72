import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

/* Abstract data-viz SVG compositions per case study */
const CaseSVG1 = () => (
  <svg viewBox="0 0 300 160" className="absolute inset-0 w-full h-full" fill="none" opacity="0.15">
    <rect x="30" y="100" width="20" height="50" rx="4" fill="hsl(252, 60%, 63%)" />
    <rect x="60" y="70" width="20" height="80" rx="4" fill="hsl(252, 60%, 63%)" opacity=".7" />
    <rect x="90" y="40" width="20" height="110" rx="4" fill="hsl(252, 60%, 63%)" opacity=".9" />
    <rect x="120" y="20" width="20" height="130" rx="4" fill="hsl(190, 100%, 50%)" />
    <motion.path d="M40 95 L70 65 L100 35 L130 15" stroke="hsl(190, 100%, 50%)" strokeWidth="2" strokeDasharray="4 2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
    <circle cx="230" cy="80" r="40" stroke="hsl(252, 60%, 63%)" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="230" cy="80" r="25" fill="hsl(252, 60%, 63%)" opacity=".2" />
  </svg>
);

const CaseSVG2 = () => (
  <svg viewBox="0 0 300 160" className="absolute inset-0 w-full h-full" fill="none" opacity="0.15">
    <motion.path d="M20 120 Q80 20 150 80 Q220 140 280 40" stroke="hsl(190, 100%, 50%)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.3 }} />
    <circle cx="150" cy="80" r="4" fill="hsl(190, 100%, 50%)" />
    <circle cx="80" cy="50" r="30" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" />
    <circle cx="220" cy="60" r="20" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" />
    <line x1="80" y1="50" x2="220" y2="60" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" strokeDasharray="4 4" />
  </svg>
);

const CaseSVG3 = () => (
  <svg viewBox="0 0 300 160" className="absolute inset-0 w-full h-full" fill="none" opacity="0.15">
    <path d="M150 30 L230 80 L200 140 L100 140 L70 80 Z" stroke="hsl(160, 84%, 39%)" strokeWidth="1" />
    <path d="M150 50 L210 85 L190 130 L110 130 L90 85 Z" stroke="hsl(160, 84%, 39%)" strokeWidth="0.5" opacity=".5" />
    <circle cx="150" cy="30" r="3" fill="hsl(160, 84%, 39%)" />
    <circle cx="230" cy="80" r="3" fill="hsl(160, 84%, 39%)" />
    <circle cx="70" cy="80" r="3" fill="hsl(160, 84%, 39%)" />
    <motion.circle cx="150" cy="90" r="15" stroke="hsl(160, 84%, 39%)" strokeWidth="1" fill="hsl(160, 84%, 39%)" fillOpacity=".1"
      animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} />
  </svg>
);

const CaseSVG4 = () => (
  <svg viewBox="0 0 300 160" className="absolute inset-0 w-full h-full" fill="none" opacity="0.15">
    {[40, 80, 120, 160, 200, 240].map((x, i) => (
      <motion.rect key={i} x={x} y={130 - (i + 1) * 15} width="16" height={(i + 1) * 15} rx="3" fill="hsl(38, 92%, 50%)"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }}
        style={{ transformOrigin: `${x + 8}px 130px` }} />
    ))}
    <motion.path d="M48 115 L88 100 L128 85 L168 70 L208 55 L248 35" stroke="hsl(38, 92%, 50%)" strokeWidth="1.5" strokeDasharray="3 2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.6 }} />
  </svg>
);

const caseSVGs = [CaseSVG1, CaseSVG2, CaseSVG3, CaseSVG4];

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
          {cases.map((c, i) => {
            const SVG = caseSVGs[i];
            return (
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
                  <div className={`h-40 bg-gradient-to-br ${c.gradient} relative overflow-hidden`}>
                    <div className={`absolute bottom-0 left-8 w-1 h-16 ${c.accentLine} rounded-full opacity-60`} />
                    <SVG />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
