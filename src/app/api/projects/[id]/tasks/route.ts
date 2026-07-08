import { NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/store";
import type { TaskPriority, TaskStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const tasks = await listTasks(id);
  return NextResponse.json(tasks);
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  if (!body?.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const task = await createTask({
    projectId: id,
    title: body.title,
    description: body.description,
    status: body.status as TaskStatus | undefined,
    priority: body.priority as TaskPriority | undefined,
    assignee: body.assignee,
    dueDate: body.dueDate,
  });
  if (!task) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(task, { status: 201 });
}
