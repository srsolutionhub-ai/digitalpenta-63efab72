/**
 * City registry — the single source of truth for which cities Digital Penta
 * targets with local landing pages, and what makes each market distinct.
 *
 * 120+ Indian cities: ~30% tier-1, ~70% tier-2/3 (the growth markets where
 * digital adoption is compounding fastest and agency competition is thin).
 *
 * Rules:
 *  - `industries` and `localAngle` must be real, verifiable facts about the
 *    city's economy — never invented claims about Digital Penta.
 *  - Coordinates are city-center approximations for schema/geo meta.
 *  - A city only gets a live page when it also has a LocationData entry;
 *    the registry drives the hub, sitemap planning and content batches.
 */

export type CityTier = 1 | 2 | 3;

export interface CityRegistryEntry {
  slug: string;
  city: string;
  state: string;
  tier: CityTier;
  /** Real dominant industries of the local economy. */
  industries: string[];
  /** One-line factual hook about the city's market (used in copy + briefs). */
  localAngle: string;
  lat: string;
  lng: string;
}

export const CITY_REGISTRY: CityRegistryEntry[] = [
  // ── Tier 1 (metros + NCR) ─────────────────────────────────────────────
  { slug: "delhi", city: "New Delhi", state: "Delhi", tier: 1, industries: ["Real Estate", "Healthcare", "Education", "E-commerce", "Government Services"], localAngle: "India's administrative capital with the country's densest concentration of SMEs and startups", lat: "28.6139", lng: "77.2090" },
  { slug: "mumbai", city: "Mumbai", state: "Maharashtra", tier: 1, industries: ["BFSI", "Entertainment", "Real Estate", "D2C Brands", "Logistics"], localAngle: "India's financial capital and most expensive paid-media auction market", lat: "19.0760", lng: "72.8777" },
  { slug: "bangalore", city: "Bengaluru", state: "Karnataka", tier: 1, industries: ["SaaS", "IT Services", "Startups", "Biotech", "Aerospace"], localAngle: "India's startup capital — highest density of funded tech companies", lat: "12.9716", lng: "77.5946" },
  { slug: "hyderabad", city: "Hyderabad", state: "Telangana", tier: 1, industries: ["Pharma", "IT Services", "Real Estate", "Biotech"], localAngle: "HITEC City corridor drives one of India's fastest-growing tech job markets", lat: "17.3850", lng: "78.4867" },
  { slug: "chennai", city: "Chennai", state: "Tamil Nadu", tier: 1, industries: ["Automotive", "SaaS", "Healthcare", "Manufacturing"], localAngle: "Detroit of India — automotive manufacturing plus a booming SaaS corridor", lat: "13.0827", lng: "80.2707" },
  { slug: "kolkata", city: "Kolkata", state: "West Bengal", tier: 1, industries: ["Manufacturing", "Education", "Retail", "Tea & Jute Trade"], localAngle: "Eastern India's commercial gateway with a large underdigitised SME base", lat: "22.5726", lng: "88.3639" },
  { slug: "pune", city: "Pune", state: "Maharashtra", tier: 1, industries: ["IT Services", "Automotive", "Education", "Manufacturing"], localAngle: "Oxford of the East — education and IT parks drive a young, digital-first population", lat: "18.5204", lng: "73.8567" },
  { slug: "ahmedabad", city: "Ahmedabad", state: "Gujarat", tier: 1, industries: ["Textiles", "Pharma", "Chemicals", "Diamond Trade"], localAngle: "Gujarat's commercial engine — family businesses rapidly moving budgets online", lat: "23.0225", lng: "72.5714" },
  { slug: "noida", city: "Noida", state: "Uttar Pradesh", tier: 1, industries: ["IT Services", "Media", "Electronics Manufacturing", "Real Estate"], localAngle: "NCR's corporate and media hub along the expressway corridor", lat: "28.5355", lng: "77.3910" },
  { slug: "gurgaon", city: "Gurgaon", state: "Haryana", tier: 1, industries: ["Corporate HQs", "Fintech", "Real Estate", "Consulting"], localAngle: "Millennium City — India's highest concentration of Fortune 500 offices", lat: "28.4595", lng: "77.0266" },
  { slug: "faridabad", city: "Faridabad", state: "Haryana", tier: 1, industries: ["Auto Components", "Manufacturing", "Engineering Goods"], localAngle: "NCR's industrial manufacturing belt moving from trade-shows to digital B2B", lat: "28.4089", lng: "77.3178" },
  { slug: "ghaziabad", city: "Ghaziabad", state: "Uttar Pradesh", tier: 1, industries: ["Manufacturing", "Real Estate", "Steel & Fabrication"], localAngle: "NCR's eastern industrial gateway with a fast-growing residential market", lat: "28.6692", lng: "77.4538" },
  { slug: "chandigarh", city: "Chandigarh", state: "Chandigarh", tier: 1, industries: ["IT Services", "Education", "Healthcare", "Government"], localAngle: "Planned-city affluence with Tricity's highest per-capita spending power", lat: "30.7333", lng: "76.7794" },
  { slug: "mohali", city: "Mohali", state: "Punjab", tier: 1, industries: ["IT Park", "Startups", "Real Estate", "Education"], localAngle: "Tricity's IT corridor — home to a growing tech-park ecosystem", lat: "30.7046", lng: "76.7179" },

  // ── Tier 2 — Uttar Pradesh ────────────────────────────────────────────
  { slug: "lucknow", city: "Lucknow", state: "Uttar Pradesh", tier: 2, industries: ["Government", "Education", "Chikankari Exports", "Real Estate", "Healthcare"], localAngle: "UP's capital — one of India's fastest-growing tier-2 consumer markets", lat: "26.8467", lng: "80.9462" },
  { slug: "kanpur", city: "Kanpur", state: "Uttar Pradesh", tier: 2, industries: ["Leather", "Textiles", "Industrial Manufacturing", "Chemicals"], localAngle: "India's leather capital — thousands of B2B manufacturers needing export-grade digital presence", lat: "26.4499", lng: "80.3319" },
  { slug: "prayagraj", city: "Prayagraj", state: "Uttar Pradesh", tier: 2, industries: ["Education", "Coaching", "Pilgrimage Tourism", "Legal Services"], localAngle: "Coaching hub and Kumbh-economy city with massive seasonal tourism spikes", lat: "25.4358", lng: "81.8463" },
  { slug: "varanasi", city: "Varanasi", state: "Uttar Pradesh", tier: 2, industries: ["Tourism", "Banarasi Saree & Handicrafts", "Hospitality", "Education"], localAngle: "Global spiritual-tourism magnet plus a heritage craft-export economy", lat: "25.3176", lng: "82.9739" },
  { slug: "agra", city: "Agra", state: "Uttar Pradesh", tier: 2, industries: ["Tourism", "Marble & Leather Goods", "Hospitality", "Footwear Manufacturing"], localAngle: "Taj Mahal tourism plus one of Asia's largest footwear manufacturing clusters", lat: "27.1767", lng: "78.0081" },
  { slug: "meerut", city: "Meerut", state: "Uttar Pradesh", tier: 2, industries: ["Sports Goods", "Education", "Brassware", "Real Estate"], localAngle: "India's sports-goods manufacturing hub, an hour from Delhi", lat: "28.9845", lng: "77.7064" },
  { slug: "bareilly", city: "Bareilly", state: "Uttar Pradesh", tier: 2, industries: ["Furniture", "Zari-Zardozi", "Trade & Distribution"], localAngle: "Rohilkhand's trade center — furniture and zari craft clusters going online", lat: "28.3670", lng: "79.4304" },
  { slug: "aligarh", city: "Aligarh", state: "Uttar Pradesh", tier: 2, industries: ["Lock Manufacturing", "Hardware", "Education"], localAngle: "India's lock-making capital — export-oriented hardware SMEs", lat: "27.8974", lng: "78.0880" },
  { slug: "moradabad", city: "Moradabad", state: "Uttar Pradesh", tier: 2, industries: ["Brassware Exports", "Handicrafts", "Metalware"], localAngle: "Brass City — a billion-dollar handicraft export cluster", lat: "28.8386", lng: "78.7733" },
  { slug: "gorakhpur", city: "Gorakhpur", state: "Uttar Pradesh", tier: 2, industries: ["Education", "Healthcare", "Terracotta Crafts", "Retail"], localAngle: "Eastern UP's commercial anchor serving Nepal-border trade", lat: "26.7606", lng: "83.3732" },
  { slug: "jhansi", city: "Jhansi", state: "Uttar Pradesh", tier: 2, industries: ["Defence Manufacturing", "Education", "Trade"], localAngle: "Bundelkhand's gateway with a new defence-manufacturing corridor", lat: "25.4484", lng: "78.5685" },
  { slug: "saharanpur", city: "Saharanpur", state: "Uttar Pradesh", tier: 3, industries: ["Wood Carving", "Furniture Exports", "Paper"], localAngle: "Wood-carving export cluster supplying global home-decor brands", lat: "29.9680", lng: "77.5552" },

  // ── Tier 2/3 — Rajasthan ──────────────────────────────────────────────
  { slug: "jaipur", city: "Jaipur", state: "Rajasthan", tier: 2, industries: ["Tourism", "Jewellery & Gemstones", "Handicrafts", "Textiles", "Startups"], localAngle: "Pink City — tourism, gemstone exports and a rising startup scene", lat: "26.9124", lng: "75.7873" },
  { slug: "udaipur", city: "Udaipur", state: "Rajasthan", tier: 3, industries: ["Tourism & Hospitality", "Destination Weddings", "Handicrafts", "Marble"], localAngle: "India's destination-wedding capital — hotels and venues compete almost entirely online", lat: "24.5854", lng: "73.7125" },
  { slug: "jodhpur", city: "Jodhpur", state: "Rajasthan", tier: 3, industries: ["Tourism", "Furniture & Handicraft Exports", "Textiles"], localAngle: "Blue City — a major handicraft and furniture export cluster", lat: "26.2389", lng: "73.0243" },
  { slug: "kota", city: "Kota", state: "Rajasthan", tier: 3, industries: ["Coaching & Education", "Hostels & PGs", "Retail"], localAngle: "India's coaching capital — 1.5 lakh+ students drive a hyperlocal services economy", lat: "25.2138", lng: "75.8648" },
  { slug: "bikaner", city: "Bikaner", state: "Rajasthan", tier: 3, industries: ["Food & Snacks Manufacturing", "Tourism", "Camel Dairy"], localAngle: "Home of India's bhujia industry — food brands scaling nationally", lat: "28.0229", lng: "73.3119" },
  { slug: "ajmer", city: "Ajmer", state: "Rajasthan", tier: 3, industries: ["Pilgrimage Tourism", "Education", "Marble Trade"], localAngle: "Dargah tourism plus a growing education hub", lat: "26.4499", lng: "74.6399" },
  { slug: "alwar", city: "Alwar", state: "Rajasthan", tier: 3, industries: ["Manufacturing", "Tourism", "Auto Components"], localAngle: "Bhiwadi-Neemrana industrial corridor plus Sariska tourism", lat: "27.5530", lng: "76.6346" },

  // ── Tier 2/3 — Madhya Pradesh / Chhattisgarh ─────────────────────────
  { slug: "indore", city: "Indore", state: "Madhya Pradesh", tier: 2, industries: ["Food Industry", "IT Services", "Education", "Textiles"], localAngle: "MP's commercial capital and India's cleanest city — a rising IT destination", lat: "22.7196", lng: "75.8577" },
  { slug: "bhopal", city: "Bhopal", state: "Madhya Pradesh", tier: 2, industries: ["Government", "Education", "Manufacturing", "Tourism"], localAngle: "City of Lakes — administrative capital with a growing services economy", lat: "23.2599", lng: "77.4126" },
  { slug: "gwalior", city: "Gwalior", state: "Madhya Pradesh", tier: 3, industries: ["Manufacturing", "Education", "Heritage Tourism", "Handloom"], localAngle: "Heritage city with Chanderi-Maheshwari handloom trade nearby", lat: "26.2183", lng: "78.1828" },
  { slug: "jabalpur", city: "Jabalpur", state: "Madhya Pradesh", tier: 3, industries: ["Defence", "Education", "Marble", "Tourism"], localAngle: "Central India's defence and education hub near Marble Rocks tourism", lat: "23.1815", lng: "79.9864" },
  { slug: "raipur", city: "Raipur", state: "Chhattisgarh", tier: 2, industries: ["Steel", "Mining", "Agri-business", "Real Estate"], localAngle: "Chhattisgarh's capital — steel and agri trade digitising fast", lat: "21.2514", lng: "81.6296" },

  // ── Tier 2/3 — Punjab / Haryana / Himachal / Uttarakhand ─────────────
  { slug: "ludhiana", city: "Ludhiana", state: "Punjab", tier: 2, industries: ["Hosiery & Textiles", "Bicycle Manufacturing", "Auto Parts"], localAngle: "India's hosiery and bicycle capital — dense industrial B2B base", lat: "30.9010", lng: "75.8573" },
  { slug: "amritsar", city: "Amritsar", state: "Punjab", tier: 2, industries: ["Tourism", "Textiles", "Food Industry"], localAngle: "Golden Temple tourism plus a historic textile and food trade", lat: "31.6340", lng: "74.8723" },
  { slug: "jalandhar", city: "Jalandhar", state: "Punjab", tier: 3, industries: ["Sports Goods", "Leather", "NRI Services"], localAngle: "Sports-goods manufacturing hub with a strong NRI-remittance economy", lat: "31.3260", lng: "75.5762" },
  { slug: "patiala", city: "Patiala", state: "Punjab", tier: 3, industries: ["Education", "Textiles", "Heritage Tourism"], localAngle: "Royal heritage city with a large student population", lat: "30.3398", lng: "76.3869" },
  { slug: "zirakpur", city: "Zirakpur", state: "Punjab", tier: 3, industries: ["Real Estate", "Retail", "Hospitality"], localAngle: "Tricity's fastest-growing real-estate and retail corridor", lat: "30.6425", lng: "76.8173" },
  { slug: "bathinda", city: "Bathinda", state: "Punjab", tier: 3, industries: ["Agri-business", "Refinery", "Education"], localAngle: "Malwa region's commercial center with agri-trade dominance", lat: "30.2110", lng: "74.9455" },
  { slug: "panipat", city: "Panipat", state: "Haryana", tier: 3, industries: ["Textiles & Home Furnishing", "Recycling", "Refinery"], localAngle: "Global home-furnishing export cluster — the 'city of weavers'", lat: "29.3909", lng: "76.9635" },
  { slug: "rohtak", city: "Rohtak", state: "Haryana", tier: 3, industries: ["Education", "Agri-trade", "Manufacturing"], localAngle: "Haryana's education hub on the Delhi-Hisar corridor", lat: "28.8955", lng: "76.6066" },
  { slug: "hisar", city: "Hisar", state: "Haryana", tier: 3, industries: ["Steel", "Agri-business", "Automobile Dealerships"], localAngle: "Steel-city of Haryana with a strong agri-trading economy", lat: "29.1492", lng: "75.7217" },
  { slug: "karnal", city: "Karnal", state: "Haryana", tier: 3, industries: ["Agri-research", "Rice Milling", "Food Processing"], localAngle: "Rice-bowl trading hub on the GT Road corridor", lat: "29.6857", lng: "76.9905" },
  { slug: "dehradun", city: "Dehradun", state: "Uttarakhand", tier: 2, industries: ["Education", "Hospitality", "Wellness", "Startups"], localAngle: "Uttarakhand's capital — boarding-school hub and a rising startup city", lat: "30.3165", lng: "78.0322" },
  { slug: "haridwar", city: "Haridwar", state: "Uttarakhand", tier: 3, industries: ["Pilgrimage Tourism", "Ayurveda", "FMCG Manufacturing"], localAngle: "Gateway to the Char Dham plus the SIDCUL FMCG manufacturing belt", lat: "29.9457", lng: "78.1642" },
  { slug: "rishikesh", city: "Rishikesh", state: "Uttarakhand", tier: 3, industries: ["Yoga & Wellness Tourism", "Adventure Tourism", "Hospitality"], localAngle: "World's yoga capital — global wellness-tourism demand", lat: "30.0869", lng: "78.2676" },
  { slug: "shimla", city: "Shimla", state: "Himachal Pradesh", tier: 3, industries: ["Tourism & Hospitality", "Government", "Apple Orchards"], localAngle: "India's most famous hill station — hospitality businesses live on search", lat: "31.1048", lng: "77.1734" },
  { slug: "manali", city: "Manali", state: "Himachal Pradesh", tier: 3, industries: ["Adventure Tourism", "Hotels & Homestays", "Cafes"], localAngle: "Adventure-tourism capital — hotels win or lose on Google visibility", lat: "32.2396", lng: "77.1887" },
  { slug: "dharamshala", city: "Dharamshala", state: "Himachal Pradesh", tier: 3, industries: ["Tourism", "Wellness Retreats", "Handicrafts"], localAngle: "McLeodganj's global wellness and cafe culture scene", lat: "32.2190", lng: "76.3234" },

  // ── Tier 2 — South & West ─────────────────────────────────────────────
  { slug: "coimbatore", city: "Coimbatore", state: "Tamil Nadu", tier: 2, industries: ["Textiles", "Engineering", "Pumps & Motors", "IT Services"], localAngle: "Manchester of South India — engineering SME powerhouse", lat: "11.0168", lng: "76.9558" },
  { slug: "madurai", city: "Madurai", state: "Tamil Nadu", tier: 2, industries: ["Textiles", "Tourism", "Food Processing"], localAngle: "Temple city with a deep textile and trading economy", lat: "9.9252", lng: "78.1198" },
  { slug: "salem", city: "Salem", state: "Tamil Nadu", tier: 3, industries: ["Steel", "Textiles", "Mangoes & Agri-trade"], localAngle: "Steel and handloom hub of central Tamil Nadu", lat: "11.6643", lng: "78.1460" },
  { slug: "tirupur", city: "Tirupur", state: "Tamil Nadu", tier: 3, industries: ["Knitwear Exports", "Garment Manufacturing"], localAngle: "India's knitwear export capital — billions in garment exports", lat: "11.1085", lng: "77.3411" },
  { slug: "trichy", city: "Trichy", state: "Tamil Nadu", tier: 3, industries: ["Engineering", "Education", "Fabrication"], localAngle: "BHEL-driven engineering and fabrication cluster", lat: "10.7905", lng: "78.7047" },
  { slug: "kochi", city: "Kochi", state: "Kerala", tier: 2, industries: ["Tourism", "Spices Trade", "IT Services", "Marine"], localAngle: "Kerala's commercial capital — tourism, spices and a growing IT park", lat: "9.9312", lng: "76.2673" },
  { slug: "thiruvananthapuram", city: "Thiruvananthapuram", state: "Kerala", tier: 2, industries: ["IT Services", "Government", "Tourism", "Ayurveda"], localAngle: "Technopark city — one of India's oldest and largest IT parks", lat: "8.5241", lng: "76.9366" },
  { slug: "calicut", city: "Kozhikode", state: "Kerala", tier: 3, industries: ["Trade", "Food Industry", "Timber"], localAngle: "Malabar's trading hub with a famous food culture", lat: "11.2588", lng: "75.7804" },
  { slug: "visakhapatnam", city: "Visakhapatnam", state: "Andhra Pradesh", tier: 2, industries: ["Ports & Logistics", "Steel", "IT Services", "Pharma"], localAngle: "Andhra's largest city — port economy plus a rising IT corridor", lat: "17.6868", lng: "83.2185" },
  { slug: "vijayawada", city: "Vijayawada", state: "Andhra Pradesh", tier: 2, industries: ["Agri-trade", "Education", "Real Estate"], localAngle: "Andhra's commercial crossroads on the Krishna river", lat: "16.5062", lng: "80.6480" },
  { slug: "mysore", city: "Mysuru", state: "Karnataka", tier: 2, industries: ["Tourism", "Sandalwood & Silk", "IT Services"], localAngle: "Heritage tourism plus a growing satellite IT scene", lat: "12.2958", lng: "76.6394" },
  { slug: "hubli", city: "Hubballi", state: "Karnataka", tier: 3, industries: ["Trade", "Agri-business", "Manufacturing"], localAngle: "North Karnataka's commercial twin-city hub", lat: "15.3647", lng: "75.1240" },
  { slug: "mangalore", city: "Mangaluru", state: "Karnataka", tier: 3, industries: ["Ports", "Banking", "Education", "Cashew Exports"], localAngle: "Coastal Karnataka's banking and education powerhouse", lat: "12.9148", lng: "74.8560" },
  { slug: "nagpur", city: "Nagpur", state: "Maharashtra", tier: 2, industries: ["Logistics", "Oranges & Agri-trade", "Manufacturing", "IT"], localAngle: "India's geographic center — MIHAN logistics and IT growth", lat: "21.1458", lng: "79.0882" },
  { slug: "nashik", city: "Nashik", state: "Maharashtra", tier: 2, industries: ["Wine Industry", "Manufacturing", "Pilgrimage Tourism"], localAngle: "India's wine capital plus a major MIDC manufacturing belt", lat: "19.9975", lng: "73.7898" },
  { slug: "aurangabad", city: "Chhatrapati Sambhajinagar", state: "Maharashtra", tier: 3, industries: ["Automotive Manufacturing", "Tourism", "Pharma"], localAngle: "Ajanta-Ellora tourism plus a dense auto-component cluster", lat: "19.8762", lng: "75.3433" },
  { slug: "surat", city: "Surat", state: "Gujarat", tier: 2, industries: ["Diamonds", "Textiles", "Real Estate"], localAngle: "World's diamond-polishing capital and India's synthetic-textile hub", lat: "21.1702", lng: "72.8311" },
  { slug: "vadodara", city: "Vadodara", state: "Gujarat", tier: 2, industries: ["Chemicals", "Pharma", "Engineering"], localAngle: "Gujarat's cultural capital with a deep chemical-industry base", lat: "22.3072", lng: "73.1812" },
  { slug: "rajkot", city: "Rajkot", state: "Gujarat", tier: 3, industries: ["Engineering", "Machine Tools", "Jewellery"], localAngle: "Saurashtra's engineering and machine-tools cluster", lat: "22.3039", lng: "70.8022" },
  { slug: "gandhinagar", city: "Gandhinagar", state: "Gujarat", tier: 3, industries: ["Government", "GIFT City Fintech", "IT Services"], localAngle: "GIFT City — India's international fintech experiment", lat: "23.2232", lng: "72.6500" },

  // ── Tier 2/3 — East & Northeast ───────────────────────────────────────
  { slug: "bhubaneswar", city: "Bhubaneswar", state: "Odisha", tier: 2, industries: ["IT Services", "Education", "Mining", "Tourism"], localAngle: "Temple city turned eastern IT hub", lat: "20.2961", lng: "85.8245" },
  { slug: "patna", city: "Patna", state: "Bihar", tier: 2, industries: ["Education", "Coaching", "Agri-trade", "Healthcare"], localAngle: "Bihar's capital — massive coaching economy and underdigitised retail", lat: "25.5941", lng: "85.1376" },
  { slug: "ranchi", city: "Ranchi", state: "Jharkhand", tier: 2, industries: ["Mining", "Education", "Manufacturing"], localAngle: "Jharkhand's capital with a mineral-economy services base", lat: "23.3441", lng: "85.3096" },
  { slug: "jamshedpur", city: "Jamshedpur", state: "Jharkhand", tier: 3, industries: ["Steel", "Automotive", "Industrial Services"], localAngle: "Tata's steel city — India's first planned industrial city", lat: "22.8046", lng: "86.2029" },
  { slug: "guwahati", city: "Guwahati", state: "Assam", tier: 2, industries: ["Tea Trade", "Tourism", "Oil & Gas", "Retail"], localAngle: "Gateway to the Northeast — the region's commercial capital", lat: "26.1445", lng: "91.7362" },
  { slug: "dhanbad", city: "Dhanbad", state: "Jharkhand", tier: 3, industries: ["Coal Mining", "Education", "Industrial Services"], localAngle: "India's coal capital with IIT-ISM's talent pool", lat: "23.7957", lng: "86.4304" },
  { slug: "asansol", city: "Asansol", state: "West Bengal", tier: 3, industries: ["Steel", "Coal", "Railways"], localAngle: "Bengal's industrial belt city on the Delhi-Howrah corridor", lat: "23.6850", lng: "86.9742" },
  { slug: "siliguri", city: "Siliguri", state: "West Bengal", tier: 3, industries: ["Tea Trade", "Tourism Gateway", "Logistics"], localAngle: "Chicken-neck corridor city — gateway to Darjeeling, Sikkim and Bhutan trade", lat: "26.7271", lng: "88.3953" },
];

export const getCityRegistryEntry = (slug: string) => CITY_REGISTRY.find((c) => c.slug === slug);
export const citiesByTier = (tier: CityTier) => CITY_REGISTRY.filter((c) => c.tier === tier);
export default CITY_REGISTRY;
