import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "motion/react";

const categories = ["All", "Marketing", "PR", "Development", "AI", "Automation"];

const projects = [
  {
    title: "PropTech Lead Engine",
    client: "Skyline Properties",
    category: "Marketing",
    metric: "340% more leads",
    desc: "Full-funnel SEO + PPC strategy that transformed a stagnant real estate portal into a lead generation machine across 5 Indian cities.",
    gradient: "from-violet-600/40 to-purple-900/40",
    tags: ["SEO", "PPC", "Automation"],
  },
  {
    title: "Gulf Retail Brand Launch",
    client: "Gulf Retail Group",
    category: "PR",
    metric: "400% visibility",
    desc: "Multi-market PR blitz across UAE & KSA, securing tier-1 media coverage and 50M+ impressions in 90 days.",
    gradient: "from-cyan-600/40 to-blue-900/40",
    tags: ["Media Relations", "Digital PR"],
  },
  {
    title: "HealthTech Platform",
    client: "MediCare Plus",
    category: "Development",
    metric: "50K+ users",
    desc: "End-to-end React web app with telemedicine, appointment scheduling, and integrated payment gateway.",
    gradient: "from-emerald-600/40 to-green-900/40",
    tags: ["Web App", "UI/UX"],
  },
  {
    title: "AI Customer Support",
    client: "FinServe Global",
    category: "AI",
    metric: "80% automation",
    desc: "NLP-powered chatbot handling 10K+ monthly queries with human-like accuracy and 3-second response times.",
    gradient: "from-amber-600/40 to-yellow-900/40",
    tags: ["Chatbot", "NLP"],
  },
  {
    title: "E-commerce Scaling",
    client: "Fashion Forward",
    category: "Marketing",
    metric: "8.2x ROAS",
    desc: "Instagram + Meta Ads strategy that scaled a D2C fashion brand from ₹2L to ₹50L monthly revenue.",
    gradient: "from-pink-600/40 to-rose-900/40",
    tags: ["Social Media", "Performance"],
  },
  {
    title: "CRM Workflow Overhaul",
    client: "Realty Hub",
    category: "Automation",
    metric: "200hrs saved/mo",
    desc: "Complete CRM automation with HubSpot + Zapier, eliminating manual data entry and follow-up tracking.",
    gradient: "from-orange-600/40 to-red-900/40",
    tags: ["CRM", "Workflow"],
  },
  {
    title: "Mobile Banking App",
    client: "NeoBank India",
    category: "Development",
    metric: "100K downloads",
    desc: "Cross-platform Flutter app with biometric auth, UPI integration, and real-time transaction tracking.",
    gradient: "from-blue-600/40 to-indigo-900/40",
    tags: ["Mobile App", "API"],
  },
  {
    title: "AI Content Pipeline",
    client: "EduLearn India",
    category: "AI",
    metric: "10x content output",
    desc: "Custom AI content generation pipeline producing 500+ SEO-optimized articles monthly with editorial quality.",
    gradient: "from-violet-600/40 to-fuchsia-900/40",
    tags: ["Content Gen", "AI Marketing"],
  },
  {
    title: "Crisis Recovery PR",
    client: "TechStart UAE",
    category: "PR",
    metric: "Reputation restored",
    desc: "72-hour crisis response protocol that reversed negative sentiment and rebuilt brand trust across MENA media.",
    gradient: "from-teal-600/40 to-cyan-900/40",
    tags: ["Crisis Mgmt", "Brand Reputation"],
  },
  {
    title: "WhatsApp Commerce Bot",
    client: "Souq Digital",
    category: "Automation",
    metric: "₹2Cr revenue",
    desc: "WhatsApp Business API integration enabling catalog browsing, ordering, and payment — all within chat.",
    gradient: "from-green-600/40 to-emerald-900/40",
    tags: ["WhatsApp", "Sales"],
  },
];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="pt-32 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
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
          <div className="flex flex-wrap gap-2 mb-10">
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

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl glass border border-border/30 overflow-hidden hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
              >
                {/* Gradient header with overlay */}
                <div className={`h-44 bg-gradient-to-br ${p.gradient} relative overflow-hidden`}>
                  {/* Abstract SVG pattern */}
                  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200">
                    <circle cx="350" cy="30" r="60" fill="currentColor" />
                    <circle cx="50" cy="170" r="40" fill="currentColor" />
                    <rect x="150" y="80" width="100" height="100" rx="16" fill="currentColor" opacity="0.5" />
                  </svg>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                    <p className="text-sm text-foreground text-center leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                    <span className="text-xs font-display font-bold text-foreground">{p.metric}</span>
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
              </motion.div>
            ))}
          </div>

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
