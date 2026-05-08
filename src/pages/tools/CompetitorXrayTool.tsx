import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead, { breadcrumbSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";
import AiToolRunner from "@/components/tools/AiToolRunner";

interface Result {
  summary: string;
  gaps: { category: string; you: string; competitor: string; opportunity: string; priority: string }[];
  quick_wins?: string[];
  content_gaps?: string[];
  keyword_opportunities?: string[];
}

export default function CompetitorXrayTool() {
  const [you, setYou] = useState("");
  const [comp, setComp] = useState("");
  const [industry, setIndustry] = useState("");
  const inputs = { yourDomain: you, competitorDomain: comp, industry };
  const ready = you.length > 3 && comp.length > 3;

  return (
    <Layout>
      <SEOHead
        title="Free Competitor X-Ray — AI Gap Analysis | Digital Penta"
        description="Compare your website to a competitor across SEO, content, ads and CRO. Free AI competitive intelligence report from Digital Penta."
        canonical="https://digitalpenta.com/tools/competitor-xray"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Free Tools", url: "https://digitalpenta.com/tools" },
            { name: "Competitor X-Ray", url: "https://digitalpenta.com/tools/competitor-xray" },
          ]),
          softwareApplicationSchema({
            name: "Competitor X-Ray",
            description: "Free AI competitor gap analysis — SEO, content, ads, CRO.",
            url: "https://digitalpenta.com/tools/competitor-xray",
          }),
        ]}
      />
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Free AI Tool</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">Competitor X-Ray</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Surface ranking, content, ads, social and CRO gaps in seconds — and get a prioritized opportunity list.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <AiToolRunner<Result>
            toolSlug="competitor-xray"
            toolName="Competitor X-Ray"
            inputs={inputs}
            isReady={ready}
            renderResult={(r) => (
              <div className="space-y-4 text-sm">
                <p className="text-foreground/80">{r.summary}</p>
                {r.gaps?.length > 0 && (
                  <div>
                    <p className="type-label text-primary mb-2 font-mono">Gaps</p>
                    <div className="space-y-2">
                      {r.gaps.map((g, i) => (
                        <div key={i} className="border border-border/30 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-display font-semibold text-foreground">{g.category}</span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${g.priority === "High" ? "bg-rose-500/10 text-rose-400" : g.priority === "Medium" ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-muted-foreground"}`}>{g.priority}</span>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2 text-xs mt-1">
                            <div><span className="text-muted-foreground">You: </span>{g.you}</div>
                            <div><span className="text-muted-foreground">Them: </span>{g.competitor}</div>
                          </div>
                          <div className="text-foreground/80 text-xs mt-2">→ {g.opportunity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {r.quick_wins && (
                  <div>
                    <p className="type-label text-emerald-400 mb-1.5 font-mono">Quick wins</p>
                    <ul className="list-disc list-inside text-foreground/80 space-y-1">{r.quick_wins.map((q, i) => <li key={i}>{q}</li>)}</ul>
                  </div>
                )}
                {r.keyword_opportunities && (
                  <div>
                    <p className="type-label text-sky-400 mb-1.5 font-mono">Keyword opportunities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.keyword_opportunities.map((k, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-white/[0.04] text-xs text-foreground/80 border border-border/30">{k}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          >
            <div>
              <Label htmlFor="cx-you" className="text-xs">Your domain *</Label>
              <Input id="cx-you" value={you} onChange={e => setYou(e.target.value)} placeholder="yourbrand.com" />
            </div>
            <div>
              <Label htmlFor="cx-comp" className="text-xs">Competitor domain *</Label>
              <Input id="cx-comp" value={comp} onChange={e => setComp(e.target.value)} placeholder="competitor.com" />
            </div>
            <div>
              <Label htmlFor="cx-ind" className="text-xs">Industry</Label>
              <Input id="cx-ind" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. SaaS / Real Estate / DTC" />
            </div>
          </AiToolRunner>
        </div>
      </section>
    </Layout>
  );
}
