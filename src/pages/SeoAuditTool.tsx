import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Search, Loader2, Sparkles, ArrowRight, ShieldCheck, Zap, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { AuditScoreRing } from "@/components/audit/AuditScoreRing";
import { AuditIssueCard, type AuditRecommendation } from "@/components/audit/AuditIssueCard";
import { EmailGate } from "@/components/audit/EmailGate";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

interface AuditResult {
  audit_id: string;
  url: string;
  overall: number;
  mobile: any;
  desktop: any;
  opportunities: any[];
}

const PROGRESS_STEPS = [
  "Fetching website…",
  "Running mobile Lighthouse…",
  "Running desktop Lighthouse…",
  "Analyzing with AI…",
  "Building report…",
];

export default function SeoAuditTool() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<"input" | "running" | "result">("input");
  const [progressIdx, setProgressIdx] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [recs, setRecs] = useState<AuditRecommendation[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const runAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    setStep("running");
    setProgressIdx(0);
    setRecs([]);
    setPdfUrl(null);

    const tick = setInterval(() => {
      setProgressIdx((i) => Math.min(i + 1, PROGRESS_STEPS.length - 1));
    }, 4000);

    try {
      trackEvent("audit_started", { category: "seo_tool", label: url });
      const { data, error } = await supabase.functions.invoke("run-seo-audit", { body: { url } });
      if (error || !data || data.error) throw new Error(data?.error || error?.message || "Audit failed");

      setResult(data as AuditResult);
      setStep("result");

      // Kick off AI analysis in background
      const aiRes = await supabase.functions.invoke("analyze-audit-ai", {
        body: {
          audit_id: data.audit_id,
          url: data.url,
          scores: data.mobile ?? data.desktop,
          opportunities: data.opportunities,
        },
      });
      if (aiRes.data?.recommendations) {
        setRecs(aiRes.data.recommendations);
        trackEvent("audit_completed", { category: "seo_tool", label: url, value: data.overall });
      }
    } catch (err: any) {
      toast.error(err.message || "Audit failed. Try a different URL.");
      setStep("input");
    } finally {
      clearInterval(tick);
    }
  };

  const handleEmailSubmit = async ({ name, email }: { name: string; email: string }) => {
    if (!result) return;
    setPdfLoading(true);
    try {
      trackEvent("audit_pdf_requested", { category: "seo_tool", label: email });
      const { data, error } = await supabase.functions.invoke("generate-audit-pdf", {
        body: { audit_id: result.audit_id, name, email },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message || "PDF failed");
      setPdfUrl(data.pdf_url);
      toast.success("Report ready! Download starting.");
      // Auto-download
      window.open(data.pdf_url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Could not generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  const reset = () => {
    setStep("input");
    setResult(null);
    setRecs([]);
    setUrl("");
  };

  return (
    <Layout>
      <Helmet>
        <title>Free SEO Audit Tool — Lighthouse + AI Recommendations | Digital Penta</title>
        <meta
          name="description"
          content="Run a free, instant SEO and performance audit on any URL. Powered by Google Lighthouse + AI. Get a branded PDF with prioritized fix recommendations."
        />
        <link rel="canonical" href="https://digitalpenta.com/tools/seo-audit" />
        <meta property="og:title" content="Free SEO Audit Tool | Digital Penta" />
        <meta
          property="og:description"
          content="Instant Lighthouse + AI-powered SEO audit. Free PDF report with actionable fixes."
        />
        <meta property="og:url" content="https://digitalpenta.com/tools/seo-audit" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card/50 px-4 pb-16 pt-28 sm:pt-32">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered · Lighthouse-backed · 100% free
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Free <span className="text-gradient">SEO Audit</span> Tool
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Instant Google Lighthouse scan + AI-prioritized fix recommendations. Get a branded PDF in
              under a minute.
            </p>
          </motion.div>

          {step === "input" && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={runAudit}
              className="mx-auto mt-10 max-w-2xl"
            >
              <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-card p-3 shadow-2xl shadow-primary/10 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-website.com"
                    className="h-12 border-0 bg-transparent pl-9 text-base focus-visible:ring-0"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-6" data-audit-cta>
                  Run free audit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { Icon: Zap, label: "Performance" },
                  { Icon: Eye, label: "SEO + Accessibility" },
                  { Icon: ShieldCheck, label: "Best Practices" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </div>
                ))}
              </div>
            </motion.form>
          )}

          {step === "running" && (
            <div className="mx-auto mt-12 max-w-md rounded-2xl border border-border/40 bg-card p-8 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 font-display text-lg font-semibold text-foreground">
                {PROGRESS_STEPS[progressIdx]}
              </p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${((progressIdx + 1) / PROGRESS_STEPS.length) * 100}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Usually takes 20-40 seconds.</p>
            </div>
          )}

          {step === "result" && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-8"
            >
              <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Audit complete</p>
                    <h2 className="font-display text-xl font-semibold text-foreground">{result.url}</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={reset}>
                    Audit another site
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <AuditScoreRing
                    score={result.mobile?.performance ?? result.desktop?.performance ?? 0}
                    label="Performance"
                  />
                  <AuditScoreRing
                    score={result.mobile?.seo ?? result.desktop?.seo ?? 0}
                    label="SEO"
                  />
                  <AuditScoreRing
                    score={result.mobile?.accessibility ?? result.desktop?.accessibility ?? 0}
                    label="Accessibility"
                  />
                  <AuditScoreRing
                    score={result.mobile?.best_practices ?? result.desktop?.best_practices ?? 0}
                    label="Best Practices"
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                  AI Recommendations {recs.length > 0 && `(${recs.length})`}
                </h3>
                {recs.length === 0 ? (
                  <div className="rounded-xl border border-border/40 bg-card p-8 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      AI is analyzing your audit… this takes 10-20 seconds.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recs.map((r, i) => (
                      <AuditIssueCard key={i} rec={r} />
                    ))}
                  </div>
                )}
              </div>

              {recs.length > 0 && !pdfUrl && (
                <EmailGate onSubmit={handleEmailSubmit} loading={pdfLoading} />
              )}

              {pdfUrl && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                  <p className="font-display text-lg font-semibold text-foreground">Your PDF is ready</p>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-primary underline"
                  >
                    Download report <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
