export type ProjectStatus = "planning" | "active" | "on_hold" | "complete";
export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  description: string;
  startDate: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmittalStatus = "draft" | "submitted" | "approved" | "revise";

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  category: string;
  keywords: string[];
  datasheetFile: string | null;
  /** Vendor submittal/spec sheet URL the cut sheet can be fetched from. */
  datasheetUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmittalItem {
  id: string;
  lineNo: number;
  qty: string;
  unit: string;
  description: string;
  productId: string | null;
  include: boolean;
  rawLine: string;
}

export interface Submittal {
  id: string;
  name: string;
  number: string;
  projectId: string | null;
  projectName: string;
  contractor: string;
  engineer: string;
  preparedBy: string;
  notes: string;
  status: SubmittalStatus;
  quoteFile: string | null;
  quoteFilename: string;
  items: SubmittalItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  projects: Project[];
  tasks: Task[];
  products: Product[];
  submittals: Submittal[];
}

export const PROJECT_STATUSES: ProjectStatus[] = [
  "planning",
  "active",
  "on_hold",
  "complete",
];

export const TASK_STATUSES: TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On Hold",
  complete: "Complete",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const SUBMITTAL_STATUSES: SubmittalStatus[] = [
  "draft",
  "submitted",
  "approved",
  "revise",
];

export const SUBMITTAL_STATUS_LABELS: Record<SubmittalStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  revise: "Revise & Resubmit",
};

export const PRODUCT_CATEGORIES = [
  "Pipe",
  "Fittings",
  "Valves",
  "Hydrants",
  "Service Brass",
  "Meters",
  "Restraint",
  "Couplings & Repair",
  "Tapping",
  "Drainage",
  "Pumps",
  "Other",
] as const;
