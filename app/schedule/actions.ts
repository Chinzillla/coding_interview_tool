"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nextScheduledStudyDate, syncStudyTasks } from "@/lib/studyTasks";
import { toStudyProblem } from "@/lib/study";

async function getTaskForUser(taskId: string, userId: string) {
  return prisma.studyTask.findFirst({
    where: {
      id: taskId,
      userId
    }
  });
}

export async function completeTaskAction(formData: FormData) {
  const user = await requireUser();
  const taskId = String(formData.get("taskId") ?? "");
  if (!taskId) return;

  const task = await getTaskForUser(taskId, user.id);
  if (!task) return;

  await prisma.studyTask.update({
    where: { id: task.id },
    data: {
      status: "done",
      completedAt: new Date()
    }
  });

  revalidatePath("/schedule");
}

export async function skipTaskAction(formData: FormData) {
  const user = await requireUser();
  const taskId = String(formData.get("taskId") ?? "");
  if (!taskId) return;

  const task = await getTaskForUser(taskId, user.id);
  if (!task) return;

  await prisma.studyTask.update({
    where: { id: task.id },
    data: {
      status: "pending",
      scheduledFor: nextScheduledStudyDate(task.scheduledFor),
      carryoverCount: { increment: 1 },
      skippedAt: new Date()
    }
  });

  revalidatePath("/schedule");
}

export async function resyncScheduleAction() {
  const user = await requireUser();
  const rows = await prisma.problem.findMany({
    orderBy: [{ week: "asc" }, { weekOrder: "asc" }],
    include: {
      progress: {
        where: { userId: user.id }
      }
    }
  });

  await syncStudyTasks(user.id, rows.map(toStudyProblem));
  revalidatePath("/schedule");
}
