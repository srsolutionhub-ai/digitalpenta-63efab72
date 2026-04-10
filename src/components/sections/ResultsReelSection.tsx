import { motion, useInView } from "motion/react";
import { useRef } from "react";

const results = [
  { metric: "312%", label: "Organic Traffic Growth", client: "SaaS Startup, Pune", color: "from-violet-500 to-purple-600" },
  { metric: "4.2X", label: "ROAS on Google Ads", client: "E-commerce, Delhi", color: "from-cyan-500 to-blue-600" },
  { metric: "2,000+", label: "Instagram Followers / Month", client: "Beauty Brand, Jaipur", color: "from-pink-500 to-rose-600" },
  { metric: "₹1.2Cr", label: "Revenue Generated in Q1", client: "Real Estate, Mumbai", color: "from-emerald-500 to-green-600" },
  { metric: "70%", label: "Reduction in Support Tickets", client: "D2C Brand, Bangalore", color: "from-amber-500 to-orange-600" },
  { metric: "45%", label: "Lower Cost Per Lead", client: "Fintech Startup, Hyderabad", color: "from-indigo-500 to-violet-600" },
  { metric: "98%", label: "Client Retention Rate", client: "Across All Verticals", color: "from-teal-500 to-cyan-600" },
  { metric: "3X", label: "Email Open Rate Improvement", client: "EdTech, Chennai", color: "from-rose-500 to-pink-600" },
];

export default function ResultsReelSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="py-16 overflow-hidden" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-mono text-primary uppercase tracking-widest">Proven Results</span>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mt-2">
          Real Numbers. <span className="text-gradient">Real Growth.</span>
        </h2>
      </motion.div>

      <div className="relative marquee-mask">
        <div className="flex gap-4 animate-marquee-slow hover:[animation-play-state:paused]">
          {[...results, ...results].map((r, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] rounded-2xl glass border border-border/30 p-6 hover:border-primary/20 hover:-translate-y-1 transition-all duration-500 group"
            >
              <span className={`text-3xl font-mono font-extrabold bg-gradient-to-r ${r.color} bg-clip-text text-transparent`}>
                {r.metric}
              </span>
              <p className="text-sm font-display font-semibold text-foreground/80 mt-2">{r.label}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-1">{r.client}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
