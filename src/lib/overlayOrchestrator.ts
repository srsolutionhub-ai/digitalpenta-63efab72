// Lightweight singleton: ensures only ONE bottom-anchored overlay is visible at once.
// Higher priority wins. Components register via useOverlaySlot.

export type OverlayId =
  | "cookie-consent"
  | "exit-intent"
  | "lead-capture"
  | "live-activity"
  | "smart-cta";

const PRIORITY: Record<OverlayId, number> = {
  "cookie-consent": 100,
  "exit-intent": 90,
  "lead-capture": 70,
  "live-activity": 40,
  "smart-cta": 30,
};

type Listener = () => void;

const requested = new Set<OverlayId>();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const overlayBus = {
  request(id: OverlayId) {
    if (requested.has(id)) return;
    requested.add(id);
    emit();
  },
  release(id: OverlayId) {
    if (!requested.has(id)) return;
    requested.delete(id);
    emit();
  },
  active(): OverlayId | null {
    let best: OverlayId | null = null;
    let bestP = -1;
    requested.forEach((id) => {
      const p = PRIORITY[id];
      if (p > bestP) {
        bestP = p;
        best = id;
      }
    });
    return best;
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  isCookieResolved(): boolean {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem("dp-cookie-consent");
  },
};
