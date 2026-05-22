import type { Problem, Progress } from "@prisma/client";

export type ProblemWithProgress = Problem & {
  progress: Progress[];
};

export type StudyProblem = {
  id: string;
  slug: string;
  title: string;
  week: number;
  weekOrder: number;
  difficulty: string;
  minutes: number;
  pattern: string;
  dataStructure: string;
  memoryPrompt: string;
  memoryCorrect: string;
  memoryOptions: string[];
  codeStarter: string;
  codeSolution: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  runtimeOptions: string[];
  spaceOptions: string[];
  progress: {
    memoryScore: number;
    codeScore: number;
    runtimeScore: number;
    memoryDueAt: string | null;
    codeDueAt: string | null;
    runtimeDueAt: string | null;
    memoryStreak: number;
    codeStreak: number;
    runtimeStreak: number;
    mistakeTags: string[];
    attempts: number;
    lastReviewedAt: string | null;
  };
};

function parseOptions(value: string, fallback: string[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : fallback;
  } catch {
    return fallback;
  }
}

function parseStringArray(value: string | null | undefined) {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function stableOptions(correct: string, distractors: string[], key: string) {
  const unique = [correct, ...distractors].filter(
    (option, index, all) => option && all.indexOf(option) === index
  );

  while (unique.length < 4) {
    unique.push(`Review the ${key} invariant before choosing.`);
  }

  return unique.slice(0, 4);
}

export function toStudyProblem(problem: ProblemWithProgress): StudyProblem {
  const progress = problem.progress[0];

  return {
    id: problem.id,
    slug: problem.slug,
    title: problem.title,
    week: problem.week,
    weekOrder: problem.weekOrder,
    difficulty: problem.difficulty,
    minutes: problem.minutes,
    pattern: problem.pattern,
    dataStructure: problem.dataStructure,
    memoryPrompt: problem.memoryPrompt,
    memoryCorrect: problem.memoryCorrect,
    memoryOptions: stableOptions(
      problem.memoryCorrect,
      parseOptions(problem.memoryDistractors, []),
      "memory"
    ),
    codeStarter: problem.codeStarter,
    codeSolution: problem.codeSolution,
    explanation: problem.explanation,
    timeComplexity: problem.timeComplexity,
    spaceComplexity: problem.spaceComplexity,
    runtimeOptions: stableOptions(
      problem.timeComplexity,
      parseOptions(problem.runtimeDistractors, []),
      "runtime"
    ),
    spaceOptions: stableOptions(
      problem.spaceComplexity,
      parseOptions(problem.spaceDistractors, []),
      "space"
    ),
    progress: {
      memoryScore: progress?.memoryScore ?? 0,
      codeScore: progress?.codeScore ?? 0,
      runtimeScore: progress?.runtimeScore ?? 0,
      memoryDueAt: progress?.memoryDueAt?.toISOString() ?? null,
      codeDueAt: progress?.codeDueAt?.toISOString() ?? null,
      runtimeDueAt: progress?.runtimeDueAt?.toISOString() ?? null,
      memoryStreak: progress?.memoryStreak ?? 0,
      codeStreak: progress?.codeStreak ?? 0,
      runtimeStreak: progress?.runtimeStreak ?? 0,
      mistakeTags: parseStringArray(progress?.mistakeTags),
      attempts: progress?.attempts ?? 0,
      lastReviewedAt: progress?.lastReviewedAt?.toISOString() ?? null
    }
  };
}

export function isMastered(problem: StudyProblem) {
  return (
    problem.progress.memoryScore === 100 &&
    problem.progress.codeScore === 100 &&
    problem.progress.runtimeScore === 100
  );
}
