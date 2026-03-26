import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categoryData: Record<string, {
  title: string; tagline: string; description: string;
  subServices: { title: string; desc: string; href: string }[];
  process: string[];
  tools: string[];
  faqs: { q: string; a: string }[];
  accentClass: string;
}> = {
  "digital-marketing": {
    title: "Digital Marketing",
    tagline: "Data-Driven Growth, Measurable Results",
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
  },
  "ai-solutions": {
    title: "AI Solutions",
    tagline: "Intelligence That Transforms Business",
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
  },
};

export default function ServiceCategory() {
  const { category } = useParams<{ category: string }>();
  const data = categoryData[category || ""];

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
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className={`text-xs font-mono uppercase tracking-widest ${data.accentClass}`}>{data.title}</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              {data.tagline.split(".")[0]}. <span className="text-gradient">{data.tagline.split(".")[1] || ""}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{data.description}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/get-proposal">
                <Button className="rounded-full px-8 font-display font-semibold">Get A Proposal</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="rounded-full px-8 font-display font-semibold border-border/60">Talk to an Expert</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10">
            Our <span className="text-gradient">{data.title}</span> Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.subServices.map(s => (
              <Link
                key={s.href}
                to={s.href}
                className="group rounded-xl glass glass-hover glow-border p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Our <span className="text-gradient">Process</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.process.map((step, i) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="font-mono text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm font-display font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-lg text-foreground mb-6">Tools & Platforms We Use</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {data.tools.map(t => (
              <span key={t} className="px-4 py-2 rounded-full glass text-xs font-mono text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
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

      {/* CTA */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Get Started with <span className="text-gradient">{data.title}</span>?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Let's build a custom strategy tailored to your business goals and market.
          </p>
          <Link to="/get-proposal">
            <Button size="lg" className="rounded-full px-10 font-display font-semibold">
              Get Your Free Proposal →
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
