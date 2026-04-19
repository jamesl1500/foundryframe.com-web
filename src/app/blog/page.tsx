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
import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on design, branding, marketing, and creative industry trends from the Foundry Frame team.",
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
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    featured: true,
  },
  {
    slug: "5-web-design-trends-dominating",
    title: "5 Web Design Trends Dominating This Year",
    excerpt:
      "From immersive 3D to bold typography, these trends are shaping how brands connect online.",
    category: "Web Design",
    date: "April 5, 2026",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    slug: "product-photography-tips",
    title: "10 Product Photography Tips That Sell",
    excerpt:
      "75% of online shoppers rely on product photos. Here's how to make yours count.",
    category: "Photography",
    date: "March 28, 2026",
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80",
  },
  {
    slug: "social-media-strategy-small-business",
    title: "Social Media Strategy for Small Businesses",
    excerpt:
      "Work smarter, not harder. A practical guide to social media with limited resources.",
    category: "Social Media",
    date: "March 20, 2026",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
  },
  {
    slug: "video-content-brand-storytelling",
    title: "How Video is Revolutionizing Brand Storytelling",
    excerpt:
      "Video generates 1200% more shares than text and images combined.",
    category: "Videography",
    date: "March 14, 2026",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
  },
  {
    slug: "choosing-right-creative-agency",
    title: "How to Choose the Right Creative Agency",
    excerpt:
      "The right partner transforms your brand. The wrong one wastes your budget.",
    category: "Strategy",
    date: "March 8, 2026",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
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
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Blog
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Insights & ideas
          </h1>
        </div>
      </section>

      {/* =============================================
          FEATURED POST
          ============================================= */}
      {featured && (
        <section className="bg-black border-b border-white/10">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10"
          >
            <div className="aspect-[4/3] lg:aspect-auto relative overflow-hidden bg-black">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="p-8 lg:p-16 flex flex-col justify-center bg-black">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                {featured.category} — {featured.date}
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4 group-hover:text-gray-300 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {featured.excerpt}
              </p>
              <span className="mt-6 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-400 self-start pb-1">
                Read Article
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* =============================================
          POSTS GRID
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="border-t border-white/10">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-white/10"
              >
                {/* Image */}
                <div className="md:col-span-3 aspect-[4/3] md:aspect-[3/2] relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-9 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    {post.category} — {post.date}
                  </p>
                  <h3 className="text-xl font-heading font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          NEWSLETTER
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
            Stay in the loop
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
            Subscribe for the latest insights, project showcases,
            and creative inspiration.
          </p>
          <NewsletterForm
            variant="inline"
            className="max-w-md mx-auto"
            placeholder="Enter your email"
          />
        </div>
      </section>
    </>
  );
}
