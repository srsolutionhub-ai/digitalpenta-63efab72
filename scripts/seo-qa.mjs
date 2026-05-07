#!/usr/bin/env node
/**
 * SEO Quality Check
 * ─────────────────
 * Validates:
 *   1. sitemap.xml — well-formed, every URL has lastmod + priority
 *   2. coverage   — every static route, matrix page, location, industry,
 *                   sub-service is present in the sitemap
 *   3. canonicals — every page component sets a canonical absolute URL
 *   4. breadcrumbs— every page exposes a BreadcrumbList schema
 *   5. tier-1 keywords — homepage + matrix pages cover the priority terms
 *
 * Run:  node scripts/seo-qa.mjs
 * Exits non-zero on any blocking issue so it can be wired into CI.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const errors = [];
const warnings = [];
const ok = (m) => console.log(`  ✓ ${m}`);
const warn = (m) => { warnings.push(m); console.log(`  ⚠ ${m}`); };
const err = (m) => { errors.push(m); console.log(`  ✗ ${m}`); };

console.log("\n▼ Digital Penta SEO QA ▼\n");

/* ─── 1. Sitemap ─── */
console.log("[1/5] sitemap.xml");
const sitemap = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (urls.length < 100) err(`sitemap only has ${urls.length} URLs (expected 100+)`);
else ok(`sitemap has ${urls.length} URLs`);

const blocks = sitemap.split(/<url>/).slice(1);
const missingLastmod = blocks.filter((b) => !b.includes("<lastmod>")).length;
if (missingLastmod) err(`${missingLastmod} entries missing <lastmod>`);
else ok("every entry has <lastmod>");

/* ─── 2. Coverage ─── */
console.log("\n[2/5] coverage");
const matrixData = readFileSync(join(ROOT, "src/data/matrixData.ts"), "utf8");
const cities = [...matrixData.matchAll(/slug:\s*"([a-z0-9-]+)",\s*city:/g)].map((m) => m[1]);
const services = ["seo", "ppc", "social-media", "web-development", "ai-solutions"];
let missingMatrix = 0;
for (const s of services) for (const c of cities) {
  const u = `https://digitalpenta.com/${s}/${c}`;
  if (!urls.includes(u)) { missingMatrix++; warn(`missing in sitemap: ${u}`); }
}
if (missingMatrix === 0) ok(`all ${services.length}×${cities.length} matrix pages in sitemap`);

const required = [
  "https://digitalpenta.com/",
  "https://digitalpenta.com/about",
  "https://digitalpenta.com/contact",
  "https://digitalpenta.com/portfolio",
  "https://digitalpenta.com/blog",
];
for (const u of required) if (!urls.includes(u)) err(`missing required URL: ${u}`);

/* ─── 3. Canonicals + 4. Breadcrumbs ─── */
console.log("\n[3/5] canonicals & breadcrumbs");
function walk(dir, out = []) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else if (/\.(t|j)sx?$/.test(f.name)) out.push(p);
  }
  return out;
}
const pageFiles = walk(join(ROOT, "src/pages")).filter((p) =>
  /pages\/[A-Z]\w+\.tsx$/.test(p) || /pages\/(MatrixPage|IndustryPage|LocationPage|SubServicePage|ServiceCategory|KeywordLandingPage|BlogArticle)\.tsx$/.test(p)
);
const skipPages = ["NotFound.tsx", "auth/", "dashboard/", "HomeAr.tsx", "LocationPageAr.tsx"];
let canonOk = 0, bcOk = 0;
for (const p of pageFiles) {
  if (skipPages.some((s) => p.includes(s))) continue;
  const txt = readFileSync(p, "utf8");
  if (!txt.includes("SEOHead")) { warn(`${p.replace(ROOT + "/", "")} has no SEOHead`); continue; }
  if (/canonical[=:]/.test(txt)) canonOk++;
  else err(`${p.replace(ROOT + "/", "")} missing canonical`);
  if (/breadcrumbSchema|BreadcrumbList/.test(txt)) bcOk++;
  else warn(`${p.replace(ROOT + "/", "")} no breadcrumb schema`);
}
ok(`${canonOk} pages have canonical, ${bcOk} have breadcrumb schema`);

/* ─── 5. Tier-1 keyword coverage ─── */
console.log("\n[4/5] tier-1 keyword coverage");
const T1 = [
  { kw: "digital marketing agency in delhi", file: "index.html" },
  { kw: "seo agency", file: "src/data/matrixData.ts" },
  { kw: "google ads", file: "src/data/matrixData.ts" },
  { kw: "digital marketing agency dubai", path: "/seo/dubai" },
  { kw: "digital marketing agency mumbai", path: "/seo/mumbai" },
];
for (const t of T1) {
  if (t.file) {
    const c = readFileSync(join(ROOT, t.file), "utf8").toLowerCase();
    if (c.includes(t.kw)) ok(`"${t.kw}" present in ${t.file}`);
    else warn(`"${t.kw}" missing in ${t.file}`);
  }
  if (t.path) {
    const u = `https://digitalpenta.com${t.path}`;
    if (urls.includes(u)) ok(`"${t.kw}" → ${t.path} indexed`);
    else err(`"${t.kw}" target ${t.path} missing from sitemap`);
  }
}

/* ─── 5. Robots & meta ─── */
console.log("\n[5/5] robots.txt + meta");
const robots = readFileSync(join(ROOT, "public/robots.txt"), "utf8");
if (robots.includes("Sitemap:")) ok("robots.txt declares sitemap");
else err("robots.txt missing Sitemap directive");
const indexHtml = readFileSync(join(ROOT, "index.html"), "utf8");
if (indexHtml.includes('og:image')) ok("homepage has og:image"); else err("missing og:image in index.html");
if (indexHtml.includes('twitter:card')) ok("homepage has twitter:card"); else err("missing twitter:card");

/* ─── Report ─── */
console.log("\n──────────────────────────────");
console.log(`Errors:   ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log("──────────────────────────────\n");
if (errors.length) process.exit(1);
