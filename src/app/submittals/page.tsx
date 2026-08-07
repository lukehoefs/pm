import { AppShell } from "@/components/AppShell";
import { SubmittalList } from "@/components/SubmittalList";
import { listSubmittals } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SubmittalsPage() {
  const submittals = await listSubmittals();

  return (
    <AppShell title="Submittals" subtitle="Quote-to-submittal packages">
      <SubmittalList initialSubmittals={submittals} />
    </AppShell>
  );
}
