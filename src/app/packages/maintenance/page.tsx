/**
 * Maintenance Plans - Foundry Frame
 * ===============================
 * Three managed maintenance tiers: Steady, Active, Elite.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Maintenance Plans",
  description:
    "Managed website maintenance plans from Foundry Frame. Keep your site fast, secure, and continuously improving — without lifting a finger.",
};

/* ============================================================
   DATA: Maintenance Plans
   ============================================================ */
const plans = [
  {
    number: "01",
    name: "Steady",
    price: "$99/mo",
    tagline: "Stay protected without lifting a finger.",
    description:
      "Steady is the essential layer of protection every business website needs. We handle software updates, monitor for security threats, and watch your uptime around the clock — so your site stays live and secure while you stay focused on what you do best. Think of Steady as the lock on your digital front door.",
    features: [
      "Monthly software and plugin updates",
      "Basic security monitoring and firewall protection",
      "24/7 uptime monitoring with instant alerts",
      "Monthly offsite backup",
      "Quarterly performance report",
      "Email support with 48-hour response guarantee",
    ],
    cta: "Start Steady",
    badge: null,
    variant: "dark" as const,
  },
  {
    number: "02",
    name: "Active",
    price: "$249/mo",
    tagline: "Your site, always improving. Never stagnant.",
    description:
      "Active clients don't just keep their site alive — they keep it growing. With bi-weekly updates, included developer time, and content change requests built right into the plan, Active is for businesses that treat their website as a living, working sales tool. New team member to add? Service description to update? Just send the changes.",
    features: [
      "Bi-weekly software and plugin updates",
      "Advanced security monitoring and malware scanning",
      "Weekly offsite backups",
      "1 included developer hour per month",
      "Up to 2 content updates per month",
      "Monthly performance report with actionable recommendations",
      "Email and chat support with 24-hour response",
    ],
    cta: "Start Active",
    badge: "Most Popular",
    variant: "light" as const,
  },
  {
    number: "03",
    name: "Elite",
    price: "$499/mo",
    tagline: "Mission-critical support for businesses that can't afford downtime.",
    description:
      "Elite is white-glove digital site management for businesses where every minute of downtime is lost revenue. Daily backups, weekly updates, emergency recovery coverage, and priority phone support — plus 3 included development hours per month. Elite clients don't have a maintenance plan. They have a retained digital team.",
    features: [
      "Weekly software updates and security patches",
      "Enterprise-grade security monitoring and intrusion detection",
      "Daily offsite backups with one-click restore",
      "3 included developer hours per month",
      "Up to 6 content updates per month",
      "Monthly + weekly performance reports",
      "Emergency site recovery — included at no additional charge",
      "Priority phone and email support — 4-hour response SLA",
    ],
    cta: "Start Elite",
    badge: "White Glove",
    variant: "dark-accent" as const,
  },
];

/* ============================================================
   COMPONENT: Maintenance Plans Page
   ============================================================ */
export default function MaintenancePlansPage() {
  return (
    <>
      {/* =============================================
          HERO
          ============================================= */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/packages"
            className="text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:text-gray-400 transition-colors mb-6 inline-block"
          >
            &larr; All Packages
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
            Maintenance Plans
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-white leading-[0.9] tracking-tight max-w-4xl">
            Launch is day one
          </h1>
          <p className="text-gray-500 text-sm mt-6 max-w-lg">
            A site that goes unmaintained gets hacked, slows down, breaks on
            updates, and falls in search rankings. Our plans keep your digital
            presence fast, secure, and continuously improving — without you ever
            having to think about it.
          </p>
        </div>
      </section>

      {/* =============================================
          PLAN OVERVIEW STRIP
          ============================================= */}
      <section className="bg-black border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {plans.map((p) => (
              <div key={`strip-${p.number}`} className="py-6 px-4 lg:px-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 block mb-1">
                  {p.number}
                </span>
                <span className="text-white font-heading font-bold text-base sm:text-lg block">
                  {p.name}
                </span>
                <span className="text-gray-500 text-xs mt-0.5 block">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          PLAN CARDS — 3 columns
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10">

            {/* ---- Steady (dark) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Plan 01</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{plans[0].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{plans[0].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{plans[0].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{plans[0].description}</p>
              <div className="border-t border-white/10 flex-1">
                {plans[0].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {plans[0].cta}
              </Link>
            </div>

            {/* ---- Active (light / highlighted) ---- */}
            <div className="bg-white p-8 lg:p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Plan 02</span>
                <span className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 font-bold">
                  Most Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{plans[1].name}</p>
              <div className="text-4xl font-heading font-bold text-black mb-2">{plans[1].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{plans[1].tagline}&rdquo;</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">{plans[1].description}</p>
              <div className="border-t border-black/10 flex-1">
                {plans[1].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-black/10">
                    <span className="text-gray-400 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-700 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors"
              >
                {plans[1].cta}
              </Link>
            </div>

            {/* ---- Elite (dark + white accent top border) ---- */}
            <div className="bg-black p-8 lg:p-10 flex flex-col border-t-2 border-white">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Plan 03</span>
                <span className="text-[10px] uppercase tracking-widest border border-white/30 text-gray-400 px-3 py-1">
                  White Glove
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{plans[2].name}</p>
              <div className="text-4xl font-heading font-bold text-white mb-2">{plans[2].price}</div>
              <p className="text-xs italic text-gray-500 mb-4">&ldquo;{plans[2].tagline}&rdquo;</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{plans[2].description}</p>
              <div className="border-t border-white/10 flex-1">
                {plans[2].features.map((f) => (
                  <div key={f} className="flex items-start gap-3 py-3 border-b border-white/10">
                    <span className="text-gray-600 mt-0.5 shrink-0">&mdash;</span>
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="block text-center mt-8 px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {plans[2].cta}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32 bg-black border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[0.95] mb-6">
              Already a client?
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-lg">
              Maintenance plans can be added to any existing Foundry Frame
              website. Get in touch and we&apos;ll get you set up on the right
              plan.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
