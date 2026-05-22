export type CodeTestCase = {
  name: string;
  args: unknown[];
  expected: unknown;
  argTypes?: string[];
  resultType?: string;
  compare?: "exact" | "twoSum" | "unorderedNested" | "float";
  assertArgIndex?: number;
};

export type CodeTestSuite = {
  method: string;
  tests: CodeTestCase[];
};

export const codeTestSuites: Record<string, CodeTestSuite> = {
  "Two Sum": {
    method: "twoSum",
    tests: [
      { name: "basic pair", args: [[2, 7, 11, 15], 9], expected: [0, 1], compare: "twoSum" },
      { name: "later pair", args: [[3, 2, 4], 6], expected: [1, 2], compare: "twoSum" },
      { name: "duplicate values", args: [[3, 3], 6], expected: [0, 1], compare: "twoSum" }
    ]
  },
  "Valid Parentheses": {
    method: "isValid",
    tests: [
      { name: "simple valid", args: ["()[]{}"], expected: true },
      { name: "wrong order", args: ["(]"], expected: false },
      { name: "nested valid", args: ["{[]}"], expected: true }
    ]
  },
  "Merge Two Sorted Lists": {
    method: "mergeTwoLists",
    tests: [
      {
        name: "two populated lists",
        args: [[1, 2, 4], [1, 3, 4]],
        argTypes: ["listNode", "listNode"],
        expected: [1, 1, 2, 3, 4, 4],
        resultType: "listNode"
      },
      {
        name: "one empty list",
        args: [[], [0]],
        argTypes: ["listNode", "listNode"],
        expected: [0],
        resultType: "listNode"
      }
    ]
  },
  "Best Time to Buy and Sell Stock": {
    method: "maxProfit",
    tests: [
      { name: "profit exists", args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { name: "decreasing prices", args: [[7, 6, 4, 3, 1]], expected: 0 },
      { name: "short window", args: [[2, 4, 1]], expected: 2 }
    ]
  },
  "Valid Palindrome": {
    method: "isPalindrome",
    tests: [
      { name: "sentence palindrome", args: ["A man, a plan, a canal: Panama"], expected: true },
      { name: "not palindrome", args: ["race a car"], expected: false },
      { name: "empty after filtering", args: [" "], expected: true }
    ]
  },
  "Invert Binary Tree": {
    method: "invertTree",
    tests: [
      { name: "balanced tree", args: [[4, 2, 7, 1, 3, 6, 9]], argTypes: ["tree"], expected: [4, 7, 2, 9, 6, 3, 1], resultType: "tree" },
      { name: "empty tree", args: [null], argTypes: ["tree"], expected: [], resultType: "tree" }
    ]
  },
  "Valid Anagram": {
    method: "isAnagram",
    tests: [
      { name: "same letters", args: ["anagram", "nagaram"], expected: true },
      { name: "different letters", args: ["rat", "car"], expected: false }
    ]
  },
  "Binary Search": {
    method: "search",
    tests: [
      { name: "target present", args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { name: "target missing", args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }
    ]
  },
  "Flood Fill": {
    method: "floodFill",
    tests: [
      {
        name: "fills connected component",
        args: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2],
        expected: [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
      },
      { name: "same color", args: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], expected: [[0, 0, 0], [0, 0, 0]] }
    ]
  },
  "Climbing Stairs": {
    method: "climbStairs",
    tests: [
      { name: "two stairs", args: [2], expected: 2 },
      { name: "three stairs", args: [3], expected: 3 },
      { name: "five stairs", args: [5], expected: 8 }
    ]
  },
  "Reverse Linked List": {
    method: "reverseList",
    tests: [
      { name: "multiple nodes", args: [[1, 2, 3, 4, 5]], argTypes: ["listNode"], expected: [5, 4, 3, 2, 1], resultType: "listNode" },
      { name: "single node", args: [[1]], argTypes: ["listNode"], expected: [1], resultType: "listNode" }
    ]
  },
  "Contains Duplicate": {
    method: "containsDuplicate",
    tests: [
      { name: "has duplicate", args: [[1, 2, 3, 1]], expected: true },
      { name: "all unique", args: [[1, 2, 3, 4]], expected: false }
    ]
  },
  "Maximum Subarray": {
    method: "maxSubArray",
    tests: [
      { name: "mixed values", args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { name: "single value", args: [[1]], expected: 1 },
      { name: "all negative", args: [[-3, -2, -1]], expected: -1 }
    ]
  },
  "Product of Array Except Self": {
    method: "productExceptSelf",
    tests: [
      { name: "positive values", args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { name: "with zero", args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
    ]
  },
  "Number of Islands": {
    method: "numIslands",
    tests: [
      {
        name: "one island",
        args: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]],
        expected: 1
      },
      {
        name: "three islands",
        args: [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]],
        expected: 3
      }
    ]
  },
  "Rotting Oranges": {
    method: "orangesRotting",
    tests: [
      { name: "all rot", args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
      { name: "impossible", args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
      { name: "none fresh", args: [[[0, 2]]], expected: 0 }
    ]
  },
  "Search in Rotated Sorted Array": {
    method: "search",
    tests: [
      { name: "present", args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { name: "missing", args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 }
    ]
  },
  "Merge Intervals": {
    method: "merge",
    tests: [
      { name: "overlap", args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { name: "touching intervals", args: [[[1, 4], [4, 5]]], expected: [[1, 5]] }
    ]
  },
  "Container With Most Water": {
    method: "maxArea",
    tests: [
      { name: "standard", args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { name: "two bars", args: [[1, 1]], expected: 1 }
    ]
  },
  "Word Search": {
    method: "exist",
    tests: [
      { name: "exists", args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], expected: true },
      { name: "does not exist", args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"], expected: false }
    ]
  },
  "Trapping Rain Water": {
    method: "trap",
    tests: [
      { name: "standard", args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { name: "wide basin", args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { name: "empty", args: [[]], expected: 0 }
    ]
  },
  "Minimum Window Substring": {
    method: "minWindow",
    tests: [
      { name: "standard", args: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { name: "single char", args: ["a", "a"], expected: "a" },
      { name: "missing", args: ["a", "aa"], expected: "" }
    ]
  },
  "Sliding Window Maximum": {
    method: "maxSlidingWindow",
    tests: [
      { name: "standard", args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { name: "single window", args: [[1], 1], expected: [1] }
    ]
  },
  "Largest Rectangle in Histogram": {
    method: "largestRectangleArea",
    tests: [
      { name: "standard", args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { name: "two bars", args: [[2, 4]], expected: 4 }
    ]
  },
  "Median of Two Sorted Arrays": {
    method: "findMedianSortedArrays",
    tests: [
      { name: "odd total", args: [[1, 3], [2]], expected: 2.0, compare: "float" },
      { name: "even total", args: [[1, 2], [3, 4]], expected: 2.5, compare: "float" }
    ]
  }
};

export function getCodeTestSuite(title: string) {
  return codeTestSuites[title] ?? null;
}
