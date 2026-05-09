import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Foundry Frame's privacy policy, including how we collect, use, and protect personal information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <section className="bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">
          Legal
        </p>
        <h1 className="mb-8 text-4xl font-heading font-bold text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <p>
            Foundry Frame respects your privacy. This policy explains how we
            collect, use, and protect the information you share with us through
            this website.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            Information We Collect
          </h2>
          <p>
            We may collect your name, email address, company information, and
            message details when you submit our contact form or communicate with
            us directly.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            How We Use Information
          </h2>
          <p>
            We use submitted information to respond to inquiries, provide
            services, improve our website experience, and communicate project
            updates.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            Data Sharing
          </h2>
          <p>
            We do not sell personal information. We only share data with trusted
            service providers when required to operate our website or deliver
            services.
          </p>

          <h2 className="pt-4 text-xl font-heading font-semibold text-white">
            Contact
          </h2>
          <p>
            For privacy questions, contact us at jlatten@foundryframe.com.
          </p>

          <p className="pt-2 text-xs uppercase tracking-wider text-gray-500">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </section>
  );
}
