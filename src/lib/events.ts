/**
 * Conversion event dictionary — the single source of truth for event names.
 * Every conversion goes through `trackConversion` so GA4, GTM dataLayer and
 * ad platforms receive identical names. Keep in sync with GA4 key events.
 */
import { trackEvent } from "@/lib/analytics";
import { forwardConversionToAds } from "@/lib/marketingTags";

export const CONVERSIONS = {
  generate_lead: "Server-confirmed enquiry (any form)",
  book_call: "Strategy call booked",
  request_proposal: "Proposal brief submitted",
  request_audit: "Free SEO/website audit requested",
  run_ai_tool: "Free AI tool used",
  newsletter_signup: "Newsletter subscription confirmed",
  contact_whatsapp: "WhatsApp click",
  contact_phone: "Phone click",
  contact_email: "Email click",
} as const;

/** Meta standard event each conversion maps to (used by the GTM Pixel tag). */
export const META_EVENT: Partial<Record<keyof typeof CONVERSIONS, string>> = {
  generate_lead: "Lead", book_call: "Schedule", request_proposal: "SubmitApplication",
  request_audit: "Lead", newsletter_signup: "Subscribe", contact_whatsapp: "Contact",
  contact_phone: "Contact", contact_email: "Contact",
};

export type ConversionName = keyof typeof CONVERSIONS;

export function trackConversion(
  name: ConversionName,
  params: Record<string, string | number | boolean | undefined> = {},
): void {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  // Unique per conversion: lets GTM / Meta deduplicate browser + server copies.
  if (!clean.event_id) {
    clean.event_id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  clean.meta_event_name = META_EVENT[name] ?? "";
  trackEvent(name, { ...clean, conversion: true });
  forwardConversionToAds(name, clean);
}
