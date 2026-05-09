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
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[60] card-surface rounded-2xl p-5 shadow-2xl border border-border/30">
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-display font-semibold text-foreground">We value your privacy</p>
              <p className="text-xs text-muted-foreground mt-1">
                We use cookies to improve your experience, analyze traffic, and personalize content. GDPR & DPDP compliant.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button size="sm" onClick={() => persist({ necessary: true, analytics: true, marketing: true, personalization: true })}>Accept all</Button>
                <Button size="sm" variant="outline" onClick={() => persist(DEFAULTS)}>Reject all</Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowBanner(false); setShowModal(true); }}>Customize</Button>
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
