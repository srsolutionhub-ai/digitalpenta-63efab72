import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TrendingUp, X } from "lucide-react";

type Activity = {
  name: string;
  city: string;
  action: string;
  timeAgo: string;
  metric?: string;
};

const ACTIVITIES: Activity[] = [
  { name: "Rohan S.", city: "Mumbai", action: "booked a free SEO audit", timeAgo: "2 min ago" },
  { name: "Aisha K.", city: "Dubai", action: "started a Google Ads campaign", timeAgo: "7 min ago", metric: "₹1.2L/mo" },
  { name: "Karthik M.", city: "Bengaluru", action: "got their growth proposal", timeAgo: "12 min ago" },
  { name: "Priya N.", city: "Delhi", action: "signed up for SEO + content", timeAgo: "23 min ago", metric: "+184% traffic" },
  { name: "Mohammed A.", city: "Riyadh", action: "launched a new landing page", timeAgo: "34 min ago" },
  { name: "Sneha R.", city: "Pune", action: "renewed their retainer", timeAgo: "41 min ago", metric: "6× ROAS" },
  { name: "Vikram J.", city: "Gurgaon", action: "booked a strategy call", timeAgo: "58 min ago" },
  { name: "Fatima H.", city: "Abu Dhabi", action: "approved their Q2 plan", timeAgo: "1 hr ago", metric: "+92 leads" },
  { name: "Arjun P.", city: "Hyderabad", action: "launched WhatsApp automation", timeAgo: "1 hr ago" },
  { name: "Neha T.", city: "Noida", action: "got their custom audit report", timeAgo: "2 hr ago" },
];

const SHOW_DELAY_MS = 12000; // first appearance
const VISIBLE_MS = 6500;
const GAP_MS = 9000;
const DISMISS_KEY = "dp-activity-feed-dismissed";

export default function LiveActivityFeed() {
  const [active, setActive] = useState<Activity | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY)) {
      setDismissed(true);
      return;
    }

    let i = Math.floor(Math.random() * ACTIVITIES.length);
    let visibleTimer: number | undefined;
    let gapTimer: number | undefined;

    const show = () => {
      setActive(ACTIVITIES[i % ACTIVITIES.length]);
      i += 1;
      visibleTimer = window.setTimeout(() => {
        setActive(null);
        gapTimer = window.setTimeout(show, GAP_MS);
      }, VISIBLE_MS);
    };

    const start = window.setTimeout(show, SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(start);
      if (visibleTimer) window.clearTimeout(visibleTimer);
      if (gapTimer) window.clearTimeout(gapTimer);
    };
  }, []);

  const dismiss = () => {
    setActive(null);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* noop */
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={active.name + active.timeAgo}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-24 left-4 z-40 hidden sm:flex max-w-xs items-start gap-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-xl px-4 py-3 shadow-2xl"
          role="status"
          aria-live="polite"
        >
          <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] leading-snug text-foreground">
              <span className="font-semibold">{active.name}</span>
              <span className="text-muted-foreground"> from {active.city} </span>
              {active.action}
              {active.metric && (
                <span className="ml-1 inline-block rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-primary">
                  {active.metric}
                </span>
              )}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/80 font-mono">
              {active.timeAgo} · verified
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss activity feed"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
