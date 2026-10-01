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
   known third-party services this site actually loads (analytics,
   Tawk.to chat, Microsoft chatbot, Supabase) to reduce the site's exposure to
   injected scripts and to the "unknown redirect" signals ISPs/Safe Browsing
   use when flagging sites as phishing. Google Ads and the Meta Pixel need
   their script, beacon, and (for Ads) iframe hosts listed too. GA4 sends hits to regional hosts
   (e.g. region1.google-analytics.com), so connect-src needs the wildcards
   Google documents, not just the bare www host. */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://embed.tawk.to https://res.public.onecdn.static.microsoft`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.googletagmanager.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.facebook.com https://connect.facebook.net https://*.supabase.co https://embed.tawk.to wss://*.tawk.to https://res.public.onecdn.static.microsoft",
  "frame-src 'self' https://tawk.to https://td.doubleclick.net https://www.googletagmanager.com",
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

/* Google Ads and Meta tracking only run on the production deployment (or
   when AD_TRACKING_ENABLED=true is set), so local and preview builds don't
   send test traffic to the live ad accounts. */
const adTrackingEnabled =
  process.env.VERCEL_ENV === "production" || process.env.AD_TRACKING_ENABLED === "true";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    AD_TRACKING_ENABLED: adTrackingEnabled ? "true" : "false",
  },
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
