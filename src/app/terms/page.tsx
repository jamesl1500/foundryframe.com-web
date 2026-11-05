import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review Foundry Frame's terms of service for use of our website and creative services.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service",
    description:
      "Review Foundry Frame's terms of service for website and service usage.",
    url: "/terms",
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
    title: "Terms of Service",
    description:
      "Review Foundry Frame's terms of service for website and service usage.",
    images: ["/twitter-image"],
  },
};

export default function TermsPage() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <p className="eyebrow mb-4">
          Legal
        </p>
        <h1 className="mb-8 text-4xl font-heading font-bold text-ink sm:text-5xl">
          Terms of Service
        </h1>
        <div className="space-y-6 text-sm leading-relaxed text-ink-soft">
          <p>
            By accessing this website or engaging Foundry Frame services, you
            agree to these terms.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-ink">
            Use of Website
          </h2>
          <p>
            Website content is provided for informational purposes. You agree not
            to misuse, copy, or republish content without written permission.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-ink">
            Service Agreements
          </h2>
          <p>
            Project scope, fees, timelines, and deliverables are defined in
            written proposals or contracts and supersede general website terms
            when applicable.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-ink">
            Limitation of Liability
          </h2>
          <p>
            Foundry Frame is not liable for indirect or consequential damages
            resulting from use of this website or services, to the maximum extent
            allowed by law.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-ink">
            Contact
          </h2>
          <p>
            Questions about these terms can be sent to jlatten@foundryframe.com.
          </p>

          <p className="pt-2 text-xs uppercase tracking-wider text-muted">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </section>
  );
}
