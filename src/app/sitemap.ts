import type { MetadataRoute } from "next";
import { generateStaticParams as generateBlogStaticParams } from "@/app/blog/[slug]/page";
import { generateStaticParams as generateCaseStudyStaticParams } from "@/app/case-studies/[slug]/page";
import { industries } from "@/lib/seo/industries";
import { locations } from "@/lib/seo/locations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.foundryframe.com";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/services/web-design",
  "/services/branding",
  "/services/social-media",
  "/services/graphic-design",
  "/services/advertising",
  "/services/strategy",
  "/audit",
  "/locations",
  "/industries",
  "/packages",
  "/packages/website",
  "/packages/launch",
  "/packages/maintenance",
  "/packages/marketing",
  "/blog",
  "/case-studies",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/audit" ? 0.9 : 0.8,
  }));

  const blogUrls: MetadataRoute.Sitemap = (await generateBlogStaticParams()).map(
    ({ slug }: { slug: string }) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const caseStudyUrls: MetadataRoute.Sitemap = (await generateCaseStudyStaticParams()).map(
    ({ slug }: { slug: string }) => ({
      url: `${SITE_URL}/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const landingUrls: MetadataRoute.Sitemap = [
    ...locations.map(({ slug }) => `/locations/${slug}`),
    ...industries.map(({ slug }) => `/industries/${slug}`),
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticUrls, ...landingUrls, ...blogUrls, ...caseStudyUrls];
}
