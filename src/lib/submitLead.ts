/**
 * submitLead — the only way public forms create enquiries.
 * Talks to the `submit-lead` server function (validation, spam checks,
 * rate limit, dedupe, AI scoring, routing, emails). Uses plain fetch so the
 * Supabase SDK stays off the homepage critical path.
 */
import { trackConversion } from "@/lib/events";
import { getVisitorId } from "@/lib/visitorTracking";

export type LeadForm = "contact" | "homepage" | "audit" | "proposal" | "data_request" | "tool";

export interface LeadPayload {
  form: LeadForm;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  extra?: Record<string, unknown>;
  /** honeypot value — pass the hidden field's value */
  hp?: string;
  /** ms timestamp when the form was first shown */
  startedAt?: number;
}

export class LeadError extends Error {
  constructor(message: string, public status: number, public fields?: Record<string, string[]>) {
    super(message);
  }
}

const PAGE_LOADED_AT = Date.now();
const FIRST_TOUCH_KEY = "dp_first_touch_v1";

function readUtm(): Record<string, string> {
  // Re-capture in case the visitor arrived with params on this exact page.
  const fresh = captureAttribution();
  const last = fresh ?? getLastTouch();
  const first = getFirstTouchAttribution();
  const out: Record<string, string> = { ...last };
  if (first.utm_source || first.gclid || first.fbclid) {
    out.first_source = first.utm_source || (first.gclid ? "google_ads" : first.fbclid ? "meta_ads" : "");
    if (first.utm_campaign) out.first_campaign = first.utm_campaign;
  }
  return out;
}

function readFirstTouch(): Record<string, string> | undefined {
  try {
    const raw = localStorage.getItem(FIRST_TOUCH_KEY);
    if (!raw) return undefined;
    const obj = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => typeof v === "string").map(([k, v]) => [k, (v as string).slice(0, 500)]),
    );
  } catch { return undefined; }
}

export async function submitLead(p: LeadPayload): Promise<{ leadId?: string; duplicate?: boolean }> {
  const url = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/submit-lead`;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const { startedAt, ...rest } = p;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      ...rest,
      started_at: startedAt ?? PAGE_LOADED_AT,
      page: window.location.pathname,
      utm: readUtm(),
      first_touch: readFirstTouch(),
      visitor_id: getVisitorId(),
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new LeadError(body?.error ?? "Something went wrong. Please try again.", res.status, body?.fields);
  trackConversion("generate_lead", { form: p.form, service: p.service });
  return { leadId: body.lead_id, duplicate: body.duplicate };
}
