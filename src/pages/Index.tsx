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

/* Marquee stripe separator */
function MarqueeStripe() {
  const text = "SEO  •  SOCIAL MEDIA  •  PAID ADS  •  BRANDING  •  WEB DESIGN  •  AI SOLUTIONS  •  AUTOMATION  •  ";
  return (
    <div className="border-y border-border/20 bg-card/10 overflow-hidden py-3 marquee-mask">
      <div className="flex whitespace-nowrap animate-marquee-slow">
        <span className="text-xs font-display font-bold uppercase tracking-[0.2em] text-foreground/[0.06] italic px-4">{text}</span>
        <span className="text-xs font-display font-bold uppercase tracking-[0.2em] text-foreground/[0.06] italic px-4">{text}</span>
        <span className="text-xs font-display font-bold uppercase tracking-[0.2em] text-foreground/[0.06] italic px-4">{text}</span>
      </div>
    </div>
  );
}

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
    <div className="bg-primary/5 border-y border-primary/10 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {items.map((item, i) => (
            <span key={i} className="text-xs font-mono text-foreground/60 whitespace-nowrap">
              {item}
              {i < items.length - 1 && <span className="ml-6 text-primary/30">|</span>}
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
      <MarqueeStripe />
      <ServicesSection />
      <ProcessSection />
      <MarqueeStripe />
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
