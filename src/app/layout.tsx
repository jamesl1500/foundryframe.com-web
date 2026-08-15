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
      telephone: "+1-440-921-8245",
      email: "jlatten@foundryframe.com",
      priceRange: "$$",
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
      sameAs: ["https://www.linkedin.com/company/foundry-frame/"],
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
      telephone: "+1-440-921-8245",
      email: "jlatten@foundryframe.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lorain",
        addressRegion: "OH",
        postalCode: "44053",
        addressCountry: "US",
      },
      sameAs: ["https://www.linkedin.com/company/foundry-frame/"],
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
  title: {
    default: "Foundry Frame | Creative Design Agency",
    template: "%s | Foundry Frame",
  },
  description:
    "Foundry Frame is a premier creative design agency based in Ohio, specializing in branding, web design, social media, and digital strategy. Founded in 2026.",
  keywords: [
    "creative agency",
    "design agency",
    "branding",
    "web design",
    "web development",
    "graphic design",
    "marketing",
    "content creation",
    "advertising",
    "web design agency",
    "web development agency",
    "software development",
    "software engineering",
    "small business solutions",
    "small business websites",
    "startup solutions",
    "startup websites",
    "startup branding",
    "social media marketing",
    "digital marketing",
  ],
  authors: [{ name: "James Latten" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Foundry Frame | Creative Design Agency",
    description:
      "Premier creative design agency based in Ohio. Branding, web design, social media, and digital strategy.",
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "Foundry Frame",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foundry Frame | Creative Design Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundry Frame | Creative Design Agency",
    description:
      "Premier creative design agency based in Ohio. Branding, web design, social media, and digital strategy.",
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

        {/* Calendly badge widget */}
        <CalendlyBadge />
      </body>
    </html>
  );
}
