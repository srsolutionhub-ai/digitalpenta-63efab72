import { Suspense } from "react";
import { lazyRetry } from "@/lib/lazyRetry";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import HeroFeatureCardsSection from "@/components/sections/HeroFeatureCardsSection";
import HomepageLeadCaptureSection from "@/components/sections/HomepageLeadCaptureSection";
import HomeIntroSection from "@/components/sections/HomeIntroSection";
import PressAwardsStrip from "@/components/sections/PressAwardsStrip";
import SectionDivider from "@/components/ui/section-divider";
import FloatingShapes from "@/components/ui/floating-shapes";
import ScrollNavDots from "@/components/ui/scroll-nav-dots";
import SEOHead, { breadcrumbSchema, faqPageSchema, organizationSchema, serviceSchema } from "@/components/seo/SEOHead";
import { HOMEPAGE_FAQS } from "@/data/homepageFaqs";
import { getMetric } from "@/data/siteMetrics";

const HOME_SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "services", label: "Services" },
  { id: "results", label: "Results" },
  { id: "cases", label: "Cases" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

/* Below-the-fold: code-split to keep initial JS small and improve LCP/TBT */
const PartnersSection = lazyRetry(() => import("@/components/sections/PartnersSection"));
const StatsSection = lazyRetry(() => import("@/components/sections/StatsSection"));
const ServicesSection = lazyRetry(() => import("@/components/sections/ServicesSection"));
const WhyUsSection = lazyRetry(() => import("@/components/sections/WhyUsSection"));
const ProcessSection = lazyRetry(() => import("@/components/sections/ProcessSection"));
const CaseStudiesSection = lazyRetry(() => import("@/components/sections/CaseStudiesSection"));
const IndustriesSection = lazyRetry(() => import("@/components/sections/IndustriesSection"));
const TestimonialsSection = lazyRetry(() => import("@/components/sections/TestimonialsSection"));
const PricingSection = lazyRetry(() => import("@/components/sections/PricingSection"));
const FAQSection = lazyRetry(() => import("@/components/sections/FAQSection"));
const BlogPreviewSection = lazyRetry(() => import("@/components/sections/BlogPreviewSection"));
const WebsiteAuditSection = lazyRetry(() => import("@/components/sections/WebsiteAuditSection"));
const ResultsReelSection = lazyRetry(() => import("@/components/sections/ResultsReelSection"));
const DashboardPreviewSection = lazyRetry(() => import("@/components/sections/DashboardPreviewSection"));
const SignatureCtaSection = lazyRetry(() => import("@/components/sections/SignatureCtaSection"));
const SeoLinkHub = lazyRetry(() => import("@/components/sections/SeoLinkHub"));
const RoiCalculatorSection = lazyRetry(() => import("@/components/sections/RoiCalculatorSection"));
const ClientTrustWallSection = lazyRetry(() => import("@/components/sections/ClientTrustWallSection"));
const NewsletterSection = lazyRetry(() => import("@/components/sections/NewsletterSection"));


/** Skeleton placeholder that reserves vertical space to minimize CLS during chunk load. */
function SectionFallback({ minH = "min-h-[420px]" }: { minH?: string }) {
  return (
    <div className={`${minH} flex items-center justify-center`} aria-hidden>
      <div className="h-2 w-32 rounded-full bg-white/[0.06] animate-pulse" />
    </div>
  );
}

/* Compact KPI strip — sits between the hero and the press section */
function TrustStrip() {
  const items = [
    { label: "★★★★★ 4.9 Google Rating", accent: "hsl(48 100% 65%)" },
    { label: `${getMetric("clients_served")?.display ?? ""} Clients Served`, accent: "hsl(256 90% 75%)" },
    { label: "₹10Cr+ Ad Budget Managed", accent: "hsl(162 100% 50%)" },
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
        title="Digital Marketing Agency in Delhi | Digital Penta"
        description="Grow with a Delhi digital marketing agency trusted by 500+ clients. SEO, Google Ads, social media and AI automation. Rated 4.9★. Get a free audit."
        canonical="https://digitalpenta.app/"
        hreflangs={[
          { hreflang: "en", href: "https://digitalpenta.app/" },
          { hreflang: "en-IN", href: "https://digitalpenta.app/" },
          { hreflang: "x-default", href: "https://digitalpenta.app/" },
        ]}
        schemas={[
          breadcrumbSchema([{ name: "Home", url: "https://digitalpenta.app/" }]),
          organizationSchema(),
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://digitalpenta.app/#website",
            url: "https://digitalpenta.app/",
            name: "Digital Penta",
            publisher: { "@id": "https://digitalpenta.app/#organization" },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://digitalpenta.app/blog?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://digitalpenta.app/#webpage",
            url: "https://digitalpenta.app/",
            name: "Digital Marketing Agency in Delhi | Digital Penta",
            isPartOf: { "@id": "https://digitalpenta.app/#website" },
            about: { "@id": "https://digitalpenta.app/#organization" },
            primaryImageOfPage: "https://digitalpenta.app/og-image.png",
            inLanguage: "en-IN",
          },
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Digital Penta — Digital Marketing Agency",
            image: "https://digitalpenta.app/og-image.png",
            url: "https://digitalpenta.app/",
            telephone: "+91-88601-00039",
            priceRange: "₹₹-₹₹₹₹",
            address: {
              "@type": "PostalAddress",
              streetAddress: "124 C Katwaria Sarai",
              addressLocality: "New Delhi",
              addressRegion: "Delhi",
              postalCode: "110016",
              addressCountry: "IN",
            },
            areaServed: ["Delhi", "Mumbai", "Bangalore", "Dubai", "Riyadh"],
            sameAs: [
              "https://www.linkedin.com/company/digitalpenta",
              "https://www.instagram.com/digitalpenta",
              "https://twitter.com/digitalpenta",
            ],
          },
          serviceSchema({
            name: "Digital Marketing Services",
            description:
              "Full-stack digital marketing — SEO, Google Ads, social, content, performance and AI automation — for brands across India and the Middle East.",
            url: "https://digitalpenta.app/services/digital-marketing",
            serviceType: "Digital Marketing Agency",
          }),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Digital Penta — Core Services",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "SEO Services", url: "https://digitalpenta.app/services/digital-marketing/seo" },
              { "@type": "ListItem", position: 2, name: "Google Ads / PPC", url: "https://digitalpenta.app/services/digital-marketing/ppc" },
              { "@type": "ListItem", position: 3, name: "Social Media Marketing", url: "https://digitalpenta.app/services/digital-marketing/social-media" },
              { "@type": "ListItem", position: 4, name: "Content Marketing", url: "https://digitalpenta.app/services/digital-marketing/content" },
              { "@type": "ListItem", position: 5, name: "Web Development", url: "https://digitalpenta.app/services/development/website" },
              { "@type": "ListItem", position: 6, name: "AI Chatbot Development", url: "https://digitalpenta.app/services/ai-solutions/chatbot" },
              { "@type": "ListItem", position: 7, name: "Marketing Automation", url: "https://digitalpenta.app/services/automation/marketing" },
              { "@type": "ListItem", position: 8, name: "Public Relations", url: "https://digitalpenta.app/services/public-relations" },
            ],
          },
          faqPageSchema(HOMEPAGE_FAQS),
        ]}
      />
      {/* Above-the-fold — eager */}
      <div className="relative" data-scroll-section="hero">
        <HeroSection />
        <FloatingShapes className="z-[1]" />
      </div>
      <TrustStrip />
      <HeroFeatureCardsSection />
      <PressAwardsStrip />
      <HomeIntroSection />
      <HomepageLeadCaptureSection />
      <SectionDivider variant="aurora" />

      {/* Below-the-fold — lazy chunks */}
      <Suspense fallback={<SectionFallback minH="min-h-[160px]" />}>
        <PartnersSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[800px]" />}>
        <ClientTrustWallSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WebsiteAuditSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[520px]" />}>
      </Suspense>
      <SectionDivider variant="spark" />
      <div data-scroll-section="results">
        <Suspense fallback={<SectionFallback minH="min-h-[280px]" />}>
          <StatsSection />
        </Suspense>
      </div>
      <div data-scroll-section="services">
        <Suspense fallback={<SectionFallback />}>
          <ServicesSection />
        </Suspense>
      </div>
      <Suspense fallback={<SectionFallback />}>
        <ProcessSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyUsSection />
      </Suspense>
      <div data-scroll-section="cases">
        <Suspense fallback={<SectionFallback minH="min-h-[600px]" />}>
          <CaseStudiesSection />
        </Suspense>
      </div>
      <Suspense fallback={<SectionFallback />}>
        <ResultsReelSection />
      </Suspense>
      <SectionDivider variant="seam" />
      <Suspense fallback={<SectionFallback />}>
        <DashboardPreviewSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <div data-scroll-section="pricing">
        <Suspense fallback={<SectionFallback />}>
          <PricingSection />
        </Suspense>
      </div>
      <Suspense fallback={<SectionFallback minH="min-h-[600px]" />}>
        <RoiCalculatorSection />
      </Suspense>
      <div data-scroll-section="faq">
        <Suspense fallback={<SectionFallback />}>
          <FAQSection />
        </Suspense>
      </div>
      <Suspense fallback={<SectionFallback minH="min-h-[280px]" />}>
        <IndustriesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <BlogPreviewSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[200px]" />}>
        <SeoLinkHub />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
        <NewsletterSection />
      </Suspense>
      <SectionDivider variant="aurora" />

      <Suspense fallback={<SectionFallback />}>
        <SignatureCtaSection />
      </Suspense>

      <ScrollNavDots sections={HOME_SECTIONS} />
    </Layout>
  );
};

export default Index;
