import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const results = [
  { metric: "312%", label: "Organic Traffic Growth", client: "SaaS Startup, Pune", service: "SEO & Content Strategy", accent: "border-violet-500/60" },
  { metric: "4.2X", label: "ROAS on Google Ads", client: "E-commerce, Delhi", service: "PPC Management", accent: "border-cyan-500/60" },
  { metric: "2,000+", label: "Instagram Followers / Month", client: "Beauty Brand, Jaipur", service: "Social Media Marketing", accent: "border-pink-500/60" },
  { metric: "₹1.2Cr", label: "Revenue Generated in Q1", client: "Real Estate, Mumbai", service: "Performance Marketing", accent: "border-emerald-500/60" },
  { metric: "70%", label: "Reduction in Support Tickets", client: "D2C Brand, Bangalore", service: "AI Chatbot", accent: "border-amber-500/60" },
  { metric: "45%", label: "Lower Cost Per Lead", client: "Fintech Startup, Hyderabad", service: "Google Ads + SEO", accent: "border-blue-500/60" },
  { metric: "98%", label: "Client Retention Rate", client: "Across All Verticals", service: "Full-Service Retainer", accent: "border-violet-500/60" },
  { metric: "3X", label: "Email Open Rate Improvement", client: "EdTech, Chennai", service: "Email Marketing Automation", accent: "border-orange-500/60" },
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
        <div className="flex gap-4 animate-marquee-slow group/reel">
          {[...results, ...results].map((r, i) => (
            <ResultCard key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultCard({ r }: { r: typeof results[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex-shrink-0 w-[280px] rounded-2xl card-surface p-6 hover-lift border-l-2 ${r.accent} relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationPlayState: hovered ? "paused" : "running" }}
    >
      <span className="text-3xl font-mono font-extrabold text-primary">
        {r.metric}
      </span>
      <p className="text-sm font-display font-semibold text-foreground/80 mt-2">{r.label}</p>
      <p className="type-label text-muted-foreground font-mono mt-1">{r.client}</p>

      {hovered && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-mono whitespace-nowrap z-10 shadow-lg">
          {r.service}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-foreground" />
        </div>
      )}
    </div>
  );
}
