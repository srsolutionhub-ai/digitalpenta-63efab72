import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

const steps = ["About You", "Services", "Goals", "Budget", "Review"];

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
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", email: "", phone: "", company: "", website: "",
    services: [] as string[], goals: [] as string[],
    budget: "₹5L - ₹15L", timeline: "1-3 months", message: "",
  });

  const toggleItem = (key: "services" | "goals", item: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(i => i !== item) : [...prev[key], item],
    }));
  };

  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen flex items-center">
          <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Proposal Request <span className="text-gradient">Received!</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our strategy team will review your requirements and send a customized proposal within 48 hours.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Free Proposal</span>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mt-3 mb-3">
                Get Your Custom <span className="text-gradient">Growth Plan</span>
              </h1>
              <p className="text-sm text-muted-foreground">Takes less than 3 minutes. No obligation.</p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-10">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:inline text-xs text-muted-foreground">{s}</span>
                  {i < steps.length - 1 && <div className="hidden sm:block w-8 h-px bg-border mx-1" />}
                </div>
              ))}
            </div>

            {/* Steps */}
            <div className="rounded-xl glass p-8">
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4">Tell us about yourself</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Full Name *</label>
                      <Input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="John Doe" className="bg-secondary/50 border-border/50" />
                    </div>
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Email *</label>
                      <Input type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} placeholder="john@company.com" className="bg-secondary/50 border-border/50" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Phone</label>
                      <Input value={data.phone} onChange={e => setData({...data, phone: e.target.value})} placeholder="+91 98765 43210" className="bg-secondary/50 border-border/50" />
                    </div>
                    <div>
                      <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Company</label>
                      <Input value={data.company} onChange={e => setData({...data, company: e.target.value})} placeholder="Company Name" className="bg-secondary/50 border-border/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Website</label>
                    <Input value={data.website} onChange={e => setData({...data, website: e.target.value})} placeholder="https://yoursite.com" className="bg-secondary/50 border-border/50" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4">What services do you need?</h2>
                  <p className="text-xs text-muted-foreground mb-4">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleItem("services", s)}
                        className={`text-left px-4 py-3 rounded-lg text-sm transition-colors border ${
                          data.services.includes(s)
                            ? "bg-primary/10 border-primary/40 text-foreground"
                            : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/20"
                        }`}
                      >
                        {s}
                      </button>
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
                      <button
                        key={g}
                        onClick={() => toggleItem("goals", g)}
                        className={`text-left px-4 py-3 rounded-lg text-sm transition-colors border ${
                          data.goals.includes(g)
                            ? "bg-primary/10 border-primary/40 text-foreground"
                            : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/20"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4">Budget & Timeline</h2>
                  <div>
                    <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Monthly Budget</label>
                    <select
                      value={data.budget}
                      onChange={e => setData({...data, budget: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground"
                    >
                      <option>Under ₹5L / $5K</option>
                      <option>₹5L - ₹15L / $5K - $15K</option>
                      <option>₹15L - ₹50L / $15K - $50K</option>
                      <option>₹50L+ / $50K+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Timeline</label>
                    <select
                      value={data.timeline}
                      onChange={e => setData({...data, timeline: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground"
                    >
                      <option>ASAP</option>
                      <option>1-3 months</option>
                      <option>3-6 months</option>
                      <option>6+ months</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-display font-medium text-foreground mb-1.5 block">Additional Details</label>
                    <textarea
                      value={data.message}
                      onChange={e => setData({...data, message: e.target.value})}
                      rows={3}
                      placeholder="Any specifics..."
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
                        {data.services.map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s}</span>
                        ))}
                        {data.services.length === 0 && <span className="text-muted-foreground">—</span>}
                      </div>
                    </div>
                    <div className="py-2 border-b border-border/50">
                      <span className="text-muted-foreground block mb-1">Goals</span>
                      <div className="flex flex-wrap gap-1">
                        {data.goals.map(g => (
                          <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{g}</span>
                        ))}
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

              {/* Nav */}
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
                  <Button onClick={() => setSubmitted(true)} className="rounded-full px-6 font-display font-semibold text-sm">
                    Submit Proposal Request
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
