import { AppShell } from "@/components/AppShell";
import { StudyClient } from "@/components/StudyClient";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toStudyProblem } from "@/lib/study";

export default async function LearnPage() {
  const user = await requireUser();
  const rows = await prisma.problem.findMany({
    orderBy: [{ week: "asc" }, { weekOrder: "asc" }],
    include: {
      progress: {
        where: { userId: user.id }
      }
    }
  });

  return (
    <AppShell active="learn">
      <StudyClient problems={rows.map(toStudyProblem)} />
    </AppShell>
  );
}
