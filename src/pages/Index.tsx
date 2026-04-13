import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/sections/HeroSection";
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

/* Trust Strip */
function TrustStrip() {
  const items = [
    "★★★★★ 4.9 Google Rating",
    "100+ Clients Served",
    "₹10Cr+ Revenue Generated",
    "Google Partner",
    "Delhi Based, Globally Trusted",
  ];
  return (
    <div className="border-y border-border py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {items.map((item, i) => (
            <span key={i} className="type-label text-muted-foreground whitespace-nowrap font-mono">
              {item}
              {i < items.length - 1 && <span className="ml-6 text-border">|</span>}
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
      <HeroSection />
      <TrustStrip />
      <PartnersSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <WhyUsSection />
      <CaseStudiesSection />
      <ResultsReelSection />
      <WebsiteAuditSection />
      <DashboardPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <IndustriesSection />
      <BlogPreviewSection />
    </Layout>
  );
};

export default Index;
