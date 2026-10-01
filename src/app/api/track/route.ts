/**
 * Meta Conversions API Route - Foundry Frame
 * ============================================
 * Server-side copy of each Meta Pixel conversion (Lead, Schedule, Contact),
 * sent with the same event ID as the browser pixel so Meta deduplicates
 * them. Catches conversions the pixel misses (ad blockers, iOS privacy).
 *
 * Needs META_PIXEL_CONVERSIONS_API, the access token (the pixel ID defaults to Foundry Frame's).
 * Without the token it quietly does nothing. Set META_CAPI_TEST_EVENT_CODE to see events in
 * Events Manager > Test Events while checking the setup.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { META_EVENT_NAMES, META_PIXEL_ID, type MetaEventName } from "@/lib/analytics";

const PIXEL_ID = META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_PIXEL_CONVERSIONS_API || process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v23.0";
const SITE_HOSTS = ["foundryframe.com", "www.foundryframe.com", "localhost"];

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function isMetaEventName(value: string): value is MetaEventName {
  return (META_EVENT_NAMES as readonly string[]).includes(value);
}

function siteUrl(value: string) {
  try {
    const url = new URL(value);
    return SITE_HOSTS.includes(url.hostname) ? url.toString() : "";
  } catch {
    return "";
  }
}

function customData(value: unknown) {
  if (!value || typeof value !== "object") return {};
  const input = value as Record<string, unknown>;
  const out: Record<string, string | number> = {};
  const contentName = text(input.content_name, 60);
  if (contentName) out.content_name = contentName;
  if (typeof input.value === "number" && Number.isFinite(input.value) && input.value >= 0) {
    out.value = input.value;
    out.currency = "USD";
  }
  return out;
}

export async function POST(request: Request) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return new Response(null, { status: 204 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    const eventName = text(body?.eventName, 40);
    const eventId = text(body?.eventId, 64);
    const sourceUrl = siteUrl(text(body?.sourceUrl, 1000));

    if (!body || !isMetaEventName(eventName) || !eventId || !sourceUrl) {
      return Response.json({ error: "Invalid event." }, { status: 400 });
    }

    const headerList = await headers();
    const cookieStore = await cookies();
    const email = text(body.email, 200).toLowerCase();
    const firstName = text(body.name, 120).split(/\s+/)[0]?.toLowerCase() ?? "";

    const userData: Record<string, string | string[]> = {};
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
    const userAgent = headerList.get("user-agent");
    const fbp = cookieStore.get("_fbp")?.value;
    const fbc = cookieStore.get("_fbc")?.value;
    if (ip) userData.client_ip_address = ip;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;
    if (email.includes("@")) userData.em = [sha256(email)];
    if (firstName) userData.fn = [sha256(firstName)];

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          event_source_url: sourceUrl,
          user_data: userData,
          custom_data: customData(body.customData),
        },
      ],
      ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
    };

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.error("Meta CAPI error:", res.status, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
  }

  return new Response(null, { status: 204 });
}
