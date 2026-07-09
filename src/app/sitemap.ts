import type { MetadataRoute } from "next";
import { generateStaticParams as generateBlogStaticParams } from "@/app/blog/[slug]/page";
import { generateStaticParams as generateCaseStudyStaticParams } from "@/app/case-studies/[slug]/page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.foundryframe.com";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/packages",
  "/packages/website",
  "/packages/launch",
  "/packages/maintenance",
  "/packages/marketing",
  "/case-studies",
  "/blog",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const blogUrls: MetadataRoute.Sitemap = generateBlogStaticParams().map(
    ({ slug }) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticUrls, ...blogUrls];
}
