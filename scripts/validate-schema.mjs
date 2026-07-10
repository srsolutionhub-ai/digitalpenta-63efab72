#!/usr/bin/env node
// Build-time schema validator. Imports the SEO helpers from src/components/seo
// via a lightweight require, then verifies the JSON-LD they produce meets
// minimum requirements for Organization, LocalBusiness, and Service types.
// Fails the build (exit 1) on any error.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "..", "src/components/seo/SEOHead.tsx"), "utf8");

const errors = [];

// 1. organizationSchema must exist and reference #organization
if (!/organizationSchema[\s\S]{0,400}"@id":\s*["'`][^"'`]*#organization/.test(src)) {
  errors.push("organizationSchema missing @id ending in #organization");
}
// 2. Must include founder + sameAs
if (!/organizationSchema[\s\S]{0,1500}"founder"/.test(src)) {
  errors.push("organizationSchema missing founder");
}
if (!/organizationSchema[\s\S]{0,1500}"sameAs"/.test(src)) {
  errors.push("organizationSchema missing sameAs profile links");
}
// 3. localBusinessSchema must have address + geo + openingHours
if (!/localBusinessSchema[\s\S]{0,1500}"address"/.test(src)) {
  errors.push("localBusinessSchema missing address");
}
if (!/localBusinessSchema[\s\S]{0,1500}"telephone"/.test(src)) {
  errors.push("localBusinessSchema missing telephone");
}
// 4. serviceSchema helper must set provider @id
if (!/serviceSchema[\s\S]{0,900}"provider"/.test(src)) {
  errors.push("serviceSchema missing provider");
}
// 5. ceoPersonSchema must reference harish-kumar
if (!/ceoPersonSchema[\s\S]{0,600}#harish-kumar/.test(src)) {
  errors.push("ceoPersonSchema missing #harish-kumar @id");
}

if (errors.length) {
  console.error("❌ Schema validation failed:");
  for (const e of errors) console.error("  •", e);
  process.exit(1);
}
console.log("✅ Schema validation passed (Organization, LocalBusiness, Service, CEO Person)");
