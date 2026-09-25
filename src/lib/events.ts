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

export type ConversionName = keyof typeof CONVERSIONS;

export function trackConversion(
  name: ConversionName,
  params: Record<string, string | number | boolean | undefined> = {},
): void {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  trackEvent(name, { ...clean, conversion: true });
  forwardConversionToAds(name, clean);
}
