/**
 * Request guards - Foundry Frame
 * ================================
 * Helpers for public POST endpoints: the caller's IP, a same-site check on
 * the Origin/Referer headers, and durable rate limiting backed by the
 * public.throttle_hit() Postgres function
 * (supabase/migrations/20261002000000_request_throttle.sql).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { createHash } from "node:crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const SITE_HOSTS = new Set(
  [
    "foundryframe.com",
    "www.foundryframe.com",
    "localhost",
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ].filter((host): host is string => Boolean(host))
);

export function isSiteUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    return SITE_HOSTS.has(new URL(value).hostname);
  } catch {
    return false;
  }
}

/** True when the browser says the request came from a page on this site. */
export function isSameSiteRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return isSiteUrl(origin);
  return isSiteUrl(request.headers.get("referer"));
}

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Hashed so raw IPs never land in the throttle table. */
export function ipBucket(prefix: string, request: Request): string {
  const hash = createHash("sha256").update(clientIp(request)).digest("hex").slice(0, 32);
  return `${prefix}:ip:${hash}`;
}

/**
 * Records a hit and returns whether the bucket is still under `limit` hits
 * per `windowSeconds`. Returns null when the limiter can't be reached (e.g.
 * the migration hasn't run), so each caller decides how to fail.
 */
export async function throttleHit(
  bucket: string,
  limit: number,
  windowSeconds: number
): Promise<boolean | null> {
  try {
    const client = getSupabaseAdminClient() as unknown as {
      rpc: (
        fn: string,
        args: Record<string, unknown>
      ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
    };
    const { data, error } = await client.rpc("throttle_hit", {
      p_bucket: bucket,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error("Rate limiter error:", error.message);
      return null;
    }
    return data === true;
  } catch (error) {
    console.error("Rate limiter unavailable:", error);
    return null;
  }
}
