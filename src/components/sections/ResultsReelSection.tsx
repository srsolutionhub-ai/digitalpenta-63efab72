import { motion, useInView } from "motion/react";
import { useRef } from "react";

const results = [
  { metric: "312%", label: "Organic Traffic Growth", client: "SaaS Startup, Pune" },
  { metric: "4.2X", label: "ROAS on Google Ads", client: "E-commerce, Delhi" },
  { metric: "2,000+", label: "Instagram Followers / Month", client: "Beauty Brand, Jaipur" },
  { metric: "₹1.2Cr", label: "Revenue Generated in Q1", client: "Real Estate, Mumbai" },
  { metric: "70%", label: "Reduction in Support Tickets", client: "D2C Brand, Bangalore" },
  { metric: "45%", label: "Lower Cost Per Lead", client: "Fintech Startup, Hyderabad" },
  { metric: "98%", label: "Client Retention Rate", client: "Across All Verticals" },
  { metric: "3X", label: "Email Open Rate Improvement", client: "EdTech, Chennai" },
];

export default function ResultsReelSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="py-20 overflow-hidden" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="type-label text-primary font-mono">Proven Results</span>
        <h2 className="font-display type-h2 text-foreground mt-2">
          Real Numbers. <span className="text-primary">Real Growth.</span>
        </h2>
      </motion.div>

      <div className="relative marquee-mask">
        <div className="flex gap-4 animate-marquee-slow hover:[animation-play-state:paused]">
          {[...results, ...results].map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] rounded-2xl card-surface p-6 hover-lift"
            >
              <span className="text-3xl font-mono font-extrabold text-primary">
                {r.metric}
              </span>
              <p className="text-sm font-display font-semibold text-foreground/80 mt-2">{r.label}</p>
              <p className="type-label text-muted-foreground font-mono mt-1">{r.client}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
