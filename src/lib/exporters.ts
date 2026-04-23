// Lightweight client-side exporters for finance tooling.
// CSV: zero-dep stringify with quoting; PDF: dynamic import of jspdf to keep
// the main bundle slim — finance team rarely needs both at once.

type Row = Record<string, string | number | null | undefined>;

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function downloadCSV(filename: string, rows: Row[], headers?: string[]) {
  if (rows.length === 0) {
    rows = [{ note: "No data" }];
  }
  const cols = headers ?? Object.keys(rows[0]);
  const lines = [
    cols.map(csvEscape).join(","),
    ...rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

export async function downloadPDF(
  filename: string,
  title: string,
  rows: Row[],
  headers?: string[],
  meta?: { subtitle?: string; footer?: string }
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Brand header
  doc.setFillColor(20, 20, 32);
  doc.rect(0, 0, pageWidth, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Digital Penta", 40, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(new Date().toLocaleDateString("en-IN", { dateStyle: "long" }), pageWidth - 40, 38, { align: "right" });

  // Title
  doc.setTextColor(20, 20, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, 40, 95);
  if (meta?.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110, 110, 130);
    doc.text(meta.subtitle, 40, 112);
  }

  // Table
  const cols = headers ?? (rows[0] ? Object.keys(rows[0]) : []);
  const startY = 140;
  const colWidth = (pageWidth - 80) / Math.max(cols.length, 1);
  let y = startY;

  // Header row
  doc.setFillColor(245, 245, 250);
  doc.rect(40, y - 14, pageWidth - 80, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 80);
  cols.forEach((c, i) => {
    doc.text(String(c).toUpperCase(), 48 + i * colWidth, y);
  });
  y += 18;

  // Rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 50);
  rows.forEach((r) => {
    if (y > 760) {
      doc.addPage();
      y = 60;
    }
    cols.forEach((c, i) => {
      const val = r[c] === null || r[c] === undefined ? "—" : String(r[c]);
      doc.text(val.length > 28 ? val.slice(0, 27) + "…" : val, 48 + i * colWidth, y);
    });
    y += 16;
  });

  // Footer
  if (meta?.footer) {
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 160);
    doc.text(meta.footer, 40, 820);
  }

  doc.save(filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
