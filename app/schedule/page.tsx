import Link from "next/link";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  RefreshCw,
  Repeat2,
  SkipForward,
  TimerReset
} from "lucide-react";
import type { StudyTask } from "@prisma/client";
import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  addDays,
  buildStudySchedule,
  formatScheduleDate,
  formatScheduleRange,
  toDateKey
} from "@/lib/schedule";
import {
  completeTaskAction,
  resyncScheduleAction,
  skipTaskAction
} from "@/app/schedule/actions";
import { syncStudyTasks } from "@/lib/studyTasks";
import { toStudyProblem, type StudyProblem } from "@/lib/study";

function ProblemChip({ problem }: { problem: StudyProblem }) {
  return (
    <Link className="problem-chip" href={`/learn?problem=${problem.slug}`}>
      {problem.title}
    </Link>
  );
}

function taskLabel(task: StudyTask) {
  if (task.type === "new_problem") return "New";
  if (task.type === "due_review") return `Due${task.domain ? `: ${task.domain}` : ""}`;
  return "Mock";
}

function taskTitle(task: StudyTask, problem?: StudyProblem) {
  if (problem) return problem.title;
  if (task.type === "mock_exam") return "Mock interview block";
  return "Schedule task";
}

function taskMeta(task: StudyTask, problem?: StudyProblem) {
  const pieces = [`${task.minutes} min`, taskLabel(task)];
  if (problem) pieces.push(problem.pattern);
  if (task.carryoverCount > 0) pieces.push(`carried ${task.carryoverCount}x`);
  return pieces.join(" / ");
}

function TaskItem({
  task,
  problem
}: {
  task: StudyTask;
  problem?: StudyProblem;
}) {
  const content = (
    <>
      <strong>{taskTitle(task, problem)}</strong>
      <span>{taskMeta(task, problem)}</span>
    </>
  );

  return (
    <div className={`task-item ${task.type} ${task.carryoverCount > 0 ? "carryover" : ""}`}>
      {problem ? (
        <Link className="task-main" href={`/learn?problem=${problem.slug}`}>
          {content}
        </Link>
      ) : (
        <div className="task-main">{content}</div>
      )}
      <div className="task-actions">
        <form action={completeTaskAction}>
          <input name="taskId" type="hidden" value={task.id} />
          <button className="mini-action-button" type="submit">
            <CheckCircle2 size={15} />
            Done
          </button>
        </form>
        <form action={skipTaskAction}>
          <input name="taskId" type="hidden" value={task.id} />
          <button className="mini-action-button muted" type="submit">
            <SkipForward size={15} />
            Skip
          </button>
        </form>
      </div>
    </div>
  );
}

function TaskGroup({
  title,
  tasks,
  problemMap,
  emptyText
}: {
  title: string;
  tasks: StudyTask[];
  problemMap: Map<string, StudyProblem>;
  emptyText: string;
}) {
  return (
    <div>
      <h3>{title}</h3>
      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              problem={task.problemId ? problemMap.get(task.problemId) : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="empty-copy">{emptyText}</p>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
  children
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  note: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="stat-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
      {children}
    </div>
  );
}

function CapacityBar({ minutes }: { minutes: number }) {
  const percent = Math.min(100, Math.round((minutes / 120) * 100));

  return (
    <div
      className={`capacity-meter ${minutes > 120 ? "overloaded" : ""}`}
      aria-label={`${minutes} of 120 scheduled minutes`}
    >
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

export default async function SchedulePage() {
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
  const taskPlan = await syncStudyTasks(user.id, problems);
  const schedule = buildStudySchedule(problems);
  const problemMap = new Map(problems.map((problem) => [problem.id, problem]));
  const taskWindowEnd = addDays(taskPlan.today, 45);
  const tasks = await prisma.studyTask.findMany({
    where: {
      userId: user.id,
      status: "pending",
      scheduledFor: {
        gte: taskPlan.today,
        lte: taskWindowEnd
      }
    },
    orderBy: [
      { scheduledFor: "asc" },
      { carryoverCount: "desc" },
      { type: "asc" },
      { minutes: "desc" }
    ]
  });
  const upcomingDays = schedule.days.slice(0, 18);
  const firstDay = schedule.days[0];
  const completed = problems.filter((problem) => problem.progress.attempts > 0).length;
  const todayISO = toDateKey(taskPlan.today);
  const todayTasks = tasks.filter((task) => toDateKey(task.scheduledFor) === todayISO);
  const todayMinutes = todayTasks.reduce((sum, task) => sum + task.minutes, 0);
  const carryoverCount = todayTasks.filter((task) => task.carryoverCount > 0).length;
  const pendingNewCount = tasks.filter((task) => task.type === "new_problem").length;

  function tasksForDay(dateISO: string) {
    return tasks.filter((task) => toDateKey(task.scheduledFor) === dateISO);
  }

  return (
    <AppShell active="schedule">
      <main className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Six-month schedule</p>
            <h1>2 hours a day, 6 days a week</h1>
            <p>
              Learn new problems steadily, keep Sundays open, and let completed problems feed the
              weakness-based quiz queue when they become due.
            </p>
          </div>
          <Link className="primary-button" href="/learn">
            <TimerReset size={18} />
            Start today
          </Link>
          <form action={resyncScheduleAction}>
            <button className="secondary-button" type="submit">
              <RefreshCw size={17} />
              Resync
            </button>
          </form>
        </header>

        <section className="stat-grid schedule-stat-grid">
          <StatCard
            icon={<CalendarDays size={20} />}
            label="Plan window"
            value={formatScheduleRange(schedule.startISO, schedule.endISO)}
            note={`${schedule.totalDays} study days across 26 weeks`}
          />
          <StatCard
            icon={<Clock3 size={20} />}
            label="Total capacity"
            value={`${schedule.totalHours}h`}
            note="2 hours per study day"
          />
          <StatCard
            icon={<Code2 size={20} />}
            label="Pending new"
            value={pendingNewCount}
            note={`${completed} questions already attempted`}
          />
          <StatCard
            icon={<CalendarClock size={20} />}
            label="Today load"
            value={`${todayMinutes}/120m`}
            note={`${todayTasks.length} tasks on ${formatScheduleDate(firstDay.dateISO)}`}
          >
            <CapacityBar minutes={todayMinutes} />
          </StatCard>
        </section>

        <section className="panel wide-panel today-task-panel">
          <div className="panel-heading">
            <div>
              <span className="section-icon">
                <CalendarClock size={18} />
              </span>
              <h2>Today&apos;s task board</h2>
            </div>
            <span className="count-pill">{carryoverCount} carryover</span>
          </div>
          <div className="task-board">
            <TaskGroup
              title="Carryover"
              tasks={todayTasks.filter((task) => task.carryoverCount > 0)}
              problemMap={problemMap}
              emptyText="No missed work carried into today."
            />
            <TaskGroup
              title="Due review"
              tasks={todayTasks.filter(
                (task) => task.type === "due_review" && task.carryoverCount === 0
              )}
              problemMap={problemMap}
              emptyText="No due reviews today."
            />
            <TaskGroup
              title="New work"
              tasks={todayTasks.filter(
                (task) => task.type === "new_problem" && task.carryoverCount === 0
              )}
              problemMap={problemMap}
              emptyText="No new problem assigned today."
            />
            <TaskGroup
              title="Mock"
              tasks={todayTasks.filter(
                (task) => task.type === "mock_exam" && task.carryoverCount === 0
              )}
              problemMap={problemMap}
              emptyText="No mock exam today."
            />
          </div>
        </section>

        <section className="schedule-layout">
          <section className="panel schedule-day-panel">
            <div className="panel-heading">
              <div>
                <span className="section-icon">
                  <Repeat2 size={18} />
                </span>
                <h2>Daily rhythm</h2>
              </div>
              <span className="count-pill">120 min</span>
            </div>
            <div className="rhythm-list">
              <div>
                <strong>25 min</strong>
                <span>Due flashcards and weak memory/runtime recall</span>
              </div>
              <div>
                <strong>55 min</strong>
                <span>One new problem, written from memory before revealing the answer</span>
              </div>
              <div>
                <strong>30 min</strong>
                <span>Code the solution in Python 3, run tests, then fix misses</span>
              </div>
              <div>
                <strong>10 min</strong>
                <span>Tag mistakes and write the invariant in your own words</span>
              </div>
            </div>
          </section>

          <section className="panel schedule-day-panel">
            <div className="panel-heading">
              <div>
                <span className="section-icon">
                  <CheckCircle2 size={18} />
                </span>
                <h2>Review cadence</h2>
              </div>
              <span className="count-pill">spaced</span>
            </div>
            <div className="cadence-strip">
              {["D+1", "D+3", "D+7", "D+14", "D+30", "D+60", "D+90"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p className="empty-copy">
              Missed sections are due immediately. Correct sections move forward by streak:
              tomorrow, 3 days, 7 days, 14 days, then monthly.
            </p>
          </section>
        </section>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <span className="section-icon">
                <CalendarClock size={18} />
              </span>
              <h2>Next 18 study days</h2>
            </div>
            <span className="count-pill">auto-shifted</span>
          </div>
          <div className="schedule-day-list">
            {upcomingDays.map((day) => {
              const dayTasks = tasksForDay(day.dateISO);
              return (
                <article key={day.dateISO} className="schedule-day-row">
                  <div className="schedule-date-box">
                    <strong>{formatScheduleDate(day.dateISO)}</strong>
                    <span>
                      Week {day.weekNumber}, day {day.dayNumber}
                    </span>
                    <span>
                      {dayTasks.reduce((sum, task) => sum + task.minutes, 0)} / 120 min
                    </span>
                    <CapacityBar minutes={dayTasks.reduce((sum, task) => sum + task.minutes, 0)} />
                  </div>
                  <div className="schedule-day-content task-day-content">
                    <TaskGroup
                      title="Carryover"
                      tasks={dayTasks.filter((task) => task.carryoverCount > 0)}
                      problemMap={problemMap}
                      emptyText="None"
                    />
                    <TaskGroup
                      title="Planned"
                      tasks={dayTasks.filter((task) => task.carryoverCount === 0)}
                      problemMap={problemMap}
                      emptyText="No scheduled task."
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <span className="section-icon">
                <CalendarDays size={18} />
              </span>
              <h2>Week-by-week plan</h2>
            </div>
            <span className="count-pill">26 weeks</span>
          </div>
          <div className="schedule-week-table">
            {schedule.weeks.map((week) => (
              <div className="schedule-week-row" key={week.weekNumber}>
                <div>
                  <strong>Week {week.weekNumber}</strong>
                  <span>{formatScheduleRange(week.startISO, week.endISO)}</span>
                </div>
                <div>
                  <strong>{week.phase}</strong>
                  <span>{week.patterns.length > 0 ? week.patterns.join(" / ") : "Mixed review"}</span>
                </div>
                <div className="week-counts">
                  <span>{week.newProblemCount} new</span>
                  <span>{week.plannedReviewCount + week.actualDueCount} reviews</span>
                  <span>
                    {week.difficulties.easy}E / {week.difficulties.medium}M /{" "}
                    {week.difficulties.hard}H
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
