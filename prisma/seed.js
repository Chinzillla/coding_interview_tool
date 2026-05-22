const { PrismaClient } = require("@prisma/client");
const { solutions } = require("./solutions");
const { leetcodeStarters } = require("./leetcode-starters");

const prisma = new PrismaClient();

const weeks = {
  1: [
    ["Two Sum", "Easy", 15],
    ["Valid Parentheses", "Easy", 20],
    ["Merge Two Sorted Lists", "Easy", 20],
    ["Best Time to Buy and Sell Stock", "Easy", 20],
    ["Valid Palindrome", "Easy", 15],
    ["Invert Binary Tree", "Easy", 15],
    ["Valid Anagram", "Easy", 15],
    ["Binary Search", "Easy", 15],
    ["Flood Fill", "Easy", 20],
    ["Lowest Common Ancestor of a Binary Search Tree", "Easy", 20],
    ["Balanced Binary Tree", "Easy", 15],
    ["Linked List Cycle", "Easy", 20],
    ["Implement Queue using Stacks", "Easy", 20],
    ["First Bad Version", "Easy", 20],
    ["Ransom Note", "Easy", 15],
    ["Climbing Stairs", "Easy", 20],
    ["Longest Palindrome", "Easy", 20],
    ["Reverse Linked List", "Easy", 20],
    ["Majority Element", "Easy", 20],
    ["Add Binary", "Easy", 15],
    ["Diameter of Binary Tree", "Easy", 30],
    ["Middle of the Linked List", "Easy", 20],
    ["Maximum Depth of Binary Tree", "Easy", 15],
    ["Contains Duplicate", "Easy", 15],
    ["Meeting Rooms", "Easy", 20],
    ["Roman to Integer", "Easy", 20],
    ["Backspace String Compare", "Easy", 15],
    ["Counting Bits", "Easy", 15],
    ["Same Tree", "Easy", 20],
    ["Number of 1 Bits", "Easy", 15],
    ["Longest Common Prefix", "Easy", 20],
    ["Single Number", "Easy", 15],
    ["Palindrome Linked List", "Easy", 20],
    ["Move Zeroes", "Easy", 20],
    ["Symmetric Tree", "Easy", 20],
    ["Missing Number", "Easy", 15],
    ["Palindrome Number", "Easy", 15],
    ["Convert Sorted Array to Binary Search Tree", "Easy", 20],
    ["Reverse Bits", "Easy", 15],
    ["Subtree of Another Tree", "Easy", 20],
    ["Squares of a Sorted Array", "Easy", 20],
    ["Maximum Subarray", "Medium", 20],
    ["Insert Interval", "Medium", 25],
    ["01 Matrix", "Medium", 30],
    ["K Closest Points to Origin", "Medium", 30],
    ["Longest Substring Without Repeating Characters", "Medium", 30],
    ["3Sum", "Medium", 30],
    ["Binary Tree Level Order Traversal", "Medium", 20],
    ["Clone Graph", "Medium", 25],
    ["Evaluate Reverse Polish Notation", "Medium", 30],
    ["Course Schedule", "Medium", 30],
    ["Implement Trie (Prefix Tree)", "Medium", 35],
    ["Coin Change", "Medium", 25],
    ["Product of Array Except Self", "Medium", 30],
    ["Min Stack", "Medium", 20],
    ["Validate Binary Search Tree", "Medium", 20],
    ["Number of Islands", "Medium", 25],
    ["Rotting Oranges", "Medium", 30]
  ],
  2: [
    ["Search in Rotated Sorted Array", "Medium", 30],
    ["Combination Sum", "Medium", 30],
    ["Permutations", "Medium", 30],
    ["Merge Intervals", "Medium", 30],
    ["Lowest Common Ancestor of a Binary Tree", "Medium", 25],
    ["Time Based Key-Value Store", "Medium", 35],
    ["Accounts Merge", "Medium", 30],
    ["Sort Colors", "Medium", 25],
    ["Word Break", "Medium", 30],
    ["Partition Equal Subset Sum", "Medium", 30],
    ["String to Integer (atoi)", "Medium", 25],
    ["Spiral Matrix", "Medium", 25],
    ["Subsets", "Medium", 30],
    ["Binary Tree Right Side View", "Medium", 20],
    ["Longest Palindromic Substring", "Medium", 25],
    ["Unique Paths", "Medium", 20],
    ["Construct Binary Tree from Preorder and Inorder Traversal", "Medium", 25],
    ["Container With Most Water", "Medium", 35],
    ["Letter Combinations of a Phone Number", "Medium", 30],
    ["Word Search", "Medium", 30],
    ["Find All Anagrams in a String", "Medium", 30],
    ["Minimum Height Trees", "Medium", 30],
    ["Task Scheduler", "Medium", 35],
    ["LRU Cache", "Medium", 30],
    ["Kth Smallest Element in a BST", "Medium", 25],
    ["Daily Temperatures", "Medium", 30],
    ["House Robber", "Medium", 25],
    ["Gas Station", "Medium", 30],
    ["Next Permutation", "Medium", 30],
    ["Valid Sudoku", "Medium", 35],
    ["Group Anagrams", "Medium", 25],
    ["Maximum Product Subarray", "Medium", 30],
    ["Design Add and Search Words Data Structure", "Medium", 35],
    ["Pacific Atlantic Water Flow", "Medium", 30],
    ["Remove Nth Node From End of List", "Medium", 20],
    ["Shortest Path to Get Food", "Medium", 30],
    ["Find the Duplicate Number", "Medium", 20],
    ["Top K Frequent Words", "Medium", 30],
    ["Longest Increasing Subsequence", "Medium", 30],
    ["Graph Valid Tree", "Medium", 30],
    ["Course Schedule II", "Medium", 35],
    ["Swap Nodes in Pairs", "Medium", 25]
  ],
  3: [
    ["Path Sum II", "Medium", 25],
    ["Longest Consecutive Sequence", "Medium", 30],
    ["Rotate Array", "Medium", 25],
    ["Odd Even Linked List", "Medium", 25],
    ["Decode String", "Medium", 30],
    ["Contiguous Array", "Medium", 30],
    ["Maximum Width of Binary Tree", "Medium", 20],
    ["Find K Closest Elements", "Medium", 30],
    ["Longest Repeating Character Replacement", "Medium", 30],
    ["Inorder Successor in BST", "Medium", 30],
    ["Jump Game", "Medium", 20],
    ["Add Two Numbers", "Medium", 25],
    ["Generate Parentheses", "Medium", 25],
    ["Sort List", "Medium", 25],
    ["Number of Connected Components in an Undirected Graph", "Medium", 30],
    ["Minimum Knight Moves", "Medium", 35],
    ["Subarray Sum Equals K", "Medium", 35],
    ["Asteroid Collision", "Medium", 30],
    ["Random Pick with Weight", "Medium", 25],
    ["Kth Largest Element in an Array", "Medium", 30],
    ["Maximal Square", "Medium", 30],
    ["Rotate Image", "Medium", 25],
    ["Binary Tree Zigzag Level Order Traversal", "Medium", 25],
    ["Design Hit Counter", "Medium", 30],
    ["Path Sum III", "Medium", 35],
    ["Pow(x, n)", "Medium", 20],
    ["Search a 2D Matrix", "Medium", 30],
    ["Largest Number", "Medium", 20],
    ["Decode Ways", "Medium", 25],
    ["Meeting Rooms II", "Medium", 30],
    ["Reverse Integer", "Medium", 25],
    ["Set Matrix Zeroes", "Medium", 25],
    ["Reorder List", "Medium", 25],
    ["Encode and Decode Strings", "Medium", 25],
    ["Cheapest Flights Within K Stops", "Medium", 45],
    ["All Nodes Distance K in Binary Tree", "Medium", 25],
    ["3Sum Closest", "Medium", 30],
    ["Rotate List", "Medium", 25],
    ["Find Minimum in Rotated Sorted Array", "Medium", 30],
    ["Basic Calculator II", "Medium", 30],
    ["Combination Sum IV", "Medium", 35],
    ["Insert Delete GetRandom O(1)", "Medium", 20],
    ["Non-overlapping Intervals", "Medium", 20],
    ["Minimum Window Substring", "Hard", 30]
  ],
  4: [
    ["Serialize and Deserialize Binary Tree", "Hard", 40],
    ["Trapping Rain Water", "Hard", 35],
    ["Find Median from Data Stream", "Hard", 30],
    ["Word Ladder", "Hard", 45],
    ["Basic Calculator", "Hard", 40],
    ["Maximum Profit in Job Scheduling", "Hard", 45],
    ["Merge k Sorted Lists", "Hard", 30],
    ["Largest Rectangle in Histogram", "Hard", 35],
    ["Binary Tree Maximum Path Sum", "Hard", 35],
    ["Maximum Frequency Stack", "Hard", 40],
    ["Median of Two Sorted Arrays", "Hard", 40],
    ["Longest Increasing Path in a Matrix", "Hard", 40],
    ["Longest Valid Parentheses", "Hard", 35],
    ["Design In-Memory File System", "Hard", 40],
    ["Employee Free Time", "Hard", 35],
    ["Word Search II", "Hard", 40],
    ["Alien Dictionary", "Hard", 45],
    ["Bus Routes", "Hard", 45],
    ["Sliding Window Maximum", "Hard", 35],
    ["Palindrome Pairs", "Hard", 40],
    ["Reverse Nodes in k-Group", "Hard", 35],
    ["Sudoku Solver", "Hard", 40],
    ["First Missing Positive", "Hard", 35],
    ["N-Queens", "Hard", 40],
    ["Smallest Range Covering Elements from K Lists", "Hard", 40]
  ]
};

const exact = {
  "Two Sum": {
    pattern: "Hash Map / Set",
    dataStructure: "Array",
    time: "O(n)",
    space: "O(n)",
    approach: "Scan once, storing each value's index. For each number, check whether target minus the current number was already seen."
  },
  "Trapping Rain Water": {
    pattern: "Two Pointers",
    dataStructure: "Array",
    time: "O(n)",
    space: "O(1)",
    approach:
      "Keep left and right pointers plus the best wall seen from each side. Move the side with the smaller max inward, update that max, and add the water trapped at the new position."
  },
  "Valid Parentheses": {
    pattern: "Stack",
    dataStructure: "String",
    time: "O(n)",
    space: "O(n)",
    approach: "Push opening brackets. For every closing bracket, the stack top must be the matching opener."
  },
  "Binary Search": {
    pattern: "Binary Search",
    dataStructure: "Array",
    time: "O(log n)",
    space: "O(1)",
    approach: "Maintain inclusive low and high boundaries, compare the middle value, then discard the impossible half."
  },
  "Maximum Subarray": {
    pattern: "Dynamic Programming",
    dataStructure: "Array",
    time: "O(n)",
    space: "O(1)",
    approach: "Use Kadane's algorithm: the best subarray ending here is either the current value alone or current value plus the previous best ending here."
  },
  "Product of Array Except Self": {
    pattern: "Prefix / Suffix",
    dataStructure: "Array",
    time: "O(n)",
    space: "O(1) extra",
    approach: "Write prefix products into the answer, then sweep backward with a running suffix product and multiply it into each position."
  },
  "Course Schedule": {
    pattern: "Topological Sort",
    dataStructure: "Graph",
    time: "O(V + E)",
    space: "O(V + E)",
    approach: "Build prerequisite edges and use indegrees or DFS colors to detect whether all courses can be ordered without a cycle."
  },
  "Course Schedule II": {
    pattern: "Topological Sort",
    dataStructure: "Graph",
    time: "O(V + E)",
    space: "O(V + E)",
    approach: "Build indegrees, repeatedly take zero-indegree courses, and return the produced order only if every course is processed."
  },
  "LRU Cache": {
    pattern: "Design",
    dataStructure: "Hash Map + Doubly Linked List",
    time: "O(1)",
    space: "O(capacity)",
    approach: "Map keys to linked-list nodes. Move touched nodes to the front and evict from the tail when capacity is exceeded."
  },
  "Find Median from Data Stream": {
    pattern: "Heap / Priority Queue",
    dataStructure: "Two Heaps",
    time: "O(log n) add, O(1) median",
    space: "O(n)",
    approach: "Keep a max heap for the smaller half and min heap for the larger half, then rebalance so their sizes differ by at most one."
  },
  "Median of Two Sorted Arrays": {
    pattern: "Binary Search",
    dataStructure: "Array",
    time: "O(log(min(m, n)))",
    space: "O(1)",
    approach: "Binary search the partition in the shorter array so every value on the left side is less than or equal to every value on the right side."
  },
  "Sliding Window Maximum": {
    pattern: "Monotonic Queue",
    dataStructure: "Deque",
    time: "O(n)",
    space: "O(k)",
    approach: "Keep indices in a deque with values decreasing from front to back, dropping stale indices and weaker tail values."
  },
  "Largest Rectangle in Histogram": {
    pattern: "Monotonic Stack",
    dataStructure: "Stack",
    time: "O(n)",
    space: "O(n)",
    approach: "Use an increasing stack of bar indices. When a lower bar appears, pop and compute each popped bar's maximal width."
  },
  "Minimum Window Substring": {
    pattern: "Sliding Window",
    dataStructure: "Hash Map",
    time: "O(n + m)",
    space: "O(m)",
    approach: "Expand right to satisfy all required character counts, then shrink left while the window remains valid."
  },
  "Word Ladder": {
    pattern: "Graph BFS",
    dataStructure: "Queue",
    time: "O(n * L^2)",
    space: "O(n * L)",
    approach: "Run BFS by changing one character at a time or by using wildcard buckets, stopping when the end word is reached."
  },
  "Word Search II": {
    pattern: "Trie + Backtracking",
    dataStructure: "Trie",
    time: "O(m * n * 4^L)",
    space: "O(total characters)",
    approach: "Put all words in a trie, start DFS from each cell, prune when the trie has no matching child, and mark visited cells in place."
  },
  "N-Queens": {
    pattern: "Backtracking",
    dataStructure: "Set",
    time: "O(n!)",
    space: "O(n)",
    approach: "Place queens row by row while tracking blocked columns and diagonals, then backtrack after each placement."
  }
};

const patternDefaults = {
  "Hash Map / Set": {
    dataStructure: "Hash Map",
    time: "O(n)",
    space: "O(n)",
    approach: "Track the state you need in a hash map or set so each item can be processed once."
  },
  Stack: {
    dataStructure: "Stack",
    time: "O(n)",
    space: "O(n)",
    approach: "Use a stack to preserve the most recent unresolved item and resolve it when the matching condition appears."
  },
  "Linked List": {
    dataStructure: "Linked List",
    time: "O(n)",
    space: "O(1)",
    approach: "Move pointers carefully, preserving the next node before rewiring links or advancing fast and slow pointers."
  },
  "Binary Tree DFS": {
    dataStructure: "Binary Tree",
    time: "O(n)",
    space: "O(h)",
    approach: "Use recursion or an explicit stack to combine each node's result with results from its children."
  },
  "Binary Tree BFS": {
    dataStructure: "Binary Tree",
    time: "O(n)",
    space: "O(w)",
    approach: "Use a queue to process the tree level by level and record the value required from each level."
  },
  "Binary Search": {
    dataStructure: "Array",
    time: "O(log n)",
    space: "O(1)",
    approach: "Define the sorted search space, preserve the invariant, and discard half of the candidates each iteration."
  },
  "Graph BFS": {
    dataStructure: "Graph",
    time: "O(V + E)",
    space: "O(V + E)",
    approach: "Use a queue and visited set to explore shortest unweighted paths or spreading processes layer by layer."
  },
  "Graph DFS": {
    dataStructure: "Graph",
    time: "O(V + E)",
    space: "O(V + E)",
    approach: "Build adjacency relationships, mark visited nodes, and recursively or iteratively explore connected regions."
  },
  "Topological Sort": {
    dataStructure: "Graph",
    time: "O(V + E)",
    space: "O(V + E)",
    approach: "Represent dependencies as directed edges and process nodes only after their prerequisites are finished."
  },
  "Dynamic Programming": {
    dataStructure: "Array / Table",
    time: "O(n)",
    space: "O(n)",
    approach: "Define the repeated subproblem, store the best answer for each state, and build from known base cases."
  },
  "Two Pointers": {
    dataStructure: "Array / String",
    time: "O(n)",
    space: "O(1)",
    approach: "Maintain two moving indices with a clear invariant, then move the side that can safely eliminate candidates."
  },
  "Sliding Window": {
    dataStructure: "String / Array",
    time: "O(n)",
    space: "O(k)",
    approach: "Expand the right edge, update counts, and shrink the left edge until the window satisfies the required invariant."
  },
  Intervals: {
    dataStructure: "Array",
    time: "O(n log n)",
    space: "O(n)",
    approach: "Sort by start or end time, then merge, count, or compare neighboring intervals according to the problem goal."
  },
  "Heap / Priority Queue": {
    dataStructure: "Heap",
    time: "O(n log k)",
    space: "O(k)",
    approach: "Keep only the most relevant candidates in a heap so every push and pop maintains the desired ordering."
  },
  Backtracking: {
    dataStructure: "Recursion",
    time: "O(branches^depth)",
    space: "O(depth)",
    approach: "Choose one candidate, recurse with updated state, then undo that choice before trying the next candidate."
  },
  Trie: {
    dataStructure: "Trie",
    time: "O(total characters)",
    space: "O(total characters)",
    approach: "Store characters in trie nodes so prefix checks and word branching follow the input one character at a time."
  },
  Greedy: {
    dataStructure: "Array",
    time: "O(n)",
    space: "O(1)",
    approach: "Track the strongest local state that is enough to prove the global decision remains valid."
  },
  "Math / Bit Manipulation": {
    dataStructure: "Integer",
    time: "O(1)",
    space: "O(1)",
    approach: "Use arithmetic identities or bit operations to update the answer without storing unnecessary state."
  },
  Matrix: {
    dataStructure: "Matrix",
    time: "O(m * n)",
    space: "O(m * n)",
    approach: "Traverse the grid with clear boundaries or visited state, and treat each cell as a small local decision."
  },
  Design: {
    dataStructure: "Custom Data Structure",
    time: "O(1) average",
    space: "O(n)",
    approach: "Combine primitive structures so each required operation has direct access to the state it needs."
  },
  "Monotonic Stack": {
    dataStructure: "Stack",
    time: "O(n)",
    space: "O(n)",
    approach: "Maintain stack order so each element is pushed and popped once when a stronger future value resolves it."
  },
  "Monotonic Queue": {
    dataStructure: "Deque",
    time: "O(n)",
    space: "O(k)",
    approach: "Keep candidates in useful order inside a deque, removing stale front items and dominated tail items."
  },
  "Prefix / Suffix": {
    dataStructure: "Array",
    time: "O(n)",
    space: "O(1) extra",
    approach: "Sweep once to accumulate prefix information and again to combine it with suffix or running state."
  },
  "Union Find": {
    dataStructure: "Disjoint Set",
    time: "O((V + E) alpha(V))",
    space: "O(V)",
    approach: "Union related items, compress paths during find, and use component counts or roots to answer connectivity questions."
  }
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferPattern(title) {
  const lower = title.toLowerCase();

  if (exact[title]) return exact[title];
  if (lower.includes("course schedule") || lower.includes("alien dictionary")) return fromPattern("Topological Sort");
  if (lower.includes("trie") || lower.includes("prefix tree") || lower.includes("add and search")) return fromPattern("Trie");
  if (lower.includes("word search ii")) return fromPattern("Trie + Backtracking");
  if (lower.includes("combination") || lower.includes("permutation") || lower.includes("subsets") || lower.includes("parentheses") && lower.includes("generate") || lower.includes("sudoku") || lower.includes("n-queens")) return fromPattern("Backtracking");
  if (lower.includes("linked list") || lower.includes("list") || lower.includes("node")) return fromPattern("Linked List");
  if (lower.includes("tree") || lower.includes("bst") || lower.includes("path sum") || lower.includes("successor")) {
    if (lower.includes("level order") || lower.includes("right side") || lower.includes("zigzag") || lower.includes("width")) return fromPattern("Binary Tree BFS");
    return fromPattern("Binary Tree DFS");
  }
  if (lower.includes("island") || lower.includes("graph") || lower.includes("accounts merge") || lower.includes("connected components")) {
    if (lower.includes("valid tree") || lower.includes("accounts merge") || lower.includes("connected components")) return fromPattern("Union Find");
    return fromPattern("Graph DFS");
  }
  if (lower.includes("matrix") || lower.includes("oranges") || lower.includes("flood fill") || lower.includes("pacific") || lower.includes("knight") || lower.includes("food") || lower.includes("bus routes")) return fromPattern("Graph BFS");
  if (lower.includes("search") || lower.includes("rotated") || lower.includes("median of two sorted") || lower.includes("minimum in rotated") || lower.includes("k closest elements")) return fromPattern("Binary Search");
  if (lower.includes("window") || lower.includes("substring") || lower.includes("anagrams") || lower.includes("repeating character")) return fromPattern("Sliding Window");
  if (lower.includes("3sum") || lower.includes("palindrome") || lower.includes("container") || lower.includes("zeroes") || lower.includes("sorted array") || lower.includes("duplicate number")) return fromPattern("Two Pointers");
  if (lower.includes("interval") || lower.includes("meeting rooms") || lower.includes("employee free time") || lower.includes("job scheduling")) return fromPattern("Intervals");
  if (lower.includes("k closest") || lower.includes("top k") || lower.includes("kth largest") || lower.includes("kth smallest") || lower.includes("merge k")) return fromPattern("Heap / Priority Queue");
  if (lower.includes("stack") || lower.includes("calculator") || lower.includes("polish") || lower.includes("asteroid") || lower.includes("temperatures") || lower.includes("histogram") || lower.includes("valid parentheses")) return fromPattern("Stack");
  if (lower.includes("daily temperatures") || lower.includes("largest rectangle") || lower.includes("frequency stack")) return fromPattern("Monotonic Stack");
  if (lower.includes("house robber") || lower.includes("coin change") || lower.includes("word break") || lower.includes("decode ways") || lower.includes("unique paths") || lower.includes("increasing subsequence") || lower.includes("maximal square") || lower.includes("partition equal") || lower.includes("maximum product") || lower.includes("combination sum iv")) return fromPattern("Dynamic Programming");
  if (lower.includes("sum") || lower.includes("anagram") || lower.includes("ransom") || lower.includes("duplicate") || lower.includes("single number") || lower.includes("consecutive") || lower.includes("subarray sum") || lower.includes("random pick") || lower.includes("insert delete")) return fromPattern("Hash Map / Set");
  if (lower.includes("bits") || lower.includes("binary") || lower.includes("number") || lower.includes("pow") || lower.includes("integer") || lower.includes("roman") || lower.includes("missing")) return fromPattern("Math / Bit Manipulation");
  if (lower.includes("rotate") || lower.includes("spiral") || lower.includes("set matrix") || lower.includes("sudoku")) return fromPattern("Matrix");
  if (lower.includes("gas station") || lower.includes("jump game") || lower.includes("task scheduler") || lower.includes("non-overlapping")) return fromPattern("Greedy");
  if (lower.includes("cache") || lower.includes("hit counter") || lower.includes("file system") || lower.includes("time based")) return fromPattern("Design");
  return fromPattern("Hash Map / Set");
}

function fromPattern(pattern) {
  return {
    pattern,
    ...patternDefaults[pattern]
  };
}

function memoryDistractors(pattern) {
  const options = {
    "Two Pointers": [
      "Sort the input first, then use two pointers even when original order or index positions must be preserved.",
      "Move both pointers every loop because that reduces the search space fastest.",
      "Always move the side with the larger value because it looks like the stronger boundary."
    ],
    "Sliding Window": [
      "Restart the window from scratch whenever a duplicate or invalid character appears.",
      "Shrink the left side before updating the counts for the right side.",
      "Track only the current length and skip the frequency counts that prove the window is valid."
    ],
    "Binary Search": [
      "Use binary search on the values but update both boundaries after every comparison.",
      "Stop as soon as low and high are adjacent, even if the answer could still be at either boundary.",
      "Sort the input first, even when the problem relies on the original rotated or partitioned structure."
    ],
    "Dynamic Programming": [
      "Use recursion without memoization because overlapping states will naturally collapse.",
      "Store only the final answer and skip defining the state transition.",
      "Greedily choose the best local option at every step without proving it determines the future."
    ],
    "Graph BFS": [
      "Use DFS and return the first path found, assuming it is shortest.",
      "Mark nodes visited only when they leave the queue, allowing repeated duplicates to build up.",
      "Ignore layer boundaries when the number of steps or minutes is the actual answer."
    ],
    "Graph DFS": [
      "Visit neighbors without a visited set because recursion will eventually stop at boundaries.",
      "Treat directed and undirected edges the same without checking the problem statement.",
      "Mutate the grid or graph before saving the next choices needed by recursion."
    ],
    "Topological Sort": [
      "Sort courses by course number and assume prerequisites will appear earlier.",
      "Run BFS from a random node and stop when that component has no outgoing edges.",
      "Remove prerequisites only after all nodes are processed, instead of updating indegrees immediately."
    ],
    Stack: [
      "Use a queue because the earliest unresolved item should be checked first.",
      "Pop before checking whether the top item actually matches the current token.",
      "Store only counts and ignore the order of the unresolved symbols."
    ],
    "Monotonic Stack": [
      "Keep every previous item forever and scan the stack from bottom to top each time.",
      "Use an increasing stack when the problem needs the next greater value.",
      "Pop equal values blindly even when duplicates may need stable positions."
    ],
    "Heap / Priority Queue": [
      "Sort the whole list after every insertion so the best candidate is always first.",
      "Use a stack to keep the current best candidate near the top.",
      "Keep all values in the heap even when only k candidates are relevant."
    ],
    Backtracking: [
      "Append choices to the result immediately and never undo them.",
      "Use a visited set shared across all branches without removing choices during backtracking.",
      "Skip constraints until the end and generate every possible full candidate first."
    ],
    Trie: [
      "Put every word in a hash set and scan all words for every prefix query.",
      "Store only the first letter of each word because later letters can be checked after a match.",
      "Use sorting to group prefixes, then linearly scan the sorted list for each operation."
    ]
  };

  return (
    options[pattern] || [
      "Use nested loops first, then optimize only if the result is too slow.",
      "Sort the input even when the problem depends on original order.",
      "Track only the final answer and skip the state needed to prove each update is valid."
    ]
  );
}

function runtimeDistractors(correct) {
  const choices = ["O(n)", "O(n log n)", "O(n^2)", "O(log n)", "O(V + E)", "O(1)", "O(m * n)", "O(2^n)"];
  return choices.filter((choice) => choice !== correct).slice(0, 3);
}

function spaceDistractors(correct) {
  const choices = ["O(1)", "O(n)", "O(n^2)", "O(log n)", "O(V + E)", "O(k)", "O(m * n)", "O(2^n)"];
  return choices.filter((choice) => choice !== correct).slice(0, 3);
}

function explanationFor(problem, meta) {
  if (problem.title === "Trapping Rain Water") {
    return [
      "Use two pointers because water at a position is limited by the shorter wall seen from either side.",
      "Initialize left and right at the ends and store left_max_height and right_max_height from those boundary bars.",
      "Move the side with the smaller max because that side is the limiting wall; the other side already has a wall at least as tall.",
      "After moving the pointer, update that side's max, then add max_height - current_height. This is never negative because the max includes the current bar.",
      "Each index is visited once, so the solution is linear time and constant extra space."
    ].join("\n");
  }

  return [
    `${problem.title} is best practiced as a ${meta.pattern} problem.`,
    meta.approach,
    "The key repetition target is the invariant: know exactly what state is trustworthy after each loop or recursive call.",
    "When reviewing, say the invariant out loud, write the code from memory, then check time and space without looking."
  ].join("\n");
}

function codeStarterFor(title, meta) {
  if (leetcodeStarters[title]) {
    return leetcodeStarters[title];
  }

  return [
    "from typing import *",
    "",
    "# Starter unavailable for this problem. Use the canonical solution as the reference.",
    `# Pattern to recall: ${meta.pattern}.`,
    codeSolutionFor(title)
      .split("\n")
      .filter((line) => !line.startsWith("        ") && !line.startsWith("            "))
      .join("\n")
  ].join("\n");
}

function codeSolutionFor(title) {
  if (solutions[title]) {
    return solutions[title];
  }

  return "# Solution not seeded yet for this problem.";
}

function buildProblem(raw, week, index) {
  const [title, difficulty, minutes] = raw;
  const inferred = inferPattern(title);
  const meta = {
    ...inferred,
    ...(exact[title] || {})
  };

  const problem = {
    title,
    week,
    weekOrder: index + 1,
    difficulty,
    minutes
  };

  return {
    slug: slugify(title),
    title,
    week,
    weekOrder: index + 1,
    difficulty,
    minutes,
    pattern: meta.pattern,
    dataStructure: meta.dataStructure,
    memoryPrompt: `What is the best high-level plan for ${title}?`,
    memoryCorrect: meta.approach,
    memoryDistractors: JSON.stringify(memoryDistractors(meta.pattern)),
    codeStarter: codeStarterFor(title, meta),
    codeSolution: codeSolutionFor(title),
    explanation: explanationFor(problem, meta),
    timeComplexity: meta.time,
    spaceComplexity: meta.space,
    runtimeDistractors: JSON.stringify(runtimeDistractors(meta.time)),
    spaceDistractors: JSON.stringify(spaceDistractors(meta.space))
  };
}

async function main() {
  const allProblems = Object.entries(weeks).flatMap(([week, items]) =>
    items.map((item, index) => buildProblem(item, Number(week), index))
  );

  for (const problem of allProblems) {
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: problem,
      create: problem
    });
  }

  console.log(`Seeded ${allProblems.length} coding interview problems.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
