import { lazy, Suspense, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead, { breadcrumbSchema } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Download, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SERVICES = [
  { id: "seo", name: "SEO", desc: "Rank higher, win organic traffic" },
  { id: "google-ads", name: "Google Ads", desc: "Buy intent — fast pipeline" },
  { id: "social", name: "Social Media", desc: "Brand + engagement" },
  { id: "content", name: "Content Marketing", desc: "Blogs, video, lead magnets" },
  { id: "web-dev", name: "Web Development", desc: "Fast, conversion-ready sites" },
  { id: "ai", name: "AI Automation", desc: "Agents, workflows, integrations" },
  { id: "whatsapp", name: "WhatsApp Marketing", desc: "Broadcast + automation" },
  { id: "pr", name: "Digital PR", desc: "Backlinks + brand authority" },
];

const BUDGETS = [
  { id: "<50k", label: "Under ₹50k / mo" },
  { id: "50k-1L", label: "₹50k–1L / mo" },
  { id: "1L-3L", label: "₹1L–3L / mo" },
  { id: "3L+", label: "₹3L+ / mo" },
];
const TIMELINES = [
  { id: "asap", label: "ASAP" },
  { id: "30d", label: "Within 30 days" },
  { id: "90d", label: "Within 90 days" },
  { id: "exploring", label: "Just exploring" },
];

export default function ProposalBuilder() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ pdf_url: string; quote_number: string } | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", website: "",
    goal: "", services: [] as string[], budget_range: "50k-1L", timeline: "30d", notes: "",
  });

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const canAdvance =
    step === 0 ? form.services.length > 0 :
    step === 1 ? form.goal.trim().length > 8 :
    step === 2 ? !!form.budget_range && !!form.timeline :
    !!form.name && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);

  const toggleService = (id: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter((s) => s !== id) : [...f.services, id],
    }));

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-proposal-pdf", { body: form });
      if (error) throw error;
      setResult({ pdf_url: data.pdf_url, quote_number: data.quote_number });
      toast({ title: "Proposal generated", description: "Your PDF is ready — opening in a new tab." });
    } catch (e: any) {
      toast({ title: "Could not generate", description: e?.message ?? "Try again", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Free Growth Proposal Builder — Custom PDF in 60s | Digital Penta"
        description="Build a custom, AI-priced digital marketing proposal in 60 seconds. SEO, Ads, Social, Web Dev, AI, WhatsApp — instant PDF + senior strategist call."
        canonical="https://digitalpenta.com/proposal-builder"
        schemas={[breadcrumbSchema([
          { name: "Home", url: "https://digitalpenta.com/" },
          { name: "Proposal Builder", url: "https://digitalpenta.com/proposal-builder" },
        ])]}
      />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <p className="type-label text-primary mb-2 font-mono">Free · No signup</p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-3">
              Build your growth proposal
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              60 seconds. Pick services, share your goal, get a branded PDF + a strategist call.
            </p>
          </div>

          {!result ? (
            <div className="card-premium p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 text-xs font-mono text-muted-foreground">
                <span>Step {step + 1} of {totalSteps}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5 mb-8" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === 0 && (
                    <div>
                      <h2 className="font-display font-bold text-2xl mb-2">Which services do you need?</h2>
                      <p className="text-sm text-muted-foreground mb-5">Pick one or more — we'll bundle pricing.</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {SERVICES.map((s) => {
                          const active = form.services.includes(s.id);
                          return (
                            <button
                              type="button"
                              key={s.id}
                              onClick={() => toggleService(s.id)}
                              className={`text-left rounded-xl border p-4 transition-all ${active
                                ? "border-primary/60 bg-primary/10"
                                : "border-border/40 hover:border-primary/30 bg-card/40"
                                }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-display font-semibold">{s.name}</span>
                                {active && <CheckCircle2 className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground">{s.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 className="font-display font-bold text-2xl mb-2">What's the goal?</h2>
                      <p className="text-sm text-muted-foreground mb-5">
                        Be specific — "double leads in 6 months" beats "more growth".
                      </p>
                      <Textarea
                        rows={5}
                        value={form.goal}
                        onChange={(e) => setForm({ ...form, goal: e.target.value })}
                        placeholder="e.g. We're a B2B SaaS in Mumbai; need to 3× MQLs in 6 months from SEO + Google Ads, currently at 40/mo."
                      />
                      <div className="mt-4">
                        <Label className="text-xs">Website (optional)</Label>
                        <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="yourbrand.com" />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="font-display font-bold text-2xl mb-2">Budget & timeline</h2>
                      <p className="text-sm text-muted-foreground mb-5">Helps us tailor the right scope.</p>
                      <Label className="text-xs">Monthly budget</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 mb-5">
                        {BUDGETS.map((b) => (
                          <button
                            key={b.id} type="button"
                            onClick={() => setForm({ ...form, budget_range: b.id })}
                            className={`rounded-lg border p-3 text-sm transition-all ${form.budget_range === b.id ? "border-primary/60 bg-primary/10" : "border-border/40 hover:border-primary/30"}`}
                          >{b.label}</button>
                        ))}
                      </div>
                      <Label className="text-xs">Timeline</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {TIMELINES.map((t) => (
                          <button
                            key={t.id} type="button"
                            onClick={() => setForm({ ...form, timeline: t.id })}
                            className={`rounded-lg border p-3 text-sm transition-all ${form.timeline === t.id ? "border-primary/60 bg-primary/10" : "border-border/40 hover:border-primary/30"}`}
                          >{t.label}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h2 className="font-display font-bold text-2xl mb-2">Where do we send it?</h2>
                      <p className="text-sm text-muted-foreground mb-5">PDF arrives instantly. A senior strategist follows up within 1 business day.</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Full name *</Label>
                          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Work email *</Label>
                          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-xs">WhatsApp / phone</Label>
                          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-xs">Company</Label>
                          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Anything else (optional)</Label>
                          <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8">
                <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                {step < totalSteps - 1 ? (
                  <Button size="lg" disabled={!canAdvance} onClick={() => setStep((s) => s + 1)} className="rounded-full font-display">
                    Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button size="lg" disabled={!canAdvance || submitting} onClick={onSubmit} className="rounded-full font-display">
                    {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating PDF…</>) : (<><Sparkles className="w-4 h-4 mr-2" /> Generate Proposal</>)}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="font-display font-bold text-3xl mb-2">Your proposal is ready</h2>
              <p className="text-muted-foreground mb-6">
                Reference: <span className="font-mono text-foreground">{result.quote_number}</span>
              </p>
              <a href={result.pdf_url} target="_blank" rel="noopener" className="inline-block">
                <Button size="lg" className="rounded-full font-display">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-4">A senior strategist will reach out within 1 business day.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
