import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Search, FileText, Rocket, BarChart3, TrendingUp } from "lucide-react";

const steps = [
  { num: "01", title: "Free Audit", desc: "We analyze your current digital presence — website, SEO, social media & ads — to find hidden opportunities.", icon: Search },
  { num: "02", title: "Custom Strategy", desc: "Tailored 90-day roadmap built for your goals — channels, budget, KPIs & content plan all included.", icon: FileText },
  { num: "03", title: "Launch", desc: "Campaigns, content & ads go live in 7 days. Our cross-functional team executes with precision.", icon: Rocket },
  { num: "04", title: "Optimize", desc: "Weekly data reviews, A/B tests, and improvements. We never set-and-forget — every metric is monitored.", icon: BarChart3 },
  { num: "05", title: "Scale", desc: "We double down on what works to 5X your growth. Expand to new markets, channels & verticals.", icon: TrendingUp },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="type-label text-primary font-mono">Our Process</span>
          <h2 className="font-display type-h2 text-foreground mt-3 mb-4">
            Your 5-Step <span className="text-primary">Growth Journey</span>
          </h2>
          <p className="type-body">
            Penta = 5. A proven five-phase methodology that transforms ideas into measurable, scalable outcomes.
          </p>
        </motion.div>

        {/* Desktop: Horizontal */}
        <div className="hidden lg:block relative">
          <div className="absolute top-[52px] left-[10%] right-[10%] h-px bg-border" />

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
                  <div className="w-[104px] h-[104px] rounded-2xl card-surface flex flex-col items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-accent mb-1" />
                    <span className="type-label text-muted-foreground font-mono">{step.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical */}
        <div className="lg:hidden relative pl-12">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />
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
                  <div className="absolute -left-12 top-1 w-9 h-9 rounded-xl card-surface flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <span className="type-label text-muted-foreground font-mono">{step.num}</span>
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
