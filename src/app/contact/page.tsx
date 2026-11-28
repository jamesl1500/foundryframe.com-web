/**
 * Contact Us Page - Foundry Frame
 * =================================
 * Flat, brutalist-minimal contact form and info.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbList, ORGANIZATION_ID, webPage } from "@/lib/seo/schema";
import { BOOKING_URL } from "@/lib/analytics";
import {
  BUSINESS_HOURS_LINES,
  BUSINESS_HOURS_PHRASE,
  OPTIONAL_CALL_LABEL,
  PROPOSAL_CTA_LABEL,
} from "@/lib/site-facts";

export const metadata: Metadata = {
  title: "Contact Us | Ohio Web Design Agency",
  description:
    "Get in touch with Foundry Frame. Tell us about your project and let's create something extraordinary together. Based in Lorain, Ohio.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Our Ohio Web Design Team",
    description:
      "Tell us about your website, branding, or growth goals and get a written proposal. No meetings required.",
    url: "/contact",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Ohio Web Design & Branding Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Our Ohio Web Design Team",
    description:
      "Tell us about your website, branding, or growth goals and get a written proposal. No meetings required.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA
   ============================================================ */
const contactInfo = [
  {
    title: "Phone",
    value: "(216) 889-7822",
    href: "tel:+12168897822",
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
    value: BUSINESS_HOURS_LINES.join(" · "),
    href: BOOKING_URL,
  },
] as const;

/* ============================================================
   COMPONENT
   ============================================================ */
export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage("ContactPage", {
            path: "/contact",
            name: "Contact Foundry Frame",
            description:
              "Contact Foundry Frame, a web design and branding agency in Lorain, Ohio. Send a project inquiry and get a written proposal, or book an optional 15-minute call.",
            extra: { mainEntity: { "@id": ORGANIZATION_ID } },
          }),
          breadcrumbList([{ name: "Contact", path: "/contact" }]),
        ]}
      />
      {/* =============================================
          HERO
          ============================================= */}
      <PageHero
        kicker="Contact Our Ohio Web Design Agency"
        eyebrow={<>Contact</>}
        title={
          <>
            Let&apos;s{" "}
            <em className="serif-accent text-molten-deep">talk</em>
          </>
        }
        intro={
          <>
            <p>
              Have a project in mind? We&apos;d love to hear about it. Fill out the
              form below or reach out directly — we typically respond within 24
              hours, and there&apos;s never any pressure to commit.
            </p>
            <p>
              Everything runs in writing: a written proposal, progress in your
              client portal, and short recorded walkthroughs instead of status
              meetings. Rather talk first? James takes optional 15-minute calls{" "}
              {BUSINESS_HOURS_PHRASE}.
            </p>
          </>
        }
        actions={
          <>
            <Link
              href="#start"
              className="btn btn-primary min-h-13 px-7"
            >
              {PROPOSAL_CTA_LABEL}
            </Link>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass min-h-13 px-7"
            >
              {OPTIONAL_CALL_LABEL}
            </a>
          </>
        }
        photo="coffeeCounter"
        photoLabel="Reply within 24h"
      />

      {/* =============================================
          FORM & INFO
          ============================================= */}
      <section id="start" className="py-24 lg:py-32 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* --- Form --- */}
            <div className="lg:col-span-7">
              <p className="eyebrow mb-8 border-b border-ink/10">
                Project Inquiry
              </p>

              <ContactForm />
            </div>

            {/* --- Sidebar --- */}
            <div className="lg:col-span-5">
              <p className="eyebrow mb-8 border-b border-ink/10">
                Details
              </p>

              <div className="border-t border-ink/10">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex justify-between items-start py-5 border-b border-ink/10 group"
                  >
                    <span className="text-xs uppercase tracking-wider text-muted">
                      {info.title}
                    </span>
                    <span className="text-ink text-sm text-right group-hover:text-ink-soft transition-colors">
                      {info.value}
                    </span>
                  </a>
                ))}
              </div>

              <div className="glass rounded-card mt-12 p-6">
                <p className="eyebrow mb-6 border-b border-ink/10">
                  Common Questions
                </p>
                <div className="border-t border-ink/10">
                  {[
                    {
                      q: "How much does a custom website cost?",
                      a: "Website packages start at $1,500 for a focused site. Most small business websites land between $2,500 and $3,500 depending on scope. Every number is a starting point — you'll get the exact figure in a written proposal, with no obligation.",
                    },
                    {
                      q: "How quickly can we get started?",
                      a: "Once the deposit is in, we typically kick off within a week. The Spark launches in 4–6 weeks and larger builds take up to 12. We take on a limited number of projects each quarter, so the sooner you send your details, the sooner we can reserve your slot.",
                    },
                    {
                      q: "What does the process look like?",
                      a: "Proposal → Deposit → Build with written updates → Approve and launch. You follow every milestone in your Binx client portal, design reviews come as short recorded walkthroughs instead of meetings, and nothing moves forward without your sign-off. An optional 15-minute call is there if you want one.",
                    },
                  ].map(({ q, a }) => (
                    <details key={q} className="group border-b border-ink/10">
                      <summary className="flex items-center justify-between cursor-pointer py-4 text-ink text-sm font-medium hover:text-ink-soft transition-colors list-none">
                        <span className="pr-4">{q}</span>
                        <span className="text-muted flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="pb-4 text-muted text-sm leading-relaxed">
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
      <AuditCallout />
    </>
  );
}
