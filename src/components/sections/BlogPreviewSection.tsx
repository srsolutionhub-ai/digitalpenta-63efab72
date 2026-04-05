import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

/* Generative SVG art headers per blog category */
const blogArt: Record<string, JSX.Element> = {
  "AI & Marketing": (
    <svg viewBox="0 0 300 120" className="absolute inset-0 w-full h-full" fill="none" opacity="0.2">
      <circle cx="80" cy="60" r="20" stroke="hsl(252, 60%, 63%)" strokeWidth="0.8" />
      <circle cx="80" cy="60" r="8" fill="hsl(252, 60%, 63%)" opacity=".3" />
      <circle cx="180" cy="40" r="12" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" />
      <circle cx="220" cy="80" r="16" stroke="hsl(252, 60%, 63%)" strokeWidth="0.5" />
      <line x1="100" y1="60" x2="168" y2="40" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" strokeDasharray="4 3" />
      <line x1="192" y1="40" x2="204" y2="80" stroke="hsl(252, 60%, 63%)" strokeWidth="0.5" strokeDasharray="4 3" />
      {[40, 120, 250].map((x, i) => <circle key={i} cx={x} cy={20 + i * 30} r="2" fill="hsl(var(--foreground))" opacity=".15" />)}
    </svg>
  ),
  "SEO": (
    <svg viewBox="0 0 300 120" className="absolute inset-0 w-full h-full" fill="none" opacity="0.2">
      <path d="M20 90 Q80 30 150 60 Q220 90 280 30" stroke="hsl(190, 100%, 50%)" strokeWidth="1.5" />
      <circle cx="150" cy="60" r="4" fill="hsl(190, 100%, 50%)" opacity=".6" />
      <rect x="40" y="15" width="60" height="8" rx="4" fill="hsl(190, 100%, 50%)" opacity=".1" />
      <rect x="40" y="28" width="40" height="6" rx="3" fill="hsl(190, 100%, 50%)" opacity=".06" />
      <circle cx="25" cy="19" r="6" stroke="hsl(190, 100%, 50%)" strokeWidth="0.8" />
      <line x1="29" y1="23" x2="35" y2="29" stroke="hsl(190, 100%, 50%)" strokeWidth="0.8" />
    </svg>
  ),
  "Automation": (
    <svg viewBox="0 0 300 120" className="absolute inset-0 w-full h-full" fill="none" opacity="0.2">
      <rect x="30" y="40" width="50" height="30" rx="6" stroke="hsl(160, 84%, 39%)" strokeWidth="0.8" />
      <rect x="130" y="30" width="50" height="30" rx="6" stroke="hsl(160, 84%, 39%)" strokeWidth="0.8" />
      <rect x="230" y="50" width="50" height="30" rx="6" stroke="hsl(160, 84%, 39%)" strokeWidth="0.8" />
      <path d="M80 55 L130 45" stroke="hsl(160, 84%, 39%)" strokeWidth="0.5" strokeDasharray="4 2" />
      <path d="M180 45 L230 65" stroke="hsl(160, 84%, 39%)" strokeWidth="0.5" strokeDasharray="4 2" />
      <polygon points="55 52 55 58 60 55" fill="hsl(160, 84%, 39%)" opacity=".4" />
    </svg>
  ),
};

const posts = [
  {
    title: "How AI is Reshaping Digital Marketing in 2026",
    excerpt: "From predictive analytics to AI-generated campaigns — here's what CMOs need to know.",
    category: "AI & Marketing",
    date: "Mar 2026",
    readTime: "6 min read",
    slug: "ai-reshaping-marketing-2026",
    gradient: "from-violet-500/20 to-purple-600/10",
  },
  {
    title: "SEO Strategy for Middle East Markets: A Complete Guide",
    excerpt: "Arabic SEO, local search, and cultural nuances that make or break your MENA strategy.",
    category: "SEO",
    date: "Mar 2026",
    readTime: "8 min read",
    slug: "seo-middle-east-guide",
    gradient: "from-cyan-500/20 to-blue-600/10",
  },
  {
    title: "The ROI of Marketing Automation: Real Numbers from Real Clients",
    excerpt: "We break down the exact savings and revenue gains from automating marketing workflows.",
    category: "Automation",
    date: "Feb 2026",
    readTime: "5 min read",
    slug: "roi-marketing-automation",
    gradient: "from-emerald-500/20 to-green-600/10",
  },
];

export default function BlogPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-card/20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Insights</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3">
              Latest From Our <span className="text-gradient">Blog</span>
            </h2>
          </div>
          <Link to="/blog" className="hidden md:flex items-center gap-1.5 text-sm text-primary hover:text-foreground transition-colors font-display font-semibold">
            All articles <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group rounded-2xl glass border border-border/30 overflow-hidden flex flex-col transition-all duration-500 hover:border-primary/20 hover:shadow-2xl h-full shimmer-card"
              >
                <div className={`h-32 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                  {blogArt[post.category]}
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10">{post.category}</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">{post.date}</span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
