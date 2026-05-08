import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SEOHead, { breadcrumbSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";
import AiToolRunner from "@/components/tools/AiToolRunner";

interface Result {
  google?: { headlines: string[]; descriptions: string[] }[];
  meta?: { primary: string; headline: string; description: string }[];
  linkedin?: { intro: string; headline: string }[];
}

export default function AdCopyTool() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [benefit, setBenefit] = useState("");
  const [tone, setTone] = useState("");
  const [cta, setCta] = useState("");
  const inputs = { product, audience, benefit, tone, cta };
  const ready = product.length > 2 && audience.length > 2 && benefit.length > 2;

  return (
    <Layout>
      <SEOHead
        title="Free AI Ad Copy Generator — Google & Meta | Digital Penta"
        description="Generate high-converting Google, Meta and LinkedIn ad copy in seconds. Free AI ad copywriter built by performance-marketing specialists."
        canonical="https://digitalpenta.com/tools/ad-copy"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Free Tools", url: "https://digitalpenta.com/tools" },
            { name: "Ad Copy Generator", url: "https://digitalpenta.com/tools/ad-copy" },
          ]),
          softwareApplicationSchema({
            name: "AI Ad Copy Generator",
            description: "Generate Google + Meta + LinkedIn ad variants instantly.",
            url: "https://digitalpenta.com/tools/ad-copy",
          }),
        ]}
      />
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Free AI Tool</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">AI Ad Copy Generator</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">3 Google variants + 3 Meta variants + 2 LinkedIn variants — engineered for click-through and conversion.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <AiToolRunner<Result>
            toolSlug="ad-copy"
            toolName="Ad Copy Generator"
            inputs={inputs}
            isReady={ready}
            renderResult={(r) => (
              <div className="space-y-5 text-sm">
                {r.google && (
                  <div>
                    <p className="type-label text-amber-400 mb-2 font-mono">Google Ads</p>
                    {r.google.map((g, i) => (
                      <div key={i} className="border border-border/30 rounded-lg p-3 mb-2">
                        <div className="font-display font-semibold mb-1">Variant {i + 1}</div>
                        {g.headlines?.map((h, j) => <div key={j} className="text-foreground/80">• {h}</div>)}
                        {g.descriptions?.map((d, j) => <div key={j} className="text-muted-foreground mt-1">{d}</div>)}
                      </div>
                    ))}
                  </div>
                )}
                {r.meta && (
                  <div>
                    <p className="type-label text-sky-400 mb-2 font-mono">Meta (Facebook + Instagram)</p>
                    {r.meta.map((m, i) => (
                      <div key={i} className="border border-border/30 rounded-lg p-3 mb-2">
                        <div className="text-foreground/80 mb-1">{m.primary}</div>
                        <div className="font-display font-semibold">{m.headline}</div>
                        <div className="text-muted-foreground text-xs mt-1">{m.description}</div>
                      </div>
                    ))}
                  </div>
                )}
                {r.linkedin && (
                  <div>
                    <p className="type-label text-violet-400 mb-2 font-mono">LinkedIn</p>
                    {r.linkedin.map((l, i) => (
                      <div key={i} className="border border-border/30 rounded-lg p-3 mb-2">
                        <div className="text-foreground/80 mb-1">{l.intro}</div>
                        <div className="font-display font-semibold">{l.headline}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          >
            <div>
              <Label htmlFor="ac-product" className="text-xs">Product / service *</Label>
              <Input id="ac-product" value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. Digital marketing agency" />
            </div>
            <div>
              <Label htmlFor="ac-audience" className="text-xs">Target audience *</Label>
              <Input id="ac-audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. SaaS founders in Bangalore" />
            </div>
            <div>
              <Label htmlFor="ac-benefit" className="text-xs">Key benefit *</Label>
              <Textarea id="ac-benefit" rows={3} value={benefit} onChange={e => setBenefit(e.target.value)} placeholder="e.g. 3× pipeline in 90 days with paid + SEO" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ac-tone" className="text-xs">Tone</Label>
                <Input id="ac-tone" value={tone} onChange={e => setTone(e.target.value)} placeholder="confident, friendly…" />
              </div>
              <div>
                <Label htmlFor="ac-cta" className="text-xs">Call to action</Label>
                <Input id="ac-cta" value={cta} onChange={e => setCta(e.target.value)} placeholder="Book a free strategy call" />
              </div>
            </div>
          </AiToolRunner>
        </div>
      </section>
    </Layout>
  );
}
