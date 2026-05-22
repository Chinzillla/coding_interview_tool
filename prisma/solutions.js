function sol(code) {
  return code.trim();
}

const solutions = {
  "Two Sum": sol(`
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        value_to_index = {}

        for current_index, current_value in enumerate(nums):
            needed_value = target - current_value
            if needed_value in value_to_index:
                return [value_to_index[needed_value], current_index]
            value_to_index[current_value] = current_index

        return []
`),

  "Valid Parentheses": sol(`
class Solution:
    def isValid(self, s: str) -> bool:
        matching_open = {")": "(", "]": "[", "}": "{"}
        stack = []

        for character in s:
            if character in matching_open:
                if not stack or stack.pop() != matching_open[character]:
                    return False
            else:
                stack.append(character)

        return not stack
`),

  "Merge Two Sorted Lists": sol(`
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeTwoLists(self, list1, list2):
        sentinel = ListNode()
        write_node = sentinel

        while list1 and list2:
            if list1.val <= list2.val:
                write_node.next = list1
                list1 = list1.next
            else:
                write_node.next = list2
                list2 = list2.next
            write_node = write_node.next

        write_node.next = list1 or list2
        return sentinel.next
`),

  "Best Time to Buy and Sell Stock": sol(`
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        lowest_buy_price = float("inf")
        best_profit = 0

        for price in prices:
            lowest_buy_price = min(lowest_buy_price, price)
            best_profit = max(best_profit, price - lowest_buy_price)

        return best_profit
`),

  "Valid Palindrome": sol(`
class Solution:
    def isPalindrome(self, s: str) -> bool:
        left_index = 0
        right_index = len(s) - 1

        while left_index < right_index:
            while left_index < right_index and not s[left_index].isalnum():
                left_index += 1
            while left_index < right_index and not s[right_index].isalnum():
                right_index -= 1

            if s[left_index].lower() != s[right_index].lower():
                return False

            left_index += 1
            right_index -= 1

        return True
`),

  "Invert Binary Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root):
        if not root:
            return None

        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
`),

  "Valid Anagram": sol(`
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
`),

  "Binary Search": sol(`
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left_index = 0
        right_index = len(nums) - 1

        while left_index <= right_index:
            middle_index = (left_index + right_index) // 2
            if nums[middle_index] == target:
                return middle_index
            if nums[middle_index] < target:
                left_index = middle_index + 1
            else:
                right_index = middle_index - 1

        return -1
`),

  "Flood Fill": sol(`
from typing import List

class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        original_color = image[sr][sc]
        if original_color == color:
            return image

        row_count = len(image)
        col_count = len(image[0])

        def paint(row: int, col: int) -> None:
            if row < 0 or row == row_count or col < 0 or col == col_count:
                return
            if image[row][col] != original_color:
                return

            image[row][col] = color
            paint(row + 1, col)
            paint(row - 1, col)
            paint(row, col + 1)
            paint(row, col - 1)

        paint(sr, sc)
        return image
`),

  "Lowest Common Ancestor of a Binary Search Tree": sol(`
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root, p, q):
        current_node = root
        lower_value = min(p.val, q.val)
        higher_value = max(p.val, q.val)

        while current_node:
            if higher_value < current_node.val:
                current_node = current_node.left
            elif lower_value > current_node.val:
                current_node = current_node.right
            else:
                return current_node
`),

  "Balanced Binary Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isBalanced(self, root) -> bool:
        def height_or_unbalanced(node):
            if not node:
                return 0

            left_height = height_or_unbalanced(node.left)
            if left_height == -1:
                return -1

            right_height = height_or_unbalanced(node.right)
            if right_height == -1:
                return -1

            if abs(left_height - right_height) > 1:
                return -1

            return 1 + max(left_height, right_height)

        return height_or_unbalanced(root) != -1
`),

  "Linked List Cycle": sol(`
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def hasCycle(self, head) -> bool:
        slow_node = head
        fast_node = head

        while fast_node and fast_node.next:
            slow_node = slow_node.next
            fast_node = fast_node.next.next
            if slow_node is fast_node:
                return True

        return False
`),

  "Implement Queue using Stacks": sol(`
class MyQueue:
    def __init__(self):
        self.input_stack = []
        self.output_stack = []

    def push(self, x: int) -> None:
        self.input_stack.append(x)

    def pop(self) -> int:
        self.peek()
        return self.output_stack.pop()

    def peek(self) -> int:
        if not self.output_stack:
            while self.input_stack:
                self.output_stack.append(self.input_stack.pop())
        return self.output_stack[-1]

    def empty(self) -> bool:
        return not self.input_stack and not self.output_stack
`),

  "First Bad Version": sol(`
# The isBadVersion API is already defined for you.
# def isBadVersion(version: int) -> bool:

class Solution:
    def firstBadVersion(self, n: int) -> int:
        left_version = 1
        right_version = n

        while left_version < right_version:
            middle_version = (left_version + right_version) // 2
            if isBadVersion(middle_version):
                right_version = middle_version
            else:
                left_version = middle_version + 1

        return left_version
`),

  "Ransom Note": sol(`
from collections import Counter

class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        available_letters = Counter(magazine)

        for letter in ransomNote:
            if available_letters[letter] == 0:
                return False
            available_letters[letter] -= 1

        return True
`),

  "Climbing Stairs": sol(`
class Solution:
    def climbStairs(self, n: int) -> int:
        one_step_before = 1
        two_steps_before = 1

        for _ in range(2, n + 1):
            one_step_before, two_steps_before = one_step_before + two_steps_before, one_step_before

        return one_step_before
`),

  "Longest Palindrome": sol(`
from collections import Counter

class Solution:
    def longestPalindrome(self, s: str) -> int:
        length = 0
        has_center_character = False

        for count in Counter(s).values():
            length += (count // 2) * 2
            if count % 2:
                has_center_character = True

        return length + int(has_center_character)
`),

  "Reverse Linked List": sol(`
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head):
        previous_node = None
        current_node = head

        while current_node:
            next_node = current_node.next
            current_node.next = previous_node
            previous_node = current_node
            current_node = next_node

        return previous_node
`),

  "Majority Element": sol(`
from typing import List

class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate = None
        balance = 0

        for number in nums:
            if balance == 0:
                candidate = number
            balance += 1 if number == candidate else -1

        return candidate
`),

  "Add Binary": sol(`
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        left_index = len(a) - 1
        right_index = len(b) - 1
        carry = 0
        digits = []

        while left_index >= 0 or right_index >= 0 or carry:
            total = carry
            if left_index >= 0:
                total += ord(a[left_index]) - ord("0")
                left_index -= 1
            if right_index >= 0:
                total += ord(b[right_index]) - ord("0")
                right_index -= 1

            digits.append(str(total % 2))
            carry = total // 2

        return "".join(reversed(digits))
`),

  "Diameter of Binary Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def diameterOfBinaryTree(self, root) -> int:
        longest_path_edges = 0

        def height(node):
            nonlocal longest_path_edges
            if not node:
                return 0

            left_height = height(node.left)
            right_height = height(node.right)
            longest_path_edges = max(longest_path_edges, left_height + right_height)
            return 1 + max(left_height, right_height)

        height(root)
        return longest_path_edges
`),

  "Middle of the Linked List": sol(`
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def middleNode(self, head):
        slow_node = head
        fast_node = head

        while fast_node and fast_node.next:
            slow_node = slow_node.next
            fast_node = fast_node.next.next

        return slow_node
`),

  "Maximum Depth of Binary Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
`),

  "Contains Duplicate": sol(`
from typing import List

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        return len(nums) != len(set(nums))
`),

  "Meeting Rooms": sol(`
from typing import List

class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        intervals.sort(key=lambda interval: interval[0])

        for index in range(1, len(intervals)):
            if intervals[index][0] < intervals[index - 1][1]:
                return False

        return True
`),

  "Roman to Integer": sol(`
class Solution:
    def romanToInt(self, s: str) -> int:
        value_by_symbol = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
        total = 0

        for index, symbol in enumerate(s):
            value = value_by_symbol[symbol]
            if index + 1 < len(s) and value < value_by_symbol[s[index + 1]]:
                total -= value
            else:
                total += value

        return total
`),

  "Backspace String Compare": sol(`
class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        def next_valid_index(text, index):
            backspaces = 0
            while index >= 0:
                if text[index] == "#":
                    backspaces += 1
                    index -= 1
                elif backspaces:
                    backspaces -= 1
                    index -= 1
                else:
                    return index
            return -1

        s_index = len(s) - 1
        t_index = len(t) - 1

        while s_index >= 0 or t_index >= 0:
            s_index = next_valid_index(s, s_index)
            t_index = next_valid_index(t, t_index)

            if s_index < 0 or t_index < 0:
                return s_index == t_index
            if s[s_index] != t[t_index]:
                return False

            s_index -= 1
            t_index -= 1

        return True
`),

  "Counting Bits": sol(`
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        bit_counts = [0] * (n + 1)

        for number in range(1, n + 1):
            bit_counts[number] = bit_counts[number >> 1] + (number & 1)

        return bit_counts
`),

  "Same Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSameTree(self, p, q) -> bool:
        if not p or not q:
            return p is q
        return (
            p.val == q.val
            and self.isSameTree(p.left, q.left)
            and self.isSameTree(p.right, q.right)
        )
`),

  "Number of 1 Bits": sol(`
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0

        while n:
            n &= n - 1
            count += 1

        return count
`),

  "Longest Common Prefix": sol(`
from typing import List

class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""

        for index, character in enumerate(strs[0]):
            for word in strs[1:]:
                if index == len(word) or word[index] != character:
                    return strs[0][:index]

        return strs[0]
`),

  "Single Number": sol(`
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        answer = 0
        for number in nums:
            answer ^= number
        return answer
`),

  "Palindrome Linked List": sol(`
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def isPalindrome(self, head) -> bool:
        slow_node = head
        fast_node = head

        while fast_node and fast_node.next:
            slow_node = slow_node.next
            fast_node = fast_node.next.next

        previous_node = None
        while slow_node:
            next_node = slow_node.next
            slow_node.next = previous_node
            previous_node = slow_node
            slow_node = next_node

        left_node = head
        right_node = previous_node
        while right_node:
            if left_node.val != right_node.val:
                return False
            left_node = left_node.next
            right_node = right_node.next

        return True
`),

  "Move Zeroes": sol(`
from typing import List

class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        write_index = 0

        for read_index, value in enumerate(nums):
            if value != 0:
                nums[write_index], nums[read_index] = nums[read_index], nums[write_index]
                write_index += 1
`),

  "Symmetric Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSymmetric(self, root) -> bool:
        def mirrors(left_node, right_node):
            if not left_node or not right_node:
                return left_node is right_node
            return (
                left_node.val == right_node.val
                and mirrors(left_node.left, right_node.right)
                and mirrors(left_node.right, right_node.left)
            )

        return mirrors(root.left, root.right) if root else True
`),

  "Missing Number": sol(`
from typing import List

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        missing_value = len(nums)

        for index, number in enumerate(nums):
            missing_value ^= index
            missing_value ^= number

        return missing_value
`),

  "Palindrome Number": sol(`
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False

        reversed_right_half = 0
        while x > reversed_right_half:
            reversed_right_half = reversed_right_half * 10 + x % 10
            x //= 10

        return x == reversed_right_half or x == reversed_right_half // 10
`),

  "Convert Sorted Array to Binary Search Tree": sol(`
from typing import List

# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def sortedArrayToBST(self, nums: List[int]):
        def build(left_index, right_index):
            if left_index > right_index:
                return None

            middle_index = (left_index + right_index) // 2
            root = TreeNode(nums[middle_index])
            root.left = build(left_index, middle_index - 1)
            root.right = build(middle_index + 1, right_index)
            return root

        return build(0, len(nums) - 1)
`),

  "Reverse Bits": sol(`
class Solution:
    def reverseBits(self, n: int) -> int:
        reversed_value = 0

        for _ in range(32):
            reversed_value = (reversed_value << 1) | (n & 1)
            n >>= 1

        return reversed_value
`),

  "Subtree of Another Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSubtree(self, root, subRoot) -> bool:
        def same_tree(first, second):
            if not first or not second:
                return first is second
            return (
                first.val == second.val
                and same_tree(first.left, second.left)
                and same_tree(first.right, second.right)
            )

        if not root:
            return False
        return same_tree(root, subRoot) or self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)
`),

  "Squares of a Sorted Array": sol(`
from typing import List

class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        left_index = 0
        right_index = len(nums) - 1
        write_index = len(nums) - 1
        squares = [0] * len(nums)

        while left_index <= right_index:
            left_square = nums[left_index] * nums[left_index]
            right_square = nums[right_index] * nums[right_index]
            if left_square > right_square:
                squares[write_index] = left_square
                left_index += 1
            else:
                squares[write_index] = right_square
                right_index -= 1
            write_index -= 1

        return squares
`),

  "Maximum Subarray": sol(`
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        best_ending_here = nums[0]
        best_seen = nums[0]

        for number in nums[1:]:
            best_ending_here = max(number, best_ending_here + number)
            best_seen = max(best_seen, best_ending_here)

        return best_seen
`),

  "Insert Interval": sol(`
from typing import List

class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        merged_intervals = []
        index = 0

        while index < len(intervals) and intervals[index][1] < newInterval[0]:
            merged_intervals.append(intervals[index])
            index += 1

        while index < len(intervals) and intervals[index][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[index][0])
            newInterval[1] = max(newInterval[1], intervals[index][1])
            index += 1

        merged_intervals.append(newInterval)
        merged_intervals.extend(intervals[index:])
        return merged_intervals
`),

  "01 Matrix": sol(`
from collections import deque
from typing import List

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        row_count = len(mat)
        col_count = len(mat[0])
        queue = deque()

        for row in range(row_count):
            for col in range(col_count):
                if mat[row][col] == 0:
                    queue.append((row, col))
                else:
                    mat[row][col] = float("inf")

        while queue:
            row, col = queue.popleft()
            for row_delta, col_delta in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_delta
                next_col = col + col_delta
                if 0 <= next_row < row_count and 0 <= next_col < col_count and mat[next_row][next_col] > mat[row][col] + 1:
                    mat[next_row][next_col] = mat[row][col] + 1
                    queue.append((next_row, next_col))

        return mat
`),

  "K Closest Points to Origin": sol(`
from typing import List
import heapq

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        return heapq.nsmallest(k, points, key=lambda point: point[0] * point[0] + point[1] * point[1])
`),

  "Longest Substring Without Repeating Characters": sol(`
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_seen_index = {}
        left_index = 0
        best_length = 0

        for right_index, character in enumerate(s):
            if character in last_seen_index and last_seen_index[character] >= left_index:
                left_index = last_seen_index[character] + 1

            last_seen_index[character] = right_index
            best_length = max(best_length, right_index - left_index + 1)

        return best_length
`),

  "3Sum": sol(`
from typing import List

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        triplets = []

        for anchor_index in range(len(nums) - 2):
            if anchor_index > 0 and nums[anchor_index] == nums[anchor_index - 1]:
                continue
            if nums[anchor_index] > 0:
                break

            left_index = anchor_index + 1
            right_index = len(nums) - 1

            while left_index < right_index:
                total = nums[anchor_index] + nums[left_index] + nums[right_index]
                if total == 0:
                    triplets.append([nums[anchor_index], nums[left_index], nums[right_index]])
                    left_index += 1
                    right_index -= 1
                    while left_index < right_index and nums[left_index] == nums[left_index - 1]:
                        left_index += 1
                    while left_index < right_index and nums[right_index] == nums[right_index + 1]:
                        right_index -= 1
                elif total < 0:
                    left_index += 1
                else:
                    right_index -= 1

        return triplets
`),

  "Binary Tree Level Order Traversal": sol(`
from collections import deque
from typing import List

# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def levelOrder(self, root) -> List[List[int]]:
        if not root:
            return []

        levels = []
        queue = deque([root])

        while queue:
            level_values = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level_values.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            levels.append(level_values)

        return levels
`),

  "Clone Graph": sol(`
# class Node:
#     def __init__(self, val = 0, neighbors = None):
#         self.val = val
#         self.neighbors = neighbors if neighbors is not None else []

class Solution:
    def cloneGraph(self, node):
        if not node:
            return None

        cloned_by_original = {}

        def clone(original_node):
            if original_node in cloned_by_original:
                return cloned_by_original[original_node]

            cloned_node = Node(original_node.val)
            cloned_by_original[original_node] = cloned_node
            cloned_node.neighbors = [clone(neighbor) for neighbor in original_node.neighbors]
            return cloned_node

        return clone(node)
`),

  "Evaluate Reverse Polish Notation": sol(`
from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []

        for token in tokens:
            if token not in {"+", "-", "*", "/"}:
                stack.append(int(token))
                continue

            right_value = stack.pop()
            left_value = stack.pop()
            if token == "+":
                stack.append(left_value + right_value)
            elif token == "-":
                stack.append(left_value - right_value)
            elif token == "*":
                stack.append(left_value * right_value)
            else:
                stack.append(int(left_value / right_value))

        return stack[-1]
`),

  "Course Schedule": sol(`
from collections import deque
from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses

        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1

        queue = deque(course for course in range(numCourses) if indegree[course] == 0)
        completed_courses = 0

        while queue:
            prerequisite = queue.popleft()
            completed_courses += 1
            for course in graph[prerequisite]:
                indegree[course] -= 1
                if indegree[course] == 0:
                    queue.append(course)

        return completed_courses == numCourses
`),

  "Implement Trie (Prefix Tree)": sol(`
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        current_node = self.root
        for character in word:
            current_node = current_node.children.setdefault(character, TrieNode())
        current_node.is_word = True

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return bool(node and node.is_word)

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def _walk(self, text: str):
        current_node = self.root
        for character in text:
            if character not in current_node.children:
                return None
            current_node = current_node.children[character]
        return current_node
`),

  "Coin Change": sol(`
from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        fewest_coins = [amount + 1] * (amount + 1)
        fewest_coins[0] = 0

        for current_amount in range(1, amount + 1):
            for coin in coins:
                if coin <= current_amount:
                    fewest_coins[current_amount] = min(
                        fewest_coins[current_amount],
                        fewest_coins[current_amount - coin] + 1
                    )

        return fewest_coins[amount] if fewest_coins[amount] <= amount else -1
`),

  "Product of Array Except Self": sol(`
from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        products = [1] * len(nums)
        prefix_product = 1

        for index, number in enumerate(nums):
            products[index] = prefix_product
            prefix_product *= number

        suffix_product = 1
        for index in range(len(nums) - 1, -1, -1):
            products[index] *= suffix_product
            suffix_product *= nums[index]

        return products
`),

  "Min Stack": sol(`
class MinStack:
    def __init__(self):
        self.values = []
        self.minimums = []

    def push(self, val: int) -> None:
        self.values.append(val)
        if not self.minimums or val <= self.minimums[-1]:
            self.minimums.append(val)

    def pop(self) -> None:
        removed_value = self.values.pop()
        if removed_value == self.minimums[-1]:
            self.minimums.pop()

    def top(self) -> int:
        return self.values[-1]

    def getMin(self) -> int:
        return self.minimums[-1]
`),

  "Validate Binary Search Tree": sol(`
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isValidBST(self, root) -> bool:
        def valid(node, lower_bound, upper_bound):
            if not node:
                return True
            if not lower_bound < node.val < upper_bound:
                return False
            return valid(node.left, lower_bound, node.val) and valid(node.right, node.val, upper_bound)

        return valid(root, float("-inf"), float("inf"))
`),

  "Number of Islands": sol(`
from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        row_count = len(grid)
        col_count = len(grid[0])
        island_count = 0

        def sink(row, col):
            if row < 0 or row == row_count or col < 0 or col == col_count or grid[row][col] != "1":
                return
            grid[row][col] = "0"
            sink(row + 1, col)
            sink(row - 1, col)
            sink(row, col + 1)
            sink(row, col - 1)

        for row in range(row_count):
            for col in range(col_count):
                if grid[row][col] == "1":
                    island_count += 1
                    sink(row, col)

        return island_count
`),

  "Rotting Oranges": sol(`
from collections import deque
from typing import List

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        row_count = len(grid)
        col_count = len(grid[0])
        fresh_count = 0
        queue = deque()

        for row in range(row_count):
            for col in range(col_count):
                if grid[row][col] == 2:
                    queue.append((row, col, 0))
                elif grid[row][col] == 1:
                    fresh_count += 1

        elapsed_minutes = 0
        while queue:
            row, col, elapsed_minutes = queue.popleft()
            for row_delta, col_delta in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_delta
                next_col = col + col_delta
                if 0 <= next_row < row_count and 0 <= next_col < col_count and grid[next_row][next_col] == 1:
                    grid[next_row][next_col] = 2
                    fresh_count -= 1
                    queue.append((next_row, next_col, elapsed_minutes + 1))

        return elapsed_minutes if fresh_count == 0 else -1
`),

  "Search in Rotated Sorted Array": sol(`
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left_index = 0
        right_index = len(nums) - 1

        while left_index <= right_index:
            middle_index = (left_index + right_index) // 2
            if nums[middle_index] == target:
                return middle_index

            if nums[left_index] <= nums[middle_index]:
                if nums[left_index] <= target < nums[middle_index]:
                    right_index = middle_index - 1
                else:
                    left_index = middle_index + 1
            else:
                if nums[middle_index] < target <= nums[right_index]:
                    left_index = middle_index + 1
                else:
                    right_index = middle_index - 1

        return -1
`),

  "Combination Sum": sol(`
from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        combinations = []
        current_combination = []

        def backtrack(start_index, remaining):
            if remaining == 0:
                combinations.append(current_combination[:])
                return

            for index in range(start_index, len(candidates)):
                candidate = candidates[index]
                if candidate > remaining:
                    break
                current_combination.append(candidate)
                backtrack(index, remaining - candidate)
                current_combination.pop()

        backtrack(0, target)
        return combinations
`),

  "Permutations": sol(`
from typing import List

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        permutations = []

        def backtrack(first_index):
            if first_index == len(nums):
                permutations.append(nums[:])
                return

            for index in range(first_index, len(nums)):
                nums[first_index], nums[index] = nums[index], nums[first_index]
                backtrack(first_index + 1)
                nums[first_index], nums[index] = nums[index], nums[first_index]

        backtrack(0)
        return permutations
`),

  "Merge Intervals": sol(`
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda interval: interval[0])
        merged = []

        for start, end in intervals:
            if not merged or start > merged[-1][1]:
                merged.append([start, end])
            else:
                merged[-1][1] = max(merged[-1][1], end)

        return merged
`),

  "Lowest Common Ancestor of a Binary Tree": sol(`
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if not root or root is p or root is q:
            return root

        left_answer = self.lowestCommonAncestor(root.left, p, q)
        right_answer = self.lowestCommonAncestor(root.right, p, q)

        if left_answer and right_answer:
            return root
        return left_answer or right_answer
`),

  "Time Based Key-Value Store": sol(`
from collections import defaultdict
import bisect

class TimeMap:
    def __init__(self):
        self.entries_by_key = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.entries_by_key[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.entries_by_key[key]
        index = bisect.bisect_right(entries, (timestamp, chr(255))) - 1
        return entries[index][1] if index >= 0 else ""
`),

  "Accounts Merge": sol(`
from collections import defaultdict
from typing import List

class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        parent_by_email = {}
        name_by_email = {}

        def find(email):
            parent_by_email.setdefault(email, email)
            if parent_by_email[email] != email:
                parent_by_email[email] = find(parent_by_email[email])
            return parent_by_email[email]

        def union(first_email, second_email):
            parent_by_email[find(second_email)] = find(first_email)

        for account in accounts:
            name = account[0]
            first_email = account[1]
            for email in account[1:]:
                name_by_email[email] = name
                union(first_email, email)

        emails_by_root = defaultdict(list)
        for email in name_by_email:
            emails_by_root[find(email)].append(email)

        return [[name_by_email[root], *sorted(emails)] for root, emails in emails_by_root.items()]
`),

  "Sort Colors": sol(`
from typing import List

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        next_zero_index = 0
        current_index = 0
        next_two_index = len(nums) - 1

        while current_index <= next_two_index:
            if nums[current_index] == 0:
                nums[next_zero_index], nums[current_index] = nums[current_index], nums[next_zero_index]
                next_zero_index += 1
                current_index += 1
            elif nums[current_index] == 2:
                nums[next_two_index], nums[current_index] = nums[current_index], nums[next_two_index]
                next_two_index -= 1
            else:
                current_index += 1
`),

  "Word Break": sol(`
from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        can_segment = [False] * (len(s) + 1)
        can_segment[0] = True

        for end_index in range(1, len(s) + 1):
            for start_index in range(end_index):
                if can_segment[start_index] and s[start_index:end_index] in words:
                    can_segment[end_index] = True
                    break

        return can_segment[-1]
`),

  "Partition Equal Subset Sum": sol(`
from typing import List

class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total_sum = sum(nums)
        if total_sum % 2:
            return False

        target = total_sum // 2
        reachable_sums = {0}

        for number in nums:
            reachable_sums |= {number + current for current in reachable_sums if number + current <= target}
            if target in reachable_sums:
                return True

        return False
`),

  "String to Integer (atoi)": sol(`
class Solution:
    def myAtoi(self, s: str) -> int:
        index = 0
        while index < len(s) and s[index] == " ":
            index += 1

        sign = 1
        if index < len(s) and s[index] in "+-":
            sign = -1 if s[index] == "-" else 1
            index += 1

        value = 0
        while index < len(s) and s[index].isdigit():
            value = value * 10 + ord(s[index]) - ord("0")
            index += 1

        value *= sign
        return max(-(2 ** 31), min(2 ** 31 - 1, value))
`),

  "Spiral Matrix": sol(`
from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        top_row = 0
        bottom_row = len(matrix) - 1
        left_col = 0
        right_col = len(matrix[0]) - 1
        order = []

        while top_row <= bottom_row and left_col <= right_col:
            for col in range(left_col, right_col + 1):
                order.append(matrix[top_row][col])
            top_row += 1

            for row in range(top_row, bottom_row + 1):
                order.append(matrix[row][right_col])
            right_col -= 1

            if top_row <= bottom_row:
                for col in range(right_col, left_col - 1, -1):
                    order.append(matrix[bottom_row][col])
                bottom_row -= 1

            if left_col <= right_col:
                for row in range(bottom_row, top_row - 1, -1):
                    order.append(matrix[row][left_col])
                left_col += 1

        return order
`),

  "Subsets": sol(`
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        all_subsets = [[]]

        for number in nums:
            all_subsets += [subset + [number] for subset in all_subsets]

        return all_subsets
`),

  "Binary Tree Right Side View": sol(`
from collections import deque
from typing import List

class Solution:
    def rightSideView(self, root) -> List[int]:
        if not root:
            return []

        view = []
        queue = deque([root])

        while queue:
            for index in range(len(queue)):
                node = queue.popleft()
                if index == 0:
                    view.append(node.val)
                if node.right:
                    queue.append(node.right)
                if node.left:
                    queue.append(node.left)

        return view
`),

  "Longest Palindromic Substring": sol(`
class Solution:
    def longestPalindrome(self, s: str) -> str:
        best_left = 0
        best_right = 0

        def expand(left_index, right_index):
            while left_index >= 0 and right_index < len(s) and s[left_index] == s[right_index]:
                left_index -= 1
                right_index += 1
            return left_index + 1, right_index - 1

        for center_index in range(len(s)):
            odd_left, odd_right = expand(center_index, center_index)
            even_left, even_right = expand(center_index, center_index + 1)

            if odd_right - odd_left > best_right - best_left:
                best_left, best_right = odd_left, odd_right
            if even_right - even_left > best_right - best_left:
                best_left, best_right = even_left, even_right

        return s[best_left:best_right + 1]
`),

  "Unique Paths": sol(`
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row_counts = [1] * n

        for _ in range(1, m):
            for col in range(1, n):
                row_counts[col] += row_counts[col - 1]

        return row_counts[-1]
`),

  "Construct Binary Tree from Preorder and Inorder Traversal": sol(`
from typing import List

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]):
        inorder_index_by_value = {value: index for index, value in enumerate(inorder)}
        preorder_index = 0

        def build(left_index, right_index):
            nonlocal preorder_index
            if left_index > right_index:
                return None

            root_value = preorder[preorder_index]
            preorder_index += 1
            root = TreeNode(root_value)
            middle_index = inorder_index_by_value[root_value]
            root.left = build(left_index, middle_index - 1)
            root.right = build(middle_index + 1, right_index)
            return root

        return build(0, len(inorder) - 1)
`),

  "Container With Most Water": sol(`
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        left_index = 0
        right_index = len(height) - 1
        best_area = 0

        while left_index < right_index:
            width = right_index - left_index
            best_area = max(best_area, width * min(height[left_index], height[right_index]))
            if height[left_index] < height[right_index]:
                left_index += 1
            else:
                right_index -= 1

        return best_area
`),

  "Letter Combinations of a Phone Number": sol(`
from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits:
            return []

        letters_by_digit = {
            "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
            "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"
        }
        combinations = [""]

        for digit in digits:
            combinations = [prefix + letter for prefix in combinations for letter in letters_by_digit[digit]]

        return combinations
`),

  "Word Search": sol(`
from typing import List

class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        row_count = len(board)
        col_count = len(board[0])

        def search(row, col, word_index):
            if word_index == len(word):
                return True
            if row < 0 or row == row_count or col < 0 or col == col_count or board[row][col] != word[word_index]:
                return False

            saved_character = board[row][col]
            board[row][col] = "#"
            found = (
                search(row + 1, col, word_index + 1)
                or search(row - 1, col, word_index + 1)
                or search(row, col + 1, word_index + 1)
                or search(row, col - 1, word_index + 1)
            )
            board[row][col] = saved_character
            return found

        return any(search(row, col, 0) for row in range(row_count) for col in range(col_count))
`),

  "Find All Anagrams in a String": sol(`
from collections import Counter
from typing import List

class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        if len(p) > len(s):
            return []

        target_counts = Counter(p)
        window_counts = Counter(s[:len(p)])
        starts = []

        if window_counts == target_counts:
            starts.append(0)

        for right_index in range(len(p), len(s)):
            left_character = s[right_index - len(p)]
            window_counts[left_character] -= 1
            if window_counts[left_character] == 0:
                del window_counts[left_character]
            window_counts[s[right_index]] += 1
            if window_counts == target_counts:
                starts.append(right_index - len(p) + 1)

        return starts
`),

  "Minimum Height Trees": sol(`
from collections import deque
from typing import List

class Solution:
    def findMinHeightTrees(self, n: int, edges: List[List[int]]) -> List[int]:
        if n == 1:
            return [0]

        graph = [set() for _ in range(n)]
        for first_node, second_node in edges:
            graph[first_node].add(second_node)
            graph[second_node].add(first_node)

        leaves = deque(node for node in range(n) if len(graph[node]) == 1)
        remaining_nodes = n

        while remaining_nodes > 2:
            remaining_nodes -= len(leaves)
            for _ in range(len(leaves)):
                leaf = leaves.popleft()
                neighbor = graph[leaf].pop()
                graph[neighbor].remove(leaf)
                if len(graph[neighbor]) == 1:
                    leaves.append(neighbor)

        return list(leaves)
`),

  "Task Scheduler": sol(`
from collections import Counter
from typing import List

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        frequencies = Counter(tasks).values()
        max_frequency = max(frequencies)
        max_frequency_tasks = sum(1 for frequency in frequencies if frequency == max_frequency)
        frame_length = (max_frequency - 1) * (n + 1) + max_frequency_tasks
        return max(len(tasks), frame_length)
`),

  "LRU Cache": sol(`
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.values = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.values:
            return -1
        self.values.move_to_end(key)
        return self.values[key]

    def put(self, key: int, value: int) -> None:
        if key in self.values:
            self.values.move_to_end(key)
        self.values[key] = value
        if len(self.values) > self.capacity:
            self.values.popitem(last=False)
`),

  "Kth Smallest Element in a BST": sol(`
class Solution:
    def kthSmallest(self, root, k: int) -> int:
        stack = []
        current_node = root

        while current_node or stack:
            while current_node:
                stack.append(current_node)
                current_node = current_node.left

            current_node = stack.pop()
            k -= 1
            if k == 0:
                return current_node.val
            current_node = current_node.right
`),

  "Daily Temperatures": sol(`
from typing import List

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        waits = [0] * len(temperatures)
        decreasing_stack = []

        for current_day, current_temp in enumerate(temperatures):
            while decreasing_stack and temperatures[decreasing_stack[-1]] < current_temp:
                colder_day = decreasing_stack.pop()
                waits[colder_day] = current_day - colder_day
            decreasing_stack.append(current_day)

        return waits
`),

  "House Robber": sol(`
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        best_without_current = 0
        best_with_previous = 0

        for money in nums:
            best_without_current, best_with_previous = (
                best_with_previous,
                max(best_with_previous, best_without_current + money)
            )

        return best_with_previous
`),

  "Gas Station": sol(`
from typing import List

class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if sum(gas) < sum(cost):
            return -1

        start_index = 0
        tank_balance = 0

        for index in range(len(gas)):
            tank_balance += gas[index] - cost[index]
            if tank_balance < 0:
                start_index = index + 1
                tank_balance = 0

        return start_index
`),

  "Next Permutation": sol(`
from typing import List

class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        pivot_index = len(nums) - 2
        while pivot_index >= 0 and nums[pivot_index] >= nums[pivot_index + 1]:
            pivot_index -= 1

        if pivot_index >= 0:
            swap_index = len(nums) - 1
            while nums[swap_index] <= nums[pivot_index]:
                swap_index -= 1
            nums[pivot_index], nums[swap_index] = nums[swap_index], nums[pivot_index]

        nums[pivot_index + 1:] = reversed(nums[pivot_index + 1:])
`),

  "Valid Sudoku": sol(`
from typing import List

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        seen = set()

        for row in range(9):
            for col in range(9):
                value = board[row][col]
                if value == ".":
                    continue

                row_key = ("row", row, value)
                col_key = ("col", col, value)
                box_key = ("box", row // 3, col // 3, value)
                if row_key in seen or col_key in seen or box_key in seen:
                    return False
                seen.update((row_key, col_key, box_key))

        return True
`),

  "Group Anagrams": sol(`
from collections import defaultdict
from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)

        for word in strs:
            counts = [0] * 26
            for character in word:
                counts[ord(character) - ord("a")] += 1
            groups[tuple(counts)].append(word)

        return list(groups.values())
`),

  "Maximum Product Subarray": sol(`
from typing import List

class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        best_here = nums[0]
        worst_here = nums[0]
        best_product = nums[0]

        for number in nums[1:]:
            if number < 0:
                best_here, worst_here = worst_here, best_here
            best_here = max(number, best_here * number)
            worst_here = min(number, worst_here * number)
            best_product = max(best_product, best_here)

        return best_product
`),

  "Design Add and Search Words Data Structure": sol(`
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        current_node = self.root
        for character in word:
            current_node = current_node.children.setdefault(character, TrieNode())
        current_node.is_word = True

    def search(self, word: str) -> bool:
        def dfs(index, node):
            if index == len(word):
                return node.is_word

            character = word[index]
            if character == ".":
                return any(dfs(index + 1, child) for child in node.children.values())
            if character not in node.children:
                return False
            return dfs(index + 1, node.children[character])

        return dfs(0, self.root)
`),

  "Pacific Atlantic Water Flow": sol(`
from typing import List

class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        row_count = len(heights)
        col_count = len(heights[0])

        def reachable_from(starts):
            reachable = set(starts)
            stack = list(starts)
            while stack:
                row, col = stack.pop()
                for row_delta, col_delta in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    next_row = row + row_delta
                    next_col = col + col_delta
                    if (
                        0 <= next_row < row_count
                        and 0 <= next_col < col_count
                        and (next_row, next_col) not in reachable
                        and heights[next_row][next_col] >= heights[row][col]
                    ):
                        reachable.add((next_row, next_col))
                        stack.append((next_row, next_col))
            return reachable

        pacific_starts = [(0, col) for col in range(col_count)] + [(row, 0) for row in range(row_count)]
        atlantic_starts = [(row_count - 1, col) for col in range(col_count)] + [(row, col_count - 1) for row in range(row_count)]
        return [list(cell) for cell in reachable_from(pacific_starts) & reachable_from(atlantic_starts)]
`),

  "Remove Nth Node From End of List": sol(`
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def removeNthFromEnd(self, head, n: int):
        sentinel = ListNode(0, head)
        fast_node = sentinel
        slow_node = sentinel

        for _ in range(n + 1):
            fast_node = fast_node.next

        while fast_node:
            fast_node = fast_node.next
            slow_node = slow_node.next

        slow_node.next = slow_node.next.next
        return sentinel.next
`),

  "Shortest Path to Get Food": sol(`
from collections import deque
from typing import List

class Solution:
    def getFood(self, grid: List[List[str]]) -> int:
        row_count = len(grid)
        col_count = len(grid[0])
        queue = deque()

        for row in range(row_count):
            for col in range(col_count):
                if grid[row][col] == "*":
                    queue.append((row, col, 0))
                    grid[row][col] = "X"
                    break
            if queue:
                break

        while queue:
            row, col, distance = queue.popleft()
            for row_delta, col_delta in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_delta
                next_col = col + col_delta
                if 0 <= next_row < row_count and 0 <= next_col < col_count and grid[next_row][next_col] != "X":
                    if grid[next_row][next_col] == "#":
                        return distance + 1
                    grid[next_row][next_col] = "X"
                    queue.append((next_row, next_col, distance + 1))

        return -1
`),

  "Find the Duplicate Number": sol(`
from typing import List

class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow_pointer = nums[0]
        fast_pointer = nums[0]

        while True:
            slow_pointer = nums[slow_pointer]
            fast_pointer = nums[nums[fast_pointer]]
            if slow_pointer == fast_pointer:
                break

        slow_pointer = nums[0]
        while slow_pointer != fast_pointer:
            slow_pointer = nums[slow_pointer]
            fast_pointer = nums[fast_pointer]

        return slow_pointer
`),

  "Top K Frequent Words": sol(`
from collections import Counter
from typing import List

class Solution:
    def topKFrequent(self, words: List[str], k: int) -> List[str]:
        counts = Counter(words)
        return sorted(counts.keys(), key=lambda word: (-counts[word], word))[:k]
`),

  "Longest Increasing Subsequence": sol(`
from bisect import bisect_left
from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []

        for number in nums:
            insert_index = bisect_left(tails, number)
            if insert_index == len(tails):
                tails.append(number)
            else:
                tails[insert_index] = number

        return len(tails)
`),

  "Graph Valid Tree": sol(`
from typing import List

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) != n - 1:
            return False

        parent = list(range(n))

        def find(node):
            while parent[node] != node:
                parent[node] = parent[parent[node]]
                node = parent[node]
            return node

        for first_node, second_node in edges:
            first_root = find(first_node)
            second_root = find(second_node)
            if first_root == second_root:
                return False
            parent[second_root] = first_root

        return True
`),

  "Course Schedule II": sol(`
from collections import deque
from typing import List

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses

        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1

        queue = deque(course for course in range(numCourses) if indegree[course] == 0)
        order = []

        while queue:
            prerequisite = queue.popleft()
            order.append(prerequisite)
            for course in graph[prerequisite]:
                indegree[course] -= 1
                if indegree[course] == 0:
                    queue.append(course)

        return order if len(order) == numCourses else []
`),

  "Swap Nodes in Pairs": sol(`
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def swapPairs(self, head):
        sentinel = ListNode(0, head)
        previous_pair_tail = sentinel

        while previous_pair_tail.next and previous_pair_tail.next.next:
            first_node = previous_pair_tail.next
            second_node = first_node.next

            first_node.next = second_node.next
            second_node.next = first_node
            previous_pair_tail.next = second_node
            previous_pair_tail = first_node

        return sentinel.next
`),

  "Path Sum II": sol(`
from typing import List

class Solution:
    def pathSum(self, root, targetSum: int) -> List[List[int]]:
        paths = []
        current_path = []

        def dfs(node, remaining_sum):
            if not node:
                return

            current_path.append(node.val)
            remaining_sum -= node.val
            if not node.left and not node.right and remaining_sum == 0:
                paths.append(current_path[:])
            else:
                dfs(node.left, remaining_sum)
                dfs(node.right, remaining_sum)
            current_path.pop()

        dfs(root, targetSum)
        return paths
`),

  "Longest Consecutive Sequence": sol(`
from typing import List

class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        values = set(nums)
        best_length = 0

        for number in values:
            if number - 1 in values:
                continue
            current_length = 1
            while number + current_length in values:
                current_length += 1
            best_length = max(best_length, current_length)

        return best_length
`),

  "Rotate Array": sol(`
from typing import List

class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        k %= len(nums)

        def reverse(left_index, right_index):
            while left_index < right_index:
                nums[left_index], nums[right_index] = nums[right_index], nums[left_index]
                left_index += 1
                right_index -= 1

        reverse(0, len(nums) - 1)
        reverse(0, k - 1)
        reverse(k, len(nums) - 1)
`),

  "Odd Even Linked List": sol(`
class Solution:
    def oddEvenList(self, head):
        if not head:
            return None

        odd_tail = head
        even_head = head.next
        even_tail = even_head

        while even_tail and even_tail.next:
            odd_tail.next = even_tail.next
            odd_tail = odd_tail.next
            even_tail.next = odd_tail.next
            even_tail = even_tail.next

        odd_tail.next = even_head
        return head
`),

  "Decode String": sol(`
class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        current_text = []
        current_count = 0

        for character in s:
            if character.isdigit():
                current_count = current_count * 10 + int(character)
            elif character == "[":
                stack.append(("".join(current_text), current_count))
                current_text = []
                current_count = 0
            elif character == "]":
                previous_text, repeat_count = stack.pop()
                current_text = [previous_text + "".join(current_text) * repeat_count]
            else:
                current_text.append(character)

        return "".join(current_text)
`),

  "Contiguous Array": sol(`
from typing import List

class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        first_index_by_balance = {0: -1}
        balance = 0
        best_length = 0

        for index, number in enumerate(nums):
            balance += 1 if number == 1 else -1
            if balance in first_index_by_balance:
                best_length = max(best_length, index - first_index_by_balance[balance])
            else:
                first_index_by_balance[balance] = index

        return best_length
`),

  "Maximum Width of Binary Tree": sol(`
from collections import deque

class Solution:
    def widthOfBinaryTree(self, root) -> int:
        if not root:
            return 0

        best_width = 0
        queue = deque([(root, 0)])

        while queue:
            level_length = len(queue)
            _, first_index = queue[0]
            _, last_index = queue[-1]
            best_width = max(best_width, last_index - first_index + 1)

            for _ in range(level_length):
                node, index = queue.popleft()
                normalized_index = index - first_index
                if node.left:
                    queue.append((node.left, 2 * normalized_index))
                if node.right:
                    queue.append((node.right, 2 * normalized_index + 1))

        return best_width
`),

  "Find K Closest Elements": sol(`
from typing import List

class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        left_index = 0
        right_index = len(arr) - k

        while left_index < right_index:
            middle_index = (left_index + right_index) // 2
            if x - arr[middle_index] > arr[middle_index + k] - x:
                left_index = middle_index + 1
            else:
                right_index = middle_index

        return arr[left_index:left_index + k]
`),

  "Longest Repeating Character Replacement": sol(`
from collections import defaultdict

class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        counts = defaultdict(int)
        left_index = 0
        highest_frequency = 0
        best_length = 0

        for right_index, character in enumerate(s):
            counts[character] += 1
            highest_frequency = max(highest_frequency, counts[character])

            while right_index - left_index + 1 - highest_frequency > k:
                counts[s[left_index]] -= 1
                left_index += 1

            best_length = max(best_length, right_index - left_index + 1)

        return best_length
`),

  "Inorder Successor in BST": sol(`
class Solution:
    def inorderSuccessor(self, root, p):
        successor = None
        current_node = root

        while current_node:
            if p.val < current_node.val:
                successor = current_node
                current_node = current_node.left
            else:
                current_node = current_node.right

        return successor
`),

  "Jump Game": sol(`
from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        farthest_reachable = 0

        for index, jump_length in enumerate(nums):
            if index > farthest_reachable:
                return False
            farthest_reachable = max(farthest_reachable, index + jump_length)

        return True
`),

  "Add Two Numbers": sol(`
class Solution:
    def addTwoNumbers(self, l1, l2):
        sentinel = ListNode()
        write_node = sentinel
        carry = 0

        while l1 or l2 or carry:
            total = carry
            if l1:
                total += l1.val
                l1 = l1.next
            if l2:
                total += l2.val
                l2 = l2.next

            carry, digit = divmod(total, 10)
            write_node.next = ListNode(digit)
            write_node = write_node.next

        return sentinel.next
`),

  "Generate Parentheses": sol(`
from typing import List

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        combinations = []

        def backtrack(current_text, open_count, close_count):
            if len(current_text) == 2 * n:
                combinations.append(current_text)
                return
            if open_count < n:
                backtrack(current_text + "(", open_count + 1, close_count)
            if close_count < open_count:
                backtrack(current_text + ")", open_count, close_count + 1)

        backtrack("", 0, 0)
        return combinations
`),

  "Sort List": sol(`
class Solution:
    def sortList(self, head):
        if not head or not head.next:
            return head

        slow_node = head
        fast_node = head.next
        while fast_node and fast_node.next:
            slow_node = slow_node.next
            fast_node = fast_node.next.next

        second_half = slow_node.next
        slow_node.next = None

        left_head = self.sortList(head)
        right_head = self.sortList(second_half)
        return self._merge(left_head, right_head)

    def _merge(self, left_node, right_node):
        sentinel = ListNode()
        write_node = sentinel

        while left_node and right_node:
            if left_node.val <= right_node.val:
                write_node.next = left_node
                left_node = left_node.next
            else:
                write_node.next = right_node
                right_node = right_node.next
            write_node = write_node.next

        write_node.next = left_node or right_node
        return sentinel.next
`),

  "Number of Connected Components in an Undirected Graph": sol(`
from typing import List

class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))
        component_count = n

        def find(node):
            while parent[node] != node:
                parent[node] = parent[parent[node]]
                node = parent[node]
            return node

        for first_node, second_node in edges:
            first_root = find(first_node)
            second_root = find(second_node)
            if first_root != second_root:
                parent[second_root] = first_root
                component_count -= 1

        return component_count
`),

  "Minimum Knight Moves": sol(`
from collections import deque

class Solution:
    def minKnightMoves(self, x: int, y: int) -> int:
        target_x = abs(x)
        target_y = abs(y)
        queue = deque([(0, 0, 0)])
        visited = {(0, 0)}

        while queue:
            row, col, distance = queue.popleft()
            if (row, col) == (target_x, target_y):
                return distance

            for row_delta, col_delta in ((1, 2), (2, 1), (-1, 2), (2, -1), (1, -2), (-2, 1), (-1, -2), (-2, -1)):
                next_row = row + row_delta
                next_col = col + col_delta
                if -2 <= next_row <= target_x + 2 and -2 <= next_col <= target_y + 2 and (next_row, next_col) not in visited:
                    visited.add((next_row, next_col))
                    queue.append((next_row, next_col, distance + 1))
`),

  "Subarray Sum Equals K": sol(`
from collections import defaultdict
from typing import List

class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        count_by_prefix_sum = defaultdict(int)
        count_by_prefix_sum[0] = 1
        prefix_sum = 0
        subarray_count = 0

        for number in nums:
            prefix_sum += number
            subarray_count += count_by_prefix_sum[prefix_sum - k]
            count_by_prefix_sum[prefix_sum] += 1

        return subarray_count
`),

  "Asteroid Collision": sol(`
from typing import List

class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack = []

        for asteroid in asteroids:
            alive = True
            while alive and asteroid < 0 and stack and stack[-1] > 0:
                if stack[-1] < -asteroid:
                    stack.pop()
                    continue
                if stack[-1] == -asteroid:
                    stack.pop()
                alive = False
            if alive:
                stack.append(asteroid)

        return stack
`),

  "Random Pick with Weight": sol(`
from typing import List
import bisect
import random

class Solution:
    def __init__(self, w: List[int]):
        self.prefix_weights = []
        running_total = 0
        for weight in w:
            running_total += weight
            self.prefix_weights.append(running_total)

    def pickIndex(self) -> int:
        target = random.randint(1, self.prefix_weights[-1])
        return bisect.bisect_left(self.prefix_weights, target)
`),

  "Kth Largest Element in an Array": sol(`
from typing import List
import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k, nums)[-1]
`),

  "Maximal Square": sol(`
from typing import List

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        row_count = len(matrix)
        col_count = len(matrix[0])
        previous_row = [0] * (col_count + 1)
        best_side = 0

        for row in range(1, row_count + 1):
            current_row = [0] * (col_count + 1)
            for col in range(1, col_count + 1):
                if matrix[row - 1][col - 1] == "1":
                    current_row[col] = 1 + min(previous_row[col], current_row[col - 1], previous_row[col - 1])
                    best_side = max(best_side, current_row[col])
            previous_row = current_row

        return best_side * best_side
`),

  "Rotate Image": sol(`
from typing import List

class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        matrix.reverse()

        for row in range(len(matrix)):
            for col in range(row + 1, len(matrix)):
                matrix[row][col], matrix[col][row] = matrix[col][row], matrix[row][col]
`),

  "Binary Tree Zigzag Level Order Traversal": sol(`
from collections import deque
from typing import List

class Solution:
    def zigzagLevelOrder(self, root) -> List[List[int]]:
        if not root:
            return []

        levels = []
        queue = deque([root])
        left_to_right = True

        while queue:
            level_values = deque()
            for _ in range(len(queue)):
                node = queue.popleft()
                if left_to_right:
                    level_values.append(node.val)
                else:
                    level_values.appendleft(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            levels.append(list(level_values))
            left_to_right = not left_to_right

        return levels
`),

  "Design Hit Counter": sol(`
from collections import deque

class HitCounter:
    def __init__(self):
        self.hits = deque()

    def hit(self, timestamp: int) -> None:
        self.hits.append(timestamp)

    def getHits(self, timestamp: int) -> int:
        while self.hits and self.hits[0] <= timestamp - 300:
            self.hits.popleft()
        return len(self.hits)
`),

  "Path Sum III": sol(`
from collections import defaultdict

class Solution:
    def pathSum(self, root, targetSum: int) -> int:
        prefix_counts = defaultdict(int)
        prefix_counts[0] = 1

        def dfs(node, current_sum):
            if not node:
                return 0

            current_sum += node.val
            path_count = prefix_counts[current_sum - targetSum]
            prefix_counts[current_sum] += 1
            path_count += dfs(node.left, current_sum)
            path_count += dfs(node.right, current_sum)
            prefix_counts[current_sum] -= 1
            return path_count

        return dfs(root, 0)
`),

  "Pow(x, n)": sol(`
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x = 1 / x
            n = -n

        result = 1.0
        current_power = x

        while n:
            if n & 1:
                result *= current_power
            current_power *= current_power
            n >>= 1

        return result
`),

  "Search a 2D Matrix": sol(`
from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        row_count = len(matrix)
        col_count = len(matrix[0])
        left_index = 0
        right_index = row_count * col_count - 1

        while left_index <= right_index:
            middle_index = (left_index + right_index) // 2
            value = matrix[middle_index // col_count][middle_index % col_count]
            if value == target:
                return True
            if value < target:
                left_index = middle_index + 1
            else:
                right_index = middle_index - 1

        return False
`),

  "Largest Number": sol(`
from functools import cmp_to_key
from typing import List

class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        def compare(first, second):
            if first + second > second + first:
                return -1
            if first + second < second + first:
                return 1
            return 0

        ordered_numbers = sorted(map(str, nums), key=cmp_to_key(compare))
        result = "".join(ordered_numbers)
        return "0" if result[0] == "0" else result
`),

  "Decode Ways": sol(`
class Solution:
    def numDecodings(self, s: str) -> int:
        if not s or s[0] == "0":
            return 0

        two_back = 1
        one_back = 1

        for index in range(1, len(s)):
            current = 0
            if s[index] != "0":
                current += one_back
            if 10 <= int(s[index - 1:index + 1]) <= 26:
                current += two_back
            two_back, one_back = one_back, current

        return one_back
`),

  "Meeting Rooms II": sol(`
from typing import List
import heapq

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda interval: interval[0])
        ending_times = []

        for start, end in intervals:
            if ending_times and ending_times[0] <= start:
                heapq.heappop(ending_times)
            heapq.heappush(ending_times, end)

        return len(ending_times)
`),

  "Reverse Integer": sol(`
class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        remaining = abs(x)
        reversed_value = 0

        while remaining:
            reversed_value = reversed_value * 10 + remaining % 10
            remaining //= 10

        reversed_value *= sign
        if reversed_value < -(2 ** 31) or reversed_value > 2 ** 31 - 1:
            return 0
        return reversed_value
`),

  "Set Matrix Zeroes": sol(`
from typing import List

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        row_count = len(matrix)
        col_count = len(matrix[0])
        first_row_has_zero = any(matrix[0][col] == 0 for col in range(col_count))
        first_col_has_zero = any(matrix[row][0] == 0 for row in range(row_count))

        for row in range(1, row_count):
            for col in range(1, col_count):
                if matrix[row][col] == 0:
                    matrix[row][0] = 0
                    matrix[0][col] = 0

        for row in range(1, row_count):
            for col in range(1, col_count):
                if matrix[row][0] == 0 or matrix[0][col] == 0:
                    matrix[row][col] = 0

        if first_row_has_zero:
            for col in range(col_count):
                matrix[0][col] = 0
        if first_col_has_zero:
            for row in range(row_count):
                matrix[row][0] = 0
`),

  "Reorder List": sol(`
class Solution:
    def reorderList(self, head) -> None:
        if not head or not head.next:
            return

        slow_node = head
        fast_node = head
        while fast_node and fast_node.next:
            slow_node = slow_node.next
            fast_node = fast_node.next.next

        previous_node = None
        current_node = slow_node.next
        slow_node.next = None
        while current_node:
            next_node = current_node.next
            current_node.next = previous_node
            previous_node = current_node
            current_node = next_node

        first_node = head
        second_node = previous_node
        while second_node:
            first_next = first_node.next
            second_next = second_node.next
            first_node.next = second_node
            second_node.next = first_next
            first_node = first_next
            second_node = second_next
`),

  "Encode and Decode Strings": sol(`
from typing import List

class Codec:
    def encode(self, strs: List[str]) -> str:
        return "".join(f"{len(text)}#{text}" for text in strs)

    def decode(self, s: str) -> List[str]:
        decoded = []
        index = 0

        while index < len(s):
            delimiter = s.index("#", index)
            length = int(s[index:delimiter])
            start = delimiter + 1
            decoded.append(s[start:start + length])
            index = start + length

        return decoded
`),

  "Cheapest Flights Within K Stops": sol(`
from typing import List

class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        costs = [float("inf")] * n
        costs[src] = 0

        for _ in range(k + 1):
            next_costs = costs[:]
            for start, end, price in flights:
                if costs[start] != float("inf") and costs[start] + price < next_costs[end]:
                    next_costs[end] = costs[start] + price
            costs = next_costs

        return -1 if costs[dst] == float("inf") else costs[dst]
`),

  "All Nodes Distance K in Binary Tree": sol(`
from collections import defaultdict, deque
from typing import List

class Solution:
    def distanceK(self, root, target, k: int) -> List[int]:
        graph = defaultdict(list)

        def build_graph(node, parent):
            if not node:
                return
            if parent:
                graph[node].append(parent)
                graph[parent].append(node)
            build_graph(node.left, node)
            build_graph(node.right, node)

        build_graph(root, None)
        queue = deque([(target, 0)])
        visited = {target}
        answer = []

        while queue:
            node, distance = queue.popleft()
            if distance == k:
                answer.append(node.val)
                continue
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, distance + 1))

        return answer
`),

  "3Sum Closest": sol(`
from typing import List

class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        nums.sort()
        closest_sum = nums[0] + nums[1] + nums[2]

        for anchor_index in range(len(nums) - 2):
            left_index = anchor_index + 1
            right_index = len(nums) - 1

            while left_index < right_index:
                current_sum = nums[anchor_index] + nums[left_index] + nums[right_index]
                if abs(current_sum - target) < abs(closest_sum - target):
                    closest_sum = current_sum
                if current_sum < target:
                    left_index += 1
                elif current_sum > target:
                    right_index -= 1
                else:
                    return target

        return closest_sum
`),

  "Rotate List": sol(`
class Solution:
    def rotateRight(self, head, k: int):
        if not head or not head.next or k == 0:
            return head

        length = 1
        tail = head
        while tail.next:
            tail = tail.next
            length += 1

        k %= length
        if k == 0:
            return head

        tail.next = head
        steps_to_new_tail = length - k
        new_tail = tail
        for _ in range(steps_to_new_tail):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head
`),

  "Find Minimum in Rotated Sorted Array": sol(`
from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        left_index = 0
        right_index = len(nums) - 1

        while left_index < right_index:
            middle_index = (left_index + right_index) // 2
            if nums[middle_index] > nums[right_index]:
                left_index = middle_index + 1
            else:
                right_index = middle_index

        return nums[left_index]
`),

  "Basic Calculator II": sol(`
class Solution:
    def calculate(self, s: str) -> int:
        stack = []
        current_number = 0
        operation = "+"

        for index, character in enumerate(s):
            if character.isdigit():
                current_number = current_number * 10 + int(character)
            if (not character.isdigit() and character != " ") or index == len(s) - 1:
                if operation == "+":
                    stack.append(current_number)
                elif operation == "-":
                    stack.append(-current_number)
                elif operation == "*":
                    stack.append(stack.pop() * current_number)
                else:
                    stack.append(int(stack.pop() / current_number))
                operation = character
                current_number = 0

        return sum(stack)
`),

  "Combination Sum IV": sol(`
from typing import List

class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        ways = [0] * (target + 1)
        ways[0] = 1

        for current_total in range(1, target + 1):
            for number in nums:
                if number <= current_total:
                    ways[current_total] += ways[current_total - number]

        return ways[target]
`),

  "Insert Delete GetRandom O(1)": sol(`
import random

class RandomizedSet:
    def __init__(self):
        self.values = []
        self.index_by_value = {}

    def insert(self, val: int) -> bool:
        if val in self.index_by_value:
            return False
        self.index_by_value[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.index_by_value:
            return False

        remove_index = self.index_by_value[val]
        last_value = self.values[-1]
        self.values[remove_index] = last_value
        self.index_by_value[last_value] = remove_index
        self.values.pop()
        del self.index_by_value[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.values)
`),

  "Non-overlapping Intervals": sol(`
from typing import List

class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda interval: interval[1])
        removed_count = 0
        previous_end = float("-inf")

        for start, end in intervals:
            if start >= previous_end:
                previous_end = end
            else:
                removed_count += 1

        return removed_count
`),

  "Minimum Window Substring": sol(`
from collections import Counter, defaultdict

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        required_counts = Counter(t)
        window_counts = defaultdict(int)
        required_matches = len(required_counts)
        formed_matches = 0
        left_index = 0
        best = (float("inf"), 0, 0)

        for right_index, character in enumerate(s):
            window_counts[character] += 1
            if character in required_counts and window_counts[character] == required_counts[character]:
                formed_matches += 1

            while formed_matches == required_matches:
                if right_index - left_index + 1 < best[0]:
                    best = (right_index - left_index + 1, left_index, right_index)

                left_character = s[left_index]
                window_counts[left_character] -= 1
                if left_character in required_counts and window_counts[left_character] < required_counts[left_character]:
                    formed_matches -= 1
                left_index += 1

        if best[0] == float("inf"):
            return ""
        return s[best[1]:best[2] + 1]
`),

  "Serialize and Deserialize Binary Tree": sol(`
from collections import deque

class Codec:
    def serialize(self, root):
        values = []

        def dfs(node):
            if not node:
                values.append("#")
                return
            values.append(str(node.val))
            dfs(node.left)
            dfs(node.right)

        dfs(root)
        return ",".join(values)

    def deserialize(self, data):
        values = deque(data.split(","))

        def dfs():
            value = values.popleft()
            if value == "#":
                return None
            node = TreeNode(int(value))
            node.left = dfs()
            node.right = dfs()
            return node

        return dfs()
`),

  "Trapping Rain Water": sol(`
from typing import List

class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0

        left_index = 0
        right_index = len(height) - 1
        left_max_height = height[left_index]
        right_max_height = height[right_index]
        trapped_water = 0

        while left_index < right_index:
            if left_max_height < right_max_height:
                left_index += 1
                left_max_height = max(left_max_height, height[left_index])
                trapped_water += left_max_height - height[left_index]
            else:
                right_index -= 1
                right_max_height = max(right_max_height, height[right_index])
                trapped_water += right_max_height - height[right_index]

        return trapped_water
`),

  "Find Median from Data Stream": sol(`
import heapq

class MedianFinder:
    def __init__(self):
        self.lower_half = []
        self.upper_half = []

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lower_half, -num)
        heapq.heappush(self.upper_half, -heapq.heappop(self.lower_half))

        if len(self.upper_half) > len(self.lower_half):
            heapq.heappush(self.lower_half, -heapq.heappop(self.upper_half))

    def findMedian(self) -> float:
        if len(self.lower_half) > len(self.upper_half):
            return -self.lower_half[0]
        return (-self.lower_half[0] + self.upper_half[0]) / 2
`),

  "Word Ladder": sol(`
from collections import defaultdict, deque
from typing import List

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if endWord not in wordList:
            return 0

        pattern_to_words = defaultdict(list)
        word_length = len(beginWord)
        for word in wordList:
            for index in range(word_length):
                pattern_to_words[word[:index] + "*" + word[index + 1:]].append(word)

        queue = deque([(beginWord, 1)])
        visited = {beginWord}

        while queue:
            word, distance = queue.popleft()
            if word == endWord:
                return distance

            for index in range(word_length):
                pattern = word[:index] + "*" + word[index + 1:]
                for next_word in pattern_to_words[pattern]:
                    if next_word not in visited:
                        visited.add(next_word)
                        queue.append((next_word, distance + 1))
                pattern_to_words[pattern] = []

        return 0
`),

  "Basic Calculator": sol(`
class Solution:
    def calculate(self, s: str) -> int:
        result = 0
        current_number = 0
        sign = 1
        stack = []

        for character in s:
            if character.isdigit():
                current_number = current_number * 10 + int(character)
            elif character in "+-":
                result += sign * current_number
                current_number = 0
                sign = 1 if character == "+" else -1
            elif character == "(":
                stack.append(result)
                stack.append(sign)
                result = 0
                sign = 1
            elif character == ")":
                result += sign * current_number
                current_number = 0
                result *= stack.pop()
                result += stack.pop()

        return result + sign * current_number
`),

  "Maximum Profit in Job Scheduling": sol(`
from bisect import bisect_left
from typing import List

class Solution:
    def jobScheduling(self, startTime: List[int], endTime: List[int], profit: List[int]) -> int:
        jobs = sorted(zip(startTime, endTime, profit))
        starts = [job[0] for job in jobs]
        memo = {}

        def best_profit_from(index):
            if index == len(jobs):
                return 0
            if index in memo:
                return memo[index]

            next_index = bisect_left(starts, jobs[index][1])
            take_profit = jobs[index][2] + best_profit_from(next_index)
            skip_profit = best_profit_from(index + 1)
            memo[index] = max(take_profit, skip_profit)
            return memo[index]

        return best_profit_from(0)
`),

  "Merge k Sorted Lists": sol(`
from typing import List
import heapq

class Solution:
    def mergeKLists(self, lists: List) :
        heap = []
        for list_index, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, list_index, node))

        sentinel = ListNode()
        write_node = sentinel

        while heap:
            _, list_index, node = heapq.heappop(heap)
            write_node.next = node
            write_node = write_node.next
            if node.next:
                heapq.heappush(heap, (node.next.val, list_index, node.next))

        return sentinel.next
`),

  "Largest Rectangle in Histogram": sol(`
from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = []
        best_area = 0

        for index, height in enumerate(heights + [0]):
            start_index = index
            while stack and stack[-1][1] > height:
                bar_index, bar_height = stack.pop()
                best_area = max(best_area, bar_height * (index - bar_index))
                start_index = bar_index
            stack.append((start_index, height))

        return best_area
`),

  "Binary Tree Maximum Path Sum": sol(`
class Solution:
    def maxPathSum(self, root) -> int:
        best_path_sum = float("-inf")

        def best_gain(node):
            nonlocal best_path_sum
            if not node:
                return 0

            left_gain = max(best_gain(node.left), 0)
            right_gain = max(best_gain(node.right), 0)
            best_path_sum = max(best_path_sum, node.val + left_gain + right_gain)
            return node.val + max(left_gain, right_gain)

        best_gain(root)
        return best_path_sum
`),

  "Maximum Frequency Stack": sol(`
from collections import defaultdict

class FreqStack:
    def __init__(self):
        self.frequency_by_value = defaultdict(int)
        self.values_by_frequency = defaultdict(list)
        self.max_frequency = 0

    def push(self, val: int) -> None:
        self.frequency_by_value[val] += 1
        frequency = self.frequency_by_value[val]
        self.max_frequency = max(self.max_frequency, frequency)
        self.values_by_frequency[frequency].append(val)

    def pop(self) -> int:
        value = self.values_by_frequency[self.max_frequency].pop()
        self.frequency_by_value[value] -= 1
        if not self.values_by_frequency[self.max_frequency]:
            self.max_frequency -= 1
        return value
`),

  "Median of Two Sorted Arrays": sol(`
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        total_length = len(nums1) + len(nums2)
        half_length = (total_length + 1) // 2
        left = 0
        right = len(nums1)

        while left <= right:
            partition1 = (left + right) // 2
            partition2 = half_length - partition1

            left1 = float("-inf") if partition1 == 0 else nums1[partition1 - 1]
            right1 = float("inf") if partition1 == len(nums1) else nums1[partition1]
            left2 = float("-inf") if partition2 == 0 else nums2[partition2 - 1]
            right2 = float("inf") if partition2 == len(nums2) else nums2[partition2]

            if left1 <= right2 and left2 <= right1:
                if total_length % 2:
                    return max(left1, left2)
                return (max(left1, left2) + min(right1, right2)) / 2
            if left1 > right2:
                right = partition1 - 1
            else:
                left = partition1 + 1
`),

  "Longest Increasing Path in a Matrix": sol(`
from functools import lru_cache
from typing import List

class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        row_count = len(matrix)
        col_count = len(matrix[0])

        @lru_cache(None)
        def dfs(row, col):
            best_length = 1
            for row_delta, col_delta in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_delta
                next_col = col + col_delta
                if 0 <= next_row < row_count and 0 <= next_col < col_count and matrix[next_row][next_col] > matrix[row][col]:
                    best_length = max(best_length, 1 + dfs(next_row, next_col))
            return best_length

        return max(dfs(row, col) for row in range(row_count) for col in range(col_count))
`),

  "Longest Valid Parentheses": sol(`
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        stack = [-1]
        best_length = 0

        for index, character in enumerate(s):
            if character == "(":
                stack.append(index)
            else:
                stack.pop()
                if not stack:
                    stack.append(index)
                else:
                    best_length = max(best_length, index - stack[-1])

        return best_length
`),

  "Design In-Memory File System": sol(`
from collections import defaultdict
from typing import List

class FileSystem:
    def __init__(self):
        self.children = defaultdict(dict)
        self.files = {}

    def ls(self, path: str) -> List[str]:
        if path in self.files:
            return [path.split("/")[-1]]
        return sorted(self.children[path].keys())

    def mkdir(self, path: str) -> None:
        self._ensure_directory(path)

    def addContentToFile(self, filePath: str, content: str) -> None:
        directory_path, file_name = filePath.rsplit("/", 1)
        if directory_path == "":
            directory_path = "/"
        self._ensure_directory(directory_path)
        self.children[directory_path][file_name] = filePath
        self.files[filePath] = self.files.get(filePath, "") + content

    def readContentFromFile(self, filePath: str) -> str:
        return self.files[filePath]

    def _ensure_directory(self, path: str) -> None:
        current_path = "/"
        if path == "/":
            return
        for part in path.strip("/").split("/"):
            next_path = current_path.rstrip("/") + "/" + part
            self.children[current_path][part] = next_path
            current_path = next_path
`),

  "Employee Free Time": sol(`
from typing import List
import heapq

# class Interval:
#     def __init__(self, start=None, end=None):
#         self.start = start
#         self.end = end

class Solution:
    def employeeFreeTime(self, schedule: List[List]) -> List:
        intervals = [interval for employee in schedule for interval in employee]
        intervals.sort(key=lambda interval: interval.start)
        free_times = []
        current_end = intervals[0].end

        for interval in intervals[1:]:
            if interval.start > current_end:
                free_times.append(Interval(current_end, interval.start))
            current_end = max(current_end, interval.end)

        return free_times
`),

  "Word Search II": sol(`
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = TrieNode()
        for word in words:
            node = root
            for character in word:
                node = node.children.setdefault(character, TrieNode())
            node.word = word

        row_count = len(board)
        col_count = len(board[0])
        found_words = []

        def dfs(row, col, node):
            character = board[row][col]
            if character not in node.children:
                return
            next_node = node.children[character]
            if next_node.word:
                found_words.append(next_node.word)
                next_node.word = None

            board[row][col] = "#"
            for row_delta, col_delta in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                next_row = row + row_delta
                next_col = col + col_delta
                if 0 <= next_row < row_count and 0 <= next_col < col_count and board[next_row][next_col] != "#":
                    dfs(next_row, next_col, next_node)
            board[row][col] = character

            if not next_node.children:
                node.children.pop(character)

        for row in range(row_count):
            for col in range(col_count):
                dfs(row, col, root)

        return found_words
`),

  "Alien Dictionary": sol(`
from collections import defaultdict, deque
from typing import List

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        graph = {character: set() for word in words for character in word}
        indegree = {character: 0 for character in graph}

        for first_word, second_word in zip(words, words[1:]):
            min_length = min(len(first_word), len(second_word))
            if len(first_word) > len(second_word) and first_word[:min_length] == second_word[:min_length]:
                return ""
            for first_char, second_char in zip(first_word, second_word):
                if first_char != second_char:
                    if second_char not in graph[first_char]:
                        graph[first_char].add(second_char)
                        indegree[second_char] += 1
                    break

        queue = deque(character for character, degree in indegree.items() if degree == 0)
        order = []

        while queue:
            character = queue.popleft()
            order.append(character)
            for next_character in graph[character]:
                indegree[next_character] -= 1
                if indegree[next_character] == 0:
                    queue.append(next_character)

        return "".join(order) if len(order) == len(graph) else ""
`),

  "Bus Routes": sol(`
from collections import defaultdict, deque
from typing import List

class Solution:
    def numBusesToDestination(self, routes: List[List[int]], source: int, target: int) -> int:
        if source == target:
            return 0

        routes_by_stop = defaultdict(list)
        for route_index, route in enumerate(routes):
            for stop in route:
                routes_by_stop[stop].append(route_index)

        queue = deque([(source, 0)])
        visited_stops = {source}
        visited_routes = set()

        while queue:
            stop, buses_taken = queue.popleft()
            for route_index in routes_by_stop[stop]:
                if route_index in visited_routes:
                    continue
                visited_routes.add(route_index)
                for next_stop in routes[route_index]:
                    if next_stop == target:
                        return buses_taken + 1
                    if next_stop not in visited_stops:
                        visited_stops.add(next_stop)
                        queue.append((next_stop, buses_taken + 1))

        return -1
`),

  "Sliding Window Maximum": sol(`
from collections import deque
from typing import List

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        decreasing_indices = deque()
        maximums = []

        for right_index, number in enumerate(nums):
            while decreasing_indices and decreasing_indices[0] <= right_index - k:
                decreasing_indices.popleft()
            while decreasing_indices and nums[decreasing_indices[-1]] <= number:
                decreasing_indices.pop()
            decreasing_indices.append(right_index)

            if right_index >= k - 1:
                maximums.append(nums[decreasing_indices[0]])

        return maximums
`),

  "Palindrome Pairs": sol(`
from typing import List

class Solution:
    def palindromePairs(self, words: List[str]) -> List[List[int]]:
        index_by_word = {word: index for index, word in enumerate(words)}
        pairs = []

        def is_palindrome(text):
            return text == text[::-1]

        for index, word in enumerate(words):
            for split_index in range(len(word) + 1):
                prefix = word[:split_index]
                suffix = word[split_index:]

                if is_palindrome(prefix):
                    needed = suffix[::-1]
                    if needed in index_by_word and index_by_word[needed] != index:
                        pairs.append([index_by_word[needed], index])

                if split_index != len(word) and is_palindrome(suffix):
                    needed = prefix[::-1]
                    if needed in index_by_word and index_by_word[needed] != index:
                        pairs.append([index, index_by_word[needed]])

        return pairs
`),

  "Reverse Nodes in k-Group": sol(`
class Solution:
    def reverseKGroup(self, head, k: int):
        sentinel = ListNode(0, head)
        group_previous = sentinel

        while True:
            kth_node = self._get_kth_node(group_previous, k)
            if not kth_node:
                break

            group_next = kth_node.next
            previous_node = group_next
            current_node = group_previous.next

            while current_node is not group_next:
                next_node = current_node.next
                current_node.next = previous_node
                previous_node = current_node
                current_node = next_node

            old_group_head = group_previous.next
            group_previous.next = kth_node
            group_previous = old_group_head

        return sentinel.next

    def _get_kth_node(self, current_node, k):
        while current_node and k > 0:
            current_node = current_node.next
            k -= 1
        return current_node
`),

  "Sudoku Solver": sol(`
from typing import List

class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        empty_cells = []

        for row in range(9):
            for col in range(9):
                value = board[row][col]
                if value == ".":
                    empty_cells.append((row, col))
                else:
                    rows[row].add(value)
                    cols[col].add(value)
                    boxes[(row // 3) * 3 + col // 3].add(value)

        def backtrack(cell_index):
            if cell_index == len(empty_cells):
                return True

            row, col = empty_cells[cell_index]
            box_index = (row // 3) * 3 + col // 3
            for digit in "123456789":
                if digit in rows[row] or digit in cols[col] or digit in boxes[box_index]:
                    continue

                board[row][col] = digit
                rows[row].add(digit)
                cols[col].add(digit)
                boxes[box_index].add(digit)

                if backtrack(cell_index + 1):
                    return True

                board[row][col] = "."
                rows[row].remove(digit)
                cols[col].remove(digit)
                boxes[box_index].remove(digit)

            return False

        backtrack(0)
`),

  "First Missing Positive": sol(`
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        length = len(nums)

        for index in range(length):
            while 1 <= nums[index] <= length and nums[nums[index] - 1] != nums[index]:
                target_index = nums[index] - 1
                nums[index], nums[target_index] = nums[target_index], nums[index]

        for index, number in enumerate(nums):
            if number != index + 1:
                return index + 1

        return length + 1
`),

  "N-Queens": sol(`
from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        boards = []
        queen_cols = []
        used_cols = set()
        used_main_diagonals = set()
        used_anti_diagonals = set()

        def backtrack(row):
            if row == n:
                board = []
                for col in queen_cols:
                    board.append("." * col + "Q" + "." * (n - col - 1))
                boards.append(board)
                return

            for col in range(n):
                main_diagonal = row - col
                anti_diagonal = row + col
                if col in used_cols or main_diagonal in used_main_diagonals or anti_diagonal in used_anti_diagonals:
                    continue

                queen_cols.append(col)
                used_cols.add(col)
                used_main_diagonals.add(main_diagonal)
                used_anti_diagonals.add(anti_diagonal)
                backtrack(row + 1)
                queen_cols.pop()
                used_cols.remove(col)
                used_main_diagonals.remove(main_diagonal)
                used_anti_diagonals.remove(anti_diagonal)

        backtrack(0)
        return boards
`),

  "Smallest Range Covering Elements from K Lists": sol(`
from typing import List
import heapq

class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        heap = []
        current_max = float("-inf")

        for list_index, values in enumerate(nums):
            heapq.heappush(heap, (values[0], list_index, 0))
            current_max = max(current_max, values[0])

        best_start = heap[0][0]
        best_end = current_max

        while len(heap) == len(nums):
            current_min, list_index, value_index = heapq.heappop(heap)
            if current_max - current_min < best_end - best_start:
                best_start, best_end = current_min, current_max

            next_index = value_index + 1
            if next_index == len(nums[list_index]):
                break
            next_value = nums[list_index][next_index]
            current_max = max(current_max, next_value)
            heapq.heappush(heap, (next_value, list_index, next_index))

        return [best_start, best_end]
`)
};

module.exports = { solutions };
