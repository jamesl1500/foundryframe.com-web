import Anthropic from "@anthropic-ai/sdk";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat/knowledge";

export const maxDuration = 60;

const CHAT_MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";
const MAX_MESSAGES = 16;
const MAX_MESSAGE_CHARS = 1500;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

const FALLBACK_REPLY =
  "Sorry, I can't answer that one here. You can reach James directly at (216) 889-7822 or jlatten@foundryframe.com.";
const ERROR_REPLY =
  "Sorry, the chat is having trouble right now. You can reach James at (216) 889-7822 or jlatten@foundryframe.com.";

/* Best-effort per-instance limiter: keeps one visitor from running up the
   API bill, but resets whenever a serverless instance is recycled. */
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);

  if (requestLog.size > 5000) {
    for (const [key, times] of requestLog) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
  }

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function parseMessages(body: unknown): Anthropic.MessageParam[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: Anthropic.MessageParam[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    const role = (item as { role?: unknown })?.role;
    const content = (item as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!text) return null;
    messages.push({ role, content: text });
  }

  /* The window may have cut the conversation mid-exchange; the API needs
     it to start with the visitor and end with their newest message. */
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;

  return messages;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Chat is not configured." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "You've sent a lot of messages. Please call (216) 889-7822 or try again shortly." },
      { status: 429 }
    );
  }

  let messages: Anthropic.MessageParam[] | null = null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) {
    return Response.json({ error: "Invalid chat request." }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sentText = false;
      try {
        const response = anthropic.beta.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 2048,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          cache_control: { type: "ephemeral" },
          system: CHAT_SYSTEM_PROMPT,
          messages,
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sentText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await response.finalMessage();
        if (!sentText || final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(sentText ? `\n\n${FALLBACK_REPLY}` : FALLBACK_REPLY));
        }
      } catch (error) {
        console.error("Site chat failed:", error);
        controller.enqueue(encoder.encode(sentText ? `\n\n${ERROR_REPLY}` : ERROR_REPLY));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
