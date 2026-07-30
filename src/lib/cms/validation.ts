import { CMS_CONFIG } from "@/lib/cms/config";
import type { CmsEntity, CmsFieldConfig } from "@/lib/cms/types";

export interface ValidationResult {
  payload: Record<string, unknown>;
  errors: string[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/[\n,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJson(value: unknown): unknown {
  if (value === null || value === undefined || value === "") {
    return [];
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    return JSON.parse(value);
  }

  return [];
}

function coerceField(field: CmsFieldConfig, value: unknown): unknown {
  switch (field.type) {
    case "checkbox":
      return Boolean(value);
    case "number": {
      if (value === null || value === undefined || value === "") {
        return null;
      }

      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    }
    case "array":
      return parseArray(value);
    case "json":
      return parseJson(value);
    case "datetime-local": {
      if (typeof value !== "string" || value.trim() === "") {
        return null;
      }

      const normalized = value.includes("T") ? value : `${value}T00:00`;
      const date = new Date(normalized);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    case "text":
    case "textarea":
    case "url":
    default: {
      if (value === null || value === undefined) {
        return null;
      }

      const text = String(value).trim();
      return text === "" ? null : text;
    }
  }
}

export function validateCmsPayload(
  entity: CmsEntity,
  input: Record<string, unknown>
): ValidationResult {
  const config = CMS_CONFIG[entity];
  const payload: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const field of config.fields) {
    const coerced = coerceField(field, input[field.key]);

    if (field.required && (coerced === null || coerced === "")) {
      errors.push(`${field.label} is required.`);
      continue;
    }

    payload[field.key] = coerced;
  }

  const slug = String(payload.slug ?? "").trim();
  const primaryValue = String(payload[config.primaryField] ?? "").trim();

  if (!slug && primaryValue) {
    payload.slug = slugify(primaryValue);
  }

  const normalizedSlug = String(payload.slug ?? "").trim();
  if (!normalizedSlug) {
    errors.push("Slug is required.");
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
    errors.push("Slug must be lowercase and may contain letters, numbers, and hyphens only.");
  } else {
    payload.slug = normalizedSlug;
  }

  if (payload.is_published && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }

  return { payload, errors };
}
