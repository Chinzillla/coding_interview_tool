import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Code2,
  Database,
  Gauge,
  Layers3,
  MemoryStick,
  Tags,
  TimerReset
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isMastered, toStudyProblem, type StudyProblem } from "@/lib/study";

function pct(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function groupByPattern(problems: StudyProblem[]) {
  const grouped = new Map<string, StudyProblem[]>();
  for (const problem of problems) {
    grouped.set(problem.pattern, [...(grouped.get(problem.pattern) ?? []), problem]);
  }
  return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function isDueDate(value: string | null) {
  if (!value) return false;
  return new Date(value).getTime() <= Date.now();
}

function dueCount(problem: StudyProblem) {
  if (problem.progress.attempts === 0) return 0;
  return [
    problem.progress.memoryDueAt,
    problem.progress.codeDueAt,
    problem.progress.runtimeDueAt
  ].filter(isDueDate).length;
}

function tagCounts(problems: StudyProblem[]) {
  const counts = new Map<string, number>();
  for (const problem of problems) {
    for (const tag of problem.progress.mistakeTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort(([, first], [, second]) => second - first)
    .slice(0, 8);
}

function ProblemList({
  title,
  icon,
  problems,
  emptyText
}: {
  title: string;
  icon: React.ReactNode;
  problems: StudyProblem[];
  emptyText: string;
}) {
  const preview = problems.slice(0, 8);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="section-icon">{icon}</span>
          <h2>{title}</h2>
        </div>
        <span className="count-pill">{problems.length}</span>
      </div>
      {preview.length > 0 ? (
        <div className="compact-list">
          {preview.map((problem) => (
            <Link key={problem.id} href={`/learn?problem=${problem.slug}`}>
              <span>
                {problem.title}
                <small>{problem.pattern}</small>
              </span>
              <strong>{problem.difficulty}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-copy">{emptyText}</p>
      )}
    </section>
  );
}

function ProgressTrack({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: "memory" | "code" | "runtime";
}) {
  return (
    <div className={`progress-track ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track-bar">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const rows = await prisma.problem.findMany({
    orderBy: [{ week: "asc" }, { weekOrder: "asc" }],
    include: {
      progress: {
        where: { userId: user.id }
      }
    }
  });

  const problems = rows.map(toStudyProblem);
  const mastered = problems.filter(isMastered);
  const needsMemory = problems.filter((problem) => problem.progress.memoryScore < 100);
  const needsCode = problems.filter((problem) => problem.progress.codeScore < 100);
  const needsRuntime = problems.filter((problem) => problem.progress.runtimeScore < 100);
  const attempted = problems.filter((problem) => problem.progress.attempts > 0).length;
  const total = problems.length;
  const dueProblems = problems
    .filter((problem) => dueCount(problem) > 0)
    .sort((first, second) => dueCount(second) - dueCount(first));
  const mistakeRows = tagCounts(problems);

  const memoryDone = problems.filter((problem) => problem.progress.memoryScore === 100).length;
  const codeDone = problems.filter((problem) => problem.progress.codeScore === 100).length;
  const runtimeDone = problems.filter((problem) => problem.progress.runtimeScore === 100).length;

  const patternRows = groupByPattern(problems).map(([pattern, items]) => ({
    pattern,
    total: items.length,
    mastered: items.filter(isMastered).length,
    memory: items.filter((problem) => problem.progress.memoryScore === 100).length,
    code: items.filter((problem) => problem.progress.codeScore === 100).length,
    runtime: items.filter((problem) => problem.progress.runtimeScore === 100).length
  }));

  return (
    <AppShell active="dashboard">
      <main className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Your coding interview progress</h1>
            <p>
              Track each question across memory, Python code recall, and time/space complexity.
            </p>
          </div>
          <Link className="primary-button" href="/learn">
            <TimerReset size={18} />
            Start review
          </Link>
        </header>

        <section className="stat-grid">
          <div className="stat-card">
            <Gauge size={20} />
            <span>Overall mastered</span>
            <strong>{pct(mastered.length, total)}%</strong>
            <small>
              {mastered.length} of {total} questions at 100%
            </small>
          </div>
          <div className="stat-card">
            <CalendarClock size={20} />
            <span>Due today</span>
            <strong>{dueProblems.length}</strong>
            <small>{attempted} completed questions in the scheduler</small>
          </div>
          <div className="stat-card">
            <MemoryStick size={20} />
            <span>Memory</span>
            <strong>{pct(memoryDone, total)}%</strong>
            <small>{needsMemory.length} still need repetition</small>
          </div>
          <div className="stat-card">
            <Code2 size={20} />
            <span>Code</span>
            <strong>{pct(codeDone, total)}%</strong>
            <small>{needsCode.length} still need code recall</small>
          </div>
          <div className="stat-card">
            <Database size={20} />
            <span>Complexity</span>
            <strong>{pct(runtimeDone, total)}%</strong>
            <small>{needsRuntime.length} still need runtime review</small>
          </div>
        </section>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <span className="section-icon">
                <Layers3 size={18} />
              </span>
              <h2>Progress by pattern</h2>
            </div>
            <span className="count-pill">{attempted} attempted</span>
          </div>
          <div className="pattern-table">
            {patternRows.map((row) => (
              <div className="pattern-row" key={row.pattern}>
                <div>
                  <strong>{row.pattern}</strong>
                  <span>
                    {row.mastered}/{row.total} mastered
                  </span>
                </div>
                <div className="progress-track-group" aria-label={`${row.pattern} progress`}>
                  <ProgressTrack label="Memory" value={pct(row.memory, row.total)} tone="memory" />
                  <ProgressTrack label="Code" value={pct(row.code, row.total)} tone="code" />
                  <ProgressTrack
                    label="Runtime"
                    value={pct(row.runtime, row.total)}
                    tone="runtime"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-columns dashboard-columns-two">
          <ProblemList
            title="Due today"
            icon={<CalendarClock size={18} />}
            problems={dueProblems}
            emptyText="Nothing is due yet."
          />
          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="section-icon">
                  <Tags size={18} />
                </span>
                <h2>Mistake patterns</h2>
              </div>
              <span className="count-pill">{mistakeRows.length}</span>
            </div>
            {mistakeRows.length > 0 ? (
              <div className="tag-summary">
                {mistakeRows.map(([tag, count]) => (
                  <div key={tag}>
                    <span>{tag}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-copy">No mistake tags recorded yet.</p>
            )}
          </section>
        </section>

        <section className="dashboard-columns">
          <ProblemList
            title="100% correct"
            icon={<CheckCircle2 size={18} />}
            problems={mastered}
            emptyText="No fully mastered questions yet."
          />
          <ProblemList
            title="Needs memory"
            icon={<MemoryStick size={18} />}
            problems={needsMemory}
            emptyText="Memory recall is complete."
          />
          <ProblemList
            title="Needs code"
            icon={<Code2 size={18} />}
            problems={needsCode}
            emptyText="Code recall is complete."
          />
          <ProblemList
            title="Needs runtime"
            icon={<Database size={18} />}
            problems={needsRuntime}
            emptyText="Runtime and space recall are complete."
          />
        </section>
      </main>
    </AppShell>
  );
}
