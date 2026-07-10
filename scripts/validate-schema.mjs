#!/usr/bin/env node
// Build-time schema validator. Reads src/components/seo/SEOHead.tsx and
// verifies the JSON-LD helpers produce required fields for Organization,
// LocalBusiness, Service and CEO Person. Fails the build on errors.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "..", "src/components/seo/SEOHead.tsx"), "utf8");

const checks = [
  ["organizationSchema helper", /export function organizationSchema/],
  ["Organization @id anchor", /#organization/],
  ["Organization sameAs profiles", /sameAs:\s*SOCIAL_PROFILES/],
  ["Organization founder link", /founder:\s*\{[^}]*#harish-kumar/],
  ["localBusinessSchema helper", /export function localBusinessSchema/],
  ["LocalBusiness telephone", /telephone:\s*(data\.phone|"[+\d-]+")/],
  ["LocalBusiness address", /address:\s*\{[\s\S]{0,400}PostalAddress/],
  ["serviceSchema helper", /export function serviceSchema/],
  ["Service provider link", /provider:\s*\{[\s\S]{0,200}(name|@id)/],
  ["ceoPersonSchema helper", /export function ceoPersonSchema/],
  ["CEO @id anchor", /#harish-kumar/],
];

const errors = checks.filter(([, re]) => !re.test(src)).map(([label]) => label);

if (errors.length) {
  console.error("❌ Schema validation failed:");
  for (const e of errors) console.error("  •", e);
  process.exit(1);
}
console.log("✅ Schema validation passed —", checks.length, "checks");
