import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema, itemListSchema } from "@/components/seo/SEOHead";
import { MATRIX_SERVICES, MATRIX_CITIES } from "@/data/matrixData";
import { iterateMatrixIntentTuples } from "@/data/matrixIntents";

/**
 * Phase 1 audit upgrade — HTML sitemap.
 *
 * Crawlable index of every static, programmatic and intent-level URL on the
 * site. Reinforces the silo structure that Google uses to allocate authority,
 * and gives users a single page to discover the platform's full surface.
 */

const STATIC_PAGES = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Contact", url: "/contact" },
  { name: "Get a Proposal", url: "/get-proposal" },
  { name: "Portfolio & Case Studies", url: "/portfolio" },
  { name: "Blog", url: "/blog" },
  { name: "Free SEO Audit Tool", url: "/tools/seo-audit" },
  { name: "Privacy Policy", url: "/privacy" },
  { name: "Terms of Service", url: "/terms" },
];

const SERVICE_HUBS = [
  { name: "Digital Marketing", url: "/services/digital-marketing" },
  { name: "Public Relations", url: "/services/public-relations" },
  { name: "Web & App Development", url: "/services/development" },
  { name: "AI Solutions", url: "/services/ai-solutions" },
  { name: "Marketing Automation", url: "/services/automation" },
];

export default function SitemapPage() {
  const intentTuples = iterateMatrixIntentTuples();

  return (
    <Layout>
      <SEOHead
        title="Sitemap | Digital Penta — Every Page Indexed"
        description="Complete sitemap of Digital Penta — services, locations, intent-specific landing pages, blog and free tools. One crawlable index of the platform."
        canonical="https://digitalpenta.com/sitemap"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Sitemap", url: "https://digitalpenta.com/sitemap" },
          ]),
          itemListSchema({
            name: "Digital Penta — Site Index",
            items: [
              ...STATIC_PAGES.map(p => ({ name: p.name, url: `https://digitalpenta.com${p.url}` })),
              ...SERVICE_HUBS.map(p => ({ name: p.name, url: `https://digitalpenta.com${p.url}` })),
            ],
          }),
        ]}
      />

      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="type-label text-primary mb-3 font-mono">Sitemap</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Every page on Digital Penta
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A complete, human + crawler-friendly index of services, programmatic city &amp; intent
            pages, blog content and free tools. {STATIC_PAGES.length + SERVICE_HUBS.length + (MATRIX_SERVICES.length * MATRIX_CITIES.length) + intentTuples.length}+ URLs.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          <SitemapBlock title="Core pages" items={STATIC_PAGES} />
          <SitemapBlock title="Service hubs" items={SERVICE_HUBS} />

          <div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">City &amp; service combinations</h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
              {MATRIX_SERVICES.flatMap(svc =>
                MATRIX_CITIES.map(cty => ({
                  name: `${svc.name} Agency in ${cty.city}`,
                  url: `/${svc.slug}/${cty.slug}`,
                }))
              ).map(p => (
                <Link key={p.url} to={p.url} className="text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                  → {p.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
              Intent-specific landing pages <span className="text-sm text-muted-foreground font-mono">({intentTuples.length})</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
              {intentTuples.map(t => {
                const path = `/${t.service.slug}/${t.city.slug}/${t.intent.slug}`;
                return (
                  <Link key={path} to={path} className="text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                    → {t.service.name} {t.intent.label} — {t.city.city}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function SitemapBlock({ title, items }: { title: string; items: { name: string; url: string }[] }) {
  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-foreground mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
        {items.map(p => (
          <Link key={p.url} to={p.url} className="text-sm text-muted-foreground hover:text-primary transition-colors py-1">
            → {p.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
