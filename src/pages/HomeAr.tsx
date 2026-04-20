import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, Star, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead, {
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  reviewedItemSchema,
  type HreflangAlternate,
} from "@/components/seo/SEOHead";
import { HOMEPAGE_AR } from "@/data/homepageAr";
import { HOMEPAGE_REVIEWS } from "@/data/customerReviews";

/**
 * Arabic homepage (Phase 5 of SEO master plan).
 *
 * Route: /ar
 * Layout: dir="rtl", Cairo + Tajawal Arabic webfonts.
 * SEO: bilingual hreflang pairing back to /.
 */
export default function HomeAr() {
  // Apply RTL on the document root only while this page is mounted.
  useEffect(() => {
    const html = document.documentElement;
    const prevDir = html.getAttribute("dir");
    const prevLang = html.getAttribute("lang");
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");
    return () => {
      if (prevDir) html.setAttribute("dir", prevDir);
      else html.removeAttribute("dir");
      if (prevLang) html.setAttribute("lang", prevLang);
      else html.removeAttribute("lang");
    };
  }, []);

  // Inject Arabic webfonts once.
  useEffect(() => {
    if (document.querySelector('link[data-arabic-fonts]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap";
    link.setAttribute("data-arabic-fonts", "true");
    document.head.appendChild(link);
  }, []);

  const canonical = "https://digitalpenta.com/ar";
  const enCanonical = "https://digitalpenta.com/";

  const hreflangs: HreflangAlternate[] = [
    { hreflang: "x-default", href: enCanonical },
    { hreflang: "en", href: enCanonical },
    { hreflang: "en-IN", href: enCanonical },
    { hreflang: "ar", href: canonical },
    { hreflang: "ar-AE", href: canonical },
    { hreflang: "ar-SA", href: canonical },
  ];

  const schemas: Record<string, unknown>[] = [
    organizationSchema(),
    breadcrumbSchema([{ name: "الرئيسية", url: canonical }]),
    faqPageSchema(HOMEPAGE_AR.faq.items),
    reviewedItemSchema({
      itemName: "Digital Penta — وكالة تسويق رقمي",
      itemUrl: canonical,
      itemType: "Organization",
      description: HOMEPAGE_AR.metaDescription,
      reviews: HOMEPAGE_REVIEWS,
      ratingValue: "4.9",
      reviewCount: "87",
    }),
  ];

  return (
    <Layout>
      <SEOHead
        title={HOMEPAGE_AR.metaTitle}
        description={HOMEPAGE_AR.metaDescription}
        canonical={canonical}
        hreflangs={hreflangs}
        schemas={schemas}
      />

      <div
        dir="rtl"
        lang="ar"
        style={{ fontFamily: "Cairo, Tajawal, sans-serif" }}
        className="text-right"
      >
        {/* Top bar with EN switch */}
        <div className="pt-24 pb-0">
          <div className="container mx-auto px-4 flex items-center justify-end">
            <Link
              to="/"
              className="text-xs text-primary hover:text-foreground transition-colors inline-flex items-center gap-1"
              dir="ltr"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              English
            </Link>
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
              <div className="h-1 w-20 bg-gradient-to-l from-primary to-accent rounded-full mb-6" />
              <span className="text-xs text-primary uppercase tracking-widest mb-4 inline-block">
                {HOMEPAGE_AR.hero.eyebrow}
              </span>
              <h1 className="font-extrabold text-4xl md:text-6xl text-foreground mb-6 leading-tight">
                {HOMEPAGE_AR.hero.h1}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                {HOMEPAGE_AR.hero.sub}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/get-proposal">
                  <Button
                    size="lg"
                    className="rounded-full px-8 font-semibold bg-gradient-to-l from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
                  >
                    {HOMEPAGE_AR.hero.primaryCta}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 font-semibold border-border/40"
                  >
                    {HOMEPAGE_AR.hero.secondaryCta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust strip */}
        <div className="border-y border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {HOMEPAGE_AR.trustItems.map((item, i) => (
                <span key={i} className="text-xs text-muted-foreground whitespace-nowrap">
                  {item}
                  {i < HOMEPAGE_AR.trustItems.length - 1 && (
                    <span className="mr-6 text-border">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Intro */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-6">
              {HOMEPAGE_AR.intro.h2}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {HOMEPAGE_AR.intro.body}
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-card/20 border-y border-border/30">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-10 text-center">
              {HOMEPAGE_AR.services.h2}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {HOMEPAGE_AR.services.items.map(s => (
                <div key={s.title} className="card-premium p-6">
                  <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-10 text-center">
              {HOMEPAGE_AR.whyUs.h2}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {HOMEPAGE_AR.whyUs.points.map(point => (
                <div key={point} className="flex items-start gap-3 p-4 rounded-xl card-premium">
                  <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-16 bg-card/20 border-y border-border/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              {HOMEPAGE_AR.industries.h2}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {HOMEPAGE_AR.industries.items.map(ind => (
                <span key={ind} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/30 text-sm text-foreground">
                  <Building2 className="w-3.5 h-3.5 text-primary/60" />
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
              {HOMEPAGE_AR.results.h2}
            </h2>
            <p className="text-muted-foreground mb-10">{HOMEPAGE_AR.results.sub}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {HOMEPAGE_AR.results.stats.map(stat => (
                <div key={stat.label} className="card-premium p-6">
                  <div className="text-3xl md:text-4xl font-extrabold text-gradient mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-card/20 border-y border-border/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-bold text-3xl text-foreground mb-10 text-center">
              {HOMEPAGE_AR.faq.h2}
            </h2>
            <div className="space-y-4">
              {HOMEPAGE_AR.faq.items.map((faq, i) => (
                <div key={i} className="card-premium p-6">
                  <h3 className="font-semibold text-foreground mb-3">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-4">
              {HOMEPAGE_AR.finalCta.h2}
            </h2>
            <p className="text-muted-foreground mb-8">{HOMEPAGE_AR.finalCta.sub}</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-muted-foreground mr-2">4.9 / 5</span>
            </div>
            <Link to="/get-proposal">
              <Button
                size="lg"
                className="rounded-full px-10 font-semibold bg-gradient-to-l from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
              >
                {HOMEPAGE_AR.finalCta.cta} ←
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
