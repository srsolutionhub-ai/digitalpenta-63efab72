/**
 * Live Growth Score — inline 5-axis radar widget on the homepage.
 * Calls the existing `run-seo-audit` edge function and renders a Recharts radar
 * without opening a modal. Lead capture inline (name + email + URL minimum)
 * because the edge function enforces server-side lead validation.
 *
 * Recharts is already in the bundle (used by other sections) but we still
 * lazy-mount the chart behind viewport intersection to keep above-the-fold
 * JS minimal.
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const RadarChartLazy = lazy(() => import("./LiveGrowthScoreRadar"));

type AuditResult = {
  audit_id: string;
  overall: number;
  mobile: { performance: number; seo: number; accessibility: number; best_practices: number };
  desktop: { performance: number; seo: number; accessibility: number; best_practices: number };
  url: string;
};

export default function LiveGrowthScoreSection() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Defer heavy work until in viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const cleanUrl = url.trim();
      if (!cleanUrl) {
        setError("Please enter your website URL.");
        return;
      }
      if (!name.trim() || !email.trim()) {
        setError("Please share your name + email so we can send the full report.");
        return;
      }
      setSubmitting(true);
      try {
        const { data, error: fnErr } = await supabase.functions.invoke("run-seo-audit", {
          body: {
            url: cleanUrl,
            lead: {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              source: "Homepage Live Growth Score",
            },
          },
        });
        if (fnErr) throw fnErr;
        if (data?.error) {
          setError(typeof data.error === "string" ? data.error : "Audit failed — please retry.");
          return;
        }
        setResult(data as AuditResult);
      } catch (err: any) {
        console.error("growth-score error:", err);
        setError(err?.message ?? "Couldn't reach the audit service. Please retry.");
      } finally {
        setSubmitting(false);
      }
    },
    [url, name, email],
  );

  return (
    <section
      ref={sectionRef}
      id="live-growth-score"
      className="relative section-ambient py-20 md:py-28"
      aria-labelledby="growth-score-heading"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="neon-chip">
            <Activity className="w-3 h-3" aria-hidden />
            Live Growth Score
          </span>
          <h2 id="growth-score-heading" className="type-h2 text-foreground mt-5 mb-4">
            Score your site in <span className="text-gradient">60 seconds</span>
          </h2>
          <p className="type-body max-w-xl mx-auto">
            Get a 4-axis radar — Performance, SEO, Accessibility, Best Practices — powered by Google PageSpeed.
            We'll email you the full PDF.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start max-w-5xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2 glass-card-pro p-6 md:p-7">
            <form onSubmit={onSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="lgs-url" className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  Website URL
                </label>
                <Input
                  id="lgs-url"
                  type="url"
                  placeholder="https://your-site.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="lgs-name" className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>
                  <Input
                    id="lgs-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label htmlFor="lgs-email" className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    Work email
                  </label>
                  <Input
                    id="lgs-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-2.5 py-1.5">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full btn-glow font-display font-bold h-11">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scoring your site…
                  </>
                ) : (
                  <>
                    Run Growth Score
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground/70 font-mono pt-1">
                Free, no card. We use it to send the report + a 14-day quick-wins roadmap.
              </p>
            </form>
          </div>

          {/* Result / preview */}
          <div className="lg:col-span-3 glass-card-pro p-6 md:p-7 min-h-[340px] flex flex-col justify-center">
            {!result && !submitting && (
              <div className="text-center text-muted-foreground space-y-2 py-8">
                <Activity className="w-8 h-8 mx-auto text-primary/60" aria-hidden />
                <p className="text-sm">Your radar chart will appear here.</p>
                <p className="text-[11px] font-mono opacity-70">Performance · SEO · Accessibility · Best Practices</p>
              </div>
            )}

            {submitting && !result && (
              <div className="text-center space-y-3 py-8">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" aria-hidden />
                <p className="text-sm text-muted-foreground">Running Lighthouse on mobile + desktop…</p>
                <p className="text-[11px] font-mono text-muted-foreground/70">This takes 20–60 seconds.</p>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Overall score</p>
                    <p className="font-display font-bold text-4xl neon-num leading-none">{result.overall}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3 h-3" aria-hidden /> Report emailed
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={result.url}>
                      {new URL(result.url).hostname}
                    </p>
                  </div>
                </div>

                {inView && (
                  <Suspense
                    fallback={
                      <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
                        Rendering radar…
                      </div>
                    }
                  >
                    <RadarChartLazy mobile={result.mobile} desktop={result.desktop} />
                  </Suspense>
                )}

                <div className="flex gap-2 pt-2">
                  <Link to={`/tools/seo-audit?audit=${result.audit_id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full font-display font-semibold text-xs">
                      View full audit
                    </Button>
                  </Link>
                  <Link to="/book-a-call" className="flex-1">
                    <Button size="sm" className="w-full font-display font-bold text-xs btn-glow">
                      Discuss fixes
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
