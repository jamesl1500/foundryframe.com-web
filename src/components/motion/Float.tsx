/**
 * Float - Foundry Frame
 * =======================
 * Gently bobs its children up and down, for the glass "bubbles" in heroes
 * and spotlights. Content renders in place on the server (no fade-in), so
 * it never delays first paint; the float starts after hydration and is
 * skipped for visitors who prefer reduced motion.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Float({
  children,
  className,
  delay = 0,
  distance = 8,
  duration = 7,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** How far up it drifts, in px. */
  distance?: number;
  /** Seconds for one full up-and-down cycle. */
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
