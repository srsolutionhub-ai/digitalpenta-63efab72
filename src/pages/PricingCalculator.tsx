import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEOHead, { breadcrumbSchema, faqPageSchema } from "@/components/seo/SEOHead";

/**
 * Lightweight client-side pricing calculator. No backend call — purely
 * deterministic so we never mis-quote. Acts as a top-of-funnel lead magnet.
 */

type ServiceKey = "seo" | "ppc" | "social" | "web" | "ai";

const SERVICES: { key: ServiceKey; label: string; baseINR: number; baseAED: number }[] = [
  { key: "seo", label: "SEO", baseINR: 45000, baseAED: 4500 },
  { key: "ppc", label: "Google Ads / PPC", baseINR: 35000, baseAED: 3500 },
  { key: "social", label: "Social Media", baseINR: 30000, baseAED: 3000 },
  { key: "web", label: "Web Development (one-time)", baseINR: 120000, baseAED: 12000 },
  { key: "ai", label: "AI Solutions / Automation", baseINR: 75000, baseAED: 7500 },
];

const CITY_MULT: Record<string, number> = {
  delhi: 1, mumbai: 1.15, bangalore: 1.1, dubai: 1.4, riyadh: 1.5, other: 1,
};

const SCOPE_MULT = { starter: 1, growth: 1.6, scale: 2.4 };

const FAQS = [
  { q: "Are these prices final?", a: "No — they're indicative monthly retainers. Actual scoping happens during the strategy call where we tailor team size, deliverables and KPIs." },
  { q: "Do you offer one-time projects?", a: "Yes for web/app development and audits. Marketing services work best as quarterly+ retainers because results compound over time." },
  { q: "What's included in each tier?", a: "Starter = 1 senior strategist + 1 specialist. Growth = strategist + 2 specialists + creative. Scale = full pod with strategist, specialists, creative, analytics, and weekly client reviews." },
];

export default function PricingCalculator() {
  const [city, setCity] = useState("delhi");
  const [scope, setScope] = useState<"starter" | "growth" | "scale">("growth");
  const [selected, setSelected] = useState<Set<ServiceKey>>(new Set(["seo", "ppc"]));
  const [region, setRegion] = useState<"india" | "gcc">("india");

  const toggle = (k: ServiceKey) => setSelected(s => {
    const next = new Set(s);
    next.has(k) ? next.delete(k) : next.add(k);
    return next;
  });

  const { monthly, oneTime, currency } = useMemo(() => {
    const cur = region === "india" ? "₹" : "AED ";
    const mult = (CITY_MULT[city] ?? 1) * SCOPE_MULT[scope];
    let m = 0, o = 0;
    for (const s of SERVICES) {
      if (!selected.has(s.key)) continue;
      const base = region === "india" ? s.baseINR : s.baseAED;
      if (s.key === "web") o += Math.round(base * mult);
      else m += Math.round(base * mult);
    }
    return { monthly: m, oneTime: o, currency: cur };
  }, [city, scope, selected, region]);

  return (
    <Layout>
      <SEOHead
        title="Pricing Calculator | Digital Penta — Instant Quote in 30 Seconds"
        description="Get an instant indicative quote for SEO, PPC, social media, web development and AI from Digital Penta. India and GCC pricing supported."
        canonical="https://digitalpenta.com/pricing-calculator"
        schemas={[
          breadcrumbSchema([
            { name: "Home", url: "https://digitalpenta.com/" },
            { name: "Pricing Calculator", url: "https://digitalpenta.com/pricing-calculator" },
          ]),
          faqPageSchema(FAQS),
        ]}
      />
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="type-label text-primary mb-3 font-mono">Pricing Calculator</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">Get an instant quote.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Pick services, city and scope tier — see indicative monthly + one-time pricing in seconds.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-6">
          <div className="card-premium p-6 space-y-5">
            <div>
              <Label className="text-xs">Region</Label>
              <div className="flex gap-2 mt-2">
                {(["india", "gcc"] as const).map(r => (
                  <button key={r} type="button" onClick={() => setRegion(r)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-full border ${region === r ? "bg-primary text-primary-foreground border-primary" : "border-border/40 text-foreground/70"}`}>
                    {r === "india" ? "India (₹)" : "GCC (AED)"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="pc-city" className="text-xs">City</Label>
              <select id="pc-city" value={city} onChange={e => setCity(e.target.value)}
                className="w-full mt-1 bg-background border border-border/40 rounded-md px-3 py-2 text-sm">
                {region === "india"
                  ? <>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="other">Other Indian city</option>
                    </>
                  : <>
                      <option value="dubai">Dubai</option>
                      <option value="riyadh">Riyadh</option>
                      <option value="other">Other GCC city</option>
                    </>
                }
              </select>
            </div>
            <div>
              <Label className="text-xs">Scope tier</Label>
              <div className="flex gap-2 mt-2">
                {(["starter", "growth", "scale"] as const).map(s => (
                  <button key={s} type="button" onClick={() => setScope(s)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-full border capitalize ${scope === s ? "bg-primary text-primary-foreground border-primary" : "border-border/40 text-foreground/70"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs">Services (pick at least 1)</Label>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {SERVICES.map(s => {
                  const on = selected.has(s.key);
                  return (
                    <button key={s.key} type="button" onClick={() => toggle(s.key)}
                      className={`text-left px-3 py-2 text-xs rounded-md border ${on ? "bg-primary/10 border-primary text-foreground" : "border-border/40 text-foreground/70"}`}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card-premium p-6 flex flex-col">
            <p className="type-label text-primary mb-3 font-mono">Indicative pricing</p>
            <div className="flex-1 flex flex-col justify-center text-center">
              <div className="text-muted-foreground text-xs mb-1">Monthly retainer</div>
              <div className="font-display font-extrabold text-5xl text-foreground mb-3">{currency}{monthly.toLocaleString()}</div>
              {oneTime > 0 && (
                <>
                  <div className="text-muted-foreground text-xs mb-1">+ one-time build</div>
                  <div className="font-display font-bold text-2xl text-foreground/80 mb-3">{currency}{oneTime.toLocaleString()}</div>
                </>
              )}
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Indicative only — actual pricing depends on competition, scope detail and reporting depth. Final quote after a 30-min strategy call.
              </p>
            </div>
            <Link to="/get-proposal">
              <Button className="w-full rounded-full mt-4 font-display font-semibold">Lock this quote — request proposal</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
