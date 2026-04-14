import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import BlogStickyCTA from "@/components/ui/blog-sticky-cta";
import { ChevronRight, Clock, ArrowLeft, Share2, Twitter, Linkedin, Facebook, Copy, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, useScroll } from "motion/react";
import { useRef, useMemo } from "react";

interface ArticleData {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorInitials: string;
  authorRole: string;
  excerpt: string;
  content: string[];
}

const articlesData: Record<string, ArticleData> = {
  "ai-reshaping-marketing-2026": {
    title: "How AI is Reshaping Digital Marketing in 2026",
    category: "AI",
    date: "March 28, 2026",
    readTime: "6 min read",
    author: "Vikram R.",
    authorInitials: "VR",
    authorRole: "AI & Marketing Division",
    excerpt: "From predictive analytics to AI-generated campaigns — here's what CMOs need to know about the future of marketing.",
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
    author: "Rohan P.",
    authorInitials: "RP",
    authorRole: "SEO Division",
    excerpt: "Arabic SEO, local search, and cultural nuances that make or break your MENA strategy.",
    content: [
      "The Middle East represents one of the fastest-growing digital markets globally, yet most SEO strategies fail because they apply Western playbooks to a fundamentally different search landscape.",
      "## Arabic-First SEO\n\nGoogle processes Arabic queries differently than English. Right-to-left text, dialect variations, and script-specific indexing challenges mean you need specialized technical SEO knowledge. We've seen 200%+ traffic gains simply by fixing Arabic-language technical issues.",
      "## Local Search Dominance\n\nGoogle Maps and local search drive a disproportionate share of business in the GCC. Optimizing your Google Business Profile with Arabic content, local reviews, and region-specific schema markup is essential.",
      "## Cultural Content Strategy\n\nContent that resonates in the Middle East often differs significantly from Western markets. Understanding religious observances, cultural values, and regional preferences is critical for creating content that ranks AND converts.",
      "## E-E-A-T in MENA Markets\n\nGoogle's E-E-A-T signals are particularly important in YMYL categories across the Middle East. Building expertise, authority, and trustworthiness requires region-specific strategies including Arabic PR, local citations, and partnerships with regional authorities.",
    ],
  },
  "roi-marketing-automation": {
    title: "The ROI of Marketing Automation: Real Numbers",
    category: "Automation",
    date: "March 12, 2026",
    readTime: "5 min read",
    author: "Aisha K.",
    authorInitials: "AK",
    authorRole: "Automation Division",
    excerpt: "We break down the exact savings and revenue gains from automating marketing workflows.",
    content: [
      "Marketing automation isn't just a buzzword — it's a measurable revenue driver. After implementing automation across 200+ client campaigns, we've compiled the hard data on what it actually delivers.",
      "## The Cost Savings\n\nOn average, our clients save 15-25 hours per week on repetitive marketing tasks after implementing automation. At agency rates, that translates to ₹3-5 lakhs per month in saved productivity. Email sequences, social scheduling, lead scoring, and reporting — all automated.",
      "## Revenue Impact\n\nAutomated lead nurturing sequences convert 3x better than manual follow-ups. Why? Timing. Automation ensures every lead gets the right message at the right moment — something humans simply can't do consistently at scale.",
      "## Implementation Timeline\n\nMost businesses see ROI within 60-90 days of implementing marketing automation. The initial setup takes 2-4 weeks, followed by a 30-day optimization period. After that, the system runs largely on autopilot with monthly refinements.",
      "## Common Pitfalls\n\nThe biggest mistake we see is over-automating too quickly. Start with your highest-impact workflows — abandoned cart emails, lead welcome sequences, and review requests. Master these before expanding to complex multi-channel automations.",
    ],
  },
  "scalable-web-apps-react": {
    title: "Building Scalable Web Apps with React & Supabase",
    category: "Development",
    date: "February 28, 2026",
    readTime: "7 min read",
    author: "Vikram R.",
    authorInitials: "VR",
    authorRole: "Development Division",
    excerpt: "Our development team shares the architecture behind high-performance client applications.",
    content: [
      "After building 50+ production applications, we've settled on an architecture that scales from MVP to millions of users without painful rewrites. Here's our playbook.",
      "## The Stack\n\nReact 18 with TypeScript, Vite for blazing-fast builds, Tailwind CSS for consistent design systems, and Supabase for the entire backend — auth, database, storage, and real-time subscriptions. This stack lets a 3-person team ship what used to require 10.",
      "## Performance First\n\nWe implement code splitting at the route level, lazy load images and heavy components, and use React.memo strategically. Our Lighthouse scores consistently hit 95+ across all metrics. The secret? Measure everything, optimize what matters.",
      "## Database Design\n\nSupabase's PostgreSQL foundation means we can use proper relational design with Row Level Security. We design schemas for the querying patterns we need, not the data we have. This prevents the N+1 query problems that plague most apps.",
      "## Deployment & CI/CD\n\nEvery push triggers automated tests, linting, and type-checking. Previews deploy automatically for PR review. Production deploys are blue-green with instant rollback capability. Zero-downtime deployments are non-negotiable.",
    ],
  },
  "pr-crisis-management-playbook": {
    title: "PR Crisis Management: A 2026 Playbook",
    category: "PR",
    date: "February 15, 2026",
    readTime: "6 min read",
    author: "Priya S.",
    authorInitials: "PS",
    authorRole: "PR Division",
    excerpt: "How to protect your brand reputation during a crisis with proven PR strategies.",
    content: [
      "In the age of viral social media, a brand crisis can escalate from a single tweet to front-page news in hours. Having a tested crisis management playbook isn't optional — it's survival.",
      "## The Golden Hour\n\nThe first 60 minutes after a crisis breaks determine 80% of the outcome. Your team needs a pre-approved response framework, designated spokespeople, and clear escalation paths. We drill these with clients quarterly.",
      "## Social Media Monitoring\n\nAI-powered sentiment analysis tools now detect brand crises 4-6 hours before they peak. We set up real-time alerts across Twitter/X, Reddit, LinkedIn, and news outlets. Early detection means early containment.",
      "## Stakeholder Communication\n\nDifferent audiences need different messages. Customers want reassurance, employees want clarity, investors want facts, and media wants transparency. A single press release doesn't cut it — you need tailored communication streams.",
      "## Post-Crisis Recovery\n\nThe crisis response doesn't end when the news cycle moves on. Reputation recovery takes 6-12 months of consistent positive messaging, community engagement, and demonstrable corrective action. We build 90-day recovery roadmaps for every crisis we manage.",
    ],
  },
  "performance-marketing-beyond-roas": {
    title: "Performance Marketing: Beyond ROAS",
    category: "Marketing",
    date: "February 5, 2026",
    readTime: "5 min read",
    author: "Sneha K.",
    authorInitials: "SK",
    authorRole: "Marketing Division",
    excerpt: "Why ROAS is not enough and how to measure true marketing impact across channels.",
    content: [
      "ROAS (Return on Ad Spend) has been the north star metric for performance marketers for a decade. But in 2026, relying solely on ROAS is leaving money on the table — and making bad decisions.",
      "## The Attribution Problem\n\nLast-click attribution massively overvalues bottom-funnel channels and undervalues awareness campaigns. A customer who saw your YouTube ad, read your blog post, and then clicked a Google search ad — ROAS credits only the search ad. This leads to systematic underinvestment in top-of-funnel.",
      "## Incrementality Testing\n\nThe gold standard for measuring true marketing impact is incrementality testing — controlled experiments that measure what would have happened WITHOUT your ads. We run geo-based and audience-based holdout tests that reveal the real lift from each channel.",
      "## Customer Lifetime Value Integration\n\nA campaign with 2x ROAS acquiring customers with ₹50K LTV is infinitely better than a 5x ROAS campaign acquiring one-time buyers. We build LTV models into our bidding strategies so our algorithms optimize for long-term revenue, not just immediate returns.",
      "## The Full-Funnel Dashboard\n\nWe've developed a unified measurement framework that combines media mix modeling, multi-touch attribution, and incrementality data into a single dashboard. This gives CMOs a true picture of marketing effectiveness across every channel and touchpoint.",
    ],
  },
  "whatsapp-automation-ecommerce": {
    title: "WhatsApp Automation for E-commerce Growth",
    category: "Automation",
    date: "January 22, 2026",
    readTime: "4 min read",
    author: "Aisha K.",
    authorInitials: "AK",
    authorRole: "Automation Division",
    excerpt: "Leverage WhatsApp Business API to drive sales, support, and engagement at scale.",
    content: [
      "WhatsApp has 500M+ users in India alone. For e-commerce brands, it's not just a messaging app — it's your most powerful sales channel. Here's how we're helping brands 3x their revenue through WhatsApp automation.",
      "## Abandoned Cart Recovery\n\nWhatsApp abandoned cart messages have a 45-60% open rate vs 15-20% for email. We set up automated flows that send personalized product reminders with images, prices, and one-click buy buttons within 30 minutes of cart abandonment.",
      "## Order Updates & Support\n\nAutomated order confirmations, shipping updates, and delivery notifications via WhatsApp reduce 'Where is my order?' support tickets by 70%. Customers prefer WhatsApp over email for transactional messages — 98% read rate vs 20% for email.",
      "## Catalog & Sales Flows\n\nWhatsApp's catalog feature combined with automated product recommendation flows creates a conversational commerce experience. Customers browse, ask questions, and purchase — all without leaving WhatsApp. Our clients see 25-35% conversion rates on WhatsApp catalog flows.",
      "## Compliance & Best Practices\n\nWhatsApp's Business API has strict opt-in and messaging policies. Violating them gets your number banned. We handle compliance setup, template approvals, and opt-in flow design to keep your account in good standing while maximizing reach.",
    ],
  },
  "future-ai-chatbots": {
    title: "The Future of AI Chatbots in Customer Service",
    category: "AI",
    date: "January 10, 2026",
    readTime: "6 min read",
    author: "Vikram R.",
    authorInitials: "VR",
    authorRole: "AI Division",
    excerpt: "How next-gen AI chatbots are reducing support costs by 70% while improving satisfaction.",
    content: [
      "The AI chatbot of 2026 bears no resemblance to the frustrating bots of five years ago. Powered by large language models and trained on company-specific data, modern chatbots are handling complex customer interactions with near-human quality.",
      "## Beyond FAQ Bots\n\nModern AI chatbots understand context, remember conversation history, and can handle multi-step processes like returns, exchanges, and account modifications. They don't just answer questions — they resolve issues end-to-end.",
      "## The Human Handoff\n\nThe best chatbot systems know their limitations. We implement confidence scoring that automatically escalates complex or sensitive issues to human agents — with full conversation context. This hybrid approach gives customers the speed of AI with the empathy of humans when needed.",
      "## Multilingual Support\n\nAI chatbots now handle Hindi, Arabic, and 50+ languages natively — not through clunky translation layers, but through models trained on multilingual data. For brands operating across India and the Middle East, this eliminates the need for large multilingual support teams.",
      "## Measuring Chatbot ROI\n\nOur clients see 60-70% reduction in support ticket volume, 40% improvement in first-response time, and 15-20% increase in customer satisfaction scores after deploying AI chatbots. The ROI is typically realized within 3 months of deployment.",
    ],
  },
};

const allArticles = Object.entries(articlesData).map(([slug, data]) => ({
  slug,
  title: data.title,
  category: data.category,
  date: data.date,
  readTime: data.readTime,
  excerpt: data.excerpt,
}));

function handleShare(platform: string, title: string) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title);
  const shareUrls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  };
  if (platform === "copy") {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Link copied to clipboard!");
    });
    return;
  }
  window.open(shareUrls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
}

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = articlesData[slug || ""] || null;
  const articleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start start", "end end"] });

  const displayArticle: ArticleData = article || {
    title: slug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Article",
    category: "General",
    date: "2026",
    readTime: "5 min read",
    author: "Digital Penta Team",
    authorInitials: "DP",
    authorRole: "Content Division",
    excerpt: "This article is coming soon.",
    content: [
      "This article is coming soon. Check back for the full content.",
      "In the meantime, explore our other articles or get in touch with our team for insights on this topic.",
    ],
  };

  // Extract headings for TOC
  const headings = useMemo(() => {
    return displayArticle.content
      .filter((b) => b.startsWith("## "))
      .map((b) => b.split("\n")[0].replace("## ", ""));
  }, [displayArticle.content]);

  const related = allArticles
    .filter((a) => a.category === displayArticle.category && a.slug !== slug)
    .slice(0, 3);

  const moreRelated =
    related.length < 3
      ? [
          ...related,
          ...allArticles
            .filter((a) => a.slug !== slug && !related.find((r) => r.slug === a.slug))
            .slice(0, 3 - related.length),
        ]
      : related;

  return (
    <Layout>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="pt-24 pb-0" ref={articleRef}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[200px]">{displayArticle.title}</span>
          </nav>
        </div>
      </div>

      <section className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Article Column */}
            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[10px] font-mono text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10">
                  {displayArticle.category}
                </span>
                <h1 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-4 mb-6 leading-tight">
                  {displayArticle.title}
                </h1>

                {/* Author Card */}
                <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-muted/30 border border-border/20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary font-bold text-sm shrink-0 ring-2 ring-primary/10">
                    {displayArticle.authorInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{displayArticle.author}</p>
                    <p className="text-xs text-muted-foreground">{displayArticle.authorRole}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{displayArticle.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {displayArticle.readTime}
                    </span>
                  </div>
                </div>

                {/* Social Sharing */}
                <div className="flex items-center gap-2 mb-10">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mr-2">Share</span>
                  {[
                    { icon: Twitter, platform: "twitter", label: "Twitter" },
                    { icon: Linkedin, platform: "linkedin", label: "LinkedIn" },
                    { icon: Facebook, platform: "facebook", label: "Facebook" },
                    { icon: Copy, platform: "copy", label: "Copy link" },
                  ].map((s) => (
                    <Button
                      key={s.platform}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all"
                      onClick={() => handleShare(s.platform, displayArticle.title)}
                      aria-label={`Share on ${s.label}`}
                    >
                      <s.icon className="w-3.5 h-3.5" />
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Article Content */}
              <div className="prose-custom">
                {displayArticle.content.map((block, i) => {
                  if (block.startsWith("## ")) {
                    const heading = block.split("\n")[0].replace("## ", "");
                    const body = block.split("\n").slice(2).join("\n");
                    return (
                      <motion.div
                        key={i}
                        className="mb-8"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                      >
                        <h2 id={heading.toLowerCase().replace(/\s+/g, "-")} className="font-display font-bold text-xl md:text-2xl text-foreground mb-3 scroll-mt-24">
                          {heading}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-[15px]">{body}</p>
                      </motion.div>
                    );
                  }
                  return (
                    <motion.p
                      key={i}
                      className="text-muted-foreground leading-relaxed text-[15px] mb-6"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5 }}
                    >
                      {block}
                    </motion.p>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 pt-8 border-t border-border/30 flex items-center justify-between">
                <Link to="/blog">
                  <Button variant="ghost" className="gap-2 font-display text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full font-display text-xs border-border/30"
                    onClick={() => handleShare("copy", displayArticle.title)}
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3">
              <div className="lg:sticky lg:top-28 space-y-8">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-5 rounded-2xl border border-border/20 bg-muted/10"
                  >
                    <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      In This Article
                    </h3>
                    <ul className="space-y-1.5">
                      {headings.map((h, i) => (
                        <li key={i}>
                          <a
                            href={`#${h.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-1"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary/40" />
                            {h}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Related Articles */}
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {moreRelated.map((a) => (
                      <Link
                        key={a.slug}
                        to={`/blog/${a.slug}`}
                        className="group block p-4 rounded-xl border border-border/20 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-300"
                      >
                        <span className="text-[9px] font-mono text-primary uppercase tracking-wider">
                          {a.category}
                        </span>
                        <h4 className="font-display font-semibold text-sm text-foreground mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {a.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{a.readTime}</span>
                          <span>·</span>
                          <span>{a.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/10">
                  <h3 className="font-display font-bold text-foreground mb-2">Need Expert Help?</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Get a free strategy consultation with our digital marketing experts.
                  </p>
                  <Link to="/get-proposal">
                    <Button size="sm" className="w-full gap-2 rounded-full font-display text-xs">
                      Get Free Proposal <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                {/* Newsletter */}
                <div className="p-6 rounded-2xl border border-border/20 bg-muted/10">
                  <h3 className="font-display font-bold text-foreground mb-2">Stay Updated</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Get the latest digital marketing insights delivered to your inbox.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="flex-1 h-9 rounded-full border border-border/30 bg-background px-3 text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <Button size="sm" className="rounded-full font-display text-xs h-9 px-4">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <BlogStickyCTA />
    </Layout>
  );
}
