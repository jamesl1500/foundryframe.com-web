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
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&q=80",
    content: [
      "In an age where consumers are bombarded with thousands of marketing messages daily, a strong brand identity is no longer a luxury — it's a survival tool. Your brand is the first impression, the lasting memory, and the emotional connection that turns casual browsers into loyal customers.",
      "The landscape has shifted dramatically. With the rise of AI-generated content and the democratization of design tools, visual noise is at an all-time high. Brands that invest in thoughtful, strategic identity systems cut through the clutter and command attention in ways that template-based approaches simply cannot.",
      "At Foundry Frame, we've seen firsthand how a comprehensive rebrand can transform a business. When Apex Athletics came to us with an outdated visual identity, their membership growth had plateaued. After developing a bold new brand system — from logo and color palette to photography direction and digital presence — they saw a 200% increase in sign-ups within the first quarter.",
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
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
    content: [
      "Web design is evolving at a blistering pace, and staying ahead of the curve is crucial for brands that want to make an impact online. Here are the five biggest web design trends we're seeing dominate in 2026.",
      "1. Immersive 3D Experiences — Three-dimensional elements are no longer reserved for gaming and entertainment. Brands are integrating interactive 3D product viewers, animated environments, and augmented reality features directly into their websites. This creates memorable experiences that keep visitors engaged.",
      "2. Bold, Oversized Typography — Hero sections with massive, expressive typography are replacing traditional image-heavy hero banners. These typographic statements make an immediate impact and work beautifully across all screen sizes. The key is choosing fonts that have personality while maintaining readability.",
      "3. Dark Mode as Default — The dark aesthetic has moved from a toggle option to the primary design direction for many brands, especially in tech, luxury, and creative industries. Dark backgrounds make colors pop, reduce eye strain, and create an air of sophistication.",
      "4. Micro-Interactions & Scroll Animations — Subtle animations triggered by user actions create a sense of delight and encourage exploration. From button hover effects to parallax scrolling and reveal animations, these micro-interactions make websites feel alive and responsive to the user.",
      "5. AI-Personalized Layouts — Websites are becoming smarter, adapting their layout, content, and calls-to-action based on visitor behavior, preferences, and intent. This level of personalization drives significantly higher conversion rates and creates a more relevant browsing experience.",
    ],
  },
  "product-photography-tips": {
    title: "10 Product Photography Tips That Sell",
    category: "Photography",
    date: "March 28, 2026",
    readTime: "7 min read",
    author: "James Latten",
    authorRole: "Founder & Creative Director",
    authorImage: "/james-latten.jpg",
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80",
    content: [
      "Product photography is one of the most critical investments an e-commerce brand can make. Studies show that 75% of online shoppers rely on product photos when making purchasing decisions. Here are 10 tips to elevate your product photography game.",
      "1. Invest in Proper Lighting — Natural light is great, but controlled studio lighting gives you consistency. Use a key light, fill light, and backlight setup for professional results. Softboxes and diffusers help eliminate harsh shadows.",
      "2. Use a Clean, Simple Background — White backgrounds are the standard for e-commerce, but don't be afraid to experiment with complementary colored backgrounds or textured surfaces that align with your brand aesthetic.",
      "3. Show Multiple Angles — Give your customers the full picture. Shoot from the front, back, sides, top, and any unique angles that showcase important details or craftsmanship.",
      "4. Include Lifestyle Context — Pair studio shots with lifestyle images that show the product in use. This helps customers visualize how the product fits into their lives and creates an emotional connection.",
      "5. Focus on Details — Close-up shots of textures, materials, stitching, or unique features convey quality and justify pricing. These detail shots can be the tipping point for a purchase decision.",
      "6. Maintain Consistent Style — Every image should feel like it belongs to the same family. Consistent lighting, angles, and post-processing create a cohesive catalog that builds brand trust.",
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
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920&q=80",
    content: [
      "Social media can feel overwhelming for small business owners. With limited time and budget, how do you compete with brands that have dedicated marketing teams? The answer: work smarter, not harder.",
      "Start with one or two platforms where your target audience is most active. For B2B businesses, that's likely LinkedIn. For visual brands in fashion, food, or lifestyle, Instagram and TikTok are your best bets. For local businesses, don't underestimate the power of Facebook and Google Business Profile.",
      "Content is king, but consistency is the kingdom. It's better to post three high-quality pieces of content per week than to post daily with mediocre content. Create a content calendar, batch your content creation, and use scheduling tools to maintain a regular presence.",
      "Engagement is a two-way street. Don't just broadcast — respond to comments, engage with your audience's content, join relevant conversations, and build genuine community. The algorithm rewards authentic interaction over vanity metrics.",
      "User-generated content (UGC) is your secret weapon. Encourage customers to share their experiences with your products and repost their content (with permission). UGC is free, authentic, and drives higher trust than polished brand content.",
      "Finally, track what works. Use native analytics tools to understand what content resonates with your audience. Double down on what works and don't be afraid to experiment with new formats and ideas.",
    ],
  },
  "video-content-brand-storytelling": {
    title: "How Video Content is Revolutionizing Brand Storytelling",
    category: "Videography",
    date: "March 14, 2026",
    readTime: "6 min read",
    author: "James Latten",
    authorRole: "Founder & Creative Director",
    authorImage: "/james-latten.jpg",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80",
    content: [
      "Video content has become the dominant force in digital marketing, and it's completely changing how brands tell their stories. With attention spans shorter than ever, video offers the perfect medium to capture, engage, and convert audiences in seconds.",
      "The numbers speak for themselves: video content generates 1200% more shares than text and images combined. Websites with video see 80% higher conversion rates. And 96% of consumers have watched an explainer video to learn about a product or service.",
      "But effective brand video isn't about production value alone — it's about storytelling. The most successful brand videos connect emotionally with viewers by focusing on the human element: the people behind the brand, the customer experience, and the impact the product or service has on real lives.",
      "Short-form video on platforms like TikTok, Instagram Reels, and YouTube Shorts has democratized video marketing. You don't need a Hollywood budget to create compelling video content. Authenticity and creativity often outperform polish.",
      "That said, there's still a crucial role for cinematic brand films. A well-produced 60-90 second brand video serves as your digital handshake — it tells the world who you are, what you stand for, and why they should care. This hero content anchors your marketing and sets the tone for everything else.",
      "Whether you're creating quick social clips or cinematic brand stories, the key is to start with a clear narrative structure: establish the problem, introduce the solution (your brand), and inspire the viewer to take action.",
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
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
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

  return {
    title: post.title,
    description: post.content[0],
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

  return (
    <>
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
