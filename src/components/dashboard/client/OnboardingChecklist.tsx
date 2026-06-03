/**
 * Onboarding checklist for client portal.
 * 6-step static list persisted in localStorage. When the client completes all
 * steps the card collapses to a minimized success badge.
 */
import { useEffect, useMemo, useState } from "react";
import { Check, Circle, Rocket } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const LS_KEY = "client-onboarding-v1";

const STEPS = [
  { id: "kickoff", label: "Kick-off call completed" },
  { id: "brand", label: "Brand assets + access shared" },
  { id: "tracking", label: "GA4 + Search Console verified" },
  { id: "strategy", label: "Strategy doc approved" },
  { id: "first_deliverable", label: "First deliverable shipped" },
  { id: "reporting", label: "Monthly reporting cadence set" },
] as const;

export default function OnboardingChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const completed = useMemo(() => STEPS.filter((s) => done[s.id]).length, [done]);
  const pct = Math.round((completed / STEPS.length) * 100);

  return (
    <div className="card-surface rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" aria-hidden />
            Onboarding
          </h3>
          <p className="text-xs text-muted-foreground">
            {completed === STEPS.length ? "You're fully live 🎉" : `${completed} of ${STEPS.length} steps complete`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-2xl text-foreground tabular-nums">{pct}%</p>
        </div>
      </div>

      <Progress value={pct} className="h-1.5" />

      <ul className="space-y-1.5">
        {STEPS.map((s) => {
          const checked = !!done[s.id];
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => toggle(s.id)}
                aria-pressed={checked}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.03] transition-colors text-left focus-visible:outline-none focus-visible:bg-white/[0.04]"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    checked
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      : "border border-white/15 text-muted-foreground"
                  }`}
                  aria-hidden
                >
                  {checked ? <Check className="w-3 h-3" /> : <Circle className="w-2 h-2" />}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    checked ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
