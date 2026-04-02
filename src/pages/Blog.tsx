import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Clock, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categories = ["All", "Marketing", "SEO", "AI", "Automation", "Development", "PR"];

const articles = [
  {
    title: "How AI is Reshaping Digital Marketing in 2026",
    excerpt: "From predictive analytics to AI-generated campaigns — here's what CMOs need to know about the future of marketing.",
    category: "AI",
    date: "Mar 28, 2026",
    readTime: "6 min",
    slug: "ai-reshaping-marketing-2026",
    featured: true,
  },
  {
    title: "SEO Strategy for Middle East Markets: A Complete Guide",
    excerpt: "Arabic SEO, local search, and cultural nuances that make or break your MENA strategy.",
    category: "SEO",
    date: "Mar 20, 2026",
    readTime: "8 min",
    slug: "seo-middle-east-guide",
  },
  {
    title: "The ROI of Marketing Automation: Real Numbers",
    excerpt: "We break down the exact savings and revenue gains from automating marketing workflows.",
    category: "Automation",
    date: "Mar 12, 2026",
    readTime: "5 min",
    slug: "roi-marketing-automation",
  },
  {
    title: "Building Scalable Web Apps with React & Supabase",
    excerpt: "Our development team shares the architecture behind high-performance client applications.",
    category: "Development",
    date: "Feb 28, 2026",
    readTime: "7 min",
    slug: "scalable-web-apps-react",
  },
  {
    title: "PR Crisis Management: A 2026 Playbook",
    excerpt: "How to protect your brand reputation during a crisis with proven PR strategies.",
    category: "PR",
    date: "Feb 15, 2026",
    readTime: "6 min",
    slug: "pr-crisis-management-playbook",
  },
  {
    title: "Performance Marketing: Beyond ROAS",
    excerpt: "Why ROAS is not enough and how to measure true marketing impact across channels.",
    category: "Marketing",
    date: "Feb 5, 2026",
    readTime: "5 min",
    slug: "performance-marketing-beyond-roas",
  },
  {
    title: "WhatsApp Automation for E-commerce Growth",
    excerpt: "Leverage WhatsApp Business API to drive sales, support, and engagement at scale.",
    category: "Automation",
    date: "Jan 22, 2026",
    readTime: "4 min",
    slug: "whatsapp-automation-ecommerce",
  },
  {
    title: "The Future of AI Chatbots in Customer Service",
    excerpt: "How next-gen AI chatbots are reducing support costs by 70% while improving satisfaction.",
    category: "AI",
    date: "Jan 10, 2026",
    readTime: "6 min",
    slug: "future-ai-chatbots",
  },
];

export default function Blog() {
  const [active, setActive] = useState("All");
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const featured = articles.find(a => a.featured);
  const filtered = (active === "All" ? articles : articles.filter(a => a.category === active)).filter(a => !a.featured);

  return (
    <Layout>
      <section className="pt-32 pb-10 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10" ref={sectionRef}>
          <div className="max-w-3xl" data-reveal>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Blog</span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mt-4 mb-4">
              Insights & <span className="text-gradient">Ideas</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Strategies, trends, and deep-dives from our team of digital experts.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          {/* Featured */}
          {featured && (
            <Link
              to={`/blog/${featured.slug}`}
              className="group block rounded-2xl glass border border-border/30 overflow-hidden mb-10 hover:border-primary/20 transition-all duration-500"
            >
              <div className="grid md:grid-cols-2">
                <div className="h-48 md:h-auto bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10">{featured.category}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
                  <span className="text-xs font-mono text-muted-foreground">{featured.date}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-display font-medium transition-all border ${
                  active === c
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                className="group rounded-2xl glass border border-border/30 p-7 flex flex-col hover:border-primary/20 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-primary uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10">{a.category}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{a.readTime}</span>
                </div>
                <h3 className="font-display font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{a.excerpt}</p>
                <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">{a.date}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
