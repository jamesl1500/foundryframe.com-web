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
import { launchBundles } from "@/lib/packages/launch";
import { BOOKING_URL } from "@/lib/analytics";
import { BUSINESS_HOURS_PHRASE, FOUNDING_DISCOUNT_PERCENT, FOUNDING_SPOTS_OPEN } from "@/lib/site-facts";

const pageTitle = "Founding Client Program for Ohio Businesses";
const pageDescription = `Foundry Frame is taking its first ${FOUNDING_SPOTS_OPEN} clients this quarter: ${FOUNDING_DISCOUNT_PERCENT}% off any launch bundle, built by the founder, with a design-approval guarantee.`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/founding",
  },
  /* Share images come from opengraph-image.tsx / twitter-image.tsx in this
     folder. This object replaces the root openGraph rather than merging with
     it, so siteName and locale are repeated here. */
  openGraph: {
    title: "Become a Foundry Frame Founding Client",
    description: pageDescription,
    url: "/founding",
    type: "website",
    siteName: "Foundry Frame",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Become a Foundry Frame Founding Client",
    description: pageDescription,
  },
};


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
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">
            {FOUNDING_SPOTS_OPEN} Founding Client spots this quarter
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-ink leading-[0.95] tracking-tight max-w-4xl mb-6">
            Be one of our first clients. Get a better deal for it.
          </h1>
          <p className="text-body text-lg max-w-2xl mb-10">
            Foundry Frame is a new, founder-led studio in Lorain, Ohio, and we&apos;re taking our first
            clients. {FOUNDING_SPOTS_OPEN} small businesses this quarter get {FOUNDING_DISCOUNT_PERCENT}% off any
            launch bundle. In return, you help us show the next client what we can do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#apply"
              className="btn btn-primary text-center"
            >
              Apply for a spot
            </a>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass text-center"
            >
              Book a free call
            </a>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-8">What you get</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass rounded-card p-8 lg:p-10">
                <h2 className="text-2xl font-heading font-bold text-ink mb-3">{benefit.title}</h2>
                <p className="text-sm text-body leading-relaxed">{benefit.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <p className="eyebrow mb-6">Founding pricing</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {launchBundles.map((bundle) => (
                <Link
                  key={bundle.slug}
                  href={`/packages/launch/${bundle.slug}`}
                  className="glass-card rounded-card p-6 lg:p-8"
                >
                  <p className="text-ink font-heading font-bold text-xl mb-3">{bundle.name}</p>
                  <p className="text-muted text-sm line-through">{formatUsd(bundle.priceValue)}</p>
                  <p className="text-accent-ink text-3xl font-heading font-bold">
                    {formatUsd(Math.round(bundle.priceValue * (1 - FOUNDING_DISCOUNT_PERCENT / 100)))}
                  </p>
                  <p className="text-muted text-xs uppercase tracking-widest mt-2">Starting price</p>
                  <p className="mt-4 text-sm font-semibold text-accent-ink">What&apos;s included &rarr;</p>
                </Link>
              ))}
            </div>
            <p className="text-muted text-xs mt-4">
              See what each bundle includes on the{" "}
              <Link href="/packages/launch" className="text-ink underline underline-offset-4">
                Launch Bundles
              </Link>{" "}
              page.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            <div>
              <p className="eyebrow mb-6">What we ask in return</p>
              <ul className="border-t border-ink/10">
                {asks.map((ask) => (
                  <li key={ask} className="py-4 border-b border-ink/10 text-ink text-sm">
                    {ask}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-6">How it works</p>
              <ol className="border-t border-ink/10">
                {steps.map((step, index) => (
                  <li key={step.title} className="py-4 border-b border-ink/10 flex gap-6">
                    <span className="text-xs text-muted pt-0.5">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-ink text-sm font-medium">{step.title}</span>
                      <span className="block text-muted text-sm">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY */}
      <section id="apply" className="py-24 lg:py-32 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow mb-6">Apply</p>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink leading-[0.95] mb-6">
                Claim a founding spot
              </h2>
              <p className="text-body text-sm leading-relaxed mb-6">
                Spots go to small businesses and brands that need a new website and are ready to start
                in the next few months. Not sure you&apos;re a fit? Apply anyway, or{" "}
                <Link href="/audit" className="text-ink underline underline-offset-4">
                  run a free audit
                </Link>{" "}
                of your current site first.
              </p>
              <p className="text-muted text-xs leading-relaxed">
                James answers calls {BUSINESS_HOURS_PHRASE}. The fastest way to talk is to{" "}
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline underline-offset-4"
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
