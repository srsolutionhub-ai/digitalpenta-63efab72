import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

import blogAiImg from "@/assets/blog-ai.jpg";
import blogSeoImg from "@/assets/blog-seo.jpg";
import blogAutoImg from "@/assets/blog-automation.jpg";

const posts = [
  {
    title: "How AI is Reshaping Digital Marketing in 2026",
    excerpt: "From predictive analytics to AI-generated campaigns — here's what CMOs need to know.",
    category: "AI & Marketing",
    date: "Mar 2026",
    readTime: "6 min read",
    slug: "ai-reshaping-marketing-2026",
    image: blogAiImg,
  },
  {
    title: "SEO Strategy for Middle East Markets: A Complete Guide",
    excerpt: "Arabic SEO, local search, and cultural nuances that make or break your MENA strategy.",
    category: "SEO",
    date: "Mar 2026",
    readTime: "8 min read",
    slug: "seo-middle-east-guide",
    image: blogSeoImg,
  },
  {
    title: "The ROI of Marketing Automation: Real Numbers from Real Clients",
    excerpt: "We break down the exact savings and revenue gains from automating marketing workflows.",
    category: "Automation",
    date: "Feb 2026",
    readTime: "5 min read",
    slug: "roi-marketing-automation",
    image: blogAutoImg,
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
                <div className="h-32 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
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
