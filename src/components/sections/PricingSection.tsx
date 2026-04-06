import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const plans = [
  {
    name: "Starter",
    price: "₹9,999",
    period: "/month",
    desc: "Perfect for small businesses & startups getting started with digital marketing.",
    features: ["SEO (On-page + Off-page)", "Social Media (2 platforms)", "Monthly Performance Report", "Dedicated Account Manager", "Email Support"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹24,999",
    period: "/month",
    desc: "For scaling brands that want full-funnel marketing with measurable ROI.",
    features: ["Full SEO Suite", "Social Media (3 platforms)", "Google & Meta Ads Management", "Bi-weekly Strategy Calls", "Content Marketing (4 blogs/mo)", "Monthly Analytics Dashboard", "Priority Support"],
    cta: "Get Started",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Full-service, dedicated team with custom strategy for large brands & enterprises.",
    features: ["All Growth Features", "Dedicated Cross-functional Team", "Custom AI & Automation", "PR & Reputation Management", "Weekly Strategy Meetings", "Custom Development", "24/7 Priority Support"],
    cta: "Contact Us",
    featured: false,
  },
];

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/20" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Pricing</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Transparent Pricing. <span className="text-gradient">Zero Hidden Costs.</span>
          </h2>
          <p className="text-muted-foreground text-sm">Choose a plan that fits your growth stage. Scale up anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl glass border p-7 flex flex-col ${
                plan.featured
                  ? "border-primary/30 shadow-xl shadow-primary/10 scale-[1.02] md:scale-105"
                  : "border-border/30"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-primary-foreground bg-primary px-4 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{plan.desc}</p>
              </div>
              <div className="mb-6">
                <span className="font-display font-extrabold text-4xl text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={plan.name === "Enterprise" ? "/contact" : "/get-proposal"}>
                <Button
                  className={`w-full rounded-full font-display font-bold ${
                    plan.featured
                      ? "bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg"
                      : ""
                  }`}
                  variant={plan.featured ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10 text-sm text-muted-foreground"
        >
          Not sure which plan?{" "}
          <Link to="/contact" className="text-primary hover:text-foreground transition-colors font-display font-semibold inline-flex items-center gap-1">
            Book a free 30-min strategy call <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
