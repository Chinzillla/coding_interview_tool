function starter(code) {
  return code.trim();
}

const leetcodeStarters = {
  "Two Sum": starter(`
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass
`),
  "Valid Parentheses": starter(`
class Solution:
    def isValid(self, s: str) -> bool:
        pass
`),
  "Merge Two Sorted Lists": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        pass
`),
  "Best Time to Buy and Sell Stock": starter(`
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        pass
`),
  "Valid Palindrome": starter(`
class Solution:
    def isPalindrome(self, s: str) -> bool:
        pass
`),
  "Invert Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        pass
`),
  "Valid Anagram": starter(`
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass
`),
  "Binary Search": starter(`
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        pass
`),
  "Flood Fill": starter(`
class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        pass
`),
  "Lowest Common Ancestor of a Binary Search Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        pass
`),
  "Balanced Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        pass
`),
  "Linked List Cycle": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        pass
`),
  "Implement Queue using Stacks": starter(`
class MyQueue:

    def __init__(self):
        pass


    def push(self, x: int) -> None:
        pass


    def pop(self) -> int:
        pass


    def peek(self) -> int:
        pass


    def empty(self) -> bool:
        pass



# Your MyQueue object will be instantiated and called as such:
# obj = MyQueue()
# obj.push(x)
# param_2 = obj.pop()
# param_3 = obj.peek()
# param_4 = obj.empty()
`),
  "First Bad Version": starter(`
# The isBadVersion API is already defined for you.
# def isBadVersion(version: int) -> bool:

class Solution:
    def firstBadVersion(self, n: int) -> int:
        pass
`),
  "Ransom Note": starter(`
class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        pass
`),
  "Climbing Stairs": starter(`
class Solution:
    def climbStairs(self, n: int) -> int:
        pass
`),
  "Longest Palindrome": starter(`
class Solution:
    def longestPalindrome(self, s: str) -> int:
        pass
`),
  "Reverse Linked List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass
`),
  "Majority Element": starter(`
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        pass
`),
  "Add Binary": starter(`
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        pass
`),
  "Diameter of Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        pass
`),
  "Middle of the Linked List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass
`),
  "Maximum Depth of Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        pass
`),
  "Contains Duplicate": starter(`
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        pass
`),
  "Meeting Rooms": starter(`
from typing import List

class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        pass
`),
  "Roman to Integer": starter(`
class Solution:
    def romanToInt(self, s: str) -> int:
        pass
`),
  "Backspace String Compare": starter(`
class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        pass
`),
  "Counting Bits": starter(`
class Solution:
    def countBits(self, n: int) -> List[int]:
        pass
`),
  "Same Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        pass
`),
  "Number of 1 Bits": starter(`
class Solution:
    def hammingWeight(self, n: int) -> int:
        pass
`),
  "Longest Common Prefix": starter(`
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        pass
`),
  "Single Number": starter(`
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        pass
`),
  "Palindrome Linked List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def isPalindrome(self, head: Optional[ListNode]) -> bool:
        pass
`),
  "Move Zeroes": starter(`
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
`),
  "Symmetric Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        pass
`),
  "Missing Number": starter(`
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        pass
`),
  "Palindrome Number": starter(`
class Solution:
    def isPalindrome(self, x: int) -> bool:
        pass
`),
  "Convert Sorted Array to Binary Search Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        pass
`),
  "Reverse Bits": starter(`
class Solution:
    def reverseBits(self, n: int) -> int:
        pass
`),
  "Subtree of Another Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        pass
`),
  "Squares of a Sorted Array": starter(`
class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        pass
`),
  "Maximum Subarray": starter(`
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        pass
`),
  "Insert Interval": starter(`
class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        pass
`),
  "01 Matrix": starter(`
class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        pass
`),
  "K Closest Points to Origin": starter(`
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        pass
`),
  "Longest Substring Without Repeating Characters": starter(`
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass
`),
  "3Sum": starter(`
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        pass
`),
  "Binary Tree Level Order Traversal": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        pass
`),
  "Clone Graph": starter(`
"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

from typing import Optional
class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        pass
`),
  "Evaluate Reverse Polish Notation": starter(`
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        pass
`),
  "Course Schedule": starter(`
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        pass
`),
  "Implement Trie (Prefix Tree)": starter(`
class Trie:

    def __init__(self):
        pass


    def insert(self, word: str) -> None:
        pass


    def search(self, word: str) -> bool:
        pass


    def startsWith(self, prefix: str) -> bool:
        pass



# Your Trie object will be instantiated and called as such:
# obj = Trie()
# obj.insert(word)
# param_2 = obj.search(word)
# param_3 = obj.startsWith(prefix)
`),
  "Coin Change": starter(`
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        pass
`),
  "Product of Array Except Self": starter(`
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        pass
`),
  "Min Stack": starter(`
class MinStack:

    def __init__(self):
        pass


    def push(self, val: int) -> None:
        pass


    def pop(self) -> None:
        pass


    def top(self) -> int:
        pass


    def getMin(self) -> int:
        pass



# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(val)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()
`),
  "Validate Binary Search Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        pass
`),
  "Number of Islands": starter(`
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        pass
`),
  "Rotting Oranges": starter(`
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        pass
`),
  "Search in Rotated Sorted Array": starter(`
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        pass
`),
  "Combination Sum": starter(`
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        pass
`),
  "Permutations": starter(`
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        pass
`),
  "Merge Intervals": starter(`
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        pass
`),
  "Lowest Common Ancestor of a Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        pass
`),
  "Time Based Key-Value Store": starter(`
class TimeMap:

    def __init__(self):
        pass


    def set(self, key: str, value: str, timestamp: int) -> None:
        pass


    def get(self, key: str, timestamp: int) -> str:
        pass



# Your TimeMap object will be instantiated and called as such:
# obj = TimeMap()
# obj.set(key,value,timestamp)
# param_2 = obj.get(key,timestamp)
`),
  "Accounts Merge": starter(`
class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        pass
`),
  "Sort Colors": starter(`
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
`),
  "Word Break": starter(`
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        pass
`),
  "Partition Equal Subset Sum": starter(`
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        pass
`),
  "String to Integer (atoi)": starter(`
class Solution:
    def myAtoi(self, s: str) -> int:
        pass
`),
  "Spiral Matrix": starter(`
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        pass
`),
  "Subsets": starter(`
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        pass
`),
  "Binary Tree Right Side View": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        pass
`),
  "Longest Palindromic Substring": starter(`
class Solution:
    def longestPalindrome(self, s: str) -> str:
        pass
`),
  "Unique Paths": starter(`
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        pass
`),
  "Construct Binary Tree from Preorder and Inorder Traversal": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        pass
`),
  "Container With Most Water": starter(`
class Solution:
    def maxArea(self, height: List[int]) -> int:
        pass
`),
  "Letter Combinations of a Phone Number": starter(`
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        pass
`),
  "Word Search": starter(`
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        pass
`),
  "Find All Anagrams in a String": starter(`
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        pass
`),
  "Minimum Height Trees": starter(`
class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        pass
`),
  "Task Scheduler": starter(`
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        pass
`),
  "LRU Cache": starter(`
class LRUCache:

    def __init__(self, capacity: int):
        pass


    def get(self, key: int) -> int:
        pass


    def put(self, key: int, value: int) -> None:
        pass



# Your LRUCache object will be instantiated and called as such:
# obj = LRUCache(capacity)
# param_1 = obj.get(key)
# obj.put(key,value)
`),
  "Kth Smallest Element in a BST": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        pass
`),
  "Daily Temperatures": starter(`
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        pass
`),
  "House Robber": starter(`
class Solution:
    def rob(self, nums: List[int]) -> int:
        pass
`),
  "Gas Station": starter(`
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        pass
`),
  "Next Permutation": starter(`
class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
`),
  "Valid Sudoku": starter(`
class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        pass
`),
  "Group Anagrams": starter(`
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        pass
`),
  "Maximum Product Subarray": starter(`
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        pass
`),
  "Design Add and Search Words Data Structure": starter(`
class WordDictionary:

    def __init__(self):
        pass


    def addWord(self, word: str) -> None:
        pass


    def search(self, word: str) -> bool:
        pass



# Your WordDictionary object will be instantiated and called as such:
# obj = WordDictionary()
# obj.addWord(word)
# param_2 = obj.search(word)
`),
  "Pacific Atlantic Water Flow": starter(`
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        pass
`),
  "Remove Nth Node From End of List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        pass
`),
  "Shortest Path to Get Food": starter(`
from typing import List

class Solution:
    def getFood(self, grid: List[List[str]]) -> int:
        pass
`),
  "Find the Duplicate Number": starter(`
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        pass
`),
  "Top K Frequent Words": starter(`
class Solution:
    def topKFrequent(self, words: List[str], k: int) -> List[str]:
        pass
`),
  "Longest Increasing Subsequence": starter(`
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        pass
`),
  "Graph Valid Tree": starter(`
from typing import List

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        pass
`),
  "Course Schedule II": starter(`
class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        pass
`),
  "Swap Nodes in Pairs": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass
`),
  "Path Sum II": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
        pass
`),
  "Longest Consecutive Sequence": starter(`
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        pass
`),
  "Rotate Array": starter(`
class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
`),
  "Odd Even Linked List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass
`),
  "Decode String": starter(`
class Solution:
    def decodeString(self, s: str) -> str:
        pass
`),
  "Contiguous Array": starter(`
class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        pass
`),
  "Maximum Width of Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def widthOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        pass
`),
  "Find K Closest Elements": starter(`
class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        pass
`),
  "Longest Repeating Character Replacement": starter(`
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        pass
`),
  "Inorder Successor in BST": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def inorderSuccessor(self, root: 'TreeNode', p: 'TreeNode') -> 'TreeNode':
        pass
`),
  "Jump Game": starter(`
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        pass
`),
  "Add Two Numbers": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        pass
`),
  "Generate Parentheses": starter(`
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        pass
`),
  "Sort List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        pass
`),
  "Number of Connected Components in an Undirected Graph": starter(`
from typing import List

class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        pass
`),
  "Minimum Knight Moves": starter(`
class Solution:
    def minKnightMoves(self, x: int, y: int) -> int:
        pass
`),
  "Subarray Sum Equals K": starter(`
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        pass
`),
  "Asteroid Collision": starter(`
class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        pass
`),
  "Random Pick with Weight": starter(`
class Solution:

    def __init__(self, w: List[int]):
        pass


    def pickIndex(self) -> int:
        pass



# Your Solution object will be instantiated and called as such:
# obj = Solution(w)
# param_1 = obj.pickIndex()
`),
  "Kth Largest Element in an Array": starter(`
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        pass
`),
  "Maximal Square": starter(`
class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        pass
`),
  "Rotate Image": starter(`
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
`),
  "Binary Tree Zigzag Level Order Traversal": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        pass
`),
  "Design Hit Counter": starter(`
class HitCounter:

    def __init__(self):
        pass

    def hit(self, timestamp: int) -> None:
        pass

    def getHits(self, timestamp: int) -> int:
        pass
`),
  "Path Sum III": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        pass
`),
  "Pow(x, n)": starter(`
class Solution:
    def myPow(self, x: float, n: int) -> float:
        pass
`),
  "Search a 2D Matrix": starter(`
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        pass
`),
  "Largest Number": starter(`
class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        pass
`),
  "Decode Ways": starter(`
class Solution:
    def numDecodings(self, s: str) -> int:
        pass
`),
  "Meeting Rooms II": starter(`
from typing import List

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        pass
`),
  "Reverse Integer": starter(`
class Solution:
    def reverse(self, x: int) -> int:
        pass
`),
  "Set Matrix Zeroes": starter(`
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
`),
  "Reorder List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        """
        Do not return anything, modify head in-place instead.
        """
`),
  "Encode and Decode Strings": starter(`
from typing import List

class Codec:
    def encode(self, strs: List[str]) -> str:
        pass

    def decode(self, s: str) -> List[str]:
        pass
`),
  "Cheapest Flights Within K Stops": starter(`
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        pass
`),
  "All Nodes Distance K in Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
        pass
`),
  "3Sum Closest": starter(`
class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        pass
`),
  "Rotate List": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        pass
`),
  "Find Minimum in Rotated Sorted Array": starter(`
class Solution:
    def findMin(self, nums: List[int]) -> int:
        pass
`),
  "Basic Calculator II": starter(`
class Solution:
    def calculate(self, s: str) -> int:
        pass
`),
  "Combination Sum IV": starter(`
class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        pass
`),
  "Insert Delete GetRandom O(1)": starter(`
class RandomizedSet:

    def __init__(self):
        pass


    def insert(self, val: int) -> bool:
        pass


    def remove(self, val: int) -> bool:
        pass


    def getRandom(self) -> int:
        pass



# Your RandomizedSet object will be instantiated and called as such:
# obj = RandomizedSet()
# param_1 = obj.insert(val)
# param_2 = obj.remove(val)
# param_3 = obj.getRandom()
`),
  "Non-overlapping Intervals": starter(`
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        pass
`),
  "Minimum Window Substring": starter(`
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        pass
`),
  "Serialize and Deserialize Binary Tree": starter(`
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.

        :type root: TreeNode
        :rtype: str
        """


    def deserialize(self, data):
        """Decodes your encoded data to tree.

        :type data: str
        :rtype: TreeNode
        """


# Your Codec object will be instantiated and called as such:
# ser = Codec()
# deser = Codec()
# ans = deser.deserialize(ser.serialize(root))
`),
  "Trapping Rain Water": starter(`
class Solution:
    def trap(self, height: List[int]) -> int:
        pass
`),
  "Find Median from Data Stream": starter(`
class MedianFinder:

    def __init__(self):
        pass


    def addNum(self, num: int) -> None:
        pass


    def findMedian(self) -> float:
        pass



# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()
`),
  "Word Ladder": starter(`
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        pass
`),
  "Basic Calculator": starter(`
class Solution:
    def calculate(self, s: str) -> int:
        pass
`),
  "Maximum Profit in Job Scheduling": starter(`
class Solution:
    def jobScheduling(self, startTime: List[int], endTime: List[int], profit: List[int]) -> int:
        pass
`),
  "Merge k Sorted Lists": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        pass
`),
  "Largest Rectangle in Histogram": starter(`
class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        pass
`),
  "Binary Tree Maximum Path Sum": starter(`
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        pass
`),
  "Maximum Frequency Stack": starter(`
class FreqStack:

    def __init__(self):
        pass


    def push(self, val: int) -> None:
        pass


    def pop(self) -> int:
        pass



# Your FreqStack object will be instantiated and called as such:
# obj = FreqStack()
# obj.push(val)
# param_2 = obj.pop()
`),
  "Median of Two Sorted Arrays": starter(`
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        pass
`),
  "Longest Increasing Path in a Matrix": starter(`
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        pass
`),
  "Longest Valid Parentheses": starter(`
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        pass
`),
  "Design In-Memory File System": starter(`
from typing import List

class FileSystem:

    def __init__(self):
        pass

    def ls(self, path: str) -> List[str]:
        pass

    def mkdir(self, path: str) -> None:
        pass

    def addContentToFile(self, filePath: str, content: str) -> None:
        pass

    def readContentFromFile(self, filePath: str) -> str:
        pass
`),
  "Employee Free Time": starter(`
from typing import List

# Definition for an Interval.
# class Interval:
#     def __init__(self, start: int = None, end: int = None):
#         self.start = start
#         self.end = end

class Solution:
    def employeeFreeTime(self, schedule: '[[Interval]]') -> '[Interval]':
        pass
`),
  "Word Search II": starter(`
class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        pass
`),
  "Alien Dictionary": starter(`
from typing import List

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        pass
`),
  "Bus Routes": starter(`
class Solution:
    def numBusesToDestination(self, routes: List[List[int]], source: int, target: int) -> int:
        pass
`),
  "Sliding Window Maximum": starter(`
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        pass
`),
  "Palindrome Pairs": starter(`
class Solution:
    def palindromePairs(self, words: List[str]) -> List[List[int]]:
        pass
`),
  "Reverse Nodes in k-Group": starter(`
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        pass
`),
  "Sudoku Solver": starter(`
class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """
`),
  "First Missing Positive": starter(`
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        pass
`),
  "N-Queens": starter(`
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        pass
`),
  "Smallest Range Covering Elements from K Lists": starter(`
class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        pass
`)
};

module.exports = { leetcodeStarters };
