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

function scoreColor(s: number | null | undefined): [number, number, number] {
  if (s == null) return [120, 120, 120];
  if (s >= 90) return [16, 185, 129];
  if (s >= 50) return [245, 158, 11];
  return [239, 68, 68];
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

    // Update audit with visitor info
    await supabase
      .from("audits")
      .update({ visitor_name: name, visitor_email: email, contact_id: contact?.id ?? null })
      .eq("id", audit_id);

    // Build PDF
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 50;

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 80, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Digital Penta", 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("SEO & Performance Audit Report", 40, 60);
    y = 110;

    doc.setTextColor(20, 20, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Report for: ${audit.url}`, 40, y);
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 110);
    doc.text(`Prepared for ${name} (${email})`, 40, y);
    y += 14;
    doc.text(`Generated ${new Date(audit.created_at).toLocaleString()}`, 40, y);
    y += 30;

    // Scores grid
    doc.setTextColor(20, 20, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Lighthouse Scores", 40, y);
    y += 18;

    const cats = [
      { label: "Performance", v: audit.performance_score },
      { label: "SEO", v: audit.seo_score },
      { label: "Accessibility", v: audit.accessibility_score },
      { label: "Best Practices", v: audit.best_practices_score },
    ];
    const colW = (pageW - 80) / 4;
    cats.forEach((c, i) => {
      const x = 40 + i * colW;
      const [r, g, b] = scoreColor(c.v);
      doc.setFillColor(r, g, b);
      doc.roundedRect(x, y, colW - 10, 60, 6, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(String(c.v ?? "—"), x + (colW - 10) / 2, y + 28, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(c.label, x + (colW - 10) / 2, y + 48, { align: "center" });
    });
    y += 90;

    // Recommendations
    const recs = (audit.ai_recommendations as any[]) ?? [];
    doc.setTextColor(20, 20, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`AI Recommendations (${recs.length})`, 40, y);
    y += 16;

    recs.slice(0, 12).forEach((r: any, idx: number) => {
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 30);
      const headerLine = `${idx + 1}. [${(r.priority || "").toUpperCase()}] ${r.title}`;
      const wrapped = doc.splitTextToSize(headerLine, pageW - 80);
      doc.text(wrapped, 40, y);
      y += wrapped.length * 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(90, 90, 100);
      doc.text(`${r.category} · ${r.estimated_effort}`, 40, y);
      y += 12;

      doc.setTextColor(40, 40, 50);
      doc.setFontSize(10);
      const impact = doc.splitTextToSize(`Impact: ${r.impact}`, pageW - 80);
      doc.text(impact, 40, y);
      y += impact.length * 12 + 4;

      (r.fix_steps ?? []).forEach((step: string, si: number) => {
        const text = doc.splitTextToSize(`  ${si + 1}. ${step}`, pageW - 90);
        if (y + text.length * 12 > 760) {
          doc.addPage();
          y = 50;
        }
        doc.text(text, 50, y);
        y += text.length * 12;
      });
      y += 14;
    });

    // CTA footer page
    doc.addPage();
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageW, 842, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("Ready to fix these issues?", pageW / 2, 280, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Book a free 30-minute strategy call with our SEO experts.", pageW / 2, 320, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("digitalpenta.com/contact", pageW / 2, 380, { align: "center" });
    doc.text("+91 88601 00039  ·  support@digitalpenta.com", pageW / 2, 410, { align: "center" });

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

    // Notify all super_admins
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

    // Create CRM deal
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
