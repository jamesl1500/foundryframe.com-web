/**
 * FAQ Page - Foundry Frame
 * ==========================
 * Flat, brutalist-minimal FAQ with native details/summary.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Foundry Frame's creative services, pricing, process, timelines, and more.",
};

/* ============================================================
   DATA
   ============================================================ */
const faqCategories = [
  {
    category: "General",
    questions: [
      {
        q: "What is Foundry Frame?",
        a: "Foundry Frame is a full-service creative design agency based in Lorain, Ohio. Founded in 2026, we specialize in branding, web design, photography, videography, social media, and digital strategy for businesses of all sizes across various industries.",
      },
      {
        q: "What industries do you work with?",
        a: "We work across a wide range of industries including fitness, fashion, real estate, hospitality, healthcare, technology, automotive, construction, food & beverage, and e-commerce. Our diverse experience allows us to bring fresh perspectives to every project.",
      },
      {
        q: "Do you work with clients outside of Ohio?",
        a: "Absolutely! While we're proudly based in Lorain, Ohio, we work with clients across the United States and internationally. Many of our services can be delivered remotely, and we're happy to travel for photography, videography, and on-site projects.",
      },
    ],
  },
  {
    category: "Services & Process",
    questions: [
      {
        q: "What services do you offer?",
        a: "We offer a comprehensive suite of creative services: Branding & Identity, Web Design & Development, Social Media Management, Graphic Design, Advertising & Paid Media, and Digital Strategy. We can tackle individual services or provide full-service packages.",
      },
      {
        q: "What does your creative process look like?",
        a: "Our process follows five key phases: Discovery (understanding your business and goals), Strategy (developing the creative plan), Create (designing and producing the work), Launch (deploying with precision), and Optimize (refining based on data and performance). This structured approach ensures every project delivers measurable results.",
      },
      {
        q: "How long does a typical project take?",
        a: "Timelines vary by project scope. A brand identity project typically takes 4-8 weeks, a custom website 6-12 weeks, and a full brand + web package 8-16 weeks. We'll provide a detailed timeline during our initial consultation.",
      },
      {
        q: "How many revisions are included?",
        a: "The number of revisions depends on your package. Our Starter package includes 1 round, Professional includes 3 rounds, and Enterprise includes unlimited revisions. Additional revision rounds can be added to any package for a fee.",
      },
    ],
  },
  {
    category: "Pricing & Payments",
    questions: [
      {
        q: "How much do your services cost?",
        a: "Our project-based packages start at $2,500 for the Starter package, $7,500 for Professional, and $15,000+ for Enterprise. We also offer custom proposals for unique projects. Visit our Packages page for detailed pricing or contact us for a custom quote.",
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes! We typically structure payments as 50% upfront to begin the project and 50% upon completion. For larger projects, we can arrange milestone-based payment schedules. We accept bank transfers, credit cards, and checks.",
      },
      {
        q: "Do you offer retainer agreements?",
        a: "Yes, we offer monthly retainer agreements for ongoing services like social media management, content creation, and marketing support. Retainers are customized based on your needs and typically offer better rates than project-based pricing.",
      },
    ],
  },
  {
    category: "Working Together",
    questions: [
      {
        q: "How do I get started?",
        a: "Simply reach out through our Contact page or email us at jlatten@foundryframe.com. We'll schedule a free discovery call to learn about your project, discuss your goals, and determine the best approach. From there, we'll provide a detailed proposal and timeline.",
      },
      {
        q: "What do you need from me to start?",
        a: "To get started, we'll need a clear brief about your project goals, target audience, and any existing brand assets. We'll provide a detailed questionnaire during the onboarding process. The more context you can share about your vision, the better results we can deliver.",
      },
      {
        q: "Will I own the final deliverables?",
        a: "Yes! Upon full payment, you receive complete ownership of all final deliverables including logos, designs, code, photos, and videos. We retain the right to showcase the work in our portfolio unless otherwise agreed.",
      },
      {
        q: "Do you provide ongoing support after project completion?",
        a: "Yes, all projects include a support period after launch: Starter includes 14 days, Professional includes 30 days, and Enterprise includes 90 days. After that, we offer ongoing support and maintenance packages, or you can engage us on an as-needed basis.",
      },
    ],
  },
] as const;

/* ============================================================
   COMPONENT
   ============================================================ */
export default function FAQPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            FAQ
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl mb-6">
            Questions & answers
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Everything you need to know about working with us.
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link
              href="/contact"
              className="text-white border-b border-white/20 pb-0.5 hover:border-white transition-colors"
            >
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      {/* =============================================
          FAQ CONTENT
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="space-y-16">
            {faqCategories.map((cat) => (
              <div key={cat.category}>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
                  {cat.category}
                </p>

                <div className="border-t border-white/10">
                  {cat.questions.map((faq) => (
                    <details
                      key={faq.q}
                      className="group border-b border-white/10"
                    >
                      <summary className="flex items-center justify-between cursor-pointer py-5 text-white text-sm font-medium hover:text-gray-300 transition-colors list-none">
                        <span className="pr-6">{faq.q}</span>
                        <span className="text-gray-500 text-lg flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <div className="pb-5 text-gray-500 text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-gray-900 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
            Reach out to our team and we&apos;ll get back to you within 24
            hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:hello@foundryframe.com"
              className="px-8 py-3 border border-white/20 text-white text-sm font-medium uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Email Directly
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
