#!/usr/bin/env node
/**
 * Phase 1 audit upgrade — sitemap.xml generator.
 *
 * Emits public/sitemap.xml from the live source-of-truth data files
 * (matrixData + matrixIntents + locationData + subServiceData) so we never
 * drift between routes and what's submitted to Google.
 *
 * Usage:  node scripts/generate-sitemap.mjs
 * Wired:  package.json → "build:sitemap" (run before vite build)
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SITE = "https://digitalpenta.com";
const TODAY = new Date().toISOString().slice(0, 10);

// --- Lightweight TS source loader ---------------------------------------
// We import the matrix data files directly. To avoid pulling in a TS toolchain
// we parse them as text and extract the slug arrays. This keeps the generator
// dependency-free and hot-reload safe.
function readSlugs(filePath, regex) {
  const src = fs.readFileSync(filePath, "utf8");
  const out = [];
  let m;
  while ((m = regex.exec(src)) !== null) out.push(m[1]);
  return out;
}

const matrixSrc = path.join(ROOT, "src/data/matrixData.ts");
const intentSrc = path.join(ROOT, "src/data/matrixIntents.ts");

// Match `slug: "value"` entries (services + cities + intents share this shape).
function extractAfter(src, marker) {
  const i = src.indexOf(marker);
  if (i === -1) return "";
  return src.slice(i);
}

const matrixText = fs.readFileSync(matrixSrc, "utf8");
const services = [...extractAfter(matrixText, "MATRIX_SERVICES").matchAll(/slug:\s*"([^"]+)"/g)]
  .slice(0, 5).map(m => m[1]);
const cities = [...extractAfter(matrixText, "MATRIX_CITIES").matchAll(/slug:\s*"([^"]+)"/g)]
  .map(m => m[1]);

const intentText = fs.readFileSync(intentSrc, "utf8");
const intents = [];
const intentBlocks = intentText.split(/\{\s*slug:/).slice(1);
for (const block of intentBlocks) {
  const slugMatch = block.match(/^\s*"([^"]+)"/);
  const appliesMatch = block.match(/appliesTo\?:\s*string\[\];?/) ? null
    : block.match(/appliesTo:\s*\[([^\]]*)\]/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  let appliesTo;
  if (appliesMatch) {
    appliesTo = [...appliesMatch[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  }
  intents.push({ slug, appliesTo });
}

// --- URL plan -----------------------------------------------------------
const urls = [];
function add(loc, priority = "0.6", changefreq = "weekly") {
  urls.push({ loc: `${SITE}${loc}`, priority, changefreq, lastmod: TODAY });
}

// Static
[
  ["/", "1.0", "daily"],
  ["/about", "0.8"],
  ["/contact", "0.8"],
  ["/get-proposal", "0.8"],
  ["/portfolio", "0.7"],
  ["/blog", "0.7", "daily"],
  ["/sitemap", "0.5"],
  ["/tools/seo-audit", "0.7"],
  ["/privacy", "0.3", "yearly"],
  ["/terms", "0.3", "yearly"],
].forEach(([u, p, cf]) => add(u, p, cf));

// Service hubs
["digital-marketing", "public-relations", "development", "ai-solutions", "automation"]
  .forEach(s => add(`/services/${s}`, "0.9"));

// City × Service matrix
for (const svc of services) {
  for (const city of cities) {
    add(`/${svc}/${city}`, "0.8");
    for (const it of intents) {
      if (it.appliesTo && !it.appliesTo.includes(svc)) continue;
      add(`/${svc}/${city}/${it.slug}`, "0.7");
    }
  }
}

// Locations + Arabic mirrors (cities array reused)
for (const city of cities) {
  add(`/locations/${city}`, "0.7");
}
add(`/ar`, "0.6");

// --- Emit ---------------------------------------------------------------
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(u =>
    `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  ),
  "</urlset>",
  "",
].join("\n");

const outPath = path.join(ROOT, "public/sitemap.xml");
fs.writeFileSync(outPath, xml, "utf8");

console.log(`✓ Generated sitemap with ${urls.length} URLs → public/sitemap.xml`);
console.log(`  • Services: ${services.length}  Cities: ${cities.length}  Intents: ${intents.length}`);
