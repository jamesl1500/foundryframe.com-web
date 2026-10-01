/**
 * Root Layout - Foundry Frame
 * ============================
 * The root layout component that wraps all pages. Includes global fonts,
 * metadata, navigation header, and footer.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalendlyBadge from "@/components/CalendlyBadge";
import ConversionTracking from "@/components/ConversionTracking";
import SiteChat from "@/components/SiteChat";
import { OPENING_HOURS_SPECIFICATION } from "@/lib/site-facts";
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID, META_PIXEL_ID } from "@/lib/analytics";

/* --- Font Configuration --- */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.foundryframe.com";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${siteUrl}/#organization`,
      name: "Foundry Frame",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      image: `${siteUrl}/james-latten.jpg`,
      foundingDate: "2026",
      description:
        "Foundry Frame is a creative design agency in Ohio specializing in branding, web design, social media, and digital strategy.",
      telephone: "+1-216-889-7822",
      email: "jlatten@foundryframe.com",
      priceRange: "$$",
      founder: {
        "@type": "Person",
        name: "James Latten",
        jobTitle: "Founder & Lead Designer",
        url: `${siteUrl}/about`,
      },
      knowsAbout: [
        "Web Design",
        "Web Development",
        "Brand Identity",
        "Search Engine Optimization",
        "Conversion Rate Optimization",
        "Digital Strategy",
      ],
      areaServed: [
        { "@type": "City", name: "Lorain" },
        { "@type": "State", name: "Ohio" },
        { "@type": "AdministrativeArea", name: "United States" },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lorain",
        addressRegion: "OH",
        postalCode: "44053",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 41.468,
        longitude: -82.1884,
      },
      openingHoursSpecification: OPENING_HOURS_SPECIFICATION,
      sameAs: [
        "https://www.linkedin.com/company/foundry-frame/",
        "https://www.instagram.com/foundry_frame/",
        "https://x.com/FoundryFrame",
        "https://www.facebook.com/foundry.frame",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Foundry Frame",
      inLanguage: "en-US",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Foundry Frame",
      url: siteUrl,
      image: `${siteUrl}/james-latten.jpg`,
      serviceType: ["Web Design", "Branding", "Digital Strategy", "Social Media"],
      areaServed: [
        { "@type": "City", name: "Lorain" },
        { "@type": "State", name: "Ohio" },
        { "@type": "AdministrativeArea", name: "United States" },
      ],
      priceRange: "$$",
      telephone: "+1-216-889-7822",
      email: "jlatten@foundryframe.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lorain",
        addressRegion: "OH",
        postalCode: "44053",
        addressCountry: "US",
      },
      sameAs: [
        "https://www.linkedin.com/company/foundry-frame/",
        "https://www.instagram.com/foundry_frame/",
        "https://x.com/FoundryFrame",
        "https://www.facebook.com/foundry.frame",
      ],
    },
  ],
};

/* --- Global Metadata --- */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
  },
  category: "Creative Agency",
  applicationName: "Foundry Frame",
  title: {
    default: "Foundry Frame | Ohio Web Design & Branding Agency",
    template: "%s | Foundry Frame",
  },
  description:
    "Foundry Frame is an Ohio web design and branding agency in Lorain. We build custom, conversion-focused websites and brand systems for small businesses and growth brands. Founded in 2026.",
  keywords: [
    "Ohio web design agency",
    "Lorain web design",
    "custom website design",
    "web development agency",
    "branding agency Ohio",
    "small business website design",
    "conversion-focused web design",
    "Next.js web development",
    "SEO web design",
    "digital strategy agency",
  ],
  authors: [{ name: "James Latten" }],
  creator: "Foundry Frame",
  publisher: "Foundry Frame",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Foundry Frame | Ohio Web Design & Branding Agency",
    description:
      "An Ohio web design and branding agency building custom, conversion-focused websites for small businesses and growth brands. Founder-led, friendly, results-focused.",
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "Foundry Frame",
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
    title: "Foundry Frame | Ohio Web Design & Branding Agency",
    description:
      "An Ohio web design and branding agency building custom, conversion-focused websites for small businesses and growth brands.",
    images: ["/twitter-image"],
  },
  /* Set via `other` rather than twitter.site: pages define their own
     `twitter` object, which replaces the root one instead of merging. */
  other: {
    "twitter:site": "@FoundryFrame",
  },
};

/* --- Global Viewport --- */
export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

/* --- Root Layout Component --- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* The ~190 KB gtag.js library loads at idle so it doesn't compete
            with hydration on mobile; the tiny stub below defines gtag() early,
            so page views and trackEvent() calls queue in dataLayer until then. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)});
            ${GOOGLE_ADS_ID ? `gtag('config', ${JSON.stringify(GOOGLE_ADS_ID)});` : ""}
          `}
        </Script>
        {/* Meta Pixel: production deployment only (see AD_TRACKING_ENABLED in next.config.ts). */}
        {META_PIXEL_ID ? (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', ${JSON.stringify(META_PIXEL_ID)});
              fbq('track', 'PageView');
            `}
          </Script>
        ) : null}
        {META_PIXEL_ID ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Site-wide navigation header */}
        <Header />

        {/* Main content area - pages render here */}
        <main className="flex-1">{children}</main>

        {/* Site-wide footer */}
        <Footer />

        {/* Floating consultation booking badge */}
        <CalendlyBadge />

        {/* Floating AI chat that answers visitor questions */}
        <SiteChat />

        {/* Reports lead-intent clicks (booking, phone, email, CTAs) to GA4, Google Ads and Meta */}
        <ConversionTracking />
      </body>
    </html>
  );
}
