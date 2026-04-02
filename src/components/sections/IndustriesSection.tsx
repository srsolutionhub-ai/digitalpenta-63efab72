import { Link } from "react-router-dom";
import { Building2, Heart, GraduationCap, ShoppingCart, Landmark, Hotel, Cloud } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const industries = [
  { name: "Real Estate", icon: Building2, href: "/industries/real-estate" },
  { name: "Healthcare", icon: Heart, href: "/industries/healthcare" },
  { name: "Education", icon: GraduationCap, href: "/industries/education" },
  { name: "E-commerce", icon: ShoppingCart, href: "/industries/ecommerce" },
  { name: "Finance", icon: Landmark, href: "/industries/finance" },
  { name: "Hospitality", icon: Hotel, href: "/industries/hospitality" },
  { name: "SaaS", icon: Cloud, href: "/industries/saas" },
];

export default function IndustriesSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12" data-reveal>
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Industries</span>
          <h2 className="font-display font-extrabold text-2xl md:text-4xl text-foreground mt-3">
            Expertise Across <span className="text-gradient">Sectors</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3" data-reveal>
          {industries.map((ind) => (
            <Link
              key={ind.name}
              to={ind.href}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full glass border border-border/30 text-sm font-display font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 hover:bg-card/60 transition-all duration-300"
            >
              <ind.icon className="w-4 h-4 text-primary/60" />
              {ind.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
