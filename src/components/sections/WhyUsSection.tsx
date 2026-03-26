import { Shield, Layers, Globe, TrendingUp, Users, Clock } from "lucide-react";

const reasons = [
  { icon: Layers, title: "Integrated Approach", desc: "Five disciplines under one roof — no fragmented agencies, no communication gaps." },
  { icon: Globe, title: "India + Middle East", desc: "Deep regional expertise across Delhi, Dubai, Riyadh, Abu Dhabi & Doha." },
  { icon: TrendingUp, title: "ROI Obsessed", desc: "Every campaign is tied to measurable KPIs. We optimize until the numbers sing." },
  { icon: Shield, title: "Enterprise Grade", desc: "Processes, SLAs, and security standards that large brands demand." },
  { icon: Users, title: "Dedicated Teams", desc: "Your own strategist, designer, developer & account manager — no outsourcing." },
  { icon: Clock, title: "Speed to Market", desc: "Rapid deployment with agile sprints. Launch in weeks, not months." },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 md:py-28 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Why Digital Penta</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
            Built Different. <span className="text-gradient">By Design.</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            We don't just execute — we architect growth systems that compound over time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl glass p-6 group hover:bg-card/60 transition-colors">
              <r.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-display font-semibold text-foreground mb-1.5">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
