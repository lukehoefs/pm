import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { SubmittalEditor } from "@/components/SubmittalEditor";
import { getSubmittal, listProducts, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SubmittalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [submittal, products, projects] = await Promise.all([
    getSubmittal(id),
    listProducts(),
    listProjects(),
  ]);
  if (!submittal) notFound();

  return (
    <AppShell title={submittal.name} subtitle="Submittal package">
      <SubmittalEditor
        initialSubmittal={submittal}
        products={products}
        projects={projects}
      />
    </AppShell>
  );
}
