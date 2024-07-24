---
title: X Cup Fun Contest
published: 2024-07-24
description: ''
image: ''
tags: [XCup]
category: 'XCup'
draft: true 
---

## Problem Statements

---

### 101B

**Problem Statement:**

There are `n` students and `m` books in total. The teacher wants to evenly distribute the number of books to all students (such that all students will have the same amount of books, and the rest will become left overs). Please output the number of books each student will receive and the number of leftover books.

<br>

**Input Format:** \
The first and only line will contain 2 integers `n` and `m` respectively.

**Output Format:** \
In the first line output the number of books each student will receive.
In the second line output the number of left over books.

<br>

**Sample Input:**
```markdown
10 66
```

**Sample Output:**
```markdown
6
6
```

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 50     | $n, m \leq 100$ |
| _2_ | 50     | $n, m \leq 10^{18}$ |

---

### 102A

**Problem Statement**

In the enchanted library of the mystical kingdom of Lexiconia, there lies a magical scroll inscribed with a string `S` composed solely of lowercase letters. This scroll holds the secret to untold powers, but only those who can decipher its hidden pattern can unlock its full potential.

A **good substring** is a magical sequence within `S` that, when repeated one or more times, perfectly reconstructs the entire string `S`. Your quest is to uncover the number of these good substrings within the scroll's inscription. Note that here, we for a string S, we do not consider itself to be a substring of itself (like `S` is not constidered to be a substring of `S`).

<br>

**Input Format:** \
The first and only line contains the string `S`.

**Output Format:** \
Output line line containing the answer.

<br>

**Sample Input:**
```markdown
abababab
```

**Sample Output:**
```markdown
2
```

**Sample Explanation:**

Good substrings of `S` includes: `ab` and `abab` .

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 50     | $\|S\| \leq 500$ |
| _2_ | 50     | $\|S\| \leq 5000$ |

<br>

***Notes:*** $\|S\|$ means the length of string `S`.

---

### 102B

**Problem Satement:**\
You are given two files, `a.in` and `b.in`. Both files have the same format that as follows:

- The first line contains a single number n. 
- The second line contains an array of n integers. 

Let’s denote the array contained in `a.in` as A (from 1 to n), and the array contained in `b.in` as B (from 1 to n). Output the result of of the following formula of `x` for `x` = 1, 2 … n in another file `c.out`:

$$\sum_{i=1}^{x} A_i * B_i$$

It is guaranteed that final answer will not exceed 1e18.

***Note:*** $\sum$ is the <a href="https://www.mathsisfun.com/algebra/sigma-notation.html" target="_blank">summation notation</a>. 

<br>

**Sample Input:**

| a.in | b.in |
| :-  | :-   |
| <pre>3<br>1 3 2</pre> | <pre>3<br>4 1 2</pre> |

**Sample Output:**

| c.out |
| :- |
| <pre>4 7 11</pre>

**Sample Explanation:**\
When $x = 1$, we calculate $1 \times 4$, which is 4.\
When $x = 2$, we calculate $1 \times 4 + 3 \times 1$, which is 7.\
When $x = 3$, we calculate $1 \times 4 + 3 \times 1 + 2 \times 2$, which is 11.

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 70     | $n \leq 5000$ |
| _2_ | 30     | $n \leq 1000000$ |

<br>

***Note:***
- When running your program, please remember to have `a.in` and `b.in` in the same folder as your program.
- You may also need the following file read and write template code. Here it is in C++:
```cpp
#include <bits/stdc++.h> // almighty library
using namespace std;
int main() {
    ifstream fin1("a.in"); // reading in from a.in
    ifstream fin2("b.in"); // reading in from b.in
    ofstream fout("c.out"); // writing out to c.out

    int n1, n2;
    fin1 >> n1; // read file content from a.in to n1
    fin2 >> n2; // read file content from b.in to n2

    fout << "May this journey lead us starward! " << 114513 << endl; 
    // write the string and number to the c.out file
    return 0;
}
```

---

### 102C

**Problem Statement:**\
You are given a string `S` that consists only of lowercase letters, and an integer `L`. Your task is to find all substrings of `S` with length `L` and output them in lexicographic order. Note that duplicates should also be included in the output.

***Note:*** Lexicographic order is similar to the dictionary order where strings are compared character by character. For example, the string "apple" comes before "banana" because the first character 'a' is less than 'b'. Similarly, "about" comes before "act".

It is garanteed that $L \leq \|S\|$

<br>

**Input Format:**\
The first line includes the string S
The second line contains the integer L

**Output Format:**\
Output several lines, each line contains one substring. (Keep the order in mind)

<br>

**Sample Input:**
```markdown
abcdcd
2
```

**Sample Output:**
```markdown
ab
bc
cb
cb
dc
```

**Sample Explanation:**\
Substrings of length **2** includes: `ab`, `bc`, `dc`, and 2 `cb`*s*\
When we order them in lexicographic order, we have: `ab`, `bc`, `cb`, `cb`, `dc`

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 60     | $\|S\| \leq 500$ |
| _2_ | 40     | $\|S\| \leq 10000$ |

---

### 102D

**Problem Statement:**\
In a faraway kingdom, the Royal Mathematician is tasked with solving a peculiar problem given by the King. The kingdom's archive holds a vast collection of ancient scrolls, each containing a number. The King wants to know the **sum of the digits** for each of these numbers to uncover a secret code hidden within the archive.\
As the Royal Mathematician's apprentice, you are given the important mission to help solve this problem. The King has provided `T` ancient scrolls, each containing a single number `n`. Your task is to calculate the sum of the digits for each of these numbers and report back with the results.

<br>

**Input Format:**\
The first line includes the number of testcases `T`.
Each of the next `T` lines each contains contains a single integer `n`, representing the number on an ancient scroll.

**Output Format:**\
For each test case, output a single line containing the sum of the digits of `n`.

<br>

**Sample Input:**
```markdown
3
142512465761282
64092
114514
```

**Sample Output:**
```markdown
56
21
16
```

**Sample Explanation:**\
$1+4+2+5+1+2+4+6+5+7+6+1+2+8+2=56$\
$6+4+0+9+2=21$\
$1+1+4+5+1+4=16$

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 40     | $n \leq 10^{18}$ |
| _2_ | 60     | $n \leq 10^{30000}$ |

---

### 102E

**Problem Statement:**\
Once upon a time, on the planet Tavyet, there existed a mystical Loom of Fate. This loom is a square matrix of size `x` by `x`, with each cell containing the fates of `m` people. As a descendant from another planet, you have landed on Teyvat and caught a quick glimpse of the Loom of Fate, memorizing its configuration (the matrix size and the value of `m` within each cell).\
During your adventure on Teyvat, the **i**-th decision you make rotates the Loom of Fate A<sub>i</sub> * 90 degrees clockwise. After making exactly `n` decisions, you arrive in front of the Loom of Fate, which is hidden behind a magical wall. The wall asked you to answer one simple question: what is the final configuration of the Loom of Fate? Only by answering correctly will you see the Loom of Fate. 

<br>

**Input Format:**\
The first line contains an integer $x$, the size of the matrix.\
The next `x` lines each contain `x` integers, representing the initial configuration of the matrix.\
The next line contains an integer `n`, the number of decisions you made.\
The next line contains `n` integers, representing A<sub>1</sub>, A<sub>2</sub> . . . A<sub>n</sub>

**Output Format:**\
Output the final configuration of the Loom of Fate (with n lines of n integers).

<br>

**Sample Input 1:**
```markdown
2
1 2
2 1
3
1 2 2
```

**Sample Output 1:**
```markdown
2 1
1 2
```

**Sample Input 2:**
```markdown
3
1 2 1
3 3 3
1 4 1
5
1 1 1 1 1
```

**Sample Output 2:**
```markdown
1 3 1
4 3 2
1 3 1
```

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 30     | $x \leq 50, n \leq 100, A_{1,2...n} \leq 10$ |
| _2_ | 70     | $x \leq 1000, n \leq 1000, A_{1,2...n} \leq 10^{9}$ |

---

### 200C

**Problem Statement:**\
You are given an array of `n` positions integers ($A_{1,2...n}$), note that this is one indexing). Find a positive integer `x` such that that boolean flag in the following c++ code will be true after execution:
```cpp
bool flag = false;
for (int i = 1; i < n; i++)
	flag = flag | (A[i] * x = 1000000 - A[i - 1])
```

<br>

**Input Format:**\
The first line contains the number `n`.
The second line contains `n` numbers representing $A_1$, $A_2$, ... $A_n$

**Output format:**\
Output one line representing the answer `x`. If it doesn’t exist, output `-1`.

<br>

**Sample Input:**
```markdown
7
2 2 3 4 5 8 4
```

**Sample Output:**
```markdown
499999
```

**Sample Explanation:**

$A_1 * 499999 = 1000000 - A_2$

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 40     | $n \leq 100$ |
| _2_ | 60     | $n \leq 50000000$ |

---

### 200D

**Problem Statement:**\
There is a string with length of `n`, it only includes lowercase letters. You are given a string `S`. Find the number of substrings of `S` such that each of the 26 lowercase letters appeared exactly once.

<br>

**Input Format:**\
The first and only line of input includes a single string `S`.

**Output Format:**\
The number of substrings that satisfies the given statement.

<br>

**Sample Input:**
```markdown
abcdefghijklmnopqrstuvwxyzabcd
```

**Sample Output:**
```markdown
5
```

<br>

| Subtask #  | Score  | Bounds |
| :----:     | :----: | :---- |
| _1_ | 10     | $\|S\| = 26$ |
| _2_ | 35     | $\|S\| \leq 500$ |
| _3_ | 40     | $\|S\| \leq 10000$ |
| _4_ | 15     | $\|S\| \leq 1000000$ |

---

### 200E

**Problem Statement:**\
(This is an interactive problem)\
There is one mountain from x = 1 to x = 1000.\
The mountain only contains one peak and its height monotonically increases (from some height) and then decreases (to some height).\
You have two types of queries:
-   type 1: query height of one location (at "x").
-   type 2: ask if the answer is correct.

You have to determine the highest peak in these mountains (output by '!' and then followed by your answer). The amount of queries you use will determine your score.

<br>

**Interactive Format:**\
In order to query the height of location x, output a `?` follow by a space and the location x.
- For exmaple: `? 1` queries the height at location 1.

After you make the query, the interactor will return an integer, representing the height at that location.

In order to output your answer, print a `!` followed by a space and you answer.
- For example: `! 100` outputs 100 as your answer.

Here is an example interaction:
```markdown
? 1
2
? 100
100
! 100
```
In this example, the second and fourth line are the output from the interactor that you can then use cin to get. The first, third and fifth line are the outputs by your program, with the first two being queires and fifth one answering the problem.\
(This is just an exaple, it does not have any logic)

<br>

| Subtask #  | Score  | # of Queries Used At Most |
| :----:     | :----: | :----: |
| _1_ | 10     | $1000$ |
| _2_ | 20     | $200$ |
| _3_ | 20     | $100$ |
| _4_ | 20     | $50$ |
| _5_ | 10     | $40$ |
| _6_ | 20     | $30$ |