/**
 * GlassSheen - Foundry Frame
 * ============================
 * A soft highlight that follows the mouse across any .glass-card, like
 * light catching glass. One listener for the whole site: it writes the
 * pointer position into CSS variables on the card under the cursor, and
 * the highlight itself is drawn in CSS (.glass-card::before in globals.css).
 * Mouse only; touch screens never see it.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect } from "react";

export default function GlassSheen() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let current: HTMLElement | null = null;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = (e.target as Element | null)?.closest?.<HTMLElement>(".glass-card") ?? null;
        if (current && current !== card) current.style.removeProperty("--sheen-opacity");
        current = card;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--sheen-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--sheen-y", `${e.clientY - rect.top}px`);
        card.style.setProperty("--sheen-opacity", "1");
      });
    };

    const onLeave = () => {
      current?.style.removeProperty("--sheen-opacity");
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
