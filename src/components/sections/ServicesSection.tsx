import { Link } from "react-router-dom";
import { Megaphone, Newspaper, Code2, Brain, Zap, ArrowUpRight } from "lucide-react";

const pillars = [
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "SEO, PPC, Social Media, Content & Performance Marketing that delivers measurable ROI.",
    href: "/services/digital-marketing",
    accent: "from-violet-500/20 to-purple-600/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Newspaper,
    title: "Public Relations",
    desc: "Media relations, brand reputation, crisis management & thought leadership across markets.",
    href: "/services/public-relations",
    accent: "from-cyan-500/20 to-blue-600/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Code2,
    title: "Development",
    desc: "Websites, mobile apps, e-commerce platforms & custom web applications built to scale.",
    href: "/services/development",
    accent: "from-emerald-500/20 to-green-600/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Brain,
    title: "AI Solutions",
    desc: "AI strategy, chatbots, predictive analytics, NLP & computer vision for competitive edge.",
    href: "/services/ai-solutions",
    accent: "from-amber-500/20 to-yellow-600/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "Marketing, workflow, CRM & sales automation to eliminate manual tasks and scale faster.",
    href: "/services/automation",
    accent: "from-orange-500/20 to-red-600/20",
    iconColor: "text-orange-400",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Five Pillars</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-4">
            One Agency. Five <span className="text-gradient">Superpowers.</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Each pillar works independently or together — creating compounding impact that fragmented agencies simply can't match.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, i) => (
            <Link
              key={p.title}
              to={p.href}
              className={`group relative rounded-xl glass glass-hover glow-border p-6 flex flex-col ${
                i >= 3 ? "lg:col-span-1" : ""
              }`}
            >
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
