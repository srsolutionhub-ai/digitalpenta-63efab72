import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const cases = [
  {
    title: "PropTech Leader",
    industry: "Real Estate",
    metric: "340%",
    metricLabel: "Lead increase",
    services: ["SEO", "PPC", "Automation"],
    gradient: "from-violet-500/10 to-purple-600/10",
  },
  {
    title: "Healthcare SaaS",
    industry: "Healthcare",
    metric: "₹12Cr",
    metricLabel: "Revenue generated",
    services: ["Digital Marketing", "PR", "Development"],
    gradient: "from-cyan-500/10 to-blue-600/10",
  },
  {
    title: "D2C Fashion Brand",
    industry: "E-commerce",
    metric: "8.2x",
    metricLabel: "ROAS achieved",
    services: ["Social Media", "Influencer", "Performance"],
    gradient: "from-emerald-500/10 to-green-600/10",
  },
  {
    title: "Fintech Startup",
    industry: "Finance",
    metric: "50K+",
    metricLabel: "App downloads",
    services: ["App Dev", "AI Chatbot", "Marketing"],
    gradient: "from-amber-500/10 to-yellow-600/10",
  },
];

export default function CaseStudiesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Case Studies</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3">
              Results That <span className="text-gradient">Speak.</span>
            </h2>
          </div>
          <Link to="/portfolio" className="hidden md:flex items-center gap-1 text-sm text-primary hover:underline">
            View all work <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {cases.map((c) => (
            <Link
              key={c.title}
              to="/portfolio"
              className={`group relative rounded-xl glass glass-hover glow-border p-8 overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{c.industry}</span>
                    <h3 className="font-display font-semibold text-xl text-foreground mt-1">{c.title}</h3>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mb-4">
                  <span className="font-display font-bold text-4xl text-gradient">{c.metric}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.metricLabel}</p>
                </div>
                <div className="flex gap-2">
                  {c.services.map((s) => (
                    <span key={s} className="text-[10px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
