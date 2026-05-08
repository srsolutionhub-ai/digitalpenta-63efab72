import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Search, Megaphone, FileText, PenLine, Crosshair, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema, itemListSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";

const TOOLS = [
  { slug: "growth-score", name: "AI Growth Score", desc: "Paste your URL → get a 0-100 growth score plus a 6-step prioritized roadmap.", icon: TrendingUp, accent: "text-emerald-400" },
  { slug: "ad-copy", name: "AI Ad Copy Generator", desc: "Google + Meta + LinkedIn ad variants engineered for click-through and conversion.", icon: Megaphone, accent: "text-amber-400" },
  { slug: "meta-tags", name: "AI Meta Tag Generator", desc: "SEO-optimised title, description, OG and Twitter tags in seconds.", icon: FileText, accent: "text-sky-400" },
  { slug: "blog-outline", name: "AI Blog Outline", desc: "Topic + keyword → fully structured H2 outline, FAQs and internal-link map.", icon: PenLine, accent: "text-violet-400" },
  { slug: "competitor-xray", name: "Competitor X-Ray", desc: "Your domain vs competitor → ranking, content, ads, and CRO gap report.", icon: Crosshair, accent: "text-rose-400" },
  { slug: "roi-predictor", name: "ROI Predictor", desc: "Industry + budget + city → 90-day lead and revenue forecast across 3 scenarios.", icon: Search, accent: "text-fuchsia-400" },
] as const;

export default function ToolsIndex() {
  return (
    <Layout>
      <SEOHead
        title="Free AI Marketing Tools | Digital Penta"
        description="Free AI-powered marketing tools — Growth Score, Ad Copy Generator, Meta Tag Generator, Blog Outline, Competitor X-Ray, ROI Predictor. No signup required."
        canonical="https://digitalpenta.com/tools"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Free Tools", url: "https://digitalpenta.com/tools" },
          ]),
          itemListSchema({
            name: "Digital Penta — Free AI Tools",
            items: TOOLS.map(t => ({ name: t.name, url: `https://digitalpenta.com/tools/${t.slug}` })),
          }),
          ...TOOLS.map(t => softwareApplicationSchema({
            name: t.name,
            description: t.desc,
            url: `https://digitalpenta.com/tools/${t.slug}`,
            ratingValue: "4.8",
            ratingCount: "120",
          })),
        ]}
      />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Sparkles className="w-10 h-10 mx-auto text-primary mb-4" />
          <p className="type-label text-primary mb-3 font-mono">Free Forever • No Credit Card</p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mb-5 leading-tight">
            AI tools to <span className="text-gradient">10× your marketing</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Six AI-powered tools the Digital Penta team uses with paying clients — open-sourced for free. Drop your details, get a senior-strategist-grade output in under 15 seconds.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {TOOLS.map(t => (
              <Link key={t.slug} to={`/tools/${t.slug}`} className="card-premium p-6 hover-lift group">
                <t.icon className={`w-8 h-8 ${t.accent} mb-4`} />
                <h2 className="font-display font-bold text-xl text-foreground mb-2">{t.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
                <span className="text-xs text-primary font-mono inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Run tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
