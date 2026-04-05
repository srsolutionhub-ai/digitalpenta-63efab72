import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

/* Background SVG patterns per service */
const patterns: Record<string, JSX.Element> = {
  "Digital Marketing": (
    <svg className="absolute right-0 bottom-0 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100" fill="none">
      <path d="M10 80 L30 40 L50 60 L70 20 L90 50" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="90" cy="50" r="4" fill="currentColor" />
      <circle cx="70" cy="20" r="3" fill="currentColor" />
    </svg>
  ),
  "Public Relations": (
    <svg className="absolute right-0 bottom-0 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const r = 30, x = 50 + r * Math.cos((a * Math.PI) / 180), y = 50 + r * Math.sin((a * Math.PI) / 180);
        return <line key={a} x1="50" y1="50" x2={x} y2={y} stroke="currentColor" strokeWidth="0.3" />;
      })}
    </svg>
  ),
  "Development": (
    <svg className="absolute right-0 bottom-0 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100" fill="none">
      <text x="15" y="35" fontSize="10" fill="currentColor" fontFamily="monospace">{"<div>"}</text>
      <text x="25" y="50" fontSize="10" fill="currentColor" fontFamily="monospace">{"{ }"}</text>
      <text x="15" y="65" fontSize="10" fill="currentColor" fontFamily="monospace">{"</>"}</text>
      <rect x="60" y="25" width="30" height="50" rx="4" stroke="currentColor" strokeWidth="0.5" />
      <line x1="60" y1="38" x2="90" y2="38" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  ),
  "AI Solutions": (
    <svg className="absolute right-0 bottom-0 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="40" r="12" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="30" cy="70" r="8" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="70" cy="70" r="8" stroke="currentColor" strokeWidth="0.5" />
      <line x1="50" y1="52" x2="30" y2="62" stroke="currentColor" strokeWidth="0.5" />
      <line x1="50" y1="52" x2="70" y2="62" stroke="currentColor" strokeWidth="0.5" />
      <line x1="30" y1="70" x2="70" y2="70" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 3" />
    </svg>
  ),
  "Automation": (
    <svg className="absolute right-0 bottom-0 w-32 h-32 opacity-[0.04]" viewBox="0 0 100 100" fill="none">
      <rect x="20" y="30" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="0.5" />
      <rect x="60" y="30" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="0.5" />
      <rect x="40" y="60" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="0.5" />
      <path d="M40 37 L60 37" stroke="currentColor" strokeWidth="0.5" markerEnd="url(#arrow)" />
      <path d="M50 44 L50 60" stroke="currentColor" strokeWidth="0.5" />
      <path d="M30 44 L30 55 L40 67" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
};

const pillars = [
  {
    title: "Digital Marketing",
    desc: "SEO, PPC, Social Media, Content & Performance Marketing that delivers measurable ROI.",
    href: "/services/digital-marketing",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    svgIcon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12l4-4 4 4 4-8 4 4" className="text-violet-400" />
        <circle cx="21" cy="8" r="2" className="text-violet-400" />
      </svg>
    ),
  },
  {
    title: "Public Relations",
    desc: "Media relations, brand reputation, crisis management & thought leadership across markets.",
    href: "/services/public-relations",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    svgIcon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" className="text-cyan-400" />
        <line x1="4" y1="22" x2="4" y2="15" className="text-cyan-400" />
      </svg>
    ),
  },
  {
    title: "Development",
    desc: "Websites, mobile apps, e-commerce platforms & custom web applications built to scale.",
    href: "/services/development",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    svgIcon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="16 18 22 12 16 6" className="text-emerald-400" />
        <polyline points="8 6 2 12 8 18" className="text-emerald-400" />
        <line x1="14" y1="4" x2="10" y2="20" className="text-emerald-400" />
      </svg>
    ),
  },
  {
    title: "AI Solutions",
    desc: "AI strategy, chatbots, predictive analytics, NLP & computer vision for competitive edge.",
    href: "/services/ai-solutions",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    svgIcon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" className="text-amber-400" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" className="text-amber-400" />
      </svg>
    ),
  },
  {
    title: "Automation",
    desc: "Marketing, workflow, CRM & sales automation to eliminate manual tasks and scale faster.",
    href: "/services/automation",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10 border-orange-500/20",
    svgIcon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" className="text-orange-400" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Five Pillars</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4 leading-tight">
            One Agency. Five <span className="text-gradient">Superpowers.</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            Each pillar works independently or together — creating compounding impact that fragmented agencies simply can't match.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={i === 0 ? "lg:col-span-2" : ""}
            >
              <Link
                to={p.href}
                className="group relative rounded-2xl glass border border-border/30 p-7 flex flex-col h-full transition-all duration-500 hover:bg-card/60 hover:border-primary/20 hover:shadow-2xl rotating-border shimmer-card overflow-hidden"
              >
                {/* Background SVG pattern */}
                <div className={`absolute inset-0 ${p.iconColor} pointer-events-none`}>
                  {patterns[p.title]}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${p.iconBg} border flex items-center justify-center ${p.iconColor}`}>
                      {p.svgIcon}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                  <div className="mt-5 pt-4 border-t border-border/30">
                    <span className="text-xs font-mono text-primary group-hover:text-foreground transition-colors">Explore →</span>
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
