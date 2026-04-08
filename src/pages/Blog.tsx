import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Clock, ArrowUpRight, User, Search, TrendingUp } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";

const categories = ["All", "Marketing", "SEO", "AI", "Automation", "Development", "PR"];

const authors: Record<string, { name: string; initials: string }> = {
  Marketing: { name: "Sneha K.", initials: "SK" },
  SEO: { name: "Rohan P.", initials: "RP" },
  AI: { name: "Vikram R.", initials: "VR" },
  Automation: { name: "Aisha K.", initials: "AK" },
  Development: { name: "Vikram R.", initials: "VR" },
  PR: { name: "Priya S.", initials: "PS" },
};

const categoryColors: Record<string, string> = {
  AI: "bg-amber-500",
  SEO: "bg-emerald-500",
  Marketing: "bg-violet-500",
  Automation: "bg-orange-500",
  Development: "bg-cyan-500",
  PR: "bg-pink-500",
};

const articles = [
  { title: "How AI is Reshaping Digital Marketing in 2026", excerpt: "From predictive analytics to AI-generated campaigns — here's what CMOs need to know about the future of marketing.", category: "AI", date: "Mar 28, 2026", readTime: "6 min", slug: "ai-reshaping-marketing-2026", featured: true, trending: true },
  { title: "SEO Strategy for Middle East Markets: A Complete Guide", excerpt: "Arabic SEO, local search, and cultural nuances that make or break your MENA strategy.", category: "SEO", date: "Mar 20, 2026", readTime: "8 min", slug: "seo-middle-east-guide", trending: true },
  { title: "The ROI of Marketing Automation: Real Numbers", excerpt: "We break down the exact savings and revenue gains from automating marketing workflows.", category: "Automation", date: "Mar 12, 2026", readTime: "5 min", slug: "roi-marketing-automation" },
  { title: "Building Scalable Web Apps with React & Supabase", excerpt: "Our development team shares the architecture behind high-performance client applications.", category: "Development", date: "Feb 28, 2026", readTime: "7 min", slug: "scalable-web-apps-react" },
  { title: "PR Crisis Management: A 2026 Playbook", excerpt: "How to protect your brand reputation during a crisis with proven PR strategies.", category: "PR", date: "Feb 15, 2026", readTime: "6 min", slug: "pr-crisis-management-playbook" },
  { title: "Performance Marketing: Beyond ROAS", excerpt: "Why ROAS is not enough and how to measure true marketing impact across channels.", category: "Marketing", date: "Feb 5, 2026", readTime: "5 min", slug: "performance-marketing-beyond-roas" },
  { title: "WhatsApp Automation for E-commerce Growth", excerpt: "Leverage WhatsApp Business API to drive sales, support, and engagement at scale.", category: "Automation", date: "Jan 22, 2026", readTime: "4 min", slug: "whatsapp-automation-ecommerce" },
  { title: "The Future of AI Chatbots in Customer Service", excerpt: "How next-gen AI chatbots are reducing support costs by 70% while improving satisfaction.", category: "AI", date: "Jan 10, 2026", readTime: "6 min", slug: "future-ai-chatbots" },
];

export default function Blog() {
  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const featured = articles.find((a) => a.featured);
  const filtered = (active === "All" ? articles : articles.filter((a) => a.category === active))
    .filter((a) => !a.featured)
    .filter((a) => !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="pt-32 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-accent/6 blur-[120px] animate-breathe" />
        <div className="container mx-auto px-4 relative z-10" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Blog</span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mt-4 mb-4">
              Digital Marketing <span className="text-gradient">Insights & Ideas</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Strategies, trends, and deep-dives from India's leading digital marketing experts.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          {/* ── Featured Article ── */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Link
                to={`/blog/${featured.slug}`}
                className="group block rounded-2xl glass border border-border/30 overflow-hidden mb-10 hover:border-primary/20 transition-all duration-500 hover-glow"
              >
                <div className="grid md:grid-cols-2">
                  <div className="h-48 md:h-auto bg-gradient-to-br from-primary/20 via-accent/10 to-transparent relative overflow-hidden">
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-xs font-mono text-primary font-bold">Featured</span>
                      {featured.trending && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Trending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-mono text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${categoryColors[featured.category]}`} />
                        {featured.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {featured.readTime} read
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featured.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">{authors[featured.category]?.initials}</span>
                      </div>
                      <div>
                        <span className="text-xs font-display font-medium text-foreground">{authors[featured.category]?.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">{featured.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* ── Search + Filters ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/30 border-border/30 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-display font-medium transition-all border flex items-center gap-1.5 ${
                    active === c
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/20"
                  }`}
                >
                  {c !== "All" && <span className={`w-1.5 h-1.5 rounded-full ${categoryColors[c]}`} />}
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((a, i) => (
                <motion.div
                  key={a.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    to={`/blog/${a.slug}`}
                    className="group rounded-2xl glass border border-border/30 overflow-hidden flex flex-col hover:border-primary/20 hover:shadow-xl transition-all duration-500 h-full"
                  >
                    {/* Header */}
                    <div className="h-28 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent relative overflow-hidden">
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-mono text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 backdrop-blur-sm flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${categoryColors[a.category]}`} />
                          {a.category}
                        </span>
                        {a.trending && (
                          <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 backdrop-blur-sm flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Trending
                          </span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/50 backdrop-blur-sm">
                          <Clock className="w-3 h-3" />{a.readTime}
                        </span>
                      </div>
                      {/* Read progress bar on hover */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700" />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-display font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{a.excerpt}</p>
                      <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-primary">{authors[a.category]?.initials}</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">{a.date}</span>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Layout>
  );
}
