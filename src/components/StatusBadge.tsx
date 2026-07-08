import {
  PRIORITY_LABELS,
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
  type TaskPriority,
  type TaskStatus,
  TASK_STATUS_LABELS,
} from "@/lib/types";

const projectStyles: Record<ProjectStatus, string> = {
  planning: "bg-sky-50 text-sky-800 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  on_hold: "bg-amber-50 text-amber-900 ring-amber-200",
  complete: "bg-slate-100 text-slate-700 ring-slate-200",
};

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600 ring-slate-200",
  medium: "bg-sky-50 text-sky-800 ring-sky-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  urgent: "bg-rose-50 text-rose-800 ring-rose-200",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${projectStyles[status]}`}
    >
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${priorityStyles[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

export function TaskStatusLabel({ status }: { status: TaskStatus }) {
  return <span>{TASK_STATUS_LABELS[status]}</span>;
}
