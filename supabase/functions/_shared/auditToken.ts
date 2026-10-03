// Signed proof that a visitor is the one who ran a given audit.
// The token is returned only to the browser that started the audit, so other
// callers can't act on someone else's audit just by knowing its id.
const enc = new TextEncoder();

async function key() {
  const secret = Deno.env.get("EMAIL_LINK_SECRET");
  if (!secret) throw new Error("signing secret missing");
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

export async function signAuditToken(auditId: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(`audit:${auditId}`));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyAuditToken(auditId: unknown, token: unknown): Promise<boolean> {
  if (typeof auditId !== "string" || typeof token !== "string" || token.length !== 64) return false;
  const expected = await signAuditToken(auditId);
  let diff = 0;
  for (let i = 0; i < 64; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
