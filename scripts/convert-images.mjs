import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/assets";
const targets = [
  "case-ecommerce.jpg","case-fintech.jpg","case-healthcare.jpg","case-proptech.jpg",
  "blog-ai.jpg","blog-automation.jpg","blog-seo.jpg",
  "hero-banner-graphic.jpg","about-banner-graphic.jpg",
];
for (const f of targets) {
  const src = join(DIR, f);
  const base = f.replace(/\.jpg$/, "");
  await sharp(src).webp({ quality: 78, effort: 6 }).toFile(join(DIR, `${base}.webp`));
  await sharp(src).avif({ quality: 55, effort: 5 }).toFile(join(DIR, `${base}.avif`));
  console.log("ok", f);
}
