import { promises as fs } from "fs";
import path from "path";
import type {
  Database,
  Product,
  Project,
  ProjectStatus,
  Submittal,
  SubmittalItem,
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
    const db = JSON.parse(raw) as Database;
    // Databases written before the submittal feature lack these collections.
    db.products ??= seedDatabase().products;
    db.submittals ??= [];
    return db;
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

export async function listProducts(): Promise<Product[]> {
  const db = await ensureDb();
  return [...db.products].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProduct(id: string): Promise<Product | null> {
  const db = await ensureDb();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: {
  name: string;
  manufacturer?: string;
  model?: string;
  category?: string;
  keywords?: string[];
  datasheetFile?: string | null;
}): Promise<Product> {
  const db = await ensureDb();
  const ts = now();
  const product: Product = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    manufacturer: (input.manufacturer ?? "").trim(),
    model: (input.model ?? "").trim(),
    category: (input.category ?? "Other").trim(),
    keywords: (input.keywords ?? []).map((k) => k.trim()).filter(Boolean),
    datasheetFile: input.datasheetFile ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  db.products.push(product);
  await writeDb(db);
  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<
    Pick<
      Product,
      "name" | "manufacturer" | "model" | "category" | "keywords" | "datasheetFile"
    >
  >,
): Promise<Product | null> {
  const db = await ensureDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...patch, updatedAt: now() };
  await writeDb(db);
  return db.products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await ensureDb();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === before) return false;
  for (const submittal of db.submittals) {
    for (const item of submittal.items) {
      if (item.productId === id) item.productId = null;
    }
  }
  await writeDb(db);
  return true;
}

export async function listSubmittals(): Promise<Submittal[]> {
  const db = await ensureDb();
  return [...db.submittals].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getSubmittal(id: string): Promise<Submittal | null> {
  const db = await ensureDb();
  return db.submittals.find((s) => s.id === id) ?? null;
}

export async function createSubmittal(input: {
  name: string;
  number?: string;
  projectId?: string | null;
  projectName?: string;
  contractor?: string;
  engineer?: string;
  preparedBy?: string;
  notes?: string;
  quoteFile?: string | null;
  quoteFilename?: string;
  items?: SubmittalItem[];
}): Promise<Submittal> {
  const db = await ensureDb();
  const ts = now();
  const submittal: Submittal = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    number: (input.number ?? "").trim(),
    projectId: input.projectId ?? null,
    projectName: (input.projectName ?? "").trim(),
    contractor: (input.contractor ?? "").trim(),
    engineer: (input.engineer ?? "").trim(),
    preparedBy: (input.preparedBy ?? "").trim(),
    notes: (input.notes ?? "").trim(),
    status: "draft",
    quoteFile: input.quoteFile ?? null,
    quoteFilename: (input.quoteFilename ?? "").trim(),
    items: input.items ?? [],
    createdAt: ts,
    updatedAt: ts,
  };
  db.submittals.push(submittal);
  await writeDb(db);
  return submittal;
}

export async function updateSubmittal(
  id: string,
  patch: Partial<
    Pick<
      Submittal,
      | "name"
      | "number"
      | "projectId"
      | "projectName"
      | "contractor"
      | "engineer"
      | "preparedBy"
      | "notes"
      | "status"
      | "quoteFile"
      | "quoteFilename"
      | "items"
    >
  >,
): Promise<Submittal | null> {
  const db = await ensureDb();
  const idx = db.submittals.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  db.submittals[idx] = { ...db.submittals[idx], ...patch, updatedAt: now() };
  await writeDb(db);
  return db.submittals[idx];
}

export async function deleteSubmittal(id: string): Promise<boolean> {
  const db = await ensureDb();
  const before = db.submittals.length;
  db.submittals = db.submittals.filter((s) => s.id !== id);
  if (db.submittals.length === before) return false;
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
