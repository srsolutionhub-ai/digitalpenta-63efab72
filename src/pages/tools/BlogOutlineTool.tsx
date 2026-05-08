import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead, { breadcrumbSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";
import AiToolRunner from "@/components/tools/AiToolRunner";

interface Result {
  title: string;
  meta_description: string;
  target_keyword: string;
  search_intent: string;
  outline: { h2: string; bullets: string[] }[];
  faqs: { q: string; a: string }[];
  internal_link_suggestions?: string[];
  external_authority_links?: string[];
}

export default function BlogOutlineTool() {
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("");
  const [wordCount, setWordCount] = useState("1500");
  const inputs = { topic, keyword, audience, wordCount: Number(wordCount) || 1500 };
  const ready = topic.length > 3;

  return (
    <Layout>
      <SEOHead
        title="Free AI Blog Outline Generator | Digital Penta"
        description="Generate SEO-optimised blog outlines in seconds — H2 structure, FAQs, internal-link map and authority sources. Free AI tool from Digital Penta."
        canonical="https://digitalpenta.com/tools/blog-outline"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Free Tools", url: "https://digitalpenta.com/tools" },
            { name: "Blog Outline Generator", url: "https://digitalpenta.com/tools/blog-outline" },
          ]),
          softwareApplicationSchema({
            name: "AI Blog Outline Generator",
            description: "Free AI SEO outline tool — H2 structure, FAQs, internal-link map.",
            url: "https://digitalpenta.com/tools/blog-outline",
          }),
        ]}
      />
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Free AI Tool</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">AI Blog Outline Generator</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Topic + target keyword → publish-ready outline with H2s, FAQs and link plan.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <AiToolRunner<Result>
            toolSlug="blog-outline"
            toolName="Blog Outline"
            inputs={inputs}
            isReady={ready}
            renderResult={(r) => (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="type-label text-primary mb-1 font-mono">Title</p>
                  <p className="font-display font-bold text-foreground">{r.title}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div className="border border-border/30 rounded p-2"><span className="text-muted-foreground">Keyword:</span> <span className="text-foreground">{r.target_keyword}</span></div>
                  <div className="border border-border/30 rounded p-2"><span className="text-muted-foreground">Intent:</span> <span className="text-foreground">{r.search_intent}</span></div>
                </div>
                <div>
                  <p className="type-label text-primary mb-1.5 font-mono">Meta description</p>
                  <p className="text-foreground/80">{r.meta_description}</p>
                </div>
                <div>
                  <p className="type-label text-primary mb-2 font-mono">Outline</p>
                  <div className="space-y-2">
                    {r.outline?.map((s, i) => (
                      <div key={i} className="border border-border/30 rounded-lg p-3">
                        <div className="font-display font-semibold text-foreground mb-1">H2: {s.h2}</div>
                        <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                          {s.bullets?.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                {r.faqs && (
                  <div>
                    <p className="type-label text-primary mb-1.5 font-mono">Suggested FAQs</p>
                    {r.faqs.map((f, i) => (
                      <div key={i} className="border border-border/30 rounded p-2 mb-1.5">
                        <div className="font-semibold text-foreground/90">{f.q}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{f.a}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          >
            <div>
              <Label htmlFor="bo-topic" className="text-xs">Topic *</Label>
              <Input id="bo-topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="How to rank an ecommerce store on Google" />
            </div>
            <div>
              <Label htmlFor="bo-keyword" className="text-xs">Target keyword</Label>
              <Input id="bo-keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="ecommerce SEO" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="bo-audience" className="text-xs">Audience</Label>
                <Input id="bo-audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder="DTC founders" />
              </div>
              <div>
                <Label htmlFor="bo-words" className="text-xs">Word count</Label>
                <Input id="bo-words" type="number" value={wordCount} onChange={e => setWordCount(e.target.value)} />
              </div>
            </div>
          </AiToolRunner>
        </div>
      </section>
    </Layout>
  );
}
