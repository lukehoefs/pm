"use client";

import { useMemo, useState } from "react";
import type { Product, Project, Submittal, SubmittalItem } from "@/lib/types";
import {
  SUBMITTAL_STATUSES,
  SUBMITTAL_STATUS_LABELS,
  type SubmittalStatus,
} from "@/lib/types";

export function SubmittalEditor({
  initialSubmittal,
  products,
  projects,
}: {
  initialSubmittal: Submittal;
  products: Product[];
  projects: Project[];
}) {
  const [submittal, setSubmittal] = useState(initialSubmittal);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );
  const includedCount = submittal.items.filter((i) => i.include).length;

  function patchSubmittal(patch: Partial<Submittal>) {
    setSubmittal((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  function patchItem(id: string, patch: Partial<SubmittalItem>) {
    setSubmittal((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
    setDirty(true);
  }

  function removeItem(id: string) {
    setSubmittal((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
    setDirty(true);
  }

  function addItem() {
    setSubmittal((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          lineNo: prev.items.length + 1,
          qty: "1",
          unit: "EA",
          description: "",
          productId: null,
          include: true,
          rawLine: "",
        },
      ],
    }));
    setDirty(true);
  }

  async function save(): Promise<Submittal | null> {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/submittals/${submittal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: submittal.name,
          number: submittal.number,
          projectId: submittal.projectId,
          projectName: submittal.projectName,
          contractor: submittal.contractor,
          engineer: submittal.engineer,
          preparedBy: submittal.preparedBy,
          notes: submittal.notes,
          status: submittal.status,
          items: submittal.items,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save");
      }
      const updated = (await res.json()) as Submittal;
      setSubmittal(updated);
      setDirty(false);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    setWarnings([]);
    try {
      if (dirty) {
        const saved = await save();
        if (!saved) return;
      }
      const res = await fetch(`/api/submittals/${submittal.id}/package`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to generate package");
      }
      const warningHeader = res.headers.get("X-Submittal-Warnings");
      if (warningHeader) {
        try {
          setWarnings(JSON.parse(decodeURIComponent(warningHeader)));
        } catch {
          // Header is advisory only.
        }
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(disposition);
      a.download = match?.[1] ?? "submittal.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="display text-3xl text-[var(--header)] sm:text-4xl">
            {submittal.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {includedCount} of {submittal.items.length} line items included
            {submittal.quoteFilename ? (
              <>
                {" · parsed from "}
                <a
                  href={`/api/submittals/${submittal.id}/quote`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[var(--accent)] hover:underline"
                >
                  {submittal.quoteFilename}
                </a>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? "Saving…" : dirty ? "Save draft" : "Saved"}
          </button>
          <button
            type="button"
            onClick={generate}
            disabled={generating || includedCount === 0}
            className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {generating ? "Generating…" : "Generate package"}
          </button>
        </div>
      </section>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">
            Package generated with {warnings.length} warning
            {warnings.length === 1 ? "" : "s"}:
          </p>
          <ul className="mt-1 list-inside list-disc">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold">Package details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Submittal name *
            </span>
            <input
              value={submittal.name}
              onChange={(e) => patchSubmittal({ name: e.target.value })}
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Submittal number
            </span>
            <input
              value={submittal.number}
              onChange={(e) => patchSubmittal({ number: e.target.value })}
              className="field"
              placeholder="S-001"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Status
            </span>
            <select
              value={submittal.status}
              onChange={(e) =>
                patchSubmittal({ status: e.target.value as SubmittalStatus })
              }
              className="field"
            >
              {SUBMITTAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {SUBMITTAL_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Link to project
            </span>
            <select
              value={submittal.projectId ?? ""}
              onChange={(e) => {
                const project = projects.find((p) => p.id === e.target.value);
                patchSubmittal({
                  projectId: project?.id ?? null,
                  projectName: project
                    ? project.name
                    : submittal.projectName,
                });
              }}
              className="field"
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Project name (on cover)
            </span>
            <input
              value={submittal.projectName}
              onChange={(e) => patchSubmittal({ projectName: e.target.value })}
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Contractor
            </span>
            <input
              value={submittal.contractor}
              onChange={(e) => patchSubmittal({ contractor: e.target.value })}
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Engineer of record
            </span>
            <input
              value={submittal.engineer}
              onChange={(e) => patchSubmittal({ engineer: e.target.value })}
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Prepared by
            </span>
            <input
              value={submittal.preparedBy}
              onChange={(e) => patchSubmittal({ preparedBy: e.target.value })}
              className="field"
              placeholder="Your company name"
            />
          </label>
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Cover notes
            </span>
            <input
              value={submittal.notes}
              onChange={(e) => patchSubmittal({ notes: e.target.value })}
              className="field"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold">Line items</h2>
          <button
            type="button"
            onClick={addItem}
            className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
          >
            Add line
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-[11px] uppercase tracking-wide text-[var(--muted)]">
                <th className="px-4 py-2 sm:pl-5">In</th>
                <th className="px-2 py-2 w-20">Qty</th>
                <th className="px-2 py-2 w-20">Unit</th>
                <th className="px-2 py-2">Description</th>
                <th className="px-2 py-2 w-64">Library product</th>
                <th className="px-2 py-2 sm:pr-5" />
              </tr>
            </thead>
            <tbody>
              {submittal.items.map((item) => {
                const product = item.productId
                  ? productById.get(item.productId)
                  : undefined;
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-[var(--line)] last:border-b-0 ${item.include ? "" : "opacity-45"}`}
                  >
                    <td className="px-4 py-2 align-top sm:pl-5">
                      <input
                        type="checkbox"
                        checked={item.include}
                        onChange={(e) =>
                          patchItem(item.id, { include: e.target.checked })
                        }
                        className="mt-2 h-4 w-4 accent-[var(--accent)]"
                      />
                    </td>
                    <td className="px-2 py-2 align-top">
                      <input
                        value={item.qty}
                        onChange={(e) =>
                          patchItem(item.id, { qty: e.target.value })
                        }
                        className="field"
                      />
                    </td>
                    <td className="px-2 py-2 align-top">
                      <input
                        value={item.unit}
                        onChange={(e) =>
                          patchItem(item.id, { unit: e.target.value })
                        }
                        className="field"
                      />
                    </td>
                    <td className="px-2 py-2 align-top">
                      <input
                        value={item.description}
                        onChange={(e) =>
                          patchItem(item.id, { description: e.target.value })
                        }
                        className="field"
                      />
                      {item.rawLine && item.rawLine !== item.description ? (
                        <p
                          className="mt-1 truncate text-[11px] text-[var(--muted)]"
                          title={item.rawLine}
                        >
                          {item.rawLine}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-2 py-2 align-top">
                      <select
                        value={item.productId ?? ""}
                        onChange={(e) =>
                          patchItem(item.id, {
                            productId: e.target.value || null,
                          })
                        }
                        className="field"
                      >
                        <option value="">— No product —</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {product && !product.datasheetFile ? (
                        <p className="mt-1 text-[11px] text-amber-600">
                          No data sheet on file
                        </p>
                      ) : null}
                    </td>
                    <td className="px-2 py-2 align-top sm:pr-5">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="mt-1 rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {submittal.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-[var(--muted)]"
                  >
                    No line items parsed. Add lines manually or re-upload a
                    text-based quote PDF.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
