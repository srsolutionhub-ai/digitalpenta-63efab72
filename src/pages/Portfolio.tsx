import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowUpRight, LayoutGrid, GalleryHorizontal } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useInView, AnimatePresence } from "motion/react";
import MagneticCard from "@/components/ui/magnetic-card";
import portfolioBanner from "@/assets/portfolio-banner-graphic.jpg";
import SEOHead, { breadcrumbSchema } from "@/components/seo/SEOHead";

const categories = ["All", "Marketing", "PR", "Development", "AI", "Automation"];

const projects = [
  {
    title: "PropTech Lead Engine", client: "Skyline Properties", category: "Marketing",
    metric: "340% more leads", desc: "Full-funnel SEO + PPC strategy that transformed a stagnant real estate portal into a lead generation machine across 5 Indian cities.",
    gradient: "from-violet-600/40 to-purple-900/40", tags: ["SEO", "PPC", "Automation"], industry: "Real Estate",
  },
  {
    title: "Gulf Retail Brand Launch", client: "Gulf Retail Group", category: "PR",
    metric: "400% visibility", desc: "Multi-market PR blitz across UAE & KSA, securing tier-1 media coverage and 50M+ impressions in 90 days.",
    gradient: "from-cyan-600/40 to-blue-900/40", tags: ["Media Relations", "Digital PR"], industry: "Retail",
  },
  {
    title: "HealthTech Platform", client: "MediCare Plus", category: "Development",
    metric: "50K+ users", desc: "End-to-end React web app with telemedicine, appointment scheduling, and integrated payment gateway.",
    gradient: "from-emerald-600/40 to-green-900/40", tags: ["Web App", "UI/UX"], industry: "Healthcare",
  },
  {
    title: "AI Customer Support", client: "FinServe Global", category: "AI",
    metric: "80% automation", desc: "NLP-powered chatbot handling 10K+ monthly queries with human-like accuracy and 3-second response times.",
    gradient: "from-amber-600/40 to-yellow-900/40", tags: ["Chatbot", "NLP"], industry: "Finance",
  },
  {
    title: "E-commerce Scaling", client: "Fashion Forward", category: "Marketing",
    metric: "8.2x ROAS", desc: "Instagram + Meta Ads strategy that scaled a D2C fashion brand from ₹2L to ₹50L monthly revenue.",
    gradient: "from-pink-600/40 to-rose-900/40", tags: ["Social Media", "Performance"], industry: "Fashion",
  },
  {
    title: "CRM Workflow Overhaul", client: "Realty Hub", category: "Automation",
    metric: "200hrs saved/mo", desc: "Complete CRM automation with HubSpot + Zapier, eliminating manual data entry and follow-up tracking.",
    gradient: "from-orange-600/40 to-red-900/40", tags: ["CRM", "Workflow"], industry: "Real Estate",
  },
  {
    title: "Mobile Banking App", client: "NeoBank India", category: "Development",
    metric: "100K downloads", desc: "Cross-platform Flutter app with biometric auth, UPI integration, and real-time transaction tracking.",
    gradient: "from-blue-600/40 to-indigo-900/40", tags: ["Mobile App", "API"], industry: "Fintech",
  },
  {
    title: "AI Content Pipeline", client: "EduLearn India", category: "AI",
    metric: "10x content output", desc: "Custom AI content generation pipeline producing 500+ SEO-optimized articles monthly with editorial quality.",
    gradient: "from-violet-600/40 to-fuchsia-900/40", tags: ["Content Gen", "AI Marketing"], industry: "EdTech",
  },
  {
    title: "Crisis Recovery PR", client: "TechStart UAE", category: "PR",
    metric: "Reputation restored", desc: "72-hour crisis response protocol that reversed negative sentiment and rebuilt brand trust across MENA media.",
    gradient: "from-teal-600/40 to-cyan-900/40", tags: ["Crisis Mgmt", "Brand Reputation"], industry: "Tech",
  },
  {
    title: "WhatsApp Commerce Bot", client: "Souq Digital", category: "Automation",
    metric: "₹2Cr revenue", desc: "WhatsApp Business API integration enabling catalog browsing, ordering, and payment — all within chat.",
    gradient: "from-green-600/40 to-emerald-900/40", tags: ["WhatsApp", "Sales"], industry: "E-commerce",
  },
];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "gallery">("grid");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="pt-32 pb-10 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={portfolioBanner} alt="" className="w-full h-full object-cover" loading="eager" width={1920} height={1080} style={{ opacity: 0.55 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 0%, transparent 30%, hsl(var(--background) / 0.65) 75%, hsl(var(--background)) 100%)" }} />
        </div>
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[150px] animate-breathe" />
        <div className="container mx-auto px-4 relative z-10" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Portfolio</span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mt-4 mb-4">
              Our <span className="text-gradient">Work</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Real results for real brands. Explore how we've driven growth across industries and markets in India & Middle East.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Portfolio Grid ── */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`px-5 py-2 rounded-full text-sm font-display font-medium transition-all border ${
                    active === c
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/20"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {/* View toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-secondary/30 border border-border/30">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-primary/10 text-foreground" : "text-muted-foreground"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("gallery")} className={`p-1.5 rounded ${viewMode === "gallery" ? "bg-primary/10 text-foreground" : "text-muted-foreground"}`}>
                <GalleryHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === "gallery" ? (
            /* Gallery: horizontal scroll */
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.title}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="min-w-[350px] snap-center"
                  >
                    <GalleryCard project={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Grid */
            <div className="grid md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.title}
                    layout
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <GalleryCard project={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4 font-display">Want results like these for your brand?</p>
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-10 font-display font-bold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20">
                Get Your Free Strategy Call →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function GalleryCard({ project: p }: { project: typeof projects[0] }) {
  return (
    <MagneticCard intensity={3} className="h-full">
      <div className="group rounded-2xl glass border border-border/30 overflow-hidden hover:border-primary/20 hover:shadow-2xl transition-all duration-500 h-full">
        {/* Gradient header with overlay */}
        <div className={`h-44 bg-gradient-to-br ${p.gradient} relative overflow-hidden`}>
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200">
            <circle cx="350" cy="30" r="60" fill="currentColor" />
            <circle cx="50" cy="170" r="40" fill="currentColor" />
            <rect x="150" y="80" width="100" height="100" rx="16" fill="currentColor" opacity="0.5" />
          </svg>

          {/* Hover overlay with dual CTAs */}
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 p-6">
            <p className="text-sm text-foreground text-center leading-relaxed mb-2">{p.desc}</p>
            <div className="flex gap-2">
              <span className="text-[10px] px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono">View Case Study →</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 z-10">
            <span className="text-xs font-display font-bold text-foreground">{p.metric}</span>
          </div>
          {/* Industry badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[9px] font-mono px-2 py-1 rounded-full bg-background/60 backdrop-blur-sm text-foreground/70">
              {p.industry}
            </span>
          </div>
        </div>

        <div className="p-7">
          <div className="flex items-start justify-between mb-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{p.client}</span>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mt-1 mb-3 group-hover:text-primary transition-colors">
            {p.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/60 text-secondary-foreground font-mono border border-border/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MagneticCard>
  );
}
