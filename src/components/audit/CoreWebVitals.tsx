import { Smartphone, Monitor, Zap, Activity, MousePointerClick, Layers, Server } from "lucide-react";

interface DeviceScores {
  performance?: number | null;
  fcp_ms?: number;
  lcp_ms?: number;
  cls?: number;
  tbt_ms?: number;
  inp_ms?: number;
  ttfb_ms?: number;
  speed_index?: number;
}

const fmtMs = (ms?: number) => (ms ? (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`) : "—");
const fmtCls = (v?: number) => (typeof v === "number" ? v.toFixed(3) : "—");

function vitalStatus(metric: string, value?: number) {
  if (value == null) return { cls: "text-muted-foreground", label: "—" };
  switch (metric) {
    case "lcp":
      return value < 2500 ? { cls: "text-emerald-400", label: "Good" } : value < 4000 ? { cls: "text-amber-400", label: "Needs work" } : { cls: "text-rose-400", label: "Poor" };
    case "cls":
      return value < 0.1 ? { cls: "text-emerald-400", label: "Good" } : value < 0.25 ? { cls: "text-amber-400", label: "Needs work" } : { cls: "text-rose-400", label: "Poor" };
    case "tbt":
      return value < 200 ? { cls: "text-emerald-400", label: "Good" } : value < 600 ? { cls: "text-amber-400", label: "Needs work" } : { cls: "text-rose-400", label: "Poor" };
    case "inp":
      return value < 200 ? { cls: "text-emerald-400", label: "Good" } : value < 500 ? { cls: "text-amber-400", label: "Needs work" } : { cls: "text-rose-400", label: "Poor" };
    case "fcp":
      return value < 1800 ? { cls: "text-emerald-400", label: "Good" } : value < 3000 ? { cls: "text-amber-400", label: "Needs work" } : { cls: "text-rose-400", label: "Poor" };
    case "ttfb":
      return value < 800 ? { cls: "text-emerald-400", label: "Good" } : value < 1800 ? { cls: "text-amber-400", label: "Needs work" } : { cls: "text-rose-400", label: "Poor" };
    default:
      return { cls: "text-muted-foreground", label: "" };
  }
}

function VitalCell({ icon: Icon, label, value, metric, raw }: { icon: any; label: string; value: string; metric: string; raw?: number }) {
  const s = vitalStatus(metric, raw);
  return (
    <div className="rounded-xl border border-border/30 bg-card/50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`mt-1 font-display text-lg font-bold tabular-nums ${s.cls}`}>{value}</div>
      <div className={`text-[10px] ${s.cls}`}>{s.label}</div>
    </div>
  );
}

function DeviceCard({ icon: Icon, title, scores }: { icon: any; title: string; scores?: DeviceScores | null }) {
  if (!scores) {
    return (
      <div className="rounded-2xl border border-border/30 bg-card p-5 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Icon className="h-4 w-4" /> {title}
        </div>
        Lighthouse run failed for this device.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-border/30 bg-gradient-to-b from-card to-card/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </div>
        <div className="text-[11px] text-muted-foreground">Performance: <span className="font-bold text-foreground">{scores.performance ?? "—"}</span></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <VitalCell icon={Zap} label="LCP" value={fmtMs(scores.lcp_ms)} metric="lcp" raw={scores.lcp_ms} />
        <VitalCell icon={Layers} label="CLS" value={fmtCls(scores.cls)} metric="cls" raw={scores.cls} />
        <VitalCell icon={Activity} label="TBT" value={fmtMs(scores.tbt_ms)} metric="tbt" raw={scores.tbt_ms} />
        <VitalCell icon={MousePointerClick} label="INP" value={fmtMs(scores.inp_ms)} metric="inp" raw={scores.inp_ms} />
        <VitalCell icon={Zap} label="FCP" value={fmtMs(scores.fcp_ms)} metric="fcp" raw={scores.fcp_ms} />
        <VitalCell icon={Server} label="TTFB" value={fmtMs(scores.ttfb_ms)} metric="ttfb" raw={scores.ttfb_ms} />
      </div>
    </div>
  );
}

export function CoreWebVitals({ mobile, desktop }: { mobile?: DeviceScores | null; desktop?: DeviceScores | null }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DeviceCard icon={Smartphone} title="Mobile" scores={mobile} />
      <DeviceCard icon={Monitor} title="Desktop" scores={desktop} />
    </div>
  );
}
