import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle2, MapPin, Building2, Star, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import SEOHead, {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  type HreflangAlternate,
} from "@/components/seo/SEOHead";
import { getArabicLocation } from "@/data/locationDataAr";
import { getLocationData } from "@/data/locationData";

const COUNTRY_CODE: Record<string, string> = {
  "الإمارات العربية المتحدة": "AE",
  "المملكة العربية السعودية": "SA",
  "قطر": "QA",
  "البحرين": "BH",
};

/**
 * Arabic RTL location page (Phase 5 of SEO master plan).
 *
 * Route: /ar/locations/:location
 * Layout: dir="rtl", Cairo + Tajawal Arabic webfonts (loaded from Google Fonts).
 * SEO: bilingual hreflang pairing — links back to English /locations/{slug}.
 */
export default function LocationPageAr() {
  const { location } = useParams<{ location: string }>();
  const data = getArabicLocation(location || "");
  const enData = getLocationData(location || "");

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

  if (!data || !enData) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center" dir="rtl">
          <div className="container mx-auto px-4">
            <h1 className="font-bold text-3xl text-foreground" style={{ fontFamily: "Cairo, Tajawal, sans-serif" }}>
              الصفحة غير موجودة
            </h1>
            <Link to="/" className="text-primary text-sm mt-4 inline-block">← العودة إلى الصفحة الرئيسية</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const canonical = `https://digitalpenta.com/ar/locations/${data.slug}`;
  const enCanonical = `https://digitalpenta.com/locations/${data.slug}`;
  const countryCode = COUNTRY_CODE[data.country] ?? "AE";

  const hreflangs: HreflangAlternate[] = [
    { hreflang: "x-default", href: enCanonical },
    { hreflang: "en", href: enCanonical },
    { hreflang: data.enHreflang, href: enCanonical },
    { hreflang: data.hreflang, href: canonical },
  ];

  const schemas: Record<string, unknown>[] = [
    localBusinessSchema({
      city: enData.city,
      countryCode,
      url: canonical,
      phone: enData.phone,
      email: enData.email,
      streetAddress: enData.schema.streetAddress,
      postalCode: enData.schema.postalCode,
      latitude: enData.schema.latitude,
      longitude: enData.schema.longitude,
      description: data.description,
    }),
    breadcrumbSchema([
      { name: "الرئيسية", url: "https://digitalpenta.com/" },
      { name: "المواقع", url: "https://digitalpenta.com/#locations" },
      { name: data.city, url: canonical },
    ]),
    faqPageSchema(data.faqs),
  ];

  return (
    <Layout>
      <SEOHead
        title={data.metaTitle}
        description={data.metaDescription}
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
        {/* Breadcrumb + language switch */}
        <div className="pt-24 pb-0">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="مسار التنقل">
              <Link to="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
              <span>›</span>
              <span>المواقع</span>
              <span>›</span>
              <span className="text-foreground">{data.city}</span>
            </nav>
            <Link
              to={`/locations/${data.slug}`}
              className="text-xs text-primary hover:text-foreground transition-colors"
              dir="ltr"
            >
              English ↗
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

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-xs text-primary uppercase tracking-widest">
                  {data.city}، {data.country}
                </span>
              </div>

              <h1 className="font-extrabold text-4xl md:text-6xl text-foreground mb-6 leading-tight">
                {data.tagline}
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-8">
                {data.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/get-proposal">
                  <Button
                    size="lg"
                    className="rounded-full px-8 font-semibold bg-gradient-to-l from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
                  >
                    {data.proposalCta}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 font-semibold border-border/40"
                  >
                    {data.expertCta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services + Industries */}
        <section className="py-20 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-bold text-2xl text-foreground mb-6">
                  الخدمات المتاحة في <span className="text-gradient">{data.city}</span>
                </h2>
                <div className="space-y-2">
                  {data.services.map((s) => (
                    <div
                      key={s}
                      className="flex items-center gap-3 p-3 rounded-xl glass border border-border/20"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-bold text-2xl text-foreground mb-6">
                  القطاعات التي نخدمها في <span className="text-gradient">{data.city}</span>
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {data.industries.map((ind) => (
                    <div
                      key={ind}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl glass border border-border/20"
                    >
                      <Building2 className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                      <span className="text-xs text-muted-foreground">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-16 bg-card/20 border-y border-border/30">
          <div className="container mx-auto px-4 max-w-3xl mx-auto">
            <h2 className="font-bold text-2xl text-foreground mb-6 text-center">
              لماذا تختار شركات {data.city}{" "}
              <span className="text-gradient">ديجيتال بنتا</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {data.whyUs.map((point) => (
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

        {/* Testimonial + contact */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="card-premium p-8">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6 text-lg italic">
                  «{data.testimonial.quote}»
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {data.testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{data.testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {data.testimonial.role}، {data.testimonial.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <h3 className="font-bold text-foreground mb-4">معلومات التواصل في {data.city}</h3>
                <div className="space-y-3 text-sm" dir="ltr">
                  <a href={`tel:${enData.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    {enData.phone}
                  </a>
                  <a href={`mailto:${enData.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    {enData.email}
                  </a>
                </div>
                <Link to="/get-proposal" className="block mt-6">
                  <Button
                    size="lg"
                    className="w-full rounded-full font-semibold bg-gradient-to-l from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white"
                  >
                    {data.proposalCta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-card/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-10 text-center">
              أسئلة متكررة عن التسويق الرقمي في{" "}
              <span className="text-gradient">{data.city}</span>
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <div key={i} className="card-premium p-6">
                  <h3 className="font-semibold text-foreground mb-3">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-4">
              مستعد لتنمية أعمالك في{" "}
              <span className="text-gradient">{data.city}</span>؟
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              احصل على استراتيجية تسويق رقمي مخصصة لسوق {data.city}.
            </p>
            <Link to="/get-proposal">
              <Button
                size="lg"
                className="rounded-full px-10 font-semibold bg-gradient-to-l from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
              >
                {data.proposalCta} ←
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
