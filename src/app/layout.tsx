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
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

/* --- Global Metadata --- */
export const metadata: Metadata = {
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
    "Ohio",
    "photography",
    "videography",
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
      "Premier creative design agency based in Ohio. Branding, web design, photography, videography, and digital strategy.",
    type: "website",
    locale: "en_US",
    siteName: "Foundry Frame",
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
        {/* Site-wide navigation header */}
        <Header />

        {/* Main content area - pages render here */}
        <main className="flex-1">{children}</main>

        {/* Site-wide footer */}
        <Footer />
      </body>
    </html>
  );
}
