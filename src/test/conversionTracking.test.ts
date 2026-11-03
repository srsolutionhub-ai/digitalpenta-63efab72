import { describe, it, expect, beforeEach } from "vitest";
import { trackConversion, META_EVENT } from "@/lib/events";

describe("conversion dataLayer contract", () => {
  beforeEach(() => { window.dataLayer = []; });

  it("pushes a unique event_id and Meta event name for each conversion", () => {
    trackConversion("generate_lead", { form: "contact" });
    trackConversion("generate_lead", { form: "contact" });
    const pushes = (window.dataLayer as Record<string, unknown>[]).filter((e) => e.event === "generate_lead");
    expect(pushes).toHaveLength(2);
    expect(pushes[0].meta_event_name).toBe("Lead");
    expect(pushes[0].event_id).not.toBe(pushes[1].event_id);
  });

  it("maps bookings to Schedule and newsletter to Subscribe", () => {
    expect(META_EVENT.book_call).toBe("Schedule");
    expect(META_EVENT.newsletter_signup).toBe("Subscribe");
  });
});
