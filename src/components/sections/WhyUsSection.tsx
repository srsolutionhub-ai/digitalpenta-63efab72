import { Shield, Layers, Globe, TrendingUp, Users, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const reasons = [
  { icon: Layers, title: "Integrated Approach", desc: "Five disciplines under one roof — no fragmented agencies, no communication gaps.", accent: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: Globe, title: "India + Middle East", desc: "Deep regional expertise across Delhi, Dubai, Riyadh, Abu Dhabi & Doha.", accent: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { icon: TrendingUp, title: "ROI Obsessed", desc: "Every campaign is tied to measurable KPIs. We optimize until the numbers sing.", accent: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Shield, title: "Enterprise Grade", desc: "Processes, SLAs, and security standards that large brands demand.", accent: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { icon: Users, title: "Dedicated Teams", desc: "Your own strategist, designer, developer & account manager — no outsourcing.", accent: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  { icon: Clock, title: "Speed to Market", desc: "Rapid deployment with agile sprints. Launch in weeks, not months.", accent: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
];

export default function WhyUsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10" ref={sectionRef}>
        <div className="max-w-2xl mx-auto text-center mb-16" data-reveal>
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Why Digital Penta</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Built Different. <span className="text-gradient">By Design.</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We don't just execute — we architect growth systems that compound over time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {reasons.map((r) => (
            <div
              key={r.title}
              data-reveal
              className="rounded-2xl glass border border-border/30 p-7 group hover:bg-card/60 hover:border-primary/15 transition-all duration-500"
            >
              <div className={`w-10 h-10 rounded-xl ${r.bg} border flex items-center justify-center mb-5`}>
                <r.icon className={`w-5 h-5 ${r.accent}`} />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
