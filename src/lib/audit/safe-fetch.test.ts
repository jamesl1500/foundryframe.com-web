import http from "node:http";
import type { AddressInfo } from "node:net";
import { BlockList } from "node:net";
import zlib from "node:zlib";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

/* DNS: "*.test.example" names resolve to whatever the test sets; anything
   else is a lookup failure, so no test touches the network. */
const dnsAnswers = new Map<string, { address: string; family: number }[]>();
vi.mock("node:dns", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:dns")>();
  const lookup = (hostname: string, options: unknown, callback: (...args: unknown[]) => void) => {
    const answers = dnsAnswers.get(hostname);
    if (!answers) {
      callback(Object.assign(new Error(`getaddrinfo ENOTFOUND ${hostname}`), { code: "ENOTFOUND" }));
      return;
    }
    callback(null, answers);
  };
  return { ...actual, lookup, default: { ...actual, lookup } };
});

const { assertFetchableUrl, safeFetch, UnsafeUrlError } = await import("@/lib/audit/safe-fetch");

describe("assertFetchableUrl", () => {
  it.each([
    "https://example.com/",
    "http://example.com/path?q=1",
    "https://www.example.co.uk:443/",
    "http://example.com:80/",
    "http://93.184.216.34/",
    "http://[2606:4700::1111]/",
  ])("allows %s", (url) => {
    expect(assertFetchableUrl(url)).toBeInstanceOf(URL);
  });

  it.each([
    ["not a url", /valid website address/],
    ["ftp://example.com/", /Only http and https/],
    ["file:///etc/passwd", /Only http and https/],
    ["javascript:alert(1)", /Only http and https/],
    ["https://user:pass@example.com/", /username or password/],
    ["https://example.com:8443/", /standard web ports/],
    ["http://example.com:22/", /standard web ports/],
    ["http://localhost/", /public website/],
    ["http://intranet/", /public website/],
    ["http://printer.local/", /public website/],
    ["http://app.localhost/", /public website/],
    ["http://db.internal/", /public website/],
    ["http://nas.home/", /public website/],
    ["http://localhost./", /public website/],
    ["http://app.internal./", /public website/],
  ])("rejects %s", (url, message) => {
    expect(() => assertFetchableUrl(url)).toThrow(UnsafeUrlError);
    expect(() => assertFetchableUrl(url)).toThrow(message);
  });

  it.each([
    "http://127.0.0.1/",
    "http://127.1/",
    "http://2130706433/", // 127.0.0.1 as a decimal integer
    "http://0x7f000001/",
    "http://0.0.0.0/",
    "http://10.0.0.5/",
    "http://172.16.0.1/",
    "http://172.31.255.255/",
    "http://192.168.1.1/",
    "http://169.254.169.254/latest/meta-data/", // cloud metadata
    "http://100.64.0.1/",
    "http://224.0.0.1/",
    "http://[::1]/",
    "http://[::]/",
    "http://[fd00::1]/",
    "http://[fe80::1]/",
    "http://[::ffff:127.0.0.1]/",
    "http://[::ffff:7f00:1]/", // the same, as WHATWG URL serializes it
    "http://[::ffff:a9fe:a9fe]/", // 169.254.169.254 mapped
    "http://[64:ff9b::a9fe:a9fe]/", // NAT64
  ])("blocks private or reserved address %s", (url) => {
    expect(() => assertFetchableUrl(url)).toThrow(UnsafeUrlError);
  });

  it("allows public addresses next to blocked ranges", () => {
    expect(() => assertFetchableUrl("http://172.32.0.1/")).not.toThrow();
    expect(() => assertFetchableUrl("http://11.0.0.1/")).not.toThrow();
    expect(() => assertFetchableUrl("http://[::ffff:8.8.8.8]/")).not.toThrow();
  });
});

describe("safeFetch", () => {
  let server: http.Server;
  let port = 0;
  let handler: http.RequestListener = (_req, res) => res.end("ok");

  /* The server listens on loopback, which the guard rightly blocks. Let
     127.0.0.1 through only for these tests; every other address still goes
     through the real blocklist. */
  let allowLoopback = true;
  const originalCheck = BlockList.prototype.check;

  beforeAll(async () => {
    server = http.createServer((req, res) => handler(req, res));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });

  const originalRequest = http.request;

  beforeEach(() => {
    allowLoopback = true;
    dnsAnswers.clear();
    dnsAnswers.set("site.test.example", [{ address: "127.0.0.1", family: 4 }]);
    vi.spyOn(BlockList.prototype, "check").mockImplementation(function (this: BlockList, address, type) {
      if (allowLoopback && address === "127.0.0.1") return false;
      return originalCheck.call(this, address as string, type);
    });
    /* The guard only allows ports 80/443, so send each request on to the
       test server's port; DNS (and so the guard) still sees the hostname. */
    vi.spyOn(http, "request").mockImplementation(((url: URL, options: http.RequestOptions, callback: () => void) => {
      const target = new URL(url);
      target.port = String(port);
      return originalRequest(target, options, callback);
    }) as typeof http.request);
  });

  const base = () => `http://site.test.example`;

  it("returns status, headers, body and timing", async () => {
    handler = (req, res) => {
      res.setHeader("Content-Type", "text/html");
      res.setHeader("X-Echo-UA", req.headers["user-agent"] ?? "");
      res.end("<h1>Hello</h1>");
    };
    const res = await safeFetch(`${base()}/`);
    expect(res.status).toBe(200);
    expect(res.body).toBe("<h1>Hello</h1>");
    expect(res.headers["content-type"]).toBe("text/html");
    expect(res.headers["x-echo-ua"]).toMatch(/FoundryFrameAudit/);
    expect(res.truncated).toBe(false);
    expect(res.redirectChain).toEqual([`${base()}/`]);
    expect(res.elapsedMs).toBeGreaterThanOrEqual(0);
  });

  it.each([
    ["gzip", zlib.gzipSync],
    ["deflate", zlib.deflateSync],
    ["br", zlib.brotliCompressSync],
  ] as const)("decodes %s bodies", async (encoding, compress) => {
    handler = (_req, res) => {
      res.setHeader("Content-Encoding", encoding);
      res.end(compress(Buffer.from("compressed body")));
    };
    expect((await safeFetch(`${base()}/`)).body).toBe("compressed body");
  });

  it("falls back to raw bytes when a body won't decompress", async () => {
    handler = (_req, res) => {
      res.setHeader("Content-Encoding", "gzip");
      res.end("not actually gzip");
    };
    expect((await safeFetch(`${base()}/`)).body).toBe("not actually gzip");
  });

  it("caps the body at maxBytes and marks it truncated", async () => {
    handler = (_req, res) => res.end("x".repeat(10_000));
    const res = await safeFetch(`${base()}/`, { maxBytes: 1000 });
    expect(res.truncated).toBe(true);
    expect(res.body).toHaveLength(1000);
  });

  it("follows redirects and records the chain", async () => {
    handler = (req, res) => {
      if (req.url === "/start") return res.writeHead(301, { Location: "/middle" }).end();
      if (req.url === "/middle") return res.writeHead(302, { Location: `${base()}/end` }).end();
      res.end("done");
    };
    const res = await safeFetch(`${base()}/start`);
    expect(res.body).toBe("done");
    expect(res.url).toBe(`${base()}/end`);
    expect(res.redirectChain).toEqual([`${base()}/start`, `${base()}/middle`, `${base()}/end`]);
  });

  it("gives up after maxRedirects", async () => {
    handler = (_req, res) => res.writeHead(302, { Location: "/loop" }).end();
    await expect(safeFetch(`${base()}/`, { maxRedirects: 2 })).rejects.toThrow(/redirected too many times/);
  });

  it("refuses a redirect to a private address", async () => {
    handler = (_req, res) => res.writeHead(302, { Location: "http://169.254.169.254/latest/meta-data/" }).end();
    await expect(safeFetch(`${base()}/`)).rejects.toThrow(UnsafeUrlError);
  });

  it("refuses a redirect to a non-http scheme or odd port", async () => {
    handler = (_req, res) => res.writeHead(302, { Location: "file:///etc/passwd" }).end();
    await expect(safeFetch(`${base()}/`)).rejects.toThrow(/Only http and https/);

    handler = (_req, res) => res.writeHead(302, { Location: "http://site.test.example:6379/" }).end();
    await expect(safeFetch(`${base()}/`)).rejects.toThrow(/standard web ports/);
  });

  it("returns a 3xx without a Location as-is", async () => {
    handler = (_req, res) => res.writeHead(304).end();
    expect((await safeFetch(`${base()}/`)).status).toBe(304);
  });

  it("refuses a hostname that resolves to a private address (checked at connect time)", async () => {
    allowLoopback = false;
    // A fresh name, so no kept-alive socket from an earlier test is reused.
    dnsAnswers.set("private.test.example", [{ address: "127.0.0.1", family: 4 }]);
    await expect(safeFetch("http://private.test.example/")).rejects.toThrow(/resolves to a private address/);
  });

  it("refuses when any resolved address is private (DNS rebinding with mixed answers)", async () => {
    dnsAnswers.set("mixed.test.example", [
      { address: "93.184.216.34", family: 4 },
      { address: "10.0.0.1", family: 4 },
    ]);
    await expect(safeFetch("http://mixed.test.example/")).rejects.toThrow(/private address/);
  });

  it("surfaces DNS failures with their error code", async () => {
    const error = await safeFetch("http://missing.test.example/").catch((e: unknown) => e);
    expect((error as NodeJS.ErrnoException).code).toBe("ENOTFOUND");
  });

  it("times out slow servers", async () => {
    handler = () => {
      /* never responds */
    };
    await expect(safeFetch(`${base()}/`, { timeoutMs: 150 })).rejects.toThrow(/took too long/);
  });
});
