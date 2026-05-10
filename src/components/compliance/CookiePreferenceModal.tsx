import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cookie, Shield } from "lucide-react";
import { useOverlaySlot } from "@/hooks/useOverlaySlot";

const STORAGE_KEY = "cookie_consent_v1";

type Prefs = { necessary: true; analytics: boolean; marketing: boolean; personalization: boolean };

const DEFAULTS: Prefs = { necessary: true, analytics: false, marketing: false, personalization: false };

function getStored(): Prefs | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}

export function applyConsent(prefs: Prefs) {
  (window as any).__consent = prefs;
  if (prefs.analytics && (window as any).gtag) (window as any).gtag("consent", "update", { analytics_storage: "granted" });
}

export default function CookiePreferenceModal() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    const stored = getStored();
    if (stored) { setPrefs(stored); applyConsent(stored); }
    else setShowBanner(true);
    (window as any).openCookiePreferences = () => setShowModal(true);
  }, []);

  const persist = async (next: Prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    applyConsent(next);
    setPrefs(next);
    setShowBanner(false);
    setShowModal(false);
    try {
      await supabase.from("cookie_consent_ledger").insert({
        preferences: next as any,
        policy_version: "v1",
        user_agent: navigator.userAgent,
        visitor_id: localStorage.getItem("visitor_id") || null,
      });
    } catch { /* non-blocking */ }
  };

  const bannerVisible = useOverlaySlot("cookie-consent", showBanner);

  return (
    <>
      {bannerVisible && (
        <div
          className="fixed z-[60] bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[640px] motion-safe:animate-[slideUpFade_.5s_cubic-bezier(.16,1,.3,1)_both]"
          role="dialog"
          aria-label="Cookie preferences"
        >
          {/* Gradient border wrapper */}
          <div
            className="rounded-2xl p-[1px] shadow-[0_20px_60px_-20px_hsl(256_90%_30%/0.55)]"
            style={{
              background:
                "linear-gradient(135deg, hsl(256 90% 65% / 0.55), hsl(192 95% 60% / 0.25) 45%, hsl(322 90% 65% / 0.45))",
            }}
          >
            <div className="relative rounded-2xl bg-background/85 backdrop-blur-xl px-4 py-3.5 md:px-5 md:py-4 overflow-hidden">
              {/* Soft inner glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -left-12 w-48 h-48 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(closest-side, hsl(256 90% 60% / 0.55), transparent)" }}
              />
              <div className="relative flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(256 90% 65% / 0.25), hsl(256 90% 65% / 0.05))",
                      boxShadow: "0 6px 20px -8px hsl(256 90% 60% / 0.6)",
                    }}
                  >
                    <Cookie className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] md:text-sm font-display font-semibold text-foreground leading-tight">
                      We value your privacy
                    </p>
                    <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 leading-snug">
                      Cookies help us improve your experience &amp; analyze traffic.{" "}
                      <span className="hidden md:inline">GDPR &amp; DPDP compliant.</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => { setShowBanner(false); setShowModal(true); }}
                  >
                    Customize
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-[11px]"
                    onClick={() => persist(DEFAULTS)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-3.5 text-[11px] font-semibold shadow-[0_6px_20px_-6px_hsl(256_90%_60%/0.7)]"
                    onClick={() => persist({ necessary: true, analytics: true, marketing: true, personalization: true })}
                  >
                    Accept all
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Cookie Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { key: "necessary", label: "Strictly necessary", desc: "Required for the site to function. Cannot be disabled.", locked: true },
              { key: "analytics", label: "Analytics", desc: "Helps us understand visitor behavior to improve the experience." },
              { key: "marketing", label: "Marketing", desc: "Used to deliver relevant ads and measure campaign performance." },
              { key: "personalization", label: "Personalization", desc: "Tailors content and recommendations based on your activity." },
            ].map((row: any) => (
              <div key={row.key} className="flex items-start justify-between gap-4 py-2 border-b border-border/10 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.desc}</p>
                </div>
                <Switch
                  checked={(prefs as any)[row.key]}
                  disabled={row.locked}
                  onCheckedChange={(v) => setPrefs({ ...prefs, [row.key]: v } as Prefs)}
                />
              </div>
            ))}
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => persist(DEFAULTS)}>Reject all</Button>
              <Button size="sm" onClick={() => persist(prefs)}>Save preferences</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
