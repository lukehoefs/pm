import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProjectBoard } from "@/components/ProjectBoard";
import { getProject, listTasks } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  const tasks = await listTasks(id);

  return (
    <AppShell title={project.name} subtitle={project.client || undefined}>
      <ProjectBoard project={project} initialTasks={tasks} />
    </AppShell>
  );
}
