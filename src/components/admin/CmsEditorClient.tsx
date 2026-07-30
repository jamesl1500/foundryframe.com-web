"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CMS_CONFIG } from "@/lib/cms/config";
import type { CmsEntity, CmsItem, CmsFieldConfig } from "@/lib/cms/types";

interface Props {
  entity: CmsEntity;
  mode: "create" | "edit";
  id?: string;
  initialItem?: CmsItem;
}

type FormState = Record<string, unknown>;

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isoToLocal(value: unknown): string {
  if (!value || typeof value !== "string") {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function parseArrayFormValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter((entry) => entry.length > 0);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function serializeArrayFormValue(entries: string[]): string {
  return entries
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .join(", ");
}

function fieldInitialValue(field: CmsFieldConfig): unknown {
  switch (field.type) {
    case "checkbox":
      return false;
    case "array":
      return "";
    case "json":
      return "[]";
    case "number":
    case "datetime-local":
    case "text":
    case "textarea":
    case "url":
    default:
      return "";
  }
}

function itemToFormState(fields: CmsFieldConfig[], item: CmsItem): FormState {
  const state: FormState = {};

  for (const field of fields) {
    const value = item[field.key];

    switch (field.type) {
      case "checkbox":
        state[field.key] = Boolean(value);
        break;
      case "array":
        state[field.key] = Array.isArray(value) ? value.join(", ") : "";
        break;
      case "json":
        state[field.key] = JSON.stringify(value ?? [], null, 2);
        break;
      case "datetime-local":
        state[field.key] = isoToLocal(value);
        break;
      default:
        state[field.key] = value === null || value === undefined ? "" : String(value);
        break;
    }
  }

  return state;
}

export default function CmsEditorClient({ entity, mode, id, initialItem }: Props) {
  const config = CMS_CONFIG[entity];
  const [state, setState] = useState<FormState>(() => {
    const initial: FormState = {};
    for (const field of config.fields) {
      initial[field.key] = fieldInitialValue(field);
    }

    if (mode === "edit" && initialItem) {
      return itemToFormState(config.fields, initialItem);
    }

    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const titleValue = useMemo(() => {
    return String(state[config.primaryField] ?? "");
  }, [config.primaryField, state]);

  function updateField(key: string, value: unknown) {
    setState((current) => {
      const next = { ...current, [key]: value };

      if (key === config.primaryField) {
        const existingSlug = String(current.slug ?? "").trim();
        if (!existingSlug || existingSlug === toSlug(String(current[config.primaryField] ?? ""))) {
          next.slug = toSlug(String(value));
        }
      }

      return next;
    });
  }

  function isImageUrlField(field: CmsFieldConfig): boolean {
    return field.type === "url" && /image|logo|cover/i.test(field.key);
  }

  function isGalleryArrayField(field: CmsFieldConfig): boolean {
    return field.type === "array" && /gallery|images/i.test(field.key);
  }

  async function requestUploadedImageUrl(fieldKey: string, file: File): Promise<string> {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("entity", entity);
    payload.append("fieldKey", fieldKey);

    const response = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: payload,
    });

    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      throw new Error(result.error ?? "Image upload failed.");
    }

    return result.url;
  }

  async function uploadImage(fieldKey: string, file: File) {
    setUploadingField(fieldKey);
    setError("");
    setSuccess("");

    try {
      const url = await requestUploadedImageUrl(fieldKey, file);
      updateField(fieldKey, url);
      setSuccess("Image uploaded.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setUploadingField(null);
    }
  }

  async function uploadGalleryImages(fieldKey: string, files: File[]) {
    if (files.length === 0) {
      return;
    }

    setUploadingField(fieldKey);
    setError("");
    setSuccess("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await requestUploadedImageUrl(fieldKey, file);
        uploadedUrls.push(url);
      }

      setState((current) => {
        const existing = parseArrayFormValue(current[fieldKey]);
        const next = [...existing, ...uploadedUrls];
        return {
          ...current,
          [fieldKey]: serializeArrayFormValue(next),
        };
      });

      setSuccess(`${uploadedUrls.length} gallery image${uploadedUrls.length === 1 ? "" : "s"} uploaded.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Gallery upload failed.");
    } finally {
      setUploadingField(null);
    }
  }

  function updateGalleryValue(fieldKey: string, nextItems: string[]) {
    setState((current) => {
      return {
        ...current,
        [fieldKey]: serializeArrayFormValue(nextItems),
      };
    });
  }

  function removeGalleryImage(fieldKey: string, indexToRemove: number) {
    const currentItems = parseArrayFormValue(state[fieldKey]);
    const nextItems = currentItems.filter((_, index) => index !== indexToRemove);
    updateGalleryValue(fieldKey, nextItems);
  }

  function moveGalleryImage(fieldKey: string, index: number, direction: "up" | "down") {
    const currentItems = parseArrayFormValue(state[fieldKey]);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= currentItems.length) {
      return;
    }

    const reordered = [...currentItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    updateGalleryValue(fieldKey, reordered);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const endpoint = mode === "create" ? `/api/admin/${entity}` : `/api/admin/${entity}/${id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });

    const result = (await response.json()) as { data?: CmsItem; error?: string };

    if (!response.ok) {
      setError(result.error ?? "Save failed.");
      setSaving(false);
      return;
    }

    if (result.data) {
      setState(itemToFormState(config.fields, result.data));
    }

    setSaving(false);
    setSuccess(mode === "create" ? "Created successfully." : "Saved successfully.");
  }

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="mb-7 lg:mb-8">
          <Link href={`/admin/${entity}`} className="text-xs uppercase tracking-widest text-gray-400 hover:text-white">
            ← Back to {config.label}
          </Link>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mt-4 mb-2">
            {mode === "create" ? `New ${config.singularLabel}` : titleValue || `Edit ${config.singularLabel}`}
          </h1>
          <p className="text-gray-400 text-sm">{config.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-white/10 p-6 lg:p-8 bg-black">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            {config.fields.map((field) => {
              const raw = state[field.key];
              const galleryPreviewUrls = isGalleryArrayField(field) ? parseArrayFormValue(raw) : [];

              if (field.type === "checkbox") {
                return (
                  <label key={field.key} className="flex items-center gap-3 border border-white/10 px-4 py-3 bg-white/[0.02]">
                    <input
                      type="checkbox"
                      checked={Boolean(raw)}
                      onChange={(event) => updateField(field.key, event.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-white">{field.label}</span>
                  </label>
                );
              }

              const isFullWidth = field.type === "textarea" || field.type === "json";

              return (
                <label key={field.key} className={isFullWidth ? "lg:col-span-2" : ""}>
                  <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                    {field.label}
                    {field.required ? " *" : ""}
                  </span>

                  {field.type === "textarea" || field.type === "json" ? (
                    <textarea
                      required={field.required}
                      rows={field.type === "json" ? 6 : 4}
                      value={String(raw ?? "")}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-white/50"
                    />
                  ) : (
                    <input
                      required={field.required}
                      type={field.type === "number" ? "number" : field.type === "datetime-local" ? "datetime-local" : "text"}
                      value={String(raw ?? "")}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-white/50"
                    />
                  )}

                  {isImageUrlField(field) ? (
                    <div className="mt-3 space-y-3">
                      <label className="inline-flex items-center gap-3 px-3 py-2 border border-white/20 text-xs uppercase tracking-widest text-gray-300 hover:bg-white/5 cursor-pointer">
                        <span>
                          {uploadingField === field.key ? "Uploading..." : "Upload Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingField === field.key}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            void uploadImage(field.key, file);
                            event.currentTarget.value = "";
                          }}
                        />
                      </label>

                      {typeof raw === "string" && raw.trim() !== "" ? (
                        <Image
                          src={raw}
                          alt={`${field.label} preview`}
                          width={1200}
                          height={700}
                          className="w-full max-h-56 object-cover border border-white/10"
                        />
                      ) : null}
                    </div>
                  ) : null}

                  {isGalleryArrayField(field) ? (
                    <div className="mt-3 space-y-3">
                      <label className="inline-flex items-center gap-3 px-3 py-2 border border-white/20 text-xs uppercase tracking-widest text-gray-300 hover:bg-white/5 cursor-pointer">
                        <span>
                          {uploadingField === field.key ? "Uploading..." : "Upload Gallery Images"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploadingField === field.key}
                          onChange={(event) => {
                            const files = event.target.files ? Array.from(event.target.files) : [];
                            if (files.length === 0) return;
                            void uploadGalleryImages(field.key, files);
                            event.currentTarget.value = "";
                          }}
                        />
                      </label>

                      {galleryPreviewUrls.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {galleryPreviewUrls.map((url, index) => (
                            <div key={`${url}-${index}`} className="space-y-2">
                              <Image
                                src={url}
                                alt={`${field.label} image ${index + 1}`}
                                width={900}
                                height={700}
                                className="w-full h-28 object-cover border border-white/10"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveGalleryImage(field.key, index, "up")}
                                  disabled={index === 0}
                                  className="px-2 py-1 border border-white/20 text-[10px] uppercase tracking-widest text-gray-300 hover:bg-white/5 disabled:opacity-40"
                                >
                                  Up
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveGalleryImage(field.key, index, "down")}
                                  disabled={index === galleryPreviewUrls.length - 1}
                                  className="px-2 py-1 border border-white/20 text-[10px] uppercase tracking-widest text-gray-300 hover:bg-white/5 disabled:opacity-40"
                                >
                                  Down
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(field.key, index)}
                                  className="ml-auto px-2 py-1 border border-red-400/30 text-[10px] uppercase tracking-widest text-red-300 hover:bg-red-500/10"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {field.description && <span className="block text-xs text-gray-500 mt-2">{field.description}</span>}
                </label>
              );
            })}
          </div>

          {error && <p className="mt-5 text-sm text-red-300">{error}</p>}
          {success && <p className="mt-5 text-sm text-green-300">{success}</p>}

          <div className="mt-7 lg:mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 disabled:opacity-60"
            >
              {saving ? "Saving..." : mode === "create" ? `Create ${config.singularLabel}` : `Save ${config.singularLabel}`}
            </button>
            <Link
              href={`/admin/${entity}`}
              className="px-6 py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 text-center"
            >
              Return to List
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
