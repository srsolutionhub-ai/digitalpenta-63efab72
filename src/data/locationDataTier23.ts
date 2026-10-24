/**
 * Tier-2/3 location entries — built from the city registry + depth layer.
 *
 * These cities get the same premium LocationPage template as the metros, with
 * content grounded in each city's real economy (see cityRegistry.ts and
 * cityDepthTier23.ts). Deliberate rules:
 *  - No testimonial: we only publish quotes from real, confirmed clients, and
 *    none are confirmed for these markets yet. The section stays hidden.
 *  - Stats are agency-level facts (confirmed by the owner), not invented
 *    per-city client counts.
 *  - FAQs come from the hand-written depth layer — never spun text.
 */

import type { LocationData } from "./locationData";
import { getCityRegistryEntry } from "./cityRegistry";
import { getCityDepth } from "./cityDepth";

const PHONE = "+91-88601-00039";
const EMAIL = "support@digitalpenta.com";

const CORE_SERVICES = [
  "SEO & Local SEO",
  "Google Ads & Meta Ads",
  "AI SEO & LLM Visibility",
  "AI Agents & Chatbots",
  "Business Process Automation",
  "Website & Web App Development",
  "Mobile App Development",
  "Social Media Marketing",
  "Content Marketing",
  "Email Marketing & CRM",
];

const AGENCY_STATS = [
  { value: "500+", label: "Clients Served" },
  { value: "3x", label: "Avg. Traffic Growth" },
  { value: "24hr", label: "Response Time" },
  { value: "4.9★", label: "Google Rating" },
];

const AGENCY_WHY_US = [
  "Senior strategists who understand tier-2 and tier-3 market economics — not metro playbooks copied down",
  "AI-first delivery: AI SEO, LLM visibility tracking, chatbots and workflow automation built in-house",
  "Transparent monthly reporting with a live dashboard — you see what we see",
  "No long-term lock-in contracts; month-to-month engagement based on results",
  "Hindi and English communication — your team never needs a translator for strategy calls",
  "Direct access to the delivery team, not just an account manager",
];

function build(slug: string, tagline: string, description: string): LocationData {
  const reg = getCityRegistryEntry(slug);
  const depth = getCityDepth(slug);
  if (!reg) throw new Error(`cityRegistry missing: ${slug}`);
  return {
    slug: reg.slug,
    city: reg.city,
    country: "India",
    region: "india",
    tagline,
    description,
    metaTitle: `Digital Marketing Agency in ${reg.city} | Free Audit`,
    metaDescription: `${reg.city} digital marketing agency for SEO, Google Ads, AI automation, websites and apps. ${reg.localAngle}. Free audit — call ${PHONE}.`,
    phone: PHONE,
    email: EMAIL,
    address: `Serving ${reg.city}, ${reg.state} — remote-first with on-site strategy sessions`,
    stats: AGENCY_STATS,
    services: CORE_SERVICES,
    industries: reg.industries,
    whyUs: AGENCY_WHY_US,
    faqs: depth?.faqs ?? [],
    mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(reg.city + ", " + reg.state)}&output=embed`,
    schema: {
      streetAddress: `${reg.city}, ${reg.state}`,
      postalCode: "",
      latitude: reg.lat,
      longitude: reg.lng,
    },
  };
}

export const TIER23_LOCATIONS: LocationData[] = [
  build(
    "kanpur",
    "Digital growth for Kanpur's leather, textile and industrial economy",
    "Kanpur's manufacturers and traders built their reputation on product quality — but buyers now search online before they ever call. We help Kanpur's leather houses, textile units and local businesses turn search visibility into qualified enquiries, with B2B catalogues, export-ready websites and campaigns tuned to industrial buying cycles.",
  ),
  build(
    "prayagraj",
    "Digital marketing for Prayagraj's education and pilgrimage economy",
    "Prayagraj runs on two engines — its coaching and education sector, and one of India's largest pilgrimage-tourism economies. We build admission funnels for institutes and booking-ready visibility for hotels and travel services, with campaigns that respect the city's seasonal rhythm instead of wasting budget in quiet months.",
  ),
  build(
    "varanasi",
    "Taking Varanasi's crafts, hospitality and tourism businesses online",
    "From Banarasi saree exporters to ghatside hotels, Varanasi's businesses serve buyers across the world — but most are invisible beyond walk-in traffic. We build product catalogues, multilingual booking journeys and search visibility that connect Varanasi's heritage economy to modern buyers.",
  ),
  build(
    "agra",
    "Beyond the Taj — digital growth for Agra's tourism and manufacturing",
    "Agra welcomes millions of visitors, yet its hotels, marble craftsmen and footwear manufacturers compete for attention against global booking platforms. We help Agra businesses win direct bookings and B2B enquiries with fast websites, local search dominance and campaigns that separate tourist intent from trade buyers.",
  ),
  build(
    "dehradun",
    "Digital marketing for Dehradun's schools, hotels and startups",
    "Dehradun blends boarding-school prestige, wellness tourism and a young startup scene. We work with institutes on admissions funnels, with hotels on direct bookings, and with founders on AI-powered products — bringing metro-grade strategy to the Doon valley without metro-grade pricing.",
  ),
  build(
    "haridwar",
    "Serving Haridwar's pilgrimage economy and SIDCUL manufacturers",
    "Haridwar is two markets in one: millions of pilgrims needing stays and services, and a SIDCUL industrial belt needing B2B buyers. We build separate, honest funnels for each — seasonal tourism campaigns that respect capacity, and capability-driven industrial marketing that reaches procurement teams.",
  ),
  build(
    "alwar",
    "Digital growth for Alwar — from Sariska tourism to the Bhiwadi corridor",
    "Alwar sits between two economies: Sariska's tourism and the Bhiwadi-Neemrana industrial corridor. We help hotels and tour operators capture planning-stage searches, and manufacturers turn capability pages into qualified industrial enquiries — with honest service-area targeting, not inflated coverage claims.",
  ),
  build(
    "bareilly",
    "Taking Bareilly's furniture and zari craftsmanship to online buyers",
    "Bareilly's furniture makers and zari artisans supply customers across India, yet most discovery still happens through middlemen. We build searchable catalogues, wholesale enquiry funnels and visual social presence that let Bareilly's craft businesses deal directly with buyers and keep the margin.",
  ),
  build(
    "udaipur",
    "Digital marketing for Udaipur's hotels, weddings and handicrafts",
    "Udaipur competes globally — couples compare its venues with Tuscany and Bali before booking. We help hotels, wedding venues and craft businesses win that comparison with fast visual websites, direct-booking funnels and campaigns timed to real booking windows, not year-round generic ads.",
  ),
  build(
    "jodhpur",
    "From the Blue City to global buyers — Jodhpur's digital growth partner",
    "Jodhpur's furniture and handicraft exporters serve buyers worldwide, while its hotels compete with global travel platforms. We build export-grade catalogues with trade enquiry paths for manufacturers, and direct-booking visibility for hospitality — each with its own funnel, because a souvenir shopper is not a container-load buyer.",
  ),
  build(
    "bikaner",
    "Helping Bikaner's food brands and tourism businesses grow online",
    "Bikaner's bhujia and snacks are famous across India, but most brands still grow through distribution networks alone. We help food manufacturers build direct online demand and distributor enquiry funnels, and help the city's tourism businesses capture travellers planning Rajasthan itineraries.",
  ),
  build(
    "gwalior",
    "Digital marketing for Gwalior's manufacturers, institutes and heritage trade",
    "Gwalior's economy spans manufacturing, a large education sector and heritage tourism — three audiences that need completely different funnels. We build capability-led B2B marketing for manufacturers, admissions funnels for institutes, and visitor-ready visibility for tourism businesses, each measured on real enquiries.",
  ),
  build(
    "indore",
    "Growth marketing for Indore — MP's commercial capital",
    "Indore is scaling fast: food brands going national, IT firms hiring, startups raising. Competition for attention here is real now. We bring funnel-first marketing — SEO, paid media, AI automation and conversion-focused websites — measured on qualified enquiries, not vanity reach.",
  ),
  build(
    "bhopal",
    "Digital marketing for Bhopal's institutions, services and tourism",
    "Bhopal's mix of government ecosystems, education and lakeside tourism rewards clarity over noise. We help institutes keep admissions funnels full, service businesses dominate local search, and hospitality brands convert planning-stage travellers — with reporting that shows exactly what each rupee produced.",
  ),
  build(
    "ludhiana",
    "B2B digital marketing for Ludhiana's hosiery and bicycle industries",
    "Ludhiana's manufacturers supply the world but are often invisible online beyond directories. We build specification-rich catalogues, export enquiry funnels and search visibility that put Ludhiana's hosiery, cycle and auto-parts makers in front of procurement teams directly — without the middleman's cut.",
  ),
  build(
    "amritsar",
    "Digital growth for Amritsar's tourism, food and textile businesses",
    "Millions visit Amritsar for the Golden Temple, and the city's food and textile businesses serve customers far beyond Punjab. We help hotels win direct bookings, restaurants and food brands build loyal followings, and textile sellers present their range to retail and trade buyers alike.",
  ),
  build(
    "mohali",
    "Tech-forward marketing for Mohali's IT corridor and real estate market",
    "Mohali's IT Park startups and booming real-estate market both fight for attention across the Tricity. We help tech firms build credible lead funnels and property businesses run compliant, verified campaigns — with Mohali-specific targeting instead of blurred Chandigarh-wide messaging.",
  ),
  build(
    "zirakpur",
    "Local search dominance for Zirakpur's property and retail boom",
    "Zirakpur's growth is hyperlocal — residents search by neighbourhood, not by city. We help property businesses, retailers and service providers own VIP Road, Dhakoli and Airport Road searches with precise local pages, accurate map presence and campaigns measured on real site visits and calls.",
  ),
  build(
    "jalandhar",
    "Digital marketing for Jalandhar's manufacturers and NRI-serving businesses",
    "Jalandhar's sports-goods makers export worldwide, and its service businesses often serve NRI families deciding from abroad. We build buyer-ready B2B catalogues for manufacturers and trust-first digital journeys for businesses whose customers research from thousands of miles away.",
  ),
  build(
    "patiala",
    "Digital marketing for Patiala's institutions, textiles and heritage trade",
    "Patiala's families research education choices carefully, and its textile customers compare quality before they visit. We help institutions run admissions-timed campaigns and local businesses build the kind of detailed, current online presence that earns trust before the first phone call.",
  ),
  build(
    "shimla",
    "Helping Shimla's hotels and tourism businesses win direct bookings",
    "Shimla's hospitality businesses lose margin to booking platforms every season. We help hotels, cafes and tour operators build direct-booking funnels with honest availability, seasonal campaign planning and search visibility that captures travellers while they're still comparing options.",
  ),
  build(
    "manali",
    "Digital marketing for Manali's adventure tourism and homestays",
    "Manali's visitors plan adventures weeks ahead and compare dozens of stays on mobile. We help homestays, hotels and adventure operators stand out with fast booking-ready websites, season-aware campaigns and content that answers real traveller questions — capacity-honest, never overpromising.",
  ),
  build(
    "dharamshala",
    "Digital growth for Dharamshala's cafes, retreats and craft businesses",
    "Dharamshala attracts a global audience — wellness seekers, trekkers and long-stay travellers who research deeply before choosing. We help retreats, cafes and handicraft businesses communicate what makes them genuine, with accurate information and booking paths that respect the visitor's intelligence.",
  ),
  build(
    "faridabad",
    "Industrial-strength digital marketing for Faridabad's manufacturers",
    "Faridabad's auto-component and engineering manufacturers compete for procurement attention across the NCR. We build capability-led websites, specification-rich content and tightly segmented campaigns that reach buyers in the industries you actually serve — measured on qualified opportunities, not form-filler volume.",
  ),
];
