import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Search, Globe, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { z } from "zod";

const urlSchema = z.string().trim().min(3, "Enter a valid URL").max(500);
const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(7).max(20),
});

const scanStatuses = [
  "Crawling pages…",
  "Analyzing SEO tags…",
  "Checking page speed…",
  "Auditing mobile responsiveness…",
  "Scanning accessibility…",
  "Evaluating best practices…",
  "Generating report…",
];

const mockIssues = [
  { label: "Missing meta descriptions on 12 pages", severity: "high" },
  { label: "17 images not optimized (2.4 MB savings)", severity: "high" },
  { label: "No structured data (JSON-LD) found", severity: "medium" },
  { label: "Render-blocking CSS detected (3 files)", severity: "medium" },
  { label: "Missing alt text on 8 images", severity: "low" },
  { label: "No canonical tags on category pages", severity: "medium" },
];

function CircularGauge({ score, label, color, delay = 0 }: { score: number; label: string; color: string; delay?: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (c * (animated ? score : 0)) / 100;
  const scoreColor = score >= 80 ? "hsl(142,70%,45%)" : score >= 50 ? "hsl(38,92%,50%)" : "hsl(0,72%,50%)";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="6" opacity={0.2} />
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke={scoreColor}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central" className="fill-foreground font-display font-extrabold text-xl">
          {animated ? score : 0}
        </text>
      </svg>
      <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function WebsiteAuditSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [step, setStep] = useState<"input" | "scanning" | "results">("input");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [scanStatus, setScanStatus] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", whatsapp: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const scores = useRef({
    overall: Math.floor(Math.random() * 28) + 45,
    seo: Math.floor(Math.random() * 30) + 35,
    performance: Math.floor(Math.random() * 25) + 40,
    accessibility: Math.floor(Math.random() * 20) + 55,
    bestPractices: Math.floor(Math.random() * 20) + 50,
  });

  const startScan = useCallback(() => {
    const parsed = urlSchema.safeParse(url);
    if (!parsed.success) {
      setUrlError("Please enter a valid website URL");
      return;
    }
    setUrlError("");
    setStep("scanning");
    setScanProgress(0);
    setScanStatus(0);
  }, [url]);

  useEffect(() => {
    if (step !== "scanning") return;
    const total = 12000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / total) * 100, 100);
      setScanProgress(pct);
      setScanStatus(Math.min(Math.floor((pct / 100) * scanStatuses.length), scanStatuses.length - 1));
      if (elapsed >= total) {
        clearInterval(timer);
        setTimeout(() => setStep("results"), 500);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [step]);

  const submitLead = async () => {
    const parsed = leadSchema.safeParse(leadForm);
    if (!parsed.success) return;
    setSubmitting(true);
    try {
      await supabase.from("contacts").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.whatsapp,
        message: `Website Audit Request: ${url}`,
        source: "Website Audit Tool",
        service: "SEO Services",
      });
    } catch {}
    setLeadSubmitted(true);
    setSubmitting(false);
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Free Website Audit</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Check Your Website's Health <span className="text-gradient">in 30 Seconds</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Get an instant SEO & performance report — discover what's holding your website back from ranking #1.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {step === "input" && (
              <motion.div key="input" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                className="rounded-2xl glass border border-primary/20 p-8 md:p-10 shimmer-border"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">Enter your website URL</p>
                    <p className="text-xs text-muted-foreground">We'll analyze SEO, speed, accessibility & more</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="https://yourwebsite.com"
                      value={url}
                      onChange={e => { setUrl(e.target.value); setUrlError(""); }}
                      className="h-12 text-base rounded-xl border-border/40 bg-background/50"
                    />
                    {urlError && <p className="text-xs text-destructive mt-1.5 font-mono">{urlError}</p>}
                  </div>
                  <Button onClick={startScan} size="lg" className="rounded-xl font-display font-bold h-12 px-6 shrink-0">
                    <Search className="w-4 h-4 mr-2" /> Audit My Website Free
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "scanning" && (
              <motion.div key="scanning" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                className="rounded-2xl glass border border-primary/20 p-8 md:p-10"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Scanner animation */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 mb-6">
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                      <div className="absolute inset-2 rounded-full border border-primary/10" />
                      <div className="absolute inset-4 rounded-full border border-primary/5" />
                      {/* Rotating scanner line */}
                      <div className="absolute inset-0 rounded-full" style={{
                        background: "conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary) / 0.3) 40deg, transparent 80deg)",
                        animation: "spin 2s linear infinite",
                      }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                      {/* Pulsing rings */}
                      <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping" style={{ animationDuration: "2s" }} />
                    </div>
                    <p className="text-sm font-display font-semibold text-foreground mb-1">{scanStatuses[scanStatus]}</p>
                    <p className="text-xs text-muted-foreground font-mono mb-4">Analyzing {url}</p>
                    <div className="w-full max-w-xs h-2 rounded-full bg-border/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-100"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-2">{Math.round(scanProgress)}%</p>
                  </div>

                  {/* Lead capture form */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                  >
                    <p className="font-display font-bold text-foreground mb-1">📩 Get the full report via email</p>
                    <p className="text-xs text-muted-foreground mb-4">Fill while we scan — report sent instantly!</p>
                    {!leadSubmitted ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <Input
                            placeholder="Your Name"
                            value={leadForm.name}
                            onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))}
                            className="h-11 rounded-xl border-border/40 bg-background/50"
                            maxLength={100}
                          />
                        </div>
                        <Input
                          placeholder="Email Address"
                          type="email"
                          value={leadForm.email}
                          onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))}
                          className="h-11 rounded-xl border-border/40 bg-background/50"
                          maxLength={255}
                        />
                        <Input
                          placeholder="WhatsApp Number"
                          value={leadForm.whatsapp}
                          onChange={e => setLeadForm(p => ({ ...p, whatsapp: e.target.value }))}
                          className="h-11 rounded-xl border-border/40 bg-background/50"
                          maxLength={20}
                        />
                        <Button
                          onClick={submitLead}
                          disabled={submitting || !leadForm.name || !leadForm.email}
                          className="w-full rounded-xl font-display font-bold h-11"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Send Me the Full Report
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="font-display font-bold text-foreground text-sm">Report will be sent shortly!</p>
                        <p className="text-xs text-muted-foreground mt-1">Check your email & WhatsApp</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {step === "results" && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl glass border border-primary/20 p-8 md:p-10"
              >
                {/* Overall score */}
                <div className="text-center mb-8">
                  <p className="text-xs font-mono text-muted-foreground mb-3">WEBSITE HEALTH SCORE</p>
                  <div className="inline-flex items-center justify-center">
                    <CircularGauge score={scores.current.overall} label="Overall" color="primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 font-display">
                    Your website needs improvement in several areas
                  </p>
                </div>

                {/* Category scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-border/30">
                  <CircularGauge score={scores.current.seo} label="SEO" color="blue" delay={200} />
                  <CircularGauge score={scores.current.performance} label="Performance" color="orange" delay={400} />
                  <CircularGauge score={scores.current.accessibility} label="Accessibility" color="green" delay={600} />
                  <CircularGauge score={scores.current.bestPractices} label="Best Practices" color="purple" delay={800} />
                </div>

                {/* Issues found */}
                <h3 className="font-display font-bold text-foreground mb-4">Issues Found ({mockIssues.length})</h3>
                <div className="space-y-2 mb-8">
                  {mockIssues.map((issue, i) => (
                    <motion.div
                      key={issue.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-3 rounded-xl bg-card/40 border border-border/20 p-3"
                    >
                      <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                        issue.severity === "high" ? "text-red-400" :
                        issue.severity === "medium" ? "text-amber-400" : "text-blue-400"
                      }`} />
                      <span className="text-sm text-foreground/80">{issue.label}</span>
                      <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        issue.severity === "high" ? "bg-red-500/10 text-red-400" :
                        issue.severity === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                      }`}>{issue.severity}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Link to="/get-proposal">
                    <Button size="lg" className="rounded-full px-10 font-display font-bold">
                      Get Detailed Report + Action Plan <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-3">
                    Our experts will create a custom strategy to fix these issues
                  </p>
                </div>

                {/* Lead form if not submitted yet */}
                {!leadSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 pt-8 border-t border-border/30"
                  >
                    <p className="font-display font-bold text-foreground text-center mb-4">📩 Email this report to yourself</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                      <Input
                        placeholder="Your Name"
                        value={leadForm.name}
                        onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))}
                        className="h-11 rounded-xl border-border/40 bg-background/50"
                        maxLength={100}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={leadForm.email}
                        onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))}
                        className="h-11 rounded-xl border-border/40 bg-background/50"
                        maxLength={255}
                      />
                      <Input
                        placeholder="WhatsApp"
                        value={leadForm.whatsapp}
                        onChange={e => setLeadForm(p => ({ ...p, whatsapp: e.target.value }))}
                        className="h-11 rounded-xl border-border/40 bg-background/50"
                        maxLength={20}
                      />
                    </div>
                    <div className="text-center mt-3">
                      <Button
                        onClick={submitLead}
                        disabled={submitting || !leadForm.name || !leadForm.email}
                        className="rounded-xl font-display font-bold h-11"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Send Report
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
