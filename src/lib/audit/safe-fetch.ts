/**
 * Safe Fetch - Foundry Frame
 * ============================
 * Server-only HTTP GET for URLs typed in by visitors (the free audit).
 * Because the server makes the request, a hostile URL could otherwise
 * reach private addresses (cloud metadata, localhost, the VPC). So:
 *
 * - only http/https on the default ports, no credentials in the URL
 * - every hostname is resolved and checked inside the socket's own DNS
 *   lookup, so the address checked is the address connected to (no DNS
 *   rebinding between check and connect); IP literals are checked up front
 * - redirects are followed by hand, re-checking each hop
 * - bodies are capped in size and every request has a hard timeout
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import http from "node:http";
import https from "node:https";
import { BlockList, isIP, type LookupFunction } from "node:net";
import zlib from "node:zlib";

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

export type SafeResponse = {
  /** The URL that produced this response, after redirects. */
  url: string;
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
  /** True when the body hit maxBytes and was cut off. */
  truncated: boolean;
  /** Every URL visited, starting with the one requested. */
  redirectChain: string[];
  elapsedMs: number;
};

type SafeFetchOptions = {
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
};

const USER_AGENT =
  "Mozilla/5.0 (compatible; FoundryFrameAudit/1.0; +https://www.foundryframe.com/audit)";

const blocked = new BlockList();
// IPv4: "this network", private, CGNAT, loopback, link-local (cloud
// metadata), IETF/test/benchmark ranges, multicast and reserved.
for (const [net, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blocked.addSubnet(net, prefix, "ipv4");
}
// IPv6: unspecified, loopback, NAT64, discard, documentation, unique-local,
// link-local, multicast. IPv4-mapped addresses (::ffff:a.b.c.d) need no
// rule here: BlockList checks them against the IPv4 rules above, and a
// ::ffff:0:0/96 rule would match every IPv4 address.
for (const [net, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96],
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["2001:db8::", 32],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
] as const) {
  blocked.addSubnet(net, prefix, "ipv6");
}

function isBlockedAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return blocked.check(address, "ipv4");
  if (family === 6) {
    // Check the embedded IPv4 of ::ffff:a.b.c.d against the IPv4 list too.
    const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) return blocked.check(mapped[1], "ipv4");
    return blocked.check(address, "ipv6");
  }
  return true;
}

/** Throws UnsafeUrlError unless the URL is something we're willing to request. */
export function assertFetchableUrl(input: string | URL): URL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new UnsafeUrlError("That doesn't look like a valid website address.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only http and https websites can be audited.");
  }
  if (url.username || url.password) {
    throw new UnsafeUrlError("Website addresses with a username or password can't be audited.");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new UnsafeUrlError("Only websites on the standard web ports can be audited.");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (isIP(hostname)) {
    if (isBlockedAddress(hostname)) throw new UnsafeUrlError("That address can't be audited.");
  } else if (
    !hostname.includes(".") ||
    hostname === "localhost" ||
    /\.(localhost|local|internal|intranet|lan|home|corp)$/.test(hostname)
  ) {
    throw new UnsafeUrlError("Please enter a public website address.");
  }

  return url;
}

/** DNS lookup used by the socket itself: refuses to connect to any blocked address. */
const guardedLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) {
      callback(error, "", 4);
      return;
    }

    const list = addresses as LookupAddress[];
    if (list.length === 0 || list.some((entry) => isBlockedAddress(entry.address))) {
      callback(new UnsafeUrlError("That website resolves to a private address and can't be audited."), "", 4);
      return;
    }

    if (options.all) {
      (callback as unknown as (err: null, addresses: LookupAddress[]) => void)(null, list);
    } else {
      callback(null, list[0].address, list[0].family);
    }
  });
};

function decode(buffer: Buffer, encoding: string | undefined): Buffer {
  try {
    switch ((encoding ?? "").trim().toLowerCase()) {
      case "gzip":
      case "x-gzip":
        return zlib.gunzipSync(buffer, { finishFlush: zlib.constants.Z_SYNC_FLUSH });
      case "deflate":
        return zlib.inflateSync(buffer, { finishFlush: zlib.constants.Z_SYNC_FLUSH });
      case "br":
        return zlib.brotliDecompressSync(buffer, {
          finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH,
        });
      default:
        return buffer;
    }
  } catch {
    // A body truncated at maxBytes can fail to decompress cleanly; fall back
    // to the raw bytes rather than failing the whole request.
    return buffer;
  }
}

function requestOnce(
  url: URL,
  deadline: number,
  maxBytes: number
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string; truncated: boolean }> {
  const remaining = deadline - Date.now();
  if (remaining <= 0) return Promise.reject(new Error("The website took too long to respond."));

  const client = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = client.request(
      url,
      {
        method: "GET",
        lookup: guardedLookup,
        timeout: remaining,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        let size = 0;
        let truncated = false;

        const finish = () => {
          const raw = Buffer.concat(chunks);
          const body = decode(raw, res.headers["content-encoding"] as string | undefined).toString("utf8");
          resolve({ status: res.statusCode ?? 0, headers: res.headers, body, truncated });
        };

        res.on("data", (chunk: Buffer) => {
          if (truncated) return;
          size += chunk.length;
          if (size > maxBytes) {
            chunks.push(chunk.subarray(0, chunk.length - (size - maxBytes)));
            truncated = true;
            res.destroy();
            finish();
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () => {
          if (!truncated) finish();
        });
        res.on("error", (error) => {
          if (!truncated) reject(error);
        });
      }
    );

    const timer = setTimeout(() => req.destroy(new Error("The website took too long to respond.")), remaining);
    req.on("close", () => clearTimeout(timer));
    req.on("timeout", () => req.destroy(new Error("The website took too long to respond.")));
    req.on("error", reject);
    req.end();
  });
}

/** GET a visitor-supplied URL safely. Throws UnsafeUrlError for blocked targets. */
export async function safeFetch(input: string, options: SafeFetchOptions = {}): Promise<SafeResponse> {
  const { timeoutMs = 15_000, maxBytes = 3 * 1024 * 1024, maxRedirects = 5 } = options;
  const started = Date.now();
  const deadline = started + timeoutMs;

  let url = assertFetchableUrl(input);
  const redirectChain = [url.toString()];

  for (let hop = 0; ; hop++) {
    const res = await requestOnce(url, deadline, maxBytes);
    const location = res.headers.location;

    if (res.status >= 300 && res.status < 400 && location) {
      if (hop >= maxRedirects) throw new Error("The website redirected too many times.");
      url = assertFetchableUrl(new URL(location, url));
      redirectChain.push(url.toString());
      continue;
    }

    return {
      url: url.toString(),
      status: res.status,
      headers: res.headers,
      body: res.body,
      truncated: res.truncated,
      redirectChain,
      elapsedMs: Date.now() - started,
    };
  }
}
