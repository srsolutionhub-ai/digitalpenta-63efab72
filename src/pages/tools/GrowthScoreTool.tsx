import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead, { breadcrumbSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";
import AiToolRunner from "@/components/tools/AiToolRunner";

interface Result {
  score: number; grade: string; summary: string;
  strengths: string[]; weaknesses: string[];
  roadmap: { step: number; title: string; impact: string; timeframe: string; details: string }[];
}

export default function GrowthScoreTool() {
  const [url, setUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [goal, setGoal] = useState("");
  const inputs = { url, industry, goal };
  const ready = /^https?:\/\//.test(url);

  return (
    <Layout>
      <SEOHead
        title="Free AI Growth Score — Audit Your Website | Digital Penta"
        description="Paste your URL and get an instant AI Growth Score (0-100) plus a 6-step roadmap of the highest-impact growth moves for your business."
        canonical="https://digitalpenta.com/tools/growth-score"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Free Tools", url: "https://digitalpenta.com/tools" },
            { name: "Growth Score", url: "https://digitalpenta.com/tools/growth-score" },
          ]),
          softwareApplicationSchema({
            name: "AI Growth Score",
            description: "Free AI website audit — get a 0-100 growth score and prioritized roadmap.",
            url: "https://digitalpenta.com/tools/growth-score",
            ratingValue: "4.9",
            ratingCount: "150",
          }),
        ]}
      />
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Free AI Tool</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">AI Growth Score</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Audit any website in 15 seconds. Get a 0-100 growth score, top strengths, top weaknesses and a 6-step prioritized roadmap.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <AiToolRunner<Result>
            toolSlug="growth-score"
            toolName="Growth Score"
            inputs={inputs}
            isReady={ready}
            renderResult={(r) => (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display font-extrabold text-2xl">
                    {r.score}
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-foreground">Grade {r.grade}</div>
                    <p className="text-sm text-muted-foreground">{r.summary}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="type-label text-emerald-400 mb-1.5 font-mono">Strengths</p>
                    <ul className="space-y-1.5 text-sm text-foreground/80 list-disc list-inside">
                      {r.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="type-label text-rose-400 mb-1.5 font-mono">Weaknesses</p>
                    <ul className="space-y-1.5 text-sm text-foreground/80 list-disc list-inside">
                      {r.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="type-label text-primary mb-2 font-mono">6-step roadmap</p>
                  <ol className="space-y-3">
                    {r.roadmap?.map((step) => (
                      <li key={step.step} className="border border-border/30 rounded-lg p-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono text-primary">Step {step.step} • {step.timeframe}</span>
                          <span className={`px-2 py-0.5 rounded-full font-mono ${step.impact === "High" ? "bg-emerald-500/10 text-emerald-400" : step.impact === "Medium" ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-muted-foreground"}`}>{step.impact} impact</span>
                        </div>
                        <div className="font-display font-semibold text-foreground">{step.title}</div>
                        <p className="text-sm text-muted-foreground mt-1">{step.details}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          >
            <div>
              <Label htmlFor="gs-url" className="text-xs">Your website URL *</Label>
              <Input id="gs-url" required placeholder="https://yourbrand.com" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gs-industry" className="text-xs">Industry</Label>
                <Input id="gs-industry" placeholder="e.g. Real Estate" value={industry} onChange={e => setIndustry(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="gs-goal" className="text-xs">Primary goal</Label>
                <Input id="gs-goal" placeholder="e.g. More qualified leads" value={goal} onChange={e => setGoal(e.target.value)} />
              </div>
            </div>
          </AiToolRunner>
        </div>
      </section>
    </Layout>
  );
}
