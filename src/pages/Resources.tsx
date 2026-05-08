import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema, itemListSchema } from "@/components/seo/SEOHead";
import { ArrowRight, FileText, Calculator, Sparkles, BookOpen } from "lucide-react";

const RESOURCES = [
  { title: "Free AI Tools", desc: "Growth Score, Ad Copy, Meta Tags, Blog Outline, Competitor X-Ray, ROI Predictor.", icon: Sparkles, href: "/tools" },
  { title: "Pricing Calculator", desc: "Get an instant indicative quote in 30 seconds.", icon: Calculator, href: "/pricing-calculator" },
  { title: "Free Website SEO Audit", desc: "Full Lighthouse + on-page audit with PDF report.", icon: FileText, href: "/tools/seo-audit" },
  { title: "Blog & Playbooks", desc: "Weekly tactical articles on SEO, paid, social, AI and growth.", icon: BookOpen, href: "/blog" },
  { title: "Public Roadmap", desc: "What we're shipping next — for clients and the community.", icon: ArrowRight, href: "/roadmap" },
  { title: "Trust & Security", desc: "How we protect client data, sub-processors and compliance.", icon: FileText, href: "/trust" },
];

export default function Resources() {
  return (
    <Layout>
      <SEOHead
        title="Free Resources & Tools | Digital Penta"
        description="Free marketing resources from Digital Penta — AI tools, pricing calculator, free SEO audit, weekly playbooks and our public roadmap."
        canonical="https://digitalpenta.com/resources"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Resources", url: "https://digitalpenta.com/resources" },
          ]),
          itemListSchema({
            name: "Digital Penta — Free Resources",
            items: RESOURCES.map(r => ({ name: r.title, url: `https://digitalpenta.com${r.href}` })),
          }),
        ]}
      />
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Resources</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">Free tools, playbooks &amp; calculators.</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">Everything Digital Penta gives away — used by thousands of marketers across India and the GCC.</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESOURCES.map(r => (
            <Link key={r.href} to={r.href} className="card-premium p-6 hover-lift group">
              <r.icon className="w-7 h-7 text-primary mb-3" />
              <h2 className="font-display font-bold text-lg text-foreground mb-1.5">{r.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              <span className="text-xs text-primary mt-3 inline-flex items-center gap-1 font-mono group-hover:gap-2 transition-all">Open <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
