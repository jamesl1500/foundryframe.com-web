/**
 * Blog Page - Foundry Frame
 * ===========================
 * Flat, minimal blog index. Clean card layout
 * with grayscale images. Rule dividers.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Web Design & Branding Blog",
  description:
    "Insights from an Ohio web design agency on branding, websites, SEO, marketing, and creative growth strategy.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Web Design & Branding Blog",
    description:
      "Actionable insights on web design, branding, SEO, and digital growth from Foundry Frame.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Ohio Web Design & Branding Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design & Branding Blog",
    description:
      "Actionable insights on web design, branding, SEO, and digital growth from Foundry Frame.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Blog posts
   ============================================================ */
const posts: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  featured?: boolean;
}[] = [
  {
    slug: "why-branding-matters-more-than-ever",
    title: "Why Branding Matters More Than Ever in 2026",
    excerpt:
      "In a world saturated with content, your brand is the one thing that sets you apart.",
    category: "Branding",
    date: "April 10, 2026",
    image: "/images/stock/service-branding.jpg",
    featured: true,
  },
  {
    slug: "5-web-design-trends-dominating",
    title: "5 Web Design Trends Dominating This Year",
    excerpt:
      "From immersive 3D to bold typography, these trends are shaping how brands connect online.",
    category: "Web Design",
    date: "April 5, 2026",
    image: "/images/stock/service-web-design.jpg",
  },
  {
    slug: "social-media-strategy-small-business",
    title: "Social Media Strategy for Small Businesses",
    excerpt:
      "Work smarter, not harder. A practical guide to social media with limited resources.",
    category: "Social Media",
    date: "March 20, 2026",
    image: "/images/stock/service-social-media.jpg",
  },
  {
    slug: "choosing-right-creative-agency",
    title: "How to Choose the Right Creative Agency",
    excerpt:
      "The right partner transforms your brand. The wrong one wastes your budget.",
    category: "Strategy",
    date: "March 8, 2026",
    image: "/images/stock/service-advertising.jpg",
  },
];

/* ============================================================
   COMPONENT: Blog Page
   ============================================================ */
export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">
            Blog
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-ink leading-[0.9] tracking-tight max-w-4xl">
            Insights & ideas
          </h1>
          <p className="text-muted text-sm mt-6 max-w-lg">
            Design, strategy, and business insights from the team at Foundry
            Frame — practical takeaways you can use today.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="btn btn-glass min-h-10 px-5 text-sm"
            >
              Ready to work with us? Book a free call →
            </Link>
          </div>
        </div>
      </section>

      {/* =============================================
          FEATURED POST
          ============================================= */}
      {featured && (
        <section>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link
              href={`/blog/${featured.slug}`}
              className="glass-card group grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 rounded-panel"
            >
              <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[22rem] relative overflow-hidden rounded-card">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-6 lg:p-12 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-wider text-muted mb-4">
                  Featured &middot; {featured.category} — {featured.date}
                </p>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-4">
                  {featured.title}
                </h2>
                <p className="text-body text-base leading-relaxed">
                  {featured.excerpt}
                </p>
                <span className="btn btn-primary mt-6 self-start">
                  Read Article &rarr;
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* =============================================
          POSTS GRID
          ============================================= */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass-card group flex flex-col p-2 rounded-card"
              >
                <div className="aspect-[3/2] relative overflow-hidden rounded-bubble">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted mb-2">
                    {post.category} — {post.date}
                  </p>
                  <h3 className="text-xl font-heading font-semibold text-ink mb-2">
                    {post.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">{post.excerpt}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-accent-ink">
                    Read article &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AuditCallout />
    </>
  );
}
