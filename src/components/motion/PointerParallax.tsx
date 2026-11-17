/**
 * PointerParallax - Foundry Frame
 * =================================
 * Moves layers inside it a little as the mouse moves across it, for the
 * homepage photo collage. Mark each layer with data-depth (e.g. 0.4 moves
 * a little, 1.2 moves a lot, negative moves the other way). One listener,
 * transforms only, eased back to rest when the mouse leaves.
 *
 * Mouse only, and off for visitors who prefer reduced motion, so touch
 * screens and motion-sensitive visitors see a still collage.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function PointerParallax({
  children,
  className = "",
  /** Max travel in px for a layer with data-depth="1". */
  strength = 18,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = [...root.querySelectorAll<HTMLElement>("[data-depth]")];
    layers.forEach((layer) => {
      layer.style.transition = "translate 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
    });

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        layers.forEach((layer) => {
          const depth = Number(layer.dataset.depth) || 0;
          layer.style.translate = `${(-x * strength * depth).toFixed(1)}px ${(-y * strength * depth).toFixed(1)}px`;
        });
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      layers.forEach((layer) => {
        layer.style.translate = "0px 0px";
      });
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
