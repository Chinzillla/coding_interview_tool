import { isMastered, type StudyProblem } from "@/lib/study";

export const STUDY_WEEKS = 26;
export const STUDY_DAYS_PER_WEEK = 6;
export const DAILY_MINUTES = 120;
export const LEARNING_WEEKS = 22;
export const REVIEW_OFFSETS = [1, 3, 7, 14, 30, 60, 90, 120, 150];

export type ScheduledReview = {
  problem: StudyProblem;
  sourceDateISO: string;
};

export type ActualDueReview = {
  problem: StudyProblem;
  domains: string[];
};

export type ScheduleDay = {
  dateISO: string;
  weekNumber: number;
  dayNumber: number;
  newProblems: StudyProblem[];
  plannedReviews: ScheduledReview[];
  actualDueReviews: ActualDueReview[];
};

export type ScheduleWeek = {
  weekNumber: number;
  startISO: string;
  endISO: string;
  phase: string;
  newProblemCount: number;
  newMinutes: number;
  plannedReviewCount: number;
  actualDueCount: number;
  patterns: string[];
  difficulties: {
    easy: number;
    medium: number;
    hard: number;
  };
};

export type StudySchedule = {
  startISO: string;
  endISO: string;
  totalDays: number;
  totalHours: number;
  learningQueueCount: number;
  days: ScheduleDay[];
  weeks: ScheduleWeek[];
};

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isStudyDay(date: Date) {
  return date.getDay() !== 0;
}

export function nextStudyDate(date: Date) {
  let next = startOfDay(date);
  while (!isStudyDay(next)) {
    next = addDays(next, 1);
  }
  return next;
}

export function buildStudyDates(startDate: Date) {
  const dates: Date[] = [];
  let cursor = nextStudyDate(startDate);
  const totalStudyDays = STUDY_WEEKS * STUDY_DAYS_PER_WEEK;

  while (dates.length < totalStudyDays) {
    if (isStudyDay(cursor)) {
      dates.push(cursor);
    }
    cursor = addDays(cursor, 1);
  }

  return dates;
}

export function mapToStudyDateKey(date: Date, studyDateKeys: Set<string>, endDate: Date) {
  let cursor = startOfDay(date);
  while (cursor <= endDate) {
    const key = toDateKey(cursor);
    if (studyDateKeys.has(key)) return key;
    cursor = addDays(cursor, 1);
  }
  return null;
}

function dueEntries(problem: StudyProblem) {
  if (problem.progress.attempts === 0) return [];
  const entries = [
    ["memory", problem.progress.memoryDueAt],
    ["code", problem.progress.codeDueAt],
    ["complexity", problem.progress.runtimeDueAt]
  ] as const;

  return entries.flatMap(([domain, dueAt]) => (dueAt ? [[domain, dueAt]] : []));
}

function addActualDue(
  dueByDate: Map<string, ActualDueReview[]>,
  dateISO: string,
  problem: StudyProblem,
  domain: string
) {
  const existing = dueByDate.get(dateISO) ?? [];
  const existingReview = existing.find((review) => review.problem.id === problem.id);
  if (existingReview) {
    if (!existingReview.domains.includes(domain)) {
      existingReview.domains.push(domain);
    }
    return;
  }

  dueByDate.set(dateISO, [...existing, { problem, domains: [domain] }]);
}

function overdueDomains(problem: StudyProblem, startDate: Date) {
  const domains: string[] = [];
  const entries = [
    ["memory", problem.progress.memoryDueAt],
    ["code", problem.progress.codeDueAt],
    ["complexity", problem.progress.runtimeDueAt]
  ] as const;

  for (const [domain, dueAt] of entries) {
    if (!dueAt) continue;
    if (startOfDay(new Date(dueAt)) <= startDate) {
      domains.push(domain);
    }
  }

  return domains;
}

function plannedLearningQueue(problems: StudyProblem[]) {
  const active = problems.filter((problem) => !isMastered(problem));
  const queue = active.length > 0 ? active : problems;
  return [...queue].sort((first, second) => {
    if (first.week !== second.week) return first.week - second.week;
    return first.weekOrder - second.weekOrder;
  });
}

function topPatterns(problems: StudyProblem[]) {
  const counts = new Map<string, number>();
  for (const problem of problems) {
    counts.set(problem.pattern, (counts.get(problem.pattern) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([, first], [, second]) => second - first)
    .slice(0, 3)
    .map(([pattern]) => pattern);
}

function phaseForWeek(weekNumber: number) {
  if (weekNumber <= 4) return "Foundation and recall setup";
  if (weekNumber <= 10) return "Core pattern coverage";
  if (weekNumber <= 16) return "Medium-depth repetition";
  if (weekNumber <= 22) return "Hard problems and weak spots";
  return "Mock interviews and final repair";
}

export function formatScheduleDate(dateISO: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(fromDateKey(dateISO));
}

export function formatScheduleRange(startISO: string, endISO: string) {
  return `${formatScheduleDate(startISO)} - ${formatScheduleDate(endISO)}`;
}

export function buildStudySchedule(problems: StudyProblem[], now = new Date()): StudySchedule {
  const startDate = nextStudyDate(now);
  const studyDates = buildStudyDates(startDate);
  const studyDateKeys = new Set(studyDates.map(toDateKey));
  const endDate = studyDates[studyDates.length - 1];
  const learningQueue = plannedLearningQueue(problems);
  const learningDays = studyDates.slice(0, LEARNING_WEEKS * STUDY_DAYS_PER_WEEK);
  const newProblemsByDate = new Map<string, StudyProblem[]>();
  let assignedCount = 0;

  learningDays.forEach((date, index) => {
    const targetAssigned = Math.round(((index + 1) / learningDays.length) * learningQueue.length);
    const dateProblems = learningQueue.slice(assignedCount, targetAssigned);
    newProblemsByDate.set(toDateKey(date), dateProblems);
    assignedCount = targetAssigned;
  });

  const plannedReviewsByDate = new Map<string, ScheduledReview[]>();
  for (const [sourceDateISO, dateProblems] of newProblemsByDate.entries()) {
    const sourceDate = fromDateKey(sourceDateISO);
    for (const problem of dateProblems) {
      for (const offset of REVIEW_OFFSETS) {
        const reviewDateISO = mapToStudyDateKey(
          addDays(sourceDate, offset),
          studyDateKeys,
          endDate
        );
        if (!reviewDateISO) continue;
        plannedReviewsByDate.set(reviewDateISO, [
          ...(plannedReviewsByDate.get(reviewDateISO) ?? []),
          { problem, sourceDateISO }
        ]);
      }
    }
  }

  const actualDueByDate = new Map<string, ActualDueReview[]>();
  const startISO = toDateKey(startDate);
  for (const problem of problems) {
    const overdue = new Set(overdueDomains(problem, startDate));
    for (const domain of overdue) {
      addActualDue(actualDueByDate, startISO, problem, domain);
    }

    for (const [domain, dueAt] of dueEntries(problem)) {
      if (overdue.has(domain)) continue;
      const mappedDateISO = mapToStudyDateKey(new Date(dueAt), studyDateKeys, endDate);
      if (!mappedDateISO) continue;
      addActualDue(actualDueByDate, mappedDateISO, problem, domain);
    }
  }

  const days = studyDates.map((date, index) => {
    const dateISO = toDateKey(date);
    return {
      dateISO,
      weekNumber: Math.floor(index / STUDY_DAYS_PER_WEEK) + 1,
      dayNumber: (index % STUDY_DAYS_PER_WEEK) + 1,
      newProblems: newProblemsByDate.get(dateISO) ?? [],
      plannedReviews: plannedReviewsByDate.get(dateISO) ?? [],
      actualDueReviews: actualDueByDate.get(dateISO) ?? []
    };
  });

  const weeks = Array.from({ length: STUDY_WEEKS }, (_, index) => {
    const weekDays = days.slice(index * STUDY_DAYS_PER_WEEK, (index + 1) * STUDY_DAYS_PER_WEEK);
    const newProblems = weekDays.flatMap((day) => day.newProblems);
    const newMinutes = newProblems.reduce((sum, problem) => sum + problem.minutes, 0);
    const plannedReviewCount = weekDays.reduce(
      (sum, day) => sum + day.plannedReviews.length,
      0
    );
    const actualDueCount = weekDays.reduce(
      (sum, day) => sum + day.actualDueReviews.length,
      0
    );

    return {
      weekNumber: index + 1,
      startISO: weekDays[0].dateISO,
      endISO: weekDays[weekDays.length - 1].dateISO,
      phase: phaseForWeek(index + 1),
      newProblemCount: newProblems.length,
      newMinutes,
      plannedReviewCount,
      actualDueCount,
      patterns: topPatterns(newProblems),
      difficulties: {
        easy: newProblems.filter((problem) => problem.difficulty === "Easy").length,
        medium: newProblems.filter((problem) => problem.difficulty === "Medium").length,
        hard: newProblems.filter((problem) => problem.difficulty === "Hard").length
      }
    };
  });

  return {
    startISO,
    endISO: toDateKey(endDate),
    totalDays: days.length,
    totalHours: Math.round((days.length * DAILY_MINUTES) / 60),
    learningQueueCount: learningQueue.length,
    days,
    weeks
  };
}
