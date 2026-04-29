import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Calculator, TrendingUp, ArrowRight, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * RoiCalculatorSection — interactive growth projection.
 *
 * Pure client-side math. Uses transparent industry benchmarks
 * (CTR, CR, multipliers) so the projection is defensible.
 *
 * Channel benchmarks (conservative, India market):
 *   SEO       — 6-month organic uplift typically 1.8x-3.2x current sessions on
 *               focused programs; we model 2.4x and 4.5% lead conversion.
 *   Google Ads — assumes ₹35 CPC blended, 3.2% landing page CR.
 *   Meta Ads  — assumes ₹18 CPC blended, 2.1% lead CR.
 *
 * The CTA pre-fills /get-proposal so the projection becomes a sales hook.
 */

type Channel = "seo" | "google_ads" | "meta_ads";

interface ChannelConfig {
  id: Channel;
  label: string;
  hint: string;
  // Per ₹1 spent or per session — see compute()
  leadsPer1k: number; // estimated leads per ₹1,000 (paid) or per 1,000 incremental sessions (SEO)
}

const CHANNELS: Record<Channel, ChannelConfig> = {
  seo: {
    id: "seo",
    label: "SEO",
    hint: "Organic uplift over 6 months",
    leadsPer1k: 45, // ~4.5% of incremental sessions
  },
  google_ads: {
    id: "google_ads",
    label: "Google Ads",
    hint: "Search intent, ₹35 blended CPC",
    leadsPer1k: 0.91, // ~28 clicks/₹1k × 3.25% CR
  },
  meta_ads: {
    id: "meta_ads",
    label: "Meta Ads",
    hint: "Awareness + remarketing, ₹18 CPC",
    leadsPer1k: 1.17, // ~55 clicks/₹1k × 2.1% CR
  },
};

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

interface Inputs {
  monthlyBudget: number;       // INR / month
  currentSessions: number;     // organic sessions / month
  closeRate: number;           // % of leads that become customers
  avgDealValue: number;        // INR per closed deal
  channel: Channel;
}

function compute(i: Inputs) {
  let extraLeads = 0;
  let extraSessions = 0;

  if (i.channel === "seo") {
    // Conservative 6-month uplift = 2.4x current sessions
    const upliftMultiplier = 2.4;
    extraSessions = Math.max(0, i.currentSessions) * (upliftMultiplier - 1);
    extraLeads = (extraSessions * CHANNELS.seo.leadsPer1k) / 1000;
  } else {
    // Paid: leads scale with budget
    extraLeads = (i.monthlyBudget / 1000) * CHANNELS[i.channel].leadsPer1k;
  }

  const closedDeals = extraLeads * (i.closeRate / 100);
  const newRevenue = closedDeals * i.avgDealValue;
  const investmentMonth = i.monthlyBudget;
  const roi = investmentMonth > 0 ? ((newRevenue - investmentMonth) / investmentMonth) * 100 : 0;
  const breakEvenDeals = i.avgDealValue > 0 ? investmentMonth / i.avgDealValue : 0;

  return {
    extraLeads,
    extraSessions,
    closedDeals,
    newRevenue,
    investmentMonth,
    roi,
    breakEvenDeals,
  };
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (n: number) => string;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="font-mono text-sm text-primary font-semibold">
          {format ? format(value) : value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary"
        style={{
          background: `linear-gradient(to right, hsl(256 90% 65%) 0%, hsl(256 90% 65%) ${
            ((value - min) / (max - min)) * 100
          }%, hsl(0 0% 100% / 0.08) ${((value - min) / (max - min)) * 100}%, hsl(0 0% 100% / 0.08) 100%)`,
        }}
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

export default function RoiCalculatorSection() {
  const [inputs, setInputs] = useState<Inputs>({
    monthlyBudget: 75000,
    currentSessions: 5000,
    closeRate: 18,
    avgDealValue: 50000,
    channel: "seo",
  });

  const result = useMemo(() => compute(inputs), [inputs]);

  const proposalHref = useMemo(() => {
    const p = new URLSearchParams({
      channel: inputs.channel,
      budget: String(inputs.monthlyBudget),
      projected_revenue: String(Math.round(result.newRevenue)),
      projected_leads: String(Math.round(result.extraLeads)),
    });
    return `/get-proposal?${p.toString()}`;
  }, [inputs, result]);

  return (
    <section
      aria-labelledby="roi-calc-title"
      className="relative py-24 border-t border-border/30 overflow-hidden"
    >
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 20%, hsl(256 90% 30% / 0.18), transparent 70%), radial-gradient(50% 50% at 80% 80%, hsl(192 95% 40% / 0.12), transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest inline-flex items-center gap-2">
            <Calculator className="w-3 h-3" /> GROWTH PROJECTION • LIVE
          </span>
          <h2
            id="roi-calc-title"
            className="font-display font-bold text-3xl md:text-5xl text-foreground mt-2 leading-[1.05] tracking-tight"
          >
            See your <span className="text-gradient-hero">ROI</span> before you spend a rupee.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed">
            Built on real benchmarks from 100+ Digital Penta clients across India & MENA.
            Adjust the sliders — get a transparent projection in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* ───────── INPUTS ───────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-6 md:p-8"
          >
            {/* Channel switcher */}
            <div className="mb-6">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2.5 block">
                Primary growth channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CHANNELS) as Channel[]).map((id) => {
                  const c = CHANNELS[id];
                  const active = inputs.channel === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setInputs((s) => ({ ...s, channel: id }))}
                      className={`relative px-3 py-3 rounded-xl border text-sm font-display font-semibold transition-all ${
                        active
                          ? "border-primary/60 bg-primary/15 text-foreground"
                          : "border-border/40 bg-white/[0.02] text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                      style={
                        active
                          ? { boxShadow: "0 0 24px hsl(256 90% 55% / 0.35)" }
                          : undefined
                      }
                    >
                      <div>{c.label}</div>
                      <div className="text-[10px] font-normal text-muted-foreground mt-1 leading-tight">
                        {c.hint}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <Slider
                label="Monthly investment"
                value={inputs.monthlyBudget}
                min={25000}
                max={500000}
                step={5000}
                onChange={(v) => setInputs((s) => ({ ...s, monthlyBudget: v }))}
                format={fmtINR}
                hint="Your total monthly marketing budget for this channel"
              />

              {inputs.channel === "seo" && (
                <Slider
                  label="Current organic sessions / month"
                  value={inputs.currentSessions}
                  min={500}
                  max={100000}
                  step={500}
                  onChange={(v) => setInputs((s) => ({ ...s, currentSessions: v }))}
                  format={fmtNum}
                  hint="From Google Analytics — we project 2.4× uplift in 6 months"
                />
              )}

              <Slider
                label="Lead → customer close rate"
                value={inputs.closeRate}
                min={5}
                max={60}
                step={1}
                onChange={(v) => setInputs((s) => ({ ...s, closeRate: v }))}
                suffix="%"
                hint="What % of qualified leads typically become paying customers"
              />

              <Slider
                label="Average deal value"
                value={inputs.avgDealValue}
                min={5000}
                max={1000000}
                step={5000}
                onChange={(v) => setInputs((s) => ({ ...s, avgDealValue: v }))}
                format={fmtINR}
                hint="Lifetime value or first-order value of one customer"
              />
            </div>

            <div className="mt-6 rounded-xl bg-white/[0.03] border border-border/30 p-3 flex gap-2.5 items-start">
              <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Projections use conservative India market benchmarks. Actual results
                depend on your industry, creatives, and landing-page quality —
                we'll validate them in your free audit call.
              </p>
            </div>
          </motion.div>

          {/* ───────── RESULTS ───────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 relative rounded-3xl border border-primary/30 p-6 md:p-8 overflow-hidden"
            style={{
              background:
                "linear-gradient(165deg, hsl(256 90% 18% / 0.85) 0%, hsl(256 90% 8% / 0.95) 100%)",
              boxShadow: "0 30px 80px -20px hsl(256 90% 30% / 0.5)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background:
                  "radial-gradient(70% 50% at 70% 0%, hsl(256 90% 60% / 0.35), transparent 70%)",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
                  PROJECTED · 6 MONTHS
                </span>
              </div>
              <h3 className="font-display font-bold text-foreground text-xl mb-6">
                Your growth scenario
              </h3>

              <div className="space-y-5">
                <Stat
                  label="New monthly revenue"
                  value={fmtINR(result.newRevenue)}
                  emphasis
                />
                <div className="grid grid-cols-2 gap-4">
                  <Stat
                    label="Extra qualified leads"
                    value={`+${fmtNum(result.extraLeads)}`}
                    sub="per month"
                  />
                  <Stat
                    label="New customers"
                    value={`+${fmtNum(result.closedDeals)}`}
                    sub="per month"
                  />
                </div>
                <Stat
                  label="Return on investment"
                  value={`${result.roi >= 0 ? "+" : ""}${fmtNum(result.roi)}%`}
                  sub={
                    result.roi >= 100
                      ? "Strong fit — let's talk"
                      : result.roi >= 0
                      ? "Profitable — room to scale"
                      : "Needs higher LTV or lower CAC"
                  }
                  tone={result.roi >= 0 ? "positive" : "warning"}
                />
              </div>

              <div className="mt-7 pt-6 border-t border-white/10">
                <Link to={proposalHref} className="block">
                  <Button
                    size="lg"
                    className="w-full btn-glow rounded-full h-[52px] font-display font-bold text-base gap-2 group border-0 text-white hover:text-white"
                  >
                    <Sparkles className="w-4 h-4" />
                    Get my custom growth plan
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-white/50 mt-3 font-mono uppercase tracking-wider">
                  No spam · Senior strategist · 30-min call
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  emphasis,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
  tone?: "positive" | "warning";
}) {
  const color =
    tone === "warning"
      ? "text-amber-300"
      : tone === "positive"
      ? "text-emerald-300"
      : "text-foreground";
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
        {label}
      </div>
      <div
        className={`font-display font-bold tabular-nums ${color} ${
          emphasis ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
        }`}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-white/55 mt-0.5">{sub}</div>}
    </div>
  );
}
