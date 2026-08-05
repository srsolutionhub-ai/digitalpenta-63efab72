/**
 * City depth layer — Phase "authority consolidation" of the GSC recovery plan.
 *
 * Search Console showed ~14.4k impressions at avg position ~53 across the
 * programmatic city matrix: Google understands the relevance but doesn't see
 * enough depth to rank the pages on page 1. These records add genuinely unique,
 * verifiable local substance (market context, business districts, budget
 * benchmarks, locally-phrased FAQs) to the highest-impression cities only.
 *
 * Rules for this file:
 *  - No invented results, testimonials, ratings or client names.
 *  - Claims are about our process/market context, not fabricated outcomes.
 *  - Every city entry must be materially different from the others.
 */

export interface CityDepth {
  slug: string;
  /** Local market narrative — 2 unique paragraphs. */
  marketNotes: string[];
  /** Business districts / micro-markets we target for local pack + hyperlocal SEO. */
  districts: string[];
  /** Realistic monthly budget benchmarks by channel for this market. */
  budgets: { channel: string; range: string; note: string }[];
  /** Competitive reality of the local SERP — what it takes to rank here. */
  serpReality: string;
  /** City-specific FAQs (long-tail question capture + AEO). */
  faqs: { q: string; a: string }[];
}

const CITY_DEPTH: CityDepth[] = [
  {
    slug: "mumbai",
    marketNotes: [
      "Mumbai is India's most expensive paid-media market: BFSI, real estate and D2C brands bid against each other in the same auctions, so CPCs on high-intent finance and property keywords routinely sit 2–3× the national average. Winning here is rarely about raising budget — it's about tightening match types, negative lists and landing-page relevance until the auction stops overcharging you.",
      "Because inventory is fragmented across Andheri-to-Lower Parel corporates, Navi Mumbai manufacturing and Thane retail, we split Mumbai campaigns geographically rather than running one city-wide account. Each cluster gets its own budget, ad copy and call-tracking number so you can see which part of the city actually produces qualified enquiries.",
    ],
    districts: ["Bandra Kurla Complex", "Lower Parel", "Andheri East", "Powai", "Navi Mumbai", "Thane"],
    budgets: [
      { channel: "SEO", range: "₹45,000 – ₹1,50,000/mo", note: "Competitive commercial terms need sustained content + link velocity." },
      { channel: "Google Ads", range: "₹1,00,000+/mo ad spend", note: "Below this, high-CPC BFSI/real-estate auctions don't gather enough data." },
      { channel: "Meta / Social", range: "₹40,000 – ₹2,00,000/mo", note: "Creative volume matters more than targeting in a saturated feed." },
    ],
    serpReality:
      "Page-one results for Mumbai service queries are dominated by aggregator directories and legacy agencies with 10+ years of links. We compete by owning the specific query (service + micro-market + industry) rather than the generic city term, then expanding upward.",
    faqs: [
      {
        q: "How much should a Mumbai business budget for digital marketing per month?",
        a: "For a services or B2B brand in Mumbai, a workable starting point is ₹1,50,000–₹2,50,000/month combined — roughly ₹45,000–₹75,000 for retained SEO/content and the remainder in paid media. E-commerce and real estate typically need more paid budget because auction competition in Mumbai is the highest in India.",
      },
      {
        q: "Do you work with Mumbai clients in person?",
        a: "Yes. Strategy, reporting and creative reviews can run on-site across BKC, Lower Parel, Andheri and Navi Mumbai, with day-to-day execution handled by the delivery pod remotely.",
      },
      {
        q: "Why are my Mumbai Google Ads leads so expensive?",
        a: "Usually three causes: broad match with a thin negative list, a single city-wide campaign hiding poor-performing pin codes, and landing pages that don't mirror the ad's promise. Our first 30 days in Mumbai accounts are almost always spent on those three items before any budget increase.",
      },
    ],
  },
  {
    slug: "bangalore",
    marketNotes: [
      "Bangalore buyers are the most research-heavy in India. SaaS, fintech and deep-tech decision-makers compare four to six vendors, read documentation-style content and rarely convert on a first visit — so the winning play is depth: comparison pages, technical explainers and product-led content that survives scrutiny, not brochure copy.",
      "We run Bangalore accounts as pipeline programmes rather than lead programmes: enquiries are scored against ICP fit, then measured through to qualified opportunity. That matters in a market where a cheap MQL from a bootcamp audience can look great in the dashboard and never reach sales.",
    ],
    districts: ["Koramangala", "Indiranagar", "Whitefield", "Electronic City", "HSR Layout", "Outer Ring Road"],
    budgets: [
      { channel: "SEO / Content", range: "₹50,000 – ₹1,75,000/mo", note: "Technical + comparison content is the primary lever for SaaS SERPs." },
      { channel: "Google Ads", range: "₹75,000+/mo ad spend", note: "Bottom-funnel software terms carry high CPCs but convert." },
      { channel: "LinkedIn / ABM", range: "₹60,000 – ₹3,00,000/mo", note: "Best channel for enterprise ORR/Whitefield accounts." },
    ],
    serpReality:
      "Bangalore SERPs reward documentation and comparison content. Generic 'best agency in Bangalore' pages get outranked by pages that actually answer the buyer's evaluation question, which is why every Bangalore engagement starts with a content-gap analysis against the four vendors you're compared to.",
    faqs: [
      {
        q: "Do you specialise in SaaS and B2B tech marketing in Bangalore?",
        a: "Yes — the majority of our Bangalore work is B2B SaaS and tech-enabled services, covering technical SEO, comparison/alternative content, Google Ads for bottom-funnel software intent, and LinkedIn ABM for enterprise accounts along Outer Ring Road and Whitefield.",
      },
      {
        q: "How long does SEO take to work for a Bangalore SaaS company?",
        a: "Expect early long-tail movement in 8–12 weeks and meaningful commercial keyword gains between months 4 and 7, assuming publishing cadence holds. Product-led and comparison pages usually rank faster than category pages because competition on them is thinner.",
      },
      {
        q: "Can you report on pipeline instead of just leads?",
        a: "Yes. We connect form and call data to your CRM stages so reporting shows qualified opportunity and closed-won contribution by channel, not only cost per lead.",
      },
    ],
  },
  {
    slug: "delhi",
    marketNotes: [
      "Delhi NCR is a volume market with extreme quality variance: the same campaign can deliver 400 enquiries where only 40 are real buyers. Our Delhi accounts therefore lead with qualification — form logic, WhatsApp pre-screening and call scoring — so your sales team spends its day on the 10% that matter.",
      "Because buyers move between Delhi, Noida and Gurgaon, we treat NCR as three linked micro-markets with separate keyword sets and separate landing pages. That prevents the common failure where a single 'Delhi' page cannibalises the Noida and Gurgaon terms it should support.",
    ],
    districts: ["Connaught Place", "Nehru Place", "Saket", "Okhla", "Dwarka", "Rohini"],
    budgets: [
      { channel: "SEO", range: "₹35,000 – ₹1,25,000/mo", note: "Local pack + NCR micro-market pages are the fastest wins." },
      { channel: "Google Ads", range: "₹60,000+/mo ad spend", note: "Lead quality controls matter more than volume in NCR." },
      { channel: "WhatsApp / Automation", range: "₹20,000 – ₹60,000/mo", note: "Pre-screening cuts junk enquiries before they reach sales." },
    ],
    serpReality:
      "Delhi's local pack is the real battleground — most commercial clicks go to the map results, not the classic ten. Google Business Profile optimisation, review velocity and NCR-specific service pages usually outperform chasing the generic city keyword.",
    faqs: [
      {
        q: "Are you a Delhi-based digital marketing agency?",
        a: "Yes — our headquarters is in Delhi and NCR clients get in-person strategy and review sessions across Delhi, Noida and Gurgaon. Call +91-88601-00039 to arrange a visit.",
      },
      {
        q: "How do you improve lead quality for Delhi campaigns?",
        a: "Three layers: qualifying questions in the form, WhatsApp or call pre-screening before a sales handoff, and negative-keyword plus placement exclusions that strip out job-seeker, student and price-shopper traffic.",
      },
      {
        q: "Should I run one NCR campaign or separate Delhi, Noida and Gurgaon campaigns?",
        a: "Separate. Search volume, CPCs and buyer profiles differ enough that a single NCR campaign hides which sub-market is profitable. We split budgets and landing pages, then consolidate reporting.",
      },
    ],
  },
  {
    slug: "gurgaon",
    marketNotes: [
      "Gurgaon (Gurugram) concentrates GCCs, consulting firms and premium real estate along the Golf Course Road and Cyber City corridors — a buyer set that responds to credibility assets (case detail, process documentation, security/compliance answers) far more than to discount messaging.",
      "Real estate is the dominant vertical here, and it behaves differently from every other category: enquiry-to-site-visit is the metric that matters, not cost per lead. Our Gurgaon property campaigns are built around site-visit conversion and speed-to-first-call.",
    ],
    districts: ["Cyber City", "Golf Course Road", "Udyog Vihar", "Sohna Road", "MG Road", "Sector 44"],
    budgets: [
      { channel: "SEO", range: "₹40,000 – ₹1,25,000/mo", note: "Project- and micro-market-level pages beat city-level pages." },
      { channel: "Google Ads", range: "₹80,000+/mo ad spend", note: "Property and B2B terms are premium-priced in Gurugram." },
      { channel: "Meta Lead Ads", range: "₹50,000 – ₹2,50,000/mo", note: "Works only with instant-response call routing." },
    ],
    serpReality:
      "Gurgaon SERPs are crowded with portals like 99acres, MagicBricks and large B2B directories. The reliable route in is hyperlocal: sector- and project-level pages plus a fully optimised Google Business Profile, rather than a head-on fight for 'agency in Gurgaon'.",
    faqs: [
      {
        q: "Do you handle real estate marketing in Gurgaon?",
        a: "Yes. We run project-level campaigns with sector-specific landing pages, WhatsApp-first lead routing and site-visit tracking, because in Gurugram property the conversion that matters is enquiry-to-site-visit, not form fill.",
      },
      {
        q: "Can you support a GCC or global team based in Cyber City?",
        a: "Yes — we work with India-based marketing teams of global organisations, including brand-guideline compliance, multi-country reporting and procurement/security documentation.",
      },
      {
        q: "What's a realistic cost per lead in Gurgaon?",
        a: "It varies sharply by vertical: B2B services typically ₹800–₹2,500 per qualified enquiry, premium residential ₹1,500–₹6,000 per site-visit-ready lead. We benchmark against your current account in the first audit rather than quoting a number blind.",
      },
    ],
  },
  {
    slug: "lucknow",
    marketNotes: [
      "Lucknow is an under-served market: search demand for services, healthcare, education and real estate keeps rising while most local competitors still run brochure websites with no structured data and no Google Business Profile discipline. That gap makes local SEO unusually cost-effective here.",
      "Buying behaviour is call-first and Hindi-comfortable. Our Lucknow campaigns prioritise click-to-call, WhatsApp and Hindi-English creative over long web forms, because that's how enquiries actually arrive in this market.",
    ],
    districts: ["Hazratganj", "Gomti Nagar", "Alambagh", "Aliganj", "Indira Nagar", "Amar Shaheed Path"],
    budgets: [
      { channel: "Local SEO", range: "₹25,000 – ₹60,000/mo", note: "Lower competition means faster local-pack wins than metros." },
      { channel: "Google Ads", range: "₹30,000+/mo ad spend", note: "CPCs are materially cheaper than Delhi or Mumbai." },
      { channel: "Social / Creative", range: "₹20,000 – ₹75,000/mo", note: "Hindi-first creative outperforms English-only sets." },
    ],
    serpReality:
      "Most Lucknow competitors haven't done the basics: no schema, incomplete Google Business Profile, no city landing pages, thin review velocity. A disciplined 90-day local SEO programme is usually enough to enter the local pack for core service terms.",
    faqs: [
      {
        q: "Which is the best digital marketing agency in Lucknow?",
        a: "Judge it on three things rather than claims: whether the agency shows you account-level data before pitching, whether it commits to a 90-day roadmap with named keywords and pages, and whether reporting ties to enquiries you can trace. Digital Penta works to that standard in Lucknow and offers a free audit of your website, Google Business Profile and ad accounts first.",
      },
      {
        q: "How much does digital marketing cost in Lucknow?",
        a: "Local SEO retainers typically start around ₹25,000/month, Google Ads management from ₹30,000/month of ad spend upward. Lucknow CPCs are considerably lower than Delhi or Mumbai, so smaller budgets still produce meaningful enquiry volume.",
      },
      {
        q: "Do you run campaigns in Hindi for Lucknow audiences?",
        a: "Yes — Hindi and Hinglish ad copy, WhatsApp templates and creative sets are standard for Lucknow and wider Uttar Pradesh campaigns, alongside English for premium and B2B segments.",
      },
    ],
  },
  {
    slug: "hyderabad",
    marketNotes: [
      "Hyderabad splits cleanly into two economies: the HITEC City / Gachibowli tech corridor with global capability centres and product companies, and the older city's pharma, healthcare and retail base. The keyword sets, ad formats and content depth needed for each barely overlap, so we build separate campaign structures.",
      "Pharma and healthcare advertising here carries real compliance constraints. Our Hyderabad work includes claim review and platform-policy checks before creative goes live, which avoids the disapproval cycles that stall most healthcare accounts.",
    ],
    districts: ["HITEC City", "Gachibowli", "Madhapur", "Banjara Hills", "Jubilee Hills", "Kondapur"],
    budgets: [
      { channel: "SEO", range: "₹35,000 – ₹1,20,000/mo", note: "Two content tracks: tech corridor and healthcare/pharma." },
      { channel: "Google Ads", range: "₹60,000+/mo ad spend", note: "Healthcare needs policy-safe creative from day one." },
      { channel: "Social / Video", range: "₹30,000 – ₹1,25,000/mo", note: "Regional-language video performs strongly in Telangana." },
    ],
    serpReality:
      "Hyderabad's commercial SERPs are winnable faster than Mumbai's or Bangalore's — competitor content depth is lower — but healthcare and pharma pages need E-E-A-T signals (author credentials, citations, policy pages) or they stall regardless of links.",
    faqs: [
      {
        q: "Do you work with pharma and healthcare brands in Hyderabad?",
        a: "Yes. We handle claim-compliant creative, Google and Meta health-policy review, and E-E-A-T-oriented content with named medical reviewers where the category requires it.",
      },
      {
        q: "Can you run Telugu-language campaigns?",
        a: "Yes — Telugu and Hinglish creative, plus regional-language video for Meta and YouTube, are standard for Telangana and Andhra audiences.",
      },
      {
        q: "How fast can we see results in Hyderabad?",
        a: "Paid search typically stabilises within 4–6 weeks. Organic movement on commercial terms usually appears from month 3, earlier than Mumbai or Bangalore because competing content depth is lower.",
      },
    ],
  },
  {
    slug: "dubai",
    marketNotes: [
      "Dubai is a multi-language, multi-nationality market where the same service query is searched in English and Arabic by audiences with different expectations. Campaigns that run English-only leave a substantial share of high-intent Arabic demand uncontested — which is why our UAE builds ship bilingual landing pages and Arabic creative from launch.",
      "Trade licence, free-zone and mainland distinctions also change the messaging: a DMCC-registered B2B buyer and a Deira retail buyer need different proof. We segment UAE accounts by zone and nationality cluster rather than by emirate alone.",
    ],
    districts: ["Business Bay", "DIFC", "Dubai Marina", "JLT", "Deira", "Dubai Silicon Oasis"],
    budgets: [
      { channel: "SEO (EN + AR)", range: "AED 4,000 – AED 15,000/mo", note: "Bilingual content is the main differentiator in UAE SERPs." },
      { channel: "Google Ads", range: "AED 7,000+/mo ad spend", note: "High CPCs; strict conversion tracking is non-negotiable." },
      { channel: "Social / Influencer", range: "AED 5,000 – AED 40,000/mo", note: "Instagram and TikTok drive discovery across GCC." },
    ],
    serpReality:
      "UAE SERPs are dominated by listing sites and large regional agencies. Bilingual depth, UAE-hosted proof (licences, local case detail, Arabic reviews) and Google Business Profile completeness are what actually move a page from position 30 to the first page here.",
    faqs: [
      {
        q: "Do you provide Arabic SEO and Arabic ad creative for Dubai?",
        a: "Yes — Arabic keyword research, native Arabic copywriting, hreflang-correct bilingual pages and Arabic ad creative are part of our standard UAE scope, not an add-on.",
      },
      {
        q: "How much does digital marketing cost in Dubai?",
        a: "SEO retainers typically run AED 4,000–15,000/month; Google Ads management sits alongside a minimum practical ad spend of about AED 7,000/month given UAE auction pricing. Scope, not headcount, drives the number.",
      },
      {
        q: "Can you market across the wider GCC from Dubai?",
        a: "Yes. We run UAE, Saudi Arabia, Qatar and Bahrain campaigns with country-level keyword sets, currency-correct landing pages and separate reporting per market.",
      },
    ],
  },
  {
    slug: "abu-dhabi",
    marketNotes: [
      "Abu Dhabi's demand profile is government, energy, healthcare and education — long procurement cycles, tender documentation and Arabic-first communication with public-sector stakeholders. Marketing that works here looks more like credibility publishing than lead-gen blasting.",
      "Because decision groups are large and slow, we optimise Abu Dhabi accounts for assisted conversions and content consumption depth, then use remarketing and email nurture across the procurement window rather than expecting a same-week enquiry.",
    ],
    districts: ["Al Reem Island", "Corniche", "Khalifa City", "Masdar City", "Mussafah", "Yas Island"],
    budgets: [
      { channel: "SEO (EN + AR)", range: "AED 4,000 – AED 12,000/mo", note: "Arabic parity matters more here than in Dubai." },
      { channel: "Google Ads", range: "AED 5,000+/mo ad spend", note: "Lower volume, higher value per enquiry than Dubai." },
      { channel: "Content / Nurture", range: "AED 3,500 – AED 15,000/mo", note: "Long procurement cycles need sustained nurture." },
    ],
    serpReality:
      "Abu Dhabi search volumes are smaller than Dubai's, so ranking is achievable with less link volume — but pages must be genuinely bilingual and locally specific. Reusing Dubai content with the city name swapped is the single most common reason Abu Dhabi pages stall in the 40–60 range.",
    faqs: [
      {
        q: "Do you have a presence in Abu Dhabi?",
        a: "We serve Abu Dhabi clients from our UAE operations with on-site meetings arranged as needed across Al Reem, Khalifa City and Mussafah. Reach us at +91-88601-00039 or support@digitalpenta.com to schedule.",
      },
      {
        q: "Can you support government and semi-government tenders?",
        a: "Yes — we support bilingual capability content, tender-ready collateral, accessible web builds and compliance-aware messaging for public-sector and semi-government buyers.",
      },
      {
        q: "Is Abu Dhabi cheaper to advertise in than Dubai?",
        a: "Generally yes on cost per click, because auction density is lower. Volume is also lower, so the practical approach is a tighter keyword set with higher-value conversion tracking rather than broad reach.",
      },
    ],
  },
];

const DEPTH_INDEX = new Map(CITY_DEPTH.map((c) => [c.slug, c]));

/** Cities with a hand-written depth layer — the GSC priority set. */
export const PRIORITY_CITY_SLUGS = CITY_DEPTH.map((c) => c.slug);

export function getCityDepth(slug: string): CityDepth | undefined {
  return DEPTH_INDEX.get(slug);
}
