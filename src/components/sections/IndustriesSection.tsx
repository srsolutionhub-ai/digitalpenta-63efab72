import { Link } from "react-router-dom";
import { Building2, Heart, GraduationCap, ShoppingCart, Landmark, Hotel, Cloud, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const industries = [
  { name: "Real Estate", icon: Building2, href: "/industries/real-estate", metric: "340% leads", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { name: "Healthcare", icon: Heart, href: "/industries/healthcare", metric: "₹12Cr revenue", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { name: "Education", icon: GraduationCap, href: "/industries/education", metric: "5x enrollment", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { name: "E-commerce", icon: ShoppingCart, href: "/industries/ecommerce", metric: "8.2x ROAS", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { name: "Finance", icon: Landmark, href: "/industries/finance", metric: "50K+ users", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { name: "Hospitality", icon: Hotel, href: "/industries/hospitality", metric: "200% bookings", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  { name: "SaaS", icon: Cloud, href: "/industries/saas", metric: "3x MRR", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Industries</span>
          <h2 className="font-display font-extrabold text-2xl md:text-4xl text-foreground mt-3 mb-3">
            Expertise Across <span className="text-gradient">Sectors</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Deep industry knowledge that translates into higher conversions and faster growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={ind.href}
                  className="group flex flex-col items-center text-center rounded-2xl glass border border-border/30 p-5 hover:border-primary/20 hover:bg-card/60 transition-all duration-500 hover:-translate-y-1 h-full"
                >
                  <div className={`w-12 h-12 rounded-xl ${ind.bg} border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-5 h-5 ${ind.color}`} />
                  </div>
                  <h3 className="text-sm font-display font-semibold text-foreground mb-1">{ind.name}</h3>
                  <p className="text-[10px] font-mono text-muted-foreground">{ind.metric}</p>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
