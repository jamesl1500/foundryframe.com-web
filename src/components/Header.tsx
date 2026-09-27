/**
 * Header Component - Foundry Frame
 * ==================================
 * Minimal navigation on a frosted-glass bar. Square corners,
 * thin border-bottom divider, bold uppercase type.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useState } from "react";
import Link from "next/link";

/* --- Navigation Links Data --- */
const navLinks: ReadonlyArray<{ label: string; href: string; highlight?: boolean }> = [
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Free Audit", href: "/audit", highlight: true },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* --- Logo --- */}
          <Link
            href="/"
            className="text-white font-heading font-bold text-lg tracking-tight uppercase"
            aria-label="Foundry Frame - Home"
          >
            Foundry Frame
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.highlight
                    ? "glass-accent text-[13px] font-bold text-white hover:text-accent-glow uppercase tracking-wider px-3 py-1 transition-colors"
                    : "text-[13px] font-medium text-gray-400 hover:text-accent-glow uppercase tracking-wider transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* --- Desktop CTA --- */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="text-[13px] font-bold text-black bg-accent px-5 py-2 uppercase tracking-wider hover:bg-accent-glow transition-colors"
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
      {/* Always rendered so it can transition; `inert` keeps the closed menu
          out of the tab order and accessibility tree. */}
      <div
        id="mobile-menu"
        inert={!mobileMenuOpen}
        className={`glass-nav lg:hidden grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="px-6 pb-6 border-t border-white/10" aria-label="Mobile navigation">
            {navLinks.map((link, i) => (
              <div
                key={link.href}
                className={`transition-[opacity,translate] duration-250 ${
                  mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${i * 40}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  className={`block py-3 text-sm uppercase tracking-wider border-b border-white/5 transition-colors hover:text-accent-glow ${
                    link.highlight ? "font-bold text-accent-glow" : "font-medium text-gray-400"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </div>
            ))}
            <div className="pt-4">
              <Link
                href="/contact"
                className="block w-full text-center text-sm font-bold text-black bg-accent px-5 py-3 uppercase tracking-wider"
                onClick={() => setMobileMenuOpen(false)}
              >
                Let&apos;s Talk
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
