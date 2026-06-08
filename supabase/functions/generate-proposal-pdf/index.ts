// Generate Proposal PDF from public Proposal Builder wizard.
// Stores the PDF in the `documents` storage bucket and creates a draft
// quotation row so admin can review/send. Public endpoint (verify_jwt=false).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const BRAND = {
  ink: [15, 23, 42] as [number, number, number],
  primary: [99, 102, 241] as [number, number, number],
  muted: [110, 116, 134] as [number, number, number],
  bg: [248, 250, 252] as [number, number, number],
};

// per-cold-start rate limit
const RL = new Map<string, { count: number; reset: number }>();
function checkRate(ip: string, max = 6, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const b = RL.get(ip);
  if (!b || now > b.reset) { RL.set(ip, { count: 1, reset: now + windowMs }); return true; }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

interface ProposalBody {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  goal: string;
  services: string[];        // ["SEO", "Google Ads", ...]
  budget_range: string;      // "50k-1L" | ...
  timeline: string;          // "asap" | "30d" | "90d"
  website?: string;
  notes?: string;
}

// Heuristic pricing for the auto-generated quote (INR / month).
const BASE_PRICES: Record<string, { name: string; price: number }> = {
  seo:           { name: "SEO Retainer",                 price: 45000 },
  "google-ads":  { name: "Google Ads Management",        price: 40000 },
  social:        { name: "Social Media Management",      price: 35000 },
  content:       { name: "Content Marketing",            price: 30000 },
  "web-dev":     { name: "Web Development (one-off)",    price: 150000 },
  ai:            { name: "AI Automation & Workflows",    price: 60000 },
  whatsapp:      { name: "WhatsApp Marketing Suite",     price: 25000 },
  pr:            { name: "Digital PR & Outreach",        price: 50000 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anon";
    if (!checkRate(ip)) {
      return new Response(JSON.stringify({ error: "Too many proposals — try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as ProposalBody;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body?.name || !body?.email || !emailRegex.test(body.email) || !body.goal || !Array.isArray(body.services) || body.services.length === 0) {
      return new Response(JSON.stringify({ error: "name, email, goal and at least one service are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Build line items
    const items = body.services
      .map((s) => BASE_PRICES[s])
      .filter(Boolean)
      .map((p) => ({ description: p.name, quantity: 1, unit_price: p.price }));
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const tax_rate = 18;
    const tax_amount = subtotal * (tax_rate / 100);
    const total = subtotal + tax_amount;

    // ── Generate PDF ──
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    let y = 56;

    doc.setFillColor(...BRAND.ink);
    doc.rect(0, 0, W, 120, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Digital Penta", 48, 56);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Growth Proposal", 48, 78);
    doc.text(new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }), W - 48, 56, { align: "right" });
    doc.text(`Ref: PRO-${Date.now().toString().slice(-8)}`, W - 48, 78, { align: "right" });

    y = 160;
    doc.setTextColor(...BRAND.ink);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Prepared for ${body.name}`, 48, y);
    y += 18;
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.muted);
    doc.setFont("helvetica", "normal");
    if (body.company) doc.text(body.company, 48, y), y += 14;
    doc.text(body.email, 48, y); y += 14;
    if (body.phone) doc.text(body.phone, 48, y), y += 14;
    if (body.website) doc.text(body.website, 48, y), y += 14;

    y += 16;
    doc.setTextColor(...BRAND.ink);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Your goal", 48, y); y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const goalLines = doc.splitTextToSize(body.goal, W - 96);
    doc.text(goalLines, 48, y); y += goalLines.length * 14 + 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Recommended scope", 48, y); y += 20;

    // Table header
    doc.setFillColor(...BRAND.bg);
    doc.rect(48, y - 14, W - 96, 22, "F");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.muted);
    doc.text("SERVICE", 56, y);
    doc.text("MONTHLY", W - 56, y, { align: "right" });
    y += 16;

    doc.setTextColor(...BRAND.ink);
    doc.setFont("helvetica", "normal");
    items.forEach((it) => {
      doc.text(it.description, 56, y);
      doc.text(`₹${it.unit_price.toLocaleString("en-IN")}`, W - 56, y, { align: "right" });
      y += 18;
    });

    y += 6;
    doc.setDrawColor(220, 220, 230);
    doc.line(48, y, W - 48, y); y += 18;

    doc.setFontSize(10);
    doc.setTextColor(...BRAND.muted);
    doc.text("Subtotal", W - 160, y);
    doc.setTextColor(...BRAND.ink);
    doc.text(`₹${subtotal.toLocaleString("en-IN")}`, W - 56, y, { align: "right" }); y += 14;
    doc.setTextColor(...BRAND.muted);
    doc.text(`GST (${tax_rate}%)`, W - 160, y);
    doc.setTextColor(...BRAND.ink);
    doc.text(`₹${tax_amount.toLocaleString("en-IN")}`, W - 56, y, { align: "right" }); y += 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...BRAND.primary);
    doc.text("Estimated Total", W - 160, y);
    doc.text(`₹${total.toLocaleString("en-IN")} / mo`, W - 56, y, { align: "right" });
    y += 28;

    doc.setTextColor(...BRAND.muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Indicative pricing — final scope and pricing depend on a 30-minute discovery call.",
      48, y,
    ); y += 24;

    doc.setFontSize(10);
    doc.setTextColor(...BRAND.ink);
    doc.setFont("helvetica", "bold");
    doc.text("Next steps", 48, y); y += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BRAND.muted);
    [
      "1. Book a free 30-min strategy call: digitalpenta.com/book-a-call",
      "2. We share a custom roadmap + competitive teardown",
      "3. Kick-off within 7 days of signed SOW",
    ].forEach((line) => { doc.text(line, 48, y); y += 14; });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.muted);
    doc.text("Digital Penta · Delhi · digitalpenta.com · +91 88601 00039", W / 2, doc.internal.pageSize.getHeight() - 28, { align: "center" });

    const pdfBytes = doc.output("arraybuffer");
    const fileName = `proposals/${Date.now()}-${body.email.replace(/[^a-z0-9]/gi, "_")}.pdf`;

    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(fileName, new Uint8Array(pdfBytes), {
        contentType: "application/pdf",
        upsert: false,
      });
    if (upErr) throw upErr;

    const { data: signed } = await supabase.storage
      .from("documents")
      .createSignedUrl(fileName, 60 * 60 * 24 * 30);

    // Create draft quotation row
    const { data: quote, error: qErr } = await supabase
      .from("quotations")
      .insert({
        client_name: body.name,
        client_email: body.email,
        items,
        subtotal,
        tax_rate,
        tax_amount,
        total,
        currency: "INR",
        status: "draft",
        quote_number: "DRAFT",
        notes: `From public Proposal Builder\nGoal: ${body.goal}\nBudget: ${body.budget_range}\nTimeline: ${body.timeline}${body.notes ? "\n\nNotes: " + body.notes : ""}`,
        pdf_url: signed?.signedUrl ?? null,
        source: "proposal_builder",
      })
      .select("id, quote_number")
      .single();
    if (qErr) throw qErr;

    // Create contact for CRM
    await supabase.from("contacts").insert({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      company: body.company ?? null,
      service: body.services.join(", "),
      budget_range: body.budget_range,
      urgency: body.timeline === "asap" ? "urgent" : body.timeline === "30d" ? "high" : "medium",
      message: body.goal + (body.notes ? "\n" + body.notes : ""),
      source: "Proposal Builder",
      status: "new",
    });

    return new Response(
      JSON.stringify({
        success: true,
        pdf_url: signed?.signedUrl ?? null,
        quote_id: quote?.id,
        quote_number: quote?.quote_number,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-proposal-pdf error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
