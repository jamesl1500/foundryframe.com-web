/**
 * Next.js Configuration for Foundry Frame
 * =========================================
 * Configuration for the Foundry Frame creative agency website.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { NextConfig } from "next";

/* Content-Security-Policy: locks script/frame/connect origins down to the
   known third-party services this site actually loads (analytics, Calendly,
   Tawk.to chat, Microsoft chatbot, Supabase) to reduce the site's exposure to
   injected scripts and to the "unknown redirect" signals ISPs/Safe Browsing
   use when flagging sites as phishing. */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://assets.calendly.com https://embed.tawk.to https://res.public.onecdn.static.microsoft`,
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://analytics.google.com https://www.google.com https://www.google-analytics.com https://*.supabase.co https://embed.tawk.to wss://*.tawk.to https://calendly.com https://res.public.onecdn.static.microsoft",
  "frame-src 'self' https://calendly.com https://tawk.to",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
