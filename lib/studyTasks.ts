import { prisma } from "@/lib/prisma";
import {
  DAILY_MINUTES,
  LEARNING_WEEKS,
  STUDY_DAYS_PER_WEEK,
  STUDY_WEEKS,
  addDays,
  buildStudyDates,
  fromDateKey,
  mapToStudyDateKey,
  nextStudyDate,
  startOfDay,
  toDateKey
} from "@/lib/schedule";
import type { StudyProblem } from "@/lib/study";

const NEW_PROBLEM_DAILY_BUDGET = 95;
const REVIEW_MINUTES = 12;
const MOCK_EXAM_MINUTES = 120;
const EXTENDED_STUDY_DAYS = 220;

export type TaskType = "new_problem" | "due_review" | "mock_exam";

function taskDate(dateISO: string) {
  return fromDateKey(dateISO);
}

function newProblemMinutes(problem: StudyProblem) {
  return Math.min(90, Math.max(45, problem.minutes + 35));
}

function problemDueEntries(problem: StudyProblem) {
  if (problem.progress.attempts === 0) return [];
  const entries = [
    ["memory", problem.progress.memoryDueAt],
    ["code", problem.progress.codeDueAt],
    ["complexity", problem.progress.runtimeDueAt]
  ] as const;

  return entries.flatMap(([domain, dueAt]) => (dueAt ? [[domain, dueAt]] : []));
}

function extendedStudyDates(startDate: Date) {
  const dates: Date[] = [];
  let cursor = nextStudyDate(startDate);

  while (dates.length < EXTENDED_STUDY_DAYS) {
    dates.push(cursor);
    cursor = nextStudyDate(addDays(cursor, 1));
  }

  return dates;
}

async function upsertTask(data: {
  userId: string;
  problemId?: string | null;
  key: string;
  type: TaskType;
  source: string;
  domain?: string | null;
  scheduledFor: Date;
  originalFor: Date;
  minutes: number;
}) {
  await prisma.studyTask.upsert({
    where: {
      userId_key: {
        userId: data.userId,
        key: data.key
      }
    },
    create: {
      ...data,
      problemId: data.problemId ?? null,
      domain: data.domain ?? null,
      status: "pending"
    },
    update: {}
  });
}

async function syncNewProblemTasks(
  userId: string,
  problems: StudyProblem[],
  studyDates: Date[]
) {
  const learningDates = studyDates.slice(0, LEARNING_WEEKS * STUDY_DAYS_PER_WEEK);
  const unattempted = problems.filter((problem) => problem.progress.attempts === 0);
  const attemptedIds = problems
    .filter((problem) => problem.progress.attempts > 0)
    .map((problem) => problem.id);

  if (attemptedIds.length > 0) {
    await prisma.studyTask.updateMany({
      where: {
        userId,
        type: "new_problem",
        problemId: { in: attemptedIds },
        status: { in: ["pending", "skipped"] }
      },
      data: {
        status: "done",
        completedAt: new Date()
      }
    });
  }

  const existingNewTasks = await prisma.studyTask.findMany({
    where: {
      userId,
      type: "new_problem"
    },
    select: {
      problemId: true
    }
  });
  const existingProblemIds = new Set(existingNewTasks.map((task) => task.problemId));
  let dateIndex = 0;
  let usedMinutes = 0;

  for (const problem of unattempted) {
    if (existingProblemIds.has(problem.id)) continue;

    const minutes = newProblemMinutes(problem);
    while (
      dateIndex < learningDates.length - 1 &&
      usedMinutes > 0 &&
      usedMinutes + minutes > NEW_PROBLEM_DAILY_BUDGET
    ) {
      dateIndex += 1;
      usedMinutes = 0;
    }

    const scheduledFor = learningDates[dateIndex] ?? learningDates[learningDates.length - 1];
    await upsertTask({
      userId,
      problemId: problem.id,
      key: `new:${problem.id}`,
      type: "new_problem",
      source: "planned",
      scheduledFor,
      originalFor: scheduledFor,
      minutes
    });
    usedMinutes += minutes;
  }
}

async function syncDueReviewTasks(
  userId: string,
  problems: StudyProblem[],
  studyDates: Date[]
) {
  const studyDateKeys = new Set(studyDates.map(toDateKey));
  const endDate = studyDates[studyDates.length - 1];
  const activeDueKeys: string[] = [];

  for (const problem of problems) {
    for (const [domain, dueAt] of problemDueEntries(problem)) {
      const dueDate = startOfDay(new Date(dueAt));
      const dueDateISO = toDateKey(dueDate);
      const scheduledISO =
        mapToStudyDateKey(dueDate, studyDateKeys, endDate) ??
        toDateKey(nextStudyDate(dueDate));
      const scheduledFor = taskDate(scheduledISO);
      const key = `due:${problem.id}:${domain}:${dueDateISO}`;
      activeDueKeys.push(key);

      await upsertTask({
        userId,
        problemId: problem.id,
        key,
        type: "due_review",
        source: "actual_due",
        domain,
        scheduledFor,
        originalFor: scheduledFor,
        minutes: REVIEW_MINUTES
      });
    }
  }

  await prisma.studyTask.updateMany({
    where: {
      userId,
      type: "due_review",
      status: { in: ["pending", "skipped"] },
      ...(activeDueKeys.length > 0 ? { key: { notIn: activeDueKeys } } : {})
    },
    data: {
      status: "done",
      completedAt: new Date()
    }
  });
}

async function syncMockExamTasks(userId: string, studyDates: Date[]) {
  for (let weekNumber = 23; weekNumber <= STUDY_WEEKS; weekNumber += 1) {
    const scheduledFor = studyDates[(weekNumber - 1) * STUDY_DAYS_PER_WEEK + 5];
    if (!scheduledFor) continue;

    await upsertTask({
      userId,
      problemId: null,
      key: `mock:${weekNumber}`,
      type: "mock_exam",
      source: "planned",
      scheduledFor,
      originalFor: scheduledFor,
      minutes: MOCK_EXAM_MINUTES
    });
  }
}

async function carryForwardMissedTasks(userId: string, today: Date) {
  await prisma.studyTask.updateMany({
    where: {
      userId,
      status: { in: ["pending", "skipped"] },
      scheduledFor: { lt: today }
    },
    data: {
      status: "pending",
      scheduledFor: today,
      carryoverCount: { increment: 1 }
    }
  });
}

async function rebalanceFutureNewWork(userId: string, startDate: Date) {
  const pendingTasks = await prisma.studyTask.findMany({
    where: {
      userId,
      status: "pending",
      scheduledFor: { gte: startDate }
    },
    orderBy: [{ scheduledFor: "asc" }, { carryoverCount: "desc" }, { minutes: "desc" }]
  });
  const tasksByDate = new Map<string, typeof pendingTasks>();

  for (const task of pendingTasks) {
    const key = toDateKey(task.scheduledFor);
    tasksByDate.set(key, [...(tasksByDate.get(key) ?? []), task]);
  }

  for (const date of extendedStudyDates(startDate)) {
    const dateKey = toDateKey(date);
    const tasks = tasksByDate.get(dateKey) ?? [];
    let totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0);
    if (totalMinutes <= DAILY_MINUTES) continue;

    const movable = tasks
      .filter((task) => task.type === "new_problem")
      .sort((first, second) => {
        if (first.carryoverCount !== second.carryoverCount) {
          return first.carryoverCount - second.carryoverCount;
        }
        return second.minutes - first.minutes;
      });

    for (const task of movable) {
      if (totalMinutes <= DAILY_MINUTES) break;
      const nextDate = nextStudyDate(addDays(date, 1));
      await prisma.studyTask.update({
        where: { id: task.id },
        data: { scheduledFor: nextDate }
      });
      tasksByDate.set(
        dateKey,
        (tasksByDate.get(dateKey) ?? []).filter((item) => item.id !== task.id)
      );
      tasksByDate.set(toDateKey(nextDate), [
        ...(tasksByDate.get(toDateKey(nextDate)) ?? []),
        { ...task, scheduledFor: nextDate }
      ]);
      totalMinutes -= task.minutes;
    }
  }
}

export async function syncStudyTasks(userId: string, problems: StudyProblem[], now = new Date()) {
  const today = nextStudyDate(now);
  const studyDates = buildStudyDates(today);
  const endDate = studyDates[studyDates.length - 1];

  await syncNewProblemTasks(userId, problems, studyDates);
  await syncDueReviewTasks(userId, problems, studyDates);
  await syncMockExamTasks(userId, studyDates);
  await carryForwardMissedTasks(userId, today);
  await rebalanceFutureNewWork(userId, today);

  return {
    today,
    endDate,
    studyDates
  };
}

export async function markProblemScheduleTasksDone(
  userId: string,
  problemId: string,
  completedDomains: string[],
  now = new Date()
) {
  await prisma.studyTask.updateMany({
    where: {
      userId,
      problemId,
      status: { in: ["pending", "skipped"] },
      OR: [
        { type: "new_problem" },
        {
          type: "due_review",
          domain: { in: completedDomains }
        }
      ]
    },
    data: {
      status: "done",
      completedAt: now
    }
  });
}

export function nextScheduledStudyDate(date: Date) {
  return nextStudyDate(addDays(date, 1));
}
