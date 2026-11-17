/**
 * SpinBadge - Foundry Frame
 * ===========================
 * A round sticker with text set on a circle that slowly rotates, and a
 * still center. Used to point at The Spark. The ring text is decorative;
 * pass `label` for the accessible name when the badge is a link's content.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { ReactNode } from "react";

export default function SpinBadge({
  id = "spin-badge",
  text,
  center,
  className = "",
  ringClassName = "fill-ink",
}: {
  /** Unique per page: names the SVG path the ring text follows. */
  id?: string;
  /** Ring text; repeat it with separators so it fills the circle. */
  text: string;
  center?: ReactNode;
  className?: string;
  ringClassName?: string;
}) {
  return (
    <span
      className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-slow"
      >
        <defs>
          <path
            id={`${id}-circle`}
            d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
          />
        </defs>
        <text
          className={`font-heading font-bold uppercase ${ringClassName}`}
          style={{ fontSize: 16 }}
        >
          {/* textLength stretches the text to exactly fill the circle (2πr) */}
          <textPath href={`#${id}-circle`} textLength={489} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      {center && <span className="relative">{center}</span>}
    </span>
  );
}
