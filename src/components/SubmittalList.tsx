"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Submittal } from "@/lib/types";
import { SUBMITTAL_STATUS_LABELS } from "@/lib/types";

const STATUS_STYLES: Record<Submittal["status"], string> = {
  draft: "bg-slate-100 text-slate-700",
  submitted: "bg-sky-100 text-sky-700",
  approved: "bg-emerald-100 text-emerald-700",
  revise: "bg-amber-100 text-amber-700",
};

export function SubmittalList({
  initialSubmittals,
}: {
  initialSubmittals: Submittal[];
}) {
  const router = useRouter();
  const [submittals, setSubmittals] = useState(initialSubmittals);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const data = new FormData();
      data.set("quote", file);
      const res = await fetch("/api/submittals", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to read quote");
      }
      const submittal = (await res.json()) as Submittal;
      router.push(`/submittals/${submittal.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setUploading(false);
    }
  }

  async function handleDelete(submittal: Submittal) {
    if (!confirm(`Delete submittal “${submittal.name}”?`)) return;
    const res = await fetch(`/api/submittals/${submittal.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSubmittals((prev) => prev.filter((s) => s.id !== submittal.id));
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-3xl text-[var(--header)] sm:text-4xl">
            Submittals
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Upload a quote PDF to pull its line items, match them to library
            products, and generate a submittal package.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {uploading ? "Reading quote…" : "New from quote PDF"}
          </button>
        </div>
      </section>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {submittals.map((submittal) => (
          <article
            key={submittal.id}
            className="group flex flex-col rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-sm transition hover:border-[var(--accent)]/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3 p-4 pb-2">
              <div className="min-w-0">
                <Link
                  href={`/submittals/${submittal.id}`}
                  className="text-base font-semibold tracking-tight hover:text-[var(--accent)]"
                >
                  {submittal.name}
                </Link>
                <p className="mt-1 truncate text-sm text-[var(--muted)]">
                  {submittal.projectName || "No project"}
                  {submittal.number ? ` · No. ${submittal.number}` : ""}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[submittal.status]}`}
              >
                {SUBMITTAL_STATUS_LABELS[submittal.status]}
              </span>
            </div>
            <p className="px-4 text-sm text-[var(--muted)]">
              {submittal.items.filter((i) => i.include).length} line item
              {submittal.items.filter((i) => i.include).length === 1 ? "" : "s"}
              {submittal.quoteFilename ? ` · from ${submittal.quoteFilename}` : ""}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--line)] px-4 py-3 text-xs text-[var(--muted)]">
              <span>
                Updated{" "}
                {new Date(submittal.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(submittal)}
                  className="rounded-md px-2 py-1 text-rose-600 opacity-0 transition hover:bg-rose-50 group-hover:opacity-100"
                >
                  Delete
                </button>
                <Link
                  href={`/submittals/${submittal.id}`}
                  className="rounded-md bg-slate-900 px-2.5 py-1 font-medium text-white hover:bg-slate-800"
                >
                  Open
                </Link>
              </div>
            </div>
          </article>
        ))}
        {submittals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--panel)] p-8 text-center text-sm text-[var(--muted)] md:col-span-2 xl:col-span-3">
            No submittals yet. Upload a quote PDF to create your first package.
          </div>
        ) : null}
      </section>
    </div>
  );
}
