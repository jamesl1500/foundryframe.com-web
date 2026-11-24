import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadCapi(enabled = true) {
  vi.resetModules();
  vi.stubEnv("AD_TRACKING_ENABLED", enabled ? "true" : "false");
  vi.stubEnv("META_PIXEL_CONVERSIONS_API", enabled ? "token-123" : "");
  vi.stubEnv("META_CAPI_ACCESS_TOKEN", "");
  vi.stubEnv("META_CAPI_TEST_EVENT_CODE", "");
  return import("@/lib/server/meta-capi");
}

const fetchMock = vi.fn();

function request(headers: Record<string, string> = {}) {
  return new Request("https://www.foundryframe.com/api/contact", {
    method: "POST",
    headers: {
      "x-forwarded-for": "203.0.113.9",
      "user-agent": "Mozilla/5.0",
      referer: "https://www.foundryframe.com/contact",
      cookie: "_fbp=fb.1.123; _fbc=fb.1.456.abc",
      ...headers,
    },
  });
}

function sentEvent() {
  const [url, init] = fetchMock.mock.calls[0];
  return { url: String(url), body: JSON.parse(init.body).data[0] };
}

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(new Response("{}", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("parseEventId", () => {
  it("accepts UUID-like ids only", async () => {
    const { parseEventId } = await loadCapi();
    expect(parseEventId("0b9f7c1e-3c55-4b8e-9f6a-2d1c3b4a5e6f")).toBe("0b9f7c1e-3c55-4b8e-9f6a-2d1c3b4a5e6f");
    expect(parseEventId("short")).toBeNull();
    expect(parseEventId("x".repeat(65))).toBeNull();
    expect(parseEventId("has spaces in it")).toBeNull();
    expect(parseEventId(12345678)).toBeNull();
  });
});

describe("sendMetaEvent", () => {
  it("does nothing when tracking is off", async () => {
    const { sendMetaEvent, metaCapiEnabled } = await loadCapi(false);
    expect(metaCapiEnabled).toBe(false);
    await sendMetaEvent(request(), { eventName: "Lead", eventId: "abcdefgh", contentName: "contact" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends hashed user data, browser ids and the event id", async () => {
    const { sendMetaEvent } = await loadCapi();
    await sendMetaEvent(request(), {
      eventName: "Lead",
      eventId: "abcdefgh-1234",
      contentName: "contact",
      email: "  Jane@Acme.Example ",
      name: "Jane Doe",
      value: 1500,
    });
    const { url, body } = sentEvent();
    expect(url).toMatch(/graph\.facebook\.com\/v\d+\.\d+\/\d+\/events\?access_token=token-123$/);
    expect(body).toMatchObject({
      event_name: "Lead",
      event_id: "abcdefgh-1234",
      action_source: "website",
      event_source_url: "https://www.foundryframe.com/contact",
      custom_data: { content_name: "contact", value: 1500, currency: "USD" },
    });
    expect(body.user_data.client_ip_address).toBe("203.0.113.9");
    expect(body.user_data.fbp).toBe("fb.1.123");
    expect(body.user_data.fbc).toBe("fb.1.456.abc");
    // SHA-256 of the normalized (trimmed, lowercased) values, never the raw ones.
    expect(body.user_data.em[0]).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(body)).not.toContain("jane@acme.example");
    expect(JSON.stringify(body)).not.toContain("Jane");
  });

  it("uses the site URL when the referer is another site", async () => {
    const { sendMetaEvent } = await loadCapi();
    await sendMetaEvent(request({ referer: "https://evil.example/" }), { eventName: "Contact", eventId: "abcdefgh", contentName: "call" });
    expect(sentEvent().body.event_source_url).toBe("https://www.foundryframe.com/");
  });

  it("drops negative or non-finite values", async () => {
    const { sendMetaEvent } = await loadCapi();
    await sendMetaEvent(request(), { eventName: "Lead", eventId: "abcdefgh", contentName: "x", value: -5 });
    expect(sentEvent().body.custom_data).toEqual({ content_name: "x" });
  });

  it("never throws when Meta is down", async () => {
    const { sendMetaEvent } = await loadCapi();
    fetchMock.mockRejectedValue(new Error("timeout"));
    await expect(sendMetaEvent(request(), { eventName: "Lead", eventId: "abcdefgh", contentName: "x" })).resolves.toBeUndefined();
  });
});

describe("sendMetaLead", () => {
  it("only sends with a valid conversion id from the form", async () => {
    const { sendMetaLead } = await loadCapi();
    await sendMetaLead(request(), { conversionId: "bad" }, { contentName: "contact" });
    expect(fetchMock).not.toHaveBeenCalled();
    await sendMetaLead(request(), { conversionId: "0b9f7c1e-3c55" }, { contentName: "contact" });
    expect(sentEvent().body).toMatchObject({ event_name: "Lead", event_id: "0b9f7c1e-3c55" });
  });
});
