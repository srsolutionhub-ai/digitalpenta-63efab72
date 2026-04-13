import { Link } from "react-router-dom";
import { ArrowUpRight, Search, Share2, Target, Globe, Mail, Palette } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const pillars = [
  {
    title: "SEO & Content Marketing",
    desc: "Rank #1 on Google and drive organic traffic that converts. Local SEO, technical audits & content strategies tailored for Indian markets.",
    href: "/services/digital-marketing/seo",
    icon: Search,
    iconColor: "text-primary",
    popular: true,
  },
  {
    title: "Social Media Marketing",
    desc: "Build brand authority on Instagram, Facebook & LinkedIn. Community management, creatives & growth strategies that engage.",
    href: "/services/digital-marketing/social-media",
    icon: Share2,
    iconColor: "text-accent",
  },
  {
    title: "Performance Marketing",
    desc: "ROI-first Meta & Google Ads that scale your revenue. Data-driven PPC campaigns optimized for maximum conversions.",
    href: "/services/digital-marketing/performance",
    icon: Target,
    iconColor: "text-accent",
    popular: true,
  },
  {
    title: "Website Design & Development",
    desc: "High-converting websites built for speed and trust. E-commerce, SaaS dashboards & corporate sites that perform.",
    href: "/services/development/website",
    icon: Globe,
    iconColor: "text-primary",
  },
  {
    title: "Email & WhatsApp Marketing",
    desc: "Automated campaigns that nurture and close leads 24/7. Drip sequences, broadcasts & WhatsApp commerce for Indian audiences.",
    href: "/services/digital-marketing/email",
    icon: Mail,
    iconColor: "text-accent",
  },
  {
    title: "Brand Strategy & Identity",
    desc: "Positioning, naming, logo & brand guidelines that command premium pricing. From D2C startups to enterprise rebrands.",
    href: "/services/public-relations/brand-reputation",
    icon: Palette,
    iconColor: "text-primary",
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-20"
        >
          <span className="type-label text-primary font-mono">Our Services</span>
          <h2 className="font-display type-h2 text-foreground mt-3 mb-4">
            Everything You Need to <span className="text-primary">5X Your Growth.</span>
          </h2>
          <p className="type-body max-w-lg">
            Six integrated services working together — creating compounding impact that fragmented agencies simply can't match.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={p.href}
                  className="group relative rounded-2xl card-surface overflow-hidden flex flex-col h-full hover-lift"
                >
                  {p.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="type-label text-primary-foreground bg-primary px-2.5 py-1 rounded-full text-[9px] font-bold">
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl card-surface flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${p.iconColor}`} />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                    <div className="mt-5 pt-4 border-t border-border">
                      <span className="type-label text-primary font-mono group-hover:text-foreground transition-colors">Learn More →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
