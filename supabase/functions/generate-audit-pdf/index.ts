import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Brand palette (RGB)
const BRAND = {
  ink: [15, 23, 42] as [number, number, number],
  primary: [99, 102, 241] as [number, number, number],
  accent: [217, 70, 239] as [number, number, number],
  muted: [110, 116, 134] as [number, number, number],
  pass: [16, 185, 129] as [number, number, number],
  warn: [245, 158, 11] as [number, number, number],
  fail: [239, 68, 68] as [number, number, number],
  bgLight: [248, 250, 252] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
};

function scoreColor(s: number | null | undefined): [number, number, number] {
  if (s == null) return BRAND.muted;
  if (s >= 90) return BRAND.pass;
  if (s >= 50) return BRAND.warn;
  return BRAND.fail;
}

function cwvVerdict(metric: string, value: number | undefined): "pass" | "warn" | "fail" | "—" {
  if (value === undefined || value === null || isNaN(value)) return "—";
  switch (metric) {
    case "lcp_ms": return value <= 2500 ? "pass" : value <= 4000 ? "warn" : "fail";
    case "fcp_ms": return value <= 1800 ? "pass" : value <= 3000 ? "warn" : "fail";
    case "tbt_ms": return value <= 200 ? "pass" : value <= 600 ? "warn" : "fail";
    case "cls": return value <= 0.1 ? "pass" : value <= 0.25 ? "warn" : "fail";
    case "inp_ms": return value <= 200 ? "pass" : value <= 500 ? "warn" : "fail";
    case "ttfb_ms": return value <= 800 ? "pass" : value <= 1800 ? "warn" : "fail";
    default: return "—";
  }
}

function fmt(metric: string, v: any): string {
  if (v === undefined || v === null || isNaN(v)) return "—";
  if (metric === "cls") return Number(v).toFixed(3);
  return `${Math.round(v).toLocaleString()} ms`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { audit_id, name, email } = await req.json();
    if (!audit_id || !email || !name) {
      return new Response(JSON.stringify({ error: "audit_id, name, email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: audit, error: aErr } = await supabase
      .from("audits")
      .select("*")
      .eq("id", audit_id)
      .single();
    if (aErr || !audit) throw new Error("Audit not found");

    const { data: runs } = await supabase
      .from("audit_lighthouse_runs")
      .select("*")
      .eq("audit_id", audit_id);
    const mobileRun = runs?.find((r: any) => r.device === "mobile");
    const desktopRun = runs?.find((r: any) => r.device === "desktop");

    // Create / update contact
    const { data: contact } = await supabase
      .from("contacts")
      .insert({
        name,
        email,
        message: `Requested SEO audit PDF for ${audit.url}`,
        service: "SEO Services",
        source: "SEO Audit Tool",
      })
      .select()
      .single();

    await supabase
      .from("audits")
      .update({ visitor_name: name, visitor_email: email, contact_id: contact?.id ?? null })
      .eq("id", audit_id);

    const onPage = (audit.on_page_checks ?? {}) as any;
    const verification = onPage.verification ?? null;
    const recs = ((audit.ai_recommendations as any[]) ?? []) as any[];

    // ── Build PDF ─────────────────────────────
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    let y = 0;

    const ensureSpace = (need: number) => {
      if (y + need > pageH - 60) {
        addFooter();
        doc.addPage();
        y = 50;
      }
    };

    const addFooter = () => {
      const pageCount = doc.getNumberOfPages();
      const pageNum = doc.getCurrentPageInfo().pageNumber;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...BRAND.muted);
      doc.text(`Digital Penta · digitalpenta.com  ·  Page ${pageNum} of ${pageCount}`, pageW / 2, pageH - 20, { align: "center" });
    };

    const sectionTitle = (title: string, subtitle?: string) => {
      ensureSpace(60);
      doc.setFillColor(...BRAND.primary);
      doc.rect(margin, y, 4, 18, "F");
      doc.setTextColor(...BRAND.ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, margin + 12, y + 14);
      y += 22;
      if (subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...BRAND.muted);
        doc.text(subtitle, margin + 12, y);
        y += 14;
      }
      y += 6;
    };

    // ── Cover header ──
    doc.setFillColor(...BRAND.ink);
    doc.rect(0, 0, pageW, 110, "F");
    // accent strip
    doc.setFillColor(...BRAND.primary);
    doc.rect(0, 100, pageW, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Digital Penta", margin, 44);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Advanced SEO & Performance Audit", margin, 64);
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 230);
    doc.text(new Date(audit.created_at).toLocaleString(), pageW - margin, 44, { align: "right" });
    doc.text("Powered by Google Lighthouse + AI", pageW - margin, 60, { align: "right" });

    y = 140;
    doc.setTextColor(...BRAND.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const titleLines = doc.splitTextToSize(`Report for ${audit.url}`, pageW - margin * 2);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 22 + 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.muted);
    doc.text(`Prepared for: ${name}  ·  ${email}`, margin, y);
    y += 22;

    // ── Overall scorecard ──
    sectionTitle("Lighthouse scorecard", "Mobile-first scoring · Higher is better");
    const cats = [
      { label: "Performance", v: audit.performance_score },
      { label: "SEO", v: audit.seo_score },
      { label: "Accessibility", v: audit.accessibility_score },
      { label: "Best Practices", v: audit.best_practices_score },
    ];
    const colW = (pageW - margin * 2) / 4;
    cats.forEach((c, i) => {
      const x = margin + i * colW;
      const [r, g, b] = scoreColor(c.v);
      doc.setFillColor(r, g, b);
      doc.roundedRect(x + 4, y, colW - 8, 70, 8, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text(String(c.v ?? "—"), x + colW / 2, y + 36, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(c.label, x + colW / 2, y + 56, { align: "center" });
    });
    y += 90;

    // ── Core Web Vitals comparison ──
    sectionTitle("Core Web Vitals", "Mobile vs Desktop · Google's user-experience metrics");
    const cwvRows = [
      { key: "lcp_ms", name: "LCP — Largest Contentful Paint", target: "≤ 2.5s" },
      { key: "fcp_ms", name: "FCP — First Contentful Paint", target: "≤ 1.8s" },
      { key: "cls", name: "CLS — Cumulative Layout Shift", target: "≤ 0.1" },
      { key: "tbt_ms", name: "TBT — Total Blocking Time", target: "≤ 200ms" },
      { key: "inp_ms", name: "INP — Interaction to Next Paint", target: "≤ 200ms" },
      { key: "ttfb_ms", name: "TTFB — Time To First Byte", target: "≤ 800ms" },
    ];
    // Header row
    const cwvCols = [margin, margin + 230, margin + 320, margin + 400, margin + 480];
    doc.setFillColor(...BRAND.bgLight);
    doc.rect(margin, y, pageW - margin * 2, 20, "F");
    doc.setTextColor(...BRAND.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    ["Metric", "Target", "Mobile", "Desktop", "Verdict"].forEach((h, i) => {
      doc.text(h.toUpperCase(), cwvCols[i] + 6, y + 13);
    });
    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    cwvRows.forEach((row, idx) => {
      ensureSpace(22);
      if (idx % 2 === 0) {
        doc.setFillColor(252, 252, 254);
        doc.rect(margin, y - 2, pageW - margin * 2, 20, "F");
      }
      doc.setTextColor(...BRAND.ink);
      doc.text(row.name, cwvCols[0] + 6, y + 12);
      doc.setTextColor(...BRAND.muted);
      doc.text(row.target, cwvCols[1] + 6, y + 12);
      const mv = mobileRun?.[row.key];
      const dv = desktopRun?.[row.key];
      doc.setTextColor(...BRAND.ink);
      doc.text(fmt(row.key, mv), cwvCols[2] + 6, y + 12);
      doc.text(fmt(row.key, dv), cwvCols[3] + 6, y + 12);
      const v = cwvVerdict(row.key, mv);
      const [r, g, b] = v === "pass" ? BRAND.pass : v === "warn" ? BRAND.warn : v === "fail" ? BRAND.fail : BRAND.muted;
      doc.setFillColor(r, g, b);
      doc.roundedRect(cwvCols[4] + 4, y, 50, 16, 4, 4, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(v.toUpperCase(), cwvCols[4] + 29, y + 11, { align: "center" });
      doc.setFont("helvetica", "normal");
      y += 22;
    });
    y += 10;

    // ── Verification cross-check ──
    if (verification?.checks?.length) {
      sectionTitle("Verification — cross-checked badges", `Trust score ${verification.trust_score ?? 0}% · Each pass/fail confirmed against multiple sources`);
      const checks = verification.checks as any[];
      const cellW = (pageW - margin * 2) / 2;
      const startX = margin;
      let cy = y;
      checks.forEach((c, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = startX + col * cellW;
        const ry = cy + row * 30;
        ensureSpace(34);
        const verdictColor = c.verdict === "pass" ? BRAND.pass : c.verdict === "warn" ? BRAND.warn : c.verdict === "fail" ? BRAND.fail : BRAND.muted;
        doc.setDrawColor(...BRAND.border);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(cx + 2, ry, cellW - 6, 26, 4, 4, "FD");
        doc.setFillColor(...verdictColor);
        doc.roundedRect(cx + 6, ry + 6, 14, 14, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        const sym = c.verdict === "pass" ? "✓" : c.verdict === "fail" ? "✗" : c.verdict === "warn" ? "!" : "?";
        doc.text(sym, cx + 13, ry + 16, { align: "center" });
        doc.setTextColor(...BRAND.ink);
        doc.setFontSize(9.5);
        doc.text(c.label, cx + 26, ry + 13);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...BRAND.muted);
        const detail = (c.detail ? `${c.detail} · ` : "") + (c.sources?.length ? `${c.sources.length} source${c.sources.length > 1 ? "s" : ""}` : "no data");
        doc.text(detail.slice(0, 50), cx + 26, ry + 22);
      });
      y = cy + Math.ceil(checks.length / 2) * 30 + 8;
    }

    // ── On-page checks grid ──
    doc.addPage();
    y = 50;
    sectionTitle("On-page SEO & technical checks", "Live crawl results · Direct fetch from your site");
    const groups: { title: string; rows: { label: string; ok: boolean | undefined; warn?: boolean; value?: string }[] }[] = [
      {
        title: "Meta & indexing",
        rows: [
          { label: "Title tag", ok: !!onPage.meta?.title && (onPage.meta?.title_length ?? 0) >= 30 && (onPage.meta?.title_length ?? 0) <= 65, warn: !!onPage.meta?.title, value: onPage.meta?.title_length ? `${onPage.meta.title_length} chars` : "Missing" },
          { label: "Meta description", ok: !!onPage.meta?.meta_description && (onPage.meta?.meta_description_length ?? 0) >= 70 && (onPage.meta?.meta_description_length ?? 0) <= 160, warn: !!onPage.meta?.meta_description, value: onPage.meta?.meta_description_length ? `${onPage.meta.meta_description_length} chars` : "Missing" },
          { label: "Canonical URL", ok: !!onPage.meta?.canonical },
          { label: "Viewport (mobile)", ok: !!onPage.meta?.viewport },
          { label: "HTML lang", ok: !!onPage.meta?.lang, value: onPage.meta?.lang ?? "—" },
          { label: "Favicon", ok: !!onPage.meta?.favicon },
        ],
      },
      {
        title: "Content & structure",
        rows: [
          { label: "H1 tag", ok: (onPage.headings?.h1_count ?? 0) === 1, warn: (onPage.headings?.h1_count ?? 0) > 1, value: `${onPage.headings?.h1_count ?? 0} found` },
          { label: "H2 tags", ok: (onPage.headings?.h2_count ?? 0) > 0, value: `${onPage.headings?.h2_count ?? 0}` },
          { label: "Word count", ok: (onPage.content?.word_count ?? 0) >= 300, warn: (onPage.content?.word_count ?? 0) >= 100, value: `${onPage.content?.word_count ?? 0}` },
          { label: "Structured data", ok: (onPage.content?.structured_data_blocks ?? 0) > 0, value: `${onPage.content?.structured_data_blocks ?? 0} block(s)` },
          { label: "Page weight", ok: (onPage.page_size_kb ?? 0) < 1500, warn: (onPage.page_size_kb ?? 0) < 3000, value: `${onPage.page_size_kb ?? 0} KB` },
        ],
      },
      {
        title: "Images & links",
        rows: [
          { label: "Image alts", ok: (onPage.content?.images_without_alt ?? 0) === 0, warn: (onPage.content?.images_without_alt ?? 0) <= 3, value: `${onPage.content?.images_without_alt ?? 0} missing` },
          { label: "Internal links", ok: (onPage.content?.internal_links ?? 0) >= 3, value: `${onPage.content?.internal_links ?? 0}` },
          { label: "External links", ok: true, value: `${onPage.content?.external_links ?? 0}` },
          { label: "Open Graph image", ok: !!onPage.social?.og_image },
          { label: "Twitter card", ok: !!onPage.social?.twitter_card },
        ],
      },
      {
        title: "Technical & security",
        rows: [
          { label: "HTTPS", ok: !!onPage.technical?.https },
          { label: "robots.txt", ok: !!onPage.technical?.robots_txt },
          { label: "sitemap.xml", ok: !!onPage.technical?.sitemap_xml },
          { label: "HSTS header", ok: !!onPage.technical?.hsts },
          { label: "X-Frame-Options", ok: !!onPage.technical?.x_frame_options },
          { label: "Content-Security-Policy", ok: !!onPage.technical?.content_security_policy },
        ],
      },
    ];
    const cardW = (pageW - margin * 2 - 12) / 2;
    let baseY = y;
    let leftY = baseY;
    let rightY = baseY;
    groups.forEach((g, gi) => {
      const isLeft = gi % 2 === 0;
      const cx = isLeft ? margin : margin + cardW + 12;
      let cy = isLeft ? leftY : rightY;
      const cardH = 36 + g.rows.length * 18;
      if (cy + cardH > pageH - 70) {
        doc.addPage();
        leftY = rightY = 50;
        cy = 50;
      }
      // Card
      doc.setDrawColor(...BRAND.border);
      doc.setFillColor(252, 252, 254);
      doc.roundedRect(cx, cy, cardW, cardH, 8, 8, "FD");
      doc.setTextColor(...BRAND.ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(g.title, cx + 12, cy + 18);
      doc.setDrawColor(...BRAND.border);
      doc.line(cx + 12, cy + 24, cx + cardW - 12, cy + 24);
      g.rows.forEach((row, ri) => {
        const ry = cy + 36 + ri * 18;
        const [r, gC, b] = row.ok ? BRAND.pass : row.warn ? BRAND.warn : BRAND.fail;
        doc.setFillColor(r, gC, b);
        doc.circle(cx + 18, ry - 4, 3.5, "F");
        doc.setTextColor(...BRAND.ink);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(row.label, cx + 28, ry);
        if (row.value) {
          doc.setTextColor(...BRAND.muted);
          doc.setFontSize(8);
          doc.text(row.value, cx + cardW - 12, ry, { align: "right" });
        }
      });
      if (isLeft) leftY = cy + cardH + 12;
      else rightY = cy + cardH + 12;
    });
    y = Math.max(leftY, rightY);

    // ── Prioritized action plan ──
    doc.addPage();
    y = 50;
    sectionTitle("Prioritized action plan", "AI-ranked fixes · Highest impact first");

    if (!recs.length) {
      doc.setTextColor(...BRAND.muted);
      doc.setFontSize(10);
      doc.text("AI recommendations are still processing. Please re-download in a minute or check the dashboard.", margin, y);
    } else {
      const sorted = [...recs].sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 } as Record<string, number>;
        return (order[(a.priority || "low").toLowerCase()] ?? 4) - (order[(b.priority || "low").toLowerCase()] ?? 4);
      });

      sorted.slice(0, 15).forEach((r: any, idx: number) => {
        const priority = (r.priority || "low").toLowerCase();
        const [pr, pg, pb] = priority === "critical" ? BRAND.fail : priority === "high" ? BRAND.fail : priority === "medium" ? BRAND.warn : BRAND.pass;
        const stepsText = (r.fix_steps ?? []).slice(0, 4).map((s: string, i: number) => `  ${i + 1}. ${s}`).join("\n");
        const wrappedTitle = doc.splitTextToSize(`${idx + 1}. ${r.title}`, pageW - margin * 2 - 80);
        const wrappedImpact = doc.splitTextToSize(`Impact: ${r.impact || "—"}`, pageW - margin * 2 - 24);
        const wrappedSteps = doc.splitTextToSize(stepsText || "  No steps provided.", pageW - margin * 2 - 24);
        const cardH = 30 + wrappedTitle.length * 14 + wrappedImpact.length * 12 + wrappedSteps.length * 12 + 18;
        ensureSpace(cardH + 12);

        // Card background
        doc.setDrawColor(...BRAND.border);
        doc.setFillColor(252, 252, 254);
        doc.roundedRect(margin, y, pageW - margin * 2, cardH, 8, 8, "FD");
        // Priority pill
        doc.setFillColor(pr, pg, pb);
        doc.roundedRect(pageW - margin - 76, y + 10, 64, 18, 4, 4, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(priority.toUpperCase(), pageW - margin - 44, y + 22, { align: "center" });

        doc.setTextColor(...BRAND.ink);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(wrappedTitle, margin + 12, y + 22);

        let cy = y + 22 + wrappedTitle.length * 14;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...BRAND.muted);
        doc.text(`${r.category || "general"}  ·  Effort: ${r.estimated_effort || "—"}  ·  Est. impact: ${r.estimated_impact || estImpact(r)}`, margin + 12, cy);
        cy += 14;

        doc.setTextColor(...BRAND.ink);
        doc.setFontSize(9.5);
        doc.text(wrappedImpact, margin + 12, cy);
        cy += wrappedImpact.length * 12 + 4;

        doc.setTextColor(...BRAND.ink);
        doc.setFontSize(9);
        doc.text(wrappedSteps, margin + 12, cy);
        y += cardH + 10;
      });
    }

    // ── CTA page ──
    addFooter();
    doc.addPage();
    doc.setFillColor(...BRAND.ink);
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setFillColor(...BRAND.primary);
    doc.rect(0, 0, pageW, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("Ready to fix these issues?", pageW / 2, 280, { align: "center" });
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 210, 230);
    doc.text("Book a free 30-minute strategy call. We'll walk through your top fixes,", pageW / 2, 320, { align: "center" });
    doc.text("expected impact and timeline.", pageW / 2, 338, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("digitalpenta.com/contact", pageW / 2, 400, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("+91 88601 00039  ·  support@digitalpenta.com", pageW / 2, 426, { align: "center" });
    addFooter();

    const pdfBytes = doc.output("arraybuffer");
    const filePath = `audits/${audit_id}.pdf`;

    const { error: upErr } = await supabase.storage
      .from("reports")
      .upload(filePath, new Uint8Array(pdfBytes), {
        contentType: "application/pdf",
        upsert: true,
      });
    if (upErr) throw upErr;

    const { data: signed } = await supabase.storage.from("reports").createSignedUrl(filePath, 60 * 60 * 24 * 7);

    await supabase.from("audits").update({ pdf_url: signed?.signedUrl ?? null }).eq("id", audit_id);

    // Notify admins
    const { data: admins } = await supabase
      .from("user_roles")
      .select("user_id")
      .in("role", ["super_admin", "account_manager"]);
    if (admins?.length) {
      await supabase.from("notifications").insert(
        admins.map((a: any) => ({
          user_id: a.user_id,
          title: "New SEO audit lead",
          body: `${name} (${email}) audited ${audit.url}`,
          type: "lead",
          link: `/dashboard/admin/audits/${audit_id}`,
          related_entity_type: "audit",
          related_entity_id: audit_id,
        }))
      );
    }

    // CRM deal
    const { data: newStage } = await supabase
      .from("crm_pipeline_stages")
      .select("id")
      .eq("name", "New")
      .single();
    if (newStage) {
      await supabase.from("crm_deals").insert({
        title: `SEO Audit Lead — ${audit.url}`,
        contact_id: contact?.id,
        stage_id: newStage.id,
        source: "SEO Audit Tool",
        service_interest: "SEO Services",
        audit_id,
        probability: 20,
      });
    }

    return new Response(
      JSON.stringify({ pdf_url: signed?.signedUrl, contact_id: contact?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-audit-pdf error", e);
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function estImpact(r: any): string {
  const p = (r.priority || "low").toLowerCase();
  if (p === "critical") return "Very high (+10–25 pts)";
  if (p === "high") return "High (+5–15 pts)";
  if (p === "medium") return "Medium (+2–8 pts)";
  return "Low (+1–3 pts)";
}
