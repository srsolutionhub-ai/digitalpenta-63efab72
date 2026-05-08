import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead, { breadcrumbSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";
import AiToolRunner from "@/components/tools/AiToolRunner";

interface Result {
  title: string;
  description: string;
  og_title?: string;
  og_description?: string;
  twitter_title?: string;
  twitter_description?: string;
  suggested_keywords?: string[];
  h1_alternatives?: string[];
}

export default function MetaTagsTool() {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [intent, setIntent] = useState("");
  const [brand, setBrand] = useState("");
  const inputs = { topic, keyword, intent, brand };
  const ready = topic.length > 2;

  return (
    <Layout>
      <SEOHead
        title="Free AI Meta Tag Generator — SEO Title & Description | Digital Penta"
        description="Generate SEO-optimised page titles, meta descriptions, OG and Twitter tags in seconds. Free AI tool from Digital Penta."
        canonical="https://digitalpenta.com/tools/meta-tags"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Free Tools", url: "https://digitalpenta.com/tools" },
            { name: "Meta Tag Generator", url: "https://digitalpenta.com/tools/meta-tags" },
          ]),
          softwareApplicationSchema({
            name: "AI Meta Tag Generator",
            description: "Free AI tool — SEO-optimised title, description, OG and Twitter tags.",
            url: "https://digitalpenta.com/tools/meta-tags",
          }),
        ]}
      />
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Free AI Tool</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">AI Meta Tag Generator</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">SEO-tuned title, meta description, OG, Twitter, and H1 alternatives for any page.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <AiToolRunner<Result>
            toolSlug="meta-tags"
            toolName="Meta Tag Generator"
            inputs={inputs}
            isReady={ready}
            renderResult={(r) => (
              <div className="space-y-3 text-sm">
                <Field label="Title" value={r.title} />
                <Field label="Meta description" value={r.description} />
                <Field label="OG title" value={r.og_title} />
                <Field label="OG description" value={r.og_description} />
                <Field label="Twitter title" value={r.twitter_title} />
                <Field label="Twitter description" value={r.twitter_description} />
                {r.suggested_keywords && (
                  <div>
                    <p className="type-label text-primary mb-1.5 font-mono">Suggested keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.suggested_keywords.map((k, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-white/[0.04] text-xs text-foreground/80 border border-border/30">{k}</span>)}
                    </div>
                  </div>
                )}
                {r.h1_alternatives && (
                  <div>
                    <p className="type-label text-primary mb-1.5 font-mono">H1 alternatives</p>
                    <ul className="list-disc list-inside text-foreground/80 space-y-1">{r.h1_alternatives.map((h, i) => <li key={i}>{h}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          >
            <div>
              <Label htmlFor="mt-topic" className="text-xs">Page topic *</Label>
              <Input id="mt-topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Best CRM software for small businesses" />
            </div>
            <div>
              <Label htmlFor="mt-keyword" className="text-xs">Target keyword</Label>
              <Input id="mt-keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. small business CRM" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="mt-intent" className="text-xs">Page intent</Label>
                <Input id="mt-intent" value={intent} onChange={e => setIntent(e.target.value)} placeholder="informational / commercial / transactional" />
              </div>
              <div>
                <Label htmlFor="mt-brand" className="text-xs">Brand</Label>
                <Input id="mt-brand" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Your brand name" />
              </div>
            </div>
          </AiToolRunner>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="border border-border/30 rounded-lg p-3">
      <p className="type-label text-primary mb-1 font-mono">{label}</p>
      <p className="text-foreground/90">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{value.length} chars</p>
    </div>
  );
}
