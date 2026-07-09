/**
 * Contact Us Page - Foundry Frame
 * =================================
 * Flat, brutalist-minimal contact form and info.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Our Ohio Web Design Team",
  description:
    "Get in touch with Foundry Frame. Tell us about your project and let's create something extraordinary together. Based in Lorain, Ohio.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Our Ohio Web Design Team",
    description:
      "Book a discovery call and tell us about your website, branding, or growth goals.",
    url: "/contact",
    type: "website",
    images: [
      {
        url: "/james-latten.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Foundry Frame",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Our Ohio Web Design Team",
    description:
      "Book a discovery call and tell us about your website, branding, or growth goals.",
    images: ["/james-latten.jpg"],
  },
};

/* ============================================================
   DATA
   ============================================================ */
const contactInfo = [
  {
    title: "Phone",
    value: "(440) 921-8245",
    href: "tel:+14409218245",
  },
  {
    title: "Email",
    value: "jlatten@foundryframe.com",
    href: "mailto:jlatten@foundryframe.com",
  },
  {
    title: "Office",
    value: "Lorain, OH 44053",
    href: "#",
  },
  {
    title: "Hours",
    value: "Mon – Fri: 9:00 AM – 6:00 PM EST",
    href: "#",
  },
] as const;

/* ============================================================
   COMPONENT
   ============================================================ */
export default function ContactPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Contact
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl mb-6">
            Let&apos;s talk
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Have a project in mind? Fill out the form below or reach out
            directly — we typically respond within 24 hours.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="https://calendly.com/jlatten-foundryframe/30min"
              className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors text-center"
            >
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* =============================================
          FORM & INFO
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* --- Form --- */}
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">
                Project Inquiry
              </p>

              <ContactForm />
            </div>

            {/* --- Sidebar --- */}
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">
                Details
              </p>

              <div className="border-t border-white/10">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex justify-between items-start py-5 border-b border-white/10 group"
                  >
                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      {info.title}
                    </span>
                    <span className="text-white text-sm text-right group-hover:text-gray-300 transition-colors">
                      {info.value}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Common Questions
                </p>
                <div className="border-t border-white/10">
                  {[
                    {
                      q: "How much does a custom website cost?",
                      a: "Projects start at $1,500 for a focused site. Most small business websites fall between $2,500–$7,500 depending on scope. We'll give you an exact number after a 30-min call.",
                    },
                    {
                      q: "How quickly can we get started?",
                      a: "Once the deposit is in, we typically kick off within a week. Full build timelines are 6–12 weeks. We currently have limited Q3 availability.",
                    },
                    {
                      q: "What does the process look like?",
                      a: "Discovery → Strategy → Design → Build → Launch. You're involved at each stage and we don't move forward without your sign-off. No surprises.",
                    },
                  ].map(({ q, a }) => (
                    <details key={q} className="group border-b border-white/10">
                      <summary className="flex items-center justify-between cursor-pointer py-4 text-white text-sm font-medium hover:text-gray-300 transition-colors list-none">
                        <span className="pr-4">{q}</span>
                        <span className="text-gray-500 flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="pb-4 text-gray-500 text-sm leading-relaxed">
                        {a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
