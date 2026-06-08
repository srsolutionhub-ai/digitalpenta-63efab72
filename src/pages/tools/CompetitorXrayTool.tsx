import { lazy, Suspense, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead, { breadcrumbSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";
import AiToolRunner from "@/components/tools/AiToolRunner";

// Dashboard + charts lazy-loaded so the tool landing page stays light.
const CompetitorXrayDashboard = lazy(() => import("@/components/tools/CompetitorXrayDashboard"));

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
              <Suspense fallback={<div className="h-64 rounded-lg bg-card/30 animate-pulse" />}>
                <CompetitorXrayDashboard r={r} />
              </Suspense>
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
