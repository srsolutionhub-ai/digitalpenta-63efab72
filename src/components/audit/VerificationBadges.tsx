import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Layers,
  Eye,
  Code2,
  Globe,
  Gauge,
  FileText,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export type Verdict = "pass" | "warn" | "fail" | "unknown";

export interface CheckEvidence {
  lighthouse?: {
    audit_id: string;
    title?: string;
    description?: string;
    score?: number | null;
    display_value?: string | null;
    numeric_value?: number | null;
  } | null;
  crawl?: Record<string, unknown> | null;
  on_page_snippet?: string | null;
  thresholds?: string | null;
  notes?: string | null;
}

export interface VerificationCheck {
  id: string;
  label: string;
  verdict: Verdict;
  detail?: string;
  sources: string[];
  agreement: "agree" | "partial" | "single" | "conflict";
  evidence?: CheckEvidence;
}

export interface VerificationData {
  checks: VerificationCheck[];
  reachability: { lighthouse_mobile: boolean; lighthouse_desktop: boolean; crawl: boolean };
  trust_score: number;
}

const verdictMeta: Record<Verdict, { Icon: any; cls: string; label: string }> = {
  pass: { Icon: CheckCircle2, cls: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10", label: "Pass" },
  warn: { Icon: AlertTriangle, cls: "text-amber-300 border-amber-500/40 bg-amber-500/10", label: "Warn" },
  fail: { Icon: XCircle, cls: "text-rose-300 border-rose-500/40 bg-rose-500/10", label: "Fail" },
  unknown: { Icon: HelpCircle, cls: "text-muted-foreground border-border/40 bg-muted/30", label: "Unverified" },
};

export function VerificationBadges({ data }: { data?: VerificationData | null }) {
  const [active, setActive] = useState<VerificationCheck | null>(null);
  if (!data) return null;
  const { checks, reachability, trust_score } = data;
  const passCount = checks.filter((c) => c.verdict === "pass").length;
  const failCount = checks.filter((c) => c.verdict === "fail").length;
  const warnCount = checks.filter((c) => c.verdict === "warn").length;

  return (
    <>
      <div className="rounded-3xl border border-border/40 bg-card/80 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/15 p-1.5 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground">Verification</h4>
              <p className="text-[11px] text-muted-foreground">
                Each badge cross-checked against Lighthouse + live crawl. Click any badge to see the evidence.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">{passCount} pass</span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-300">{warnCount} warn</span>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-rose-300">{failCount} fail</span>
            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary">
              <Layers className="h-3 w-3" /> Trust {trust_score}%
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${reachability.lighthouse_mobile ? "border-emerald-500/30 text-emerald-300" : "border-rose-500/30 text-rose-300"}`}>
            {reachability.lighthouse_mobile ? "✓" : "✗"} Lighthouse mobile
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${reachability.lighthouse_desktop ? "border-emerald-500/30 text-emerald-300" : "border-rose-500/30 text-rose-300"}`}>
            {reachability.lighthouse_desktop ? "✓" : "✗"} Lighthouse desktop
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${reachability.crawl ? "border-emerald-500/30 text-emerald-300" : "border-rose-500/30 text-rose-300"}`}>
            {reachability.crawl ? "✓" : "✗"} Direct crawl
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {checks.map((c) => {
            const meta = verdictMeta[c.verdict];
            const hasEvidence = !!c.evidence && (c.evidence.lighthouse || c.evidence.crawl || c.evidence.on_page_snippet);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c)}
                className={`group flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all hover:scale-[1.01] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${meta.cls}`}
                aria-label={`${c.label} — ${meta.label}. View evidence.`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <meta.Icon className="h-4 w-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{c.label}</div>
                    {c.detail && <div className="truncate text-[11px] opacity-80">{c.detail}</div>}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5 text-[10px] uppercase tracking-wide opacity-90">
                  <span>{meta.label}</span>
                  <span className="inline-flex items-center gap-1 text-[9px] opacity-80 group-hover:opacity-100">
                    <Eye className="h-2.5 w-2.5" />
                    {hasEvidence ? "evidence" : c.sources.length ? "1 source" : "no data"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-l border-border/40 bg-card/95 backdrop-blur-xl sm:max-w-lg"
        >
          {active && <EvidenceBody check={active} />}
        </SheetContent>
      </Sheet>
    </>
  );
}

function EvidenceBody({ check }: { check: VerificationCheck }) {
  const meta = verdictMeta[check.verdict];
  const ev = check.evidence ?? {};

  return (
    <>
      <SheetHeader className="text-left">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${meta.cls}`}>
            <meta.Icon className="h-3 w-3" /> {meta.label}
          </span>
          <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {check.agreement}
          </span>
        </div>
        <SheetTitle className="font-display text-xl">{check.label}</SheetTitle>
        <SheetDescription>
          {check.detail ?? "Evidence used to compute this verdict."}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-5">
        {/* Sources */}
        <Section icon={Layers} title="Sources used">
          <div className="flex flex-wrap gap-1.5">
            {check.sources.length === 0 ? (
              <span className="text-[12px] text-muted-foreground">No sources available for this check.</span>
            ) : (
              check.sources.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border/40 bg-muted/40 px-2 py-0.5 text-[11px] text-foreground"
                >
                  {s.replace(/_/g, " ")}
                </span>
              ))
            )}
          </div>
        </Section>

        {/* Thresholds */}
        {ev.thresholds && (
          <Section icon={Gauge} title="Pass / fail thresholds">
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">{ev.thresholds}</p>
          </Section>
        )}

        {/* Lighthouse */}
        {ev.lighthouse && (
          <Section icon={Gauge} title="Lighthouse audit">
            <div className="rounded-xl border border-border/40 bg-background/40 p-3 text-[12px]">
              <KV k="audit id" v={ev.lighthouse.audit_id} mono />
              {ev.lighthouse.title && <KV k="title" v={ev.lighthouse.title} />}
              {ev.lighthouse.description && (
                <KV k="description" v={stripHtml(ev.lighthouse.description)} muted />
              )}
              <KV
                k="score"
                v={ev.lighthouse.score === null || ev.lighthouse.score === undefined
                  ? "n/a"
                  : `${Math.round((ev.lighthouse.score ?? 0) * 100)} / 100`}
              />
              {ev.lighthouse.display_value && (
                <KV k="display value" v={ev.lighthouse.display_value} mono />
              )}
              {typeof ev.lighthouse.numeric_value === "number" && (
                <KV k="numeric value" v={ev.lighthouse.numeric_value.toString()} mono />
              )}
            </div>
          </Section>
        )}

        {/* Crawl */}
        {ev.crawl && (
          <Section icon={Globe} title="Direct crawl result">
            <div className="rounded-xl border border-border/40 bg-background/40 p-3 text-[12px]">
              {Object.entries(ev.crawl).map(([k, v]) => (
                <KV key={k} k={k.replace(/_/g, " ")} v={formatVal(v)} mono />
              ))}
            </div>
          </Section>
        )}

        {/* On-page snippet */}
        {ev.on_page_snippet && (
          <Section icon={Code2} title="HTML snippet">
            <pre className="max-h-56 overflow-auto rounded-xl border border-border/40 bg-background/60 p-3 text-[11.5px] leading-relaxed text-foreground/90">
              <code>{ev.on_page_snippet}</code>
            </pre>
          </Section>
        )}

        {/* Notes */}
        {ev.notes && (
          <Section icon={FileText} title="Notes">
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">{ev.notes}</p>
          </Section>
        )}
      </div>
    </>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-md bg-primary/10 p-1 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h4 className="text-[12px] font-semibold uppercase tracking-wide text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function KV({ k, v, mono, muted }: { k: string; v: string; mono?: boolean; muted?: boolean }) {
  return (
    <div className="flex gap-3 border-b border-border/30 py-1.5 last:border-b-0">
      <span className="min-w-[110px] text-[11px] uppercase tracking-wide text-muted-foreground">{k}</span>
      <span
        className={`min-w-0 flex-1 break-words text-[12.5px] ${
          mono ? "font-mono" : ""
        } ${muted ? "text-muted-foreground" : "text-foreground"}`}
      >
        {v}
      </span>
    </div>
  );
}

function formatVal(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
