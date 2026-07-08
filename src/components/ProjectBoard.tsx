"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project, Task, TaskPriority, TaskStatus } from "@/lib/types";
import {
  PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from "@/lib/types";
import { PriorityBadge, ProjectStatusBadge } from "./StatusBadge";

export function ProjectBoard({
  project,
  initialTasks,
}: {
  project: Project;
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignee: "",
    dueDate: "",
  });

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(
      TASK_STATUSES.map((s) => [s, [] as Task[]]),
    ) as Record<TaskStatus, Task[]>;
    for (const task of tasks) {
      map[task.status].push(task);
    }
    return map;
  }, [tasks]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create task");
      }
      const task = (await res.json()) as Task;
      setTasks((prev) => [task, ...prev]);
      setForm({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignee: "",
        dueDate: "",
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function moveTask(taskId: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      // reload from server on failure
      const list = await fetch(`/api/projects/${project.id}/tasks`);
      if (list.ok) setTasks(await list.json());
    } else {
      const updated = (await res.json()) as Task;
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }
  }

  async function handleDelete(taskId: string, title: string) {
    if (!confirm(`Delete task “${title}”?`)) return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="text-xs font-medium text-[var(--muted)] hover:text-[var(--accent)]"
              >
                ← All projects
              </Link>
              <ProjectStatusBadge status={project.status} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {[project.client, project.location].filter(Boolean).join(" · ") ||
                "No client / location"}
            </p>
            {project.description ? (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                {project.description}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
              {project.startDate ? <span>Start {project.startDate}</span> : null}
              {project.targetDate ? (
                <span>Target {project.targetDate}</span>
              ) : null}
              <span>
                {tasks.filter((t) => t.status !== "done").length} open ·{" "}
                {tasks.length} total
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--accent-hover)]"
          >
            {open ? "Cancel" : "Add task"}
          </button>
        </div>

        {open ? (
          <form
            onSubmit={handleCreate}
            className="mt-5 border-t border-[var(--line)] pt-5"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block sm:col-span-2 lg:col-span-3">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  Title *
                </span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="field"
                  placeholder="Pour sheet-pile cap — Segment B"
                />
              </label>
              <label className="block sm:col-span-2 lg:col-span-3">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="field resize-y"
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
                      status: e.target.value as TaskStatus,
                    })
                  }
                  className="field"
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {TASK_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  Priority
                </span>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as TaskPriority,
                    })
                  }
                  className="field"
                >
                  {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  Assignee
                </span>
                <input
                  value={form.assignee}
                  onChange={(e) =>
                    setForm({ ...form, assignee: e.target.value })
                  }
                  className="field"
                  placeholder="Field Crew A"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
                  Due date
                </span>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="field"
                />
              </label>
            </div>
            {error ? (
              <p className="mt-3 text-sm text-rose-600">{error}</p>
            ) : null}
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {saving ? "Adding…" : "Add task"}
              </button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="flex gap-3 overflow-x-auto pb-2">
        {TASK_STATUSES.map((status) => (
          <div
            key={status}
            className="flex w-72 shrink-0 flex-col rounded-xl border border-[var(--line)] bg-slate-50/80"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {TASK_STATUS_LABELS[status]}
              </h2>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                {byStatus[status].length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-2 min-h-[12rem]">
              {byStatus[status].map((task) => (
                <article
                  key={task.id}
                  className="rounded-lg border border-[var(--line)] bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium leading-snug">
                      {task.title}
                    </h3>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description ? (
                    <p className="mt-1.5 line-clamp-2 text-xs text-[var(--muted)]">
                      {task.description}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--muted)]">
                    {task.assignee ? <span>{task.assignee}</span> : null}
                    {task.dueDate ? <span>Due {task.dueDate}</span> : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        moveTask(task.id, e.target.value as TaskStatus)
                      }
                      className="rounded-md border border-[var(--line)] bg-slate-50 px-1.5 py-1 text-[11px]"
                      aria-label={`Move ${task.title}`}
                    >
                      {TASK_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {TASK_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id, task.title)}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {byStatus[status].length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
                  No tasks
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
