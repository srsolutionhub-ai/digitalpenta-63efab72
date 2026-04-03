import LogoMarquee from "@/components/ui/logo-marquee";

const partners = [
  { label: "Google Partner", icon: "🔵" },
  { label: "Meta Business Partner", icon: "🟣" },
  { label: "HubSpot Certified", icon: "🟠" },
  { label: "Shopify Plus", icon: "🟢" },
  { label: "AWS Partner", icon: "🔶" },
  { label: "Semrush Agency", icon: "🔷" },
  { label: "Salesforce Partner", icon: "☁️" },
  { label: "Microsoft Advertising", icon: "🟦" },
];

const techStack = [
  { label: "React" },
  { label: "Next.js" },
  { label: "TypeScript" },
  { label: "Python" },
  { label: "TensorFlow" },
  { label: "Google Ads" },
  { label: "Meta Ads" },
  { label: "Figma" },
  { label: "Webflow" },
  { label: "Shopify" },
  { label: "WordPress" },
  { label: "Node.js" },
];

export default function PartnersSection() {
  return (
    <section className="py-10 relative overflow-hidden border-b border-border/20">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">
            Trusted Partners & Technology Stack
          </span>
        </div>
        <LogoMarquee items={partners} />
        <LogoMarquee items={techStack} reverse speed="slow" />
      </div>
    </section>
  );
}
