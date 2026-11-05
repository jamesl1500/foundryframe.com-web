/**
 * AnimatedBackdrop - Foundry Frame
 * ==================================
 * The soft color fields fixed behind every page. Each field drifts slowly
 * on its own loop, and the whole layer shifts a little as the page scrolls,
 * so the glass on top always has something gently moving behind it.
 *
 * The fields are radial gradients moved with transforms only (no blur
 * filters), so they're cheap to animate. Visitors who prefer reduced motion
 * get the same fields, standing still.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const fields = [
  {
    color: "rgba(224, 154, 40, 0.42)",
    position: "-left-[30vmax] -top-[30vmax]",
    drift: { x: ["0vmax", "6vmax", "2vmax"], y: ["0vmax", "4vmax", "8vmax"] },
    duration: 26,
  },
  {
    color: "rgba(142, 197, 240, 0.45)",
    position: "-right-[30vmax] -top-[20vmax]",
    drift: { x: ["0vmax", "-7vmax", "-3vmax"], y: ["0vmax", "6vmax", "2vmax"] },
    duration: 32,
  },
  {
    color: "rgba(245, 185, 156, 0.38)",
    position: "left-[15%] top-[45%]",
    drift: { x: ["0vmax", "-6vmax", "5vmax"], y: ["0vmax", "-5vmax", "3vmax"] },
    duration: 38,
  },
  {
    color: "rgba(185, 200, 245, 0.4)",
    position: "-left-[30vmax] -bottom-[30vmax]",
    drift: { x: ["0vmax", "8vmax", "4vmax"], y: ["0vmax", "-6vmax", "-2vmax"] },
    duration: 30,
  },
];

export default function AnimatedBackdrop() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // A slow parallax: the fields rise a little as you scroll the page.
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-10vh"]);

  return (
    <motion.div aria-hidden="true" className="site-backdrop" style={reduceMotion ? undefined : { y }}>
      {fields.map((field) => (
        <motion.span
          key={field.color}
          className={`site-backdrop-field ${field.position}`}
          style={{ background: `radial-gradient(closest-side, ${field.color}, transparent)` }}
          animate={reduceMotion ? undefined : field.drift}
          transition={{
            duration: field.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
