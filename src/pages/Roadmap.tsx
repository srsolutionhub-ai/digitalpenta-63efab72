import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema } from "@/components/seo/SEOHead";
import { Check, Hammer, Compass } from "lucide-react";

const ROADMAP = [
  { phase: "Now", icon: Hammer, items: [
    "Programmatic city × service × intent SEO pages (150+ URLs)",
    "Free AI tool suite — Growth Score, Ad Copy, Meta Tags, Blog Outline, Competitor X-Ray, ROI Predictor",
    "Strategy-call booking with Resend + .ics calendar invites",
    "Client portal: invoices, files, support, knowledge",
  ]},
  { phase: "Next", icon: Compass, items: [
    "Live rank tracking dashboard with weekly digest",
    "Stripe + Razorpay invoice payment links",
    "Real-time client message center (Supabase Realtime)",
    "Pillar+cluster content engine (80 SEO articles)",
    "Voice-to-brief AI tool (Whisper + Gemini)",
  ]},
  { phase: "Later", icon: Check, items: [
    "Public partner marketplace",
    "White-label client dashboards",
    "Mobile app (iOS + Android) for client portal",
    "GA4 + Search Console attribution merge in dashboard",
  ]},
];

export default function Roadmap() {
  return (
    <Layout>
      <SEOHead
        title="Public Roadmap | Digital Penta — What We're Building"
        description="What Digital Penta is shipping now, next, and later. A transparent public roadmap of our agency platform and AI tooling."
        canonical="https://digitalpenta.com/roadmap"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Roadmap", url: "https://digitalpenta.com/roadmap" },
          ]),
        ]}
      />
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Public Roadmap</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">What we're building.</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">A transparent log of what we're shipping for our clients and the wider community. Updated monthly.</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-3 gap-4">
          {ROADMAP.map((col, i) => (
            <div key={i} className="card-premium p-6">
              <col.icon className="w-6 h-6 text-primary mb-2" />
              <div className="font-display font-bold text-xl text-foreground mb-3">{col.phase}</div>
              <ul className="space-y-2 text-sm text-foreground/80">
                {col.items.map((it, j) => <li key={j} className="flex gap-2"><span className="text-primary">→</span><span>{it}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
