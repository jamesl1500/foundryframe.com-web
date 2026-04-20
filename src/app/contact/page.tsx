/**
 * Contact Us Page - Foundry Frame
 * =================================
 * Flat, brutalist-minimal contact form and info.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Foundry Frame. Tell us about your project and let's create something extraordinary together. Based in Lorain, Ohio.",
};

/* ============================================================
   DATA
   ============================================================ */
const contactInfo = [
  {
    title: "Email",
    value: "jlatten@foundryframe.com",
    href: "mailto:jlatten@foundryframe.com",
  },
  {
    title: "Office",
    value: "Virtual, Lorain, OH 44053",
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

              <div className="mt-12 pt-8 ">
                <p className="text-gray-500 text-sm mb-2">
                  Quick questions? Check the FAQ.
                </p>
                <Link
                  href="/faq"
                  className="text-white text-sm border-b border-white/20 pb-0.5 hover:border-white transition-colors"
                >
                  View FAQ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
