/**
 * Individual Blog Post Page - Foundry Frame
 * ============================================
 * Flat, brutalist-minimal blog article layout.
 * Grayscale hero, clean typography, rule dividers.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.foundryframe.com";

/* ============================================================
   DATA: Blog post content
   ============================================================ */
const blogPosts: Record<
  string,
  {
    title: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
    authorRole: string;
    authorImage: string;
    image: string;
    content: string[];
  }
> = {
  "why-branding-matters-more-than-ever": {
    title: "Why Branding Matters More Than Ever in 2026",
    category: "Branding",
    date: "April 10, 2026",
    readTime: "6 min read",
    author: "James Latten",
    authorRole: "Founder & Creative Director",
    authorImage: "/james-latten.jpg",
    image: "/images/stock/service-branding.jpg",
    content: [
      "In an age where consumers are bombarded with thousands of marketing messages daily, a strong brand identity is no longer a luxury — it's a survival tool. Your brand is the first impression, the lasting memory, and the emotional connection that turns casual browsers into loyal customers.",
      "The landscape has shifted dramatically. With the rise of AI-generated content and the democratization of design tools, visual noise is at an all-time high. Brands that invest in thoughtful, strategic identity systems cut through the clutter and command attention in ways that template-based approaches simply cannot.",
      "At Foundry Frame, we've seen firsthand how a comprehensive rebrand can transform a business. When Apex Athletics came to us with an outdated visual identity, their membership growth had plateaued. After developing a bold new brand system — from logo and color palette to visual direction and digital presence — they saw a 200% increase in sign-ups within the first quarter.",
      "The key is understanding that branding goes far beyond a logo. It's the typography you choose, the way your photos are composed, the tone of your copy, the feel of your website, and the experience a customer has at every touchpoint. Consistency across all these elements builds trust, and trust builds business.",
      "Here are five reasons branding matters more than ever: First, differentiation in a crowded market is essential for survival. Second, consumers make purchasing decisions based on emotional connections, not just features. Third, strong brands command premium pricing. Fourth, cohesive branding reduces marketing costs over time by creating recognizable assets. Fifth, a well-defined brand attracts top talent who want to be part of something meaningful.",
      "If you're considering a brand refresh or building a new brand from scratch, the investment will pay dividends for years to come. The businesses that thrive in 2026 and beyond won't be the ones with the biggest budgets — they'll be the ones with the strongest brands.",
    ],
  },
  "5-web-design-trends-dominating": {
    title: "5 Web Design Trends Dominating This Year",
    category: "Web Design",
    date: "April 5, 2026",
    readTime: "5 min read",
    author: "James Latten",
    authorRole: "Founder & Creative Director",
    authorImage: "/james-latten.jpg",
    image: "/images/stock/service-web-design.jpg",
    content: [
      "Web design is evolving at a blistering pace, and staying ahead of the curve is crucial for brands that want to make an impact online. Here are the five biggest web design trends we're seeing dominate in 2026.",
      "1. Immersive 3D Experiences — Three-dimensional elements are no longer reserved for gaming and entertainment. Brands are integrating interactive 3D product viewers, animated environments, and augmented reality features directly into their websites. This creates memorable experiences that keep visitors engaged.",
      "2. Bold, Oversized Typography — Hero sections with massive, expressive typography are replacing traditional image-heavy hero banners. These typographic statements make an immediate impact and work beautifully across all screen sizes. The key is choosing fonts that have personality while maintaining readability.",
      "3. Dark Mode as Default — The dark aesthetic has moved from a toggle option to the primary design direction for many brands, especially in tech, luxury, and creative industries. Dark backgrounds make colors pop, reduce eye strain, and create an air of sophistication.",
      "4. Micro-Interactions & Scroll Animations — Subtle animations triggered by user actions create a sense of delight and encourage exploration. From button hover effects to parallax scrolling and reveal animations, these micro-interactions make websites feel alive and responsive to the user.",
      "5. AI-Personalized Layouts — Websites are becoming smarter, adapting their layout, content, and calls-to-action based on visitor behavior, preferences, and intent. This level of personalization drives significantly higher conversion rates and creates a more relevant browsing experience.",
    ],
  },
  "social-media-strategy-small-business": {
    title: "Social Media Strategy for Small Businesses: A Complete Guide",
    category: "Social Media",
    date: "March 20, 2026",
    readTime: "8 min read",
    author: "James Latten",
    authorRole: "Founder & Creative Director",
    authorImage: "/james-latten.jpg",
    image: "/images/stock/service-social-media.jpg",
    content: [
      "Social media can feel overwhelming for small business owners. With limited time and budget, how do you compete with brands that have dedicated marketing teams? The answer: work smarter, not harder.",
      "Start with one or two platforms where your target audience is most active. For B2B businesses, that's likely LinkedIn. For visual brands in fashion, food, or lifestyle, Instagram and TikTok are your best bets. For local businesses, don't underestimate the power of Facebook and Google Business Profile.",
      "Content is king, but consistency is the kingdom. It's better to post three high-quality pieces of content per week than to post daily with mediocre content. Create a content calendar, batch your content creation, and use scheduling tools to maintain a regular presence.",
      "Engagement is a two-way street. Don't just broadcast — respond to comments, engage with your audience's content, join relevant conversations, and build genuine community. The algorithm rewards authentic interaction over vanity metrics.",
      "User-generated content (UGC) is your secret weapon. Encourage customers to share their experiences with your products and repost their content (with permission). UGC is free, authentic, and drives higher trust than polished brand content.",
      "Finally, track what works. Use native analytics tools to understand what content resonates with your audience. Double down on what works and don't be afraid to experiment with new formats and ideas.",
    ],
  },
  "choosing-right-creative-agency": {
    title: "How to Choose the Right Creative Agency for Your Business",
    category: "Strategy",
    date: "March 8, 2026",
    readTime: "5 min read",
    author: "James Latten",
    authorRole: "Founder & Creative Director",
    authorImage: "/james-latten.jpg",
    image: "/images/stock/service-advertising.jpg",
    content: [
      "Choosing a creative agency is one of the most important business decisions you'll make. The right partner can transform your brand and drive significant growth. The wrong one can waste your budget and set you back months. Here's how to make the right choice.",
      "First, look at their portfolio — but look deeper than the surface. Pay attention to variety, consistency of quality, and whether their style aligns with your vision. Great agencies show range while maintaining a high standard across all work.",
      "Second, understand their process. A reputable agency will have a clear, structured methodology for how they approach projects. Ask about their discovery phase, revision process, timelines, and how they handle feedback. Red flags include vague processes or promises that sound too good to be true.",
      "Third, consider the team. You're not just hiring a company — you're working with people. Meet the team members who'll be handling your project. Do they understand your industry? Are they passionate about the work? Do they ask thoughtful questions about your business?",
      "Fourth, check references and reviews. Talk to past clients about their experience. Ask about communication, deliverable quality, adherence to timelines, and whether the results met expectations. Honest feedback from previous clients is invaluable.",
      "Finally, align on values and communication style. The best agency relationships feel like partnerships, not transactions. You should feel comfortable being honest, and they should be transparent about capabilities, costs, and potential challenges.",
    ],
  },
};

/* ============================================================
   METADATA
   ============================================================ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) return { title: "Post Not Found" };

  const url = `/blog/${slug}`;

  return {
    title: post.title,
    description: post.content[0],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.content[0],
      url,
      type: "article",
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content[0],
      images: [post.image],
    },
  };
}

/* ============================================================
   STATIC PARAMS
   ============================================================ */
export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) notFound();

  /* Related posts: exclude current */
  const related = Object.entries(blogPosts)
    .filter(([s]) => s !== slug)
    .slice(0, 3);
  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const publishedDate = new Date(post.date);
  const blogPostingStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.content[0],
    image: [post.image],
    datePublished: Number.isNaN(publishedDate.getTime())
      ? undefined
      : publishedDate.toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Foundry Frame",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    articleSection: post.category,
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* =============================================
          HERO
          ============================================= */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/blog"
            className="text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors mb-8 inline-block"
          >
            ← All Posts
          </Link>

          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            {post.category} — {post.readTime}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.05] tracking-tight max-w-4xl mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 border-t border-white/20 pt-6">
            <Image
              src={post.authorImage}
              alt={post.author}
              width={40}
              height={40}
              className="grayscale object-cover"
            />
            <div>
              <p className="text-white text-sm font-medium">{post.author}</p>
              <p className="text-gray-400 text-xs">
                {post.authorRole} · {post.date}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          ARTICLE
          ============================================= */}
      <section className="py-20 lg:py-28 bg-black">
        <article className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="space-y-6">
            {post.content.map((paragraph, index) => (
              <p
                key={index}
                className={`text-gray-400 text-lg leading-relaxed ${
                  index === 0 ? "text-gray-300 text-xl" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </section>

      {/* =============================================
          POST CTA
          ============================================= */}
      <section className="py-20 lg:py-28 bg-gray-900 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
            Work With Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight mb-4">
            Ready to apply this to your business?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
            We build custom websites and brand experiences for small businesses
            across Ohio and beyond. Book a free 30-min call and let&apos;s talk
            about your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors text-center"
            >
              Book a Free Call
            </Link>
            <Link
              href="/packages"
              className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors text-center"
            >
              See Our Packages
            </Link>
          </div>
        </div>
      </section>

      {/* =============================================
          RELATED POSTS
          ============================================= */}
      {related.length > 0 && (
        <section className="py-20 lg:py-28 bg-black border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-10">
              More Articles
            </p>
            <div className="border-t border-white/10">
              {related.map(([relSlug, relPost]) => (
                <Link
                  key={relSlug}
                  href={`/blog/${relSlug}`}
                  className="group flex items-center justify-between py-6 border-b border-white/10"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      {relPost.category} — {relPost.date}
                    </p>
                    <h3 className="text-lg font-heading font-semibold text-white group-hover:text-gray-300 transition-colors">
                      {relPost.title}
                    </h3>
                  </div>
                  <span className="text-gray-500 text-sm hidden sm:block">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =============================================
          BACK
          ============================================= */}
      <section className="py-16 bg-gray-900 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-gray-200 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    </>
  );
}
