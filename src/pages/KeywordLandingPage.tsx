import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead, {
  breadcrumbSchema, faqPageSchema, serviceSchema, organizationSchema,
} from "@/components/seo/SEOHead";
import { getKeywordLanding } from "@/data/keywordLandingData";

/**
 * Tier-2/3 keyword landing pages (Phase 6 of SEO master plan).
 * Route: /lp/:keyword — e.g. /lp/seo-agency-bangalore
 */
export default function KeywordLandingPage() {
  const { keyword } = useParams<{ keyword: string }>();
  const data = getKeywordLanding(keyword || "");

  if (!data) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display font-bold text-3xl text-foreground">Page not found</h1>
            <Link to="/" className="text-primary text-sm mt-4 inline-block">← Back to Home</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const canonical = `https://digitalpenta.com/lp/${data.slug}`;

  return (
    <Layout>
      <SEOHead
        title={data.metaTitle}
        description={data.metaDescription}
        canonical={canonical}
        hreflangs={[
          { hreflang: "x-default", href: canonical },
          { hreflang: "en", href: canonical },
          { hreflang: "en-IN", href: canonical },
        ]}
        schemas={[
          organizationSchema(),
          serviceSchema({
            name: data.primaryKeyword,
            description: data.heroSubhead,
            url: canonical,
            serviceType: data.serviceCategory,
          }),
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: data.primaryKeyword, url: canonical },
          ]),
          faqPageSchema(data.faqs),
        ]}
      />

      {/* Breadcrumb */}
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{data.primaryKeyword}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[150px] animate-breathe pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 type-label text-primary font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              {data.city ? `${data.city} · India` : "Pan-India Service"}
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mt-4 mb-6 leading-tight">
              {data.h1}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-8">
              {data.heroSubhead}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/get-proposal">
                <Button
                  size="lg"
                  className="rounded-full px-8 font-display font-semibold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
                >
                  {data.cta}
                </Button>
              </Link>
              <Link to={data.relatedServiceHref}>
                <Button variant="outline" size="lg" className="rounded-full px-8 font-display font-semibold border-border/40">
                  Full {data.serviceCategory} Service
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proof points */}
      <section className="py-12 border-y border-border/30 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {data.proofPoints.map((p) => (
              <div key={p.label}>
                <p className="font-mono font-bold text-2xl md:text-3xl text-gradient">{p.value}</p>
                <p className="text-xs text-muted-foreground font-display mt-1">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bullets */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10">
            What You Get With Our <span className="text-gradient">{data.serviceCategory}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.bullets.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl glass glow-border p-6"
              >
                <h3 className="font-display font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 bg-card/20 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
            Why Brands Choose <span className="text-gradient">Digital Penta</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {data.whyUs.map((point) => (
              <div key={point} className="flex items-start gap-3 p-4 rounded-xl card-premium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <Accordion type="single" collapsible>
            {data.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                <AccordionTrigger className="font-display text-foreground text-left hover:text-primary transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                    {faq.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-9">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Win With {data.serviceCategory}?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Book a free 30-minute strategy call. We'll send you a custom plan within 48 hours.
          </p>
          <Link to="/get-proposal">
            <Button
              size="lg"
              className="rounded-full px-10 font-display font-bold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
            >
              {data.cta} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
