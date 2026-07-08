import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";
import { getServiceAreaLinks } from "@/lib/entityLinks";
import { motion } from "motion/react";

/**
 * Service × city grid — used on dedicated service pages to link out to
 * every matching /{service}/{city} matrix page. Entity-based anchor text
 * for better SERP relevance.
 */
export default function ServiceAreaGrid({
  serviceSlug,
  heading = "Service areas",
  intro,
}: {
  serviceSlug: string;
  heading?: string;
  intro?: string;
}) {
  const links = getServiceAreaLinks(serviceSlug, 12);
  if (!links.length) return null;

  return (
    <section className="py-16 border-t border-border/30 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-8">
          <span className="type-label text-primary font-mono">SERVICE AREAS</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-2">{heading}</h2>
          {intro && <p className="text-sm text-muted-foreground mt-2">{intro}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {links.map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link
                to={l.href}
                title={l.title}
                className="group flex items-center justify-between gap-2 px-4 py-3 rounded-xl glass border border-border/30 hover:border-primary/40 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm font-display font-medium text-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary/70" />
                  {l.keyword}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
