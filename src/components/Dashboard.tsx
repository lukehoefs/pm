"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project, ProjectStatus } from "@/lib/types";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/types";
import { ProjectStatusBadge } from "./StatusBadge";

export function Dashboard({
  initialProjects,
  stats,
}: {
  initialProjects: Project[];
  stats: {
    projectCount: number;
    activeProjects: number;
    taskCount: number;
    openTasks: number;
  };
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    client: "",
    location: "",
    status: "planning" as ProjectStatus,
    description: "",
    startDate: "",
    targetDate: "",
  });

  const sorted = useMemo(
    () =>
      [...projects].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [projects],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create project");
      }
      const project = (await res.json()) as Project;
      setProjects((prev) => [project, ...prev]);
      setForm({
        name: "",
        client: "",
        location: "",
        status: "planning",
        description: "",
        startDate: "",
        targetDate: "",
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete project “${name}” and all of its tasks?`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-3xl text-[var(--header)] sm:text-4xl">
            Projects
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Track jobs, tasks, and submittal work from one local workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--accent-hover)]"
        >
          {open ? "Cancel" : "New project"}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Projects", value: projects.length || stats.projectCount },
          {
            label: "Active",
            value: projects.filter((p) => p.status === "active").length,
          },
          { label: "Tasks (seeded)", value: stats.taskCount },
          { label: "Open tasks", value: stats.openTasks },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 shadow-sm"
          >
            <div className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {item.label}
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {item.value}
            </div>
          </div>
        ))}
      </section>

      {open ? (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm sm:p-5"
        >
          <h2 className="text-sm font-semibold">Create project</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Project name *
              </span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field"
                placeholder="Harbor Walk Seawall Repair"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Client
              </span>
              <input
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="field"
                placeholder="City of Clearwater"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Location
              </span>
              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="field"
                placeholder="Clearwater Beach, FL"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Status
              </span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as ProjectStatus,
                  })
                }
                className="field"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {PROJECT_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Start date
              </span>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Target date
              </span>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) =>
                  setForm({ ...form, targetDate: e.target.value })
                }
                className="field"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="field resize-y"
                placeholder="Scope summary, phase notes..."
              />
            </label>
          </div>
          {error ? (
            <p className="mt-3 text-sm text-rose-600">{error}</p>
          ) : null}
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
              {saving ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((project) => (
          <article
            key={project.id}
            className="group flex flex-col rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-sm transition hover:border-[var(--accent)]/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3 p-4 pb-2">
              <div className="min-w-0">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-base font-semibold tracking-tight text-[var(--ink)] hover:text-[var(--accent)]"
                >
                  {project.name}
                </Link>
                <p className="mt-1 truncate text-sm text-[var(--muted)]">
                  {project.client || "No client"}
                  {project.location ? ` · ${project.location}` : ""}
                </p>
              </div>
              <ProjectStatusBadge status={project.status} />
            </div>
            {project.description ? (
              <p className="line-clamp-2 px-4 text-sm text-[var(--muted)]">
                {project.description}
              </p>
            ) : (
              <p className="px-4 text-sm italic text-[var(--muted)]">
                No description
              </p>
            )}
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--line)] px-4 py-3 text-xs text-[var(--muted)]">
              <span>
                {project.targetDate
                  ? `Target ${project.targetDate}`
                  : "No target date"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(project.id, project.name)}
                  className="rounded-md px-2 py-1 text-rose-600 opacity-0 transition hover:bg-rose-50 group-hover:opacity-100"
                >
                  Delete
                </button>
                <Link
                  href={`/projects/${project.id}`}
                  className="rounded-md bg-slate-900 px-2.5 py-1 font-medium text-white hover:bg-slate-800"
                >
                  Open board
                </Link>
              </div>
            </div>
          </article>
        ))}
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--panel)] p-8 text-center text-sm text-[var(--muted)] md:col-span-2 xl:col-span-3">
            No projects yet. Create your first job to get started.
          </div>
        ) : null}
      </section>
    </div>
  );
}
