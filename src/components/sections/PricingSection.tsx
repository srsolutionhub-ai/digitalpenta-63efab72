import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Starter", price: "₹9,999", annual: "₹7,999", period: "/month",
    desc: "Perfect for small businesses & startups getting started with digital marketing.",
    features: ["SEO (On-page + Off-page)", "Social Media (2 platforms)", "Monthly Performance Report", "Dedicated Account Manager", "Email Support"],
    cta: "Get Started", featured: false,
  },
  {
    name: "Growth", price: "₹24,999", annual: "₹19,999", period: "/month",
    desc: "For scaling brands that want full-funnel marketing with measurable ROI.",
    features: ["Full SEO Suite", "Social Media (3 platforms)", "Google & Meta Ads Management", "Bi-weekly Strategy Calls", "Content Marketing (4 blogs/mo)", "Monthly Analytics Dashboard", "Priority Support"],
    cta: "Get Started", featured: true, badge: "Most Popular",
  },
  {
    name: "Enterprise", price: "Custom", annual: "Custom", period: "",
    desc: "Full-service, dedicated team with custom strategy for large brands & enterprises.",
    features: ["All Growth Features", "Dedicated Cross-functional Team", "Custom AI & Automation", "PR & Reputation Management", "Weekly Strategy Meetings", "Custom Development", "24/7 Priority Support"],
    cta: "Contact Us", featured: false,
  },
];

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="type-label text-primary font-mono">Pricing</span>
          <h2 className="font-display type-h2 text-foreground mt-3 mb-4">
            Transparent Pricing. <span className="text-primary">Zero Hidden Costs.</span>
          </h2>
          <p className="type-body">Choose a plan that fits your growth stage. Scale up anytime.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <span className={`text-sm font-display font-medium transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-secondary"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
          <span className={`text-sm font-display font-medium transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual <span className="type-label text-accent ml-1">Save 20%</span>
          </span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl card-surface p-7 flex flex-col hover-lift ${
                plan.featured ? "ring-1 ring-primary/30" : ""
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 type-label font-bold text-primary-foreground bg-primary px-4 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{plan.desc}</p>
              </div>
              <div className="mb-6">
                <span className="font-display font-extrabold text-4xl text-foreground">
                  {annual ? plan.annual : plan.price}
                </span>
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
                  className="w-full rounded-full font-display font-bold"
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
