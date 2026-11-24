// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadAnalytics(adTracking: boolean) {
  vi.resetModules();
  vi.stubEnv("AD_TRACKING_ENABLED", adTracking ? "true" : "false");
  return import("@/lib/analytics");
}

const gtag = vi.fn();
const fbq = vi.fn();
const fetchMock = vi.fn();

beforeEach(() => {
  gtag.mockReset();
  fbq.mockReset();
  fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 204 }));
  window.gtag = gtag;
  window.fbq = fbq;
  vi.stubGlobal("fetch", fetchMock);
});

describe("trackEvent", () => {
  it("sends GA4 events with the page path", async () => {
    const { trackEvent } = await loadAnalytics(false);
    trackEvent("cta_click", { label: "audit" });
    expect(gtag).toHaveBeenCalledWith("event", "cta_click", { page_path: "/", label: "audit" });
  });

  it("does nothing before gtag loads", async () => {
    const { trackEvent } = await loadAnalytics(false);
    window.gtag = undefined;
    expect(() => trackEvent("x")).not.toThrow();
  });
});

describe("newConversionId", () => {
  it("returns ids the server's event id check accepts", async () => {
    const { newConversionId } = await loadAnalytics(false);
    const { parseEventId } = await import("@/lib/server/meta-capi");
    const id = newConversionId();
    expect(parseEventId(id)).toBe(id);
    expect(newConversionId()).not.toBe(id);
  });
});

describe("trackConversion", () => {
  it("only reports GA4 when ad tracking is off (local and preview builds)", async () => {
    const { trackConversion } = await loadAnalytics(false);
    trackConversion("contact", { eventId: "evt-12345678" });
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag.mock.calls[0][1]).toBe("generate_lead");
    expect(fbq).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends Google Ads and Meta copies that share the event id in production", async () => {
    const { trackConversion } = await loadAnalytics(true);
    trackConversion("package_builder", { eventId: "evt-12345678", value: 3500 });

    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", expect.objectContaining({ method: "package_builder", value: 3500, currency: "USD" }));
    const adsCall = gtag.mock.calls.find(([, name]) => name === "conversion");
    expect(adsCall?.[2]).toMatchObject({ transaction_id: "evt-12345678", value: 3500 });
    expect(adsCall?.[2].send_to).toMatch(/^AW-\d+\/.+/);
    expect(fbq).toHaveBeenCalledWith("track", "Lead", { content_name: "package_builder", value: 3500, currency: "USD" }, { eventID: "evt-12345678" });
  });

  it("leaves form leads' Conversions API copy to the server", async () => {
    const { trackConversion } = await loadAnalytics(true);
    trackConversion("audit", { eventId: "evt-12345678" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards click conversions to /api/track with keepalive", async () => {
    const { trackConversion } = await loadAnalytics(true);
    trackConversion("booking");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/track");
    expect(init.keepalive).toBe(true);
    const body = JSON.parse(init.body);
    expect(body.eventName).toBe("Schedule");
    expect(fbq.mock.calls[0][3].eventID).toBe(body.eventId);
  });

  it("never throws when tracking fails", async () => {
    const { trackConversion } = await loadAnalytics(true);
    fetchMock.mockRejectedValue(new Error("blocked by an ad blocker"));
    expect(() => trackConversion("call")).not.toThrow();
  });
});
