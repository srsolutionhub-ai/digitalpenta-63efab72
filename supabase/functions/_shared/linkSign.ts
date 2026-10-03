// HMAC signatures for links we put in emails, so only links we generated are honoured.
const enc = new TextEncoder();
let cached: CryptoKey | null = null;

async function key() {
  if (cached) return cached;
  const secret = Deno.env.get("EMAIL_LINK_SECRET");
  if (!secret) throw new Error("signing secret missing");
  cached = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return cached;
}

export async function signLink(payload: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(payload));
  return Array.from(new Uint8Array(sig)).slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyLink(payload: string, sig: string | null): Promise<boolean> {
  if (!sig || sig.length !== 32) return false;
  const expected = await signLink(payload);
  let diff = 0;
  for (let i = 0; i < 32; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
