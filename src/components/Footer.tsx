/**
 * Footer Component - Foundry Frame
 * ==================================
 * Frosted glass panel floating above the page bottom, with brand,
 * contact details, and link columns.
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
    <footer className="px-3 sm:px-6 pb-6 pt-8">
      <div className="glass max-w-[1360px] mx-auto rounded-panel">
        {/* --- Main Content --- */}
        <div className="px-6 lg:px-10 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link href="/" className="mb-4 inline-block" aria-label="Foundry Frame - Home">
                <Image
                  src="/FF_Lockup_Horizontal_Color.svg"
                  alt="Foundry Frame"
                  width={748}
                  height={200}
                  className="h-12 w-auto"
                />
              </Link>
              <p className="text-muted text-sm leading-relaxed max-w-xs">
                A creative agency based in Ohio. We build brands,
                craft visuals, and design digital experiences.
              </p>

              {/* Contact */}
              <div className="mt-6 space-y-1">
                <a
                  href="tel:+12168897822"
                  className="block text-ink-soft text-sm hover:text-accent-ink transition-colors"
                >
                  (216) 889-7822
                </a>
                <a
                  href="mailto:jlatten@foundryframe.com"
                  className="block text-ink-soft text-sm hover:text-accent-ink transition-colors"
                >
                  jlatten@foundryframe.com
                </a>
                <p className="pt-3 text-muted text-xs leading-relaxed">
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
                  className="btn btn-glass mt-4 min-h-10 px-4 text-sm"
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
                    className="px-3 py-1.5 rounded-full border border-ink/10 text-muted text-xs hover:text-ink hover:bg-white/70 transition-colors"
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
                <h3 className="text-muted text-xs font-semibold uppercase tracking-[0.14em] mb-5">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-ink-soft text-sm hover:text-accent-ink transition-colors"
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

        {/* --- Bottom Bar --- */}
        <div className="border-t border-ink/10">
          <div className="px-6 lg:px-10 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-muted text-xs">
                &copy; {new Date().getFullYear()} Foundry Frame. All rights reserved.
              </p>
              <p className="text-muted text-xs">
                Designed &amp; Developed by Us with Love
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
