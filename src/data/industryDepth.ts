/**
 * Written depth for /industries/:industry pages: how marketing works in each
 * sector, what we prioritise and common questions. No invented stats.
 */
export interface IndustryDepth {
  overview: string[];
  priorities: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const DEPTH: Record<string, IndustryDepth> = {
  "real-estate": {
    overview: [
      "Property buyers research for weeks or months before they call, and most compare several projects at once. Marketing has to be present across that whole period: when they search a locality, when they compare builders and when they are ready to book a site visit.",
      "The biggest waste in real estate marketing is paying for leads nobody follows up. We connect ad campaigns and website forms to your CRM so every enquiry gets a fast first response and a tracked follow-up.",
    ],
    priorities: [
      { title: "Project and locality pages", desc: "A page for each project and micro-market, with floor plans, pricing ranges, RERA details and location information buyers search for." },
      { title: "Lead quality over lead volume", desc: "Campaigns optimised for site visits and qualified calls rather than cheap form fills." },
      { title: "Fast follow-up", desc: "WhatsApp and call-back automation so a new enquiry hears from you within minutes." },
    ],
    faqs: [
      { q: "Which ads work best for real estate?", a: "Google Search captures buyers already looking for a locality or project. Meta ads work well for launches and retargeting. Most developers need both, with the budget split tested month by month." },
      { q: "Do you show RERA details on project pages?", a: "Yes. RERA registration numbers and required disclosures are included on every project page and ad landing page." },
      { q: "Can you work with our existing CRM?", a: "Usually yes. We connect lead forms and ad platforms to common CRMs so enquiries arrive with their source attached." },
    ],
  },
  healthcare: {
    overview: [
      "Patients choose doctors and clinics based on trust: reviews, clear information and how easy it is to book. Healthcare marketing has to be accurate and careful, because medical advertising rules are stricter than in most industries.",
      "We focus on local search visibility, helpful condition and treatment pages reviewed by your doctors, and simple online booking.",
    ],
    priorities: [
      { title: "Local search and maps", desc: "Google Business Profile for every location, with correct timings, services and doctor information." },
      { title: "Doctor-reviewed content", desc: "Treatment and condition pages written clearly and checked by your medical team before publishing." },
      { title: "Easy booking", desc: "Appointment booking and reminders that reduce no-shows and front-desk calls." },
    ],
    faqs: [
      { q: "Do you follow medical advertising rules?", a: "Yes. We avoid claims of guaranteed outcomes and before-and-after promises, and follow platform health-advertising policies and applicable local regulations." },
      { q: "How do you handle patient data?", a: "Forms collect only what is needed to book, data is sent securely to your systems, and we do not use patient information in ad targeting." },
      { q: "Can you help with online reviews?", a: "We set up a simple way to ask satisfied patients for honest reviews and help you respond to all reviews professionally. We never post fake reviews." },
    ],
  },
  education: {
    overview: [
      "Student enrolment follows a clear calendar, and most marketing budget is spent in a few intense months. Planning ahead matters: search content and retargeting audiences need to be ready before admission season begins.",
      "Parents and students compare fees, placements, faculty and reviews. Clear programme pages and quick answers to enquiries decide who applies.",
    ],
    priorities: [
      { title: "Programme pages that answer questions", desc: "Fees, eligibility, duration, outcomes and application steps on one clear page per course." },
      { title: "Admission-season campaigns", desc: "Search and social campaigns planned around your intake dates, with budgets shifted to the best-converting courses." },
      { title: "Enquiry nurturing", desc: "Email and WhatsApp follow-ups that guide applicants from first enquiry to submitted application." },
    ],
    faqs: [
      { q: "When should we start marketing for admissions?", a: "Ideally two to three months before applications open, so content ranks and ad audiences are built by the time demand peaks." },
      { q: "Which platforms reach students best?", a: "Instagram and YouTube reach younger students; Google Search reaches students and parents actively comparing; LinkedIn suits executive and postgraduate programmes." },
      { q: "Can you recruit international students?", a: "Yes, with country-specific pages and campaigns for the markets you recruit from, in line with each platform's advertising rules for education." },
    ],
  },
  ecommerce: {
    overview: [
      "Online stores win on product visibility, conversion rate and repeat purchases. Advertising alone rarely stays profitable unless the store converts well and customers come back.",
      "We look at the whole path: how shoppers find products, how quickly pages load on mobile, how smooth checkout is, and what brings a customer back for a second order.",
    ],
    priorities: [
      { title: "Product feed and Shopping ads", desc: "Clean product data for Google Shopping and Meta catalogue ads, with campaigns grouped by margin." },
      { title: "Store speed and checkout", desc: "Faster product pages and fewer checkout steps, tested on real phones." },
      { title: "Repeat purchase", desc: "Email and WhatsApp flows for abandoned carts, post-purchase follow-up and win-back." },
    ],
    faqs: [
      { q: "Which store platforms do you work with?", a: "Shopify, WooCommerce and custom-built stores. We recommend a platform based on your catalogue size and budget." },
      { q: "How do you measure profitability, not just sales?", a: "We track return on ad spend alongside product margins and returns, so campaigns are judged on profit rather than revenue alone." },
      { q: "Can you help with marketplace listings too?", a: "Yes, we can optimise listings on Amazon and other marketplaces alongside your own store." },
    ],
  },
  finance: {
    overview: [
      "Financial products are high-trust purchases with strict advertising rules. Buyers read carefully, compare providers and expect clear information about fees and risks.",
      "We build credibility through expert content, transparent landing pages and compliant campaigns, with every claim reviewed by your compliance team before it goes live.",
    ],
    priorities: [
      { title: "Compliance-first content", desc: "Pages and ads written with required disclosures and reviewed by your compliance team." },
      { title: "Expert-led education", desc: "Guides and calculators that answer real customer questions and earn search visibility." },
      { title: "Qualified leads", desc: "Forms and campaigns designed to filter for eligible applicants, not just volume." },
    ],
    faqs: [
      { q: "Do you know the advertising rules for financial services?", a: "We follow Google and Meta financial-services policies and work with your compliance team on regulator requirements such as those from RBI, SEBI or IRDAI." },
      { q: "Can you market lending or investment products?", a: "Yes, where your business holds the required licences. Some platforms need advertiser verification first, and we guide you through it." },
      { q: "How do you protect customer data?", a: "Lead forms collect minimal data, use secure connections and send information directly to your systems." },
    ],
  },
  hospitality: {
    overview: [
      "Hotels, resorts and restaurants depend on being found at the moment of planning: on Google Maps, travel searches and social media. Direct bookings save commission paid to online travel agencies.",
      "We help properties grow direct bookings through local search, strong visual content and a booking path that works well on phones.",
    ],
    priorities: [
      { title: "Maps and reviews", desc: "Google Business Profile, photos and review responses that help guests choose you." },
      { title: "Direct booking", desc: "A fast website with a clear booking engine and offers that give guests a reason to book direct." },
      { title: "Visual social content", desc: "Reels and photos showing rooms, food and experiences, planned around seasons and events." },
    ],
    faqs: [
      { q: "Can you reduce our dependence on booking sites?", a: "We can grow the share of direct bookings through search, retargeting and email to past guests. Most properties keep some booking-site presence for reach." },
      { q: "Do you run campaigns for restaurants?", a: "Yes — local search, maps visibility, social content and table-booking or delivery promotions." },
      { q: "How do you handle seasonal demand?", a: "Budgets and content are planned around your peak and off-peak periods, with offers for quieter months." },
    ],
  },
  saas: {
    overview: [
      "Software buyers research deeply, compare alternatives and often trial before they buy. Marketing has to serve that research: comparison pages, clear pricing and a smooth trial or demo experience.",
      "We connect marketing data with product sign-ups and revenue, so you can see which channels bring customers who stay, not just sign-ups.",
    ],
    priorities: [
      { title: "Bottom-of-funnel content", desc: "Comparison, alternative and use-case pages for buyers close to a decision." },
      { title: "Trial and demo conversion", desc: "Simpler sign-up flows and onboarding emails that help trial users reach value quickly." },
      { title: "Revenue-level tracking", desc: "Attribution from first visit to paid plan, connected to your CRM or billing system." },
    ],
    faqs: [
      { q: "Do you work with B2B or B2C software?", a: "Both. B2B work leans on search, LinkedIn and account-based campaigns; B2C leans on app stores, social and lifecycle email." },
      { q: "Can you help with product-led growth?", a: "Yes — sign-up flow improvements, in-product onboarding prompts and lifecycle emails based on user behaviour." },
      { q: "How do you report on SaaS marketing?", a: "By pipeline and revenue: trials, qualified demos, paid conversions and customer acquisition cost by channel." },
    ],
  },
};

export function getIndustryDepth(slug: string): IndustryDepth | undefined {
  return DEPTH[slug];
}
