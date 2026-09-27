/**
 * useReveal - Foundry Frame
 * ==========================
 * Shared scroll-reveal logic for FadeIn and StaggerContainer. Sets
 * data-reveal="hidden" on the element only if it starts below the
 * viewport, then flips it to "shown" once it scrolls into view; CSS in
 * globals.css handles the actual transition. Elements already visible at
 * load are left alone, so server-rendered content paints immediately.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import { useEffect, type RefObject } from "react";

export function useReveal(ref: RefObject<HTMLElement | null>, amount: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, amount]);
}
