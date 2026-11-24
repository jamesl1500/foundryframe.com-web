import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ throttleHit: vi.fn(), sendMetaEvent: vi.fn(), enabled: { value: true } }));

vi.mock("@/lib/server/request-guard", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/server/request-guard")>()),
  throttleHit: mocks.throttleHit,
}));
vi.mock("@/lib/server/meta-capi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/server/meta-capi")>()),
  get metaCapiEnabled() {
    return mocks.enabled.value;
  },
  sendMetaEvent: mocks.sendMetaEvent,
}));

const { POST } = await import("@/app/api/track/route");

const track = (body: unknown, headers: Record<string, string> = { origin: "https://www.foundryframe.com" }) =>
  POST(new Request("https://www.foundryframe.com/api/track", { method: "POST", headers, body: JSON.stringify(body) }));

beforeEach(() => {
  mocks.enabled.value = true;
  mocks.throttleHit.mockReset().mockResolvedValue(true);
  mocks.sendMetaEvent.mockReset().mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("POST /api/track", () => {
  it("is a no-op when Meta CAPI is off", async () => {
    mocks.enabled.value = false;
    expect((await track({ eventName: "Schedule", eventId: "abcdefgh" })).status).toBe(204);
    expect(mocks.sendMetaEvent).not.toHaveBeenCalled();
  });

  it("forwards click events", async () => {
    expect((await track({ eventName: "Schedule", eventId: "abcdefgh" })).status).toBe(204);
    expect(mocks.sendMetaEvent.mock.calls[0][1]).toEqual({ eventName: "Schedule", eventId: "abcdefgh", contentName: "booking" });
    await track({ eventName: "Contact", eventId: "abcdefgh" });
    expect(mocks.sendMetaEvent.mock.calls[1][1].contentName).toBe("call");
  });

  it("refuses Lead events, which only form routes may send", async () => {
    expect((await track({ eventName: "Lead", eventId: "abcdefgh" })).status).toBe(400);
  });

  it("refuses bad event ids and cross-site requests", async () => {
    expect((await track({ eventName: "Schedule", eventId: "x" })).status).toBe(400);
    expect((await track({ eventName: "Schedule", eventId: "abcdefgh" }, { origin: "https://evil.example" })).status).toBe(403);
  });

  it("rate limits and fails closed", async () => {
    mocks.throttleHit.mockResolvedValueOnce(false);
    expect((await track({ eventName: "Schedule", eventId: "abcdefgh" })).status).toBe(429);
    mocks.throttleHit.mockResolvedValueOnce(null);
    expect((await track({ eventName: "Schedule", eventId: "abcdefgh" })).status).toBe(429);
    expect(mocks.sendMetaEvent).not.toHaveBeenCalled();
  });
});
