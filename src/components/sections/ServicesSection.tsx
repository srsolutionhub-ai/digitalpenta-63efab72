import { Link } from "react-router-dom";
import { Megaphone, Newspaper, Code2, Brain, Zap, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const pillars = [
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "SEO, PPC, Social Media, Content & Performance Marketing that delivers measurable ROI.",
    href: "/services/digital-marketing",
    accent: "from-violet-500/20 to-purple-600/20",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    icon: Newspaper,
    title: "Public Relations",
    desc: "Media relations, brand reputation, crisis management & thought leadership across markets.",
    href: "/services/public-relations",
    accent: "from-cyan-500/20 to-blue-600/20",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    icon: Code2,
    title: "Development",
    desc: "Websites, mobile apps, e-commerce platforms & custom web applications built to scale.",
    href: "/services/development",
    accent: "from-emerald-500/20 to-green-600/20",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: Brain,
    title: "AI Solutions",
    desc: "AI strategy, chatbots, predictive analytics, NLP & computer vision for competitive edge.",
    href: "/services/ai-solutions",
    accent: "from-amber-500/20 to-yellow-600/20",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "Marketing, workflow, CRM & sales automation to eliminate manual tasks and scale faster.",
    href: "/services/automation",
    accent: "from-orange-500/20 to-red-600/20",
    iconBg: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-400",
    glow: "group-hover:shadow-orange-500/10",
  },
];

export default function ServicesSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4" ref={sectionRef}>
        {/* Header */}
        <div className="max-w-2xl mb-16" data-reveal>
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Five Pillars</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4 leading-tight">
            One Agency. Five <span className="text-gradient">Superpowers.</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            Each pillar works independently or together — creating compounding impact that fragmented agencies simply can't match.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3" data-reveal>
          {pillars.map((p, i) => (
            <Link
              key={p.title}
              to={p.href}
              className={`group relative rounded-2xl glass border border-border/30 p-7 flex flex-col transition-all duration-500 hover:bg-card/60 hover:border-primary/20 hover:shadow-2xl ${p.glow} ${
                i < 2 ? "lg:row-span-1" : ""
              } ${i === 0 ? "lg:col-span-2" : ""}`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl ${p.iconBg} border flex items-center justify-center`}>
                    <p.icon className={`w-5 h-5 ${p.iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                <div className="mt-5 pt-4 border-t border-border/30">
                  <span className="text-xs font-mono text-primary group-hover:text-foreground transition-colors">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
