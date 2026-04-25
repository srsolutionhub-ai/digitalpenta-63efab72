import { Link } from "react-router-dom";
import { Building2, Heart, GraduationCap, ShoppingCart, Landmark, Hotel, Cloud, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const industries = [
  { name: "Real Estate", icon: Building2, href: "/industries/real-estate", metric: "340% leads", glow: "hsl(256 90% 62%)" },
  { name: "Healthcare", icon: Heart, href: "/industries/healthcare", metric: "₹12Cr revenue", glow: "hsl(322 90% 62%)" },
  { name: "Education", icon: GraduationCap, href: "/industries/education", metric: "5x enrollment", glow: "hsl(38 100% 60%)" },
  { name: "E-commerce", icon: ShoppingCart, href: "/industries/ecommerce", metric: "8.2x ROAS", glow: "hsl(192 95% 56%)" },
  { name: "Finance", icon: Landmark, href: "/industries/finance", metric: "50K+ users", glow: "hsl(162 100% 44%)" },
  { name: "Hospitality", icon: Hotel, href: "/industries/hospitality", metric: "200% bookings", glow: "hsl(18 100% 60%)" },
  { name: "SaaS", icon: Cloud, href: "/industries/saas", metric: "3x MRR", glow: "hsl(256 90% 62%)" },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(40% 50% at 50% 50%, hsl(192 95% 35% / 0.12), transparent 70%)" }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="neon-chip">Industries</span>
          <h2 className="font-display type-h2 text-foreground mt-5 mb-3">
            Industries We <span className="text-gradient-hero">Serve</span>
          </h2>
          <p className="type-body max-w-md mx-auto">
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
                  className="group glass-card-pro flex flex-col items-center text-center p-5 h-full"
                >
                  <div className="relative w-12 h-12 mb-3">
                    <div
                      className="absolute inset-0 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                      style={{ background: `radial-gradient(circle, ${ind.glow}80, transparent 70%)` }}
                    />
                    <div
                      className="relative w-full h-full rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${ind.glow}28, ${ind.glow}10)`,
                        border: `1px solid ${ind.glow}50`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: ind.glow, filter: `drop-shadow(0 0 4px ${ind.glow}80)` }} />
                    </div>
                  </div>
                  <h3 className="text-sm font-display font-semibold text-foreground mb-1">{ind.name}</h3>
                  <p className="type-label font-mono" style={{ color: ind.glow }}>{ind.metric}</p>
                  <ArrowUpRight className="w-3 h-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: ind.glow }} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
