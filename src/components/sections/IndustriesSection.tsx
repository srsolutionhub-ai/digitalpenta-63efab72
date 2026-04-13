import { Link } from "react-router-dom";
import { Building2, Heart, GraduationCap, ShoppingCart, Landmark, Hotel, Cloud, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const industries = [
  { name: "Real Estate", icon: Building2, href: "/industries/real-estate", metric: "340% leads" },
  { name: "Healthcare", icon: Heart, href: "/industries/healthcare", metric: "₹12Cr revenue" },
  { name: "Education", icon: GraduationCap, href: "/industries/education", metric: "5x enrollment" },
  { name: "E-commerce", icon: ShoppingCart, href: "/industries/ecommerce", metric: "8.2x ROAS" },
  { name: "Finance", icon: Landmark, href: "/industries/finance", metric: "50K+ users" },
  { name: "Hospitality", icon: Hotel, href: "/industries/hospitality", metric: "200% bookings" },
  { name: "SaaS", icon: Cloud, href: "/industries/saas", metric: "3x MRR" },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-28 md:py-36">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="type-label text-primary font-mono">Industries</span>
          <h2 className="font-display type-h2 text-foreground mt-3 mb-3">
            Expertise Across <span className="text-primary">Sectors</span>
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
                  className="group flex flex-col items-center text-center rounded-2xl card-surface p-5 hover-lift h-full"
                >
                  <div className="w-12 h-12 rounded-xl card-surface flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-sm font-display font-semibold text-foreground mb-1">{ind.name}</h3>
                  <p className="type-label text-muted-foreground font-mono">{ind.metric}</p>
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
