/**
 * Footer Component - Foundry Frame
 * ==================================
 * Flat ink block at the page bottom: a Spark call-out strip, brand and
 * contact details, link columns, and an oversized wordmark.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/analytics";
import { BUSINESS_HOURS_LINES } from "@/lib/site-facts";

/* --- Footer Navigation Columns --- */
const footerColumns = [
  {
    title: "Agency",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Packages", href: "/packages" },
      { label: "Launch Bundles", href: "/packages/launch" },
      { label: "Maintenance Plans", href: "/packages/maintenance" },
      { label: "Print Shop (New)", href: "/packages/print-shop" },
      { label: "Free Website Audit", href: "/audit" },
      { label: "Founding Clients", href: "/founding" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Design", href: "/services/web-design" },
      { label: "Branding", href: "/services/branding" },
      { label: "Social Media", href: "/services/social-media" },
      { label: "Graphic Design", href: "/services/graphic-design" },
      { label: "Advertising", href: "/services/advertising" },
      { label: "Digital Strategy", href: "/services/strategy" },
    ],
  },
  {
    title: "Who We Serve",
    links: [
      { label: "Lorain Web Design", href: "/locations/lorain-oh" },
      { label: "Elyria Web Design", href: "/locations/elyria-oh" },
      { label: "Cleveland Web Design", href: "/locations/cleveland-oh" },
      { label: "Westlake Web Design", href: "/locations/westlake-oh" },
      { label: "Columbus Web Design", href: "/locations/columbus-oh" },
      { label: "All Areas We Serve", href: "/locations" },
      { label: "Restaurant Websites", href: "/industries/restaurants" },
      { label: "Contractor Websites", href: "/industries/contractors" },
      { label: "All Industries", href: "/industries" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/foundry_frame/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/foundry-frame/" },
  { label: "X", href: "https://x.com/FoundryFrame" },
  { label: "Facebook", href: "https://www.facebook.com/foundry.frame" },
] as const;

export default function Footer() {
  return (
    <footer className="px-3 sm:px-6 pb-3 sm:pb-6 pt-8">
      <div className="on-dark max-w-[1360px] mx-auto rounded-panel bg-ink text-white overflow-hidden">
        {/* --- Spark call-out --- */}
        <Link
          href="/packages/website/spark"
          data-track="Footer: The Spark"
          className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-molten text-ink px-6 lg:px-10 py-6 border-b-[1.5px] border-ink"
        >
          <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
            New business? Start with <em className="serif-accent">The Spark</em> &mdash; from $1,500.
          </span>
          <span className="inline-flex items-center gap-3 text-sm font-semibold">
            See what&apos;s included
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white text-lg transition-transform duration-300 group-hover:-rotate-45"
            >
              &rarr;
            </span>
          </span>
        </Link>

        {/* --- Main Content --- */}
        <div className="px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link href="/" className="mb-4 inline-block" aria-label="Foundry Frame - Home">
                <Image
                  src="/FF_Lockup_Horizontal_Light.svg"
                  alt="Foundry Frame"
                  width={748}
                  height={200}
                  className="h-12 w-auto"
                />
              </Link>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                A creative agency based in Ohio. We build brands,
                craft visuals, and design digital experiences.
              </p>

              {/* Contact */}
              <div className="mt-6 space-y-1">
                <a
                  href="tel:+12168897822"
                  className="block text-white font-heading text-xl hover:text-molten transition-colors"
                >
                  (216) 889-7822
                </a>
                <a
                  href="mailto:jlatten@foundryframe.com"
                  className="block text-white/85 text-sm hover:text-molten transition-colors"
                >
                  jlatten@foundryframe.com
                </a>
                <p className="pt-3 text-white/55 text-xs leading-relaxed">
                  {BUSINESS_HOURS_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost-light mt-4 min-h-10 px-4 text-sm"
                >
                  Book a call &rarr;
                </a>
              </div>

              {/* Social */}
              <div className="flex flex-wrap items-center gap-2 mt-6">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="px-3 py-1.5 rounded-full border border-white/20 text-white/70 text-xs hover:text-ink hover:bg-molten hover:border-molten transition-colors"
                    aria-label={s.label}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav Columns */}
            {footerColumns.map((column) => (
              <div key={column.title} className="lg:col-span-2">
                <h3 className="text-molten text-xs font-semibold uppercase tracking-[0.14em] mb-5">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/75 text-sm hover:text-white hover:underline underline-offset-4 decoration-molten decoration-2 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* --- Oversized wordmark --- */}
        <div aria-hidden="true" className="px-4 lg:px-8 select-none overflow-hidden">
          <p className="font-heading font-bold text-white/[0.07] leading-[0.8] tracking-[-0.06em] text-[13.6vw] min-[1360px]:text-[11.6rem] whitespace-nowrap -mb-[0.08em]">
            Foundry Frame
          </p>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-white/15">
          <div className="px-6 lg:px-10 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/55 text-xs">
                &copy; {new Date().getFullYear()} Foundry Frame. All rights reserved.
              </p>
              <p className="text-white/55 text-xs">
                Designed &amp; Developed by Us with Love
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
