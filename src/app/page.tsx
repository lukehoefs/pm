import { AppShell } from "@/components/AppShell";
import { Dashboard } from "@/components/Dashboard";
import { getStats, listProjects } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, stats] = await Promise.all([listProjects(), getStats()]);

  return (
    <AppShell>
      <Dashboard initialProjects={projects} stats={stats} />
    </AppShell>
  );
}
