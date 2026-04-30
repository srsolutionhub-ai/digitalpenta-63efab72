import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, RotateCcw, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = ["About You", "Services", "Goals", "Budget", "Review"];

const DRAFT_KEY = "dp_proposal_draft_v1";
const DRAFT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const RECOVERY_SENT_KEY = "dp_proposal_recovery_sent_v1";
const RECOVERY_DELAY_MS = 90 * 1000; // 90s after email blur
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DraftPayload = {
  data: ProposalData;
  step: number;
  savedAt: number;
};

type ProposalData = {
  name: string; email: string; phone: string; company: string; website: string;
  services: string[]; goals: string[];
  budget: string; timeline: string; message: string;
};

// Map ROI channel → recommended service preselect
const channelServiceMap: Record<string, string> = {
  seo: "SEO & Organic Growth",
  google: "PPC & Paid Ads",
  meta: "Social Media Marketing",
};

// Map projected revenue → suggested budget bucket (monthly)
function pickBudget(monthlyBudget: number): string {
  if (!monthlyBudget) return "₹5L - ₹15L / $5K - $15K";
  if (monthlyBudget < 500000) return "Under ₹5L / $5K";
  if (monthlyBudget < 1500000) return "₹5L - ₹15L / $5K - $15K";
  if (monthlyBudget < 5000000) return "₹15L - ₹50L / $15K - $50K";
  return "₹50L+ / $50K+";
}

function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const serviceOptions = [
  "SEO & Organic Growth", "PPC & Paid Ads", "Social Media Marketing", "Content Marketing",
  "PR & Media Relations", "Website Development", "Mobile App Development", "E-commerce",
  "AI Chatbot", "Marketing Automation", "CRM Automation", "UI/UX Design",
];

const goalOptions = [
  "Increase Leads", "Boost Revenue", "Brand Awareness", "Market Expansion",
  "Improve Retention", "Digital Transformation", "Launch New Product", "Reduce CAC",
];

export default function GetProposal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProposalData>({
    name: "", email: "", phone: "", company: "", website: "",
    services: [] as string[], goals: [] as string[],
    budget: "₹5L - ₹15L / $5K - $15K", timeline: "1-3 months", message: "",
  });

  const [roiContext, setRoiContext] = useState<null | {
    channel: string; budget: number; projectedRevenue: number; projectedLeads: number;
  }>(null);

  const [draftPrompt, setDraftPrompt] = useState<DraftPayload | null>(null);
  const initializedRef = useRef(false);

  // On mount: read ROI calc params, then check for saved draft
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const channel = searchParams.get("channel") || "";
    const budgetParam = Number(searchParams.get("budget") || 0);
    const projRev = Number(searchParams.get("projected_revenue") || 0);
    const projLeads = Number(searchParams.get("projected_leads") || 0);

    if (channel || budgetParam || projRev) {
      const recommended = channelServiceMap[channel];
      const services = recommended ? [recommended] : [];
      const goals = projRev ? ["Increase Leads", "Boost Revenue"] : [];
      const message = projRev
        ? `From ROI Calculator → channel: ${channel}, monthly budget: ₹${budgetParam.toLocaleString("en-IN")}, projected revenue/mo: ₹${Math.round(projRev).toLocaleString("en-IN")}, extra leads/mo: ${Math.round(projLeads)}.`
        : "";
      setData({
        name: "", email: "", phone: "", company: "", website: "",
        services, goals,
        budget: pickBudget(budgetParam),
        timeline: "1-3 months",
        message,
      });
      setRoiContext({ channel, budget: budgetParam, projectedRevenue: projRev, projectedLeads: projLeads });
      setSearchParams({}, { replace: true });
    }

    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DraftPayload;
        const fresh = Date.now() - parsed.savedAt < DRAFT_TTL_MS;
        const hasContent =
          parsed.data &&
          (parsed.data.name || parsed.data.email || parsed.data.services?.length || parsed.data.goals?.length);
        if (fresh && hasContent) setDraftPrompt(parsed);
        else if (!fresh) localStorage.removeItem(DRAFT_KEY);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleItem = (key: "services" | "goals", item: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(i => i !== item) : [...prev[key], item],
    }));
  };

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-save draft
  useEffect(() => {
    if (submitted) return;
    const hasAny =
      data.name || data.email || data.phone || data.company || data.website ||
      data.services.length || data.goals.length || data.message;
    if (!hasAny) return;
    const t = setTimeout(() => {
      try {
        const payload: DraftPayload = { data, step, savedAt: Date.now() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch { /* quota */ }
    }, 400);
    return () => clearTimeout(t);
  }, [data, step, submitted]);

  // Abandoned-form recovery: schedule "your draft is waiting" email after blur
  const recoveryTimerRef = useRef<number | null>(null);

  const cancelRecoveryTimer = () => {
    if (recoveryTimerRef.current !== null) {
      clearTimeout(recoveryTimerRef.current);
      recoveryTimerRef.current = null;
    }
  };

  const scheduleRecoveryEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) return;

    // Don't double-send to same address
    try {
      const sentRaw = localStorage.getItem(RECOVERY_SENT_KEY);
      const sent: string[] = sentRaw ? JSON.parse(sentRaw) : [];
      if (sent.includes(clean)) return;
    } catch { /* noop */ }

    cancelRecoveryTimer();
    recoveryTimerRef.current = window.setTimeout(async () => {
      // Skip if user submitted in the meantime
      if (submitted) return;
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "abandoned_draft",
            data: {
              email: clean,
              name: data.name?.trim() || undefined,
              resumeUrl: `${window.location.origin}/get-proposal`,
              source: roiContext ? "ROI Calculator → Proposal" : "Proposal Form",
            },
          },
        });
        const sentRaw = localStorage.getItem(RECOVERY_SENT_KEY);
        const sent: string[] = sentRaw ? JSON.parse(sentRaw) : [];
        sent.push(clean);
        localStorage.setItem(RECOVERY_SENT_KEY, JSON.stringify(sent.slice(-20)));
      } catch { /* silently ignore */ }
    }, RECOVERY_DELAY_MS);
  };

  // Cleanup timer on unmount
  useEffect(() => () => cancelRecoveryTimer(), []);

  const restoreDraft = () => {
    if (!draftPrompt) return;
    setData(draftPrompt.data);
    setStep(Math.min(draftPrompt.step, steps.length - 1));
    setDraftPrompt(null);
    toast.success("Draft restored — pick up where you left off.");
  };

  const dismissDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftPrompt(null);
  };

  const handleSubmit = async () => {
    cancelRecoveryTimer();
    setLoading(true);
    try {
      const roiNote = roiContext
        ? ` [ROI: channel=${roiContext.channel}, budget=₹${roiContext.budget.toLocaleString("en-IN")}/mo, projRev=₹${Math.round(roiContext.projectedRevenue).toLocaleString("en-IN")}/mo, projLeads=${Math.round(roiContext.projectedLeads)}/mo]`
        : "";
      const { data: contact, error: contactErr } = await supabase.from("contacts").insert({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        company: data.company.trim() || null,
        service: data.services.join(", ") || "Multiple Services",
        budget_range: data.budget,
        message: `Goals: ${data.goals.join(", ")}. Timeline: ${data.timeline}. ${data.message}${roiNote}`.trim(),
        source: roiContext ? "ROI Calculator → Proposal" : "Website Proposal Form",
      }).select("id").single();

      if (contactErr) throw contactErr;

      await supabase.from("leads").insert({
        contact_id: contact?.id || null,
        service: data.services.join(", ") || "Multiple Services",
        budget: data.budget,
        timeline: data.timeline,
      });

      try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }

      setSubmitted(true);
      toast.success("Proposal request submitted!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const confettiColors = ["hsl(256,90%,60%)", "hsl(162,100%,42%)", "hsl(20,90%,50%)", "hsl(160,84%,39%)", "hsl(30,100%,50%)"];

    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: confettiColors[i % confettiColors.length],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
                Proposal Request <span className="text-gradient">Received!</span>
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our strategy team will review your requirements and send a customized proposal within 48 hours.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 mesh-gradient" />
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <input type="text" name="fax_number" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Free Proposal</span>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-3">
                Get Your Custom <span className="text-gradient">Growth Plan</span>
              </h1>
              <p className="text-sm text-muted-foreground">Takes less than 3 minutes. No obligation.</p>
            </div>

            {/* ROI context badge */}
            {roiContext && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">
                      ROI projection saved — we'll build your plan around it.
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Channel: <span className="font-medium text-foreground capitalize">{roiContext.channel || "—"}</span>
                      {" · "}Budget: <span className="font-medium text-foreground">₹{roiContext.budget.toLocaleString("en-IN")}/mo</span>
                      {" · "}Projected: <span className="font-medium text-emerald-300">₹{Math.round(roiContext.projectedRevenue).toLocaleString("en-IN")}/mo</span>
                      {" · "}Leads: <span className="font-medium text-foreground">+{Math.round(roiContext.projectedLeads)}/mo</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Restore-draft prompt */}
            {draftPrompt && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <RotateCcw className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-foreground">We saved your draft.</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Pick up where you left off — last saved {timeAgo(draftPrompt.savedAt)}.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" onClick={restoreDraft} className="h-8 rounded-full px-4 text-xs">
                        Restore my draft
                      </Button>
                      <Button size="sm" variant="ghost" onClick={dismissDraft} className="h-8 rounded-full px-3 text-xs">
                        Start fresh
                      </Button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={dismissDraft}
                    aria-label="Dismiss"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        backgroundColor: i <= step ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                        scale: i === step ? 1.15 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                    >
                      <span className={i <= step ? "text-primary-foreground" : "text-muted-foreground"}>
                        {i < step ? "✓" : i + 1}
                      </span>
                    </motion.div>
                    <span className="hidden sm:inline text-xs text-muted-foreground">{s}</span>
                    {i < steps.length - 1 && <div className="hidden sm:block w-8 h-px bg-border mx-1" />}
                  </div>
                ))}
              </div>
              <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              </div>
            </div>

            <div className="rounded-xl glass p-8 noise-texture">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 0 && (
                    <div className="space-y-4">
                      <h2 className="font-display font-semibold text-lg text-foreground mb-4">Tell us about yourself</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Full Name *</label>
                          <Input value={data.name} onChange={e => setData({...data, name: e.target.value})} onFocus={e => e.target.scrollIntoView({ behavior: "smooth", block: "center" })} placeholder="John Doe" className="bg-secondary/50 border-border/50 min-h-[52px]" />
                        </div>
                        <div>
                          <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Email *</label>
                          <Input type="email" inputMode="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} onFocus={e => e.target.scrollIntoView({ behavior: "smooth", block: "center" })} onBlur={e => scheduleRecoveryEmail(e.target.value)} placeholder="john@company.com" className="bg-secondary/50 border-border/50 min-h-[52px]" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Phone</label>
                          <Input inputMode="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} onFocus={e => e.target.scrollIntoView({ behavior: "smooth", block: "center" })} placeholder="+91 98765 43210" className="bg-secondary/50 border-border/50 min-h-[52px]" />
                        </div>
                        <div>
                          <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Company</label>
                          <Input value={data.company} onChange={e => setData({...data, company: e.target.value})} onFocus={e => e.target.scrollIntoView({ behavior: "smooth", block: "center" })} placeholder="Company Name" className="bg-secondary/50 border-border/50 min-h-[52px]" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Website</label>
                        <Input inputMode="url" value={data.website} onChange={e => setData({...data, website: e.target.value})} onFocus={e => e.target.scrollIntoView({ behavior: "smooth", block: "center" })} placeholder="https://yoursite.com" className="bg-secondary/50 border-border/50 min-h-[52px]" />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 className="font-display font-semibold text-lg text-foreground mb-4">What services do you need?</h2>
                      <p className="text-xs text-muted-foreground mb-4">Select all that apply</p>
                      <div className="grid grid-cols-2 gap-2">
                        {serviceOptions.map(s => (
                          <motion.button
                            key={s} whileTap={{ scale: 0.97 }} onClick={() => toggleItem("services", s)}
                            className={`text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                              data.services.includes(s)
                                ? "bg-primary/10 border-primary/40 text-foreground shadow-sm shadow-primary/10"
                                : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/20"
                            }`}
                          >
                            {data.services.includes(s) && <CheckCircle2 className="w-3 h-3 text-primary inline mr-1.5" />}
                            {s}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="font-display font-semibold text-lg text-foreground mb-4">What are your primary goals?</h2>
                      <p className="text-xs text-muted-foreground mb-4">Select all that apply</p>
                      <div className="grid grid-cols-2 gap-2">
                        {goalOptions.map(g => (
                          <motion.button
                            key={g} whileTap={{ scale: 0.97 }} onClick={() => toggleItem("goals", g)}
                            className={`text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                              data.goals.includes(g)
                                ? "bg-primary/10 border-primary/40 text-foreground shadow-sm shadow-primary/10"
                                : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/20"
                            }`}
                          >
                            {data.goals.includes(g) && <CheckCircle2 className="w-3 h-3 text-accent inline mr-1.5" />}
                            {g}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="font-display font-semibold text-lg text-foreground mb-4">Budget & Timeline</h2>
                      <div>
                        <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Monthly Budget</label>
                        <select value={data.budget} onChange={e => setData({...data, budget: e.target.value})} className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground">
                          <option>Under ₹5L / $5K</option>
                          <option>₹5L - ₹15L / $5K - $15K</option>
                          <option>₹15L - ₹50L / $15K - $50K</option>
                          <option>₹50L+ / $50K+</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Timeline</label>
                        <select value={data.timeline} onChange={e => setData({...data, timeline: e.target.value})} className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground">
                          <option>ASAP</option>
                          <option>1-3 months</option>
                          <option>3-6 months</option>
                          <option>6+ months</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Additional Details</label>
                        <textarea
                          value={data.message} onChange={e => setData({...data, message: e.target.value})}
                          rows={3} placeholder="Any specifics..."
                          className="flex w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <h2 className="font-display font-semibold text-lg text-foreground mb-4">Review Your Request</h2>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Name</span>
                          <span className="text-foreground">{data.name || "—"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Email</span>
                          <span className="text-foreground">{data.email || "—"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Company</span>
                          <span className="text-foreground">{data.company || "—"}</span>
                        </div>
                        <div className="py-2 border-b border-border/50">
                          <span className="text-muted-foreground block mb-1">Services</span>
                          <div className="flex flex-wrap gap-1">
                            {data.services.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s}</span>)}
                            {data.services.length === 0 && <span className="text-muted-foreground">—</span>}
                          </div>
                        </div>
                        <div className="py-2 border-b border-border/50">
                          <span className="text-muted-foreground block mb-1">Goals</span>
                          <div className="flex flex-wrap gap-1">
                            {data.goals.map(g => <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{g}</span>)}
                            {data.goals.length === 0 && <span className="text-muted-foreground">—</span>}
                          </div>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="text-foreground">{data.budget}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Timeline</span>
                          <span className="text-foreground">{data.timeline}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1 text-sm">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </Button>
                ) : <div />}
                {step < 4 ? (
                  <Button onClick={() => setStep(step + 1)} className="rounded-full px-6 gap-1 font-display font-semibold text-sm">
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="rounded-full px-6 font-display font-semibold text-sm bg-gradient-to-r from-[hsl(20,90%,50%)] to-[hsl(30,100%,45%)] text-white hover:opacity-90">
                    {loading ? "Submitting..." : "Submit Proposal Request"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
