/**
 * Free Website Audit - Foundry Frame
 * =====================================
 * Lead-gen flow: visitors submit a URL, unlock a live audit powered by
 * our Python audit platform (AWS), and get tailored service recommendations.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import AuditForm from "@/components/AuditForm";

export const metadata: Metadata = {
  title: "Free Website Audit | Foundry Frame",
  description:
    "Get a free, instant audit of your website. See exactly what's holding your SEO, performance, and design back — and how Foundry Frame can fix it.",
  alternates: {
    canonical: "/audit",
  },
  openGraph: {
    title: "Free Website Audit | Foundry Frame",
    description:
      "See exactly what's holding your website back — SEO, performance, design, and more — in one free scan.",
    url: "/audit",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Creative Design Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Website Audit | Foundry Frame",
    description:
      "See exactly what's holding your website back — SEO, performance, design, and more — in one free scan.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: How It Works
   ============================================================ */
const steps = [
  {
    number: "01",
    title: "Enter Your URL",
    description: "Tell us the website you want scanned. That's it to get started.",
  },
  {
    number: "02",
    title: "We Scan Your Site",
    description:
      "Our audit engine crawls your site and analyzes SEO, performance, design, and accessibility in real time.",
  },
  {
    number: "03",
    title: "Get Your Results",
    description:
      "See your score, the exact issues we found, and what to fix first — no fluff.",
  },
  {
    number: "04",
    title: "We Recommend A Fix",
    description:
      "Based on your results, we point you to the specific services or packages that solve your biggest problems.",
  },
] as const;

/* ============================================================
   COMPONENT
   ============================================================ */
export default function AuditPage() {
  return (
    <>
      {/* =============================================
          HERO + FORM
          ============================================= */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-black border-b border-white/10">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-5">
            Free Website Audit
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] mb-6">
            What&apos;s actually wrong with your website?
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Drop your URL in below. In about a minute, you&apos;ll see your site&apos;s
            SEO, performance, and design score — plus exactly how Foundry Frame
            can help fix it.
          </p>

          <div className="max-w-2xl mx-auto text-left">
            <AuditForm />
          </div>
        </div>
      </section>

      {/* =============================================
          HOW IT WORKS
          ============================================= */}
      <section className="py-20 lg:py-28 bg-black border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-10 text-center">
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {steps.map((step) => (
              <div key={step.number} className="bg-black p-6">
                <p className="text-3xl font-heading font-bold text-accent mb-3">
                  {step.number}
                </p>
                <h3 className="text-white font-heading font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
