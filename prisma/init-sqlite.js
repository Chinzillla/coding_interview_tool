const fs = require("fs");
const path = require("path");

function loadLocalEnv() {
  const envPath = path.resolve(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
}

function resolveSqlitePath() {
  loadLocalEnv();
  const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("init-sqlite.js only supports file: SQLite DATABASE_URL values.");
  }

  const rawPath = databaseUrl.replace(/^file:/, "");
  return path.resolve(__dirname, rawPath);
}

function ensureColumn(db, tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all();
  if (columns.some((column) => column.name === columnName)) return;
  db.exec(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${definition}`);
}

async function main() {
  let sqlite;
  try {
    sqlite = require("node:sqlite");
  } catch {
    throw new Error("node:sqlite is unavailable. Use `prisma db push` with this Node version.");
  }

  const dbPath = resolveSqlitePath();
  const reset = process.argv.includes("--reset");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  if (reset && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = new sqlite.DatabaseSync(dbPath);
  db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Problem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "weekOrder" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "pattern" TEXT NOT NULL,
    "dataStructure" TEXT NOT NULL,
    "memoryPrompt" TEXT NOT NULL,
    "memoryCorrect" TEXT NOT NULL,
    "memoryDistractors" TEXT NOT NULL,
    "codeStarter" TEXT NOT NULL,
    "codeSolution" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "timeComplexity" TEXT NOT NULL,
    "spaceComplexity" TEXT NOT NULL,
    "runtimeDistractors" TEXT NOT NULL,
    "spaceDistractors" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "memoryScore" INTEGER NOT NULL DEFAULT 0,
    "codeScore" INTEGER NOT NULL DEFAULT 0,
    "runtimeScore" INTEGER NOT NULL DEFAULT 0,
    "memoryDueAt" DATETIME,
    "codeDueAt" DATETIME,
    "runtimeDueAt" DATETIME,
    "memoryStreak" INTEGER NOT NULL DEFAULT 0,
    "codeStreak" INTEGER NOT NULL DEFAULT 0,
    "runtimeStreak" INTEGER NOT NULL DEFAULT 0,
    "mistakeTags" TEXT NOT NULL DEFAULT '[]',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Progress_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "problemId" TEXT,
    "mode" TEXT NOT NULL,
    "memoryCorrect" BOOLEAN,
    "codeCorrect" BOOLEAN,
    "runtimeCorrect" BOOLEAN,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "answers" TEXT NOT NULL,
    "mistakeTags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "StudyTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "problemId" TEXT,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL DEFAULT 'planned',
    "domain" TEXT,
    "scheduledFor" DATETIME NOT NULL,
    "originalFor" DATETIME NOT NULL,
    "minutes" INTEGER NOT NULL,
    "carryoverCount" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "skippedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudyTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudyTask_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "Problem_slug_key" ON "Problem"("slug");
CREATE INDEX IF NOT EXISTS "Problem_week_idx" ON "Problem"("week");
CREATE INDEX IF NOT EXISTS "Problem_pattern_idx" ON "Problem"("pattern");
CREATE INDEX IF NOT EXISTS "Problem_dataStructure_idx" ON "Problem"("dataStructure");
CREATE INDEX IF NOT EXISTS "Problem_difficulty_idx" ON "Problem"("difficulty");
CREATE INDEX IF NOT EXISTS "Progress_userId_idx" ON "Progress"("userId");
CREATE INDEX IF NOT EXISTS "Progress_problemId_idx" ON "Progress"("problemId");
CREATE UNIQUE INDEX IF NOT EXISTS "Progress_userId_problemId_key" ON "Progress"("userId", "problemId");
CREATE INDEX IF NOT EXISTS "Attempt_userId_idx" ON "Attempt"("userId");
CREATE INDEX IF NOT EXISTS "Attempt_problemId_idx" ON "Attempt"("problemId");
CREATE INDEX IF NOT EXISTS "Attempt_mode_idx" ON "Attempt"("mode");
CREATE UNIQUE INDEX IF NOT EXISTS "StudyTask_userId_key_key" ON "StudyTask"("userId", "key");
CREATE INDEX IF NOT EXISTS "StudyTask_userId_idx" ON "StudyTask"("userId");
CREATE INDEX IF NOT EXISTS "StudyTask_problemId_idx" ON "StudyTask"("problemId");
CREATE INDEX IF NOT EXISTS "StudyTask_scheduledFor_idx" ON "StudyTask"("scheduledFor");
CREATE INDEX IF NOT EXISTS "StudyTask_status_idx" ON "StudyTask"("status");
CREATE INDEX IF NOT EXISTS "StudyTask_type_idx" ON "StudyTask"("type");
`);

  ensureColumn(db, "Progress", "memoryDueAt", "DATETIME");
  ensureColumn(db, "Progress", "codeDueAt", "DATETIME");
  ensureColumn(db, "Progress", "runtimeDueAt", "DATETIME");
  ensureColumn(db, "Progress", "memoryStreak", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "Progress", "codeStreak", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "Progress", "runtimeStreak", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "Progress", "mistakeTags", "TEXT NOT NULL DEFAULT '[]'");
  ensureColumn(db, "Attempt", "mistakeTags", "TEXT NOT NULL DEFAULT '[]'");

  db.exec(`
CREATE INDEX IF NOT EXISTS "Progress_memoryDueAt_idx" ON "Progress"("memoryDueAt");
CREATE INDEX IF NOT EXISTS "Progress_codeDueAt_idx" ON "Progress"("codeDueAt");
CREATE INDEX IF NOT EXISTS "Progress_runtimeDueAt_idx" ON "Progress"("runtimeDueAt");
`);
  db.close();
  console.log(`SQLite schema ready at ${dbPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
