import { Check, X, AlertTriangle, FileText, Image, Link2, ShieldCheck, Search, Globe } from "lucide-react";

interface OnPageData {
  reachable?: boolean;
  status_code?: number;
  page_size_kb?: number;
  meta?: {
    title?: string | null;
    title_length?: number;
    meta_description?: string | null;
    meta_description_length?: number;
    canonical?: string | null;
    viewport?: string | null;
    lang?: string | null;
    favicon?: boolean;
  };
  social?: {
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_card?: string | null;
  };
  headings?: { h1_count?: number; h1_samples?: string[]; h2_count?: number };
  content?: {
    word_count?: number;
    images_total?: number;
    images_without_alt?: number;
    internal_links?: number;
    external_links?: number;
    nofollow_links?: number;
    structured_data_blocks?: number;
  };
  technical?: {
    robots_txt?: boolean;
    sitemap_xml?: boolean;
    https?: boolean;
    hsts?: boolean;
    x_frame_options?: boolean;
    x_content_type_options?: boolean;
    content_security_policy?: boolean;
    referrer_policy?: boolean;
    permissions_policy?: boolean;
  };
}

function statusFor(ok: boolean | undefined, warn = false) {
  if (ok) return { Icon: Check, cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  if (warn) return { Icon: AlertTriangle, cls: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
  return { Icon: X, cls: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
}

function CheckRow({ label, ok, value, warn }: { label: string; ok?: boolean; value?: string | number; warn?: boolean }) {
  const { Icon, cls } = statusFor(ok, warn);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/10 py-2.5 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${cls}`}>
          <Icon className="h-3 w-3" />
        </span>
        <span className="truncate text-sm text-foreground/90">{label}</span>
      </div>
      {value !== undefined && (
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{value}</span>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children, score }: { title: string; icon: any; children: React.ReactNode; score?: number }) {
  return (
    <div className="rounded-2xl border border-border/30 bg-gradient-to-b from-card to-card/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/15 p-1.5 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <h4 className="font-display text-sm font-semibold text-foreground">{title}</h4>
        </div>
        {typeof score === "number" && (
          <span className="text-[11px] font-medium text-muted-foreground tabular-nums">{score}/100</span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function OnPageChecks({ data }: { data: OnPageData }) {
  if (!data?.reachable) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300">
        We could not crawl this page directly (status {data?.status_code ?? "?"}). On-page checks are skipped.
      </div>
    );
  }

  const m = data.meta ?? {};
  const s = data.social ?? {};
  const h = data.headings ?? {};
  const c = data.content ?? {};
  const t = data.technical ?? {};

  const titleOk = !!m.title && (m.title_length ?? 0) >= 30 && (m.title_length ?? 0) <= 65;
  const titleWarn = !!m.title && !titleOk;
  const descOk = !!m.meta_description && (m.meta_description_length ?? 0) >= 70 && (m.meta_description_length ?? 0) <= 160;
  const descWarn = !!m.meta_description && !descOk;
  const h1Ok = (h.h1_count ?? 0) === 1;
  const h1Warn = (h.h1_count ?? 0) > 1;
  const altOk = (c.images_without_alt ?? 0) === 0;
  const altWarn = (c.images_without_alt ?? 0) > 0 && (c.images_without_alt ?? 0) <= 3;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Meta & Indexing */}
      <Section title="Meta tags & indexing" icon={Search}>
        <CheckRow label={`Title tag${m.title ? ` · ${m.title_length} chars` : ""}`} ok={titleOk} warn={titleWarn} value={m.title?.slice(0, 40) ?? "Missing"} />
        <CheckRow label={`Meta description${m.meta_description ? ` · ${m.meta_description_length} chars` : ""}`} ok={descOk} warn={descWarn} />
        <CheckRow label="Canonical URL" ok={!!m.canonical} />
        <CheckRow label="Viewport tag (mobile)" ok={!!m.viewport} />
        <CheckRow label="Language attribute" ok={!!m.lang} value={m.lang ?? undefined} />
        <CheckRow label="Favicon" ok={!!m.favicon} />
      </Section>

      {/* Headings & content */}
      <Section title="Content & structure" icon={FileText}>
        <CheckRow label={`H1 tags · ${h.h1_count ?? 0}`} ok={h1Ok} warn={h1Warn} />
        <CheckRow label={`H2 tags · ${h.h2_count ?? 0}`} ok={(h.h2_count ?? 0) > 0} />
        <CheckRow label={`Word count · ${c.word_count ?? 0} words`} ok={(c.word_count ?? 0) >= 300} warn={(c.word_count ?? 0) >= 100} />
        <CheckRow label={`Structured data · ${c.structured_data_blocks ?? 0} block(s)`} ok={(c.structured_data_blocks ?? 0) > 0} />
        <CheckRow label="Page size" ok={(data.page_size_kb ?? 0) < 1500} warn={(data.page_size_kb ?? 0) < 3000} value={`${data.page_size_kb ?? 0} KB`} />
      </Section>

      {/* Images & links */}
      <Section title="Images & links" icon={Image}>
        <CheckRow label={`Images · ${c.images_total ?? 0} total`} ok={altOk} warn={altWarn} value={altOk ? "All have alt" : `${c.images_without_alt ?? 0} missing alt`} />
        <CheckRow label={`Internal links · ${c.internal_links ?? 0}`} ok={(c.internal_links ?? 0) >= 3} warn={(c.internal_links ?? 0) > 0} />
        <CheckRow label={`External links · ${c.external_links ?? 0}`} ok={true} />
        <CheckRow label={`Nofollow links · ${c.nofollow_links ?? 0}`} ok={true} />
      </Section>

      {/* Social */}
      <Section title="Social sharing" icon={Globe}>
        <CheckRow label="Open Graph title" ok={!!s.og_title} />
        <CheckRow label="Open Graph description" ok={!!s.og_description} />
        <CheckRow label="Open Graph image" ok={!!s.og_image} />
        <CheckRow label="Twitter card" ok={!!s.twitter_card} value={s.twitter_card ?? undefined} />
      </Section>

      {/* Technical SEO */}
      <Section title="Technical SEO" icon={Link2}>
        <CheckRow label="robots.txt present" ok={!!t.robots_txt} />
        <CheckRow label="sitemap.xml present" ok={!!t.sitemap_xml} />
        <CheckRow label="HTTPS enabled" ok={!!t.https} />
      </Section>

      {/* Security headers */}
      <Section title="Security headers" icon={ShieldCheck}>
        <CheckRow label="HSTS (Strict-Transport-Security)" ok={!!t.hsts} />
        <CheckRow label="X-Frame-Options" ok={!!t.x_frame_options} />
        <CheckRow label="X-Content-Type-Options" ok={!!t.x_content_type_options} />
        <CheckRow label="Content-Security-Policy" ok={!!t.content_security_policy} />
        <CheckRow label="Referrer-Policy" ok={!!t.referrer_policy} />
        <CheckRow label="Permissions-Policy" ok={!!t.permissions_policy} />
      </Section>
    </div>
  );
}
