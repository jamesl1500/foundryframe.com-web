/**
 * Header Component - Foundry Frame
 * ==================================
 * Floating glass capsule navigation. The current section shows as a raised
 * white pill; on small screens the links drop into a frosted panel.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname() ?? "";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3">
      <div
        className={`glass-nav max-w-[1360px] mx-auto rounded-[1.75rem] lg:rounded-full transition-colors ${
          mobileMenuOpen ? "bg-white/96" : ""
        }`}
      >
        <div className="flex items-center justify-between h-14 pl-5 pr-2">
          {/* --- Logo --- */}
          <Link
            href="/"
            className="text-ink font-heading font-bold text-lg tracking-tight"
            aria-label="Foundry Frame - Home"
          >
            Foundry Frame
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`px-3.5 py-2 rounded-full text-sm transition-colors ${
                  link.highlight
                    ? "glass-accent font-semibold text-accent-deep hover:bg-accent/25"
                    : isActive(link.href)
                      ? "bg-white/85 font-semibold text-ink shadow-[0_2px_10px_rgba(60,40,10,0.08)]"
                      : "text-ink-soft hover:bg-white/60 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* --- Desktop CTA --- */}
          <div className="hidden lg:block">
            <Link href="/contact" className="btn btn-primary min-h-10 px-5 text-sm">
              Let&apos;s Talk
            </Link>
          </div>

          {/* --- Mobile Toggle --- */}
          <button
            type="button"
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center text-ink hover:bg-white/60 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span
                className={`block w-5 h-0.5 rounded-full bg-ink transition-all duration-200 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 rounded-full bg-ink transition-all duration-200 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* --- Mobile Menu --- */}
        {/* Always rendered so it can transition; `inert` keeps the closed menu
            out of the tab order and accessibility tree. */}
        <div
          id="mobile-menu"
          inert={!mobileMenuOpen}
          className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <nav className="px-3 pb-3" aria-label="Mobile navigation">
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
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block px-4 py-3 rounded-2xl text-base transition-colors hover:bg-white/60 ${
                      link.highlight
                        ? "font-semibold text-accent-deep"
                        : isActive(link.href)
                          ? "bg-white/80 font-semibold text-ink"
                          : "text-ink-soft"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="btn btn-primary w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Let&apos;s Talk
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
