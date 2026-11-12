import { describe, expect, it } from "vitest";
import { organizationSchema, serviceSchema, webPageSchema } from "@/components/seo/SEOHead";

describe("primary site identity", () => {
  it("uses digitalpenta.app for the organization and service provider", () => {
    expect(organizationSchema().url).toBe("https://digitalpenta.app");
    expect(organizationSchema()["@id"]).toBe("https://digitalpenta.app/#organization");
    expect(serviceSchema({ name: "SEO", description: "SEO services", url: "https://digitalpenta.app/services/digital-marketing/seo" }).provider.url).toBe("https://digitalpenta.app");
  });

  it("ties page entities to the primary site's website", () => {
    expect(webPageSchema({ url: "https://digitalpenta.app/", name: "Digital Penta", description: "Delhi agency" }).isPartOf.url).toBe("https://digitalpenta.app/");
  });
});