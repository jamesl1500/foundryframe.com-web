/**
 * Meta Conversions API Click Route - Foundry Frame
 * ==================================================
 * Server-side copy of the click conversions (Schedule for the booking link,
 * Contact for click-to-call). Lead events are not accepted here: the form
 * API routes send those themselves after a submission succeeds.
 *
 * Only same-site browser requests are forwarded, and each IP is limited to
 * a handful of events per hour (durable, via public.throttle_hit), so the
 * endpoint can't be used to flood the pixel with fake conversions.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { META_CLICK_EVENT_NAMES } from "@/lib/analytics";
import { metaCapiEnabled, parseEventId, sendMetaEvent } from "@/lib/server/meta-capi";
import { ipBucket, isSameSiteRequest, throttleHit } from "@/lib/server/request-guard";

const CLICK_LIMIT_PER_HOUR = 10;

function isClickEventName(value: unknown): value is (typeof META_CLICK_EVENT_NAMES)[number] {
  return typeof value === "string" && (META_CLICK_EVENT_NAMES as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  if (!metaCapiEnabled) {
    return new Response(null, { status: 204 });
  }

  if (!isSameSiteRequest(request)) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    const eventId = parseEventId(body?.eventId);
    if (!body || !isClickEventName(body.eventName) || !eventId) {
      return Response.json({ error: "Invalid event." }, { status: 400 });
    }

    // Fails closed: if the limiter can't be reached, nothing is forwarded.
    const allowed = await throttleHit(ipBucket("track", request), CLICK_LIMIT_PER_HOUR, 3600);
    if (allowed !== true) {
      return new Response(null, { status: 429 });
    }

    await sendMetaEvent(request, {
      eventName: body.eventName,
      eventId,
      contentName: body.eventName === "Schedule" ? "booking" : "call",
    });
  } catch (error) {
    console.error("Track request failed:", error);
  }

  return new Response(null, { status: 204 });
}
