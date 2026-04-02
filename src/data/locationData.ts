export interface LocationData {
  city: string;
  country: string;
  tagline: string;
  description: string;
  services: string[];
  address: string;
  phone: string;
  email: string;
  testimonial: { quote: string; name: string; role: string };
  metaTitle: string;
  metaDescription: string;
}

export const locationData: Record<string, LocationData> = {
  delhi: {
    city: "New Delhi",
    country: "India",
    tagline: "India's Digital Growth Engine — Headquartered in Delhi",
    description: "Our headquarters in New Delhi serves as the command center for Digital Penta's operations across India. With deep expertise in the Indian market, we help businesses from startups to enterprises achieve digital dominance.",
    services: ["SEO", "PPC", "Social Media", "Website Development", "Mobile Apps", "AI Chatbots", "Marketing Automation", "PR"],
    address: "Connaught Place, New Delhi 110001, India",
    phone: "+91 11 XXXX XXXX",
    email: "india@digitalpenta.com",
    testimonial: { quote: "Digital Penta's Delhi team delivered beyond expectations. Their local market knowledge combined with global standards is unmatched.", name: "Rajesh Kumar", role: "CEO, PropTech Ventures" },
    metaTitle: "Digital Marketing Agency in Delhi | Digital Penta",
    metaDescription: "Full-service digital agency in New Delhi offering SEO, PPC, web development, AI solutions, and marketing automation for Indian businesses.",
  },
  dubai: {
    city: "Dubai",
    country: "UAE",
    tagline: "Digital Excellence in the Heart of Dubai",
    description: "Our Dubai office serves the UAE's dynamic business landscape, helping brands across retail, real estate, hospitality, and finance build powerful digital presences in the Gulf region.",
    services: ["Arabic SEO", "Google Ads MENA", "Social Media", "E-commerce", "WhatsApp Automation", "AI Solutions", "PR & Media", "Brand Strategy"],
    address: "Business Bay, Dubai, UAE",
    phone: "+971 4 XXX XXXX",
    email: "dubai@digitalpenta.com",
    testimonial: { quote: "Their understanding of the Dubai market is exceptional. Our brand visibility grew 400% in six months.", name: "Fatima Al-Hassan", role: "Marketing Director, Gulf Retail" },
    metaTitle: "Digital Marketing Agency in Dubai | Digital Penta",
    metaDescription: "Leading digital agency in Dubai offering Arabic SEO, social media marketing, e-commerce development, and AI solutions for UAE businesses.",
  },
  "abu-dhabi": {
    city: "Abu Dhabi",
    country: "UAE",
    tagline: "Strategic Digital Growth in Abu Dhabi",
    description: "Our Abu Dhabi presence supports the capital's growing ecosystem of government, enterprise, and startup clients looking for world-class digital services.",
    services: ["Enterprise SEO", "Government Digital", "Mobile Apps", "AI Strategy", "Content Marketing", "PR & Communications", "Workflow Automation", "Web Development"],
    address: "Al Maryah Island, Abu Dhabi, UAE",
    phone: "+971 2 XXX XXXX",
    email: "abudhabi@digitalpenta.com",
    testimonial: { quote: "Professional, strategic, and results-driven. Digital Penta helped us modernize our entire digital infrastructure.", name: "Ahmed Al-Mansoori", role: "Director, Abu Dhabi Enterprise" },
    metaTitle: "Digital Marketing Agency in Abu Dhabi | Digital Penta",
    metaDescription: "Full-stack digital agency in Abu Dhabi serving government, enterprise, and startups with SEO, development, AI, and automation solutions.",
  },
  riyadh: {
    city: "Riyadh",
    country: "Saudi Arabia",
    tagline: "Powering Saudi Arabia's Digital Transformation",
    description: "Aligned with Vision 2030, our Riyadh office helps Saudi businesses and government entities embrace digital transformation with cutting-edge marketing, development, and AI solutions.",
    services: ["Arabic SEO", "Vision 2030 Digital", "App Development", "AI & ML Solutions", "Social Media", "PPC Management", "Marketing Automation", "Digital PR"],
    address: "King Abdullah Financial District, Riyadh, KSA",
    phone: "+966 11 XXX XXXX",
    email: "ksa@digitalpenta.com",
    testimonial: { quote: "Digital Penta understood our vision for Saudi digital transformation perfectly. Their integrated approach saved us from managing multiple agencies.", name: "Khalid Al-Saud", role: "VP Digital, Saudi Group" },
    metaTitle: "Digital Marketing Agency in Riyadh | Digital Penta",
    metaDescription: "Leading digital agency in Riyadh supporting Vision 2030 with SEO, app development, AI solutions, and marketing automation for Saudi businesses.",
  },
  doha: {
    city: "Doha",
    country: "Qatar",
    tagline: "Qatar's Partner for Digital Growth",
    description: "Our Doha operations serve Qatar's ambitious business community, providing integrated digital solutions that combine global best practices with deep understanding of the Qatari market.",
    services: ["Local SEO", "Google Ads Qatar", "Website Development", "AI Chatbots", "Social Media", "Content Marketing", "PR & Events", "CRM Automation"],
    address: "West Bay, Doha, Qatar",
    phone: "+974 XXXX XXXX",
    email: "qatar@digitalpenta.com",
    testimonial: { quote: "From PR to development to marketing — Digital Penta delivered everything under one roof. Exceptional quality.", name: "Sara Al-Thani", role: "CMO, Qatar Retail Group" },
    metaTitle: "Digital Marketing Agency in Doha | Digital Penta",
    metaDescription: "Full-service digital agency in Doha offering SEO, web development, AI chatbots, and marketing automation for Qatari businesses.",
  },
};

export function getLocationData(slug: string): LocationData | undefined {
  return locationData[slug];
}
