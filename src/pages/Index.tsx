import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import HomeIntroSection from "@/components/sections/HomeIntroSection";
import PartnersSection from "@/components/sections/PartnersSection";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
import WebsiteAuditSection from "@/components/sections/WebsiteAuditSection";
import ResultsReelSection from "@/components/sections/ResultsReelSection";
import DashboardPreviewSection from "@/components/sections/DashboardPreviewSection";
import PressAwardsStrip from "@/components/sections/PressAwardsStrip";
import SignatureCtaSection from "@/components/sections/SignatureCtaSection";
import SeoLinkHub from "@/components/sections/SeoLinkHub";
import RoiCalculatorSection from "@/components/sections/RoiCalculatorSection";
import UrgencyStrip from "@/components/ui/urgency-strip";
import SEOHead, { breadcrumbSchema, organizationSchema, reviewedItemSchema, serviceSchema } from "@/components/seo/SEOHead";
import { HOMEPAGE_REVIEWS } from "@/data/customerReviews";

/* Compact KPI strip — sits between the hero and the press section */
function TrustStrip() {
  const items = [
    { label: "★★★★★ 4.9 Google Rating", accent: "hsl(48 100% 65%)" },
    { label: "100+ Clients Served", accent: "hsl(256 90% 75%)" },
    { label: "₹10Cr+ Revenue Generated", accent: "hsl(162 100% 50%)" },
    { label: "Google Partner", accent: "hsl(192 95% 70%)" },
    { label: "Delhi Based, Globally Trusted", accent: "hsl(322 90% 75%)" },
  ];
  return (
    <div className="relative border-y border-white/[0.05] py-3.5 overflow-hidden bg-background/40 backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none opacity-50"
        style={{ background: "radial-gradient(80% 100% at 50% 50%, hsl(256 90% 30% / 0.15), transparent 70%)" }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
          {items.map((item, i) => (
            <span key={i} className="type-label whitespace-nowrap font-mono flex items-center gap-2.5">
              <span
                className="inline-block w-1 h-1 rounded-full"
                style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }}
              />
              <span className="text-foreground/70">{item.label}</span>
              {i < items.length - 1 && <span className="ml-5 text-white/10">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Digital Penta | Digital Marketing Agency in Delhi | Free Audit"
        description="Delhi's top digital marketing agency — SEO, Google Ads, social, AI automation. 500+ brands, 4.9★ rating. Get a free growth audit today."
        canonical="https://digitalpenta.com/"
        hreflangs={[
          { hreflang: "en", href: "https://digitalpenta.com/" },
          { hreflang: "en-IN", href: "https://digitalpenta.com/" },
          { hreflang: "x-default", href: "https://digitalpenta.com/" },
        ]}
        schemas={[
          breadcrumbSchema([{ name: "Home", url: "https://digitalpenta.com/" }]),
          organizationSchema(),
          serviceSchema({
            name: "Digital Marketing Services",
            description:
              "Full-stack digital marketing — SEO, Google Ads, social, content, performance and AI automation — for brands across India and the Middle East.",
            url: "https://digitalpenta.com/services/digital-marketing",
            serviceType: "Digital Marketing Agency",
          }),
          // ItemList of top services — boosts homepage sitelink eligibility
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Digital Penta — Core Services",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "SEO Services", url: "https://digitalpenta.com/services/digital-marketing/seo" },
              { "@type": "ListItem", position: 2, name: "Google Ads / PPC", url: "https://digitalpenta.com/services/digital-marketing/ppc" },
              { "@type": "ListItem", position: 3, name: "Social Media Marketing", url: "https://digitalpenta.com/services/digital-marketing/social-media" },
              { "@type": "ListItem", position: 4, name: "Content Marketing", url: "https://digitalpenta.com/services/digital-marketing/content" },
              { "@type": "ListItem", position: 5, name: "Web Development", url: "https://digitalpenta.com/services/development/website" },
              { "@type": "ListItem", position: 6, name: "AI Chatbot Development", url: "https://digitalpenta.com/services/ai-solutions/chatbot" },
              { "@type": "ListItem", position: 7, name: "Marketing Automation", url: "https://digitalpenta.com/services/automation/marketing" },
              { "@type": "ListItem", position: 8, name: "Public Relations", url: "https://digitalpenta.com/services/public-relations" },
            ],
          },
          reviewedItemSchema({
            itemName: "Digital Penta — Digital Marketing Agency",
            itemUrl: "https://digitalpenta.com/",
            itemType: "Organization",
            description: "India's integrated digital marketing agency offering SEO, Google Ads, social media, AI and automation across India and the Middle East.",
            reviews: HOMEPAGE_REVIEWS,
            ratingValue: "4.9",
            reviewCount: "87",
          }),
        ]}
      />
      <HeroSection />
      <UrgencyStrip />
      <TrustStrip />
      <PressAwardsStrip />
      <HomeIntroSection />
      <PartnersSection />
      <WebsiteAuditSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <WhyUsSection />
      <CaseStudiesSection />
      <ResultsReelSection />
      <DashboardPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <RoiCalculatorSection />
      <FAQSection />
      <IndustriesSection />
      <BlogPreviewSection />
      <SeoLinkHub />
      <SignatureCtaSection />
    </Layout>
  );
};

export default Index;
