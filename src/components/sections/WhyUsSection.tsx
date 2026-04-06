import { Shield, Layers, Globe, TrendingUp, Users, Clock, Zap, BarChart3 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const bentoItems = [
  {
    icon: Layers,
    title: "Integrated 5-Pillar Approach",
    desc: "Marketing, PR, Development, AI & Automation — all under one roof. No fragmented agencies, no communication gaps. One team, one vision, compounding results.",
    size: "lg",
    accent: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: TrendingUp,
    title: "ROI Obsessed",
    desc: "Every campaign tied to measurable KPIs. We optimize until the numbers sing.",
    size: "sm",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Speed to Market",
    desc: "Launch in weeks, not months. Agile sprints with rapid deployment.",
    size: "sm",
    accent: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Globe,
    title: "India + Middle East",
    desc: "Deep expertise across Delhi, Dubai, Riyadh, Abu Dhabi & Doha markets.",
    size: "sm",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Grade",
    desc: "Processes, SLAs, and security standards that large brands demand.",
    size: "sm",
    accent: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Users,
    title: "Dedicated Teams",
    desc: "Your own strategist, designer, developer & account manager — no outsourcing.",
    size: "sm",
    accent: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: BarChart3,
    title: "Transparent Reporting",
    desc: "Real-time dashboards, weekly updates & detailed monthly reports.",
    size: "sm",
    accent: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
];

export default function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Why Digital Penta</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Why Choose <span className="text-gradient">Digital Penta?</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We don't just execute — we architect growth systems that compound over time.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {bentoItems.map((item, i) => {
            const Icon = item.icon;
            const isLarge = item.size === "lg";
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl glass border transition-all duration-500 hover:bg-card/60 relative overflow-hidden group ${
                  isLarge
                    ? "md:col-span-2 md:row-span-2 border-primary/15 p-10"
                    : "border-border/30 hover:border-primary/15 p-6"
                }`}
              >
                {isLarge && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-accent/[0.02]" />
                )}
                <div className="relative z-10">
                  <div className={`${isLarge ? "w-14 h-14 mb-6" : "w-10 h-10 mb-4"} rounded-xl ${item.bg} border flex items-center justify-center`}>
                    <Icon className={`${isLarge ? "w-7 h-7" : "w-5 h-5"} ${item.accent}`} />
                  </div>
                  <h3 className={`font-display font-bold text-foreground mb-2 ${isLarge ? "text-2xl" : "text-base"}`}>{item.title}</h3>
                  <p className={`text-muted-foreground leading-relaxed ${isLarge ? "text-base max-w-md" : "text-xs"}`}>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
