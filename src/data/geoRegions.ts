/**
 * ISO 3166-2 region codes per city page — used for geo.region / geo.placename
 * meta tags, which help search engines resolve a page to a physical area for
 * city-name and IP/region-based local queries.
 */
export const CITY_GEO_REGION: Record<string, string> = {
  delhi: "IN-DL",
  mumbai: "IN-MH",
  bangalore: "IN-KA",
  pune: "IN-MH",
  hyderabad: "IN-TG",
  noida: "IN-UP",
  gurgaon: "IN-HR",
  lucknow: "IN-UP",
  jaipur: "IN-RJ",
  kota: "IN-RJ",
  dubai: "AE-DU",
  "abu-dhabi": "AE-AZ",
  riyadh: "SA-01",
  doha: "QA-DA",
  bahrain: "BH-13",
};

export const COUNTRY_FALLBACK_REGION: Record<string, string> = {
  India: "IN",
  UAE: "AE",
  "Saudi Arabia": "SA",
  Qatar: "QA",
  Bahrain: "BH",
};

export function getGeoRegion(slug: string, country: string): string {
  return CITY_GEO_REGION[slug] ?? COUNTRY_FALLBACK_REGION[country] ?? "IN";
}
