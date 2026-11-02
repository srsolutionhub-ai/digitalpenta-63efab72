/** Batch 2 editorial coverage. Strategy guidance, not measured SERP or auction data.
 * Localities indicate market context, never Digital Penta office locations.
 * Do not add performance, certification or local-client claims without evidence.
 */
import type { CityDepth } from "./cityDepth";

type Editorial = {
  slug: string;
  tagline: string;
  marketNotes: string[];
  districts: string[];
  serpReality: string;
  faqs: CityDepth["faqs"];
};

const EDITORIAL: Editorial[] = [
  {
    slug: "ahmedabad",
    tagline: "Product-led marketing for Ahmedabad's textile and industrial businesses",
    marketNotes: [
      "Ahmedabad's textile houses, pharmaceutical businesses and chemical suppliers sell into markets beyond Gujarat. A brochure website rarely answers enough procurement questions. Textile pages need fabric specifications and wholesale terms; chemical and pharma pages need accurate product information, documented capabilities and clear enquiry routes. Separate manufacturing from distribution so a buyer understands the role your business performs before requesting a quotation.",
      "Keep industrial acquisition separate from neighbourhood retail. Buyers researching suppliers in Naroda or Vatva have different needs from customers comparing businesses around Navrangpura or Satellite. English can support interstate procurement; Gujarati explanations may help local audiences. In the CRM, distinguish a sample request, distributor enquiry and retail purchase rather than counting them as equivalent leads. An AI enquiry assistant should collect the product and quantity, then hand technical commitments to your sales team.",
    ],
    districts: ["Navrangpura", "Satellite", "Prahlad Nagar", "Naroda", "Vatva", "Odhav"],
    serpReality: "Research supplier and retail queries separately. Specification-rich product pages address a different decision from neighbourhood service listings. A national supplier needs product-led coverage, not a collection of near-identical Ahmedabad locality pages.",
    faqs: [
      { q: "Can an Ahmedabad textile wholesaler attract buyers outside Gujarat?", a: "Target the interstate markets you can supply. Publish composition, widths, minimum quantities and dispatch terms, then ask for buyer location and order requirements. Separate wholesale demand from single-piece shopping in both campaigns and CRM reporting." },
      { q: "Should Ahmedabad campaigns use Gujarati or English?", a: "Match the language to the buying stage. English can support technical procurement; Gujarati may help local service explanations. Your landing page and follow-up team should support the advertised language. Compare qualified enquiries, not just click costs." },
    ],
  },
  {
    slug: "surat",
    tagline: "Clear buying paths for Surat's textiles, diamonds and property businesses",
    marketNotes: [
      "Surat's textile and diamond businesses need content that makes product differences legible. A fabric wholesaler should explain composition, finish, quantities and repeat-order arrangements. A diamond business needs accurate stone details and an appropriate trade or retail enquiry path. Attractive collection imagery helps discovery, but cannot replace the information a buyer needs before discussing an order.",
      "Textile trading around Ring Road, diamond activity in Varachha and Katargam, and residential demand around Vesu call for distinct campaigns. Property projects need separate budgets, verified availability and applicable registration information. Qualify collection enquiries by quantity, destination and buyer type. Catalogue requests should enter a sales queue with product interest attached; automation can route them without making stock or valuation promises.",
    ],
    districts: ["Ring Road", "Salabatpura", "Varachha", "Katargam", "Vesu", "Adajan"],
    serpReality: "Distinguish textile wholesale, diamond sourcing and residential site-visit intent before assessing search results. Their buyers require different evidence and should not share one generic enquiry funnel.",
    faqs: [
      { q: "How can a Surat wholesaler reduce single-piece enquiries?", a: "State wholesale-only terms and genuine minimum quantities in ads and catalogue pages. Ask whether the buyer is a retailer, reseller or distributor. Review search terms and creative against sales feedback instead of hiding trade conditions until a call." },
      { q: "Can our property and textile businesses share one campaign?", a: "Keep them separate. Homebuyers need project location, price context and a site-visit route; textile buyers need order specifications. Separate conversion goals and follow-up queues make each business's economics visible." },
    ],
  },
  {
    slug: "vadodara",
    tagline: "Technical clarity for Vadodara's engineering and chemical suppliers",
    marketNotes: [
      "Vadodara's chemical, pharmaceutical and engineering businesses need websites that help procurement teams evaluate fit. Explain materials, processes, equipment capabilities and the documentation available. Distinguish manufacturing from distribution and make supported certifications verifiable. Application pages and specific capability descriptions provide more useful information than broad claims of industry leadership.",
      "Makarpura and Nandesari provide industrial context; Alkapuri, Akota and Gotri involve a different mix of offices, retail and neighbourhood services. Industrial campaigns should follow buyer geography, which may extend outside Vadodara, rather than only a radius around a factory. Record drawing submissions, technically suitable enquiries and quotations through longer sales cycles. A small number of relevant procurement conversations can be more useful than a large form count.",
    ],
    districts: ["Makarpura", "Nandesari", "Gorwa", "Alkapuri", "Akota", "Gotri"],
    serpReality: "Assess results by product specification and application, not only broad chemical or engineering terms. Keep local consumer visibility separate from procurement content, and avoid repeating industrial-estate names as a substitute for technical substance.",
    faqs: [
      { q: "Should a Makarpura engineering firm target only Vadodara?", a: "Use Vadodara to establish the real location, then target territories your sales and delivery teams can support. Explain capabilities, quantity requirements and delivery limits. Ask for specifications and destination before qualifying an enquiry." },
      { q: "How do we measure engineering marketing when orders take months?", a: "Record enquiry source and stages such as technically suitable, quotation issued and order received. Review these with sales. Do not judge a long procurement cycle solely by monthly form totals or immediate revenue." },
    ],
  },
  {
    slug: "rajkot",
    tagline: "Put Rajkot's machine-tool capabilities in front of suitable buyers",
    marketNotes: [
      "Rajkot's engineering and machine-tool firms sell on fit: what a machine produces, the tolerances it supports and the service available after installation. Buyers need model specifications, useful demonstrations and quotation requirements. Jewellery businesses have a different journey, where design, material disclosure, store details and appointment handling deserve their own content.",
      "Industrial activity around Aji GIDC, Bhaktinagar and Metoda should not be mixed with retail audiences around Yagnik Road or Kalawad Road. Start with a narrow set of machines your team can quote and support. Gujarati explanations can help local discussions, while English specifications serve buyers elsewhere. Track application suitability and quotation progress before deciding which product line deserves more spend; a demonstration view alone is not a purchase signal.",
    ],
    districts: ["Aji GIDC", "Bhaktinagar", "Metoda GIDC", "Gondal Road", "Yagnik Road", "Kalawad Road"],
    serpReality: "Review model and application queries alongside broader machine-tool searches. Demonstrations should link to complete specification pages. Jewellery store discovery needs a separate local strategy rather than borrowing industrial keywords.",
    faqs: [
      { q: "Can a Rajkot manufacturer begin with a few product pages?", a: "Prioritise machines with clear applications and available sales support. Explain specifications, options and service arrangements. A few complete pages are more useful than a large catalogue containing only model names and enquiry buttons." },
      { q: "What should a machine demonstration video show?", a: "Identify the actual machine, material and operating conditions. Do not imply one demonstration guarantees every customer's output. Link to specifications and an enquiry form that captures the buyer's application." },
    ],
  },
  {
    slug: "gandhinagar",
    tagline: "Focused acquisition for Gandhinagar's IT and institutional service firms",
    marketNotes: [
      "Gandhinagar's government-oriented economy, IT businesses and the GIFT City ecosystem are not one audience. Public-sector suppliers need capability statements and awareness of formal procurement routes. IT providers need evidence of problems they can solve. Financial-sector service pages must distinguish technology support from regulated financial activity and avoid implying approvals or affiliations.",
      "Sector-based local demand, Infocity businesses and the GIFT City area call for different geographic assumptions. Build pages around specific requirements and qualify enquiries by organisation and scope. CRM follow-up can support longer institutional decisions; an AI assistant should explain published services, not eligibility for tenders or regulatory permissions. Neighbourhood consumer services need their own local targeting rather than inheriting institutional campaign settings.",
    ],
    districts: ["Sector 11", "Sector 16", "Sector 21", "Infocity", "Kudasan", "Raysan"],
    serpReality: "Government and GIFT City queries may concern official information, jobs or directions rather than buying a service. Research the commercial requirement and exclude unrelated paid-search intent. Do not imply government affiliation.",
    faqs: [
      { q: "Will advertising help us win government work in Gandhinagar?", a: "Advertising can make capabilities discoverable but cannot replace tender eligibility or procurement procedures. Keep official submission requirements separate from marketing enquiries. Never imply preferential access or an official affiliation." },
      { q: "Should our IT company target every GIFT City search?", a: "No. Many searches concern jobs, property or regulations. Target the technology services you genuinely provide, explain who they suit and exclude unrelated intent. A location reference should support a relevant offer, not substitute for one." },
    ],
  },
  {
    slug: "kolkata",
    tagline: "Distinct routes for Kolkata's trade, education and neighbourhood retail",
    marketNotes: [
      "Kolkata's manufacturers, education providers and retailers sit alongside tea and jute trading networks. Each needs different credibility online: tea buyers need grade and sourcing information; jute buyers need product and order specifications; prospective students need course and admission details. Established offline relationships remain valuable, while new buyers need enough information to assess a business before contacting it.",
      "Burrabazar wholesale demand, Dalhousie commercial offices and consumer catchments around Gariahat or Behala should not share an undifferentiated campaign. English content can serve institutional and interstate buyers; Bengali can make retail and education information accessible. Separate programme, product and seasonal reporting. A CRM should distinguish qualified trade enquiries from admissions interest, and any automated follow-up should reflect the specific requirement a person submitted.",
    ],
    districts: ["Burrabazar", "Dalhousie", "Park Street", "Gariahat", "Behala", "Tollygunge"],
    serpReality: "Evaluate course, retail and tea or jute sourcing queries independently. Complete programme information, reliable store details and specification-rich trade pages each answer a different buying decision; one broad city page cannot replace them.",
    faqs: [
      { q: "Should a Kolkata institute use Bengali and English campaigns?", a: "Test both where they match prospective students' needs and the teaching context. Keep eligibility, fees and dates consistent. Compare qualified applications and enrolment progress rather than only the price of a lead." },
      { q: "When should a retailer prepare for Durga Puja campaigns?", a: "Prepare photography, stock pages and tracking before your customers' seasonal shopping window. Use your inventory, delivery cut-offs and store capacity to set campaign dates. Separate seasonal results from regular trading." },
    ],
  },
  {
    slug: "asansol",
    tagline: "Practical acquisition for Asansol's industrial suppliers and local services",
    marketNotes: [
      "Asansol's steel, coal and railway-linked economy supports industrial supplies, maintenance and contractor services alongside everyday retail. Equipment suppliers need compatibility and delivery details; contractors need a clear service scope and quotation route. Railway-related businesses should distinguish independent commercial supply from official recruitment, ticketing and procurement information.",
      "Burnpur and adjoining neighbourhoods do not create an unlimited service radius. Travel time, delivery cost and access to industrial premises determine whether an enquiry is viable. Start with product lines and locations you serve reliably, with Bengali or Hindi explanations where helpful. Prioritise accurate business details, core service pages and call follow-up before several platforms. Route jobs and unrelated coal-information enquiries away from the sales pipeline.",
    ],
    districts: ["Burnpur", "Hirapur", "Chelidanga", "Ushagram", "Kanyapur", "Railpar"],
    serpReality: "Separate industrial product queries from local repair and retail searches. Broad coal and railway wording can carry news, recruitment or official-information intent. Clear commercial wording is a better starting point than high-volume ambiguity.",
    faqs: [
      { q: "Can an Asansol supplier advertise with a small budget?", a: "Choose a few stocked products or profitable services and a deliverable territory. Use pages with specifications and contact details. A limited budget spread over every product and the whole state is difficult to evaluate." },
      { q: "Should we target Durgapur with Asansol?", a: "Only when delivery, installation or site visits are practical. Track location and fulfilment costs separately. Do not claim a Durgapur office when your business operates only from Asansol." },
    ],
  },
  {
    slug: "siliguri",
    tagline: "Route-ready demand for Siliguri's tea, travel and logistics businesses",
    marketNotes: [
      "Siliguri connects tea trading, regional logistics and travel towards Darjeeling and Sikkim. These share a gateway city but not a conversion journey. Tea buyers need grades, quantities and dispatch details; freight customers need route coverage and shipment constraints; travellers need pickup arrangements, itineraries and booking conditions. Give each audience its own page and enquiry questions.",
      "Sevoke Road and Khalpara trading differ from transport and visitor demand around Pradhan Nagar and the wider NJP area. Arrival timing and destination matter for travel, while shipment economics control logistics targeting. Start with dependable routes or products. Update travel offers when weather or access changes. Automation should ask for dates or cargo details and refer uncertain availability to staff rather than confirming unsupported bookings.",
    ],
    districts: ["Sevoke Road", "Hill Cart Road", "Pradhan Nagar", "Khalpara", "Hakim Para", "Matigara"],
    serpReality: "Research specific transfers and itineraries separately from tea and freight sourcing. Clear pickup points, routes and booking terms support a different decision from wholesale grades and shipment constraints. Gateway geography alone does not establish cross-border capability.",
    faqs: [
      { q: "Should a Siliguri operator target travellers before arrival?", a: "Target people planning routes you actually operate. Explain NJP or Bagdogra pickup where offered, inclusions and cancellation terms. Ask for dates, party size and destination; describe permit responsibilities accurately." },
      { q: "How can a logistics company reduce unsuitable enquiries?", a: "Publish routes, shipment types and load limits. Ask for origin, destination, goods, weight and timing. Keep domestic freight separate from any genuinely supported cross-border services." },
    ],
  },
  {
    slug: "chennai",
    tagline: "Separate journeys for Chennai's factories, SaaS teams and clinics",
    marketNotes: [
      "Chennai's automotive suppliers, SaaS companies and hospitals sell to different audiences. Component buyers need materials, tolerances and production processes; software prospects need use-case content and a demo journey; clinic patients need accurate appointments within a realistic travel radius. Combining these under one city-wide campaign makes lead quality hard to judge.",
      "Ambattur and Guindy provide industrial context, while Perungudi and Sholinganallur connect with the OMR technology corridor. Test Tamil and English consumer messaging with landing pages and staff support in the advertised language. Report appointment requests, industrial RFQs and software demos separately. AI product demonstrations should explain integrations and data handling, while healthcare forms should avoid collecting sensitive medical histories for advertising purposes.",
    ],
    districts: ["Guindy", "Ambattur", "Perungudi", "Sholinganallur", "Anna Nagar", "T. Nagar"],
    serpReality: "Check healthcare, manufacturing and SaaS query sets independently. Software competitors may be national or international, not local. A city page supports context but cannot replace departmental, capability or product-use-case pages.",
    faqs: [
      { q: "Should a Chennai SaaS firm target only Chennai?", a: "Only when the product serves local customers exclusively. Organise campaigns around buyer problems, use cases and demo intent in markets your sales team supports. Your operating base is not necessarily your customer geography." },
      { q: "What should an Ambattur supplier publish before advertising?", a: "Explain processes, materials, equipment and inspection methods. Publish valid certifications only. Use a secure RFQ route for drawings and ask for quantities and specifications to identify viable production requirements." },
    ],
  },
  {
    slug: "coimbatore",
    tagline: "Make Coimbatore's engineering products easier to evaluate",
    marketNotes: [
      "Coimbatore's pump, motor, textile machinery and precision engineering businesses need technical clarity. Product pages should explain operating requirements, applications and relevant specifications rather than repeat a list of industries served. IT firms need a separate proposition built around delivery capabilities and customer problems, not equipment procurement language.",
      "A supplier in Ganapathy or Kurichi may sell across India. Separate local installation or servicing from dealer, OEM and procurement demand instead of using the factory location as an advertising boundary. Develop a few valuable product families properly before promoting the whole catalogue. Feed qualified RFQs into the CRM, allow for longer procurement cycles, and make datasheets accessible without forcing every visitor to disclose contact details.",
    ],
    districts: ["Peelamedu", "Ganapathy", "Kurichi", "RS Puram", "Saibaba Colony", "Saravanampatti"],
    serpReality: "Distinguish manufacturing, resale and repair intent when researching pump and machinery searches. Specifications and application fit matter more than adding Coimbatore to every heading. Keep product information crawlable and useful to procurement teams.",
    faqs: [
      { q: "How do industrial pump campaigns avoid household enquiries?", a: "State applications and operating specifications on dedicated pages. Review household, repair and spare-part searches, excluding only those outside your actual offer. Ask for duty conditions and intended use before quoting." },
      { q: "Can a Coimbatore manufacturer test national demand?", a: "Begin with a narrow product range or serviceable markets. Confirm freight, installation and after-sales coverage first. A focused national test may suit procurement buyers better than broad advertising near the factory." },
    ],
  },
  {
    slug: "madurai",
    tagline: "Distinct booking and trade routes for Madurai's businesses",
    marketNotes: [
      "Madurai combines temple-led travel with textile trading and food processing. Hotels need precise access, room and booking details; wholesalers need categories, minimum orders and dispatch terms; processors need pack sizes, shelf life and distribution coverage. These businesses should not share conversion targets or assume identical seasonal demand.",
      "East Masi Street trading differs from neighbourhood demand in Anna Nagar and KK Nagar or industrial activity around Kappalur. Confirm festival dates, inventory and relevant access restrictions before promoting travel offers. Tamil can support regional trade while clear English catalogues serve outside buyers. Record booking enquiries, wholesale requirements and distributor interest separately. An automated assistant should explain published inclusions but refer room availability and commercial negotiations to staff.",
    ],
    districts: ["East Masi Street", "Tallakulam", "Anna Nagar", "KK Nagar", "Thiruparankundram", "Kappalur"],
    serpReality: "Compare temple-stay, textile wholesale and food-distribution queries separately. Access information, order terms and distribution requirements provide useful differentiation without reducing every Madurai search to tourism.",
    faqs: [
      { q: "How can a Madurai hotel improve direct booking enquiries?", a: "Publish accurate routes, parking, room categories and cancellation terms. Verify actual walking access before claiming proximity. Compare acquisition costs with platform commissions and keep availability current." },
      { q: "What should a food processor show distributors?", a: "Provide pack sizes, shelf life, storage requirements and territories available for distribution. Include applicable licences accurately. Ask about the prospective distributor's location and capacity before discussing commercial terms." },
    ],
  },
  {
    slug: "trichy",
    tagline: "Capability-led fabrication and clear course discovery in Trichy",
    marketNotes: [
      "Trichy's fabrication market includes the industrial ecosystem around Thiruverumbur and Thuvakudi. Vendors need processes, materials, inspection and delivery capabilities without implying an approved BHEL relationship they cannot substantiate. Education providers face another challenge: helping families compare courses, eligibility, fees and application timelines.",
      "Concentrate engineering acquisition on a manageable set of fabrication requirements. Procurement buyers may be outside Trichy, so geography should follow supply capability. Education campaigns need confirmed intake periods and course-level demand, with Tamil explanations where helpful. Keep admissions out of industrial reporting and exclude recruitment or training searches where irrelevant. Secure document intake and staff review are more important to RFQs than automated price promises.",
    ],
    districts: ["Thillai Nagar", "Tennur", "Srirangam", "Cantonment", "Thiruverumbur", "Thuvakudi"],
    serpReality: "Capability-specific queries and course queries need separate result reviews. Unsupported industrial-brand references or near-identical neighbourhood pages do not establish credibility. Describe your own documented qualifications and the actual programme offered.",
    faqs: [
      { q: "Can a Trichy fabricator mention BHEL?", a: "Describe local context factually, but never imply approval or supply history without evidence and permission. Lead with your equipment, processes and qualifications. Share customer references only when authorised." },
      { q: "Should a college advertise throughout the year?", a: "Keep course details available year-round, but concentrate paid admissions around confirmed application windows. Track eligible applications and admissions, and pause promotions when the intake or counselling capacity is full." },
    ],
  },
  {
    slug: "salem",
    tagline: "Focused marketing for Salem's steel, textiles and seasonal trade",
    marketNotes: [
      "Salem's steel, textile and mango businesses need different buying information. Steel buyers need grades, dimensions and delivery coverage; textile buyers need construction and order terms; produce traders need variety, grading, packing and seasonal availability. A generic industrial page misses the details that determine whether an enquiry is worth pursuing.",
      "Begin with a maintainable website and one defined acquisition channel. Shevapet trading and the Steel Plant Road context differ from neighbourhood retail in Fairlands or Hasthampatti. Agricultural campaigns should follow confirmed stock and dispatch capacity, not run unchanged all year. A CRM can record available grades and destination interest, while staff retain control of rates and fulfilment. Evaluate viable orders rather than treating every price-check call as a lead.",
    ],
    districts: ["Shevapet", "Fairlands", "Hasthampatti", "Ammapet", "Suramangalam", "Alagapuram"],
    serpReality: "Separate buying intent from mango variety information and agricultural advice. Product specifications, current availability and wholesale terms help trading buyers; informational traffic alone does not establish profitable demand.",
    faqs: [
      { q: "When should Salem mango suppliers advertise?", a: "Prepare pages before your expected season, but promote stock only when grading and dispatch are confirmed. Update quantities and pause unavailable offers. Do not pay for enquiries against stock you cannot fulfil." },
      { q: "How can a steel trader avoid irrelevant enquiries?", a: "List actual grades, dimensions, minimum quantities and delivery areas. Ask for quantity and destination. Exclude scrap, jobs or consumer products only when they are outside your supply scope." },
    ],
  },
  {
    slug: "tirupur",
    tagline: "Manufacturing-led discovery for Tirupur's knitwear suppliers",
    marketNotes: [
      "Tirupur's knitwear buyers need composition, GSM, construction, sampling, minimum quantities and quality-control information. Explain which operations are in-house and which use production partners. Export credentials must be current and verifiable. Attractive garment photographs cannot replace documentation a sourcing team needs before discussing a production order.",
      "Separate export manufacturing, domestic wholesale and job work: their quantities and sales cycles differ. English capability pages can serve international sourcing; Tamil can support local production discussions. Target buyer markets only when shipping and follow-up are ready. Record sample discussions and qualified RFQs rather than social engagement. A controlled catalogue-sharing workflow should protect customer designs and confidential tech packs, not expose them as public evidence of capability.",
    ],
    districts: ["Kumaran Road", "Rayapuram", "Odakkadu", "Kongu Nagar", "Palladam Road", "Avinashi Road"],
    serpReality: "Differentiate OEM, private label, wholesale stock and job work in query research. Broad T-shirt searches can mean consumer shopping. Production and order details provide a more useful sourcing proposition than city-name repetition.",
    faqs: [
      { q: "How do Tirupur suppliers attract production orders?", a: "State your manufacturing model, minimum quantities and categories. Ask for quantity, destination and specifications. Maintain separate ready-stock pages if you also serve retail or smaller wholesale buyers." },
      { q: "What should buyers see before requesting a garment quote?", a: "Show fabric options, relevant GSM ranges, sampling and lead-time guidance. Explain quality checks and valid certifications. Accept tech packs securely and do not publish confidential customer designs." },
    ],
  },
  {
    slug: "kochi",
    tagline: "Different routes for Kochi's stays, spice trade and IT services",
    marketNotes: [
      "Kochi combines hospitality, the Mattancherry spice trade, marine businesses and IT services around Kakkanad. Travellers compare stay location and availability; spice buyers check grades and shipment terms; marine procurement teams need technical suitability; IT prospects evaluate delivery capability. Broad campaigns aimed at everyone interested in Kochi serve none of these decisions particularly well.",
      "Fort Kochi and Mattancherry support visitor discovery, while Kakkanad, Kalamassery and Willingdon Island introduce technology and port-related contexts. Distinguish a property's location from its excursion coverage. Trade pages need documentation and qualified enquiries. Malayalam can support local communication and English outside buyers. Route booking and procurement enquiries separately; do not let automated itinerary answers imply permits, stock or capacity your team has not confirmed.",
    ],
    districts: ["Fort Kochi", "Mattancherry", "Kakkanad", "Edappally", "Kalamassery", "Willingdon Island"],
    serpReality: "Research Kochi, Cochin and Ernakulam wording in context without duplicating pages for names. Stay bookings, marine sourcing and IT services need different evidence, and Kakkanad queries may also include employment intent.",
    faqs: [
      { q: "Should our site say Kochi, Cochin or Ernakulam?", a: "Use the name that accurately describes the business location, with alternatives naturally where useful. Ernakulam can refer to the district or mainland area. Provide a precise address rather than three duplicate city-name pages." },
      { q: "What should a Kochi spice enquiry form collect?", a: "Ask for commodity, grade, quantity, packing, destination and required documentation. Publish only quality claims you can support. Separate export wholesale enquiries from small domestic retail orders." },
    ],
  },
  {
    slug: "calicut",
    tagline: "Local ordering and wholesale discovery for Kozhikode's trading economy",
    marketNotes: [
      "Kozhikode, also searched as Calicut, includes food businesses, wholesale commerce and timber-related activity around Kallai. Restaurants need current menus and hours; packaged-food sellers need delivery and shelf-life information; timber merchants need species, dimensions, treatment and lawful sourcing documentation where applicable. One generic local campaign cannot meet these information needs.",
      "Match geography to fulfilment. Food campaigns around Palayam or Nadakkavu should reflect actual delivery times; Valiyangadi traders may serve outside buyers. Malayalam can clarify local ordering while English helps interstate enquiries. Monitor completed orders and repeat purchases rather than assuming video reach produces sales. Keep timber specifications and food inventory under staff control, with assistants limited to approved catalogue information and enquiry routing.",
    ],
    districts: ["SM Street", "Palayam", "Nadakkavu", "Kallai", "Valiyangadi", "Mavoor Road"],
    serpReality: "Maintain one coherent identity for Calicut and Kozhikode. Food ordering, timber procurement and wholesale commerce need separate result reviews and useful product detail, not duplicate name-variant landing pages.",
    faqs: [
      { q: "Do we need separate Calicut and Kozhikode pages?", a: "Not when both describe the same service and coverage. Use both names naturally and keep business details consistent. Additional pages should address genuinely distinct services or locations." },
      { q: "Can food videos create profitable local demand?", a: "Include ordering details and promote within a viable delivery area. Track completed orders, value and delivery costs. Engagement outside that area does not demonstrate profitable demand." },
    ],
  },
  {
    slug: "nagpur",
    tagline: "Commercial enquiries for Nagpur's freight, orange trade and IT firms",
    marketNotes: [
      "Nagpur's logistics firms, orange traders, manufacturers and IT businesses require different routes to market. Transport customers need routes and load information; wholesale fruit buyers need grades, packaging and quantities. MIHAN-facing technology firms may sell beyond Nagpur, so their websites should explain capabilities rather than depend on city-name searches.",
      "Separate regional trade from neighbourhood demand. Cover freight routes actually operated and agricultural availability that can be fulfilled. Manufacturers need quotation specifications; local services need accessible appointments. Record qualified freight requests, wholesale enquiries and sales meetings separately. Workflow automation can assign each to the right team, while stock, rates and delivery commitments remain subject to approval rather than an unrestricted chatbot response.",
    ],
    districts: ["Sitabuldi", "Dharampeth", "Itwari", "Kalamna", "Hingna", "Wardha Road"],
    serpReality: "Review freight routes, orange sourcing and neighbourhood services as distinct query groups. Operational details can help buyers evaluate you beyond a directory entry; general traffic is not a measure of commercial fit.",
    faqs: [
      { q: "Should a Nagpur transporter advertise nationally?", a: "Only for routes you can accept and fulfil. Explain vehicle types and service limits, then ask for origin, destination and shipment details before marking a request qualified." },
      { q: "How can an orange trader attract wholesale buyers?", a: "Publish grades, pack formats, minimum quantities and dispatch terms. Use a wholesale form and keep availability current. Separate small retail enquiries rather than treating all requests as equal." },
    ],
  },
  {
    slug: "nashik",
    tagline: "Separate industrial quotations and visitor bookings in Nashik",
    marketNotes: [
      "Nashik combines Ambad and Satpur manufacturing with vineyard visits and pilgrimage travel. Industrial buyers compare machinery, components and supply capability; visitors compare access, timings and booking conditions. A manufacturer needs technical pages, while a hospitality operator needs clarity about the experience being booked, not the same city-wide promotion.",
      "Plan visitor campaigns around real availability and verified dates. Distinguish tours, dining and accommodation from alcohol promotion, checking platform policies and applicable law before launch. Industrial campaigns can follow product demand on a steadier schedule, with drawing and quantity enquiries routed to sales. CRM reporting should keep travel bookings separate from RFQs. Automation can send published booking terms, but must not offer unavailable dates or unapproved industrial pricing.",
    ],
    districts: ["Ambad", "Satpur", "Panchavati", "Nashik Road", "Gangapur Road", "Indira Nagar"],
    serpReality: "Separate component sourcing, stays and pilgrimage planning during research. Match pages to specific decisions and avoid treating informational attraction searches as booking demand. Tourism creative needs policy review where alcohol-related content is involved.",
    faqs: [
      { q: "Can a Nashik vineyard advertise tours on social platforms?", a: "Review the offer, audience, creative and landing page against current policies and law. An experience-led ad is not automatically permitted because it omits a bottle image. State inclusions accurately." },
      { q: "Should vineyard and pilgrimage guests see the same campaign?", a: "Their itineraries and reasons for visiting differ. Use separate pages and budgets, with actual travel arrangements. Do not imply all attractions are close to your property." },
    ],
  },
  {
    slug: "aurangabad",
    tagline: "Capability-led marketing in Chhatrapati Sambhajinagar",
    marketNotes: [
      "Chhatrapati Sambhajinagar, also searched as Aurangabad, serves automotive manufacturing, pharmaceutical businesses and heritage travel. Waluj and Shendra suppliers need processes, capacity and documented quality information. Operators serving Ajanta and Ellora need pickup details, travel arrangements and current access information, not an industrial sales funnel.",
      "Use current and former city names naturally while keeping the official business identity consistent. Begin with a narrow commercial objective rather than several thin campaigns. Industrial buyers may need regional or national targeting; hospitality requires separate booking measurement. Pharmaceutical content needs compliance review. Keep documents, quotations and visitor bookings in appropriate workflows so automation cannot confuse a production request with a tour reservation.",
    ],
    districts: ["Waluj", "Shendra", "Chikalthana", "CIDCO", "Osmanpura", "Garkheda"],
    serpReality: "Research both city names without creating duplicate versions. Heritage planning and component sourcing need different commercial pages. Precise itineraries and documented capabilities support buyers better than generic location repetition.",
    faqs: [
      { q: "Should our website use Aurangabad or Chhatrapati Sambhajinagar?", a: "Use the current name in location details and mention Aurangabad where it helps recognition. Keep official records consistent. Do not duplicate the whole site for each name." },
      { q: "What should an Ajanta–Ellora tour page explain?", a: "State whether it covers one site or both, the starting point, transport and cancellation terms. Verify current opening information and avoid presenting either as a short city-centre transfer." },
    ],
  },
  {
    slug: "jabalpur",
    tagline: "Focused acquisition for Jabalpur's suppliers, institutes and visitor services",
    marketNotes: [
      "Jabalpur's defence-related industry, education, marble businesses and tourism create distinct markets. Suppliers should demonstrate capabilities without implying government approval. Marble sellers need to distinguish slabs, finished products and installation from Marble Rocks sightseeing. Bhedaghat travel services need practical visitor information rather than stone-trade specifications.",
      "Choose a focused website and one measurable channel before a broad launch. Education campaigns need course and intake detail; material enquiries need dimensions and destination. Tourism offers require current operating information because conditions can affect activities. Keep government procurement on official procedures, separate from ordinary advertising. A CRM should route material requirements, course interest and bookings to different owners and preserve the information needed for each next step.",
    ],
    districts: ["Wright Town", "Napier Town", "Vijay Nagar", "Madan Mahal", "Adhartal", "Gohalpur"],
    serpReality: "Marble Rocks queries may be sightseeing, not stone purchases. Defence terms can mean jobs or official procurement. Use explicit product and service language, with exclusions informed by actual search terms rather than broad assumptions.",
    faqs: [
      { q: "Why do marble campaigns receive tourist enquiries?", a: "Broad wording can overlap with Marble Rocks sightseeing. Use slab, finish or installation terms and exclude irrelevant tourism intent. Make sales pages clearly about material quantities and delivery." },
      { q: "Can marketing secure defence contracts?", a: "A credible site supports evaluation but does not replace vendor eligibility or tender procedures. Publish supportable credentials and follow official procurement routes. Never imply an endorsement that has not been granted." },
    ],
  },
  {
    slug: "raipur",
    tagline: "Specification-led sales conversations for Raipur's trade businesses",
    marketNotes: [
      "Raipur's steel, mining-linked supply, agricultural trade and property businesses follow different cycles. Steel buyers need grades, sections and dispatch information; agricultural dealers need territory and availability; property prospects need project-specific details and a credible site-visit route. One generic lead campaign makes useful qualification difficult.",
      "Urla and Siltara industrial demand differs from residential catchments around Shankar Nagar or Telibandha. Suppliers may need state-wide reach, while property ads must show actual location and applicable registration disclosures. Distinguish requirements from price checks and recruitment messages. Product quantities, desired territory and project budget should be attached to the CRM record; sensitive documents or unapproved stock rates should not enter an unrestricted automated reply.",
    ],
    districts: ["Urla", "Siltara", "Tatibandh", "Pandri", "Shankar Nagar", "Telibandha"],
    serpReality: "Review steel sourcing, agriculture and property queries separately. Commodity price research is not necessarily purchase intent. Specific supply specifications and current project details provide a stronger basis for pages than claims of serving every industry.",
    faqs: [
      { q: "Should a Raipur steel trader publish prices?", a: "Only if you can keep them current and clarify grade, quantity, taxes and freight. Otherwise provide specifications and a quotation route asking for tonnage and destination." },
      { q: "How can property campaigns reduce irrelevant leads?", a: "State actual location, property type, verified availability and applicable registration details. Ask about budget and timing. Measure qualified conversations and site visits rather than inexpensive forms alone." },
    ],
  },
  {
    slug: "jamshedpur",
    tagline: "Capability-led marketing for Jamshedpur's industrial supply chain",
    marketNotes: [
      "Jamshedpur's fabricators, maintenance contractors and component suppliers need to explain what they deliver. Materials, processes, equipment and service availability belong on their pages. Being part of an industrial ecosystem does not establish an approved relationship with a major manufacturer; customer names and logos require accurate, authorised use.",
      "Separate plant procurement from consumer demand in Bistupur and Sakchi. A contractor may need a few suitable plant enquiries, while a retailer needs nearby calls and visits. Describe genuine coverage of adjoining Adityapur accurately rather than treating it as a Jamshedpur neighbourhood. Track opportunity value and quotation progress. An enquiry assistant can collect equipment and site requirements, but vendor credentials and response-time commitments must come from verified information.",
    ],
    districts: ["Bistupur", "Sakchi", "Golmuri", "Burmamines", "Telco Colony", "Mango"],
    serpReality: "Broad steel and automotive wording can include employment and major-company navigation. Process and application pages offer a clearer supplier proposition than relying on prominent industrial brand names to attract traffic.",
    faqs: [
      { q: "Can we use major steel-company names on our site?", a: "Describe genuine experience only where disclosure is permitted. Logos and testimonials require authorisation. Do not imply vendor approval or endorsement without evidence; lead with your own documented capabilities." },
      { q: "Should a Jamshedpur supplier target Adityapur?", a: "Yes when it genuinely supplies or services that adjoining market. Explain coverage and response arrangements, and report those enquiries separately where useful. Do not create a fictitious branch address." },
    ],
  },
  {
    slug: "dhanbad",
    tagline: "Relevant enquiries for Dhanbad's industrial services and education providers",
    marketNotes: [
      "Dhanbad's coal economy supports equipment suppliers, workshops and transport operators alongside education demand. Industrial buyers need compatibility, repair scope, site access and territory information. Education providers need transparent courses and admissions, without implying an affiliation with IIT (ISM) or another institution they do not hold.",
      "Concentrate on a commercially useful niche instead of broad mining traffic. Searchers may want jobs, exams, coal prices or official information rather than a contractor. Saraidhela, Hirapur and Bank More consumer catchments differ from mining-area service coverage around Jharia. Use Hindi and English where customers need them. CRM qualification should capture the machine, fault or course and send recruitment requests to a separate route rather than inflate sales totals.",
    ],
    districts: ["Bank More", "Hirapur", "Saraidhela", "Bartand", "Dhaiya", "Jharia"],
    serpReality: "Use explicit repair, supply and course requirements in research. Broad mining and institutional-name searches may be informational or navigational. High-volume ambiguous keywords should not consume a limited budget without a commercial-intent check.",
    faqs: [
      { q: "How should mining-area repair services advertise?", a: "List equipment types, workshop or on-site availability and genuine authorisations. Ask for the machine, fault and site location. Do not promise unsupported safety credentials, access permissions or emergency response times." },
      { q: "Can a coaching centre mention IIT (ISM)?", a: "Accurately describe learning needs or examinations, but do not imply affiliation or guaranteed admission. Make your independent identity clear and use only verifiable credentials and authorised outcomes." },
    ],
  },
  {
    slug: "bhubaneswar",
    tagline: "Different journeys for Bhubaneswar's IT teams, campuses and tourism firms",
    marketNotes: [
      "Bhubaneswar combines IT services, education, temple tourism and suppliers to Odisha's mining economy. Patia and Chandrasekharpur technology firms may seek clients outside the state; colleges need course-specific admissions; visitor-facing businesses need booking and access details. An office in the capital does not establish field-service capability across mining areas.",
      "Separate software consultations, admissions and bookings. IT pages need delivery arrangements and substantiated experience; education pages need eligibility, fees and the qualification offered. Tourism content should explain itinerary boundaries and practical access. Odia and English can serve different audiences when both are maintained accurately. Route requirements through distinct CRM stages and keep student documents or sensitive consultation details away from advertising audience collection.",
    ],
    districts: ["Patia", "Chandrasekharpur", "Saheed Nagar", "Jaydev Vihar", "Khandagiri", "Old Town"],
    serpReality: "Review course comparisons, temple-trip planning and IT vendor shortlisting separately. Technology competitors may be national. Each decision requires its own evidence rather than one broad city-keyword proposition.",
    faqs: [
      { q: "Does a nationally selling IT firm need local SEO?", a: "Maintain accurate business details, but prioritise capabilities and evidence relevant to national buyers. A local presence supports credibility without necessarily being the main source of projects." },
      { q: "Can one page cover Bhubaneswar, Puri and Konark tours?", a: "When it describes a real itinerary with starting points, travel and inclusions. Do not imply all destinations are inside the city. Separate pages should represent genuinely different offers." },
    ],
  },
  {
    slug: "meerut",
    tagline: "From Meerut's sports workshops to dealer and institutional buyers",
    marketNotes: [
      "Meerut's sports-goods firms serve players, schools, clubs, dealers and private-label customers. Bulk buyers need specifications, minimum quantities, customisation and dispatch information, not only a gallery of equipment. Brassware needs a separate catalogue, while education and property businesses depend on enquiries tied to a course or neighbourhood.",
      "Separate wholesale acquisition from retail before choosing channels. Product SEO can reach institutional buyers outside Meerut; paid search can test defined categories and delivery areas. Social demonstrations should not be counted as wholesale demand. Attach quantity, buyer type and product to each CRM record. Education or property campaigns need their own landing pages and follow-up so an equipment request does not receive a course or site-visit message.",
    ],
    districts: ["Shastri Nagar", "Saket", "Ganga Nagar", "Pallavpuram", "Suraj Kund", "Partapur"],
    serpReality: "Compare product and buyer-type queries instead of treating broad cricket-bat searches as institutional supply intent. Local admissions and services need another approach, with accurate profiles and useful neighbourhood information.",
    faqs: [
      { q: "How can Meerut manufacturers attract dealers?", a: "Build a wholesale section with minimum quantities, branding options and dispatch terms. Ask for business name, quantity and destination. Keep wholesale and consumer campaigns separate." },
      { q: "Can equipment and academy offers share one campaign?", a: "They need separate pages and goals. Equipment buyers compare products and delivery; academy prospects need schedules, age groups, facilities and location. A shared brand does not make the journeys identical." },
    ],
  },
  {
    slug: "ghaziabad",
    tagline: "Industrial supply and residential acquisition with clear NCR boundaries",
    marketNotes: [
      "Ghaziabad combines industrial purchasing with NCR residential demand. Steel suppliers and fabricators need grades, tolerances and delivery scope; property and home-service firms need neighbourhood-specific information. An industrial buyer in Sahibabad and a household in Indirapuram require different evidence despite sharing a city.",
      "Keep campaign boundaries tight. Separate material supply, fabrication and residential services, matching each to actual coverage. Broad NCR targeting can spread a test budget across unsuitable areas. Track qualified requirements, site visits and quotations rather than all calls equally. Check actual user-location reports and geographic settings. Workflow automation should route drawings to technical sales and property budgets to the appropriate project team, not merge them into generic follow-up.",
    ],
    districts: ["Indirapuram", "Vaishali", "Vasundhara", "Raj Nagar", "Crossings Republik", "Sahibabad"],
    serpReality: "Research residential, property and fabrication queries from the intended service area. NCR location wording alone does not reliably restrict enquiries. Pages should state actual service limits and present verified project or technical details.",
    faqs: [
      { q: "Why are Ghaziabad campaigns receiving wider NCR enquiries?", a: "Check geographic options and user-location reports. Use presence-based settings where available, exclude unserved areas and name coverage on the page. Keyword wording alone cannot reliably impose a boundary." },
      { q: "How should fabrication enquiries be qualified?", a: "Ask for material, dimensions or drawings, quantity, site location and timeline. Distinguish supply from installation. Review quotation-stage opportunities before raising spend." },
    ],
  },
  {
    slug: "gorakhpur",
    tagline: "Practical information for Gorakhpur's city and regional customers",
    marketNotes: [
      "Gorakhpur serves customers from surrounding eastern UP districts as well as the city. Hospitals and education providers need directions and dependable appointment or admissions handling for visitors planning travel. Retailers need to distinguish walk-ins from delivery orders. Border-trade context does not mean every business should advertise across Nepal without genuine supply arrangements.",
      "Separate city and regional audiences. Healthcare content needs accurate credentials and responsible expectations; education needs eligibility and dates. Hindi can answer practical questions where customers prefer it. Terracotta sellers need another product strategy covering dimensions, packaging and shipping costs. Keep sensitive medical details out of advertising forms, and track regional counselling, appointments and shipped craft orders as different outcomes rather than one lead total.",
    ],
    districts: ["Golghar", "Civil Lines", "Basharatpur", "Shahpur", "Rustampur", "Rapti Nagar"],
    serpReality: "Regional searches may name Gorakhpur even when the searcher lives elsewhere. Directions and schedules help those customers. Terracotta commerce needs product-led research and shipping information, not just a local business listing.",
    faqs: [
      { q: "Should a Gorakhpur clinic target nearby districts?", a: "Consider actual patient travel and capacity. Explain appointment timing, address and services, then test regional demand separately. Do not imply branches in towns where none exist." },
      { q: "Can terracotta sellers advertise outside the region profitably?", a: "Calculate packaging, freight, breakage and replacements first. Publish dimensions and delivery terms, then test selected destinations. Judge completed orders and margin, not messages alone." },
    ],
  },
  {
    slug: "jhansi",
    tagline: "Useful digital foundations for Jhansi's trade, education and engineering firms",
    marketNotes: [
      "Jhansi's Bundelkhand trading and education role creates demand for course details, stock information and reliable local suppliers. Defence-corridor context gives engineering firms a reason to improve capability documentation, not a basis for guaranteed-contract claims. Procurement work requires evidence of equipment, processes and qualifications; local trade needs quick answers about delivery and availability.",
      "For an owner-managed business, establish accurate profiles, a focused site and reliable phone or WhatsApp handling before several channels. Test one product or course first. Institutional suppliers should invest in technical pages and quotation routing rather than broad social reach. Separate local trade from longer procurement discussions. Automated reminders can support follow-up, but eligibility, tender submissions and technical commitments need accountable human review.",
    ],
    districts: ["Sipri Bazaar", "Sadar Bazaar", "Civil Lines", "Elite Chauraha", "Nandanpura", "Prem Nagar"],
    serpReality: "Everyday local discovery and defence procurement are different processes. A supplier site can support technical verification; it cannot replace official notices or procurement eligibility. Avoid presenting a city ranking as access to contracts.",
    faqs: [
      { q: "Can digital marketing bring defence-related work to a Jhansi workshop?", a: "It can make capabilities verifiable but cannot replace qualification or procurement procedures. Publish actual equipment and held certifications; monitor official opportunities separately." },
      { q: "Should a Jhansi trader target all Bundelkhand?", a: "Start with destinations you deliver to reliably. Publish products, minimum terms and coverage, then test wider areas separately. Specific fulfilment answers matter more than a broad regional label." },
    ],
  },
  {
    slug: "moradabad",
    tagline: "Make Moradabad's metalwork easier for wholesale buyers to assess",
    marketNotes: [
      "Moradabad's brassware and handicraft exporters need to help buyers evaluate suppliers remotely. Photographs need dimensions, materials, finishes, packing and production information. Importers, hospitality purchasers and retailers have different approval cycles. A single decorative-item request should not share qualification rules with a private-label collection enquiry.",
      "Organise collections by product type and intended use, explain sampling and provide a quotation route. Overseas campaigns should begin only when logistics and sales support are ready. Social can introduce finishes, but sample requests and quotations are more useful measures than followers. Protect exclusive designs with controlled catalogue sharing and permissions. An AI assistant should use approved product facts, not disclose confidential customer collections or invent compliance claims.",
    ],
    districts: ["Civil Lines", "Kanth Road", "Ram Ganga Vihar", "Lajpat Nagar", "Katghar", "Pakbara"],
    serpReality: "Inspect wholesale and consumer queries in the intended buyer markets. Export search results cannot be inferred from a search made only in India. Detailed collections and verifiable production information should underpin any international test.",
    faqs: [
      { q: "What can exporters publish without exposing confidential designs?", a: "Use approved collections and representative finishes with permitted specifications. Keep exclusive designs private unless authorised. Offer controlled catalogue access for qualified buyers." },
      { q: "Should we advertise overseas before rebuilding a catalogue?", a: "Fix product details, sampling, packaging, lead-time guidance and monitored enquiry handling first. Then test a narrow category in a supply-ready market. An incomplete catalogue can leave serious buyers unable to assess fit." },
    ],
  },
  {
    slug: "aligarh",
    tagline: "Product-led enquiry journeys for Aligarh's lock and hardware manufacturers",
    marketNotes: [
      "Aligarh's lock and hardware firms need to distinguish consumer replacements from dealer, OEM and project supply. Buyers require model dimensions, materials, finishes and compatible applications. Education creates a separate audience needing course or accommodation information rather than industrial specifications, with institutional affiliations stated accurately.",
      "Use consistent model codes, clear datasheets and separate dealership and custom-manufacturing routes. Test specific product families and review locksmith repair or employment intent when irrelevant. A CRM should preserve model, quantity and intended use so dealers can reorder correctly. Automated catalogue search can help identify a product, but security claims and compatibility commitments need verified data and escalation where specifications are unclear.",
    ],
    districts: ["Tala Nagri", "Sasni Gate", "Ramghat Road", "Marris Road", "Civil Lines", "Dodhpur"],
    serpReality: "Lock searches may mean shopping, wholesale supply or emergency repair. Establish order type clearly rather than chasing the generic word. Education queries need a separate identity and affiliation check.",
    faqs: [
      { q: "Why do lock-manufacturing ads attract repair calls?", a: "Generic terms can include locksmith intent. Review actual searches and exclude services you do not offer. Clearly state manufacturing or wholesale supply and ask for quantity and business type." },
      { q: "Does each lock model need its own page?", a: "Use separate pages for meaningful application or specification differences. Minor finish variants can share a structured page. Keep codes, dimensions and downloads consistent for accurate dealer reorders." },
    ],
  },
  {
    slug: "saharanpur",
    tagline: "Show Saharanpur's carving detail and practical supply information",
    marketNotes: [
      "Saharanpur's wood-carving and furniture firms must help remote buyers inspect a product through content. Pages need dimensions, verified species, finish, assembly and packing details, with photographs showing scale and carving. Export buyers need sampling and production terms; local buyers need delivery and installation. Paper supply is another specification-led market.",
      "Begin with repeatable products your workshop can photograph and supply accurately. Search can test specific furniture requirements while social shows craft detail; qualify by quantity, destination and customisation. Paper suppliers should prioritise grade, GSM and sizes rather than lifestyle creative. Track fulfilment costs and returns, and do not let automated estimates commit to freight or custom production before staff review the requirement.",
    ],
    districts: ["Railway Road", "Court Road", "Mission Compound", "Chilkana Road", "Delhi Road", "Ambala Road"],
    serpReality: "Carved decor, local showrooms and paper supply need distinct query research. Accurate sizing and delivery information provide more practical value than a large gallery of products that cannot currently be supplied.",
    faqs: [
      { q: "Can a small workshop market without a large catalogue?", a: "Start with repeatable products, accurate dimensions and production guidance. Show details and the full piece for scale. A dependable small collection is better than many unsupported product images." },
      { q: "Should carved-furniture ads target all India?", a: "Establish where packing, freight and installation work commercially. State delivery terms and begin there. Review margin after shipping and damage costs before expanding." },
    ],
  },
  {
    slug: "panipat",
    tagline: "Separate wholesale and household demand for Panipat's furnishings",
    marketNotes: [
      "Panipat's rugs, throws, bath mats and textile firms serve importers, wholesalers and households with different expectations. Pages need dimensions, composition, construction and packing. Recycling businesses must identify accepted or supplied materials. Refinery-linked services need capability and procurement information rather than consumer-facing promotion.",
      "Choose wholesale or direct retail goals before allocating spend. Private-label work needs samples and minimum quantities; consumer selling needs inventory, shipping and returns. Record these as separate CRM pipelines. Any sustainability claim requires product-specific support, not assumptions from the city's recycling activity. Workflow tools can manage sample follow-up and catalogue enquiries while keeping certification scope and pricing subject to verified source data.",
    ],
    districts: ["Model Town", "Tehsil Camp", "Huda Sector 11", "Huda Sector 12", "Babail Road", "Barsat Road"],
    serpReality: "Review shopping, wholesale and recycling intent separately. Material specifications reduce unrelated scrap enquiries. A local ranking does not confer a refinery vendor relationship or procurement approval.",
    faqs: [
      { q: "Should a textile manufacturer sell directly or focus on wholesale?", a: "Base it on capacity and margin. Retail requires fulfilment and returns; wholesale requires samples and longer follow-up. If serving both, separate buying paths and profitability reporting." },
      { q: "How should recycled textiles be described?", a: "State only substantiated composition and recycled-content information for the product. Identify certifications accurately and within scope. Avoid blanket environmental claims because the business handles recycled materials." },
    ],
  },
  {
    slug: "chandigarh",
    tagline: "Sector-aware acquisition for Chandigarh's specialist services",
    marketNotes: [
      "Chandigarh's healthcare, education and professional services need different evidence from IT firms selling beyond the city. Patients need practitioner credentials and appointments; families compare programmes and eligibility; businesses need service scope. The administrative economy also includes government-facing suppliers, whose formal procurement must remain separate from commercial leads.",
      "Sector convenience matters for appointments, while IT consultancies may need national targeting. Treat Mohali and Panchkula as distinct Tricity markets; a Chandigarh address does not establish a physical office in either. Follow attended appointments, qualified consultations and opportunities rather than assuming all local purchasing is premium. Automations should preserve branch or service preference and escalate sensitive consultations instead of turning them into advertising audience data.",
    ],
    districts: ["Sector 8", "Sector 17", "Sector 22", "Sector 26", "Sector 34", "Sector 35"],
    serpReality: "Distinguish sector-specific intent from Tricity comparisons. Keep accurate addresses and substantial specialist pages; do not manufacture coverage through duplicate profiles or sector pages with no useful differences.",
    faqs: [
      { q: "Should a Chandigarh clinic advertise across Tricity?", a: "Start with realistic travel areas and report Chandigarh, Mohali and Panchkula separately where possible. Compare attended appointments and cancellations. Business profiles should represent genuine eligible locations only." },
      { q: "Can marketing bring government contracts to an IT firm?", a: "A credible site supports capability evaluation, not tender eligibility or awards. Keep registrations and procurement procedures separate from private-sector campaigns. Never imply paid enquiries confer official access." },
    ],
  },
  {
    slug: "karnal",
    tagline: "Trade-ready discovery for Karnal's mills and agricultural suppliers",
    marketNotes: [
      "Karnal's rice milling, processing and agricultural ecosystem has buyers outside the GT Road corridor. Mills need varieties, grades, packaging and order terms; equipment suppliers need specifications, applications and servicing. Research institutions provide context, not grounds for an unsubstantiated partnership or endorsement claim.",
      "Invest first in a useful trade catalogue. Separate domestic wholesale, export and dealer enquiries with quantity, destination and packing fields. Paid search can test specific products outside Karnal, while local profiles help genuine factory visits. Budget around procurement and staff capacity rather than uniform monthly lead volume. CRM reminders can follow sample and quotation progress; assistants should not invent export documentation or product certification.",
    ],
    districts: ["Model Town", "Sector 6", "Sector 7", "Sector 12", "Sector 13", "New Grain Market"],
    serpReality: "Rice procurement needs grades and trade terms, not a generic introduction. Local maps support finding a mill or office, a different need from distributor acquisition. Keep actual addresses and visiting arrangements accurate.",
    faqs: [
      { q: "How can a rice mill reduce small retail enquiries?", a: "State grades, pack formats and minimum quantities. Ask for tonnage and destination, with clear buyer types. Separate household terms in paid search when you do not supply them." },
      { q: "What is needed before international rice advertising?", a: "Accurate product details, commercial contacts and market coverage, with applicable certifications. Start with a limited destination set and confirm documentation and quotation handling first." },
    ],
  },
  {
    slug: "hisar",
    tagline: "Quotation-led marketing for Hisar's steel, agriculture and dealerships",
    marketNotes: [
      "Hisar's steel, agricultural trade and dealerships require distinct journeys. Material buyers need grades, dimensions and delivery; agricultural buyers may need seasonal availability and service; vehicle prospects compare variants and quotations before visiting. One awareness campaign hides which requirements fit current stock and margins.",
      "Choose one objective first: quotations, dealer applications or showroom visits. Industrial campaigns can reach outside Hisar, while dealerships need a viable catchment. Use Hindi and English where useful and record product interest on every enquiry. CRM workflows can manage follow-up and test drives, but prices, financing and stock must be approved. Increase spend only after checking whether the team can fulfil and support the enquiries generated.",
    ],
    districts: ["Model Town", "Urban Estate II", "Sector 13", "Sector 14", "Auto Market", "Industrial Area"],
    serpReality: "Material quotations and vehicle discovery require different pages. Keep dealership affiliations accurate and avoid advertising stock or prices that staff cannot honour. Technical product fit is a stronger industrial proposition than generic local reach.",
    faqs: [
      { q: "How should steel enquiries be qualified?", a: "Ask for grade, dimensions, quantity and destination. Explain whether you stock, manufacture or trade. This gives sales a workable requirement rather than an unqualified price request." },
      { q: "Can a small dealership run focused campaigns?", a: "Promote a limited set of available models, test drives or service bookings in a manageable area. Separate goals and track actual visits. Do not spread the budget across every model and district." },
    ],
  },
  {
    slug: "rohtak",
    tagline: "Course-to-counselling visibility and a separate industrial buying path",
    marketNotes: [
      "Rohtak's education economy sits alongside agricultural trade and corridor manufacturing. Institutes need eligibility, teaching arrangements and intake dates; manufacturers need capability pages and RFQs. A student comparing a local programme and a procurement buyer evaluating components need different information despite the same regional context.",
      "Plan admissions backwards from counselling and application deadlines. Track eligibility, counselling and enrolment, not all forms equally. Manufacturers need product terms and actual delivery coverage, separate from student-oriented reach. A small plan should focus adequately on one course or line before expanding. Workflow reminders can support counsellors or technical sales, but qualification claims and production commitments need review by the responsible team.",
    ],
    districts: ["Model Town", "D-Park", "Sector 1", "Sector 2", "Sector 3", "Industrial Model Township"],
    serpReality: "Separate admissions buying intent from results, dates and official-information searches. Industrial product pages need technical detail for buyers beyond Rohtak, not an admissions-style local targeting radius.",
    faqs: [
      { q: "Why are admissions enquiries not converting?", a: "Check that the advert states the course, eligibility, format and application window. Review search terms with counselling outcomes. Some people want results or a different qualification, not your programme." },
      { q: "Should an institute target nearby towns?", a: "Only where travel, transport or accommodation makes attendance practical. Explain arrangements and ask where applicants live. Expand from eligible applications and enrolments, not reach alone." },
    ],
  },
  {
    slug: "bathinda",
    tagline: "Separate trade and student journeys across Bathinda's Malwa catchment",
    marketNotes: [
      "Bathinda serves a wider Malwa market through agriculture, education and industrial supply. Agri-businesses need availability and dealer terms; institutes need programme and intake details. Refinery-linked suppliers should explain their technical scope without implying approved-vendor status or a relationship they cannot verify.",
      "Use actual customer locations to identify viable catchments before district-wide expansion. Punjabi, Hindi or English should match the audience and staff support. Agriculture follows relevant buying cycles; industrial enquiries need longer quotation follow-up. Keep student forms separate from trade leads. An automated queue can prioritise product or course requirements, but should not make institutional affiliation, safety or vendor-approval claims.",
    ],
    districts: ["Model Town", "Civil Lines", "Goniana Road", "Power House Road", "Ajit Road", "Multania Road"],
    serpReality: "Local education visibility and national industrial sourcing need different research. Technical documentation matters for suppliers; meaningful regional-language information helps local buyers. Translation alone is not a reason to create duplicate pages.",
    faqs: [
      { q: "Should Bathinda content use Punjabi or Hindi?", a: "Choose by actual customers and buying stage. Regional demonstrations may help local decisions; English specifications may serve procurement. Test qualified enquiries and support the chosen language during follow-up." },
      { q: "Is whole-Malwa targeting sensible?", a: "Only where delivery, servicing or attendance is practical. Start with existing customer towns and track location with lead quality. A wider audience may bring requirements you cannot fulfil." },
    ],
  },
  {
    slug: "rishikesh",
    tagline: "Precise course, retreat and adventure booking journeys in Rishikesh",
    marketNotes: [
      "Rishikesh combines international yoga study, wellness stays, adventure and hospitality. Teacher training needs syllabus, credentials, dates and accommodation details; rafting depends on current operating conditions. These offers should not share a generic tourism funnel. Wellness content should describe programmes responsibly without promising medical outcomes.",
      "Separate course applications, retreats, rooms and activities. Explain actual location: Tapovan, central Rishikesh and the wider riverbank belt differ in transfer and access. Paid campaigns should follow capacity, course calendars and permissions. Workflow tools can send approved inclusions and application reminders, but activity availability and health discussions need staff handling. Avoid collecting detailed medical information through general advertising lead forms.",
    ],
    districts: ["Tapovan", "Muni Ki Reti", "Swarg Ashram", "Shyampur", "Gumaniwala", "Dhalwala"],
    serpReality: "Course research and immediate adventure booking are different decisions. Detailed curricula and transparent inclusions support considered applications, while activity pages need current operating information. Do not duplicate locations or overstate access.",
    faqs: [
      { q: "Can yoga schools start with selected overseas markets?", a: "Begin with one course and a complete page showing dates, syllabus, teachers, accommodation and refund terms. Use verifiable accreditation only. Measure qualified applications and bookings, not cheap enquiries." },
      { q: "Should rafting ads run all year?", a: "Advertise only permitted routes and periods under current conditions. Pause unavailable offers promptly and state rescheduling terms. A fixed annual calendar does not replace current operational checks." },
    ],
  },
  {
    slug: "ajmer",
    tagline: "Practical visitor information alongside Ajmer's education and marble trade",
    marketNotes: [
      "Ajmer's pilgrimage economy supports stays and transfers alongside education and regional marble trade. Pilgrims need access and booking details; families need admissions and campus information; stone buyers need specifications and supply terms. These are separate markets, not variants of one tourism audience.",
      "Distinguish regular demand from confirmed Urs-period availability, with accurate room capacity and cancellation terms. Marble pages should explain where stock is held and supplied. If serving Pushkar or sourcing through Kishangarh, describe the relationship precisely rather than implying a local branch. CRM workflows should retain dates for visitors and material requirements for buyers. Availability and transport commitments need staff confirmation before automated messages go out.",
    ],
    districts: ["Dargah Bazaar", "Nala Bazaar", "Civil Lines", "Vaishali Nagar", "Panchsheel Nagar", "Adarsh Nagar"],
    serpReality: "Dargah searches can be informational rather than accommodation demand. Marble buyers may compare regional suppliers. Specific arrival details or genuine stock arrangements provide a better basis than claiming every nearby market as your address.",
    faqs: [
      { q: "How can hotels improve enquiries during Urs?", a: "Publish confirmed availability, occupancy and arrival terms before increasing spend. Use accommodation intent, verify access close to travel, and stop advertising sold-out rooms." },
      { q: "Can an Ajmer property target Pushkar visitors?", a: "When the offer suits the trip, but make the Ajmer location explicit. Explain transport without implying it is in Pushkar. A dedicated page needs genuinely useful stay information, not another city keyword." },
    ],
  },
  {
    slug: "vijayawada",
    tagline: "Telugu-aware marketing with precise commercial and project geography",
    marketNotes: [
      "Vijayawada's agricultural trade, education and property sectors need different information. Trade buyers need grades and delivery; students need course and admissions; homebuyers need exact project locations and verified specifications. Telugu can clarify local offers, while English may suit technical or interstate procurement.",
      "Vijayawada, Guntur and Amaravati-area markets are connected but not interchangeable addresses. Property campaigns need exact sites and applicable disclosures; education follows intake calendars; trade follows availability and dispatch. Use sector-specific forms and CRM reporting. Properly translated enquiry journeys should have matching staff support. Automations must not turn general capital-region references into unverified project approvals or location claims.",
    ],
    districts: ["Benz Circle", "Labbipet", "Governorpet", "Patamata", "Bhavanipuram", "One Town"],
    serpReality: "Check project, course and commodity terms independently. Clear geography matters for regional property comparisons. Meaningful Telugu and English content should answer actual questions rather than duplicate broad city pages.",
    faqs: [
      { q: "Should property campaigns target Guntur and Amaravati too?", a: "Only for buyers the project suits, always with its actual location and applicable registration details. Track budget fit and site visits by audience before expanding." },
      { q: "Are Telugu landing pages useful?", a: "Use Telugu to clarify relevant fees, features and next steps, with a complete supported enquiry experience. Retain English where technical or interstate trade needs it. Evaluate qualified enquiries, not click cost alone." },
    ],
  },
  {
    slug: "visakhapatnam",
    tagline: "Capability-led discovery for Vizag's logistics, industry and IT firms",
    marketNotes: [
      "Visakhapatnam's port, steel and pharma businesses need a different funnel from IT firms and neighbourhood services. Freight buyers need cargo coverage and documentation support; industrial buyers need specifications and capacity. Distinguish Gajuwaka or port-related offerings from technology services associated with Madhurawada.",
      "Start with detailed capability pages and forms capturing cargo, product or project scope. Review job, training and shipment-tracking intent before paid expansion. IT firms selling outside Andhra Pradesh should follow buyer geography. Telugu may help consumers; procurement often needs clear English. Track sales-accepted enquiries and quotations. Assistants should route documentation requests rather than invent cargo permissions, pharmaceutical approvals or dispatch commitments.",
    ],
    districts: ["Dwaraka Nagar", "Siripuram", "MVP Colony", "Gajuwaka", "Madhurawada", "Duvvada"],
    serpReality: "Research Vizag and Visakhapatnam variants together. Logistics, steel and local services require distinct intent checks. Do not create near-identical pages for city-name alternatives or imply certifications from proximity to an industrial area.",
    faqs: [
      { q: "How can logistics companies reduce irrelevant enquiries?", a: "State cargo, routes and business or consumer scope. Ask for origin and destination. Review tracking, recruitment and unrelated courier terms, excluding what does not match the offer." },
      { q: "Should a Madhurawada IT firm advertise only locally?", a: "Only if local customers are the intended market. National or overseas sales need service and buyer-market campaigns. Accurate office information should not impose an unnecessary local targeting radius." },
    ],
  },
  {
    slug: "mysore",
    tagline: "Distinct demand for Mysuru's stays, silk collections and IT expertise",
    marketNotes: [
      "Mysuru combines heritage travel, silk and sandalwood retail and IT services. Visitors need access and booking terms; product buyers need composition and delivery; software buyers assess delivery capability. A palace-area hotel and a Hebbal IT firm should not share audience assumptions merely because they operate in one city.",
      "Prepare visitor pages before your advance-booking window and keep Dasara information verified. Retail needs supported authenticity claims and workable returns year-round. Separate direct bookings, product orders and project enquiries so tourism peaks do not obscure other performance. Catalogue and booking automation should use current approved inventory and terms, with staff handling sourcing questions or uncertain availability rather than promising unsupported authenticity or capacity.",
    ],
    districts: ["Gokulam", "Vijayanagar", "Jayalakshmipuram", "Hebbal", "Kuvempunagar", "Nazarbad"],
    serpReality: "Research Mysore and Mysuru together without duplicate name pages. Room or product details give buyers a reason to choose beyond generic heritage descriptions. IT acquisition may require wider service-led research.",
    faqs: [
      { q: "When should a hotel prepare for Dasara?", a: "Use past advance enquiries to plan. Confirm event details, room availability, minimum stays and cancellations. Reduce acquisition when inventory is exhausted rather than buying unusable requests." },
      { q: "Can silk shops sell beyond tourist footfall?", a: "Publish composition, dimensions, care, prices and shipping terms, with support for authenticity claims. Assess completed orders and returns before increasing promotion." },
    ],
  },
  {
    slug: "mangalore",
    tagline: "Clear journeys for Mangaluru's campuses and coastal trade",
    marketNotes: [
      "Mangaluru's cashew exporters, education providers and financial services involve trust-heavy decisions. Exporters need grades, packaging and order terms; colleges need eligibility, programme and accommodation detail. Financial service pages must accurately state authorisation and scope. Broad social lead volume does not replace complete information.",
      "Concentrate on one commercial objective before expanding. A processor can begin with a focused trade catalogue; a college with programme and intake pages. Kannada and English should reflect customers and staff support, with other languages tested rather than assumed. Keep outstation admissions and wholesale buyers separate from local retail. AI-assisted enquiry handling should not imply financial approvals or college recognition beyond verified published records.",
    ],
    districts: ["Hampankatta", "Balmatta", "Kadri", "Bejai", "Kankanady", "Panambur"],
    serpReality: "Use Mangalore and Mangaluru naturally on one authoritative presence. Programme detail, trade terms and authorised financial scope answer different needs. Review their queries separately before deciding on page or campaign expansion.",
    faqs: [
      { q: "How can cashew exporters avoid small retail requests?", a: "Show wholesale terms, grades, packs and minimum quantities before the form. Ask for destination and volume. If selling retail packs, provide a separate purchase route." },
      { q: "Should colleges advertise only in Mangaluru?", a: "Not if they recruit outstation students. Provide travel, hostel, fees and eligibility for those audiences. Measure eligible applications and progression instead of brochure downloads alone." },
    ],
  },
  {
    slug: "hubli",
    tagline: "Practical growth for Hubballi's regional traders and manufacturers",
    marketNotes: [
      "Hubballi's traders, agricultural firms and manufacturers serve North Karnataka beyond city limits. Machinery buyers need demonstrations and servicing; wholesalers need pack and delivery terms; Gokul Road manufacturers need specifications and order sizes. Generic retail promotions cannot cover these requirements together.",
      "Begin with useful product information, accurate profiles and one measurable channel. Kannada demonstrations can help local buyers while clear technical data serves outside procurement. Hubballi and Dharwad are connected markets, but delivery cost and branch coverage still matter. Record quotations, dealer applications and completed orders separately. Automation can organise follow-up, but model availability, servicing and any agricultural performance claims need verified information and staff oversight.",
    ],
    districts: ["Durgad Bail", "Koppikar Road", "Vidyanagar", "Deshpande Nagar", "Gokul Road", "Unkal"],
    serpReality: "Research Hubli and Hubballi variants together. Explain genuine Dharwad coverage without implying a second office. Product and trade searches need catalogue substance beyond local-shop visibility.",
    faqs: [
      { q: "Should Hubballi and Dharwad share a campaign?", a: "When delivery or travel makes coverage practical. Compare quality and costs by area. Separate budgets when offers or service economics differ enough to justify them." },
      { q: "How should equipment dealers use video?", a: "Show intended use, suitable applications and servicing requirements. Kannada narration may help local assessment. Make model details easy to request and avoid unsupported yield or income claims." },
    ],
  },
  {
    slug: "thiruvananthapuram",
    tagline: "Separate IT consultations and responsible visitor-service marketing",
    marketNotes: [
      "Thiruvananthapuram's Technopark ecosystem sits alongside tourism, Ayurveda and government-facing services. IT buyers may be outside Kerala; visitors need logistics; Ayurveda clients need credentials and responsible expectations. Online credibility cannot replace tender eligibility or formal procurement processes.",
      "Build distinct software consultation, booking and treatment-enquiry paths. English can support wider IT buyers; Malayalam can clarify local services. Kazhakkoottam messaging should reflect real coverage rather than assuming every technology worker is a prospect. Check capacity and health-related claims before promotion. Avoid detailed medical collection in advertising forms; an assistant should provide published consultation arrangements and refer sensitive questions to qualified professionals.",
    ],
    districts: ["Kazhakkoottam", "Kulathoor", "Pattom", "Kesavadasapuram", "Vellayambalam", "Thampanoor"],
    serpReality: "Research Trivandrum with Thiruvananthapuram on one coherent site. IT competitors can be broader than the city, while government information and tourism booking require different intent checks. Clinical claims demand particular care.",
    faqs: [
      { q: "Can Technopark firms reach clients outside Kerala?", a: "Address their services, industries and buying questions with permitted project evidence. A city page supports location credibility; broader acquisition needs service-led content in the intended markets." },
      { q: "What should Ayurveda centres publish before advertising?", a: "Explain qualifications, consultation, facilities and package inclusions. Avoid guaranteed cures. Keep medical assessment in an appropriate consultation, not a general advertising form." },
    ],
  },
  {
    slug: "guwahati",
    tagline: "Focused tea, travel and regional commerce acquisition in Guwahati",
    marketNotes: [
      "Guwahati connects tea trade, Northeast travel, industrial supply and retail. Wholesale tea requires grades and terms; travellers need routes and conditions; suppliers need technical fit. Gateway geography alone does not mean a business can economically serve the entire Northeast. Targeting should follow delivery and after-sales support.",
      "Prove one audience before regional expansion. Separate wholesale quotations from retail checkout, and travel campaigns by itinerary. Test Assamese and English against actual customers. Update departures when access or weather changes. Track fulfilment and margin rather than broad reach. CRM route and product fields can improve follow-up; automated replies must not invent permit responsibilities, availability or industrial vendor eligibility.",
    ],
    districts: ["Fancy Bazaar", "Pan Bazaar", "Paltan Bazaar", "Ulubari", "Ganeshguri", "Beltola"],
    serpReality: "Review tea sourcing, consumer packs and itineraries independently. Clear dispatch or departure arrangements offer practical value beyond generic gateway claims. Regional labels are not evidence that every destination is serviceable.",
    faqs: [
      { q: "How should tea firms separate retail and wholesale?", a: "Wholesale needs grades, minimum orders and samples; retail needs price, delivery and checkout. Use different goals. A gift-box purchase is not a qualified bulk enquiry." },
      { q: "Should operators advertise every Northeast destination?", a: "Only itineraries with reliable supplier arrangements. Explain pickup, travel and permits accurately, keeping conditions current. Do not treat destinations as interchangeable packages." },
    ],
  },
  {
    slug: "patna",
    tagline: "Make Patna's course, care and trading choices easier to evaluate",
    marketNotes: [
      "Patna's coaching, healthcare, agricultural trade and retail buyers need distinct information. Students need exam, medium, batch and fee details; patients need appointments and specialist availability; traders need products and delivery. One city-wide message hides which enquiries can actually become customers.",
      "Separate admissions from appointments operationally. Track counselling and enrolment against real batch dates, and use accurate healthcare credentials with careful personal-data handling. Hindi or bilingual pages should match customer and staff language. Traders may benefit first from useful stock and ordering detail rather than a broad content programme. CRM workflows should preserve course or product interest and avoid advertising use of sensitive consultation data.",
    ],
    districts: ["Boring Road", "Kankarbagh", "Rajendra Nagar", "Patliputra Colony", "Ashok Rajpath", "Bailey Road"],
    serpReality: "Specific exam, medium and specialty queries need their own research. Broad hospital or coaching terms are not automatically the right starting point. Complete buying information is more useful than high-volume ambiguous traffic.",
    faqs: [
      { q: "How can coaching institutes improve enquiry quality?", a: "State exam, medium, batch, eligibility and fees or the fee-enquiry process. Track counselling attendance and enrolment. Avoid guaranteed selections or borrowed success stories." },
      { q: "Can Patna campaigns run in Hindi?", a: "When pages and staff support the same language. Test the actual offer and audience. Keep exam names, medical terms and commercial conditions accurate, and compare qualified outcomes." },
    ],
  },
  {
    slug: "ranchi",
    tagline: "Technical supplier discovery and clear education journeys in Ranchi",
    marketNotes: [
      "Ranchi's equipment suppliers, engineering businesses and manufacturers may serve buyers beyond the capital. City traffic alone says little about opportunity. Procurement pages need compatibility, documentation and dispatch coverage; education providers need programme, access and admissions information that families can evaluate.",
      "Separate spare parts, service contracts and new equipment requests because values and response needs differ. Tupudana manufacturing needs capability-led content; education needs a separate calendar. Hindi and English can support different stages. Track quote-ready enquiries and completed admissions separately, keeping recruitment out of buyer reporting. Automation should preserve part requirements and service territory, with staff responsible for compatibility or recognition commitments.",
    ],
    districts: ["Lalpur", "Harmu", "Doranda", "Hinoo", "Kokar", "Tupudana"],
    serpReality: "Industrial sourcing may involve national suppliers; education involves different programme and location decisions. A Ranchi address supports identity, but product fit and field-service coverage matter for industrial buyers outside the city.",
    faqs: [
      { q: "Can Ranchi suppliers reach mining customers elsewhere?", a: "When delivery and servicing are reliable. Publish equipment, applications and support territory, then target actual requirements. Do not create office listings at mines or towns with no staffed location." },
      { q: "How can equipment buyers be separated from job seekers?", a: "Keep careers routes separate, review vacancy and training searches, and ask sales enquiries for the required part or service. Exclude only intent outside the actual offer." },
    ],
  },
];

export const CITY_DEPTH_BATCH2: CityDepth[] = EDITORIAL.map((entry) => ({
  slug: entry.slug,
  marketNotes: entry.marketNotes,
  districts: entry.districts,
  // No externally verified city auction data was supplied. Do not invent prices.
  budgets: [],
  serpReality: entry.serpReality,
  faqs: entry.faqs,
}));

export const CITY_PAGES_BATCH2 = EDITORIAL.map(({ slug, tagline, marketNotes }) => ({
  slug,
  tagline,
  description: marketNotes[0],
}));