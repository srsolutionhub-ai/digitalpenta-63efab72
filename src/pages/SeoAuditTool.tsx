import { useEffect, useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Eye,
  Globe,
  Gauge,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { AuditScoreRing } from "@/components/audit/AuditScoreRing";
import { AuditIssueCard, type AuditRecommendation } from "@/components/audit/AuditIssueCard";
import { AuditLeadForm, type AuditLeadData } from "@/components/audit/AuditLeadForm";
import { OnPageChecks } from "@/components/audit/OnPageChecks";
import { CoreWebVitals } from "@/components/audit/CoreWebVitals";
import { VerificationBadges, type VerificationData } from "@/components/audit/VerificationBadges";
import { EmailGate } from "@/components/audit/EmailGate";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AuditResult {
  audit_id: string;
  url: string;
  overall: number;
  mobile: any;
  desktop: any;
  opportunities: any[];
  on_page: any;
  verification?: VerificationData | null;
  lead_id?: string | null;
}

type Step = "url" | "lead" | "running" | "result" | "error";

const PROGRESS_STEPS = [
  { label: "Reaching your website…", icon: Globe },
  { label: "Running mobile Lighthouse…", icon: Gauge },
  { label: "Running desktop Lighthouse…", icon: Gauge },
  { label: "Crawling on-page SEO signals…", icon: Search },
  { label: "Analyzing with AI…", icon: Sparkles },
  { label: "Building your report…", icon: TrendingUp },
];

function getUtm() {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source: sp.get("utm_source") ?? undefined,
    utm_medium: sp.get("utm_medium") ?? undefined,
    utm_campaign: sp.get("utm_campaign") ?? undefined,
  };
}

function normalizeUrl(input: string): string | null {
  try {
    const u = new URL(input.trim().startsWith("http") ? input.trim() : `https://${input.trim()}`);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export default function SeoAuditTool() {
  const [step, setStep] = useState<Step>("url");
  const [url, setUrl] = useState("");
  const [pendingLead, setPendingLead] = useState<AuditLeadData | null>(null);
  const [progressIdx, setProgressIdx] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [recs, setRecs] = useState<AuditRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Animated progress ticker while running
  useEffect(() => {
    if (step !== "running") return;
    setProgressIdx(0);
    const tick = setInterval(() => {
      setProgressIdx((i) => Math.min(i + 1, PROGRESS_STEPS.length - 1));
    }, 4500);
    return () => clearInterval(tick);
  }, [step]);

  // ── Step 1: URL submit → go to lead capture ──
  const handleUrlSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      toast.error("Please enter a valid URL like https://yourwebsite.com");
      return;
    }
    setUrl(normalized);
    trackEvent("audit_url_submitted", { category: "seo_tool", label: normalized });
    setStep("lead");
  };

  // ── Step 2: Lead submit → run audit ──
  const handleLeadSubmit = async (lead: AuditLeadData) => {
    setPendingLead(lead);
    setStep("running");
    setRecs([]);
    setPdfUrl(null);
    setResult(null);

    try {
      trackEvent("audit_started", {
        category: "seo_tool",
        label: url,
      });

      const { data, error } = await supabase.functions.invoke("run-seo-audit", {
        body: { url, lead: { ...lead, ...getUtm() } },
      });
      if (error || !data || data.error) {
        throw new Error(data?.error || error?.message || "Audit failed");
      }

      setResult(data as AuditResult);
      setStep("result");
      trackEvent("audit_completed", { category: "seo_tool", label: url, value: data.overall });

      // Kick off AI analysis
      setRecsLoading(true);
      const aiRes = await supabase.functions.invoke("analyze-audit-ai", {
        body: {
          audit_id: data.audit_id,
          url: data.url,
          scores: data.mobile ?? data.desktop,
          opportunities: data.opportunities,
          on_page: data.on_page,
        },
      });
      if (aiRes.data?.recommendations) {
        setRecs(aiRes.data.recommendations);
      } else if (aiRes.error) {
        toast.error("AI recommendations unavailable. Lighthouse results are still shown.");
      }
    } catch (err: any) {
      toast.error(err.message || "Audit failed. Try a different URL.");
      setStep("lead");
    } finally {
      setRecsLoading(false);
    }
  };

  // ── PDF download ──
  const handlePdfDownload = async ({ name, email }: { name: string; email: string }) => {
    if (!result) return;
    setPdfLoading(true);
    try {
      trackEvent("audit_pdf_requested", { category: "seo_tool", label: email });
      const { data, error } = await supabase.functions.invoke("generate-audit-pdf", {
        body: { audit_id: result.audit_id, name, email },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message || "PDF failed");
      setPdfUrl(data.pdf_url);
      toast.success("Report ready!");
      window.open(data.pdf_url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Could not generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  const reset = () => {
    setStep("url");
    setUrl("");
    setPendingLead(null);
    setResult(null);
    setRecs([]);
    setPdfUrl(null);
  };

  const primary = result?.mobile ?? result?.desktop ?? {};

  return (
    <Layout>
      <SEOHead
        title="Free Advanced SEO Audit — Lighthouse + AI | Digital Penta"
        description="Run a deep SEO, Core Web Vitals, on-page and security audit on any URL in 60 seconds. Backed by Google Lighthouse + AI fix recommendations. Free PDF report."
        canonical="https://digitalpenta.com/tools/seo-audit"
        ogType="website"
      />

      {/* Ambient neon background */}
      <section className="relative overflow-hidden bg-background px-4 pb-20 pt-28 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-32 right-10 h-[320px] w-[320px] rounded-full bg-accent/20 blur-[100px]" />
          <div className="absolute bottom-0 left-10 h-[280px] w-[280px] rounded-full bg-primary/15 blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-6xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live · Powered by Google Lighthouse + AI
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Advanced <span className="text-gradient">SEO Audit</span> Tool
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Real Google Lighthouse scores, Core Web Vitals, deep on-page SEO checks, security headers,
              and AI-prioritized fixes. All in 60 seconds. Free.
            </p>
          </motion.div>

          {/* Step indicator */}
          {step !== "url" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2"
            >
              {(["url", "lead", "running", "result"] as Step[]).map((s, i) => {
                const active = s === step;
                const done = ["url", "lead", "running", "result"].indexOf(step) > i;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : done
                          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    {i < 3 && <div className={`h-px w-8 ${done ? "bg-emerald-500/40" : "bg-border"}`} />}
                  </div>
                );
              })}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ─── STEP 1: URL ─── */}
            {step === "url" && (
              <motion.form
                key="url"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleUrlSubmit}
                className="mx-auto mt-10 max-w-2xl"
              >
                <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/80 p-3 shadow-2xl shadow-primary/10 backdrop-blur-xl">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://your-website.com"
                        className="h-13 border-0 bg-transparent pl-10 text-base focus-visible:ring-0"
                        autoFocus
                        aria-label="Website URL"
                      />
                    </div>
                    <Button type="submit" size="lg" className="h-13 px-6 text-base" data-audit-cta>
                      Audit my website <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Trust signals */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { Icon: Zap, label: "Performance" },
                    { Icon: Eye, label: "On-page SEO" },
                    { Icon: ShieldCheck, label: "Security" },
                    { Icon: Sparkles, label: "AI fixes" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border/30 bg-card/50 px-3 py-2.5 text-xs text-muted-foreground backdrop-blur"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Stats strip */}
                <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-border/30 bg-card/50 p-4 backdrop-blur">
                  {[
                    { v: "60s", l: "Average scan time" },
                    { v: "40+", l: "Checks per audit" },
                    { v: "Free", l: "No card required" },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <div className="font-display text-xl font-bold text-foreground sm:text-2xl">
                        <span className="text-gradient">{s.v}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
              </motion.form>
            )}

            {/* ─── STEP 2: LEAD CAPTURE ─── */}
            {step === "lead" && (
              <motion.div
                key="lead"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto mt-10 max-w-2xl"
              >
                <AuditLeadForm url={url} onSubmit={handleLeadSubmit} onBack={reset} />
              </motion.div>
            )}

            {/* ─── STEP 3: RUNNING ─── */}
            {step === "running" && (
              <motion.div
                key="running"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto mt-12 max-w-xl"
              >
                <div className="overflow-hidden rounded-3xl border border-border/40 bg-card/80 p-8 backdrop-blur-xl">
                  <div className="text-center">
                    <div className="relative mx-auto inline-flex h-16 w-16 items-center justify-center">
                      <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                    <p className="mt-4 font-display text-lg font-semibold text-foreground">
                      Deep audit in progress
                    </p>
                    <p className="text-xs text-muted-foreground">Usually takes 30-60 seconds</p>
                  </div>

                  <div className="mt-6 space-y-2">
                    {PROGRESS_STEPS.map((s, i) => {
                      const active = i === progressIdx;
                      const done = i < progressIdx;
                      const Icon = s.icon;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-all ${
                            active
                              ? "border-primary/40 bg-primary/10"
                              : done
                              ? "border-emerald-500/30 bg-emerald-500/5 opacity-70"
                              : "border-border/20 opacity-40"
                          }`}
                        >
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              done
                                ? "bg-emerald-500/20 text-emerald-400"
                                : active
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : active ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Icon className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              active ? "text-foreground" : done ? "text-emerald-300" : "text-muted-foreground"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                      initial={{ width: "5%" }}
                      animate={{ width: `${((progressIdx + 1) / PROGRESS_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 4: RESULTS ─── */}
            {step === "result" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10 space-y-8"
              >
                {/* Hero scores */}
                <div className="overflow-hidden rounded-3xl border border-border/40 bg-card/80 p-6 backdrop-blur-xl sm:p-8">
                  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Audit complete · Overall score{" "}
                        <span className="font-bold text-foreground">{result.overall}/100</span>
                      </p>
                      <h2 className="truncate font-display text-xl font-semibold text-foreground">
                        {result.url}
                      </h2>
                      {pendingLead && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Saved to your inbox · {pendingLead.email}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={reset}>
                      Audit another site
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <AuditScoreRing score={primary.performance ?? 0} label="Performance" />
                    <AuditScoreRing score={primary.seo ?? 0} label="SEO" />
                    <AuditScoreRing score={primary.accessibility ?? 0} label="Accessibility" />
                    <AuditScoreRing score={primary.best_practices ?? 0} label="Best Practices" />
                  </div>
                </div>

                {/* Core Web Vitals */}
                <div>
                  <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                    Core Web Vitals
                  </h3>
                  <CoreWebVitals mobile={result.mobile} desktop={result.desktop} />
                </div>

                {/* On-page checks */}
                {result.on_page && (
                  <div>
                    <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                      On-page SEO & technical checks
                    </h3>
                    <OnPageChecks data={result.on_page} />
                  </div>
                )}

                {/* AI Recommendations */}
                <div>
                  <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                    AI Recommendations {recs.length > 0 && `(${recs.length})`}
                  </h3>
                  {recs.length === 0 ? (
                    <div className="rounded-2xl border border-border/40 bg-card p-8 text-center">
                      {recsLoading ? (
                        <>
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                          <p className="mt-3 text-sm text-muted-foreground">
                            AI is prioritizing fixes for you… 10-20 seconds.
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          AI recommendations are temporarily unavailable. Lighthouse and on-page results above are accurate.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recs.map((r, i) => (
                        <AuditIssueCard key={i} rec={r} />
                      ))}
                    </div>
                  )}
                </div>

                {/* PDF download */}
                {recs.length > 0 && !pdfUrl && pendingLead && (
                  <EmailGate
                    onSubmit={async () =>
                      handlePdfDownload({ name: pendingLead.name, email: pendingLead.email })
                    }
                    loading={pdfLoading}
                  />
                )}

                {pdfUrl && (
                  <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                    <p className="font-display text-lg font-semibold text-foreground">
                      Your PDF is ready
                    </p>
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
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
