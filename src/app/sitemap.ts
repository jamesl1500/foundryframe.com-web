import type { MetadataRoute } from "next";
import { generateStaticParams as generateBlogStaticParams } from "@/app/blog/[slug]/page";
import { getPublishedCaseStudies } from "@/lib/cms/public-data";
import { industries } from "@/lib/seo/industries";
import { industryAreas } from "@/lib/seo/industry-areas";
import { locations } from "@/lib/seo/locations";
import { launchBundles } from "@/lib/packages/launch";
import { websitePackages } from "@/lib/packages/website";

/* Reads from the Supabase CMS. Admin saves refresh this page right away
   (see lib/cms/revalidate.ts); this is the fallback for other edits. */
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.foundryframe.com";

/* When the location, industry, and package landing copy last changed. Google
   stops trusting <lastmod> on sites that report "now" for every URL on every
   deploy, so bump this by hand after editing lib/seo/locations.ts,
   lib/seo/industries.ts, lib/seo/industry-areas.ts, or lib/packages/*. */
const LANDING_CONTENT_UPDATED = new Date("2026-11-19");

/* Same idea for the hand-built pages (home, services, packages, blog posts,
   etc.): bump after a meaningful content or design change. Case studies use
   their real updated_at from the CMS. */
const SITE_CONTENT_UPDATED = new Date("2026-11-19");

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
  "/founding",
  "/locations",
  "/industries",
  "/packages",
  "/packages/builder",
  "/packages/website",
  "/packages/launch",
  "/packages/maintenance",
  "/packages/marketing",
  "/packages/print-shop",
  "/blog",
  "/case-studies",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: SITE_CONTENT_UPDATED,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/audit" ? 0.9 : 0.8,
  }));

  const blogUrls: MetadataRoute.Sitemap = (await generateBlogStaticParams()).map(
    ({ slug }: { slug: string }) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: SITE_CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const caseStudyUrls: MetadataRoute.Sitemap = (await getPublishedCaseStudies()).map(
    ({ slug, updated_at }) => ({
      url: `${SITE_URL}/case-studies/${slug}`,
      lastModified: updated_at ? new Date(updated_at) : SITE_CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const landingUrls: MetadataRoute.Sitemap = [
    ...locations.map(({ slug }) => `/locations/${slug}`),
    ...industries.map(({ slug }) => `/industries/${slug}`),
    ...industryAreas.map(
      ({ industrySlug, areaSlug }) => `/industries/${industrySlug}/${areaSlug}`
    ),
    ...websitePackages.map(({ slug }) => `/packages/website/${slug}`),
    ...launchBundles.map(({ slug }) => `/packages/launch/${slug}`),
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LANDING_CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticUrls, ...landingUrls, ...blogUrls, ...caseStudyUrls];
}
