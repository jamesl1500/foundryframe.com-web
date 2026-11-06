/**
 * Web Design & Development Service - Foundry Frame
 * ===================================================
 * Flagship service page. Deliberately the most detailed of the six —
 * web design/development is the agency's primary selling point.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import AuditCallout from "@/components/AuditCallout";
import Image from "next/image";
import Link from "next/link";
import SparkSpotlight from "@/components/SparkSpotlight";
import { websitePackages } from "@/lib/packages/website";
import { citiesOf, locations } from "@/lib/seo/locations";

const siteUrl = "https://www.foundryframe.com";

export const metadata: Metadata = {
  title: "Web Design & Development Services",
  description:
    "Custom web design and development from Foundry Frame. Hand-coded, fast, mobile-first, SEO-ready websites built to convert, starting at $1,500. No templates.",
  alternates: {
    canonical: "/services/web-design",
  },
  openGraph: {
    title: "Web Design & Development Services",
    description:
      "Custom-coded, conversion-focused websites built with Next.js and React. No templates, no page builders — just fast, mobile-first sites engineered to turn visitors into clients.",
    url: "/services/web-design",
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
    title: "Web Design & Development Services",
    description:
      "Custom-coded, conversion-focused websites built with Next.js and React. No templates, no page builders — just fast, mobile-first sites engineered to turn visitors into clients.",
    images: ["/twitter-image"],
  },
};

/* ============================================================
   DATA: Capabilities
   ============================================================ */
const capabilities = [
  {
    title: "Custom Design",
    description:
      "Every layout is designed from a blank canvas around your brand, your content, and your customers — never dropped into a theme someone else already used.",
  },
  {
    title: "Hand-Coded Development",
    description:
      "We write real code with Next.js and React instead of assembling drag-and-drop page builders. That means faster load times, cleaner markup, and a site that doesn't fall apart when you need to change something later.",
  },
  {
    title: "Mobile-First & Responsive",
    description:
      "Every page is designed and tested for phones first, then scaled up — because most of your visitors are finding you on a phone, not a desktop.",
  },
  {
    title: "CMS Integration",
    description:
      "Update your own copy, images, and blog posts without touching code or calling us. We wire up a content system that matches how you actually work.",
  },
  {
    title: "E-Commerce Development",
    description:
      "Custom storefronts built on headless commerce architecture — full control over checkout flow, product presentation, and performance, without an off-the-shelf template capping what's possible.",
  },
  {
    title: "Technical SEO Foundations",
    description:
      "Structured data, XML sitemaps, semantic markup, canonical tags, and Core Web Vitals — the technical groundwork search engines actually look for, built in from day one, not bolted on after launch.",
  },
  {
    title: "Performance Optimization",
    description:
      "Image optimization, code-splitting, and caching strategy tuned so your site loads fast on a slow connection — speed is a ranking factor and a conversion factor.",
  },
  {
    title: "Accessibility",
    description:
      "Semantic HTML, keyboard navigation, and color contrast that meets WCAG guidelines — so the site works for every visitor, not just the ones on a fast connection with perfect vision.",
  },
  {
    title: "Third-Party Integrations",
    description:
      "CRM connections, email marketing platforms, booking calendars, payment processors — we plug your website into the tools you already run your business on.",
  },
] as const;

/* ============================================================
   DATA: Types of websites we build
   ============================================================ */
const websiteTypes = [
  {
    title: "Business & Brochure Sites",
    description:
      "The digital front door for service businesses — clear positioning, credibility signals, and a straight path to contact you.",
  },
  {
    title: "E-Commerce Storefronts",
    description:
      "Custom online stores built for browsing and buying, not just listing products.",
  },
  {
    title: "Landing Pages & Campaigns",
    description:
      "High-conversion single-purpose pages built to support a specific ad campaign, launch, or offer.",
  },
  {
    title: "Web Applications & Portals",
    description:
      "Logged-in dashboards, booking systems, and custom tools beyond a standard content site.",
  },
  {
    title: "Portfolio & Creative Sites",
    description:
      "Visually driven sites for brands where the work itself needs to be the hero.",
  },
] as const;

/* ============================================================
   DATA: Technology stack
   ============================================================ */
const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Headless CMS",
  "Structured Data (Schema.org)",
] as const;

/* ============================================================
   DATA: Process
   ============================================================ */
const process = [
  {
    step: "Discovery & Requirements",
    description:
      "We learn your business, your customers, and what the site actually needs to accomplish — before a single pixel is designed.",
  },
  {
    step: "Sitemap & Information Architecture",
    description:
      "We map every page and how they connect, so navigation makes sense before we design anything.",
  },
  {
    step: "Wireframing",
    description:
      "Low-fidelity layouts establish structure and content priority, so we agree on what goes where before investing in visual design.",
  },
  {
    step: "Visual Design",
    description:
      "Full custom design of every page, built on your brand system — typography, color, imagery, and layout, all intentional.",
  },
  {
    step: "Development",
    description:
      "We build the approved design as a real, hand-coded website — responsive, accessible, and fast from the first commit.",
  },
  {
    step: "QA & Cross-Browser Testing",
    description:
      "Every page is tested across devices and browsers, checked for broken links, and reviewed against the original goals before it ever goes live.",
  },
  {
    step: "Launch & Training",
    description:
      "We deploy the site, connect analytics, and walk you through how to make updates — so you're never locked out of your own website.",
  },
] as const;

/* ============================================================
   DATA: FAQ
   ============================================================ */
const faqs = [
  {
    q: "How long does a website project take?",
    a: "Most custom websites take 6–12 weeks from kickoff to launch, depending on scope. A 5-page Spark site moves faster than a 20-page Architect build with e-commerce and integrations. You'll get a specific timeline after the discovery call.",
  },
  {
    q: "Will I own the website and the code?",
    a: "Yes. Upon full payment, you own everything — the code, the design files, and the content. There's no vendor lock-in and no proprietary platform holding your site hostage.",
  },
  {
    q: "Do you build WordPress websites?",
    a: "Yes, when it's the right fit. Most of our sites are hand-coded with Next.js and React for speed and security, but we also build on WordPress when it makes more sense, for example if your team already knows it, you need a particular plugin, or you're keeping an existing WordPress site. We'll recommend a platform on the discovery call, and our Maintenance Plans keep either kind of site updated.",
  },
  {
    q: "Can I update the website myself after launch?",
    a: "Yes. Most projects include a CMS so you can edit copy, swap images, and publish blog posts without touching code. We also record a walkthrough so you're not guessing.",
  },
  {
    q: "Do you build e-commerce websites?",
    a: "Yes — custom storefronts built on headless commerce architecture, not a generic template store. See the E-Commerce Setup add-on on our Website Packages page for details.",
  },
  {
    q: "What happens after the site launches?",
    a: "Every package includes a post-launch support window for fixes and questions. After that, our Maintenance Plans keep the site updated, monitored, and backed up — launch is day one, not the finish line.",
  },
] as const;

/* ============================================================
   STRUCTURED DATA
   ============================================================ */
const serviceStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Design & Development",
  serviceType: "Web Design & Development",
  category: "Web Design",
  description:
    "Custom web design and development built with Next.js and React — no templates, no page builders.",
  provider: { "@id": `${siteUrl}/#organization` },
  areaServed: [
    ...locations.flatMap((location) =>
      citiesOf(location).map((name) => ({ "@type": "City", name }))
    ),
    { "@type": "State", name: "Ohio" },
    { "@type": "Country", name: "United States" },
  ],
  url: `${siteUrl}/services/web-design`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Website Packages",
    itemListElement: capabilities.map((cap) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: cap.title,
        description: cap.description,
      },
    })),
  },
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Web Design & Development",
      item: `${siteUrl}/services/web-design`,
    },
  ],
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

/* ============================================================
   COMPONENT: Web Design & Development Page
   ============================================================ */
export default function WebDesignServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* =============================================
          HERO
          ============================================= */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/stock/service-web-design.jpg"
            alt="Web design and development"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-canvas/80" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/services"
            className="btn btn-glass min-h-10 px-4 text-sm mr-2 mb-6"
          >
            &larr; All Services
          </Link>
          <div className="glass rounded-card max-w-3xl p-6 sm:p-8">
          <p className="eyebrow mb-6">
            Our Flagship Service
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-ink leading-[0.9] tracking-tight">
            Web Design & Development
          </h1>
          <p className="text-ink-soft text-lg mt-6 max-w-2xl leading-relaxed">
            Custom-coded, conversion-focused websites — built with Next.js and
            React, not templates. This is the work we&apos;re best known for.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
              className="btn btn-primary text-center"
            >
              Book a Free Call
            </Link>
            <Link
              href="/packages/website"
              className="btn btn-glass text-center"
            >
              See Pricing — Starting at $1,500
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* =============================================
          OVERVIEW
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="eyebrow mb-4">
                Overview
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink">
                Your website is your hardest-working salesperson
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-5 text-body text-sm leading-relaxed">
              <p>
                Most small business websites are built from the same handful
                of templates — swap the logo, swap the colors, ship it. They
                load slowly, look like everyone else&apos;s, and quietly
                cost you customers who bounce before the page finishes
                rendering. We build the opposite: fully custom sites,
                hand-coded from a blank canvas, engineered around what your
                specific business needs to convert visitors into leads.
              </p>
              <p>
                Every project starts with your goals, not a theme catalog.
                We design the layout, write the code, and wire up the
                content system — all in-house, all custom. The result is a
                site that loads fast, ranks well, works on every device, and
                actually looks like nothing else in your industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          CAPABILITIES
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            What&apos;s Included
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16">
            Everything a modern website needs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <div key={cap.title} className="glass rounded-card p-8">
                <p className="text-xs font-mono text-muted mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ink font-heading font-bold text-lg mb-3">
                  {cap.title}
                </h3>
                <p className="text-body text-sm leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================

          THE SPARK

          ============================================= */}

      <SparkSpotlight />


      {/* =============================================
          TYPES OF WEBSITES
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            Range
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16">
            Types of websites we build
          </h2>
          <div className="border-t border-ink/10">
            {websiteTypes.map((type, i) => (
              <div
                key={type.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-ink/10"
              >
                <div className="md:col-span-1 text-muted text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-3 text-ink font-heading font-semibold text-lg">
                  {type.title}
                </h3>
                <p className="md:col-span-8 text-muted text-sm leading-relaxed">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          TECHNOLOGY + PERFORMANCE
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Tech stack */}
            <div>
              <p className="eyebrow mb-4">
                Technology
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-6">
                What we build with
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-8">
                No page builders, no bloated plugin stacks. We build on the
                same modern, production-grade technology that powers this
                site you&apos;re reading right now.
              </p>
              <div className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                  <span
                    key={tech}
                    className="btn btn-glass"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance & SEO */}
            <div>
              <p className="eyebrow mb-4">
                Performance & SEO
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-6">
                Built to be found and to load fast
              </h2>
              <div className="space-y-4 text-muted text-sm leading-relaxed">
                <p>
                  Speed and search visibility aren&apos;t an afterthought —
                  they&apos;re part of the build. Every site ships with
                  structured data, XML sitemaps, semantic markup, and
                  optimized images out of the box, targeting strong Core Web
                  Vitals scores instead of hoping for the best after launch.
                </p>
                <p>
                  That&apos;s not a sales pitch — it&apos;s how we built our
                  own site: manifest, sitemap, robots rules, JSON-LD, and
                  page-speed tuning are baked into every project we ship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          PROCESS
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            How We Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-16">
            Our web design process
          </h2>
          <div className="border-t border-ink/10">
            {process.map((item, i) => (
              <div
                key={item.step}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-ink/10"
              >
                <div className="md:col-span-1 text-muted text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-3 text-ink font-heading font-semibold text-lg">
                  {item.step}
                </h3>
                <p className="md:col-span-8 text-body text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          FAQ
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-4">
            Questions
          </p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-ink mb-12">
            Web design FAQ
          </h2>
          <div className="border-t border-ink/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-ink/10">
                <summary className="flex items-center justify-between cursor-pointer py-5 text-ink text-sm font-medium hover:text-ink-soft transition-colors list-none">
                  <span className="pr-6">{faq.q}</span>
                  <span className="text-muted text-lg flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-5 text-muted text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          RELATED SERVICES
          ============================================= */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="eyebrow mb-6">
            Pairs Well With
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/services/branding"
              className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
            >
              Branding & Identity &rarr;
            </Link>
            <Link
              href="/services/strategy"
              className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
            >
              Digital Strategy &rarr;
            </Link>
            <Link
              href="/services/graphic-design"
              className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
            >
              Graphic Design &rarr;
            </Link>
          </div>

          <p className="eyebrow mt-12 mb-6">
            Website Packages
          </p>
          <div className="flex flex-wrap gap-4">
            {websitePackages.map((pkg) => (
              <Link
                key={pkg.slug}
                href={`/packages/website/${pkg.slug}`}
                className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
              >
                {pkg.linkLabel} &rarr;
              </Link>
            ))}
          </div>

          <p className="eyebrow mt-12 mb-6">
            Web Design Near You
          </p>
          <div className="flex flex-wrap gap-4">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="glass rounded-full inline-flex items-center min-h-11 px-5 text-ink-soft text-sm hover:bg-white/80 hover:text-ink transition-colors"
              >
                {location.city} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          CTA
          ============================================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6">
              Next Step
            </p>
            <h2 className="text-5xl sm:text-6xl font-heading font-bold text-ink leading-[0.95] mb-4">
              Let&apos;s build your next client-winning website.
            </h2>
            <p className="text-body text-sm leading-relaxed mb-10 max-w-lg">
              Custom websites starting at $1,500. No templates, no fluff — built
              to convert visitors into paying clients and delivered in 6–12
              weeks.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://calendar.app.google/BugYDt3yg1oWBfpH7"
                className="btn btn-primary"
              >
                Book a Free Discovery Call
              </Link>
              <Link
                href="/contact"
                className="btn btn-glass"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      <AuditCallout />
    </>
  );
}
