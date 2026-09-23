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
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      sameAs: [
        "https://www.linkedin.com/company/foundry-frame/",
        "https://www.instagram.com/foundry_frame/",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2723XGFRH7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2723XGFRH7');
          `}
        </Script>
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

        {/* Reports lead-intent clicks (booking, phone, email, CTAs) to GA4 */}
        <ConversionTracking />
      </body>
    </html>
  );
}
