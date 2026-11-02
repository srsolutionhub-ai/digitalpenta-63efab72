import { describe, expect, it } from "vitest";
import { CITY_DEPTH_BATCH2, CITY_PAGES_BATCH2 } from "@/data/cityDepthBatch2";
import { CITY_REGISTRY } from "@/data/cityRegistry";
import { getCityDepth } from "@/data/cityDepth";
import { getAllLocations, getLocationData } from "@/data/locationData";

describe("Batch 2 city coverage integrity", () => {
  it("adds all 48 distinct planned city records", () => {
    expect(CITY_PAGES_BATCH2).toHaveLength(48);
    expect(new Set(CITY_PAGES_BATCH2.map((c) => c.slug)).size).toBe(48);
  });

  it("connects each published city to its registry and editorial record", () => {
    for (const city of CITY_PAGES_BATCH2) {
      expect(CITY_REGISTRY.some((entry) => entry.slug === city.slug)).toBe(true);
      expect(getLocationData(city.slug)?.slug).toBe(city.slug);
      expect(getCityDepth(city.slug)?.marketNotes).toEqual(
        CITY_DEPTH_BATCH2.find((entry) => entry.slug === city.slug)?.marketNotes,
      );
    }
  });

  it("keeps public location slugs unique", () => {
    const locations = getAllLocations();
    expect(new Set(locations.map((city) => city.slug)).size).toBe(locations.length);
    expect(locations).toHaveLength(87);
  });

  it("does not invent city testimonials or auction prices", () => {
    for (const city of CITY_PAGES_BATCH2) {
      expect(getLocationData(city.slug)?.testimonial).toBeUndefined();
      expect(getCityDepth(city.slug)?.budgets).toEqual([]);
    }
  });
});