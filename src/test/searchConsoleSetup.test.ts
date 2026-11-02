import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Search Console setup", () => {
  it("preserves the uploaded Google FILE challenge", () => {
    expect(readFileSync("public/googlee387c17a4c641b6c.html", "utf8").trim()).toBe(
      "google-site-verification: googlee387c17a4c641b6c.html",
    );
  });

  it("submits only URLs on the active published origin", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((url) => new URL(url).origin === "https://digitalpenta.app")).toBe(true);
    expect(urls).toContain("https://digitalpenta.app/");
  });
});