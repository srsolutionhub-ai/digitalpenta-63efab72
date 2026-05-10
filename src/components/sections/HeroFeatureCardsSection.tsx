import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Search, Megaphone, Bot, BarChart3 } from "lucide-react";

/**
 * Premium above-the-fold feature cards + animated value proposition.
 * Lightweight: motion-only, no images, no heavy deps.
 */
const cards = [
  {
    icon: Search,
    title: "SEO that ranks",
    desc: "Page-1 in 90 days for Delhi, Mumbai, Dubai keywords.",
    to: "/services/digital-marketing/seo",
    accent: "hsl(256 90% 65%)",
  },
  {
    icon: Megaphone,
    title: "Ads that convert",
    desc: "Google + Meta funnels with 6×–14× ROAS lift.",
    to: "/services/digital-marketing/performance",
    accent: "hsl(322 90% 65%)",
  },
  {
    icon: Bot,
    title: "AI automations",
    desc: "Chatbots, lead-routing & content engines, live in 7 days.",
    to: "/services/ai-solutions",
    accent: "hsl(192 95% 60%)",
  },
  {
    icon: BarChart3,
    title: "Real-time dashboard",
    desc: "Every rupee tracked. Every KPI visible. No black box.",
    to: "/dashboard",
    accent: "hsl(162 100% 50%)",
  },
];

const valueWords = ["Rank", "Convert", "Automate", "Scale"];

export default function HeroFeatureCardsSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden" aria-labelledby="hero-features-heading">
      {/* Decorative aurora + grid backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 0%, hsl(256 90% 45% / 0.25), transparent 70%), radial-gradient(50% 45% at 85% 100%, hsl(322 90% 50% / 0.2), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100% / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 80%)",
          }}
        />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Animated value prop */}
        <div className="text-center mb-12">
          <h2
            id="hero-features-heading"
            className="font-display font-extrabold tracking-tight text-2xl md:text-4xl text-foreground"
          >
            We help brands{" "}
            <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom">
              <span className="sr-only">rank, convert, automate and scale.</span>
              <span aria-hidden className="flex flex-col animate-[wordRoll_8s_linear_infinite] text-gradient-hero">
                {[...valueWords, valueWords[0]].map((w, i) => (
                  <span key={i} className="leading-[1.2]">{w}</span>
                ))}
              </span>
            </span>
            .
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            One integrated team — SEO, Ads, AI &amp; Dev — under a single growth roof.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={c.to}
                className="group relative block h-full p-5 rounded-2xl glass-card sheen border border-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${c.accent}33, ${c.accent}11)`,
                    boxShadow: `0 8px 32px -12px ${c.accent}80`,
                  }}
                >
                  <c.icon className="w-5 h-5" style={{ color: c.accent }} />
                </div>
                <h3 className="font-display font-bold text-base text-foreground mb-1.5 flex items-center gap-1.5">
                  {c.title}
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
