#!/usr/bin/env node
// Fails the build when the JS a first-time visitor downloads on the homepage
// (entry script + modulepreloaded chunks) exceeds the gzipped budget.
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BUDGET_KB = Number(process.env.JS_BUDGET_KB ?? 200);
const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const htmlPath = join(dist, "index.html");
if (!existsSync(htmlPath)) {
  console.error("❌ dist/index.html not found — run vite build first.");
  process.exit(1);
}
const html = readFileSync(htmlPath, "utf8");
const files = new Set(
  [...html.matchAll(/(?:src|href)="\/?(assets\/[^"]+\.js)"/g)].map((m) => m[1]),
);
let total = 0;
const rows = [];
for (const f of files) {
  const kb = gzipSync(readFileSync(join(dist, f))).length / 1024;
  total += kb;
  rows.push([f, kb.toFixed(1)]);
}
rows.sort((a, b) => b[1] - a[1]).forEach(([f, kb]) => console.log(`  ${kb.padStart(7)} KB  ${f}`));
console.log(`Initial JS: ${total.toFixed(1)} KB gz (budget ${BUDGET_KB} KB)`);
if (total > BUDGET_KB) {
  console.error(`❌ JS budget exceeded by ${(total - BUDGET_KB).toFixed(1)} KB`);
  process.exit(1);
}
console.log("✅ Bundle budget OK");
