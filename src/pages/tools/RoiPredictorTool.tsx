import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEOHead, { breadcrumbSchema, softwareApplicationSchema } from "@/components/seo/SEOHead";
import AiToolRunner from "@/components/tools/AiToolRunner";

interface Result {
  summary: string;
  scenarios: { label: string; monthlyLeads: number; monthlyRevenue: number; roi: number; assumptions: string }[];
  kpis: { cpl: number; cac: number; paybackMonths: number; ltv: number };
  recommendations: string[];
}

export default function RoiPredictorTool() {
  const [industry, setIndustry] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [aov, setAov] = useState("");
  const [currency, setCurrency] = useState("INR");
  const inputs = { industry, budget, city, aov, currency };
  const ready = industry.length > 2 && Number(budget) > 0 && city.length > 2;

  return (
    <Layout>
      <SEOHead
        title="Free AI ROI Predictor — 90-Day Marketing Forecast | Digital Penta"
        description="Predict your 90-day marketing ROI across SEO, Google Ads and Meta Ads. Free AI forecast across conservative, base and aggressive scenarios."
        canonical="https://digitalpenta.com/tools/roi-predictor"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Free Tools", url: "https://digitalpenta.com/tools" },
            { name: "ROI Predictor", url: "https://digitalpenta.com/tools/roi-predictor" },
          ]),
          softwareApplicationSchema({
            name: "AI ROI Predictor",
            description: "Free AI tool — 90-day lead and revenue forecast across 3 scenarios.",
            url: "https://digitalpenta.com/tools/roi-predictor",
          }),
        ]}
      />
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Free AI Tool</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">AI ROI Predictor</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Industry + budget + city → 90-day lead and revenue forecast across 3 scenarios with CPL, CAC, payback and LTV.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <AiToolRunner<Result>
            toolSlug="roi-predictor"
            toolName="ROI Predictor"
            inputs={inputs}
            isReady={ready}
            renderResult={(r) => (
              <div className="space-y-4 text-sm">
                <p className="text-foreground/80">{r.summary}</p>
                {r.scenarios && (
                  <div className="grid sm:grid-cols-3 gap-2">
                    {r.scenarios.map(s => (
                      <div key={s.label} className="border border-border/30 rounded-lg p-3">
                        <div className="font-mono text-[11px] text-primary mb-1">{s.label}</div>
                        <div className="font-display font-bold text-foreground text-xl">{s.monthlyLeads}</div>
                        <div className="text-[11px] text-muted-foreground">leads / month</div>
                        <div className="mt-2 text-foreground">{currency} {Number(s.monthlyRevenue).toLocaleString()}</div>
                        <div className="text-[11px] text-emerald-400">ROI {s.roi}×</div>
                      </div>
                    ))}
                  </div>
                )}
                {r.kpis && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Kpi label="CPL" value={`${currency} ${r.kpis.cpl}`} />
                    <Kpi label="CAC" value={`${currency} ${r.kpis.cac}`} />
                    <Kpi label="Payback" value={`${r.kpis.paybackMonths} mo`} />
                    <Kpi label="LTV" value={`${currency} ${r.kpis.ltv}`} />
                  </div>
                )}
                {r.recommendations && (
                  <div>
                    <p className="type-label text-primary mb-1.5 font-mono">Recommendations</p>
                    <ul className="list-disc list-inside text-foreground/80 space-y-1">{r.recommendations.map((q, i) => <li key={i}>{q}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="rp-industry" className="text-xs">Industry *</Label>
                <Input id="rp-industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Real Estate" />
              </div>
              <div>
                <Label htmlFor="rp-city" className="text-xs">City *</Label>
                <Input id="rp-city" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
              <div>
                <Label htmlFor="rp-budget" className="text-xs">Monthly budget *</Label>
                <Input id="rp-budget" type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="100000" />
              </div>
              <div>
                <Label htmlFor="rp-currency" className="text-xs">Currency</Label>
                <Input id="rp-currency" value={currency} onChange={e => setCurrency(e.target.value)} placeholder="INR / AED / USD" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="rp-aov" className="text-xs">Average order value</Label>
                <Input id="rp-aov" value={aov} onChange={e => setAov(e.target.value)} placeholder="e.g. 50000" />
              </div>
            </div>
          </AiToolRunner>
        </div>
      </section>
    </Layout>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/30 rounded-lg p-3 text-center">
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="font-display font-bold text-foreground">{value}</div>
    </div>
  );
}
