import { describe, expect, it } from "vitest";
import { countEditorialWords, meetsCityPageDepth, repeatedEditorialParagraphs } from "@/lib/cityEditorialQuality";
import kanpur from "@/data/cityArticles/kanpur.md?raw";
import varanasi from "@/data/cityArticles/varanasi.md?raw";

describe("City editorial integrity", () => {
  it("requires the requested minimum of 3,000 page words", () => {
    expect(meetsCityPageDepth(Array(2999).fill("business").join(" "))).toBe(false);
    expect(meetsCityPageDepth(Array(3000).fill("business").join(" "))).toBe(true);
  });

  it("detects repeated substantial paragraphs", () => {
    const paragraph = Array(35).fill("A buyer needs approved product information").join(" ");
    expect(repeatedEditorialParagraphs([paragraph, paragraph.toUpperCase()])).toHaveLength(1);
  });

  it("does not repeat full paragraphs between the two pilot guides", () => {
    expect(repeatedEditorialParagraphs([kanpur, varanasi])).toEqual([]);
    expect(meetsCityPageDepth(kanpur)).toBe(true);
    expect(meetsCityPageDepth(varanasi)).toBe(true);
  });
});