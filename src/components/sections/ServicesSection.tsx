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
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    title: "Social Media Marketing",
    desc: "Build brand authority on Instagram, Facebook & LinkedIn. Community management, creatives & growth strategies that engage.",
    href: "/services/digital-marketing/social-media",
    icon: Share2,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    title: "Performance Marketing",
    desc: "ROI-first Meta & Google Ads that scale your revenue. Data-driven PPC campaigns optimized for maximum conversions.",
    href: "/services/digital-marketing/performance",
    icon: Target,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Website Design & Development",
    desc: "High-converting websites built for speed and trust. E-commerce, SaaS dashboards & corporate sites that perform.",
    href: "/services/development/website",
    icon: Globe,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Email & WhatsApp Marketing",
    desc: "Automated campaigns that nurture and close leads 24/7. Drip sequences, broadcasts & WhatsApp commerce for Indian audiences.",
    href: "/services/digital-marketing/email",
    icon: Mail,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    title: "Brand Strategy & Identity",
    desc: "Positioning, naming, logo & brand guidelines that command premium pricing. From D2C startups to enterprise rebrands.",
    href: "/services/public-relations/brand-reputation",
    icon: Palette,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10 border-pink-500/20",
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Our Services</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4 leading-tight">
            Everything You Need to <span className="text-gradient">5X Your Growth.</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
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
                  className="group relative rounded-2xl glass border border-border/30 overflow-hidden flex flex-col h-full transition-all duration-500 hover:bg-card/60 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-2 rotating-border"
                >
                  <div className="p-7 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-14 h-14 rounded-xl ${p.iconBg} border flex items-center justify-center shadow-lg`}
                        style={{ boxShadow: "0 4px 20px -4px hsl(var(--primary) / 0.15)" }}>
                        <Icon className={`w-6 h-6 ${p.iconColor}`} />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                    <div className="mt-5 pt-4 border-t border-border/30">
                      <span className="text-xs font-mono text-primary group-hover:text-foreground transition-colors">Learn More →</span>
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
