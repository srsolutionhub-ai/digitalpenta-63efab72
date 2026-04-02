import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const articlesData: Record<string, { title: string; category: string; date: string; readTime: string; author: string; authorRole: string; content: string[]; }> = {
  "ai-reshaping-marketing-2026": {
    title: "How AI is Reshaping Digital Marketing in 2026",
    category: "AI",
    date: "March 28, 2026",
    readTime: "6 min read",
    author: "Digital Penta Team",
    authorRole: "AI & Marketing Division",
    content: [
      "Artificial intelligence has moved from experimental to essential in the marketing stack. In 2026, the brands that win are those that leverage AI not as a tool, but as a core strategic layer across every channel.",
      "## Predictive Audience Targeting\n\nTraditional audience segmentation is dead. AI-powered predictive models now analyze thousands of behavioral signals in real-time, identifying purchase intent before users even realize they need something. Our clients have seen 3-5x improvement in targeting accuracy using these models.",
      "## AI-Generated Creative at Scale\n\nThe creative bottleneck that plagued marketing teams for decades is dissolving. AI can now generate ad copy, visual concepts, and even video scripts that outperform human-only creative in A/B tests. The key is human oversight — AI generates, humans curate and refine.",
      "## Real-Time Campaign Optimization\n\nGone are the days of weekly optimization cycles. AI systems now adjust bids, budgets, and creative in real-time across Google, Meta, LinkedIn, and programmatic channels simultaneously. This has reduced wasted ad spend by 40% on average for our clients.",
      "## Conversational Commerce\n\nAI chatbots have evolved from simple FAQ bots to sophisticated sales agents. Our WhatsApp and web chatbots now handle 80% of initial customer inquiries, qualify leads, and even close sales — all while maintaining a human-like conversation quality.",
      "## What This Means for Your Business\n\nThe gap between AI-adopters and laggards is widening exponentially. Businesses that integrate AI into their marketing stack today will have an insurmountable competitive advantage within 12-18 months. The question isn't whether to adopt AI — it's how fast you can implement it.",
    ],
  },
  "seo-middle-east-guide": {
    title: "SEO Strategy for Middle East Markets: A Complete Guide",
    category: "SEO",
    date: "March 20, 2026",
    readTime: "8 min read",
    author: "Digital Penta Team",
    authorRole: "SEO Division",
    content: [
      "The Middle East represents one of the fastest-growing digital markets globally, yet most SEO strategies fail because they apply Western playbooks to a fundamentally different search landscape.",
      "## Arabic-First SEO\n\nGoogle processes Arabic queries differently than English. Right-to-left text, dialect variations, and script-specific indexing challenges mean you need specialized technical SEO knowledge. We've seen 200%+ traffic gains simply by fixing Arabic-language technical issues.",
      "## Local Search Dominance\n\nGoogle Maps and local search drive a disproportionate share of business in the GCC. Optimizing your Google Business Profile with Arabic content, local reviews, and region-specific schema markup is essential.",
      "## Cultural Content Strategy\n\nContent that resonates in the Middle East often differs significantly from Western markets. Understanding religious observances, cultural values, and regional preferences is critical for creating content that ranks AND converts.",
      "## E-E-A-T in MENA Markets\n\nGoogle's E-E-A-T signals are particularly important in YMYL categories across the Middle East. Building expertise, authority, and trustworthiness requires region-specific strategies including Arabic PR, local citations, and partnerships with regional authorities.",
    ],
  },
};

const defaultArticle = {
  title: "Article",
  category: "General",
  date: "2026",
  readTime: "5 min read",
  author: "Digital Penta Team",
  authorRole: "Content Division",
  content: [
    "This article is coming soon. Check back for the full content.",
    "In the meantime, explore our other articles or get in touch with our team for insights on this topic.",
  ],
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = articlesData[slug || ""] || { ...defaultArticle, title: slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Article" };
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <Layout>
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>
      </div>

      <section className="pt-8 pb-20" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div data-reveal>
              <span className="text-[10px] font-mono text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10">{article.category}</span>
              <h1 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-4 mb-6 leading-tight">{article.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
              </div>
            </div>

            <div className="prose-custom" data-reveal>
              {article.content.map((block, i) => {
                if (block.startsWith("## ")) {
                  const heading = block.split("\n")[0].replace("## ", "");
                  const body = block.split("\n").slice(2).join("\n");
                  return (
                    <div key={i} className="mb-8">
                      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-3">{heading}</h2>
                      <p className="text-muted-foreground leading-relaxed text-[15px]">{body}</p>
                    </div>
                  );
                }
                return <p key={i} className="text-muted-foreground leading-relaxed text-[15px] mb-6">{block}</p>;
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-border/30 flex items-center justify-between" data-reveal>
              <Link to="/blog">
                <Button variant="ghost" className="gap-2 font-display text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-2 rounded-full font-display text-xs border-border/30">
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
