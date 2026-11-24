import { describe, expect, it } from "vitest";
import {
  describeLeadSource,
  isTrackedVisit,
  leadSourceRows,
  parseLeadSourceCookie,
  sanitizeLeadSource,
  serializeLeadSource,
} from "@/lib/lead-source";

describe("sanitizeLeadSource", () => {
  it("keeps known fields and drops unknown ones", () => {
    expect(
      sanitizeLeadSource({ utm_source: "facebook", utm_medium: "paid_social", evil: "<script>", landing_page: "/audit" })
    ).toEqual({ utm_source: "facebook", utm_medium: "paid_social", landing_page: "/audit" });
  });

  it("strips non-printable characters and trims to length", () => {
    const source = sanitizeLeadSource({ utm_campaign: `  fall\u0000\r\n sale${"x".repeat(200)} ` });
    expect(source?.utm_campaign?.startsWith("fall sale")).toBe(true);
    expect(source?.utm_campaign).toHaveLength(120);
  });

  it("keeps a click id only with a known type", () => {
    expect(sanitizeLeadSource({ click_id_type: "gclid", click_id: "abc" })).toEqual({ click_id_type: "gclid", click_id: "abc" });
    expect(sanitizeLeadSource({ click_id_type: "made_up", click_id: "abc" })).toBeNull();
    expect(sanitizeLeadSource({ click_id_type: "gclid" })).toBeNull();
  });

  it.each([null, undefined, "string", 42, {}, { utm_source: "   " }, { utm_source: 5 }])("returns null for %j", (input) => {
    expect(sanitizeLeadSource(input)).toBeNull();
  });
});

describe("cookie round trip", () => {
  it("serializes and parses back to the same source", () => {
    const source = { utm_source: "google", utm_campaign: "spark & print", click_id_type: "gclid" as const, click_id: "Cj0K" };
    expect(parseLeadSourceCookie(serializeLeadSource(source))).toEqual(source);
  });

  it.each([undefined, null, "", "%E0%A4%A", "not-json", encodeURIComponent("[1,2]")])("returns null for %j", (value) => {
    expect(parseLeadSourceCookie(value)).toBeNull();
  });
});

describe("isTrackedVisit", () => {
  it("counts campaign tags, click ids and referrers, not a bare landing page", () => {
    expect(isTrackedVisit({ utm_source: "x" })).toBe(true);
    expect(isTrackedVisit({ click_id_type: "fbclid", click_id: "1" })).toBe(true);
    expect(isTrackedVisit({ referrer: "www.facebook.com" })).toBe(true);
    expect(isTrackedVisit({ landing_page: "/" })).toBe(false);
  });
});

describe("describeLeadSource", () => {
  it("describes campaigns, ad clicks and landing pages", () => {
    expect(
      describeLeadSource({
        utm_source: "facebook",
        utm_medium: "paid_social",
        utm_campaign: "no-website-oct",
        click_id_type: "fbclid",
        click_id: "x",
        landing_page: "/go/spark",
      })
    ).toBe("facebook / paid_social / no-website-oct (Facebook / Instagram ad click) landed on /go/spark");
  });

  it("describes referrals, direct visits and unknown sources", () => {
    expect(describeLeadSource({ referrer: "www.bing.com" })).toBe("Referral from www.bing.com");
    expect(describeLeadSource({ landing_page: "/" })).toBe("Direct or search (no campaign tags) landed on /");
    expect(describeLeadSource(null)).toMatch(/^Unknown/);
  });
});

describe("leadSourceRows", () => {
  it("lists only the fields that are set", () => {
    expect(leadSourceRows({ utm_source: "google", click_id_type: "gclid", click_id: "abc" })).toEqual([
      ["Source", "google"],
      ["Click ID", "gclid: abc"],
    ]);
    expect(leadSourceRows(undefined)).toEqual([]);
  });
});
