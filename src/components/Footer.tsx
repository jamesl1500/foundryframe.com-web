/**
 * Footer Component - Foundry Frame
 * ==================================
 * Flat, minimal footer. Thin border dividers,
 * no rounded corners, sparse layout.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";

/* --- Footer Navigation Columns --- */
const footerColumns = [
  {
    title: "Agency",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Packages", href: "/packages" },
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
] as const;

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      {/* --- Main Content --- */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="text-white font-heading font-bold text-lg tracking-tight uppercase mb-6 inline-block"
            >
              Foundry Frame
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              A creative agency based in Ohio. We build brands,
              craft visuals, and design digital experiences.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-1">
              <a
                href="tel:+12168897822"
                className="block text-gray-400 text-sm hover:text-accent-glow transition-colors"
              >
                (216) 889-7822
              </a>
              <a
                href="mailto:jlatten@foundryframe.com"
                className="block text-gray-400 text-sm hover:text-accent-glow transition-colors"
              >
                jlatten@foundryframe.com
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-6 mt-8">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-gray-500 text-xs uppercase tracking-wider hover:text-accent-glow transition-colors"
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
              <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-accent-glow transition-colors"
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
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Foundry Frame. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Designed &amp; Developed by Us with Love
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
