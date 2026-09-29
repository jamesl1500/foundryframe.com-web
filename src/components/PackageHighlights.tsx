/**
 * Package Highlights - Foundry Frame
 * ====================================
 * Two-card feature block that puts Launch Bundles and Maintenance
 * Plans in front of visitors. Dropped into the homepage, the
 * packages hub, and every city and industry landing page so both
 * packages get prominent placement and keyword-rich internal links.
 *
 * Prices and tier names mirror /packages/launch and
 * /packages/maintenance; update both places together.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import Link from "next/link";

const highlights = [
  {
    eyebrow: "Launch Bundles",
    title: "Website, brand, and support in one package",
    description:
      "A custom website, logo and brand identity, and months of maintenance, delivered by one team on one timeline. The simplest way to launch a new business or relaunch an old one.",
    price: "From $2,500",
    tiers: ["Ignite", "Velocity", "Ascend", "Apex"],
    points: [
      "Custom website, 5 pages to enterprise",
      "Logo and brand identity design",
      "1 to 12 months of maintenance included",
    ],
    href: "/packages/launch",
    cta: "Compare Launch Bundles",
  },
  {
    eyebrow: "Maintenance Plans",
    title: "Website maintenance that keeps you growing",
    description:
      "Updates, security monitoring, backups, and content changes handled for you every month, so your site stays fast, secure, and ranking long after launch.",
    price: "From $99/mo",
    tiers: ["Steady", "Active", "Elite"],
    points: [
      "Software updates and security monitoring",
      "24/7 uptime monitoring and offsite backups",
      "Content updates and developer hours on Active and Elite",
    ],
    href: "/packages/maintenance",
    cta: "Compare Maintenance Plans",
  },
] as const;

export default function PackageHighlights({
  heading = "Launch bundles & website maintenance plans",
  showAllLink = true,
}: {
  heading?: string;
  showAllLink?: boolean;
}) {
  return (
    <section className="py-24 lg:py-32 bg-black border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
              Packages
            </p>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white max-w-3xl">
              {heading}
            </h2>
          </div>
          {showAllLink && (
            <Link
              href="/packages"
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-white border-b border-gray-400 hover:border-white pb-1 transition-colors"
            >
              All Packages
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
          {highlights.map((item) => (
            <div key={item.href} className="glass-card p-8 lg:p-12 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-accent">
                  {item.eyebrow}
                </p>
                <p className="text-white font-heading font-bold text-lg whitespace-nowrap">
                  {item.price}
                </p>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-lg">
                {item.description}
              </p>
              <ul className="border-t border-white/10 mb-6">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 py-3 border-b border-white/10 text-gray-300 text-sm"
                  >
                    <span className="text-accent font-bold" aria-hidden="true">
                      &#10003;
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mb-8">
                {item.tiers.map((tier) => (
                  <span
                    key={tier}
                    className="text-[10px] uppercase tracking-widest border border-white/10 text-gray-500 px-2 py-1"
                  >
                    {tier}
                  </span>
                ))}
              </div>
              <Link
                href={item.href}
                data-track={`Package highlight: ${item.eyebrow}`}
                className="mt-auto self-start px-6 py-3 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors"
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
