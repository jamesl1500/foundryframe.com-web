/**
 * Web App Manifest - Foundry Frame
 * ==================================
 * Baseline PWA metadata (name, icons, theme) served at /manifest.webmanifest.
 *
 * @author James Latten
 * @copyright 2026 Foundry Frame. All rights reserved.
 */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Foundry Frame | Creative Design Agency",
    short_name: "Foundry Frame",
    description:
      "Foundry Frame is a premier creative design agency based in Ohio, specializing in branding, web design, social media, and digital strategy.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
