/**
 * Written depth for /services/:category hub pages. Describes how the work is
 * done and who it suits — no invented stats, clients or results.
 */
export interface CategoryDepth {
  overview: string[];
  whoFor: string[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
}

const DEPTH: Record<string, CategoryDepth> = {
  "digital-marketing": {
    overview: [
      "Digital marketing works best when search, ads and social share one plan and one set of numbers. We start by agreeing what a qualified lead or sale is worth to you, then choose the channels that can reach your buyers at a sensible cost.",
      "Most engagements combine a long-term channel such as SEO or content with a faster one such as Google Ads or Meta Ads, so you get enquiries now while building traffic you don't pay for each click.",
    ],
    whoFor: [
      "Businesses spending on ads without clear tracking of which leads turn into sales",
      "Companies whose website gets traffic but few enquiries",
      "Brands expanding from one city into new cities or countries",
    ],
    deliverables: [
      "Channel plan with budget split and target cost per lead",
      "Conversion tracking set up in Google Analytics 4",
      "Monthly report tied to leads and revenue, not just clicks",
      "A named strategist and a fixed review call each month",
    ],
    faqs: [
      { q: "Do I need every channel at once?", a: "No. Most businesses start with one or two channels, prove the cost per lead, and add more only when the first ones are working." },
      { q: "Who owns the ad accounts and data?", a: "You do. Ad accounts, analytics and Search Console stay in your business name, and we work inside them with access you can remove at any time." },
      { q: "How do you report results?", a: "A monthly report and call covering spend, leads, cost per lead and what changes next month, with a live dashboard you can check any time." },
    ],
  },
  development: {
    overview: [
      "A website or app should be fast on an ordinary phone, easy for your team to update and built so search engines can read it. We plan pages and content first, then design, then build.",
      "For redesigns we map every existing URL that brings traffic before anything changes, so rankings are carried over rather than lost at launch.",
    ],
    whoFor: [
      "Businesses whose current site is slow, hard to edit or not bringing enquiries",
      "Companies needing a customer portal, booking flow or internal tool",
      "Startups launching a first product or marketing site",
    ],
    deliverables: [
      "Sitemap, wireframes and visual design approved before build",
      "Mobile-first front end tested for Core Web Vitals",
      "Editor or admin panel with team training",
      "Redirect plan, analytics setup and a post-launch fix window",
    ],
    faqs: [
      { q: "Which technology do you build with?", a: "We choose per project. Marketing sites usually use a modern React stack or a headless CMS; apps use proven frameworks with a managed database. We explain the choice and the running costs before starting." },
      { q: "Do you provide hosting and maintenance?", a: "Yes, as an optional monthly plan covering updates, backups, security patches and small content changes. You can also host independently." },
      { q: "Will the new site keep our Google rankings?", a: "We protect them with a URL map, 301 redirects and a Search Console check after launch. Short-term movement can happen, but planned redirects prevent lasting losses." },
    ],
  },
  "ai-solutions": {
    overview: [
      "AI is useful when it takes a clear, repetitive task off your team: answering common questions, sorting enquiries, drafting documents or pulling data from files. We start with that task, not with the technology.",
      "Every solution is piloted on a small scale with a human checking results before it is rolled out more widely.",
    ],
    whoFor: [
      "Teams answering the same customer questions many times a day",
      "Sales teams that need enquiries sorted and prioritised quickly",
      "Operations handling documents, forms or data entry by hand",
    ],
    deliverables: [
      "Process map showing where AI saves time and where it shouldn't be used",
      "Working pilot trained on your own documents and FAQs",
      "Human hand-off and review steps built in",
      "Usage and accuracy reporting",
    ],
    faqs: [
      { q: "Does AI need a lot of our data to work?", a: "Usually not. Most business assistants work from your existing FAQs, documents and policies, without training a new model." },
      { q: "What does it cost to run each month?", a: "Running costs depend on usage volume. We estimate them during the pilot so you know the monthly cost before a full rollout." },
      { q: "Can it work in Hindi or Arabic?", a: "Yes. Current AI models handle Hindi, Arabic and English well, and we test answers in each language before launch." },
    ],
  },
  automation: {
    overview: [
      "Automation connects the tools you already use — forms, CRM, WhatsApp, email, spreadsheets — so information moves without someone copying it by hand.",
      "We document every workflow we build, so your team understands what runs, when, and how to change it.",
    ],
    whoFor: [
      "Businesses where leads sit in inboxes before anyone follows up",
      "Teams copying data between spreadsheets and software",
      "Companies sending the same reminders and updates manually",
    ],
    deliverables: [
      "Audit of manual steps and the hours each takes",
      "Automated workflows between your existing tools",
      "Error alerts so nothing fails silently",
      "Written documentation and a handover session",
    ],
    faqs: [
      { q: "Do we need to replace our current software?", a: "Rarely. Most automation connects the tools you already have. We only suggest a change when a tool can't connect at all." },
      { q: "What happens if an automation breaks?", a: "Each workflow sends an alert on failure, and our maintenance plan covers fixes. Documentation lets your own team fix simple issues too." },
      { q: "Can you automate WhatsApp follow-ups?", a: "Yes, through the official WhatsApp Business API with approved message templates, which keeps your number compliant." },
    ],
  },
  "public-relations": {
    overview: [
      "PR builds the credibility that ads can't buy: coverage in publications your customers read, and a clear story about why your business matters.",
      "Good coverage also helps search. Mentions and links from respected news sites strengthen your website's authority and how AI assistants describe your brand.",
    ],
    whoFor: [
      "Founders who want to be quoted as experts in their industry",
      "Companies launching a product, funding round or new market",
      "Brands that need to rebuild trust after negative coverage",
    ],
    deliverables: [
      "Story angles and a media list matched to your audience",
      "Press releases and founder commentary written with you",
      "Pitching to journalists and publications",
      "Coverage report with links and reach",
    ],
    faqs: [
      { q: "How long does PR take to show results?", a: "A first story can land within weeks, but steady coverage usually builds over three to six months of consistent pitching." },
      { q: "Do you handle crisis communication?", a: "Yes — holding statements, media responses and a plan for search results and reviews after an incident." },
    ],
  },
};

export function getCategoryDepth(slug: string): CategoryDepth | undefined {
  return DEPTH[slug];
}
