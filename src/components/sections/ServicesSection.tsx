import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import iconSeo from "@/assets/icon-seo.png";
import iconSocial from "@/assets/icon-social.png";
import iconAds from "@/assets/icon-ads.png";
import iconWeb from "@/assets/icon-web.png";
import iconEmail from "@/assets/icon-email.png";
import iconBrand from "@/assets/icon-brand.png";

const pillars = [
  {
    title: "SEO & Content Marketing",
    desc: "Rank #1 on Google and drive organic traffic that converts. Local SEO, technical audits & content strategies tailored for Indian markets.",
    href: "/services/digital-marketing/seo",
    icon: iconSeo,
    accent: "from-violet-500/20 to-cyan-500/10",
    popular: true,
  },
  {
    title: "Social Media Marketing",
    desc: "Build brand authority on Instagram, Facebook & LinkedIn. Community management, creatives & growth strategies that engage.",
    href: "/services/digital-marketing/social-media",
    icon: iconSocial,
    accent: "from-pink-500/20 to-violet-500/10",
  },
  {
    title: "Performance Marketing",
    desc: "ROI-first Meta & Google Ads that scale your revenue. Data-driven PPC campaigns optimized for maximum conversions.",
    href: "/services/digital-marketing/performance",
    icon: iconAds,
    accent: "from-orange-500/20 to-pink-500/10",
    popular: true,
  },
  {
    title: "Website Design & Development",
    desc: "High-converting websites built for speed and trust. E-commerce, SaaS dashboards & corporate sites that perform.",
    href: "/services/development/website",
    icon: iconWeb,
    accent: "from-cyan-500/20 to-blue-500/10",
  },
  {
    title: "Email & WhatsApp Marketing",
    desc: "Automated campaigns that nurture and close leads 24/7. Drip sequences, broadcasts & WhatsApp commerce for Indian audiences.",
    href: "/services/digital-marketing/email",
    icon: iconEmail,
    accent: "from-emerald-500/20 to-cyan-500/10",
  },
  {
    title: "Brand Strategy & Identity",
    desc: "Positioning, naming, logo & brand guidelines that command premium pricing. From D2C startups to enterprise rebrands.",
    href: "/services/public-relations/brand-reputation",
    icon: iconBrand,
    accent: "from-violet-500/20 to-pink-500/10",
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Premium mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none mesh-bg opacity-40" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground) / 0.5) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.03,
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(ellipse, hsl(256 90% 62% / 0.15), transparent 60%)" }}
      />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20 mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card type-label text-primary font-mono mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Our Services
          </span>
          <h2 className="font-display font-extrabold tracking-tight text-foreground mt-3 mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)", lineHeight: 1.05 }}
          >
            Six services.{" "}
            <span className="text-gradient">One growth engine.</span>
          </h2>
          <p className="type-body max-w-xl mx-auto">
            Integrated services working together — creating compounding impact that fragmented agencies simply can't match.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={p.href}
                className="group relative glass-card overflow-hidden flex flex-col h-full hover-lift block"
              >
                {/* Accent gradient that intensifies on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {p.popular && (
                  <div className="absolute top-5 right-5 z-10">
                    <span className="type-label px-2.5 py-1 rounded-full text-[9px] font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg">
                      Popular
                    </span>
                  </div>
                )}

                <div className="p-7 flex flex-col h-full relative z-[1]">
                  <div className="mb-6 relative">
                    <div className="w-20 h-20 relative">
                      {/* Icon glow */}
                      <div className="absolute inset-0 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"
                        style={{ background: "radial-gradient(circle, hsl(256 90% 62% / 0.6), transparent 70%)" }}
                      />
                      <img
                        src={p.icon}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        width={80}
                        height={80}
                        className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        style={{ filter: "drop-shadow(0 8px 24px hsl(256 90% 62% / 0.3))" }}
                      />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-3 tracking-tight">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <span className="type-label text-primary font-mono group-hover:text-foreground transition-colors">
                      Explore service
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
