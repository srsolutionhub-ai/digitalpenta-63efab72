import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, MapPin, ArrowUpRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllLocations } from "@/data/locationData";
import SEOHead, {
  breadcrumbSchema,
  collectionPageSchema,
  answerPageSchema,
  gmbBusinessSchema,
} from "@/components/seo/SEOHead";

const CANONICAL = "https://digitalpenta.com/locations";

export default function LocationsHub() {
  const all = getAllLocations();
  const india = all.filter((l) => l.region === "india");
  const mena = all.filter((l) => l.region === "middle-east");

  const items = all.map((l) => ({
    name: `Digital Marketing Agency in ${l.city}`,
    url: `https://digitalpenta.com/locations/${l.slug}`,
  }));

  const answer = `Digital Penta is a digital marketing agency headquartered in New Delhi, India, with dedicated city teams serving ${all
    .map((l) => l.city)
    .join(", ")}. Each city team delivers SEO, Google Ads, social media, web development, PR and AI automation with local-market keyword, competitor and Google Business Profile strategy.`;

  return (
    <Layout>
      <SEOHead
        title="Our Locations | Digital Penta Agency Across India & Gulf"
        description="Find your local Digital Penta team — digital marketing agency offices and service areas across Delhi, Mumbai, Bangalore, Lucknow, Dubai, Riyadh, Doha and more."
        canonical={CANONICAL}
        hreflangs={[
          { hreflang: "en", href: CANONICAL },
          { hreflang: "en-IN", href: CANONICAL },
          { hreflang: "x-default", href: CANONICAL },
        ]}
        schemas={[
          gmbBusinessSchema(),
          collectionPageSchema({
            name: "Digital Penta Locations",
            description:
              "City-level digital marketing teams and service areas operated by Digital Penta across India and the Middle East.",
            url: CANONICAL,
            items,
          }),
          answerPageSchema({
            name: "Which cities does Digital Penta serve?",
            description:
              "Digital Penta operates city teams across India and the Gulf, each with local SEO, paid media and Google Business Profile expertise.",
            url: CANONICAL,
            answer,
            about: "Digital marketing agency locations in India and the Middle East",
          }),
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Locations", url: CANONICAL },
          ]),
        ]}
      />

      {/* Breadcrumb */}
      <div className="pt-24">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground font-mono" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-foreground">Locations</span>
          </nav>
        </div>
      </div>

      {/* Hero + direct answer block (AI Overview / AEO target) */}
      <section className="pt-8 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground mb-5 leading-tight">
            Digital Penta Locations —{" "}
            <span className="text-gradient">Agency Teams Across India &amp; the Gulf</span>
          </h1>
          <p data-speakable className="text-muted-foreground text-lg leading-relaxed mb-8">
            {answer}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/get-proposal">
              <Button size="lg" className="rounded-full px-8 font-display font-semibold bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white shadow-lg">
                Get a free city-level audit
              </Button>
            </Link>
            <a href="tel:+918860100039">
              <Button variant="outline" size="lg" className="rounded-full px-8 font-display font-semibold border-border/40">
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" /> +91 88601 00039
              </Button>
            </a>
          </div>
        </div>
      </section>

      <CityGrid heading="Digital marketing agency locations in India" cities={india} />
      <CityGrid heading="Digital marketing agency locations in the Middle East" cities={mena} />
    </Layout>
  );
}

function CityGrid({
  heading,
  cities,
}: {
  heading: string;
  cities: ReturnType<typeof getAllLocations>;
}) {
  const id = heading.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section className="py-14 border-t border-border/30" aria-labelledby={id}>
      <div className="container mx-auto px-4">
        <h2 id={id} className="font-display font-bold text-2xl md:text-3xl text-foreground mb-8">
          {heading}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((l) => (
            <Link
              key={l.slug}
              to={`/locations/${l.slug}`}
              className="group rounded-2xl glass border border-border/30 p-6 hover:border-primary/25 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {l.country}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                Digital Marketing Agency in {l.city}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{l.tagline}</p>
              <p className="text-xs font-mono text-muted-foreground mt-4">
                {l.services.slice(0, 3).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
