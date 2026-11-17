/**
 * Header Component - Foundry Frame
 * ==================================
 * A slim announcement bar for The Spark (collapses once the page scrolls)
 * above a flat, ink-outlined capsule nav. Links show an ink outline on
 * hover; the current section is a solid ink pill. About, Blog, FAQ, and
 * Contact live in a "Company" dropdown (opens on hover or click); on small
 * screens the links drop into a panel, with the Company pages as tiles.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOOKING_URL } from "@/lib/analytics";

/* --- Navigation Links Data --- */
const navLinks: ReadonlyArray<{ label: string; href: string; highlight?: boolean }> = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Free Audit", href: "/audit", highlight: true },
];

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const companyLinks: ReadonlyArray<{ label: string; href: string; description: string; icon: ReactNode }> = [
  {
    label: "About",
    href: "/about",
    description: "The founder and how we work",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </svg>
    ),
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Web design and marketing insights",
    icon: (
      <svg {...iconProps}>
        <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
        <path d="M13.5 6.5l4 4" />
      </svg>
    ),
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Pricing, timelines, and process",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Start a project or ask a question",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    ),
  },
];

/* Lays the label over an invisible bold copy of itself, so the pill is
   always as wide as its bold (active) state and switching weight on hover
   or navigation doesn't shift the rest of the nav. */
function NavLabel({ children }: { children: string }) {
  return (
    <span className="inline-grid">
      <span aria-hidden="true" className="col-start-1 row-start-1 font-semibold invisible">
        {children}
      </span>
      <span className="col-start-1 row-start-1 text-center">{children}</span>
    </span>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement>(null);
  const companyButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /* Set when hover opened the menu, so the click that usually follows on a
     mouse doesn't immediately close it again. */
  const openedByHover = useRef(false);
  const pathname = usePathname() ?? "";
  /* The announcement bar collapses once the visitor scrolls past the top. */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const companyActive = companyLinks.some((link) => isActive(link.href));

  /* Close the Company menu on an outside click or when focus leaves it. */
  useEffect(() => {
    if (!companyOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!companyRef.current?.contains(e.target as Node)) setCompanyOpen(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!companyRef.current?.contains(e.target as Node)) setCompanyOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [companyOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!companyOpen) openedByHover.current = false;
  }, [companyOpen]);

  function openOnHover(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    if (!companyOpen) openedByHover.current = true;
    setCompanyOpen(true);
  }

  function closeOnLeave(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (companyRef.current?.contains(document.activeElement)) return;
      setCompanyOpen(false);
    }, 160);
  }

  function toggleCompany() {
    if (companyOpen && openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    setCompanyOpen((open) => !open);
  }

  function onCompanyKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...(companyRef.current?.querySelectorAll<HTMLAnchorElement>("[data-company-item]") ?? [])];
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape" && companyOpen) {
      e.preventDefault();
      setCompanyOpen(false);
      companyButtonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCompanyOpen(true);
      // The panel is inert until open, so focus after it renders.
      requestAnimationFrame(() => items[Math.min(index + 1, items.length - 1)]?.focus());
    } else if (e.key === "ArrowUp" && index >= 0) {
      e.preventDefault();
      if (index === 0) companyButtonRef.current?.focus();
      else items[index - 1]?.focus();
    }
  }

  const pillClass = (active: boolean) =>
    active
      ? "bg-ink font-semibold text-white border-ink"
      : "text-ink-soft border-transparent hover:text-ink hover:border-ink";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* --- Announcement bar: The Spark --- */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled || mobileMenuOpen ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <Link
            href="/packages/website/spark"
            inert={scrolled || mobileMenuOpen}
            data-track="Announcement bar: The Spark"
            className="group flex items-center justify-center gap-3 bg-ink px-4 py-2 text-xs sm:text-sm text-white"
          >
            <span className="rounded-full bg-molten px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
              Start here
            </span>
            <span className="truncate">
              <span className="font-semibold">The Spark:</span>{" "}
              <span className="hidden sm:inline">custom 5-page websites </span>from $1,500
            </span>
            <span className="hidden sm:inline font-semibold text-molten underline-offset-4 group-hover:underline">
              See what&apos;s included &rarr;
            </span>
          </Link>
        </div>
      </div>

      <div className="px-3 sm:px-6 pt-3">
      <div
        className={`glass-nav max-w-[1360px] mx-auto rounded-[1.75rem] lg:rounded-full transition-shadow duration-300 ${
          scrolled ? "shadow-[4px_4px_0_var(--color-ink)]" : ""
        }`}
      >
        <div className="flex items-center justify-between h-14 pl-5 pr-2">
          {/* --- Logo --- */}
          <Link href="/" className="shrink-0" aria-label="Foundry Frame - Home">
            <Image
              src="/FF_Lockup_Horizontal_Color.svg"
              alt="Foundry Frame"
              width={748}
              height={200}
              preload
              className="h-9 w-auto"
            />
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`px-3.5 py-2 rounded-full border text-sm transition-colors ${
                  link.highlight
                    ? "font-semibold text-ink bg-molten-soft border-molten hover:bg-molten"
                    : pillClass(isActive(link.href))
                }`}
              >
                <NavLabel>{link.label}</NavLabel>
              </Link>
            ))}

            {/* --- Company dropdown --- */}
            <div
              ref={companyRef}
              className="relative"
              onPointerEnter={openOnHover}
              onPointerLeave={closeOnLeave}
              onKeyDown={onCompanyKeyDown}
            >
              <button
                ref={companyButtonRef}
                type="button"
                aria-expanded={companyOpen}
                aria-controls="company-menu"
                onClick={toggleCompany}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-colors ${pillClass(
                  companyActive || companyOpen
                )}`}
              >
                <NavLabel>Company</NavLabel>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${companyOpen ? "rotate-180" : ""}`}
                >
                  <path d="M3 4.5l3 3 3-3" />
                </svg>
              </button>

              {/* Panel. pt-3 bridges the gap below the button so moving the
                  mouse down to it doesn't close the menu. Always rendered so
                  it can animate; `inert` keeps it out of reach while closed. */}
              <div
                id="company-menu"
                inert={!companyOpen}
                className={`absolute right-0 top-full pt-3 w-[23rem] transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  companyOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5 pointer-events-none"
                }`}
              >
                {/* The header already blurs what's behind it, so this panel is
                    near-opaque rather than relying on a second blur. */}
                <div className="rounded-card border-[1.5px] border-ink bg-paper p-2 shadow-[6px_6px_0_var(--color-ink)]">
                  <ul className="flex flex-col gap-0.5">
                    {companyLinks.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            data-company-item
                            aria-current={active ? "page" : undefined}
                            onClick={() => setCompanyOpen(false)}
                            className={`group flex items-center gap-3.5 rounded-bubble border p-3 transition-colors ${
                              active
                                ? "bg-molten-soft border-molten"
                                : "border-transparent hover:bg-canvas hover:border-ink/15 focus-visible:bg-canvas"
                            }`}
                          >
                            <span
                              className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-full border transition-colors ${
                                active
                                  ? "bg-molten text-ink border-molten"
                                  : "bg-canvas text-ink-soft border-ink/10 group-hover:bg-ink group-hover:text-white group-hover:border-ink"
                              }`}
                            >
                              {link.icon}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-ink">{link.label}</span>
                              <span className="block text-xs text-muted">{link.description}</span>
                            </span>
                            <span
                              aria-hidden="true"
                              className="ml-auto text-muted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                            >
                              &rarr;
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-2 flex items-center justify-between gap-3 rounded-bubble bg-ink px-4 py-3">
                    <span className="text-xs text-white/70">Prefer to talk it through?</span>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-company-item
                      onClick={() => setCompanyOpen(false)}
                      className="text-xs font-semibold text-molten hover:underline underline-offset-4"
                    >
                      Book a free call &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
            className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center text-ink hover:bg-canvas transition-colors"
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
                    className={`block px-4 py-3 rounded-2xl border text-base transition-colors ${
                      link.highlight
                        ? "font-semibold text-ink bg-molten-soft border-molten"
                        : isActive(link.href)
                          ? "bg-ink font-semibold text-white border-ink"
                          : "text-ink-soft border-transparent hover:bg-canvas hover:border-ink/15"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}

              <div
                className={`transition-[opacity,translate] duration-250 ${
                  mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${navLinks.length * 40}ms` : "0ms" }}
              >
                <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Company
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {companyLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-bubble border p-3 transition-colors ${
                            active ? "bg-molten-soft border-molten" : "bg-canvas border-transparent hover:border-ink/15"
                          }`}
                        >
                          <span
                            className={`flex shrink-0 items-center justify-center w-9 h-9 rounded-full ${
                              active ? "bg-molten text-ink" : "bg-paper text-ink-soft border border-ink/10"
                            }`}
                          >
                            {link.icon}
                          </span>
                          <span className="text-sm font-semibold text-ink">{link.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="pt-3 grid gap-2">
                <Link
                  href="/packages/website/spark"
                  className="btn btn-molten w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  The Spark &middot; from $1,500 &rarr;
                </Link>
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
      </div>
    </header>
  );
}
