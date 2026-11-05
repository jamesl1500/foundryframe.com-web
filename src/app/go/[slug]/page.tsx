/**
 * Ad Landing Page - Foundry Frame
 * =================================
 * No-distraction pages for ads, social posts and outreach emails: one
 * audience, one offer, one short form, and no site menu or footer links to
 * wander off through. Content lives in src/lib/funnels.ts. Kept out of
 * search results and the sitemap, since each page only makes sense next to
 * the ad that links to it.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdPageForm from "@/components/AdPageForm";
import { funnels, getFunnel } from "@/lib/funnels";

const PHONE_DISPLAY = "(216) 889-7822";
const PHONE_HREF = "tel:+12168897822";

export const dynamicParams = false;

export function generateStaticParams() {
  return funnels.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const funnel = getFunnel(slug);
  if (!funnel) return {};

  const url = `/go/${funnel.slug}`;
  return {
    title: funnel.title,
    description: funnel.description,
    alternates: { canonical: url },
    robots: { index: false, follow: false },
    openGraph: {
      title: funnel.title,
      description: funnel.description,
      url,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: funnel.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: funnel.title,
      description: funnel.description,
      images: ["/twitter-image"],
    },
  };
}

export default async function AdLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const funnel = getFunnel(slug);
  if (!funnel) notFound();

  return (
    <>
      {/* Minimal top bar: brand and phone only, no menu */}
      <div className="px-3 sm:px-6 pt-3">
        <div className="glass-nav max-w-[1200px] mx-auto rounded-full h-14 pl-5 pr-2 flex items-center justify-between">
          <span className="text-ink font-heading font-bold text-lg tracking-tight">Foundry Frame</span>
          <a href={PHONE_HREF} className="btn btn-glass min-h-10 px-4 text-sm" data-track="Ad page phone">
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      {/* HERO + FORM */}
      <section className="py-14 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6">{funnel.eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-ink leading-[0.95] tracking-tight mb-6">
              {funnel.headline}
            </h1>
            <p className="text-body text-lg mb-8">{funnel.subhead}</p>
            <ul className="border-t border-ink/10">
              {funnel.includes.map((item) => (
                <li key={item} className="py-3 border-b border-ink/10 text-ink text-sm flex gap-3">
                  <span className="text-accent-ink" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div id="get-started" className="lg:col-span-6 scroll-mt-8">
            <div className="glass rounded-card p-6 sm:p-8 lg:p-10">
              <h2 className="text-3xl font-heading font-bold text-ink mb-3">{funnel.form.heading}</h2>
              <p className="text-body text-sm mb-8">{funnel.form.body}</p>
              <AdPageForm funnel={funnel} />
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {funnel.problems.map((problem) => (
              <div key={problem.title} className="glass rounded-card p-8">
                <h2 className="text-xl font-heading font-bold text-ink mb-3">{problem.title}</h2>
                <p className="text-sm text-body leading-relaxed">{problem.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE + HOW IT WORKS */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="eyebrow mb-4">{funnel.price.label}</p>
            <p className="text-6xl font-heading font-bold text-accent-ink mb-4">{funnel.price.amount}</p>
            <p className="text-body text-sm max-w-md mb-6">{funnel.price.note}</p>
            {funnel.offer ? (
              <p className="glass-accent rounded-bubble p-4 text-sm text-ink max-w-md">{funnel.offer}</p>
            ) : null}
          </div>
          <div>
            <p className="eyebrow mb-6">How it works</p>
            <ol className="border-t border-ink/10">
              {funnel.steps.map((step, index) => (
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
      </section>

      {/* FAQ + LAST CALL */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">Questions</p>
          <dl className="border-t border-ink/10 mb-14">
            {funnel.faqs.map((faq) => (
              <div key={faq.question} className="py-5 border-b border-ink/10">
                <dt className="text-ink font-medium mb-2">{faq.question}</dt>
                <dd className="text-body text-sm leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#get-started"
            className="btn btn-primary"
          >
            {funnel.form.submitLabel}
          </a>
        </div>
      </section>

      {/* Minimal footer: legal only */}
      <footer>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row gap-3 justify-between text-xs text-muted">
          <span>© {new Date().getFullYear()} Foundry Frame · Lorain, Ohio</span>
          <span className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
