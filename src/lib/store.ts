import { promises as fs } from "fs";
import path from "path";
import type {
  Database,
  Project,
  ProjectStatus,
  Task,
  TaskPriority,
  TaskStatus,
} from "./types";
import { seedDatabase } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

async function ensureDb(): Promise<Database> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Database;
  } catch {
    const seed = seedDatabase();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
}

async function writeDb(db: Database): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function now(): string {
  return new Date().toISOString();
}

export async function listProjects(): Promise<Project[]> {
  const db = await ensureDb();
  return [...db.projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getProject(id: string): Promise<Project | null> {
  const db = await ensureDb();
  return db.projects.find((p) => p.id === id) ?? null;
}

export async function createProject(input: {
  name: string;
  client?: string;
  location?: string;
  status?: ProjectStatus;
  description?: string;
  startDate?: string;
  targetDate?: string;
}): Promise<Project> {
  const db = await ensureDb();
  const ts = now();
  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    client: (input.client ?? "").trim(),
    location: (input.location ?? "").trim(),
    status: input.status ?? "planning",
    description: (input.description ?? "").trim(),
    startDate: input.startDate ?? "",
    targetDate: input.targetDate ?? "",
    createdAt: ts,
    updatedAt: ts,
  };
  db.projects.push(project);
  await writeDb(db);
  return project;
}

export async function updateProject(
  id: string,
  patch: Partial<
    Pick<
      Project,
      | "name"
      | "client"
      | "location"
      | "status"
      | "description"
      | "startDate"
      | "targetDate"
    >
  >,
): Promise<Project | null> {
  const db = await ensureDb();
  const idx = db.projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.projects[idx] = {
    ...db.projects[idx],
    ...patch,
    updatedAt: now(),
  };
  await writeDb(db);
  return db.projects[idx];
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await ensureDb();
  const before = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  db.tasks = db.tasks.filter((t) => t.projectId !== id);
  if (db.projects.length === before) return false;
  await writeDb(db);
  return true;
}

export async function listTasks(projectId: string): Promise<Task[]> {
  const db = await ensureDb();
  return db.tasks
    .filter((t) => t.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export async function createTask(input: {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: string;
}): Promise<Task | null> {
  const db = await ensureDb();
  if (!db.projects.some((p) => p.id === input.projectId)) return null;
  const ts = now();
  const task: Task = {
    id: crypto.randomUUID(),
    projectId: input.projectId,
    title: input.title.trim(),
    description: (input.description ?? "").trim(),
    status: input.status ?? "todo",
    priority: input.priority ?? "medium",
    assignee: (input.assignee ?? "").trim(),
    dueDate: input.dueDate ?? "",
    createdAt: ts,
    updatedAt: ts,
  };
  db.tasks.push(task);
  const project = db.projects.find((p) => p.id === input.projectId);
  if (project) project.updatedAt = ts;
  await writeDb(db);
  return task;
}

export async function updateTask(
  id: string,
  patch: Partial<
    Pick<
      Task,
      "title" | "description" | "status" | "priority" | "assignee" | "dueDate"
    >
  >,
): Promise<Task | null> {
  const db = await ensureDb();
  const idx = db.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const ts = now();
  db.tasks[idx] = {
    ...db.tasks[idx],
    ...patch,
    updatedAt: ts,
  };
  const project = db.projects.find((p) => p.id === db.tasks[idx].projectId);
  if (project) project.updatedAt = ts;
  await writeDb(db);
  return db.tasks[idx];
}

export async function deleteTask(id: string): Promise<boolean> {
  const db = await ensureDb();
  const before = db.tasks.length;
  db.tasks = db.tasks.filter((t) => t.id !== id);
  if (db.tasks.length === before) return false;
  await writeDb(db);
  return true;
}

export async function getStats() {
  const db = await ensureDb();
  return {
    projectCount: db.projects.length,
    activeProjects: db.projects.filter((p) => p.status === "active").length,
    taskCount: db.tasks.length,
    openTasks: db.tasks.filter((t) => t.status !== "done").length,
  };
}
