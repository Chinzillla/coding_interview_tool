"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { indentWithTab, insertNewlineAndIndent } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap } from "@codemirror/view";
import {
  BookOpenCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Code2,
  Database,
  Eye,
  GraduationCap,
  HelpCircle,
  Layers3,
  MemoryStick,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  Tags
} from "lucide-react";
import type { StudyProblem } from "@/lib/study";

type Mode = "flashcards" | "quiz" | "exam";
type QuizAnswer = {
  memory?: string;
  time?: string;
  space?: string;
  code?: boolean;
};
type CodeRunCase = {
  name: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  error?: string;
};
type CodeRunResult = {
  supported: boolean;
  method?: string;
  message?: string;
  error?: string;
  stderr?: string;
  timedOut?: boolean;
  results?: CodeRunCase[];
};
type ProgressPayload = Partial<Omit<StudyProblem["progress"], "mistakeTags">> & {
  mistakeTags?: string | string[] | null;
};

const MISTAKE_TAGS = [
  "forgot pattern",
  "wrong invariant",
  "edge case",
  "syntax",
  "complexity",
  "off by one",
  "wrong data structure",
  "communication"
];

const pythonEditorExtensions = [
  python(),
  indentUnit.of("    "),
  EditorState.tabSize.of(4),
  keymap.of([
    {
      key: "Enter",
      run: insertNewlineAndIndent
    },
    indentWithTab
  ]),
  EditorView.lineWrapping
];

function hash(input: string) {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0;
  }
  return value;
}

function shuffled<T>(items: T[], seed: string) {
  const copy = [...items];
  let state = hash(seed) || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function scoreClass(score: number) {
  if (score === 100) return "score-good";
  if (score > 0) return "score-mid";
  return "score-empty";
}

function isCompleted(problem: StudyProblem) {
  return problem.progress.attempts > 0;
}

function masteryAverage(problem: StudyProblem) {
  return (
    problem.progress.memoryScore +
    problem.progress.codeScore +
    problem.progress.runtimeScore
  ) / 3;
}

function weaknessCount(problem: StudyProblem) {
  return [
    problem.progress.memoryScore,
    problem.progress.codeScore,
    problem.progress.runtimeScore
  ].filter((score) => score < 100).length;
}

function hasWeakness(problem: StudyProblem) {
  return isCompleted(problem) && weaknessCount(problem) > 0;
}

function isDueDate(value: string | null) {
  if (!value) return false;
  return new Date(value).getTime() <= Date.now();
}

function dueDomains(problem: StudyProblem) {
  if (!isCompleted(problem)) return [];
  return [
    isDueDate(problem.progress.memoryDueAt) ? "memory" : null,
    isDueDate(problem.progress.codeDueAt) ? "code" : null,
    isDueDate(problem.progress.runtimeDueAt) ? "complexity" : null
  ].filter((item): item is string => Boolean(item));
}

function isDue(problem: StudyProblem) {
  return dueDomains(problem).length > 0;
}

function compareByWeakness(first: StudyProblem, second: StudyProblem) {
  const dueDifference = Number(isDue(second)) - Number(isDue(first));
  if (dueDifference !== 0) return dueDifference;

  const dueDomainDifference = dueDomains(second).length - dueDomains(first).length;
  if (dueDomainDifference !== 0) return dueDomainDifference;

  const scoreDifference = masteryAverage(first) - masteryAverage(second);
  if (scoreDifference !== 0) return scoreDifference;

  const weaknessDifference = weaknessCount(second) - weaknessCount(first);
  if (weaknessDifference !== 0) return weaknessDifference;

  return second.progress.attempts - first.progress.attempts;
}

function uniqueProblems(problems: StudyProblem[]) {
  const seen = new Set<string>();
  return problems.filter((problem) => {
    if (seen.has(problem.id)) return false;
    seen.add(problem.id);
    return true;
  });
}

function quizLimit(size: number) {
  if (!Number.isFinite(size)) return 3;
  return Math.min(3, Math.max(1, Math.floor(size)));
}

function parseProgressTags(value: ProgressPayload["mistakeTags"], fallback: string[]) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : fallback;
  } catch {
    return fallback;
  }
}

function buildReinforcementSet(problems: StudyProblem[], desiredSize: number) {
  const completed = problems.filter(isCompleted);
  if (completed.length === 0) {
    return { items: [] as StudyProblem[], target: null as StudyProblem | null };
  }

  const dueCompleted = completed.filter(isDue).sort(compareByWeakness);
  const weakCompleted = completed.filter(hasWeakness).sort(compareByWeakness);
  const target =
    dueCompleted.find(hasWeakness) ??
    dueCompleted[0] ??
    weakCompleted[0] ??
    [...completed].sort(compareByWeakness)[0];
  const samePattern = completed
    .filter((problem) => problem.id !== target.id && problem.pattern === target.pattern)
    .sort(compareByWeakness);
  const sameDataStructure = completed
    .filter(
      (problem) =>
        problem.id !== target.id &&
        problem.pattern !== target.pattern &&
        problem.dataStructure === target.dataStructure
    )
    .sort(compareByWeakness);
  const otherWeak = weakCompleted
    .filter((problem) => problem.id !== target.id)
    .sort(compareByWeakness);
  const otherCompleted = completed
    .filter((problem) => problem.id !== target.id)
    .sort(compareByWeakness);

  return {
    target,
    items: uniqueProblems([
      target,
      ...dueCompleted,
      ...samePattern,
      ...sameDataStructure,
      ...otherWeak,
      ...otherCompleted
    ]).slice(0, Math.min(desiredSize, completed.length))
  };
}

function buildWeaknessExamSet(problems: StudyProblem[]) {
  const completed = problems.filter(isCompleted);
  if (completed.length === 0) return [];

  const dueCompleted = completed.filter(isDue).sort(compareByWeakness);
  const weakCompleted = completed.filter(hasWeakness).sort(compareByWeakness);
  const target = dueCompleted.find(hasWeakness) ?? dueCompleted[0] ?? weakCompleted[0];
  const similarToWeakest = target
    ? completed
        .filter(
          (problem) =>
            problem.id !== target.id &&
            (problem.pattern === target.pattern ||
              problem.dataStructure === target.dataStructure)
        )
        .sort(compareByWeakness)
    : [];

  return uniqueProblems([
    ...dueCompleted,
    ...weakCompleted,
    ...similarToWeakest,
    ...completed.sort(compareByWeakness)
  ]);
}

function ExplanationVisual({ problem }: { problem: StudyProblem }) {
  if (problem.title === "Trapping Rain Water") {
    const bars = [0, 2, 1, 4, 0, 1, 3, 2, 1, 2, 1];
    return (
      <div className="rain-visual" aria-label="Two pointer rain water visual">
        {bars.map((height, index) => (
          <span key={`${height}-${index}`} style={{ height: `${24 + height * 18}px` }}>
            {index === 1 ? <small>L</small> : null}
            {index === 6 ? <small>R</small> : null}
          </span>
        ))}
      </div>
    );
  }

  if (problem.pattern.includes("Tree")) {
    return (
      <div className="tree-visual" aria-label="Tree traversal visual">
        <span />
        <div>
          <span />
          <span />
        </div>
        <div>
          <small>left</small>
          <small>right</small>
        </div>
      </div>
    );
  }

  if (problem.pattern.includes("Graph")) {
    return (
      <div className="graph-visual" aria-label="Graph traversal visual">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (problem.pattern.includes("Dynamic")) {
    return (
      <div className="dp-visual" aria-label="Dynamic programming table visual">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className={index < 7 ? "filled" : ""} />
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-visual" aria-label="Array invariant visual">
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className={index === 2 || index === 6 ? "active" : ""}>
          {index === 2 ? "L" : index === 6 ? "R" : ""}
        </span>
      ))}
    </div>
  );
}

function MetricPill({ label, score }: { label: string; score: number }) {
  return (
    <span className={`metric-pill ${scoreClass(score)}`}>
      {label}
      <strong>{score}%</strong>
    </span>
  );
}

export function StudyClient({ problems }: { problems: StudyProblem[] }) {
  const searchParams = useSearchParams();
  const [studyProblems, setStudyProblems] = useState(problems);
  const [mode, setMode] = useState<Mode>("flashcards");
  const [query, setQuery] = useState("");
  const [pattern, setPattern] = useState("All");
  const [week, setWeek] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedId, setSelectedId] = useState(problems[0]?.id ?? "");
  const [memoryChoice, setMemoryChoice] = useState("");
  const [timeChoice, setTimeChoice] = useState("");
  const [spaceChoice, setSpaceChoice] = useState("");
  const [codeCorrect, setCodeCorrect] = useState<boolean | null>(null);
  const [selectedMistakeTags, setSelectedMistakeTags] = useState<string[]>([]);
  const [codeDraft, setCodeDraft] = useState(problems[0]?.codeStarter ?? "");
  const [runningCode, setRunningCode] = useState(false);
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quizSize, setQuizSize] = useState(3);
  const [quizItems, setQuizItems] = useState<StudyProblem[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, QuizAnswer>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  useEffect(() => {
    const slug = searchParams.get("problem");
    if (!slug) return;
    const match = studyProblems.find((problem) => problem.slug === slug);
    if (match) setSelectedId(match.id);
  }, [searchParams, studyProblems]);

  const patterns = useMemo(
    () => ["All", ...Array.from(new Set(studyProblems.map((problem) => problem.pattern))).sort()],
    [studyProblems]
  );

  const filtered = useMemo(() => {
    return studyProblems.filter((problem) => {
      const matchesQuery =
        problem.title.toLowerCase().includes(query.toLowerCase()) ||
        problem.pattern.toLowerCase().includes(query.toLowerCase());
      return (
        matchesQuery &&
        (pattern === "All" || problem.pattern === pattern) &&
        (week === "All" || String(problem.week) === week) &&
        (difficulty === "All" || problem.difficulty === difficulty)
      );
    });
  }, [studyProblems, query, pattern, week, difficulty]);

  const completedForReview = useMemo(() => filtered.filter(isCompleted), [filtered]);
  const weakForReview = useMemo(() => completedForReview.filter(hasWeakness), [completedForReview]);
  const dueForReview = useMemo(() => completedForReview.filter(isDue), [completedForReview]);
  const recommendedQuiz = useMemo(
    () => buildReinforcementSet(filtered, quizLimit(quizSize)),
    [filtered, quizSize]
  );

  const activeProblem =
    studyProblems.find((problem) => problem.id === selectedId) ?? filtered[0] ?? studyProblems[0];

  useEffect(() => {
    if (!activeProblem) return;
    setCodeDraft(activeProblem.codeStarter);
    setRunResult(null);
  }, [activeProblem?.id, activeProblem?.codeStarter]);

  const memoryOptions = useMemo(
    () => shuffled(activeProblem?.memoryOptions ?? [], `${activeProblem?.slug}-memory`),
    [activeProblem]
  );

  const runtimeOptions = useMemo(
    () => shuffled(activeProblem?.runtimeOptions ?? [], `${activeProblem?.slug}-time`),
    [activeProblem]
  );

  const spaceOptions = useMemo(
    () => shuffled(activeProblem?.spaceOptions ?? [], `${activeProblem?.slug}-space`),
    [activeProblem]
  );

  function resetCard(problemId = activeProblem?.id) {
    setSelectedId(problemId ?? "");
    setMemoryChoice("");
    setTimeChoice("");
    setSpaceChoice("");
    setCodeCorrect(null);
    setSelectedMistakeTags([]);
    setRunResult(null);
    setShowSolution(false);
    setShowExplanation(false);
  }

  function toggleMistakeTag(tag: string) {
    setSelectedMistakeTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  }

  function updateLocalProgress(
    problemId: string,
    result: {
      memoryCorrect?: boolean;
      codeCorrect?: boolean;
      runtimeCorrect?: boolean;
    },
    savedProgress?: ProgressPayload
  ) {
    setStudyProblems((current) =>
      current.map((problem) => {
        if (problem.id !== problemId) return problem;
        if (savedProgress) {
          return {
            ...problem,
            progress: {
              ...problem.progress,
              memoryScore: savedProgress.memoryScore ?? problem.progress.memoryScore,
              codeScore: savedProgress.codeScore ?? problem.progress.codeScore,
              runtimeScore: savedProgress.runtimeScore ?? problem.progress.runtimeScore,
              memoryDueAt: savedProgress.memoryDueAt ?? problem.progress.memoryDueAt,
              codeDueAt: savedProgress.codeDueAt ?? problem.progress.codeDueAt,
              runtimeDueAt: savedProgress.runtimeDueAt ?? problem.progress.runtimeDueAt,
              memoryStreak: savedProgress.memoryStreak ?? problem.progress.memoryStreak,
              codeStreak: savedProgress.codeStreak ?? problem.progress.codeStreak,
              runtimeStreak: savedProgress.runtimeStreak ?? problem.progress.runtimeStreak,
              mistakeTags: parseProgressTags(
                savedProgress.mistakeTags,
                problem.progress.mistakeTags
              ),
              attempts: savedProgress.attempts ?? problem.progress.attempts,
              lastReviewedAt: savedProgress.lastReviewedAt ?? problem.progress.lastReviewedAt
            }
          };
        }

        return {
          ...problem,
          progress: {
            ...problem.progress,
            attempts: problem.progress.attempts + 1,
            lastReviewedAt: new Date().toISOString(),
            memoryScore:
              typeof result.memoryCorrect === "boolean"
                ? result.memoryCorrect
                  ? 100
                  : 0
                : problem.progress.memoryScore,
            codeScore:
              typeof result.codeCorrect === "boolean"
                ? result.codeCorrect
                  ? 100
                  : 0
                : problem.progress.codeScore,
            runtimeScore:
              typeof result.runtimeCorrect === "boolean"
                ? result.runtimeCorrect
                  ? 100
                  : 0
                : problem.progress.runtimeScore
          }
        };
      })
    );
  }

  async function saveProgress(
    problem: StudyProblem,
    result: {
      mode: string;
      memoryCorrect?: boolean;
      codeCorrect?: boolean;
      runtimeCorrect?: boolean;
      answers: QuizAnswer;
      mistakeTags?: string[];
    }
  ) {
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemId: problem.id,
        ...result
      })
    });

    if (!response.ok) {
      throw new Error("Could not save progress.");
    }

    const payload = (await response.json()) as { progress?: ProgressPayload };
    updateLocalProgress(problem.id, result, payload.progress);
  }

  async function gradeFlashcard() {
    if (!activeProblem) return;

    const result = {
      mode: "flashcard",
      memoryCorrect: memoryChoice === activeProblem.memoryCorrect,
      codeCorrect: codeCorrect ?? false,
      runtimeCorrect:
        timeChoice === activeProblem.timeComplexity &&
        spaceChoice === activeProblem.spaceComplexity,
      answers: {
        memory: memoryChoice,
        time: timeChoice,
        space: spaceChoice,
        code: codeCorrect ?? false
      },
      mistakeTags: selectedMistakeTags
    };

    setSaving(true);
    try {
      await saveProgress(activeProblem, result);
    } finally {
      setSaving(false);
    }
  }

  async function runCodeTests() {
    if (!activeProblem) return;

    setRunningCode(true);
    setRunResult(null);
    try {
      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: activeProblem.id,
          code: codeDraft
        })
      });
      const payload = (await response.json()) as CodeRunResult;
      setRunResult(payload);
    } catch (error) {
      setRunResult({
        supported: true,
        error: error instanceof Error ? error.message : "Could not run tests.",
        results: []
      });
    } finally {
      setRunningCode(false);
    }
  }

  function startQuiz(nextMode: Mode) {
    const items =
      nextMode === "exam"
        ? buildWeaknessExamSet(filtered).slice(0, Math.min(20, completedForReview.length))
        : buildReinforcementSet(filtered, quizLimit(quizSize)).items;
    setQuizItems(items);
    setQuizAnswers({});
    setQuizResult(null);
  }

  async function submitQuiz(nextMode: Mode) {
    let earned = 0;
    let total = 0;
    setSaving(true);
    try {
      for (const problem of quizItems) {
        const answer = quizAnswers[problem.id] ?? {};
        const memoryCorrect = answer.memory === problem.memoryCorrect;
        const runtimeCorrect =
          answer.time === problem.timeComplexity && answer.space === problem.spaceComplexity;
        const result = {
          mode: nextMode,
          memoryCorrect,
          codeCorrect: answer.code ?? false,
          runtimeCorrect,
          answers: answer,
          mistakeTags: []
        };

        earned += Number(memoryCorrect) + Number(result.codeCorrect) + Number(runtimeCorrect);
        total += 3;
        await saveProgress(problem, result);
      }
      setQuizResult(`${earned}/${total}`);
    } finally {
      setSaving(false);
    }
  }

  if (!activeProblem) {
    return (
      <main className="page">
        <p>No problems were seeded yet. Run the database seed script.</p>
      </main>
    );
  }

  const activeDueDomains = dueDomains(activeProblem);

  return (
    <main className="page learn-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Learning place</p>
          <h1>Flashcards, quizzes, and exams</h1>
          <p>Review memory, code recall, and complexity separately or together.</p>
        </div>
        <div className="segmented-control" role="tablist" aria-label="Study mode">
          {(["flashcards", "quiz", "exam"] as Mode[]).map((item) => (
            <button
              key={item}
              className={mode === item ? "active" : ""}
              onClick={() => {
                setMode(item);
                if (item !== "flashcards") startQuiz(item);
              }}
              type="button"
            >
              {item === "flashcards" ? <BookOpenCheck size={16} /> : null}
              {item === "quiz" ? <Shuffle size={16} /> : null}
              {item === "exam" ? <GraduationCap size={16} /> : null}
              {item}
            </button>
          ))}
        </div>
      </header>

      <section className="filter-bar">
        <label className="search-field">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search question or pattern"
          />
        </label>
        <select value={pattern} onChange={(event) => setPattern(event.target.value)}>
          {patterns.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={week} onChange={(event) => setWeek(event.target.value)}>
          <option>All</option>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          <option value="4">Week 4</option>
        </select>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </section>

      {mode === "flashcards" ? (
        <section className="study-layout">
          <aside className="problem-rail">
            <div className="rail-heading">
              <strong>{filtered.length} questions</strong>
              <button
                className="icon-button"
                type="button"
                title="Reset current card"
                aria-label="Reset current card"
                onClick={() => resetCard()}
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <div className="problem-list">
              {filtered.map((problem) => (
                <button
                  key={problem.id}
                  className={problem.id === activeProblem.id ? "active" : ""}
                  onClick={() => resetCard(problem.id)}
                  type="button"
                >
                  <span>
                    {problem.week}.{problem.weekOrder} {problem.title}
                  </span>
                  <small>
                    {problem.pattern}
                    {isDue(problem) ? " / due" : ""}
                  </small>
                </button>
              ))}
            </div>
          </aside>

          <article className="study-card">
            <div className="card-topline">
              <div>
                <p className="eyebrow">
                  Week {activeProblem.week} / {activeProblem.difficulty} / {activeProblem.minutes} mins
                </p>
                <h2>{activeProblem.title}</h2>
              </div>
              <div className="metric-strip">
                <MetricPill label="Memory" score={activeProblem.progress.memoryScore} />
                <MetricPill label="Code" score={activeProblem.progress.codeScore} />
                <MetricPill label="Runtime" score={activeProblem.progress.runtimeScore} />
                {activeDueDomains.length > 0 ? (
                  <span className="due-pill">
                    <CalendarClock size={14} />
                    Due: {activeDueDomains.join(", ")}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="info-strip">
              <span>
                <Layers3 size={16} />
                {activeProblem.pattern}
              </span>
              <span>
                <Database size={16} />
                {activeProblem.dataStructure}
              </span>
            </div>

            <section className="quiz-block">
              <h3>
                <MemoryStick size={18} />
                Memory
              </h3>
              <p>{activeProblem.memoryPrompt}</p>
              <div className="choice-grid">
                {memoryOptions.map((option) => (
                  <button
                    key={option}
                    className={memoryChoice === option ? "selected" : ""}
                    onClick={() => setMemoryChoice(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section className="quiz-block code-block">
              <h3>
                <Code2 size={18} />
                Code
              </h3>
              <div className="python-editor-shell">
                <CodeMirror
                  value={codeDraft}
                  height="280px"
                  theme={oneDark}
                  extensions={pythonEditorExtensions}
                  onChange={(value) => setCodeDraft(value)}
                  className="python-code-editor"
                  aria-label="Python code editor"
                />
              </div>
              <div className="button-row">
                <button
                  className="secondary-button"
                  type="button"
                  disabled={runningCode}
                  onClick={runCodeTests}
                >
                  <Play size={17} />
                  {runningCode ? "Running..." : "Run tests"}
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setShowSolution((current) => !current)}
                >
                  <Eye size={17} />
                  {showSolution ? "Hide solution" : "Reveal solution"}
                </button>
                <button
                  className={codeCorrect === true ? "secondary-button active" : "secondary-button"}
                  type="button"
                  onClick={() => setCodeCorrect(true)}
                >
                  <Check size={17} />
                  I wrote it correctly
                </button>
                <button
                  className={codeCorrect === false ? "secondary-button active danger" : "secondary-button"}
                  type="button"
                  onClick={() => setCodeCorrect(false)}
                >
                  Needs work
                </button>
              </div>
              {runResult ? (
                <div className="runner-panel">
                  <div className="runner-heading">
                    <strong>Python 3 test cases</strong>
                    {runResult.method ? <span>Method: {runResult.method} or solve</span> : null}
                  </div>
                  {!runResult.supported ? (
                    <p>{runResult.message}</p>
                  ) : runResult.timedOut ? (
                    <p>Execution timed out after 4 seconds.</p>
                  ) : runResult.error || runResult.stderr ? (
                    <pre>{runResult.error ?? runResult.stderr}</pre>
                  ) : (
                    <div className="test-result-list">
                      {(runResult.results ?? []).map((test) => (
                        <div className={test.passed ? "test-pass" : "test-fail"} key={test.name}>
                          <strong>{test.passed ? "Passed" : "Failed"}</strong>
                          <span>{test.name}</span>
                          {!test.passed ? (
                            <small>
                              expected {JSON.stringify(test.expected)} / got{" "}
                              {JSON.stringify(test.actual)}
                            </small>
                          ) : null}
                          {test.error ? <pre>{test.error}</pre> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
              {showSolution ? <pre className="solution-box">{activeProblem.codeSolution}</pre> : null}
            </section>

            <section className="quiz-block runtime-grid">
              <div>
                <h3>
                  <Database size={18} />
                  Runtime
                </h3>
                <div className="choice-grid small">
                  {runtimeOptions.map((option) => (
                    <button
                      key={option}
                      className={timeChoice === option ? "selected" : ""}
                      onClick={() => setTimeChoice(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3>Space</h3>
                <div className="choice-grid small">
                  {spaceOptions.map((option) => (
                    <button
                      key={option}
                      className={spaceChoice === option ? "selected" : ""}
                      onClick={() => setSpaceChoice(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="mistake-panel">
              <div className="mistake-heading">
                <h3>
                  <Tags size={18} />
                  Mistake tags
                </h3>
                {activeProblem.progress.mistakeTags.length > 0 ? (
                  <span>{activeProblem.progress.mistakeTags.join(", ")}</span>
                ) : null}
              </div>
              <div className="tag-grid">
                {MISTAKE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    className={selectedMistakeTags.includes(tag) ? "selected" : ""}
                    type="button"
                    onClick={() => toggleMistakeTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <div className="button-row card-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowExplanation((current) => !current)}
              >
                <HelpCircle size={17} />I don&apos;t get it at all
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={saving}
                onClick={gradeFlashcard}
              >
                <Check size={18} />
                {saving ? "Saving..." : "Grade card"}
              </button>
            </div>

            {showExplanation ? (
              <section className="explanation-panel">
                <ExplanationVisual problem={activeProblem} />
                <div>
                  <h3>How it works</h3>
                  {activeProblem.explanation.split("\n").map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </section>
      ) : (
        <section className="exam-panel">
          <div className="exam-toolbar">
            <div>
              <p className="eyebrow">{mode === "exam" ? "Full exam" : "Focused quiz"}</p>
              <h2>{mode === "exam" ? "Memory + code + complexity" : "Build a repetition set"}</h2>
              <p>
                {completedForReview.length} completed / {weakForReview.length} weak spots /{" "}
                {dueForReview.length} due now match the current filters.
              </p>
            </div>
            <div className="quiz-controls">
              {mode === "quiz" ? (
                <label>
                  Size
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={quizSize}
                    onChange={(event) => setQuizSize(quizLimit(Number(event.target.value)))}
                  />
                </label>
              ) : null}
              <button
                className="secondary-button"
                type="button"
                disabled={completedForReview.length === 0}
                onClick={() => startQuiz(mode)}
              >
                <Play size={17} />
                New set
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={saving || quizItems.length === 0}
                onClick={() => submitQuiz(mode)}
              >
                <Check size={18} />
                {saving ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>

          {mode === "quiz" && recommendedQuiz.target ? (
            <div className="recommendation-strip">
              <strong>Recommended weak spot: {recommendedQuiz.target.title}</strong>
              <span>{recommendedQuiz.target.pattern}</span>
              <span>{recommendedQuiz.target.dataStructure}</span>
              {dueDomains(recommendedQuiz.target).length > 0 ? (
                <span>Due: {dueDomains(recommendedQuiz.target).join(", ")}</span>
              ) : null}
              <span>{recommendedQuiz.items.length} question set</span>
            </div>
          ) : null}

          {completedForReview.length === 0 ? (
            <div className="result-banner muted-banner">
              Complete at least one flashcard before generating weakness-based quizzes.
            </div>
          ) : null}

          {quizResult ? <div className="result-banner">Score saved: {quizResult}</div> : null}

          <div className="quiz-stack">
            {quizItems.map((problem, index) => {
              const answer = quizAnswers[problem.id] ?? {};
              return (
                <article className="mini-card" key={problem.id}>
                  <header>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{problem.title}</h3>
                      <p>
                        {problem.pattern} / {problem.difficulty}
                      </p>
                    </div>
                  </header>
                  <p>{problem.memoryPrompt}</p>
                  <div className="choice-grid">
                    {shuffled(problem.memoryOptions, `${problem.slug}-quiz-memory`).map((option) => (
                      <button
                        key={option}
                        className={answer.memory === option ? "selected" : ""}
                        onClick={() =>
                          setQuizAnswers((current) => ({
                            ...current,
                            [problem.id]: { ...answer, memory: option }
                          }))
                        }
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="runtime-grid">
                    <div className="choice-grid small">
                      {shuffled(problem.runtimeOptions, `${problem.slug}-quiz-time`).map((option) => (
                        <button
                          key={option}
                          className={answer.time === option ? "selected" : ""}
                          onClick={() =>
                            setQuizAnswers((current) => ({
                              ...current,
                              [problem.id]: { ...answer, time: option }
                            }))
                          }
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <div className="choice-grid small">
                      {shuffled(problem.spaceOptions, `${problem.slug}-quiz-space`).map((option) => (
                        <button
                          key={option}
                          className={answer.space === option ? "selected" : ""}
                          onClick={() =>
                            setQuizAnswers((current) => ({
                              ...current,
                              [problem.id]: { ...answer, space: option }
                            }))
                          }
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="code-check">
                    <input
                      type="checkbox"
                      checked={answer.code ?? false}
                      onChange={(event) =>
                        setQuizAnswers((current) => ({
                          ...current,
                          [problem.id]: { ...answer, code: event.target.checked }
                        }))
                      }
                    />
                    I wrote the Python solution correctly from memory
                    <ChevronRight size={16} />
                  </label>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
