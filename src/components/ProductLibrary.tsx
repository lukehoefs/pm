"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { PRODUCT_CATEGORIES } from "@/lib/types";

const EMPTY_FORM = {
  name: "",
  manufacturer: "",
  model: "",
  category: "Other",
  keywords: "",
};

export function ProductLibrary({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = new FormData();
      data.set("name", form.name);
      data.set("manufacturer", form.manufacturer);
      data.set("model", form.model);
      data.set("category", form.category);
      data.set("keywords", form.keywords);
      const file = fileRef.current?.files?.[0];
      if (file) data.set("datasheet", file);
      const res = await fetch("/api/products", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add product");
      }
      const product = (await res.json()) as Product;
      setProducts((prev) =>
        [...prev, product].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setForm(EMPTY_FORM);
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete “${product.name}” from the library?`)) return;
    const res = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      manufacturer: product.manufacturer,
      model: product.model,
      category: product.category,
      keywords: product.keywords.join(", "),
    });
  }

  async function handleEditSave(id: string) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        manufacturer: editForm.manufacturer,
        model: editForm.model,
        category: editForm.category,
        keywords: editForm.keywords.split(",").map((k) => k.trim()),
      }),
    });
    if (res.ok) {
      const updated = (await res.json()) as Product;
      setProducts((prev) =>
        prev
          .map((p) => (p.id === id ? updated : p))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      setEditingId(null);
    }
  }

  async function handleDatasheetUpload(id: string, file: File) {
    const data = new FormData();
    data.set("datasheet", file);
    const res = await fetch(`/api/products/${id}/datasheet`, {
      method: "POST",
      body: data,
    });
    if (res.ok) {
      const updated = (await res.json()) as Product;
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Product Library
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Manufacturer cut sheets used to build submittal packages. Keywords
            drive automatic matching against quote line items.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--accent-hover)]"
        >
          {open ? "Cancel" : "Add product"}
        </button>
      </section>

      {open ? (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm sm:p-5"
        >
          <h2 className="text-sm font-semibold">Add product</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Product name *
              </span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field"
                placeholder='Resilient Wedge Gate Valve, Mechanical Joint'
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Manufacturer
              </span>
              <input
                value={form.manufacturer}
                onChange={(e) =>
                  setForm({ ...form, manufacturer: e.target.value })
                }
                className="field"
                placeholder="Mueller"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Model / series
              </span>
              <input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="field"
                placeholder="A-2361"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Category
              </span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="field"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Data sheet PDF
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="field"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Match keywords (comma-separated)
              </span>
              <input
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="field"
                placeholder="gate, valve, mj, rw, resilient, wedge"
              />
            </label>
          </div>
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
            >
              {saving ? "Adding…" : "Add product"}
            </button>
          </div>
        </form>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {products.map((product) =>
          editingId === product.id ? (
            <div
              key={product.id}
              className="rounded-xl border border-[var(--accent)]/40 bg-[var(--panel)] p-4 shadow-sm"
            >
              <div className="grid gap-2">
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="field"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={editForm.manufacturer}
                    onChange={(e) =>
                      setEditForm({ ...editForm, manufacturer: e.target.value })
                    }
                    className="field"
                    placeholder="Manufacturer"
                  />
                  <input
                    value={editForm.model}
                    onChange={(e) =>
                      setEditForm({ ...editForm, model: e.target.value })
                    }
                    className="field"
                    placeholder="Model"
                  />
                </div>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="field"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  value={editForm.keywords}
                  onChange={(e) =>
                    setEditForm({ ...editForm, keywords: e.target.value })
                  }
                  className="field"
                  placeholder="Keywords, comma-separated"
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleEditSave(product.id)}
                  className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <article
              key={product.id}
              className="group flex flex-col rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-sm transition hover:border-[var(--accent)]/40"
            >
              <div className="flex items-start justify-between gap-3 p-4 pb-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold tracking-tight">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">
                    {[product.manufacturer, product.model]
                      .filter(Boolean)
                      .join(" · ") || "No manufacturer"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]">
                  {product.category}
                </span>
              </div>
              {product.keywords.length > 0 ? (
                <p className="px-4 pb-1 text-xs text-[var(--muted)]">
                  {product.keywords.join(" · ")}
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] px-4 py-3 text-xs">
                {product.datasheetFile ? (
                  <a
                    href={`/api/products/${product.id}/datasheet`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    View data sheet
                  </a>
                ) : (
                  <span className="text-amber-600">No data sheet</span>
                )}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer rounded-md px-2 py-1 font-medium text-[var(--muted)] hover:bg-slate-100">
                    {product.datasheetFile ? "Replace PDF" : "Upload PDF"}
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDatasheetUpload(product.id, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="rounded-md px-2 py-1 font-medium text-[var(--muted)] hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="rounded-md px-2 py-1 text-rose-600 opacity-0 transition hover:bg-rose-50 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ),
        )}
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--panel)] p-8 text-center text-sm text-[var(--muted)] md:col-span-2">
            No products yet. Add manufacturer cut sheets to start building
            submittals.
          </div>
        ) : null}
      </section>
    </div>
  );
}
