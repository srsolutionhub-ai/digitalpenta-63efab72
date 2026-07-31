import { Link } from "react-router-dom";
import { Search, MapPin, ArrowUpRight, Quote } from "lucide-react";
import { isMatrixServiceSlug, MATRIX_CITIES, MATRIX_SERVICES } from "@/data/matrixData";

interface Props {
  city: string;
  citySlug: string;
  country: string;
  industries: string[];
  services: string[];
}

/**
 * City SEO depth block — the piece that was missing for local SERP visibility.
 *
 * Local queries are almost never "digital marketing" alone; they're
 * "digital marketing agency in <city>", "seo company in <city>",
 * "best google ads agency <city>". Google needs those exact strings in
 * headings and body copy, plus crawlable links from the city page to the
 * matching service × city pages. This component supplies both.
 */
export default function CitySeoContent({ city, citySlug, country, industries, services }: Props) {
  const hasMatrix = MATRIX_CITIES.some((c) => c.slug === citySlug);

  const variants = [
    `Digital marketing agency in ${city}`,
    `Digital marketing company in ${city}`,
    `SEO agency in ${city}`,
    `SEO company in ${city}`,
    `Google Ads / PPC agency in ${city}`,
    `Social media marketing agency in ${city}`,
    `Website design & development company in ${city}`,
    `AI automation agency in ${city}`,
  ];

  return (
    <section className="py-20 border-t border-border/20" aria-labelledby="city-seo-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="city-seo-heading" className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6">
          Looking for a <span className="text-gradient">digital marketing agency in {city}</span>?
        </h2>

        <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
          <p>
            Digital Penta is a full-service <strong className="text-foreground">digital marketing
            agency in {city}, {country}</strong>, working with {industries.slice(0, 3).join(", ")} and
            {" "}{industries[industries.length - 1]} brands. We run{" "}
            <strong className="text-foreground">SEO, Google Ads, Meta Ads, social media, website
            development and AI automation</strong> from a single accountable team — so your {city}
            {" "}campaigns are measured on pipeline and revenue, not impressions.
          </p>
          <p>
            Every {city} engagement starts with a free audit of your website, Google Business Profile,
            local pack visibility and paid accounts. You get a 90-day roadmap with the keywords we'll
            target, the pages we'll build, and the numbers we're accountable to — before you spend
            anything with us.
          </p>
        </div>

        {/* Semantic query variants — matches how local buyers actually search */}
        <div className="mt-10">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" /> What {city} businesses search for
          </h3>
          <ul className="grid sm:grid-cols-2 gap-2">
            {variants.map((v) => (
              <li
                key={v}
                className="text-xs text-muted-foreground px-3 py-2.5 rounded-xl glass border border-border/20"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* Crawlable service × city links */}
        <div className="mt-10">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Specialist services for {city}
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {MATRIX_SERVICES.map((s) => {
              const href = hasMatrix && isMatrixServiceSlug(s.slug)
                ? `/${s.slug}/${citySlug}`
                : s.hubHref;
              return (
                <Link
                  key={s.slug}
                  to={href}
                  className="group flex items-center gap-2 px-4 py-3 rounded-xl glass border border-border/20 hover:border-primary/30 transition-colors"
                >
                  <span className="text-sm text-foreground font-display">
                    {s.name} services in {city}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Answer-engine friendly summary — AEO / AI Overviews */}
        <div className="mt-10 card-premium p-6">
          <Quote className="w-5 h-5 text-primary mb-3" />
          <p className="text-sm text-foreground leading-relaxed">
            <strong>In short:</strong> Digital Penta is one of the best digital marketing agencies in{" "}
            {city}, offering {services.slice(0, 4).join(", ")} and more, with transparent monthly
            reporting, no long-term lock-in, and a 4.9★ average client rating across India and the
            Middle East. Call{" "}
            <a href="tel:+918860100039" className="text-primary">+91-88601-00039</a> for a free {city}{" "}
            growth audit.
          </p>
        </div>
      </div>
    </section>
  );
}
