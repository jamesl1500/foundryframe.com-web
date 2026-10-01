/**
 * Founding Clients - Foundry Frame
 * ==================================
 * Landing page for the Founding Client offer: a small number of first
 * clients who get 20% off a launch bundle (plus a design-approval guarantee) in
 * exchange for feedback and a case study. Short application form.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import FoundingForm from "@/components/FoundingForm";
import { BOOKING_URL } from "@/lib/analytics";
import { BUSINESS_HOURS_PHRASE, FOUNDING_DISCOUNT_PERCENT, FOUNDING_SPOTS_OPEN } from "@/lib/site-facts";

const pageTitle = "Founding Client Program | New Website for Your Business";
const pageDescription = `Foundry Frame is taking its first ${FOUNDING_SPOTS_OPEN} clients this quarter: 20% off any launch bundle, built by the founder, with a design-approval guarantee.`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/founding",
  },
  openGraph: {
    title: "Become a Foundry Frame Founding Client",
    description: pageDescription,
    url: "/founding",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame Founding Client program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Become a Foundry Frame Founding Client",
    description: pageDescription,
    images: ["/twitter-image"],
  },
};

/* Launch bundle starting prices (keep in sync with /packages/launch). */
const bundlePrices = [
  { name: "Ignite", price: 2500 },
  { name: "Velocity", price: 6500 },
  { name: "Ascend", price: 14000 },
  { name: "Apex", price: 28000 },
] as const;

const formatUsd = (value: number) => `$${value.toLocaleString("en-US")}`;

const benefits = [
  {
    title: `${FOUNDING_DISCOUNT_PERCENT}% off any launch bundle`,
    body: "Founding pricing on every launch bundle: a custom website, brand identity, and months of maintenance in one package.",
  },
  {
    title: "Design-approval guarantee",
    body: "If you don't love your homepage design after two revision rounds, you walk away and owe only the deposit.",
  },
  {
    title: "Pay in installments",
    body: "Split your project into 2 to 4 payments instead of paying it all up front.",
  },
  {
    title: "Built by the founder",
    body: "No account managers or hand-offs. James designs and codes your site himself, and you talk to him directly at every step.",
  },
] as const;

const asks = [
  "A written testimonial and a short video testimonial",
  "A Google review",
  "Permission for a full case study with before-and-after numbers",
  "Your logo on our site",
] as const;

const steps = [
  { title: "Apply", body: "Fill out the short form below. It takes about a minute." },
  { title: "Talk", body: "James reviews it and sets up a free call to scope your project." },
  { title: "Build", body: "If it's a fit, you get a written proposal and timeline, then we start." },
] as const;

export default function FoundingPage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
            {FOUNDING_SPOTS_OPEN} Founding Client spots this quarter
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-[0.95] tracking-tight max-w-4xl mb-6">
            Be one of our first clients. Get a better deal for it.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-10">
            Foundry Frame is a new, founder-led studio in Lorain, Ohio, and we&apos;re taking our first
            clients. {FOUNDING_SPOTS_OPEN} small businesses this quarter get {FOUNDING_DISCOUNT_PERCENT}% off any
            launch bundle. In return, you help us show the next client what we can do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#apply"
              className="px-8 py-4 bg-accent text-black font-bold text-sm uppercase tracking-wider hover:bg-accent-glow transition-colors text-center"
            >
              Apply for a spot
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors text-center"
            >
              Book a free call
            </a>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-24 lg:py-32 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">What you get</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-black p-8 lg:p-10">
                <h2 className="text-2xl font-heading font-bold text-white mb-3">{benefit.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{benefit.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Founding pricing</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {bundlePrices.map((bundle) => (
                <div key={bundle.name} className="bg-black p-6 lg:p-8">
                  <p className="text-white font-heading font-bold text-xl mb-3">{bundle.name}</p>
                  <p className="text-gray-500 text-sm line-through">{formatUsd(bundle.price)}</p>
                  <p className="text-accent-glow text-3xl font-heading font-bold">
                    {formatUsd(Math.round(bundle.price * (1 - FOUNDING_DISCOUNT_PERCENT / 100)))}
                  </p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-2">Starting price</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-4">
              See what each bundle includes on the{" "}
              <Link href="/packages/launch" className="text-white underline underline-offset-4">
                Launch Bundles
              </Link>{" "}
              page.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">What we ask in return</p>
              <ul className="border-t border-white/10">
                {asks.map((ask) => (
                  <li key={ask} className="py-4 border-b border-white/10 text-white text-sm">
                    {ask}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">How it works</p>
              <ol className="border-t border-white/10">
                {steps.map((step, index) => (
                  <li key={step.title} className="py-4 border-b border-white/10 flex gap-6">
                    <span className="text-xs text-gray-600 pt-0.5">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-white text-sm font-medium">{step.title}</span>
                      <span className="block text-gray-500 text-sm">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY */}
      <section id="apply" className="py-24 lg:py-32 bg-black scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Apply</p>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white leading-[0.95] mb-6">
                Claim a founding spot
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Spots go to small businesses and brands that need a new website and are ready to start
                in the next few months. Not sure you&apos;re a fit? Apply anyway, or{" "}
                <Link href="/audit" className="text-white underline underline-offset-4">
                  run a free audit
                </Link>{" "}
                of your current site first.
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                James answers calls {BUSINESS_HOURS_PHRASE}. The fastest way to talk is to{" "}
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline underline-offset-4"
                >
                  book a time
                </a>
                .
              </p>
            </div>
            <div className="lg:col-span-8">
              <FoundingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
