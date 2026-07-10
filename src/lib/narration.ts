// Central narration text used across the site for ElevenLabs TTS playback.
// Keep entries short (≤ 900 chars) so a single call stays under quota.

export const heroNarration =
  "Welcome to Digital Penta — India's revenue-obsessed digital growth agency. " +
  "We help ambitious brands scale through SEO, performance marketing, and AI-powered automation. " +
  "Over five hundred businesses trust us with over ten crore rupees in generated revenue. " +
  "Ready to grow? Book a free strategy call and let's map out your next quarter of growth.";

export function serviceNarration(title: string, description: string): string {
  const trimmed = description.replace(/\s+/g, " ").trim().slice(0, 700);
  return `${title}. ${trimmed}`;
}

export function articleNarration(title: string, excerpt: string, body?: string): string {
  const source = (excerpt ? excerpt + ". " : "") + (body ?? "");
  const clean = source
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1100);
  return `${title}. ${clean}`;
}
