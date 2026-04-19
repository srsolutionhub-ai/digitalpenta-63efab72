import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight, MapPin, Phone, Mail, Star,
  MessageCircle, CheckCircle2, ArrowRight, ArrowUpRight, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocationData } from "@/data/locationData";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import MagneticCard from "@/components/ui/magnetic-card";
import SEOHead, {
  breadcrumbSchema, faqPageSchema, localBusinessSchema,
  type HreflangAlternate,
} from "@/components/seo/SEOHead";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { getNearbyLocations, getLocationFeaturedServices } from "@/data/internalLinks";

const ease = [0.16, 1, 0.3, 1] as const;

const COUNTRY_CODE: Record<string, string> = {
  India: "IN", UAE: "AE", "Saudi Arabia": "SA", Qatar: "QA", Bahrain: "BH",
};
const ARABIC_HREFLANG: Record<string, string> = {
  UAE: "ar-AE", "Saudi Arabia": "ar-SA", Qatar: "ar-QA", Bahrain: "ar-BH",
};

export default function LocationPage() {
  const { location } = useParams<{ location: string }>();
  const data = getLocationData(location || "");
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true, margin: "-80px" });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  if (!data) {
    return (
      <Layout>
        <section className="pt-32 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-display font-bold text-3xl text-foreground">Location not found</h1>
            <Link to="/" className="text-primary text-sm mt-4 inline-block">← Back to Home</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const isMiddleEast = data.region === "middle-east";
  const canonical = `https://digitalpenta.com/locations/${data.slug}`;
  const countryCode = COUNTRY_CODE[data.country] ?? "IN";

  /* hreflang alternates */
  const hreflangs: HreflangAlternate[] = [
    { hreflang: "x-default", href: canonical },
    { hreflang: "en", href: canonical },
  ];
  if (data.region === "india") {
    hreflangs.push({ hreflang: "en-IN", href: canonical });
  } else {
    hreflangs.push({ hreflang: `en-${countryCode}`, href: canonical });
    const ar = ARABIC_HREFLANG[data.country];
    if (ar) hreflangs.push({ hreflang: ar, href: canonical });
  }

  const schemas: Record<string, unknown>[] = [
    localBusinessSchema({
      city: data.city,
      countryCode,
      url: canonical,
      phone: data.phone,
      email: data.email,
      streetAddress: data.schema.streetAddress,
      postalCode: data.schema.postalCode,
      latitude: data.schema.latitude,
      longitude: data.schema.longitude,
      description: data.description,
    }),
    breadcrumbSchema([
      { name: "Home", url: "https://digitalpenta.com/" },
      { name: "Locations", url: "https://digitalpenta.com/#locations" },
      { name: data.city, url: canonical },
    ]),
  ];
  if (data.faqs.length) schemas.push(faqPageSchema(data.faqs));

  return (
    <Layout>
      <SEOHead
        title={data.metaTitle}
        description={data.metaDescription}
        canonical={canonical}
        hreflangs={hreflangs}
        schemas={schemas}
        arabicTitle={data.metaTitleAr}
        arabicDescription={data.metaDescriptionAr}
      />

      {/* Breadcrumb */}
      <div className="pt-24 pb-0">
        <div className="container mx-auto px-4">
          <nav
            className="flex items-center gap-1 text-xs text-muted-foreground font-mono"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-muted-foreground">Locations</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{data.city}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-20 relative overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[150px] animate-breathe pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="max-w-3xl"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />

            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary/40 animate-ping" />
              </div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest">
                {data.city}, {data.country}
              </span>
              {isMiddleEast && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  Middle East
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mb-6 leading-tight">
              {data.tagline}
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-8">
              {data.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/get-proposal">
                <Button
                  size="lg"
                  className="rounded-full px-8 font-display font-semibold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
                >
                  Get Free Proposal for {data.city}
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 font-display font-semibold border-border/40"
                >
                  Talk to {data.city} Expert
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {["Free audit", "Response in 24hrs", "No long-term lock-in"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 border-y border-border/30 bg-card/20" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {data.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="font-mono font-bold text-2xl md:text-3xl text-gradient">{s.value}</p>
                <p className="text-xs text-muted-foreground font-display mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services + Industries */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                Services Available in{" "}
                <span className="text-gradient">{data.city}</span>
              </h2>
              <div className="space-y-2">
                {data.services.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl glass border border-border/20 hover:border-primary/20 transition-all duration-300 group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground font-display">{s}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Industries */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                Industries We Serve in{" "}
                <span className="text-gradient">{data.city}</span>
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {data.industries.map((ind, i) => (
                  <motion.div
                    key={ind}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl glass border border-border/20 hover:border-primary/20 transition-all duration-300"
                  >
                    <Building2 className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    <span className="text-xs text-muted-foreground font-display">{ind}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us for this city */}
      <section className="py-16 bg-card/20 border-y border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
              Why {data.city} Businesses Choose{" "}
              <span className="text-gradient">Digital Penta</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {data.whyUs.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl card-premium"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial + Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <MagneticCard className="h-full">
                <div className="card-premium p-8 h-full relative overflow-hidden">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400 mb-4" />
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground/90 leading-relaxed mb-6 text-lg font-display italic">
                    &ldquo;{data.testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {data.testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground text-sm">
                        {data.testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.testimonial.role}, {data.testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </MagneticCard>
            </motion.div>

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="space-y-4"
            >
              <div className="card-premium p-6">
                <h3 className="font-display font-bold text-foreground mb-4">
                  {data.city} Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{data.address}</span>
                  </div>
                  <a href={`tel:${data.phone}`}
                    className="flex items-center gap-3 hover:text-foreground transition-colors text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    {data.phone}
                  </a>
                  <a href={`mailto:${data.email}`}
                    className="flex items-center gap-3 hover:text-foreground transition-colors text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    {data.email}
                  </a>
                </div>
              </div>

              {/* WhatsApp for Middle East */}
              {isMiddleEast && (
                <a
                  href="https://wa.me/918860100039"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 card-premium p-4 hover:border-emerald-500/20 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">WhatsApp Us</p>
                    <p className="text-xs text-muted-foreground">Quick response for MENA clients</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              <Link to="/get-proposal" className="block">
                <Button
                  size="lg"
                  className="w-full rounded-full font-display font-semibold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white"
                >
                  Get Free Proposal for {data.city}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden border border-border/30 max-w-5xl mx-auto">
            <iframe
              src={data.mapEmbed}
              width="100%"
              height="300"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Digital Penta ${data.city} office location`}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faqs.length > 0 && (
        <section className="py-20 bg-card/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10 text-center"
            >
              Questions About Digital Marketing in{" "}
              <span className="text-gradient">{data.city}</span>
            </motion.h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="card-premium p-6"
                >
                  <h3 className="font-display font-semibold text-foreground mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured services — internal linking matrix */}
      <RelatedLinks
        kicker="OUR CORE SERVICES"
        heading={`Popular Services in ${data.city}`}
        intro={`The marketing & technology services ${data.city} brands hire us for most often.`}
        items={getLocationFeaturedServices().map(s => ({
          href: `/services/${s.category}/${s.slug}`,
          title: s.title,
          desc: s.desc,
          eyebrow: s.category.replace(/-/g, " "),
        }))}
      />

      {/* Nearby locations — internal linking matrix */}
      {getNearbyLocations(data.slug).length > 0 && (
        <RelatedLinks
          kicker="NEARBY MARKETS"
          heading={`Other Cities We Serve Near ${data.city}`}
          intro="Expand your reach across the region with hyper-local strategies built for each market."
          tinted
          items={getNearbyLocations(data.slug).map(c => ({
            href: `/locations/${c.slug}`,
            title: `Digital Marketing in ${c.city}`,
            desc: c.blurb,
            eyebrow: c.country,
          }))}
        />
      )}

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ready to Grow Your Business in{" "}
              <span className="text-gradient">{data.city}</span>?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Get a custom digital marketing strategy built specifically for the {data.city} market.
            </p>
            <Link to="/get-proposal">
              <Button
                size="lg"
                className="rounded-full px-10 font-display font-semibold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg"
              >
                Get Your Free {data.city} Strategy →
              </Button>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Free 30-min strategy call
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Custom {data.city} market analysis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> No commitment required
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
