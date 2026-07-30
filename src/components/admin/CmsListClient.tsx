"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CmsEntity, CmsItem } from "@/lib/cms/types";
import { CMS_CONFIG } from "@/lib/cms/config";

interface Props {
  entity: CmsEntity;
  initialItems: CmsItem[];
}

function normalizeForSearch(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(" ").toLowerCase();
  }

  if (typeof value === "object") {
    return JSON.stringify(value).toLowerCase();
  }

  return String(value).toLowerCase();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export default function CmsListClient({ entity, initialItems }: Props) {
  const config = CMS_CONFIG[entity];
  const [items, setItems] = useState<CmsItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] = useState<"all" | "published" | "draft">("all");

  async function loadItems() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/admin/${entity}`);
    const result = (await response.json()) as { data?: CmsItem[]; error?: string };

    if (!response.ok) {
      setError(result.error ?? "Failed to load records.");
      setLoading(false);
      return;
    }

    setItems(result.data ?? []);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((item) => Boolean(item.is_published)).length;
    const featured = items.filter((item) => Boolean(item.is_featured)).length;

    return { total, published, drafts: total - published, featured };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (publishFilter === "published" && !item.is_published) return false;
      if (publishFilter === "draft" && item.is_published) return false;

      if (!search.trim()) return true;

      const values = [
        normalizeForSearch(item[config.primaryField]),
        normalizeForSearch(item.slug),
        normalizeForSearch(item.summary),
      ].join(" ");

      return values.includes(search.toLowerCase());
    });
  }, [config.primaryField, items, publishFilter, search]);

  async function deleteItem(id: string) {
    const confirmed = window.confirm("Delete this item? This action cannot be undone.");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/${entity}/${id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      window.alert(result.error ?? "Delete failed.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function toggleField(id: string, field: "is_published" | "is_featured", value: boolean) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    const response = await fetch(`/api/admin/${entity}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...item,
        [field]: !value,
      }),
    });

    const result = (await response.json()) as { data?: CmsItem; error?: string };

    if (!response.ok || !result.data) {
      window.alert(result.error ?? "Update failed.");
      return;
    }

    setItems((current) => current.map((entry) => (entry.id === id ? result.data! : entry)));
  }

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">CMS Collection</p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2">{config.label}</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{config.description}</p>
          </div>
          <Link
            href={`/admin/${entity}/new`}
            className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors text-center"
          >
            Add {config.singularLabel}
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mb-6 lg:mb-8">
          <div className="bg-black p-4 border border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-heading font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-black p-4 border border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Published</p>
            <p className="text-2xl font-heading font-bold text-white">{stats.published}</p>
          </div>
          <div className="bg-black p-4 border border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Drafts</p>
            <p className="text-2xl font-heading font-bold text-white">{stats.drafts}</p>
          </div>
          <div className="bg-black p-4 border border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Featured</p>
            <p className="text-2xl font-heading font-bold text-white">{stats.featured}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-6">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${config.label.toLowerCase()}...`}
            className="flex-1 bg-white/5 border border-white/20 text-white text-sm px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-white/50"
          />
          <select
            value={publishFilter}
            onChange={(event) => setPublishFilter(event.target.value as "all" | "published" | "draft")}
            className="bg-black border border-white/20 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/50"
            style={{ backgroundColor: "#000", color: "#fff" }}
          >
            <option value="all" style={{ backgroundColor: "#000", color: "#fff" }}>All statuses</option>
            <option value="published" style={{ backgroundColor: "#000", color: "#fff" }}>Published only</option>
            <option value="draft" style={{ backgroundColor: "#000", color: "#fff" }}>Draft only</option>
          </select>
          <button
            type="button"
            onClick={() => loadItems()}
            className="px-4 py-3 border border-white/20 text-white text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="border border-white/10 p-8 text-sm text-gray-400">Loading records...</div>
        ) : error ? (
          <div className="border border-red-400/20 p-8 text-sm text-red-300">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="border border-white/10 p-8 text-sm text-gray-400">No records found.</div>
        ) : (
          <div className="overflow-x-auto border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  {config.listColumns.map((column) => (
                    <th key={column} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400">
                      {column.replaceAll("_", " ")}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-white/10 hover:bg-white/[0.02]">
                    {config.listColumns.map((column) => (
                      <td key={column} className="px-4 py-3 text-gray-300 align-top">
                        {formatValue(item[column])}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/${entity}/${item.id}`}
                          className="px-3 py-1.5 border border-white/20 text-[10px] uppercase tracking-widest text-white hover:bg-white/5"
                        >
                          Edit
                        </Link>
                        {"is_published" in item && (
                          <button
                            type="button"
                            onClick={() => toggleField(item.id, "is_published", Boolean(item.is_published))}
                            className="px-3 py-1.5 border border-white/20 text-[10px] uppercase tracking-widest text-white hover:bg-white/5"
                          >
                            {item.is_published ? "Unpublish" : "Publish"}
                          </button>
                        )}
                        {"is_featured" in item && (
                          <button
                            type="button"
                            onClick={() => toggleField(item.id, "is_featured", Boolean(item.is_featured))}
                            className="px-3 py-1.5 border border-white/20 text-[10px] uppercase tracking-widest text-white hover:bg-white/5"
                          >
                            {item.is_featured ? "Unfeature" : "Feature"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="px-3 py-1.5 border border-red-400/30 text-[10px] uppercase tracking-widest text-red-300 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
