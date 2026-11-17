/**
 * HoverRevealList - Foundry Frame
 * =================================
 * A list of large, linked rows. On desktop, hovering a row reveals that
 * row's photo, which trails the cursor; on touch screens each row shows a
 * small thumbnail instead. Every photo stays in the DOM (lazy-loaded) so
 * the reveal is instant.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import Photo from "@/components/media/Photo";
import type { PhotoKey } from "@/lib/media/unsplash";

export type RevealItem = {
  title: string;
  description: string;
  href: string;
  photo: PhotoKey;
};

export default function HoverRevealList({ items }: { items: RevealItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== "mouse" || !listRef.current || !floatRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    floatRef.current.style.translate = `${e.clientX - rect.left}px ${e.clientY - rect.top}px`;
  }

  return (
    <ul
      ref={listRef}
      onPointerMove={onMove}
      onPointerLeave={() => setHovered(null)}
      className="relative border-t border-ink"
    >
      {/* Cursor-trailing photo (mouse only; hidden on touch via hover media query) */}
      <div
        ref={floatRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(hover:hover)]:block transition-[translate] duration-300 ease-out"
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 w-72 aspect-[4/5] overflow-hidden rounded-card border-[1.5px] border-ink transition-[opacity,scale,rotate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            hovered === null ? "opacity-0 scale-75 rotate-0" : "opacity-100 scale-100 -rotate-3"
          }`}
        >
          {items.map((item, i) => (
            <div
              key={item.href + item.title}
              className={`absolute inset-0 transition-opacity duration-300 ${hovered === i ? "opacity-100" : "opacity-0"}`}
            >
              <Photo name={item.photo} alt="" sizes="288px" />
            </div>
          ))}
        </div>
      </div>

      {items.map((item, i) => (
        <li key={item.href + item.title} className="border-b border-ink">
          <Link
            href={item.href}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
            onFocus={() => setHovered(null)}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8 py-6 sm:py-8 transition-colors hover:bg-ink hover:text-white focus-visible:bg-ink focus-visible:text-white px-2 sm:px-4 -mx-2 sm:-mx-4"
          >
            <span className="font-mono text-xs text-muted group-hover:text-white/60 group-focus-visible:text-white/60 w-8">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex items-center gap-4 min-w-0">
              {/* Thumbnail for touch screens */}
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-bubble [@media(hover:hover)]:hidden">
                <Photo name={item.photo} alt="" sizes="56px" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-none transition-transform duration-300 group-hover:translate-x-2">
                  {item.title}
                </span>
                <span className="mt-2 block max-w-2xl text-sm sm:text-[15px] leading-relaxed text-body group-hover:text-white/75 group-focus-visible:text-white/75">
                  {item.description}
                </span>
              </span>
            </span>
            <span
              aria-hidden="true"
              className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border-[1.5px] border-current text-xl transition-[rotate,background-color,color] duration-300 group-hover:-rotate-45 group-hover:bg-molten group-hover:text-ink group-hover:border-molten"
            >
              &rarr;
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
