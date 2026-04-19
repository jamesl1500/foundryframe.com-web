/**
 * Header Component - Foundry Frame
 * ==================================
 * Flat, minimal navigation. No blur, no rounded corners.
 * Thin border-bottom divider. Brutalist aesthetic.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useState } from "react";
import Link from "next/link";

/* --- Navigation Links Data --- */
const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Work", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* --- Logo --- */}
          <Link
            href="/"
            className="text-white font-heading font-bold text-lg tracking-tight uppercase"
            aria-label="Foundry Frame - Home"
          >
            FoundryFrame
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* --- Desktop CTA --- */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="text-[13px] font-bold text-black bg-white px-5 py-2 uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Let&apos;s Talk
            </Link>
          </div>

          {/* --- Mobile Toggle --- */}
          <button
            type="button"
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span
                className={`block w-6 h-px bg-white transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""
                }`}
              />
              <span
                className={`block w-6 h-px bg-white transition-all duration-200 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-200 ${
          mobileMenuOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <nav className="px-6 pb-6 border-t border-white/10" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium text-gray-400 hover:text-white uppercase tracking-wider border-b border-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/contact"
              className="block w-full text-center text-sm font-bold text-black bg-white px-5 py-3 uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              Let&apos;s Talk
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
