import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, MapPin, Star, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead, {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
  serviceWithAreaSchema,
  aggregateRatingSchema,
  type HreflangAlternate,
} from "@/components/seo/SEOHead";

import RelatedLinks from "@/components/seo/RelatedLinks";
import { getMatrixPage } from "@/data/matrixData";
import { getIntentDef, intentAppliesToService } from "@/data/matrixIntents";
import { getNearbyLocations, getLocationFeaturedServices } from "@/data/internalLinks";

/**
 * Programmatic city × service landing page (Phase 8 of SEO master plan).
 *
 * Routes:
 *   /:service/:city            e.g. /seo/delhi
 *   /:service/:city/:intent    e.g. /seo/dubai/for-ecommerce  (Phase 1 audit upgrade)
 *
 * Powered by matrixData.ts × matrixIntents.ts. Each combination yields a
 * unique title, H1, hero subhead and FAQ set to avoid thin/doorway content.
 */
export default function MatrixPage() {
  const params = useParams<{ city: string; intent?: string }>();
  // The :service segment is fixed in the route path (e.g. /seo/:city), so we
  // derive it from the URL pathname to keep one MatrixPage component for all 5
  // service routes without forcing every route to declare an extra param.
  const pathServiceSlug =
    typeof window !== "undefined" ? window.location.pathname.split("/")[1] ?? "" : "";
  const basePage = getMatrixPage(pathServiceSlug, params.city ?? "");
  const intent = params.intent ? getIntentDef(params.intent) : undefined;

  // 404 if base combo missing OR if an intent slug was supplied that's invalid /
  // doesn't apply to this service (e.g. /seo/delhi/for-saas where SaaS isn't allowed).
  if (!basePage) {
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
  if (params.intent && (!intent || !intentAppliesToService(intent, basePage.service.slug))) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display font-bold text-3xl text-foreground">Page not found</h1>
            <Link to={`/${basePage.service.slug}/${basePage.city.slug}`} className="text-primary text-sm mt-4 inline-block">
              ← Back to {basePage.service.name} in {basePage.city.city}
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const { service: svc, city: cty, faqs: baseFaqs } = basePage;

  // Compose intent-aware content. Falls back to base copy when no intent.
  const canonical = intent
    ? `https://digitalpenta.com/${svc.slug}/${cty.slug}/${intent.slug}`
    : basePage.canonical;
  const metaTitle = intent
    ? `${svc.name} ${intent.label} in ${cty.city} | Digital Penta`
    : basePage.metaTitle;
  const metaDescription = intent
    ? `${svc.longName} ${intent.label.toLowerCase()} in ${cty.city}. ${intent.angle} Pricing from ${cty.budgetMin}/month.`
    : basePage.metaDescription;
  const h1 = intent
    ? `${svc.name} ${intent.label} — ${cty.city}`
    : basePage.h1;
  const heroSubhead = intent
    ? `${svc.longName} for the ${cty.city} ${intent.intentNoun} market. ${intent.angle} ${cty.marketAngle}`
    : basePage.heroSubhead;
  const faqs = intent
    ? [
        {
          q: `Why pick a specialised ${svc.name} agency ${intent.label.toLowerCase()} in ${cty.city}?`,
          a: `Generalist agencies treat every ${cty.city} client the same. Our ${intent.intentNoun} pod brings playbooks, creative templates and benchmarks specifically tuned to ${intent.intentNoun}s — so you skip 6 months of learning curve.`,
        },
        ...baseFaqs,
      ]
    : baseFaqs;

  const hreflangs: HreflangAlternate[] = [
    { hreflang: "x-default", href: canonical },
    { hreflang: "en", href: canonical },
    { hreflang: cty.region === "india" ? "en-IN" : `en-${cty.countryCode}`, href: canonical },
  ];

  const schemas: Record<string, unknown>[] = [
    serviceSchema({
      name: intent ? `${svc.name} ${intent.label} in ${cty.city}` : `${svc.name} Agency in ${cty.city}`,
      description: metaDescription,
      url: canonical,
      serviceType: svc.serviceType,
    }),
    breadcrumbSchema([
      { name: "Home", url: "https://digitalpenta.com/" },
      { name: svc.name, url: `https://digitalpenta.com${svc.hubHref}` },
      { name: cty.city, url: `https://digitalpenta.com/${svc.slug}/${cty.slug}` },
      ...(intent ? [{ name: intent.label, url: canonical }] : []),
    ]),
    faqPageSchema(faqs),
    aggregateRatingSchema({
      itemName: intent ? `${svc.name} ${intent.label} in ${cty.city}` : `${svc.name} Agency in ${cty.city}`,
      itemUrl: canonical,
    }),
  ];

  const nearby = getNearbyLocations(cty.slug, 3);
  const featured = getLocationFeaturedServices();

  return (
    <Layout>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={canonical}
        hreflangs={hreflangs}
        schemas={schemas}
        ogType="website"
        ogImage="https://digitalpenta.com/og-image.png"
      />

      {/* Breadcrumb */}
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>›</span>
            <Link to={svc.hubHref} className="hover:text-foreground transition-colors">{svc.name}</Link>
            <span>›</span>
            {intent ? (
              <>
                <Link to={`/${svc.slug}/${cty.slug}`} className="hover:text-foreground transition-colors">{cty.city}</Link>
                <span>›</span>
                <span className="text-foreground">{intent.label}</span>
              </>
            ) : (
              <span className="text-foreground">{cty.city}</span>
            )}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs text-primary uppercase tracking-widest font-mono">
                {svc.name} • {cty.city}, {cty.region === "india" ? "India" : "Middle East"}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mb-6 leading-tight">
              {h1}
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {heroSubhead}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/get-proposal">
                <Button size="lg" className="rounded-full px-8 font-display font-semibold">
                  Get Free {svc.name} Audit
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="rounded-full px-8 font-display font-semibold border-border/40">
                  Talk to a {cty.city} Expert
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1">4.9 / 5 from 87+ verified reviews</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intent-specific promises (only on /:service/:city/:intent pages) */}
      {intent && (
        <section className="py-16 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-8">
              <p className="type-label text-primary mb-3 font-mono">Specialised for {intent.intentNoun}s</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
                Why {intent.intentNoun}s in <span className="text-gradient">{cty.city}</span> pick us
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {intent.promises.map((p, i) => (
                <div key={i} className="card-premium p-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${svc.iconAccent} bg-white/[0.04] mb-3 font-display font-semibold`}>{i + 1}</div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <p className="type-label text-primary mb-3 font-mono">What's included</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              {svc.name} Built for the <span className="text-gradient">{cty.city}</span> Market
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {svc.bullets.map(b => (
              <div key={b.title} className="card-premium p-6">
                <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${svc.iconAccent}`} />
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-card/20 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
            {svc.name} Specialists for <span className="text-gradient">{cty.city}</span>'s Top Industries
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {cty.industries.map(ind => (
              <span key={ind} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/30 text-sm text-foreground">
                <Building2 className="w-3.5 h-3.5 text-primary/60" />
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display font-bold text-3xl text-foreground mb-10 text-center">
            {svc.name} in {cty.city} — Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card-premium p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related links */}
      {nearby.length > 0 && (
        <RelatedLinks
          kicker="Nearby markets"
          heading={`${svc.name} in Other Cities Near ${cty.city}`}
          items={nearby.map(n => ({
            title: `${svc.name} Agency in ${n.city}`,
            href: `/${svc.slug}/${n.slug}`,
            desc: n.blurb,
          }))}
          tinted
        />
      )}

      {featured.length > 0 && (
        <RelatedLinks
          kicker="Other services"
          heading={`Other Marketing Services We Offer in ${cty.city}`}
          items={featured
            .filter(f => f.slug !== svc.slug)
            .slice(0, 4)
            .map(f => ({
              title: f.title,
              href: `/services/${f.category}/${f.slug}`,
              desc: f.desc,
            }))}
        />
      )}

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Win {svc.name} in <span className="text-gradient">{cty.city}</span>?
          </h2>
          <p className="text-muted-foreground mb-8">
            Get a free, no-strings {svc.name} audit and a 90-day execution roadmap from our {cty.city} team.
          </p>
          <Link to="/get-proposal">
            <Button size="lg" className="rounded-full px-10 font-display font-semibold">
              Get Free {svc.name} Audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
