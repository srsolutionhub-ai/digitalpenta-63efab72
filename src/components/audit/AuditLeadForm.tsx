import { useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2, Lock, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

// Inline validators
const phoneRegex = /^[+]?[\d\s\-().]{8,20}$/;
const companyRegex = /^[a-zA-Z0-9 .,&'\-]+$/;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z
    .string()
    .trim()
    .email("Enter a valid work email")
    .max(255)
    .refine((v) => !/^.+@(example|test|mailinator)\./i.test(v), "Please use a real work email"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone must be at least 8 digits")
    .max(20, "Phone is too long")
    .regex(phoneRegex, "Use digits, +, spaces or dashes only"),
  company: z
    .string()
    .trim()
    .max(100, "Company name is too long")
    .regex(companyRegex, "Letters, numbers and . , & ' - only")
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept the privacy notice to continue" }),
  }),
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

type Field = "name" | "email" | "phone" | "company" | "consent";

export function AuditLeadForm({ url, onSubmit, loading, onBack }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    name: false,
    email: false,
    phone: false,
    company: false,
    consent: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Live validation results (per field) — show only after touched or submit attempt
  const validation = useMemo(() => {
    const result = schema.safeParse({ name, email, phone, company, consent });
    const errs: Partial<Record<Field, string>> = {};
    if (!result.success) {
      result.error.errors.forEach((er) => {
        const k = er.path[0] as Field | undefined;
        if (k) errs[k] = er.message;
      });
    }
    return errs;
  }, [name, email, phone, company, consent]);

  const showError = (f: Field) => (touched[f] || submitAttempted) && validation[f];
  const fieldOk = (f: Field, value: string | boolean) => {
    const filled = typeof value === "boolean" ? value : !!String(value).trim();
    return filled && !validation[f];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ name: true, email: true, phone: true, company: true, consent: true });
    if (Object.keys(validation).length > 0) return;
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim() || undefined,
    });
  };

  const inputCls = (f: Field, value: string | boolean) => {
    const err = showError(f);
    const ok = (touched[f] || submitAttempted) && fieldOk(f, value);
    return `mt-1 transition-colors ${
      err
        ? "border-rose-500/60 focus-visible:ring-rose-500/30"
        : ok
        ? "border-emerald-500/50 focus-visible:ring-emerald-500/30"
        : ""
    }`;
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

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <Label htmlFor="lead-name" className="text-xs">Full name *</Label>
              <Input
                id="lead-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Jane Doe"
                disabled={loading}
                autoComplete="name"
                aria-invalid={!!showError("name")}
                aria-describedby={showError("name") ? "lead-name-err" : undefined}
                className={inputCls("name", name)}
              />
              <FieldHint id="lead-name-err" error={showError("name")} ok={fieldOk("name", name) && (touched.name || submitAttempted)} />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="lead-email" className="text-xs">Work email *</Label>
              <Input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="jane@company.com"
                disabled={loading}
                autoComplete="email"
                aria-invalid={!!showError("email")}
                aria-describedby={showError("email") ? "lead-email-err" : undefined}
                className={inputCls("email", email)}
              />
              <FieldHint id="lead-email-err" error={showError("email")} ok={fieldOk("email", email) && (touched.email || submitAttempted)} />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="lead-phone" className="text-xs">Phone (WhatsApp preferred) *</Label>
              <Input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder="+91 98765 43210"
                disabled={loading}
                autoComplete="tel"
                aria-invalid={!!showError("phone")}
                aria-describedby={showError("phone") ? "lead-phone-err" : "lead-phone-hint"}
                className={inputCls("phone", phone)}
              />
              {showError("phone") ? (
                <FieldHint id="lead-phone-err" error={showError("phone")} ok={false} />
              ) : (
                <p id="lead-phone-hint" className="mt-1 text-[10.5px] text-muted-foreground">
                  Include country code, e.g. +91 or +1
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="lead-company" className="text-xs">Company (optional)</Label>
              <Input
                id="lead-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, company: true }))}
                placeholder="Acme Inc."
                disabled={loading}
                autoComplete="organization"
                aria-invalid={!!showError("company")}
                aria-describedby={showError("company") ? "lead-company-err" : undefined}
                className={inputCls("company", company)}
              />
              <FieldHint id="lead-company-err" error={showError("company")} ok={fieldOk("company", company) && !!company && (touched.company || submitAttempted)} />
            </div>
          </div>

          {/* Consent */}
          <div className="rounded-xl border border-border/40 bg-card/60 p-3">
            <label htmlFor="lead-consent" className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                id="lead-consent"
                checked={consent}
                onCheckedChange={(v) => {
                  setConsent(v === true);
                  setTouched((t) => ({ ...t, consent: true }));
                }}
                disabled={loading}
                aria-invalid={!!showError("consent")}
                className="mt-0.5"
              />
              <span className="text-[11.5px] leading-relaxed text-muted-foreground">
                I agree to receive my audit report and occasional follow-ups from Digital Penta. I've
                read the{" "}
                <a href="/privacy" target="_blank" rel="noreferrer" className="text-primary underline-offset-2 hover:underline">
                  privacy policy
                </a>{" "}
                and can unsubscribe anytime.
              </span>
            </label>
            {showError("consent") && (
              <p className="mt-2 flex items-center gap-1 text-[11px] text-rose-400">
                <AlertCircle className="h-3 w-3" /> {validation.consent}
              </p>
            )}
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

function FieldHint({ id, error, ok }: { id?: string; error?: string | undefined | false; ok?: boolean }) {
  if (error) {
    return (
      <p id={id} className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
        <AlertCircle className="h-3 w-3" /> {error}
      </p>
    );
  }
  if (ok) {
    return (
      <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Looks good
      </p>
    );
  }
  return null;
}
