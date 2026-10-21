/**
 * Per-section access control for the admin dashboard.
 *
 * super_admin and account_manager can open every admin page.
 * Other staff roles are limited to the sections their job needs:
 *   finance         → Finance, Invoices, Quotations
 *   content_writer  → Blog, Newsletter, Email Sequences, Email Log, Voice Studio
 *   seo_specialist  → SEO Audits, SEO Ranks, Funnel, Audience, AI Tool Leads
 * Every staff member can open the dashboard home and Settings.
 *
 * This is a UX layer — the database RLS policies remain the real enforcement.
 */

const FULL_ACCESS_ROLES = new Set(["super_admin", "account_manager"]);

/** Path prefixes (relative to /dashboard/admin) each limited role may open. */
const ROLE_SECTIONS: Record<string, string[]> = {
  finance: ["billing", "invoices", "quotations"],
  content_writer: ["blog", "newsletter", "sequences", "email-log", "voice-studio"],
  seo_specialist: ["audits", "seo-ranks", "funnel", "audience", "tool-runs"],
};

/** Sections every staff role can open. */
const STAFF_COMMON = ["", "settings"];

export function canAccessAdminPath(role: string | null | undefined, pathname: string): boolean {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.has(role)) return true;

  // Normalise: "/dashboard/admin/audits/123" → "audits/123"
  const rel = pathname.replace(/^\/dashboard\/admin\/?/, "");
  const allowed = [...STAFF_COMMON, ...(ROLE_SECTIONS[role] ?? [])];
  return allowed.some((p) => (p === "" ? rel === "" : rel === p || rel.startsWith(p + "/")));
}

/** Filter a nav item list down to what the role may open. */
export function filterNavByRole<T extends { path: string }>(role: string | null | undefined, items: T[]): T[] {
  return items.filter((i) => canAccessAdminPath(role, i.path));
}
