import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/store";
import type { ProjectStatus } from "@/lib/types";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const project = await createProject({
    name: body.name,
    client: body.client,
    location: body.location,
    status: body.status as ProjectStatus | undefined,
    description: body.description,
    startDate: body.startDate,
    targetDate: body.targetDate,
  });
  return NextResponse.json(project, { status: 201 });
}
