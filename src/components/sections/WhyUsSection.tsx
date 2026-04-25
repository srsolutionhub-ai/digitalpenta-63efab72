import { Shield, Layers, Globe, TrendingUp, Users, Zap, BarChart3 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import whyusBanner from "@/assets/whyus-banner-graphic.jpg";

const bentoItems = [
  {
    icon: Layers,
    title: "Integrated 5-Pillar Approach",
    desc: "Marketing, PR, Development, AI & Automation — all under one roof. No fragmented agencies, no communication gaps. One team, one vision, compounding results.",
    size: "lg",
    accent: "violet",
    glow: "hsl(256 90% 62%)",
  },
  { icon: TrendingUp, title: "ROI Obsessed", desc: "Every campaign tied to measurable KPIs. We optimize until the numbers sing.", size: "sm", accent: "cyan", glow: "hsl(192 95% 56%)" },
  { icon: Zap, title: "Speed to Market", desc: "Launch in weeks, not months. Agile sprints with rapid deployment.", size: "sm", accent: "pink", glow: "hsl(322 90% 62%)" },
  { icon: Globe, title: "India + Middle East", desc: "Deep expertise across Delhi, Dubai, Riyadh, Abu Dhabi & Doha markets.", size: "sm", accent: "emerald", glow: "hsl(162 100% 44%)" },
  { icon: Shield, title: "Enterprise Grade", desc: "Processes, SLAs, and security standards that large brands demand.", size: "sm", accent: "amber", glow: "hsl(38 100% 60%)" },
  { icon: Users, title: "Dedicated Teams", desc: "Your own strategist, designer, developer & account manager — no outsourcing.", size: "sm", accent: "violet", glow: "hsl(256 90% 62%)" },
  { icon: BarChart3, title: "Transparent Reporting", desc: "Real-time dashboards, weekly updates & detailed monthly reports.", size: "sm", accent: "cyan", glow: "hsl(192 95% 56%)" },
];

export default function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Premium ambient background */}
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
          style={{ opacity: 0.14 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 30%, hsl(256 90% 30% / 0.25), transparent 60%), radial-gradient(50% 50% at 80% 70%, hsl(192 95% 35% / 0.18), transparent 60%)",
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
          <span className="neon-chip">Why Digital Penta</span>
          <h2 className="font-display type-h2 text-foreground mt-5 mb-4">
            Why 500+ Brands Trust{" "}
            <span className="text-gradient-hero">Digital Penta</span>
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
                className={`glass-card-pro group ${isLarge ? "md:col-span-2 md:row-span-2 p-10" : "p-6"}`}
                style={
                  {
                    "--card-glow": item.glow,
                  } as React.CSSProperties
                }
              >
                {/* per-card accent halo */}
                <div
                  className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${item.glow}38, transparent 65%)`, filter: "blur(20px)" }}
                />
                <div className="relative z-10">
                  <div
                    className={`${isLarge ? "w-14 h-14 mb-6" : "w-11 h-11 mb-4"} rounded-xl flex items-center justify-center relative overflow-hidden`}
                    style={{
                      background: `linear-gradient(135deg, ${item.glow}28, ${item.glow}10)`,
                      border: `1px solid ${item.glow}40`,
                      boxShadow: `0 0 24px -6px ${item.glow}50`,
                    }}
                  >
                    <Icon
                      className={`${isLarge ? "w-6 h-6" : "w-5 h-5"}`}
                      style={{ color: item.glow, filter: `drop-shadow(0 0 6px ${item.glow}90)` }}
                    />
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
