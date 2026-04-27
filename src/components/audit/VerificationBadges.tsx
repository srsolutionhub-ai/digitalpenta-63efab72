import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldCheck, Layers } from "lucide-react";

export type Verdict = "pass" | "warn" | "fail" | "unknown";

export interface VerificationCheck {
  id: string;
  label: string;
  verdict: Verdict;
  detail?: string;
  sources: string[];
  agreement: "agree" | "partial" | "single" | "conflict";
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
  if (!data) return null;
  const { checks, reachability, trust_score } = data;
  const passCount = checks.filter((c) => c.verdict === "pass").length;
  const failCount = checks.filter((c) => c.verdict === "fail").length;
  const warnCount = checks.filter((c) => c.verdict === "warn").length;

  return (
    <div className="rounded-3xl border border-border/40 bg-card/80 p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/15 p-1.5 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Verification</h4>
            <p className="text-[11px] text-muted-foreground">
              Each badge cross-checked against Lighthouse + live crawl
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
          return (
            <div
              key={c.id}
              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${meta.cls}`}
              title={`Sources: ${c.sources.join(", ") || "none"} · ${c.agreement}`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <meta.Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{c.label}</div>
                  {c.detail && <div className="truncate text-[11px] opacity-80">{c.detail}</div>}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end text-[10px] uppercase tracking-wide opacity-90">
                <span>{meta.label}</span>
                <span className="text-[9px] opacity-70">
                  {c.sources.length > 1 ? "verified" : c.sources.length === 1 ? "1 source" : "no data"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
