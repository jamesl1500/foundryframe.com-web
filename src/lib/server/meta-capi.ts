/**
 * Meta Conversions API - Foundry Frame
 * ======================================
 * Server-side copy of Meta Pixel conversions, sent with the same event ID as
 * the browser pixel so Meta deduplicates them. Lead events are sent only by
 * the form API routes after a submission succeeds; click events come through
 * /api/track.
 *
 * Runs only when ad tracking is enabled (the production deployment) and
 * META_PIXEL_CONVERSIONS_API holds the access token. Set
 * META_CAPI_TEST_EVENT_CODE to see events in Events Manager > Test Events.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { createHash } from "node:crypto";
import { META_PIXEL_ID, type MetaEventName } from "@/lib/analytics";
import { clientIp, isSiteUrl } from "@/lib/server/request-guard";

const ACCESS_TOKEN = process.env.META_PIXEL_CONVERSIONS_API || process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v23.0";
const EVENT_ID_REGEX = /^[A-Za-z0-9-]{8,64}$/;
const FALLBACK_SOURCE_URL = "https://www.foundryframe.com/";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function cookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

/** Accepts only the shape newConversionId() produces. */
export function parseEventId(value: unknown): string | null {
  return typeof value === "string" && EVENT_ID_REGEX.test(value) ? value : null;
}

export const metaCapiEnabled = Boolean(META_PIXEL_ID && ACCESS_TOKEN);

export async function sendMetaEvent(
  request: Request,
  event: {
    eventName: MetaEventName;
    eventId: string;
    contentName: string;
    value?: number;
    email?: string;
    name?: string;
  }
): Promise<void> {
  if (!metaCapiEnabled) return;

  const referer = request.headers.get("referer");
  const sourceUrl = isSiteUrl(referer) && referer ? referer : FALLBACK_SOURCE_URL;
  const email = event.email?.trim().toLowerCase() ?? "";
  const firstName = event.name?.trim().split(/\s+/)[0]?.toLowerCase() ?? "";

  const userData: Record<string, string | string[]> = {};
  const ip = clientIp(request);
  const userAgent = request.headers.get("user-agent");
  const fbp = cookie(request, "_fbp");
  const fbc = cookie(request, "_fbc");
  if (ip !== "unknown") userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (email.includes("@")) userData.em = [sha256(email)];
  if (firstName) userData.fn = [sha256(firstName)];

  const customData: Record<string, string | number> = { content_name: event.contentName };
  if (event.value !== undefined && Number.isFinite(event.value) && event.value >= 0) {
    customData.value = event.value;
    customData.currency = "USD";
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN ?? "")}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          data: [
            {
              event_name: event.eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: event.eventId,
              action_source: "website",
              event_source_url: sourceUrl,
              user_data: userData,
              custom_data: customData,
            },
          ],
          ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
        }),
      }
    );
    if (!res.ok) {
      console.error("Meta CAPI error:", res.status, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
  }
}

/** Sends a Lead event for a form that was just submitted successfully. */
export async function sendMetaLead(
  request: Request,
  body: Record<string, unknown> | null | undefined,
  lead: { contentName: string; value?: number; email?: string; name?: string }
): Promise<void> {
  const eventId = parseEventId(body?.conversionId);
  if (!eventId) return;
  await sendMetaEvent(request, { eventName: "Lead", eventId, ...lead });
}
