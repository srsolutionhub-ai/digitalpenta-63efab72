import { Shield, Layers, Globe, TrendingUp, Users, Clock, Zap, BarChart3 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import whyusBanner from "@/assets/whyus-banner-graphic.jpg";

const bentoItems = [
  { icon: Layers, title: "Integrated 5-Pillar Approach", desc: "Marketing, PR, Development, AI & Automation — all under one roof. No fragmented agencies, no communication gaps. One team, one vision, compounding results.", size: "lg" },
  { icon: TrendingUp, title: "ROI Obsessed", desc: "Every campaign tied to measurable KPIs. We optimize until the numbers sing.", size: "sm" },
  { icon: Zap, title: "Speed to Market", desc: "Launch in weeks, not months. Agile sprints with rapid deployment.", size: "sm" },
  { icon: Globe, title: "India + Middle East", desc: "Deep expertise across Delhi, Dubai, Riyadh, Abu Dhabi & Doha markets.", size: "sm" },
  { icon: Shield, title: "Enterprise Grade", desc: "Processes, SLAs, and security standards that large brands demand.", size: "sm" },
  { icon: Users, title: "Dedicated Teams", desc: "Your own strategist, designer, developer & account manager — no outsourcing.", size: "sm" },
  { icon: BarChart3, title: "Transparent Reporting", desc: "Real-time dashboards, weekly updates & detailed monthly reports.", size: "sm" },
];

export default function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Premium background graphic */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={whyusBanner}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
          style={{ opacity: 0.18 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.6) 75%, hsl(var(--background)) 100%)",
          }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <span className="type-label text-primary font-mono">Why Digital Penta</span>
          <h2 className="font-display type-h2 text-foreground mt-3 mb-4">
            Why 500+ Brands Trust <span className="text-primary">Digital Penta</span>
          </h2>
          <p className="type-body max-w-md mx-auto">
            We don't just execute — we architect growth systems that compound over time.
          </p>
        </motion.div>

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
                className={`rounded-2xl card-surface hover-lift ${
                  isLarge ? "md:col-span-2 md:row-span-2 p-10" : "p-6"
                }`}
              >
                <div className="relative z-10">
                  <div className={`${isLarge ? "w-12 h-12 mb-6" : "w-10 h-10 mb-4"} rounded-xl card-surface flex items-center justify-center`}>
                    <Icon className={`${isLarge ? "w-6 h-6" : "w-5 h-5"} text-accent`} />
                  </div>
                  <h3 className={`font-display font-bold text-foreground mb-2 ${isLarge ? "type-h3" : "text-base"}`}>{item.title}</h3>
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
