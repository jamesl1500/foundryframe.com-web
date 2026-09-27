/**
 * Stagger - Foundry Frame
 * ========================
 * Container/item pair that reveals a list of children in a staggered
 * sequence as they scroll into view. Uses the same visible-by-default
 * approach as FadeIn; the stagger is a per-position CSS transition-delay
 * (see the "Scroll reveal" section of globals.css).
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReveal } from "./useReveal";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, 0.15);

  return (
    <div ref={ref} className={className} data-reveal-group="">
      {children}
    </div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  distance?: number;
}

export function StaggerItem({ children, className, distance = 20 }: StaggerItemProps) {
  return (
    <div
      className={className}
      style={{ "--reveal-y": `${distance}px` } as CSSProperties}
      data-reveal-item=""
    >
      {children}
    </div>
  );
}
