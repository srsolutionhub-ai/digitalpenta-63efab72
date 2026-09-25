// Shared helpers to safely build PostgREST filter strings from user input.
//
// `.or("col.ilike.%value%,...")` builds a raw filter string that PostgREST
// parses for special characters (`,` separates conditions, `(` `)` group
// them, `%`/`*` are ilike wildcards). Untrusted search input must never be
// interpolated into that string without stripping/escaping those characters,
// or a user could inject extra `.or()` clauses / conditions.

/** Strip characters that have special meaning inside a PostgREST filter string. */
export function sanitizeOrTerm(input: string): string {
  return input.replace(/[,()%*\\]/g, " ").trim();
}

/** Build a safe `%term%` ilike pattern for use inside `.or()`. */
export function safeIlikePattern(input: string): string {
  return `%${sanitizeOrTerm(input)}%`;
}

/** Only allow http/https URLs to be rendered as links; returns null otherwise. */
export function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url, window.location.origin);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
    return null;
  } catch {
    return null;
  }
}
