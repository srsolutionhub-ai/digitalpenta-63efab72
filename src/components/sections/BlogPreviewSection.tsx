import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const posts = [
  {
    title: "How AI is Reshaping Digital Marketing in 2026",
    excerpt: "From predictive analytics to AI-generated campaigns — here's what CMOs need to know.",
    category: "AI & Marketing",
    date: "Mar 2026",
  },
  {
    title: "SEO Strategy for Middle East Markets: A Complete Guide",
    excerpt: "Arabic SEO, local search, and cultural nuances that make or break your MENA strategy.",
    category: "SEO",
    date: "Mar 2026",
  },
  {
    title: "The ROI of Marketing Automation: Real Numbers from Real Clients",
    excerpt: "We break down the exact savings and revenue gains from automating marketing workflows.",
    category: "Automation",
    date: "Feb 2026",
  },
];

export default function BlogPreviewSection() {
  return (
    <section className="py-20 md:py-28 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Insights</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3">
              Latest From Our <span className="text-gradient">Blog</span>
            </h2>
          </div>
          <Link to="/blog" className="hidden md:flex items-center gap-1 text-sm text-primary hover:underline">
            All articles <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.title}
              to="/blog"
              className="group rounded-xl glass glass-hover glow-border p-6 flex flex-col"
            >
              <span className="text-[10px] font-mono text-primary uppercase tracking-wider mb-3">{post.category}</span>
              <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
              <span className="text-xs text-muted-foreground mt-4 font-mono">{post.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
