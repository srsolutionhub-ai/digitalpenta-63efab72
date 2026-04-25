import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Search, FileText, Rocket, BarChart3, TrendingUp } from "lucide-react";
import processBanner from "@/assets/process-banner-graphic.jpg";

const steps = [
  { num: "01", title: "Free Audit", desc: "We analyze your current digital presence — website, SEO, social media & ads — to find hidden opportunities.", icon: Search, glow: "hsl(256 90% 62%)" },
  { num: "02", title: "Custom Strategy", desc: "Tailored 90-day roadmap built for your goals — channels, budget, KPIs & content plan all included.", icon: FileText, glow: "hsl(192 95% 56%)" },
  { num: "03", title: "Launch", desc: "Campaigns, content & ads go live in 7 days. Our cross-functional team executes with precision.", icon: Rocket, glow: "hsl(322 90% 62%)" },
  { num: "04", title: "Optimize", desc: "Weekly data reviews, A/B tests, and improvements. We never set-and-forget — every metric is monitored.", icon: BarChart3, glow: "hsl(162 100% 44%)" },
  { num: "05", title: "Scale", desc: "We double down on what works to 5X your growth. Expand to new markets, channels & verticals.", icon: TrendingUp, glow: "hsl(38 100% 60%)" },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Premium background graphic */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={processBanner}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
          width={1920}
          height={1080}
          style={{ opacity: 0.16 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 50% 50%, hsl(322 90% 35% / 0.14), transparent 70%)" }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="neon-chip">Our Process</span>
          <h2 className="font-display type-h2 text-foreground mt-5 mb-4">
            Your 5-Step <span className="text-gradient-hero">Growth Journey</span>
          </h2>
          <p className="type-body">
            Penta = 5. A proven five-phase methodology that transforms ideas into measurable, scalable outcomes.
          </p>
        </motion.div>

        {/* Desktop: Horizontal */}
        <div className="hidden lg:block relative">
          {/* Neon gradient connector */}
          <div className="absolute top-[60px] left-[10%] right-[10%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(256 90% 62% / 0.6), hsl(192 95% 56% / 0.6), hsl(322 90% 62% / 0.6), hsl(162 100% 44% / 0.6), hsl(38 100% 60% / 0.6), transparent)" }}
          />
          <div className="absolute top-[58px] left-[10%] right-[10%] h-[3px] blur-md opacity-50"
            style={{ background: "linear-gradient(90deg, transparent, hsl(256 90% 62%), hsl(192 95% 56%), hsl(322 90% 62%), hsl(162 100% 44%), hsl(38 100% 60%), transparent)" }}
          />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    <div
                      className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                      style={{ background: `radial-gradient(circle, ${step.glow}60, transparent 70%)` }}
                    />
                    <div
                      className="relative w-[120px] h-[120px] rounded-2xl flex flex-col items-center justify-center backdrop-blur-xl"
                      style={{
                        background: `linear-gradient(135deg, ${step.glow}1c, ${step.glow}08)`,
                        border: `1px solid ${step.glow}55`,
                        boxShadow: `0 20px 50px -20px ${step.glow}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
                      }}
                    >
                      <Icon className="w-7 h-7 mb-1" style={{ color: step.glow, filter: `drop-shadow(0 0 8px ${step.glow}90)` }} />
                      <span className="type-label font-mono" style={{ color: step.glow }}>{step.num}</span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical */}
        <div className="lg:hidden relative pl-14">
          <div className="absolute left-[22px] top-2 bottom-2 w-px"
            style={{ background: "linear-gradient(180deg, hsl(256 90% 62% / 0.6), hsl(192 95% 56% / 0.6), hsl(322 90% 62% / 0.6), hsl(162 100% 44% / 0.6), hsl(38 100% 60% / 0.6))" }}
          />
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
                  <div className="absolute -left-14 top-1 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-xl"
                    style={{
                      background: `linear-gradient(135deg, ${step.glow}26, ${step.glow}08)`,
                      border: `1px solid ${step.glow}55`,
                      boxShadow: `0 0 20px -4px ${step.glow}70`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: step.glow }} />
                  </div>
                  <div>
                    <span className="type-label font-mono" style={{ color: step.glow }}>{step.num}</span>
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
