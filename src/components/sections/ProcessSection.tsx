import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Search, Target, Rocket, BarChart3, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "Deep-dive audit of your brand, competitors, market & goals to uncover hidden opportunities.",
    icon: Search,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    glow: "shadow-violet-500/20",
  },
  {
    num: "02",
    title: "Strategy",
    desc: "Data-backed roadmap across all five pillars — tailored timelines, KPIs & budget allocation.",
    icon: Target,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    glow: "shadow-cyan-500/20",
  },
  {
    num: "03",
    title: "Execute",
    desc: "Cross-functional teams launch campaigns, build platforms & deploy AI — all in sync.",
    icon: Rocket,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "shadow-emerald-500/20",
  },
  {
    num: "04",
    title: "Optimize",
    desc: "Real-time analytics, A/B testing & machine learning continuously improve every metric.",
    icon: BarChart3,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    glow: "shadow-amber-500/20",
  },
  {
    num: "05",
    title: "Scale",
    desc: "Proven playbooks replicated across new markets, channels & verticals for exponential growth.",
    icon: TrendingUp,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    glow: "shadow-orange-500/20",
  },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 cv-auto">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Process</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            How We <span className="text-gradient">Deliver Results</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A proven five-phase methodology that transforms ideas into measurable, scalable outcomes.
          </p>
        </motion.div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* SVG connecting line */}
          <svg className="absolute top-[52px] left-[10%] right-[10%] w-[80%] h-2 z-0" preserveAspectRatio="none">
            <motion.line
              x1="0" y1="4" x2="100%" y2="4"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(252, 60%, 63%)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="hsl(190, 100%, 50%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(30, 90%, 55%)" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Circle node */}
                  <div className={`w-[104px] h-[104px] rounded-2xl ${step.bg} border flex flex-col items-center justify-center mb-6 shadow-lg ${step.glow} relative`}>
                    <Icon className={`w-6 h-6 ${step.color} mb-1`} />
                    <span className={`text-[10px] font-mono ${step.color} tracking-wider`}>{step.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="lg:hidden relative pl-12">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-primary/10" />

          <div className="space-y-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  {/* Node dot */}
                  <div className={`absolute -left-12 top-1 w-9 h-9 rounded-xl ${step.bg} border flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono ${step.color} tracking-wider`}>{step.num}</span>
                    <h3 className="font-display font-bold text-lg text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
