import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
import HomeIntroSection from "@/components/sections/HomeIntroSection";
import PressAwardsStrip from "@/components/sections/PressAwardsStrip";
import UrgencyStrip from "@/components/ui/urgency-strip";
import SEOHead, { breadcrumbSchema, organizationSchema, reviewedItemSchema, serviceSchema } from "@/components/seo/SEOHead";
import { HOMEPAGE_REVIEWS } from "@/data/customerReviews";

/* Below-the-fold: code-split to keep initial JS small and improve LCP/TBT */
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection"));
const StatsSection = lazy(() => import("@/components/sections/StatsSection"));
const ServicesSection = lazy(() => import("@/components/sections/ServicesSection"));
const WhyUsSection = lazy(() => import("@/components/sections/WhyUsSection"));
const ProcessSection = lazy(() => import("@/components/sections/ProcessSection"));
const CaseStudiesSection = lazy(() => import("@/components/sections/CaseStudiesSection"));
const IndustriesSection = lazy(() => import("@/components/sections/IndustriesSection"));
const TestimonialsSection = lazy(() => import("@/components/sections/TestimonialsSection"));
const PricingSection = lazy(() => import("@/components/sections/PricingSection"));
const FAQSection = lazy(() => import("@/components/sections/FAQSection"));
const BlogPreviewSection = lazy(() => import("@/components/sections/BlogPreviewSection"));
const WebsiteAuditSection = lazy(() => import("@/components/sections/WebsiteAuditSection"));
const ResultsReelSection = lazy(() => import("@/components/sections/ResultsReelSection"));
const DashboardPreviewSection = lazy(() => import("@/components/sections/DashboardPreviewSection"));
const SignatureCtaSection = lazy(() => import("@/components/sections/SignatureCtaSection"));
const SeoLinkHub = lazy(() => import("@/components/sections/SeoLinkHub"));
const RoiCalculatorSection = lazy(() => import("@/components/sections/RoiCalculatorSection"));

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
      {/* Above-the-fold — eager */}
      <HeroSection />
      <UrgencyStrip />
      <TrustStrip />
      <PressAwardsStrip />
      <HomeIntroSection />

      {/* Below-the-fold — lazy chunks */}
      <Suspense fallback={<SectionFallback minH="min-h-[160px]" />}>
        <PartnersSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WebsiteAuditSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[280px]" />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ProcessSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyUsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[600px]" />}>
        <CaseStudiesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ResultsReelSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DashboardPreviewSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PricingSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[600px]" />}>
        <RoiCalculatorSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[280px]" />}>
        <IndustriesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <BlogPreviewSection />
      </Suspense>
      <Suspense fallback={<SectionFallback minH="min-h-[200px]" />}>
        <SeoLinkHub />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SignatureCtaSection />
      </Suspense>
    </Layout>
  );
};

export default Index;
