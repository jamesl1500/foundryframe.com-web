/**
 * Root Layout - Foundry Frame
 * ============================
 * The root layout component that wraps all pages. Includes global fonts,
 * metadata, navigation header, and footer.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalendlyBadge from "@/components/CalendlyBadge";
import TawkChat from "@/components/TawkChat";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.foundryframe.com";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Foundry Frame",
      url: siteUrl,
      logo: `${siteUrl}/file.svg`,
      foundingDate: "2026",
      description:
        "Foundry Frame is a creative design agency in Ohio specializing in branding, web design, photography, videography, and digital strategy.",
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
      areaServed: ["Ohio", "United States"],
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lorain",
        addressRegion: "OH",
        addressCountry: "US",
      },
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
    "Foundry Frame is a premier creative design agency based in Ohio, specializing in branding, web design, photography, videography, and digital strategy. Founded in 2026.",
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
    "photography",
    "videography",
    "digital marketing",
    "Custom Websites from $1,500",
    "Ohio Web Design Agency",
    "Your Website Built to Convert",
    "No Templates. Ever.",
    "Web Design · Lorain, Ohio",
    "Sites That Actually Get Clients",
    "Free Website Audit Included",
    "Launch in 6–12 Weeks",
    "Foundry Frame — We Build Sites",
    "Small Biz Website Specialists",
    "From Spark to Enterprise",
    "Mobile-Ready. SEO-Ready.",
    "50% Down. Balance on Launch.",
    "Ohio's Creative Web Agency",
    "Get a Free Discovery Call",
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
      "Premier creative design agency based in Ohio. Branding, web design, photography, videography, and digital strategy.",
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "Foundry Frame",
    images: [
      {
        url: "/james-latten.jpg",
        width: 1200,
        height: 630,
        alt: "Foundry Frame founder portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundry Frame | Creative Design Agency",
    description:
      "Premier creative design agency based in Ohio. Branding, web design, photography, videography, and digital strategy.",
    images: ["/james-latten.jpg"],
  },
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
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
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

        {/* Tawk.to live chat */}
        <TawkChat />
      </body>
    </html>
  );
}
