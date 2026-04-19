import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export interface RelatedLinkItem {
  href: string;
  title: string;
  desc?: string;
  eyebrow?: string;
}

interface RelatedLinksProps {
  /** Section eyebrow / kicker (e.g. "EXPLORE MORE"). */
  kicker?: string;
  /** Section heading (H2 — important for SEO). */
  heading: string;
  /** Optional supporting copy under the heading. */
  intro?: string;
  /** Cards to render. */
  items: RelatedLinkItem[];
  /** Tailwind grid override. Default: 1/2/3 columns. */
  columns?: "2" | "3";
  /** Use a darker tinted background — alternates with surrounding sections. */
  tinted?: boolean;
}

/**
 * Reusable "Related Links" section used by SubService, Location and Industry
 * pages to power the SEO internal linking matrix. Renders an H2 + a grid of
 * cards. Each card is a real <Link>, giving crawlers clean anchor text.
 */
export default function RelatedLinks({
  kicker,
  heading,
  intro,
  items,
  columns = "3",
  tinted = false,
}: RelatedLinksProps) {
  if (!items.length) return null;

  const grid = columns === "2"
    ? "grid sm:grid-cols-2 gap-4"
    : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <section className={`py-16 ${tinted ? "bg-card/20 border-y border-border/30" : ""}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-8">
          {kicker && (
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
              {kicker}
            </span>
          )}
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-2">
            {heading}
          </h2>
          {intro && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{intro}</p>
          )}
        </div>

        <div className={grid}>
          {items.map((item, i) => (
            <motion.div
              key={item.href + item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={item.href}
                className="group block h-full rounded-xl glass border border-border/30 p-5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    {item.eyebrow && (
                      <p className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider mb-1">
                        {item.eyebrow}
                      </p>
                    )}
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                {item.desc && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
