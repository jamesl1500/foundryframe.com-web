import { CMS_ENTITIES, type CmsEntity, type CmsEntityConfig } from "@/lib/cms/types";

export const CMS_CONFIG: Record<CmsEntity, CmsEntityConfig> = {
  case_studies: {
    label: "Case Studies",
    singularLabel: "Case Study",
    description:
      "Showcase project outcomes with challenge/solution narratives and proof metrics.",
    table: "case_studies",
    primaryField: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      {
        key: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "custom-brand-website-redesign",
      },
      {
        key: "summary",
        label: "Summary",
        type: "textarea",
        required: true,
      },
      { key: "client_name", label: "Client Name", type: "text" },
      { key: "industry", label: "Industry", type: "text" },
      {
        key: "services",
        label: "Services",
        type: "array",
        placeholder: "Web Design, Branding, SEO",
        description: "Comma-separated values.",
      },
      { key: "challenge", label: "Challenge", type: "textarea" },
      { key: "solution", label: "Solution", type: "textarea" },
      { key: "results", label: "Results", type: "textarea" },
      { key: "cover_image_url", label: "Cover Image URL", type: "url" },
      {
        key: "gallery_urls",
        label: "Gallery Images",
        type: "array",
        description: "Comma-separated image URLs. You can upload multiple images at once.",
      },
      { key: "project_url", label: "Project URL", type: "url" },
      {
        key: "metrics",
        label: "Metrics (JSON)",
        type: "json",
        placeholder: '[{"label":"Leads", "value":"+63%"}]',
      },
      {
        key: "testimonial_quote",
        label: "Testimonial Quote",
        type: "textarea",
      },
      {
        key: "testimonial_author",
        label: "Testimonial Author",
        type: "text",
      },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_featured", label: "Featured", type: "checkbox" },
      { key: "is_published", label: "Published", type: "checkbox" },
      {
        key: "published_at",
        label: "Published At",
        type: "datetime-local",
      },
    ],
    listColumns: [
      "title",
      "client_name",
      "is_published",
      "is_featured",
      "updated_at",
    ],
  },
  services: {
    label: "Services",
    singularLabel: "Service",
    description:
      "Maintain your service catalog, value proposition, deliverables, and positioning.",
    table: "services",
    primaryField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      {
        key: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "web-design",
      },
      {
        key: "short_description",
        label: "Short Description",
        type: "textarea",
      },
      { key: "description", label: "Full Description", type: "textarea" },
      {
        key: "deliverables",
        label: "Deliverables",
        type: "array",
        description: "Comma-separated values.",
      },
      {
        key: "starting_price",
        label: "Starting Price",
        type: "number",
        placeholder: "1500",
      },
      { key: "timeline", label: "Timeline", type: "text" },
      { key: "icon_name", label: "Icon Name", type: "text" },
      { key: "hero_image_url", label: "Hero Image URL", type: "url" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_featured", label: "Featured", type: "checkbox" },
      { key: "is_published", label: "Published", type: "checkbox" },
      {
        key: "published_at",
        label: "Published At",
        type: "datetime-local",
      },
    ],
    listColumns: ["name", "starting_price", "is_published", "is_featured", "updated_at"],
  },
  packages: {
    label: "Packages",
    singularLabel: "Package",
    description:
      "Manage packaged offers with pricing, features, and launch order.",
    table: "packages",
    primaryField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      {
        key: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "growth-retainer",
      },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "price", label: "Price", type: "number" },
      {
        key: "billing_period",
        label: "Billing Period",
        type: "text",
        placeholder: "monthly",
      },
      { key: "cta_url", label: "CTA URL", type: "url" },
      {
        key: "features",
        label: "Features",
        type: "array",
        description: "Comma-separated values.",
      },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_featured", label: "Featured", type: "checkbox" },
      { key: "is_published", label: "Published", type: "checkbox" },
      {
        key: "published_at",
        label: "Published At",
        type: "datetime-local",
      },
    ],
    listColumns: ["name", "price", "is_published", "is_featured", "updated_at"],
  },
  clients: {
    label: "Clients",
    singularLabel: "Client",
    description:
      "Keep client logos, industries, testimonial snippets, and relationship status up to date.",
    table: "clients",
    primaryField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      {
        key: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "acme-industries",
      },
      { key: "industry", label: "Industry", type: "text" },
      { key: "website_url", label: "Website URL", type: "url" },
      { key: "logo_url", label: "Logo URL", type: "url" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "primary_contact", label: "Primary Contact", type: "text" },
      { key: "email", label: "Contact Email", type: "text" },
      { key: "phone", label: "Contact Phone", type: "text" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "quote_author", label: "Quote Author", type: "text" },
      { key: "sort_order", label: "Sort Order", type: "number" },
      { key: "is_active", label: "Active Client", type: "checkbox" },
      { key: "is_featured", label: "Featured", type: "checkbox" },
      { key: "is_published", label: "Published", type: "checkbox" },
      {
        key: "published_at",
        label: "Published At",
        type: "datetime-local",
      },
    ],
    listColumns: ["name", "industry", "is_active", "is_published", "updated_at"],
  },
};

export function isCmsEntity(value: string): value is CmsEntity {
  return CMS_ENTITIES.includes(value as CmsEntity);
}

export function getCmsConfigOrNull(value: string): CmsEntityConfig | null {
  if (!isCmsEntity(value)) {
    return null;
  }

  return CMS_CONFIG[value];
}
