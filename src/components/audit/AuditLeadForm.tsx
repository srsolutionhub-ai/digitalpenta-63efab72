import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid work email").max(255),
  phone: z.string().trim().min(8, "Enter a valid phone number").max(20),
  company: z.string().trim().max(100).optional().or(z.literal("")),
});

export interface AuditLeadData {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

interface Props {
  url: string;
  onSubmit: (data: AuditLeadData) => Promise<void> | void;
  loading?: boolean;
  onBack?: () => void;
}

export function AuditLeadForm({ url, onSubmit, loading, onBack }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({ name, email, phone, company });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((er) => {
        if (er.path[0]) errs[String(er.path[0])] = er.message;
      });
      setErrors(errs);
      return;
    }
    await onSubmit({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company || undefined,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-2xl shadow-primary/10 sm:p-8">
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" aria-hidden />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Last step before your full report
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Get your <span className="text-gradient">complete audit</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Auditing <span className="font-medium text-foreground">{url}</span> — we'll email you the full
          PDF with AI-prioritized fixes and a free 30-min strategy call invite.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lead-name" className="text-xs">Full name *</Label>
              <Input
                id="lead-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                disabled={loading}
                autoComplete="name"
                className="mt-1"
              />
              {errors.name && <p className="mt-1 text-[11px] text-rose-400">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="lead-email" className="text-xs">Work email *</Label>
              <Input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                disabled={loading}
                autoComplete="email"
                className="mt-1"
              />
              {errors.email && <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="lead-phone" className="text-xs">Phone (WhatsApp preferred) *</Label>
              <Input
                id="lead-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                disabled={loading}
                autoComplete="tel"
                className="mt-1"
              />
              {errors.phone && <p className="mt-1 text-[11px] text-rose-400">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="lead-company" className="text-xs">Company (optional)</Label>
              <Input
                id="lead-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                disabled={loading}
                autoComplete="organization"
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running deep audit…
              </>
            ) : (
              <>
                Run my advanced audit <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" /> 100% private</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> No card required</span>
            <span>·</span>
            <span>Unsubscribe anytime</span>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              ← Use a different URL
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
