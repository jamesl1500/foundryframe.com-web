/**
 * FadeIn - Foundry Frame
 * =======================
 * Reusable scroll-triggered reveal animation. Content is server-rendered
 * visible; after hydration, only elements still below the viewport are
 * hidden and then revealed (once) as they scroll in. Anything on screen at
 * load is never hidden, so it can't delay first paint or LCP.
 * The animation itself is plain CSS — see the "Scroll reveal" section of
 * globals.css.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReveal } from "./useReveal";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
}

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

export default function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 24,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, 0.2);

  const offset = offsetFor(direction, distance);
  const style = {
    "--reveal-x": `${offset.x}px`,
    "--reveal-y": `${offset.y}px`,
    "--reveal-duration": `${duration}s`,
    "--reveal-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
