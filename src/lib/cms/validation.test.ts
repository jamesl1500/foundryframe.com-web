import { describe, expect, it } from "vitest";
import { getCmsConfigOrNull, isCmsEntity } from "@/lib/cms/config";
import { CMS_ENTITIES } from "@/lib/cms/types";
import { validateCmsPayload } from "@/lib/cms/validation";

const base = { title: "Acme Rebrand", summary: "A new site." };

describe("validateCmsPayload", () => {
  it("requires the required fields", () => {
    const { errors } = validateCmsPayload("case_studies", {});
    expect(errors).toContain("Title is required.");
    expect(errors).toContain("Summary is required.");
  });

  it("derives a slug from the primary field when it's blank", () => {
    const { payload, errors } = validateCmsPayload("case_studies", { ...base, title: "  Acme's  Big Rebrand! " , slug: "" });
    // slug is a required field, so a blank one is reported before it's derived.
    expect(errors).toEqual(["Slug is required."]);
    expect(payload.slug).toBe("acmes-big-rebrand");
  });

  it("rejects malformed slugs", () => {
    for (const slug of ["Has Caps", "trailing-", "double--dash", "under_score"]) {
      const { errors } = validateCmsPayload("case_studies", { ...base, slug });
      expect(errors.join(" ")).toMatch(/Slug must be lowercase/);
    }
  });

  it("coerces field types", () => {
    const { payload, errors } = validateCmsPayload("case_studies", {
      ...base,
      slug: "acme",
      services: "Web Design, Branding,\nSEO, ",
      industry_slug: "not-a-real-industry",
      is_published: "on",
    });
    expect(errors).toEqual([]);
    expect(payload.services).toEqual(["Web Design", "Branding", "SEO"]);
    expect(payload.industry_slug).toBeNull();
    expect(payload.is_published).toBe(true);
    expect(typeof payload.published_at).toBe("string");
    expect(payload.client_name).toBeNull();
  });

  it("keeps an explicit published date", () => {
    const { payload } = validateCmsPayload("case_studies", {
      ...base,
      slug: "acme",
      is_published: true,
      published_at: "2026-01-15",
    });
    expect(payload.published_at).toBe(new Date("2026-01-15T00:00").toISOString());
  });

  it("validates every entity's config without throwing", () => {
    for (const entity of CMS_ENTITIES) {
      expect(() => validateCmsPayload(entity, {})).not.toThrow();
    }
  });
});

describe("CMS config", () => {
  it("knows its entities", () => {
    expect(isCmsEntity("case_studies")).toBe(true);
    expect(isCmsEntity("users")).toBe(false);
    expect(getCmsConfigOrNull("__proto__")).toBeNull();
  });

  it("gives every entity a slug field, a primary field and unique keys", () => {
    for (const entity of CMS_ENTITIES) {
      const config = getCmsConfigOrNull(entity)!;
      const keys = config.fields.map((field) => field.key);
      expect(new Set(keys).size).toBe(keys.length);
      expect(keys).toContain("slug");
      expect(keys).toContain(config.primaryField);
    }
  });
});
