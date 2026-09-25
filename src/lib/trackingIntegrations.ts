/**
 * Lazily loads enabled tracking tag IDs (GA4/GTM/Meta Pixel/LinkedIn) from
 * the `integration_settings` table via the public-integrations edge function
 * (RLS blocks anon reads of that table directly). Applied only after idle
 * and gated by the same consent categories as the static-env tags.
 */
import { setGa4MeasurementId } from "./ga4";
import { setGtmId, setPixelId, setLinkedInId } from "./marketingTags";

let started = false;

async function fetchAndApply(): Promise<void> {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-integrations`;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
    const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) return;
    const rows = (await res.json().catch(() => [])) as { provider: string; public_id: string }[];
    for (const r of rows) {
      if (!r?.public_id) continue;
      if (r.provider === "ga4") setGa4MeasurementId(r.public_id);
      else if (r.provider === "gtm") setGtmId(r.public_id);
      else if (r.provider === "meta_pixel") setPixelId(r.public_id);
      else if (r.provider === "linkedin") setLinkedInId(r.public_id);
    }
  } catch { /* fail soft — never breaks the site */ }
}

/** One-shot; call once from the cookie consent component. */
export function initTrackingIntegrations(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
  if (idle) idle(() => { void fetchAndApply(); });
  else setTimeout(() => { void fetchAndApply(); }, 2500);
}
