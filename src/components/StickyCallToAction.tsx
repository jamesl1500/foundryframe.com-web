"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StickyCallToAction() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function onScroll() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && window.scrollY / docHeight >= 0.5) {
        setVisible(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="glass-accent fixed bottom-6 left-6 z-40 flex items-center gap-3 text-white px-5 py-3">
      <span className="text-xs text-white/60 hidden sm:block">
        Ready to start?
      </span>
      <Link
        href="/contact"
        className="text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:text-accent-glow transition-colors"
      >
        Book a Free Call →
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="text-white/40 hover:text-white transition-colors text-lg leading-none ml-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
