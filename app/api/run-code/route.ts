import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getCodeTestSuite, type CodeTestSuite } from "@/lib/code-tests";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const runSchema = z.object({
  problemId: z.string(),
  code: z.string().min(1).max(20000)
});

function pythonString(value: unknown) {
  return JSON.stringify(value);
}

function buildPythonScript(code: string, suite: CodeTestSuite) {
  return `
import copy
import json
import math
import traceback
from collections import Counter, defaultdict, deque
from functools import cmp_to_key, lru_cache
from typing import *
import bisect
import heapq
import random

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def build_linked_list(values):
    sentinel = ListNode()
    current = sentinel
    for value in values:
        current.next = ListNode(value)
        current = current.next
    return sentinel.next

def linked_list_to_list(node):
    values = []
    guard = 0
    while node and guard < 10000:
        values.append(node.val)
        node = node.next
        guard += 1
    return values

def build_tree(values):
    if values is None or len(values) == 0:
        return None
    nodes = [None if value is None else TreeNode(value) for value in values]
    child_index = 1
    for node in nodes:
        if node is None:
            continue
        if child_index < len(nodes):
            node.left = nodes[child_index]
            child_index += 1
        if child_index < len(nodes):
            node.right = nodes[child_index]
            child_index += 1
    return nodes[0]

def tree_to_list(root):
    if not root:
        return []
    values = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node is None:
            values.append(None)
            continue
        values.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
    while values and values[-1] is None:
        values.pop()
    return values

def convert_arg(value, arg_type):
    if arg_type == "listNode":
        return build_linked_list(value)
    if arg_type == "tree":
        return build_tree(value)
    return copy.deepcopy(value)

def normalize_result(value, result_type):
    if result_type == "listNode":
        return linked_list_to_list(value)
    if result_type == "tree":
        return tree_to_list(value)
    return value

def compare_result(actual, expected, compare, original_args):
    if compare == "twoSum":
        if not isinstance(actual, list) or len(actual) != 2:
            return False
        first, second = actual
        nums, target = original_args
        if not isinstance(first, int) or not isinstance(second, int):
            return False
        if first == second or first < 0 or second < 0 or first >= len(nums) or second >= len(nums):
            return False
        return nums[first] + nums[second] == target
    if compare == "unorderedNested":
        return sorted([list(item) for item in actual]) == sorted([list(item) for item in expected])
    if compare == "float":
        return abs(float(actual) - float(expected)) < 1e-6
    return actual == expected

${code}

TESTS = json.loads(${pythonString(JSON.stringify(suite.tests))})
METHOD_NAME = ${pythonString(suite.method)}

results = []
try:
    solution = Solution()
except NameError:
    solution = None

for test in TESTS:
    original_args = copy.deepcopy(test["args"])
    arg_types = test.get("argTypes", ["raw"] * len(test["args"]))
    args = [convert_arg(value, arg_types[index] if index < len(arg_types) else "raw") for index, value in enumerate(test["args"])]

    try:
        if solution is None:
            raise Exception("Define class Solution or use the expected LeetCode class for this problem.")
        method = getattr(solution, METHOD_NAME, None) or getattr(solution, "solve", None)
        if method is None:
            raise Exception(f"Expected method {METHOD_NAME} or solve was not found.")

        raw_result = method(*args)
        if "assertArgIndex" in test:
            raw_result = args[test["assertArgIndex"]]
        actual = normalize_result(raw_result, test.get("resultType", "raw"))
        expected = test["expected"]
        passed = compare_result(actual, expected, test.get("compare", "exact"), original_args)
        results.append({
            "name": test["name"],
            "passed": passed,
            "expected": expected,
            "actual": actual
        })
    except Exception:
        results.append({
            "name": test["name"],
            "passed": False,
            "expected": test["expected"],
            "actual": None,
            "error": traceback.format_exc(limit=4)
        })

print(json.dumps({"results": results}))
`;
}

type PythonRunResult = {
  stdout: string;
  stderr: string;
  timedOut: boolean;
  spawnError?: string;
};

function runPythonCandidate(command: string, args: string[], scriptPath: string) {
  return new Promise<PythonRunResult>((resolve) => {
    const child = spawn(command, [...args, scriptPath], {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      settled = true;
      child.kill();
      resolve({ stdout, stderr, timedOut: true });
    }, 4000);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({ stdout, stderr, timedOut: false, spawnError: error.message });
    });

    child.on("close", () => {
      if (settled) return;
      clearTimeout(timeout);
      resolve({ stdout, stderr, timedOut: false });
    });
  });
}

async function runPython(scriptPath: string) {
  const candidates = [
    ...(process.env.PYTHON_BIN ? [{ command: process.env.PYTHON_BIN, args: [] }] : []),
    { command: "python3", args: [] },
    { command: "python", args: [] },
    { command: "py", args: ["-3"] }
  ];

  let lastResult: PythonRunResult | null = null;
  for (const candidate of candidates) {
    const result = await runPythonCandidate(candidate.command, candidate.args, scriptPath);
    lastResult = result;
    const missingPython =
      result.spawnError ||
      result.stderr.includes("Python was not found") ||
      result.stderr.includes("No Python at");
    if (!missingPython) {
      return result;
    }
  }

  return (
    lastResult ?? {
      stdout: "",
      stderr: "Python 3 was not found.",
      timedOut: false
    }
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = runSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid code run payload" }, { status: 400 });
  }

  const problem = await prisma.problem.findUnique({
    where: { id: parsed.data.problemId },
    select: { title: true }
  });

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const suite = getCodeTestSuite(problem.title);
  if (!suite) {
    return NextResponse.json({
      supported: false,
      message: "No Python test cases have been added for this problem yet."
    });
  }

  const workdir = await mkdtemp(path.join(tmpdir(), "coding-study-"));
  const scriptPath = path.join(workdir, `${randomUUID()}.py`);

  try {
    await writeFile(scriptPath, buildPythonScript(parsed.data.code, suite), "utf8");
    const result = await runPython(scriptPath);

    if (result.timedOut) {
      return NextResponse.json({
        supported: true,
        method: suite.method,
        timedOut: true,
        stderr: "Execution timed out after 4 seconds.",
        results: []
      });
    }

    if (result.stderr.trim()) {
      return NextResponse.json({
        supported: true,
        method: suite.method,
        stderr: result.spawnError ?? result.stderr,
        results: []
      });
    }

    const outputLines = result.stdout.trim().split(/\r?\n/);
    const output = JSON.parse(outputLines[outputLines.length - 1] || "{}");
    return NextResponse.json({
      supported: true,
      method: suite.method,
      timedOut: false,
      ...output
    });
  } catch (error) {
    return NextResponse.json(
      {
        supported: true,
        method: suite.method,
        error: error instanceof Error ? error.message : "Code execution failed.",
        results: []
      },
      { status: 500 }
    );
  } finally {
    await rm(workdir, { recursive: true, force: true }).catch(() => null);
  }
}
