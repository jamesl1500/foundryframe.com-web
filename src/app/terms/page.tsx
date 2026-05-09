import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review Foundry Frame's terms of service for use of our website and creative services.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <section className="bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">
          Legal
        </p>
        <h1 className="mb-8 text-4xl font-heading font-bold text-white sm:text-5xl">
          Terms of Service
        </h1>
        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <p>
            By accessing this website or engaging Foundry Frame services, you
            agree to these terms.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            Use of Website
          </h2>
          <p>
            Website content is provided for informational purposes. You agree not
            to misuse, copy, or republish content without written permission.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            Service Agreements
          </h2>
          <p>
            Project scope, fees, timelines, and deliverables are defined in
            written proposals or contracts and supersede general website terms
            when applicable.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            Limitation of Liability
          </h2>
          <p>
            Foundry Frame is not liable for indirect or consequential damages
            resulting from use of this website or services, to the maximum extent
            allowed by law.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            Contact
          </h2>
          <p>
            Questions about these terms can be sent to jlatten@foundryframe.com.
          </p>

          <p className="pt-2 text-xs uppercase tracking-wider text-gray-500">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </section>
  );
}
