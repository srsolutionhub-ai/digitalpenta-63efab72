import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Sparkles, Briefcase } from "lucide-react";
import { motion } from "motion/react";

/**
 * SeoLinkHub — homepage internal-linking matrix.
 *
 * Pumps PageRank from the homepage to programmatic
 * service × city × industry pages, increasing crawl depth
 * and topical authority for organic rankings.
 *
 * Pure presentation — uses real <Link> tags so crawlers
 * see clean anchor text. Renders as semantic <nav> with
 * H2/H3 headings.
 */

const services: { label: string; href: string }[] = [
  { label: "SEO Services", href: "/services/digital-marketing/seo" },
  { label: "Google Ads (PPC)", href: "/services/digital-marketing/ppc" },
  { label: "Social Media Marketing", href: "/services/digital-marketing/social-media" },
  { label: "Content Marketing", href: "/services/digital-marketing/content" },
  { label: "Performance Marketing", href: "/services/digital-marketing/performance" },
  { label: "Web Development", href: "/services/development/website" },
  { label: "E-commerce Development", href: "/services/development/ecommerce" },
  { label: "AI Chatbot Development", href: "/services/ai-solutions/chatbot" },
  { label: "Marketing Automation", href: "/services/automation/marketing" },
  { label: "WhatsApp Marketing", href: "/services/automation/whatsapp" },
  { label: "Public Relations", href: "/services/public-relations" },
  { label: "Digital PR", href: "/services/public-relations/digital-pr" },
];

const cities: { label: string; href: string; flag?: string }[] = [
  { label: "Delhi", href: "/locations/delhi", flag: "🇮🇳" },
  { label: "Mumbai", href: "/locations/mumbai", flag: "🇮🇳" },
  { label: "Bangalore", href: "/locations/bangalore", flag: "🇮🇳" },
  { label: "Pune", href: "/locations/pune", flag: "🇮🇳" },
  { label: "Hyderabad", href: "/locations/hyderabad", flag: "🇮🇳" },
  { label: "Noida", href: "/locations/noida", flag: "🇮🇳" },
  { label: "Gurgaon", href: "/locations/gurgaon", flag: "🇮🇳" },
  { label: "Jaipur", href: "/locations/jaipur", flag: "🇮🇳" },
  { label: "Dubai", href: "/locations/dubai", flag: "🇦🇪" },
  { label: "Abu Dhabi", href: "/locations/abu-dhabi", flag: "🇦🇪" },
  { label: "Riyadh", href: "/locations/riyadh", flag: "🇸🇦" },
  { label: "Doha", href: "/locations/doha", flag: "🇶🇦" },
];

const industries: { label: string; href: string }[] = [
  { label: "Real Estate", href: "/industries/real-estate" },
  { label: "Healthcare", href: "/industries/healthcare" },
  { label: "E-commerce / D2C", href: "/industries/ecommerce" },
  { label: "Finance & Fintech", href: "/industries/finance" },
  { label: "SaaS", href: "/industries/saas" },
  { label: "Education", href: "/industries/education" },
  { label: "Hospitality", href: "/industries/hospitality" },
];

const featured: { label: string; href: string; sub: string }[] = [
  { label: "SEO Agency in Bangalore", sub: "Drive organic growth", href: "/lp/seo-agency-bangalore" },
  { label: "Google Ads Agency Delhi", sub: "Lower CPL, higher ROAS", href: "/lp/google-ads-agency-delhi" },
  { label: "WhatsApp Marketing India", sub: "Conversational commerce", href: "/lp/whatsapp-marketing-india" },
  { label: "SEO Agency Dubai", sub: "Rank in UAE & GCC", href: "/lp/seo-agency-dubai" },
  { label: "SEO × Delhi", sub: "Local SEO matrix", href: "/seo/delhi" },
  { label: "PPC × Mumbai", sub: "Mumbai paid search", href: "/ppc/mumbai" },
  { label: "Social Media × Bangalore", sub: "Bangalore social", href: "/social-media/bangalore" },
  { label: "B2B SaaS Marketing", sub: "Pipeline-led SaaS growth", href: "/lp/b2b-saas-marketing-agency-india" },
];

function Column({
  icon: Icon,
  title,
  items,
  accent,
}: {
  icon: typeof MapPin;
  title: string;
  items: { label: string; href: string; flag?: string }[];
  accent: string;
}) {
  return (
    <div className="rounded-2xl glass border border-border/30 p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="inline-flex w-7 h-7 items-center justify-center rounded-lg"
          style={{ background: `${accent}22`, color: accent, boxShadow: `0 0 18px ${accent}33` }}
        >
          <Icon className="w-3.5 h-3.5" />
        </span>
        <h3 className="font-display font-semibold text-foreground text-base">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="group flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                {item.flag && <span aria-hidden className="text-xs">{item.flag}</span>}
                <span className="truncate">{item.label}</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SeoLinkHub() {
  return (
    <section
      aria-labelledby="seo-hub-title"
      className="relative py-20 border-t border-border/30 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, hsl(256 90% 30% / 0.18), transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mb-10">
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
            EXPLORE • SERVICES × CITIES × INDUSTRIES
          </span>
          <h2
            id="seo-hub-title"
            className="font-display font-bold text-2xl md:text-4xl text-foreground mt-2 leading-tight"
          >
            Find the right growth partner —{" "}
            <span className="text-primary">tailored to your city, industry & service</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-3 leading-relaxed">
            Browse our specialized service pages, regional teams across India & MENA, and
            industry-specific case studies to find a fit that matches your business.
          </p>
        </div>

        <nav aria-label="Site navigation hub" className="grid lg:grid-cols-3 gap-5">
          <Column icon={Sparkles} title="Services" items={services} accent="hsl(256 90% 75%)" />
          <Column icon={MapPin} title="Locations" items={cities} accent="hsl(192 95% 70%)" />
          <Column icon={Briefcase} title="Industries" items={industries} accent="hsl(48 100% 65%)" />
        </nav>

        {/* Featured landing pages — high-intent keyword targets */}
        <div className="mt-10">
          <h3 className="font-display font-semibold text-foreground text-lg mb-4">
            Featured campaigns & landing pages
          </h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {featured.map((item) => (
              <motion.div
                key={item.href}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to={item.href}
                  className="group block h-full rounded-xl border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/40 p-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                      {item.label}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground/60 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">{item.sub}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
