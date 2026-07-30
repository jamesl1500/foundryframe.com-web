export const CMS_ENTITIES = [
  "case_studies",
  "services",
  "packages",
  "clients",
] as const;

export type CmsEntity = (typeof CMS_ENTITIES)[number];

export type CmsFieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "checkbox"
  | "array"
  | "json"
  | "datetime-local";

export interface CmsFieldConfig {
  key: string;
  label: string;
  type: CmsFieldType;
  required?: boolean;
  placeholder?: string;
  description?: string;
}

export interface CmsEntityConfig {
  label: string;
  singularLabel: string;
  description: string;
  table: string;
  primaryField: string;
  fields: CmsFieldConfig[];
  listColumns: string[];
}

export type CmsItem = {
  id: string;
  created_at: string;
  updated_at: string;
  sort_order?: number;
  is_published?: boolean;
  is_featured?: boolean;
  [key: string]: unknown;
};
