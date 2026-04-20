/**
 * Tier-2/3 keyword landing pages (Phase 6 of SEO master plan).
 *
 * Each entry powers a /lp/{slug} URL. Designed to capture mid-funnel
 * commercial keywords that don't justify a full hub page but deserve a
 * dedicated, conversion-optimised landing page with unique meta + content.
 */
export interface KeywordLandingData {
  slug: string;
  primaryKeyword: string;       // Exact match keyword the page targets
  city?: string;                // Geo modifier when applicable
  metaTitle: string;            // <60 chars
  metaDescription: string;      // <160 chars
  h1: string;
  heroSubhead: string;
  bullets: { title: string; desc: string }[];
  proofPoints: { value: string; label: string }[];
  whyUs: string[];
  faqs: { q: string; a: string }[];
  serviceCategory: string;      // For schema serviceType
  relatedServiceHref: string;   // Internal link back to canonical hub
  cta: string;
}

const keywordLandingPages: KeywordLandingData[] = [
  {
    slug: "seo-agency-bangalore",
    primaryKeyword: "SEO agency Bangalore",
    city: "Bangalore",
    metaTitle: "SEO Agency Bangalore | Rank #1 on Google | Digital Penta",
    metaDescription:
      "Bangalore's top SEO agency. Technical SEO, content & link building for SaaS, tech & e-commerce brands. 300%+ organic growth. Free audit.",
    h1: "SEO Agency in Bangalore That Actually Ranks You #1",
    heroSubhead:
      "We help Bangalore SaaS, tech and D2C brands dominate Google search through technical SEO, topical authority content, and high-quality link building — measured against revenue, not vanity rankings.",
    bullets: [
      { title: "Technical SEO Built for Speed", desc: "Core Web Vitals, schema, crawl budget — engineered for the Indian Googlebot crawl pattern." },
      { title: "Bangalore-Specific Content Engine", desc: "Topical clusters mapped to Bangalore + Karnataka + India search intent across English & regional queries." },
      { title: "DR40+ Backlink Acquisition", desc: "Digital PR, HARO and outreach to Indian publications that move the needle for tech brands." },
      { title: "Local SEO for Multi-Location Brands", desc: "GBP optimisation, citation building and hyper-local landing pages for every Bangalore branch." },
    ],
    proofPoints: [
      { value: "300%+", label: "Avg. organic growth in 12 months" },
      { value: "60+", label: "SaaS & tech clients" },
      { value: "DR70+", label: "Backlinks acquired" },
      { value: "4.9★", label: "Google rating" },
    ],
    whyUs: [
      "Specialists in B2B SaaS and product-led SEO — the dominant Bangalore vertical",
      "In-house content team that understands developer + buyer search intent",
      "Transparent monthly reporting with live ranking, traffic and conversion dashboards",
      "No long-term lock-ins — month-to-month contracts after the 90-day foundation phase",
    ],
    faqs: [
      { q: "How much does an SEO agency in Bangalore cost?", a: "Bangalore SEO retainers typically range from ₹40,000 to ₹3,00,000+/month based on competition and scope. Our packages start at ₹35,000/month with full transparency on what's included." },
      { q: "How long until I see SEO results in Bangalore?", a: "Most clients see ranking movement within 60-90 days. For competitive SaaS keywords, expect 6-9 months to reach page 1, with compounding traffic growth thereafter." },
      { q: "Do you handle SEO for SaaS startups?", a: "Yes — SaaS is a core specialty. We've helped 60+ B2B and B2C SaaS brands build organic acquisition pipelines that scale predictably." },
    ],
    serviceCategory: "SEO",
    relatedServiceHref: "/services/digital-marketing/seo",
    cta: "Get Your Free Bangalore SEO Audit",
  },
  {
    slug: "google-ads-agency-delhi",
    primaryKeyword: "Google Ads agency Delhi",
    city: "Delhi",
    metaTitle: "Google Ads Agency Delhi | Certified PPC Experts | Digital Penta",
    metaDescription:
      "Delhi's #1 Google Ads agency. Search, Shopping, YouTube & Performance Max campaigns. 8x avg ROAS. Google Premier Partner. Free strategy call.",
    h1: "Google Ads Agency in Delhi — Every Rupee Optimised for ROAS",
    heroSubhead:
      "Certified Google Ads specialists managing ₹15Cr+ in annual ad spend across Search, Shopping, YouTube and Performance Max for Delhi-based brands. Average client ROAS: 8.2x.",
    bullets: [
      { title: "Account Restructure & Audit", desc: "We rebuild bloated campaigns from scratch — tight ad groups, conversion-grade tracking, negative keyword hygiene." },
      { title: "Smart Bidding + Manual Hybrid", desc: "AI bidding paired with human strategy for the Indian buyer journey — the highest-ROAS combination today." },
      { title: "Conversion-Grade Landing Pages", desc: "Quality Score lift via in-house landing page builds — paid + organic compounding together." },
      { title: "Weekly Optimisation Sprints", desc: "Bid adjustments, ad copy A/Bs, audience refreshes — every week, with documented changelog." },
    ],
    proofPoints: [
      { value: "8.2x", label: "Avg client ROAS" },
      { value: "₹15Cr+", label: "Ad spend managed/year" },
      { value: "200+", label: "Active campaigns" },
      { value: "47%", label: "Avg CPA reduction" },
    ],
    whyUs: [
      "Google Premier Partner with certified Search, Display, Shopping and Video specialists",
      "Delhi-based account managers — face-to-face strategy reviews when you need them",
      "Performance-based pricing options for qualifying e-commerce brands",
      "Live ROAS dashboard — no waiting for monthly decks to know how you're performing",
    ],
    faqs: [
      { q: "How much should I spend on Google Ads in Delhi?", a: "Minimum effective spend is ₹50,000/month for meaningful learning data. Most Delhi SMBs run ₹1L–₹5L/month, while enterprise accounts go ₹10L+/month." },
      { q: "Do you charge a percentage of ad spend?", a: "We offer two models: flat retainer (₹35K-₹2L/month) or 12-15% of ad spend for accounts above ₹3L/month. The model that costs you less is the model we recommend." },
      { q: "Can you take over an existing Google Ads account?", a: "Yes — we typically run a 14-day audit + restructure on existing accounts. Most see 30-50% CPA reduction within 60 days of takeover." },
    ],
    serviceCategory: "PPC Management",
    relatedServiceHref: "/services/digital-marketing/ppc",
    cta: "Get Your Free Google Ads Audit",
  },
  {
    slug: "whatsapp-marketing-india",
    primaryKeyword: "WhatsApp marketing service India",
    metaTitle: "WhatsApp Marketing India | Business API Experts | Digital Penta",
    metaDescription:
      "WhatsApp Business API setup, broadcasts, chatbots & catalog commerce for Indian brands. 60%+ open rates. Meta Tech Partner. Get started.",
    h1: "WhatsApp Marketing Service for Indian Brands That Actually Sells",
    heroSubhead:
      "From Business API onboarding to AI-powered chatbots, broadcast automation and catalog commerce — we run the full WhatsApp marketing stack for 200+ Indian brands.",
    bullets: [
      { title: "WhatsApp Business API Setup", desc: "End-to-end onboarding through Meta Tech Partners — green tick application, template approvals, opt-in flows." },
      { title: "Broadcast Campaigns That Convert", desc: "Segmented broadcasts with 60-80% open rates and 25%+ click-through — far beyond email." },
      { title: "AI Chatbots & Sales Flows", desc: "24/7 lead qualification, FAQ handling and product discovery flows that close in-app." },
      { title: "Abandoned Cart + Order Updates", desc: "Automated transactional flows that recover 35%+ of abandoned carts and slash support tickets." },
    ],
    proofPoints: [
      { value: "60%+", label: "Avg open rate" },
      { value: "25%+", label: "Avg CTR" },
      { value: "200+", label: "Indian brands served" },
      { value: "35%", label: "Cart recovery rate" },
    ],
    whyUs: [
      "Meta Tech Partner — direct API access without third-party markups",
      "Hindi + English + regional language template libraries pre-approved",
      "Built-in compliance with WhatsApp's strict opt-in and messaging policies",
      "End-to-end: API setup, automation, creative, broadcast and analytics",
    ],
    faqs: [
      { q: "How much does WhatsApp Business API cost in India?", a: "Meta charges per conversation (~₹0.65-₹2.50 depending on category). Our service fee starts at ₹15,000/month including API setup, automation and broadcast management." },
      { q: "How long does WhatsApp API setup take?", a: "API approval typically takes 5-7 business days. Green tick verification adds another 2-3 weeks. We handle the full process including documentation." },
      { q: "Can I send promotional messages on WhatsApp?", a: "Yes — through pre-approved Marketing template messages to opted-in users. We handle template design, approval and the full opt-in collection workflow." },
    ],
    serviceCategory: "WhatsApp Marketing",
    relatedServiceHref: "/services/automation/whatsapp",
    cta: "Get Your WhatsApp Marketing Plan",
  },
  {
    slug: "seo-company-mumbai",
    primaryKeyword: "SEO company Mumbai",
    city: "Mumbai",
    metaTitle: "SEO Company Mumbai | Rank #1 on Google | Digital Penta",
    metaDescription:
      "Mumbai's leading SEO company. Technical SEO, content & DR70+ links for BFSI, e-commerce & D2C brands. 4x organic traffic in 6 months. Free audit.",
    h1: "SEO Company in Mumbai That Drives Revenue, Not Just Rankings",
    heroSubhead:
      "We help Mumbai BFSI, D2C and e-commerce brands win Google through technical SEO, topical authority content and digital PR — measured against pipeline and revenue.",
    bullets: [
      { title: "BFSI-Grade Technical SEO", desc: "Schema, Core Web Vitals and crawl architecture engineered for high-trust verticals." },
      { title: "Mumbai-Centric Content Engine", desc: "Topical clusters mapped to Mumbai + Maharashtra + India intent across English & Hindi queries." },
      { title: "DR70+ Backlink Acquisition", desc: "Digital PR + HARO outreach to top Indian publications — Economic Times, Mint, Inc42 and more." },
      { title: "E-commerce SEO at Scale", desc: "Category, PLP and product schema built for Shopify, Magento and headless stacks." },
    ],
    proofPoints: [
      { value: "4x", label: "Avg organic traffic in 6 months" },
      { value: "70+", label: "Mumbai brands served" },
      { value: "DR70+", label: "Backlinks acquired" },
      { value: "4.9★", label: "Google rating" },
    ],
    whyUs: [
      "Specialists in BFSI, D2C and e-commerce — Mumbai's dominant verticals",
      "In-house writers with finance, fintech and lifestyle category expertise",
      "Live ranking + revenue dashboards — no monthly-deck guesswork",
      "Month-to-month after the 90-day foundation phase, no lock-ins",
    ],
    faqs: [
      { q: "How much does SEO cost in Mumbai?", a: "Mumbai SEO retainers typically range from ₹45,000 to ₹3,50,000+/month based on competition. Our packages start at ₹40,000/month with full transparency." },
      { q: "How long does SEO take in Mumbai?", a: "Most clients see ranking movement within 60-90 days. For competitive BFSI and e-commerce keywords, expect 6-9 months to page 1 with compounding growth thereafter." },
      { q: "Do you serve BFSI clients?", a: "Yes — BFSI is a core specialty. We've worked with NBFCs, fintech startups and insurance brands across Mumbai." },
    ],
    serviceCategory: "SEO",
    relatedServiceHref: "/services/digital-marketing/seo",
    cta: "Get Your Free Mumbai SEO Audit",
  },
  {
    slug: "ppc-agency-delhi",
    primaryKeyword: "PPC agency Delhi",
    city: "Delhi",
    metaTitle: "PPC Agency Delhi | Google & Meta Ads Experts | Digital Penta",
    metaDescription:
      "Delhi's certified PPC agency. Google, Meta, LinkedIn & Performance Max campaigns. 7x avg ROAS. ₹15Cr+ ad spend managed. Free strategy call.",
    h1: "PPC Agency in Delhi — Engineered for ROAS, Not Reach",
    heroSubhead:
      "Certified PPC specialists running Google, Meta, LinkedIn and Performance Max for Delhi B2B and D2C brands. ₹15Cr+ in annual ad spend. 7.4x avg client ROAS.",
    bullets: [
      { title: "Multi-Platform PPC", desc: "Google, Meta, LinkedIn, YouTube and Performance Max — orchestrated under one funnel strategy." },
      { title: "Conversion-Grade Tracking", desc: "GA4 + server-side GTM + offline conversion uploads. Every rupee attributed accurately." },
      { title: "Landing Page Builds Included", desc: "In-house LP builds lift Quality Score and CVR — no external agency handoffs." },
      { title: "Weekly Optimisation Sprints", desc: "Bid adjustments, creative refreshes, audience tests — every week, with a documented changelog." },
    ],
    proofPoints: [
      { value: "7.4x", label: "Avg client ROAS" },
      { value: "₹15Cr+", label: "Ad spend managed/year" },
      { value: "180+", label: "Active campaigns" },
      { value: "42%", label: "Avg CPA reduction" },
    ],
    whyUs: [
      "Google Premier Partner + Meta Business Partner — top-tier platform access",
      "Delhi-based account leads — face-to-face strategy when you need it",
      "Performance-based pricing options for qualifying e-commerce brands",
      "Live ROAS dashboard — never wait for a monthly deck again",
    ],
    faqs: [
      { q: "What is the minimum PPC budget in Delhi?", a: "We recommend ₹50,000/month minimum to gather meaningful conversion data. Most Delhi SMBs run ₹1L–₹5L/month, enterprise accounts ₹10L+/month." },
      { q: "Do you charge a percentage of ad spend?", a: "Two models: flat retainer (₹40K-₹2L/month) or 12-15% of ad spend for accounts above ₹3L/month. We recommend whichever costs you less." },
      { q: "Can you take over an existing account?", a: "Yes — we run a 14-day audit + restructure on existing accounts. Most see 30-50% CPA reduction within 60 days of takeover." },
    ],
    serviceCategory: "PPC Management",
    relatedServiceHref: "/services/digital-marketing/ppc",
    cta: "Get Your Free PPC Audit",
  },
  {
    slug: "social-media-marketing-agency-delhi",
    primaryKeyword: "social media marketing agency Delhi",
    city: "Delhi",
    metaTitle: "Social Media Marketing Agency Delhi | Digital Penta",
    metaDescription:
      "Delhi's top social media marketing agency. Instagram, LinkedIn, YouTube & Meta Ads. Content + community + paid. 100M+ impressions delivered.",
    h1: "Social Media Marketing Agency in Delhi That Drives Real Business Outcomes",
    heroSubhead:
      "Strategy, content, community management and paid social — fully integrated for Delhi D2C, lifestyle and B2B brands. 100M+ organic impressions delivered for our clients.",
    bullets: [
      { title: "Always-On Content Engine", desc: "Reels, carousels, shorts and long-form — produced weekly by an in-house creative pod." },
      { title: "Paid Social at Scale", desc: "Meta, LinkedIn, YouTube, X — managed against ROAS, not just CPM." },
      { title: "Community + Reputation Management", desc: "DMs, comments, reviews answered within 2 hours, every day of the week." },
      { title: "Influencer Activations", desc: "Tier-1 to nano influencer campaigns — sourced, briefed and tracked end-to-end." },
    ],
    proofPoints: [
      { value: "100M+", label: "Impressions delivered" },
      { value: "120+", label: "Brands served" },
      { value: "2hr", label: "Avg DM response time" },
      { value: "4.9★", label: "Google rating" },
    ],
    whyUs: [
      "Full-funnel social — content, community, paid and influencer under one roof",
      "Delhi-based creative team — local cultural fluency for the Indian audience",
      "Monthly content calendar approved 30 days in advance — no last-minute scrambles",
      "Transparent reporting on reach, engagement, leads and revenue",
    ],
    faqs: [
      { q: "How much does a social media agency cost in Delhi?", a: "Delhi social retainers typically range from ₹35,000 to ₹3,00,000/month based on platforms and content volume. Our packages start at ₹35,000/month." },
      { q: "Which platforms do you manage?", a: "Instagram, Facebook, LinkedIn, YouTube, X (Twitter), Pinterest and Threads. We pick the 2-4 platforms that match your audience and budget." },
      { q: "Do you create the content too?", a: "Yes — full content production: shoots, design, copy, video editing and reels. You approve, we execute." },
    ],
    serviceCategory: "Social Media Marketing",
    relatedServiceHref: "/services/digital-marketing/social-media",
    cta: "Get Your Social Media Plan",
  },
  {
    slug: "content-marketing-agency-india",
    primaryKeyword: "content marketing agency India",
    metaTitle: "Content Marketing Agency India | SEO Content That Ranks",
    metaDescription:
      "India's top content marketing agency. SEO blogs, thought leadership, video & email. 1000+ articles published. 5x avg organic traffic lift.",
    h1: "Content Marketing Agency in India That Compounds Organic Growth",
    heroSubhead:
      "Strategy-led content for Indian SaaS, B2B and D2C brands — SEO blogs, thought leadership, video and email. 1,000+ articles published. 5x avg traffic lift.",
    bullets: [
      { title: "Topical Authority Strategy", desc: "Pillar + cluster content maps engineered for Google's helpful-content era." },
      { title: "In-House Editorial Team", desc: "Trained writers with finance, SaaS, healthcare and lifestyle expertise — no random freelancers." },
      { title: "SEO + AEO Optimised", desc: "Every piece optimised for Google, ChatGPT, Perplexity and Gemini answer engines." },
      { title: "Distribution Built In", desc: "LinkedIn carousels, newsletter, email nurtures — content that travels, not just ranks." },
    ],
    proofPoints: [
      { value: "1,000+", label: "Articles published" },
      { value: "5x", label: "Avg traffic lift in 9 months" },
      { value: "60+", label: "Active content clients" },
      { value: "4.9★", label: "Google rating" },
    ],
    whyUs: [
      "Editorial-grade quality — fact-checked, expert-reviewed, original research baked in",
      "AI + human workflow — speed of AI, voice and accuracy of senior editors",
      "Content briefs before drafts — no surprises, no rewrites, predictable cycles",
      "Distribution + reporting included — we measure traffic, leads and pipeline, not just word count",
    ],
    faqs: [
      { q: "How much does content marketing cost in India?", a: "Content retainers range from ₹40,000 to ₹3,00,000/month based on volume and complexity. Our standard package (8-12 SEO articles + 4 LinkedIn carousels/month) starts at ₹50,000/month." },
      { q: "Do you do thought leadership ghostwriting?", a: "Yes — we ghostwrite executive thought leadership for LinkedIn, blogs and industry publications. Voice intake interviews ensure it sounds like you." },
      { q: "How long until content drives traffic?", a: "First ranking signals appear in 60-90 days. Compounding traffic typically kicks in around month 6-9, then accelerates from there." },
    ],
    serviceCategory: "Content Marketing",
    relatedServiceHref: "/services/digital-marketing/content",
    cta: "Get Your Content Strategy",
  },
  {
    slug: "ai-chatbot-development-india",
    primaryKeyword: "AI chatbot development India",
    metaTitle: "AI Chatbot Development India | GPT, RAG & WhatsApp Bots",
    metaDescription:
      "India's AI chatbot development experts. GPT-4, Claude, RAG, WhatsApp & web bots. Sales, support & lead-gen automation. Free PoC available.",
    h1: "AI Chatbot Development in India — Sales, Support & Lead-Gen on Autopilot",
    heroSubhead:
      "Custom AI chatbots built on GPT-4, Claude and Gemini — deployed on WhatsApp, websites, Instagram and CRM. RAG, fine-tuning, multilingual — all in-house.",
    bullets: [
      { title: "RAG Knowledge Base", desc: "Bots that answer accurately from your docs, PDFs, website and CRM — no hallucinations." },
      { title: "Multi-Channel Deployment", desc: "WhatsApp Business API, web widget, Instagram DM, Messenger, Slack — same brain, every channel." },
      { title: "CRM + Calendar Integration", desc: "Bots that qualify leads, book meetings and push to HubSpot, Salesforce or Zoho automatically." },
      { title: "Hindi + English + Regional", desc: "Multilingual bots that handle Hinglish naturally — built for the Indian customer." },
    ],
    proofPoints: [
      { value: "50+", label: "Bots deployed" },
      { value: "70%", label: "Avg query auto-resolution" },
      { value: "24/7", label: "Lead capture coverage" },
      { value: "4.9★", label: "Google rating" },
    ],
    whyUs: [
      "Engineering-led — RAG pipelines, vector databases and evals built properly, not just prompted",
      "WhatsApp Business API specialists — Meta Tech Partner status",
      "Free PoC — we'll build a working prototype on your data before you commit",
      "Ongoing optimisation — monthly retraining, eval reports and prompt iteration",
    ],
    faqs: [
      { q: "How much does an AI chatbot cost in India?", a: "Custom AI chatbots range from ₹1.5L (PoC) to ₹15L+ (enterprise multi-channel). Most SMBs invest ₹3L-₹6L for a production-grade bot with monthly maintenance from ₹25K." },
      { q: "Which LLM do you use?", a: "We pick based on your use case — GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro or open-source Llama for cost-sensitive deployments. Always benchmarked on your real data." },
      { q: "Can it integrate with our existing CRM?", a: "Yes — HubSpot, Salesforce, Zoho, Freshworks, custom APIs. We handle the integration, auth and data sync end-to-end." },
    ],
    serviceCategory: "AI Solutions",
    relatedServiceHref: "/services/ai-solutions/chatbot",
    cta: "Get Your Free Chatbot PoC",
  },
  {
    slug: "ecommerce-seo-agency-india",
    primaryKeyword: "ecommerce SEO agency India",
    metaTitle: "Ecommerce SEO Agency India | Shopify, Magento, WooCommerce",
    metaDescription:
      "India's ecommerce SEO specialists. Shopify, Magento, WooCommerce & headless. Category, product & PLP optimisation. 6x organic revenue.",
    h1: "Ecommerce SEO Agency in India That Grows Organic Revenue, Not Just Traffic",
    heroSubhead:
      "Specialised ecommerce SEO for Indian D2C, marketplace and B2C brands on Shopify, Magento, WooCommerce and headless stacks. 6x avg organic revenue lift.",
    bullets: [
      { title: "Category & PLP Optimisation", desc: "Schema, internal linking and intent-mapped category pages — the highest-leverage ecommerce SEO play." },
      { title: "Product Page SEO at Scale", desc: "Programmatic title, description and schema templates that handle 10K+ SKUs cleanly." },
      { title: "Site Architecture & Crawl", desc: "Faceted nav, canonical hygiene, pagination and crawl-budget engineering for large catalogs." },
      { title: "Conversion-Linked Reporting", desc: "Organic revenue, AOV and assisted conversions — not just rankings." },
    ],
    proofPoints: [
      { value: "6x", label: "Avg organic revenue lift" },
      { value: "40+", label: "Ecom brands served" },
      { value: "10K+", label: "SKUs optimised" },
      { value: "4.9★", label: "Google rating" },
    ],
    whyUs: [
      "Platform specialists — Shopify Plus, Magento 2, WooCommerce, Shopware and headless (Next.js Commerce)",
      "Schema + structured data baked in — products, reviews, FAQs, breadcrumbs, organisation",
      "Conversion-grade reporting tied to GA4, Shopify Analytics and revenue, not vanity rankings",
      "Migration-safe — we move ecom sites to new platforms without losing organic revenue",
    ],
    faqs: [
      { q: "How much does ecommerce SEO cost in India?", a: "Ecom SEO retainers range from ₹50,000 to ₹4,00,000/month based on catalog size and competition. Our packages start at ₹50,000/month for sub-1K SKU stores." },
      { q: "Do you handle Shopify migrations?", a: "Yes — we run migration-safe SEO for moves to Shopify, Magento, WooCommerce or headless. Zero organic-revenue loss is the standard target." },
      { q: "How long until ecom SEO drives revenue?", a: "First ranking gains in 60-90 days. Material organic-revenue lift typically kicks in around month 5-7, compounding from there." },
    ],
    serviceCategory: "Ecommerce SEO",
    relatedServiceHref: "/services/digital-marketing/seo",
    cta: "Get Your Free Ecom SEO Audit",
  },
  {
    slug: "performance-marketing-agency-india",
    primaryKeyword: "performance marketing agency India",
    metaTitle: "Performance Marketing Agency India | ROAS-First Growth",
    metaDescription:
      "India's top performance marketing agency. Google, Meta, LinkedIn, programmatic + CRO. ₹25Cr+ managed. 6.8x ROAS. Pay for results.",
    h1: "Performance Marketing Agency in India — Built for ROAS, Not Vanity",
    heroSubhead:
      "Full-funnel performance marketing for Indian D2C, SaaS and BFSI brands. Google, Meta, LinkedIn, programmatic + landing-page CRO. ₹25Cr+ managed. 6.8x avg ROAS.",
    bullets: [
      { title: "Full-Funnel Paid Media", desc: "Awareness, consideration, conversion and retention — orchestrated across Google, Meta, LinkedIn and programmatic." },
      { title: "Creative + LP Studio In-House", desc: "Static, video and motion ad creative + landing pages — produced weekly under one roof." },
      { title: "Server-Side Tracking", desc: "GA4 + GTM SS + offline conversions + Enhanced Conversions — accurate attribution post-iOS14." },
      { title: "Weekly CRO Sprints", desc: "Hypothesis-driven A/B tests on landing pages, ad copy and offers — compounding ROAS month over month." },
    ],
    proofPoints: [
      { value: "6.8x", label: "Avg client ROAS" },
      { value: "₹25Cr+", label: "Managed ad spend/year" },
      { value: "150+", label: "Brands scaled" },
      { value: "38%", label: "Avg CPA reduction" },
    ],
    whyUs: [
      "Performance-only DNA — we win or lose with you, no vanity-metric reporting",
      "Creative + LP + media buying under one roof — no agency-handoff slowdowns",
      "Performance-based pricing for qualifying e-commerce brands",
      "Live ROAS, CAC and LTV dashboards — always-on visibility",
    ],
    faqs: [
      { q: "What is performance marketing?", a: "Performance marketing is paid media where every rupee is measured against a business outcome — leads, sales, revenue or ROAS — not impressions or clicks." },
      { q: "How much should I spend?", a: "Minimum ₹1L/month to gather statistically valid data. D2C brands typically scale to ₹5L-₹50L/month once unit economics are proven." },
      { q: "Do you offer performance-based pricing?", a: "Yes — for qualifying e-commerce and lead-gen accounts above ₹5L/month spend. We share upside in exchange for skin-in-the-game pricing." },
    ],
    serviceCategory: "Performance Marketing",
    relatedServiceHref: "/services/digital-marketing/performance",
    cta: "Get Your Free Performance Audit",
  },
];

export function getKeywordLanding(slug: string): KeywordLandingData | undefined {
  return keywordLandingPages.find(p => p.slug === slug);
}

export function getAllKeywordLandings(): KeywordLandingData[] {
  return keywordLandingPages;
}
