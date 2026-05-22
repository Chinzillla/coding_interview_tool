import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markProblemScheduleTasksDone } from "@/lib/studyTasks";

const progressSchema = z.object({
  problemId: z.string(),
  mode: z.string().default("flashcard"),
  memoryCorrect: z.boolean().optional(),
  codeCorrect: z.boolean().optional(),
  runtimeCorrect: z.boolean().optional(),
  answers: z.record(z.string(), z.unknown()).default({}),
  mistakeTags: z.array(z.string()).default([])
});

function parseMistakeTags(value: string | null | undefined) {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function uniqueTags(tags: string[]) {
  return Array.from(
    new Set(tags.map((tag) => tag.trim()).filter(Boolean))
  ).slice(0, 12);
}

function intervalDays(streak: number) {
  if (streak <= 0) return 0;
  if (streak === 1) return 1;
  if (streak === 2) return 3;
  if (streak === 3) return 7;
  if (streak === 4) return 14;
  return 30;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function scheduleReview(correct: boolean | undefined, currentStreak: number, now: Date) {
  if (typeof correct !== "boolean") {
    return null;
  }

  const streak = correct ? currentStreak + 1 : 0;
  return {
    streak,
    dueAt: correct ? addDays(now, intervalDays(streak)) : now
  };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = progressSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  const flags = [
    parsed.data.memoryCorrect,
    parsed.data.codeCorrect,
    parsed.data.runtimeCorrect
  ].filter((value): value is boolean => typeof value === "boolean");

  const score = flags.filter(Boolean).length;
  const total = Math.max(flags.length, 1);
  const now = new Date();
  const where = {
    userId_problemId: {
      userId: user.id,
      problemId: parsed.data.problemId
    }
  };
  const existingProgress = await prisma.progress.findUnique({ where });
  const memoryReview = scheduleReview(
    parsed.data.memoryCorrect,
    existingProgress?.memoryStreak ?? 0,
    now
  );
  const codeReview = scheduleReview(
    parsed.data.codeCorrect,
    existingProgress?.codeStreak ?? 0,
    now
  );
  const runtimeReview = scheduleReview(
    parsed.data.runtimeCorrect,
    existingProgress?.runtimeStreak ?? 0,
    now
  );
  const answeredEveryDomain = flags.length === 3;
  const hadMiss = flags.some((value) => !value);
  const mistakeTags = hadMiss
    ? uniqueTags([
        ...parseMistakeTags(existingProgress?.mistakeTags),
        ...parsed.data.mistakeTags,
        ...(parsed.data.memoryCorrect === false ? ["memory recall"] : []),
        ...(parsed.data.codeCorrect === false ? ["code recall"] : []),
        ...(parsed.data.runtimeCorrect === false ? ["complexity"] : [])
      ])
    : answeredEveryDomain
      ? []
      : parseMistakeTags(existingProgress?.mistakeTags);

  const updateData = {
    attempts: { increment: 1 },
    lastReviewedAt: now,
    mistakeTags: JSON.stringify(mistakeTags),
    ...(typeof parsed.data.memoryCorrect === "boolean"
      ? {
          memoryScore: parsed.data.memoryCorrect ? 100 : 0,
          memoryStreak: memoryReview?.streak ?? 0,
          memoryDueAt: memoryReview?.dueAt
        }
      : {}),
    ...(typeof parsed.data.codeCorrect === "boolean"
      ? {
          codeScore: parsed.data.codeCorrect ? 100 : 0,
          codeStreak: codeReview?.streak ?? 0,
          codeDueAt: codeReview?.dueAt
        }
      : {}),
    ...(typeof parsed.data.runtimeCorrect === "boolean"
      ? {
          runtimeScore: parsed.data.runtimeCorrect ? 100 : 0,
          runtimeStreak: runtimeReview?.streak ?? 0,
          runtimeDueAt: runtimeReview?.dueAt
        }
      : {})
  };

  const createData = {
    userId: user.id,
    problemId: parsed.data.problemId,
    attempts: 1,
    lastReviewedAt: now,
    mistakeTags: JSON.stringify(mistakeTags),
    memoryScore: parsed.data.memoryCorrect ? 100 : 0,
    codeScore: parsed.data.codeCorrect ? 100 : 0,
    runtimeScore: parsed.data.runtimeCorrect ? 100 : 0,
    memoryStreak: memoryReview?.streak ?? 0,
    codeStreak: codeReview?.streak ?? 0,
    runtimeStreak: runtimeReview?.streak ?? 0,
    memoryDueAt: memoryReview?.dueAt ?? null,
    codeDueAt: codeReview?.dueAt ?? null,
    runtimeDueAt: runtimeReview?.dueAt ?? null
  };

  const [progress] = await prisma.$transaction([
    prisma.progress.upsert({
      where,
      create: createData,
      update: updateData
    }),
    prisma.attempt.create({
      data: {
        userId: user.id,
        problemId: parsed.data.problemId,
        mode: parsed.data.mode,
        memoryCorrect: parsed.data.memoryCorrect,
        codeCorrect: parsed.data.codeCorrect,
        runtimeCorrect: parsed.data.runtimeCorrect,
        score,
        total,
        answers: JSON.stringify(parsed.data.answers),
        mistakeTags: JSON.stringify(mistakeTags)
      }
    })
  ]);

  const completedDomains = [
    typeof parsed.data.memoryCorrect === "boolean" ? "memory" : null,
    typeof parsed.data.codeCorrect === "boolean" ? "code" : null,
    typeof parsed.data.runtimeCorrect === "boolean" ? "complexity" : null
  ].filter((domain): domain is string => Boolean(domain));
  await markProblemScheduleTasksDone(user.id, parsed.data.problemId, completedDomains, now);
  revalidatePath("/schedule");
  revalidatePath("/dashboard");

  return NextResponse.json({ progress });
}
