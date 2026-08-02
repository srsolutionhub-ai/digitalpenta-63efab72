#!/usr/bin/env node
/**
 * Internal link crawl pass (SEO).
 *
 * SPA routes can't be crawled with plain HTTP, so this does a static crawl of
 * the source: it collects every internal link target rendered anywhere in
 * `src/` (`to="/…"`, `href="/…"`, and template literals like `/${svc}/${city}`
 * resolved via the sitemap), then diffs against public/sitemap.xml.
 *
 * Reports:
 *   • ORPHANS  — URLs in the sitemap with no internal link pointing at them
 *                (Google discovers them but assigns almost no authority)
 *   • BROKEN   — internal links pointing at URLs that aren't in the sitemap
 *
 * Usage: node scripts/crawl-internal-links.mjs [--strict]
 *        --strict exits 1 when city/location pages are orphaned.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const STRICT = process.argv.includes("--strict");

// ── sitemap URLs ────────────────────────────────────────────────────────
const sitemapPath = path.join(ROOT, "public/sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.error("✗ public/sitemap.xml missing — run `npm run build:sitemap` first.");
  process.exit(1);
}
const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
const sitemapPaths = [...sitemapXml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)]
  .map((m) => m[1] || "/");

// ── internal links found in source ──────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(tsx?|ts)$/.test(entry.name)) out.push(p);
  }
  return out;
}

const files = walk(path.join(ROOT, "src"));
const linked = new Set();
const dynamicPatterns = [];

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/(?:to|href)=(?:"|'|\{")(\/[^"'`{}\s]*)(?:"|')/g)) {
    linked.add(m[1].split("#")[0].replace(/\/$/, "") || "/");
  }
  // Template-literal routes: `/${x}/${y}` or `/locations/${slug}`
  for (const m of src.matchAll(/(?:to|href)=\{`(\/[^`]*)`\}/g)) {
    const tpl = m[1];
    const rx = new RegExp(
      "^" + tpl.replace(/\$\{[^}]+\}/g, "[^/]+").replace(/\//g, "\\/") + "$",
    );
    dynamicPatterns.push(rx);
  }
}

function isLinked(p) {
  const norm = p.replace(/\/$/, "") || "/";
  if (linked.has(norm)) return true;
  return dynamicPatterns.some((rx) => rx.test(norm));
}

const orphans = sitemapPaths.filter((p) => !isLinked(p));
const sitemapSet = new Set(sitemapPaths.map((p) => p.replace(/\/$/, "") || "/"));
const broken = [...linked].filter(
  (p) => !sitemapSet.has(p) && !/^\/(dashboard|auth|login|unsubscribe|ar\b)/.test(p) && p !== "/",
);

const cityOrphans = orphans.filter((p) => /^\/(locations|seo|ppc|social-media|web-development|ai-solutions|digital-marketing)\//.test(p));

console.log(`Internal link crawl — ${sitemapPaths.length} sitemap URLs, ${linked.size} static + ${dynamicPatterns.length} dynamic link patterns`);
console.log(`  orphans: ${orphans.length} (city/service: ${cityOrphans.length})`);
console.log(`  links not in sitemap: ${broken.length}`);

if (orphans.length) {
  console.log("\nORPHANS (no internal link):");
  orphans.slice(0, 40).forEach((p) => console.log("  • " + p));
  if (orphans.length > 40) console.log(`  … +${orphans.length - 40} more`);
}
if (broken.length) {
  console.log("\nLINKED BUT NOT IN SITEMAP:");
  broken.slice(0, 40).forEach((p) => console.log("  • " + p));
}

if (STRICT && cityOrphans.length) {
  console.error(`\n✗ ${cityOrphans.length} city/service pages are orphaned.`);
  process.exit(1);
}
console.log("\n✓ crawl pass complete");
