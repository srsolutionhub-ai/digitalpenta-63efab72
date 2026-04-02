export interface IndustryData {
  title: string;
  tagline: string;
  description: string;
  challenges: string[];
  services: { title: string; desc: string; href: string }[];
  caseStudy: { title: string; metric: string; metricLabel: string; desc: string };
  metaTitle: string;
  metaDescription: string;
}

export const industryData: Record<string, IndustryData> = {
  "real-estate": {
    title: "Real Estate",
    tagline: "Digital Strategies That Sell Properties Faster",
    description: "From lead generation to virtual tours and CRM automation — we help real estate developers and agencies dominate their market digitally.",
    challenges: ["High competition for leads", "Long sales cycles", "Poor lead quality from generic campaigns", "Lack of digital presence in MENA markets", "Inefficient manual follow-up processes"],
    services: [
      { title: "SEO & Local Search", desc: "Rank #1 for property searches in your target cities", href: "/services/digital-marketing/seo" },
      { title: "PPC for Real Estate", desc: "High-intent lead generation via Google & Meta Ads", href: "/services/digital-marketing/ppc" },
      { title: "Website Development", desc: "Property listing platforms with IDX integration", href: "/services/development/website" },
      { title: "CRM Automation", desc: "Automated lead nurturing and follow-up sequences", href: "/services/automation/crm" },
      { title: "AI Chatbot", desc: "24/7 property inquiry handling and lead qualification", href: "/services/ai-solutions/chatbot" },
      { title: "Social Media", desc: "Instagram & Facebook campaigns showcasing properties", href: "/services/digital-marketing/social-media" },
    ],
    caseStudy: { title: "PropTech Leader", metric: "340%", metricLabel: "Lead increase in 6 months", desc: "Combined SEO, PPC, and CRM automation to transform a Delhi-based property developer's digital pipeline." },
    metaTitle: "Real Estate Digital Marketing Agency | Digital Penta",
    metaDescription: "Drive property sales with integrated digital marketing, website development, and AI-powered CRM automation for real estate companies in India & Middle East.",
  },
  "healthcare": {
    title: "Healthcare",
    tagline: "Patient Acquisition Through Digital Excellence",
    description: "HIPAA-aware digital strategies for hospitals, clinics, healthtech, and pharmaceutical companies across India and the Middle East.",
    challenges: ["Patient acquisition in competitive markets", "Compliance and privacy regulations", "Building trust online", "Managing online reputation", "Scaling multi-location presence"],
    services: [
      { title: "Healthcare SEO", desc: "Rank for medical terms and local health queries", href: "/services/digital-marketing/seo" },
      { title: "Reputation Management", desc: "Monitor and improve patient reviews and ratings", href: "/services/public-relations/brand-reputation" },
      { title: "Patient Portal Development", desc: "HIPAA-compliant portals and booking systems", href: "/services/development/web-app" },
      { title: "AI Symptom Checker", desc: "Intelligent triage chatbots for initial assessment", href: "/services/ai-solutions/chatbot" },
      { title: "Content Marketing", desc: "Authority-building health content for SEO & trust", href: "/services/digital-marketing/content" },
      { title: "Marketing Automation", desc: "Patient journey automation and appointment reminders", href: "/services/automation/marketing" },
    ],
    caseStudy: { title: "Healthcare SaaS", metric: "₹12Cr", metricLabel: "Revenue generated in Year 1", desc: "Full-stack digital strategy including development, marketing, and PR for a healthtech platform." },
    metaTitle: "Healthcare Digital Marketing Agency | Digital Penta",
    metaDescription: "Digital marketing, web development, and AI solutions for healthcare organizations. HIPAA-aware strategies for hospitals and clinics in India & MENA.",
  },
  "education": {
    title: "Education",
    tagline: "Enrollment Growth Through Smart Digital Strategy",
    description: "We help universities, ed-tech startups, and training institutes attract and enroll students using integrated digital marketing and technology.",
    challenges: ["Seasonal enrollment cycles", "High competition from online courses", "Building brand trust", "International student recruitment", "Low digital maturity"],
    services: [
      { title: "Student Acquisition PPC", desc: "Google & Meta campaigns targeting prospective students", href: "/services/digital-marketing/ppc" },
      { title: "Website & Portal", desc: "Enrollment portals with application workflow", href: "/services/development/website" },
      { title: "Content & Thought Leadership", desc: "Blog, video, and podcast content for authority", href: "/services/digital-marketing/content" },
      { title: "Social Media Marketing", desc: "Instagram, LinkedIn & YouTube for student engagement", href: "/services/digital-marketing/social-media" },
      { title: "AI-Powered Advising", desc: "Chatbots that guide prospective students through programs", href: "/services/ai-solutions/chatbot" },
      { title: "Email Automation", desc: "Drip campaigns for inquiry to enrollment conversion", href: "/services/automation/marketing" },
    ],
    caseStudy: { title: "EduLearn Platform", metric: "5x", metricLabel: "Enrollment growth in 12 months", desc: "Comprehensive digital strategy that transformed an Indian ed-tech company's student acquisition pipeline." },
    metaTitle: "Education Digital Marketing Agency | Digital Penta",
    metaDescription: "Grow student enrollment with integrated digital marketing, web portals, and AI chatbots for universities and ed-tech companies.",
  },
  "ecommerce": {
    title: "E-commerce",
    tagline: "Scale Revenue With Data-Driven Commerce",
    description: "From Shopify stores to enterprise e-commerce platforms — we build, market, and optimize online shopping experiences that convert.",
    challenges: ["High customer acquisition costs", "Cart abandonment", "Scaling across markets", "Inventory and fulfillment complexity", "Standing out in crowded marketplaces"],
    services: [
      { title: "E-commerce Development", desc: "Shopify, WooCommerce & custom platform builds", href: "/services/development/ecommerce" },
      { title: "Performance Marketing", desc: "ROAS-focused campaigns across all ad platforms", href: "/services/digital-marketing/performance" },
      { title: "SEO for E-commerce", desc: "Product page optimization and category structure", href: "/services/digital-marketing/seo" },
      { title: "WhatsApp Commerce", desc: "Automated product catalogs and order management", href: "/services/automation/whatsapp" },
      { title: "AI Personalization", desc: "Product recommendations and dynamic pricing", href: "/services/ai-solutions/marketing" },
      { title: "Influencer Marketing", desc: "Drive sales through authentic creator partnerships", href: "/services/digital-marketing/influencer" },
    ],
    caseStudy: { title: "D2C Fashion Brand", metric: "8.2x", metricLabel: "ROAS across channels", desc: "Social media, influencer marketing, and performance campaigns that scaled a fashion brand's revenue 10x." },
    metaTitle: "E-commerce Marketing Agency | Digital Penta",
    metaDescription: "Grow your online store with performance marketing, Shopify development, and AI-powered personalization. E-commerce experts for India & MENA.",
  },
  "finance": {
    title: "Finance",
    tagline: "Trust-Building Digital Strategies for Financial Services",
    description: "We help banks, fintech, insurance, and investment firms build digital trust and acquire customers in regulated markets.",
    challenges: ["Regulatory compliance", "Building digital trust", "High competition for financial keywords", "Complex product explanation", "Security concerns"],
    services: [
      { title: "Financial SEO", desc: "YMYL-optimized content strategy for financial services", href: "/services/digital-marketing/seo" },
      { title: "Fintech App Development", desc: "Secure mobile and web apps for financial products", href: "/services/development/mobile-app" },
      { title: "PR & Thought Leadership", desc: "Position executives as financial industry authorities", href: "/services/public-relations/thought-leadership" },
      { title: "AI Risk Assessment", desc: "Predictive models for credit scoring and risk analysis", href: "/services/ai-solutions/predictive" },
      { title: "Content Marketing", desc: "Educational content that builds trust and drives leads", href: "/services/digital-marketing/content" },
      { title: "CRM Automation", desc: "Lead nurturing workflows for complex financial products", href: "/services/automation/crm" },
    ],
    caseStudy: { title: "Fintech Startup", metric: "50K+", metricLabel: "App downloads in 3 months", desc: "App development, AI chatbot, and marketing automation that launched a fintech app to market." },
    metaTitle: "Financial Services Marketing Agency | Digital Penta",
    metaDescription: "Digital marketing, app development, and AI solutions for banks, fintech, and insurance companies. Compliance-aware strategies for India & MENA.",
  },
  "hospitality": {
    title: "Hospitality",
    tagline: "Fill Rooms & Tables Through Digital Innovation",
    description: "We help hotels, restaurants, and travel companies maximize bookings and build unforgettable brand experiences online.",
    challenges: ["Seasonal demand fluctuations", "OTA dependency", "Review management", "Local market competition", "Multi-location management"],
    services: [
      { title: "Local SEO & Maps", desc: "Dominate local search for hotels and restaurants", href: "/services/digital-marketing/seo" },
      { title: "Social Media & Influencer", desc: "Visual storytelling that inspires bookings", href: "/services/digital-marketing/social-media" },
      { title: "Booking Platform", desc: "Direct booking websites with payment integration", href: "/services/development/ecommerce" },
      { title: "Reputation Management", desc: "Automated review monitoring and response", href: "/services/public-relations/brand-reputation" },
      { title: "WhatsApp Concierge", desc: "AI-powered guest communication and booking", href: "/services/automation/whatsapp" },
      { title: "Performance Ads", desc: "Targeted campaigns for seasonal promotions", href: "/services/digital-marketing/performance" },
    ],
    caseStudy: { title: "Luxury Hotel Chain", metric: "65%", metricLabel: "Direct booking increase", desc: "SEO, direct booking platform, and social media strategy that reduced OTA dependency for a Dubai hotel group." },
    metaTitle: "Hospitality Digital Marketing Agency | Digital Penta",
    metaDescription: "Drive direct bookings with SEO, social media, and booking platform development for hotels and restaurants in India & Middle East.",
  },
  "saas": {
    title: "SaaS",
    tagline: "Growth Marketing for Software Companies",
    description: "We help SaaS companies at every stage — from MVP launch to Series B growth — with product-led marketing, development, and AI-powered analytics.",
    challenges: ["High customer acquisition costs", "Churn reduction", "Product-market fit messaging", "Scaling MRR", "Competitive differentiation"],
    services: [
      { title: "SaaS SEO", desc: "Bottom-of-funnel content strategy for high-intent keywords", href: "/services/digital-marketing/seo" },
      { title: "Product Development", desc: "Web app development with SaaS-specific architecture", href: "/services/development/web-app" },
      { title: "Content Marketing", desc: "Case studies, guides, and comparison content", href: "/services/digital-marketing/content" },
      { title: "AI Analytics", desc: "Predictive churn models and usage analytics", href: "/services/ai-solutions/predictive" },
      { title: "Marketing Automation", desc: "Trial-to-paid conversion workflows", href: "/services/automation/marketing" },
      { title: "PR & Launch Strategy", desc: "Product launch PR and media outreach", href: "/services/public-relations/media-relations" },
    ],
    caseStudy: { title: "HealthTech SaaS", metric: "3x", metricLabel: "MRR growth in 6 months", desc: "Content marketing, product development, and automation that tripled monthly recurring revenue." },
    metaTitle: "SaaS Marketing Agency | Digital Penta",
    metaDescription: "Growth marketing, product development, and AI analytics for SaaS companies. Drive MRR with integrated digital strategies.",
  },
};

export function getIndustryData(slug: string): IndustryData | undefined {
  return industryData[slug];
}
