import { NextResponse } from "next/server";
import { deleteTask, updateTask } from "@/lib/store";
import type { TaskPriority, TaskStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const task = await updateTask(id, {
    title: body.title,
    description: body.description,
    status: body.status as TaskStatus | undefined,
    priority: body.priority as TaskPriority | undefined,
    assignee: body.assignee,
    dueDate: body.dueDate,
  });
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const ok = await deleteTask(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
