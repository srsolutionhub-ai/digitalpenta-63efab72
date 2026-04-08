import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 125);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const categoryData: Record<string, {
  title: string; tagline: string; description: string;
  subServices: { title: string; desc: string; href: string }[];
  process: string[];
  tools: string[];
  faqs: { q: string; a: string }[];
  accentClass: string;
  stats: { value: number; suffix: string; label: string }[];
  relatedCases: { title: string; metric: string; industry: string }[];
}> = {
  "digital-marketing": {
    title: "Digital Marketing",
    tagline: "Data-Driven Growth. Measurable Results.",
    description: "We build and execute full-funnel digital marketing strategies that drive traffic, generate leads, and accelerate revenue — across India and the Middle East.",
    subServices: [
      { title: "SEO", desc: "Dominate search rankings with technical, on-page & off-page SEO", href: "/services/digital-marketing/seo" },
      { title: "PPC Management", desc: "Google Ads, Meta Ads & programmatic campaigns with proven ROAS", href: "/services/digital-marketing/ppc" },
      { title: "Social Media Marketing", desc: "Strategic content & community management across all platforms", href: "/services/digital-marketing/social-media" },
      { title: "Content Marketing", desc: "Blog, video, infographic & thought-leadership content that converts", href: "/services/digital-marketing/content" },
      { title: "Email Marketing", desc: "Automated sequences, newsletters & retention campaigns", href: "/services/digital-marketing/email" },
      { title: "Influencer Marketing", desc: "Connect with the right voices to amplify your brand", href: "/services/digital-marketing/influencer" },
      { title: "Video Marketing", desc: "YouTube, Reels, TikTok strategy with production support", href: "/services/digital-marketing/video" },
      { title: "Performance Marketing", desc: "Full-funnel paid campaigns optimized for conversions & ROAS", href: "/services/digital-marketing/performance" },
    ],
    process: ["Discovery & Audit", "Strategy & KPIs", "Channel Selection", "Campaign Build", "Launch & Optimize", "Report & Scale"],
    tools: ["Google Ads", "Meta Business Suite", "SEMrush", "Ahrefs", "HubSpot", "Google Analytics 4", "Hotjar", "Zapier"],
    faqs: [
      { q: "How long before I see results?", a: "PPC delivers immediate traffic. SEO typically shows significant results within 3-6 months. Social media growth is gradual but compounds over time." },
      { q: "Do you work with specific industries?", a: "Yes — we have deep expertise in Real Estate, Healthcare, E-commerce, Finance, Education, and SaaS across India and Middle East markets." },
      { q: "What's your minimum engagement?", a: "We work with businesses of all sizes. Our typical retainers start from ₹2L/month ($2,500) depending on scope and channels." },
    ],
    accentClass: "text-violet-400",
    stats: [{ value: 340, suffix: "%", label: "Avg Lead Increase" }, { value: 500, suffix: "+", label: "Campaigns Run" }, { value: 8, suffix: "x", label: "Average ROAS" }],
    relatedCases: [
      { title: "PropTech Lead Engine", metric: "340% more leads", industry: "Real Estate" },
      { title: "E-commerce Scaling", metric: "8.2x ROAS", industry: "Fashion D2C" },
    ],
  },
  "public-relations": {
    title: "Public Relations",
    tagline: "Shape Perception. Build Trust.",
    description: "Strategic PR that puts your brand in the right conversations — from media placements to crisis management across India and MENA markets.",
    subServices: [
      { title: "Media Relations", desc: "Secure coverage in tier-1 publications and broadcast media", href: "/services/public-relations/media-relations" },
      { title: "Brand Reputation", desc: "Monitor, protect, and enhance your brand perception online", href: "/services/public-relations/brand-reputation" },
      { title: "Crisis Management", desc: "Rapid response protocols to protect your brand during crises", href: "/services/public-relations/crisis" },
      { title: "Digital PR", desc: "Link building, online mentions & digital authority building", href: "/services/public-relations/digital-pr" },
      { title: "Press Release", desc: "Compelling releases distributed to targeted media networks", href: "/services/public-relations/press-release" },
      { title: "Thought Leadership", desc: "Position founders & executives as industry authorities", href: "/services/public-relations/thought-leadership" },
      { title: "Event PR", desc: "Pre, during & post-event media coverage and amplification", href: "/services/public-relations/event-pr" },
    ],
    process: ["Brand Audit", "Narrative Development", "Media Mapping", "Outreach & Pitching", "Coverage Tracking", "Impact Reporting"],
    tools: ["Meltwater", "Cision", "Muck Rack", "BrandWatch", "Google Alerts", "Mention"],
    faqs: [
      { q: "Can you guarantee media placements?", a: "We don't guarantee specific outlets, but our 85%+ pitch success rate speaks for itself. We focus on quality placements that move the needle." },
      { q: "Do you handle Arabic-language PR?", a: "Absolutely. Our MENA team includes native Arabic speakers who understand regional media landscapes and cultural nuances." },
      { q: "What industries do you specialize in?", a: "Tech, Finance, Real Estate, Healthcare, and Consumer Brands are our strongest verticals for PR." },
    ],
    accentClass: "text-cyan-400",
    stats: [{ value: 400, suffix: "%", label: "Visibility Increase" }, { value: 85, suffix: "%", label: "Pitch Success Rate" }, { value: 50, suffix: "M+", label: "Impressions" }],
    relatedCases: [
      { title: "Gulf Retail Brand Launch", metric: "400% visibility", industry: "Retail" },
      { title: "Crisis Recovery PR", metric: "Reputation restored", industry: "Tech" },
    ],
  },
  development: {
    title: "Development",
    tagline: "Code That Scales. Design That Converts.",
    description: "From stunning websites to complex web applications and mobile apps — we build digital products that perform beautifully under pressure.",
    subServices: [
      { title: "Website Development", desc: "Custom, high-performance websites optimized for conversions", href: "/services/development/website" },
      { title: "Mobile App Development", desc: "Native & cross-platform apps for iOS and Android", href: "/services/development/mobile-app" },
      { title: "E-commerce Development", desc: "Shopify, WooCommerce & custom e-commerce platforms", href: "/services/development/ecommerce" },
      { title: "Web Application", desc: "SaaS platforms, dashboards & custom web apps", href: "/services/development/web-app" },
      { title: "CMS Development", desc: "WordPress, headless CMS & custom content management", href: "/services/development/cms" },
      { title: "API Integration", desc: "Connect systems, automate data flow & build APIs", href: "/services/development/api" },
      { title: "UI/UX Design", desc: "User research, wireframes, prototypes & design systems", href: "/services/development/ui-ux" },
    ],
    process: ["Discovery & UX Research", "Wireframing & Design", "Development Sprint", "QA & Testing", "Launch & Deploy", "Support & Iterate"],
    tools: ["React", "Next.js", "Node.js", "Flutter", "AWS", "Figma", "Vercel", "Supabase"],
    faqs: [
      { q: "What tech stack do you use?", a: "We're stack-agnostic but specialize in React/Next.js for web, Flutter/React Native for mobile, and Node.js/Python for backends." },
      { q: "Do you offer ongoing maintenance?", a: "Yes — we offer monthly retainer plans for maintenance, updates, and continuous improvement." },
      { q: "How long does a typical project take?", a: "Simple websites: 4-6 weeks. Complex web apps: 8-16 weeks. Mobile apps: 10-20 weeks. We use agile sprints for transparency." },
    ],
    accentClass: "text-emerald-400",
    stats: [{ value: 150, suffix: "+", label: "Projects Delivered" }, { value: 100, suffix: "K+", label: "Users Served" }, { value: 99, suffix: "%", label: "Uptime SLA" }],
    relatedCases: [
      { title: "HealthTech Platform", metric: "50K+ users", industry: "Healthcare" },
      { title: "Mobile Banking App", metric: "100K downloads", industry: "Fintech" },
    ],
  },
  "ai-solutions": {
    title: "AI Solutions",
    tagline: "Intelligence That Transforms. Business That Scales.",
    description: "We help businesses leverage artificial intelligence — from strategy to deployment — turning AI from buzzword into competitive advantage.",
    subServices: [
      { title: "AI Strategy", desc: "Identify high-impact AI use cases for your business", href: "/services/ai-solutions/strategy" },
      { title: "AI Chatbot", desc: "Intelligent conversational agents for support & sales", href: "/services/ai-solutions/chatbot" },
      { title: "Content Generation", desc: "AI-powered content creation workflows at scale", href: "/services/ai-solutions/content-gen" },
      { title: "Predictive Analytics", desc: "Forecast trends, churn, and demand with ML models", href: "/services/ai-solutions/predictive" },
      { title: "Computer Vision", desc: "Image recognition, OCR & visual inspection solutions", href: "/services/ai-solutions/computer-vision" },
      { title: "NLP Solutions", desc: "Text analysis, sentiment detection & language processing", href: "/services/ai-solutions/nlp" },
      { title: "AI Marketing", desc: "AI-optimized ad targeting, personalization & attribution", href: "/services/ai-solutions/marketing" },
    ],
    process: ["AI Readiness Audit", "Use Case Mapping", "Data Preparation", "Model Development", "Testing & Validation", "Deployment & Monitoring"],
    tools: ["OpenAI", "TensorFlow", "PyTorch", "LangChain", "Pinecone", "Hugging Face", "AWS SageMaker", "Google Vertex AI"],
    faqs: [
      { q: "Do we need a lot of data to start?", a: "Not always. Many AI solutions (chatbots, content gen) work out-of-the-box. For predictive analytics, we'll assess your data readiness first." },
      { q: "Is AI too expensive for mid-size businesses?", a: "No — we offer solutions starting from ₹3L/month. The ROI typically pays for itself within the first quarter." },
      { q: "How do you handle data privacy?", a: "All our AI solutions are built with privacy-by-design principles. We comply with GDPR, DPDP Act (India), and regional MENA regulations." },
    ],
    accentClass: "text-amber-400",
    stats: [{ value: 80, suffix: "%", label: "Automation Rate" }, { value: 10, suffix: "x", label: "Content Output" }, { value: 70, suffix: "%", label: "Cost Reduction" }],
    relatedCases: [
      { title: "AI Customer Support", metric: "80% automation", industry: "Fintech" },
      { title: "AI Content Pipeline", metric: "10x content output", industry: "EdTech" },
    ],
  },
  automation: {
    title: "Automation",
    tagline: "Eliminate Manual. Amplify Output.",
    description: "We design and implement automation systems that save hundreds of hours monthly — from marketing workflows to full business process automation.",
    subServices: [
      { title: "Marketing Automation", desc: "Automated campaigns, lead nurturing & scoring", href: "/services/automation/marketing" },
      { title: "Workflow Automation", desc: "Streamline business processes with no-code/low-code tools", href: "/services/automation/workflow" },
      { title: "CRM Automation", desc: "Automate lead management, follow-ups & pipeline tracking", href: "/services/automation/crm" },
      { title: "Sales Automation", desc: "Outreach sequences, proposal automation & deal tracking", href: "/services/automation/sales" },
      { title: "Social Media Automation", desc: "Scheduled posting, auto-replies & social listening", href: "/services/automation/social" },
      { title: "Reporting Automation", desc: "Real-time dashboards and automated report delivery", href: "/services/automation/reporting" },
      { title: "WhatsApp Automation", desc: "Business messaging, chatbots & broadcast automation", href: "/services/automation/whatsapp" },
    ],
    process: ["Process Audit", "Workflow Mapping", "Tool Selection", "Build & Configure", "Testing & Training", "Monitor & Optimize"],
    tools: ["HubSpot", "Zapier", "Make", "n8n", "ActiveCampaign", "Salesforce", "WhatsApp Business API", "Slack API"],
    faqs: [
      { q: "What processes can be automated?", a: "Almost any repetitive task — email follow-ups, lead routing, reporting, social posting, invoice generation, data entry, and more." },
      { q: "Do you use custom code or no-code tools?", a: "Both. We use no-code tools (Zapier, Make) for speed and custom integrations for complex workflows that need more control." },
      { q: "How much time can automation save?", a: "Our clients typically save 100-300+ hours per month. The exact savings depend on the processes automated and team size." },
    ],
    accentClass: "text-orange-400",
    stats: [{ value: 200, suffix: "+", label: "Hours Saved/Mo" }, { value: 300, suffix: "+", label: "Workflows Built" }, { value: 95, suffix: "%", label: "Accuracy Rate" }],
    relatedCases: [
      { title: "CRM Workflow Overhaul", metric: "200hrs saved/mo", industry: "Real Estate" },
      { title: "WhatsApp Commerce Bot", metric: "₹2Cr revenue", industry: "E-commerce" },
    ],
  },
};

export default function ServiceCategory() {
  const { category } = useParams<{ category: string }>();
  const data = categoryData[category || ""];
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });
  const processRef = useRef<HTMLDivElement>(null);
  const processInView = useInView(processRef, { once: true });

  if (!data) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display font-bold text-3xl text-foreground">Service not found</h1>
            <Link to="/" className="text-primary text-sm mt-4 inline-block">← Back to Home</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 relative overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-[15%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[150px] animate-breathe" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className={`text-xs font-mono uppercase tracking-widest ${data.accentClass}`}>{data.title}</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              {data.tagline.split(".")[0]}. <span className="text-gradient">{data.tagline.split(".")[1]?.trim() || ""}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.description}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal">
                <Button size="lg" className="rounded-full px-8 font-display font-bold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20">
                  Get A Proposal →
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="rounded-full px-8 font-display font-semibold border-border/60">Talk to an Expert</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-border/30" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            {data.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="font-mono font-bold text-3xl md:text-4xl text-gradient">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </span>
                <p className="text-xs text-muted-foreground mt-1 font-display">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sub-services ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10">
            Our <span className="text-gradient">{data.title}</span> Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.subServices.map((s, i) => (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  to={s.href}
                  className="group rounded-xl glass border border-border/30 p-6 block hover:border-primary/20 transition-all duration-500 h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Timeline ── */}
      <section className="py-24 bg-card/20 relative overflow-hidden" ref={processRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Our <span className="text-gradient">Process</span>
            </h2>
          </motion.div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            <div className="absolute top-6 left-0 right-0 h-px border-t-2 border-dashed border-border/50" />
            <div className="grid grid-cols-6 gap-4">
              {data.process.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={processInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative text-center pt-12"
                >
                  {/* Ghosted number */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-display font-extrabold text-[48px] text-foreground/[0.04] select-none pointer-events-none leading-none">
                    {i + 1}
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />
                  <p className="text-sm font-display font-medium text-foreground mt-2">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-0">
            {data.process.map((step, i) => (
              <div key={step} className="flex gap-4 relative">
                <div className="absolute left-0 top-0 font-display font-extrabold text-[40px] text-foreground/[0.04] select-none pointer-events-none leading-none -translate-x-2">
                  {i + 1}
                </div>
                <div className="flex flex-col items-center ml-6">
                  <div className="w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />
                  {i < data.process.length - 1 && <div className="w-px h-full border-l-2 border-dashed border-border/50" />}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-display font-medium text-foreground">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="py-16 border-y border-border/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-lg text-foreground mb-6">Tools & Platforms We Use</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {data.tools.map((t) => (
              <span key={t} className="px-4 py-2 rounded-full glass border border-border/30 text-xs font-mono text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Case Studies ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Related <span className="text-gradient">Case Studies</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {data.relatedCases.map((c) => (
              <Link key={c.title} to="/portfolio" className="group rounded-2xl glass border border-border/30 p-6 hover:border-primary/20 transition-all duration-500">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{c.industry}</span>
                <h3 className="font-display font-bold text-lg text-foreground mt-1 group-hover:text-primary transition-colors">{c.title}</h3>
                <span className="font-mono font-bold text-2xl text-gradient mt-2 block">{c.metric}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-card/20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <Accordion type="single" collapsible>
            {data.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                <AccordionTrigger className="font-display text-foreground text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Get Started with <span className="text-gradient">{data.title}</span>?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Let's build a custom strategy tailored to your business goals and market.
          </p>
          <Link to="/get-proposal">
            <Button size="lg" className="rounded-full px-10 font-display font-bold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] hover:opacity-90 text-white shadow-lg shadow-orange-500/20">
              Get Your Free Proposal →
            </Button>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Response within 24hrs</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
