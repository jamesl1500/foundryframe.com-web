/**
 * Marquee - Foundry Frame
 * =========================
 * An endlessly scrolling band of items (the molten ticker, the industries
 * rows). Pure CSS: the track renders the items twice and slides by half its
 * width, so the loop is seamless. Pauses on hover and stands still for
 * visitors who prefer reduced motion. The duplicate copy is hidden from
 * screen readers so each item is announced once.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { CSSProperties, ReactNode } from "react";

export default function Marquee({
  items,
  separator,
  duration = 30,
  reverse = false,
  className = "",
  itemClassName = "",
}: {
  items: ReactNode[];
  separator?: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const copy = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <li key={i} className={`flex shrink-0 items-center ${itemClassName}`}>
          {item}
          {separator && (
            <span aria-hidden="true" className="flex items-center">
              {separator}
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`marquee-pause overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
