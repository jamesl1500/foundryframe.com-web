/**
 * SiteChat - Foundry Frame
 * =========================
 * Floating "Ask a question" chat box. Answers stream from /api/chat, which
 * grounds Claude in the site's own services, packages, and FAQ. The
 * conversation survives page navigation for the rest of the browser tab.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOOKING_URL, trackEvent } from "@/lib/analytics";
import { AD_PAGE_PREFIX } from "@/lib/funnels";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "ff-site-chat";
const GREETING =
  "Hi! I can answer questions about Foundry Frame's websites, branding, packages, pricing, and timelines. What are you working on?";
const SUGGESTIONS = [
  "How much does a website cost?",
  "Which package fits a new small business?",
  "How long does a project take?",
  "What's included in maintenance?",
];
const HIDDEN_PREFIXES = ["/admin", "/lead-preview", AD_PAGE_PREFIX];

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((m) => m && typeof m.content === "string") : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* Storage can be blocked (private mode); the chat still works. */
  }
}

/* --- Minimal Markdown: **bold**, [links](...), and bullet lists --- */

function isAllowedHref(href: string) {
  return (
    (href.startsWith("/") && !href.startsWith("//")) ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith(BOOKING_URL) ||
    href.startsWith("https://www.foundryframe.com")
  );
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${match.index}`;

    if (match[1]) {
      nodes.push(<strong key={key} className="font-semibold text-white">{match[1]}</strong>);
    } else {
      const [, , label, href] = match;
      if (!isAllowedHref(href)) {
        nodes.push(label);
      } else if (href.startsWith("/")) {
        nodes.push(
          <Link key={key} href={href} className="text-accent-glow underline underline-offset-2 hover:text-white">
            {label}
          </Link>
        );
      } else {
        const external = href.startsWith("http");
        nodes.push(
          <a
            key={key}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-accent-glow underline underline-offset-2 hover:text-white"
          >
            {label}
          </a>
        );
      }
    }
    last = pattern.lastIndex;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function MessageBody({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    const items = list;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>
    );
    list = [];
  };

  text.split("\n").forEach((line, i) => {
    const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    flushList();
    if (line.trim()) {
      blocks.push(<p key={`p-${i}`}>{renderInline(line.replace(/^#+\s*/, ""), `p-${i}`)}</p>);
    }
  });
  flushList();

  return <div className="space-y-2">{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}

/* --- Component --- */

export default function SiteChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    /* Skip autofocus on phones so the keyboard doesn't cover the answers. */
    if (window.matchMedia("(min-width: 640px)").matches) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  if (HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;

  function toggle() {
    if (!open) trackEvent("chat_open");
    setOpen(!open);
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || pending) return;

    const history: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setPending(true);
    trackEvent("chat_message", { message_count: history.filter((m) => m.role === "user").length });

    let answer = "";
    const show = (content: string) =>
      setMessages([...history, { role: "assistant", content }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.filter((m) => m.content) }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        answer =
          data?.error ??
          "Sorry, the chat isn't available right now. Call (216) 889-7822 or email jlatten@foundryframe.com.";
        show(answer);
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          show(answer);
        }
      }
    } catch {
      answer =
        answer ||
        "Sorry, something went wrong. Call (216) 889-7822 or email jlatten@foundryframe.com.";
      show(answer);
    } finally {
      setPending(false);
      saveHistory([...history, { role: "assistant", content: answer }]);
    }
  }

  function reset() {
    setMessages([]);
    saveHistory([]);
  }

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Chat with Foundry Frame"
          className="fixed z-50 bottom-24 right-4 sm:right-5 w-[calc(100vw-2rem)] sm:w-[380px] h-[min(560px,calc(100dvh-8rem))] flex flex-col bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl text-sm text-white/85"
        >
          <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-white/10">
            <div>
              <p className="font-heading font-bold uppercase tracking-wider text-white">Ask Foundry Frame</p>
              <p className="text-xs text-white/50 mt-0.5">AI assistant, answers from our site. Replies may be imperfect.</p>
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  disabled={pending}
                  className="text-xs text-white/50 hover:text-white uppercase tracking-wider disabled:opacity-40"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-white/50 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4" aria-live="polite">
            <div className="bg-white/5 border border-white/10 px-4 py-3 leading-relaxed">{GREETING}</div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-xs border border-accent/40 text-accent-glow px-3 py-1.5 hover:bg-accent hover:text-black transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-8 bg-accent/20 border border-accent/30 px-4 py-3 text-white leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </div>
              ) : (
                <div key={i} className="mr-4 bg-white/5 border border-white/10 px-4 py-3 leading-relaxed">
                  {m.content ? (
                    <MessageBody text={m.content} />
                  ) : (
                    <span className="inline-flex gap-1" aria-label="Typing">
                      <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              )
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-white/10 p-3 flex gap-2"
          >
            <label htmlFor="site-chat-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="site-chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={1500}
              placeholder="Type your question"
              className="flex-1 resize-none bg-black/40 border border-white/15 px-3 py-2 text-base sm:text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="bg-accent text-black font-bold uppercase tracking-wider text-xs px-4 hover:bg-accent-glow transition-colors disabled:opacity-40"
            >
              Send
            </button>
          </form>

          <p className="px-5 pb-3 text-xs text-white/45">
            Prefer a person?{" "}
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-accent-glow hover:text-white">
              Book a free consultation
            </a>{" "}
            or call{" "}
            <a href="tel:+12168897822" className="text-accent-glow hover:text-white">
              (216) 889-7822
            </a>
            .
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Ask a question"}
        className="glass-accent fixed bottom-5 right-4 sm:right-5 z-40 flex items-center gap-2 text-white text-sm font-bold px-4 sm:px-5 py-3 uppercase tracking-wider hover:bg-accent hover:text-black transition-colors"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinejoin="round" d="M4 5h16v11H9l-5 4V5z" />
          )}
        </svg>
        <span className="hidden sm:inline">{open ? "Close" : "Ask a question"}</span>
      </button>
    </>
  );
}
