---
title: AC Automaton Tutorial
published: 2024-08-13
description: ''
image: ''
tags: [AC Automaton]
category: 'Tutorial'
draft: false 
---

For finding how many times a `pattern string` occured in the `original string`, we have an efficient algorithm: `kmp`. The core concept of `kmp` is simple: we will efficiently find the closest transition next possible position after the strings starting at some position in the `original string` failed to match the `pattern string`. We can construct the array called `fail` as as the longest possible prefix that would match a suffix of the same length for all suffix of the `pattern string`.

However, what if we have multiple `pattern strings` and we want to know how many times? Then there comes AC Automaton. The core concept if exactly the same as kmp. We can first insert all `pattern string`s into a trie. Then we will construct `fail pointer` for each node in the trie.

Consider the current node $u$ in the trie. The parent of $u$ is $p$, and $p$ points to $u$ through an edge labeled with character $c$, i.e., $trie[p, c] = u$. Assume that the fail pointers for all nodes at a depth less than $u$ have already been computed.

1. If $trie[fail[p], c]$ exists, then set the fail pointer of $u$ to $[trie[fail[p], c]]$. This is equivalent to adding a character $c$ after $p$ and $fail[p]$, which corresponds to $u$ and $fail[u]$, respectively.
2. If $trie[fail[p], c]$ does not exist, continue by finding $trie[fail[fail[p]], c]$. Repeat the process from step 1, following the fail pointers up to the root node.
3. If no such node is found, set the fail pointer of $u$ to the root node.

This completes the construction of the fail pointer for $u$.

### Full Implementation for AC Automaton
```cpp
namespace acAuto {
    int cnt = 0, rt = 0;
    int tr[N << 3][26], e[N << 3], id[N << 3], fail[N << 3];

    inline void clear() {
        for (int i = 0; i <= cnt; i++)
            fill(tr[i], tr[i] + 26, 0);
    }

    void insert(char *s, int curId) {
        debugArr(s + 1, strlen(s + 1));
        int u = rt;
        for (int i = 1; s[i]; i++) {
            int c = s[i] - 'a';
            if (!tr[u][c])
                tr[u][c] = ++cnt, u = cnt;
            else
                u = tr[u][c];
        }
        e[u]++;
        id[u] = curId;
    }

    int query(char *s, int curId) {
        int u = rt, res = 0;
        for (int i = 1; s[i]; i++) {
            int c = s[i] - 'a';
            u = tr[u][c];
            for (int j = u; j && e[j] != -1; j = fail[j])
                res += (curId >= id[j]) ? (e[j]) : 0; // most time consuming part of AC Automaton
        }
        return res;
    }
} // namespace acAuto
using namespace acAuto;
```

## Additional Tricks

Let's think about the most time consuming part of the above implementation. It must be the part where we enumerate through the fail edges to collect answer. Also, it's simple to understand that all fail edges connected together will form a tree. Therefore, why don't we construct a tree with `fail pointers`? We call this the `fail tree`. In many instances we can just store a value within each node on the `fail tree` and calculate answer efficiently here with `dfn`, `low`, and one of `segment tree` and `binary indexed tree`.

**Example:**
<a href="https://codeforces.com/problemset/problem/163/E" target="_blank"> CF163E e-Government </a>

### Solution

When faced with multi-pattern matching, the first thing that comes to mind is the AC Automaton. However, this problem involves deleting original strings, so we need to modify the multi-pattern matching template of the AC automaton.

### Standard AC-Automaton

1. **Build a Trie**: Construct a Trie where each string's end node is marked with `end = 1`.
2. **Build the Fail Tree**: Construct a fail tree and a Trie graph. When building the fail tree, propagate the end node count down along the tree edges. 
3. **Traversal**: Traverse the Trie graph and accumulate the end values of the nodes you reach to get the result.

### How to Handle the Problem

It's clear that the `end` value of a node is the count of strings ending at that node plus the count of strings ending at its ancestor nodes in the fail tree.

To delete a string, you need to:

1. Find the node corresponding to the last character of the string.
2. Subtract 1 from the `end` values of all nodes in the subtree of this node in the fail tree (i.e., all nodes that have this node as an ancestor).

In other words, deletion and addition operations involve adjusting the weights of nodes in the tree: adding 1 or subtracting 1 from the `end` value of the nodes in the subtree.

Similarly, for querying, you simply need to get the weight of a node in the tree.

After preprocessing the tree using a DFS order, the operations can be handled using a standard segment tree or Binary Indexed Tree (BIT) for range updates and point queries.

### Full Implementation
```cpp
#include <bits/stdc++.h>
using namespace std;
/******************************************************************/
#ifdef LOCAL
#include <bits/debugg.h>
#else
#define debug(...)
#define debugArr(...)
#endif
/******************************************************************/
#define fileio(x)                                                                      \
    freopen((string(x) + ".in").c_str(), "r", stdin),                                  \
        freopen((string(x) + ".out").c_str(), "w", stdout)
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef long double ld;
typedef vector<int> vi;
typedef vector<ll> vl;
typedef vector<vector<int>> vvi;
typedef vector<vector<ll>> vvl;
#define eb emplace_back
#define fi first
#define se second
/******************************************************************/
#ifdef LOCAL
const int N = 2e2 + 5;
#else
const int N = 1e6 + 5;
#endif

int n, k;
string op;

namespace sgt {
	int va[N * 6];
	void add(int p, int pl, int pr, int x, int y, int v) {
		if (x <= pl && pr <= y) {
			va[p] += v;
			return;
		}
		int mid = (pl + pr) >> 1;
		if (x <= mid)
			add(p << 1, pl, mid, x, y, v);
		if (mid < y)
			add(p << 1 | 1, mid + 1, pr, x, y, v);
	}
	void add(int x, int y, int v) {
		add(1, 1, N - 1, x, y, v);
	}
	int qry(int p, int l, int r, int x) {
		if (l == r)
			return va[p];
		int mid = (l + r) >> 1;
		if (x <= mid)
			return va[p] + qry(p << 1, l, mid, x);
		else
			return va[p] + qry(p << 1 | 1, mid + 1, r, x);
	}
	int qry(int x) {
		return qry(1, 1, N - 1, x);
	}
}

namespace acAuto {
	int ch[N][26], fail[N], e[N], tot;
	void insert(char *a, int id) {
		int p = 0;
		for (int i = 1; a[i]; i++) {
			int c = a[i] - 'a';
			if (!ch[p][c])
				ch[p][c] = ++tot;
			p = ch[p][c];
		}
		e[id] = p;
	}

	queue<int> q;
	vi G[N];
	void buildFail() {
		for (int i = 0; i < 26; i++)
			if (ch[0][i])
				q.push(ch[0][i]), G[0].eb(ch[0][i]);
		while (!q.empty()) {
			int p = q.front();
			q.pop();
			for (int i = 0; i < 26; i++) {
				if (ch[p][i]) {
					fail[ch[p][i]] = ch[fail[p]][i];
					G[fail[ch[p][i]]].eb(ch[p][i]);
					q.push(ch[p][i]);
				} else {
					ch[p][i] = ch[fail[p]][i];
				}
			}
		}
	}

	int fa[N], dfn[N], low[N], tim = 0;
	void dfs(int p, int f) {
		dfn[p] = ++tim;
		fa[p] = f;
		for (auto i : G[p])
			dfs(i, p);
		low[p] = tim;
	}

	int query(char *s) {
		int p = 0, res = 0;
		for (int i = 1; s[i]; i++) {
			int c = s[i] - 'a';
			p = ch[p][c];
			res += sgt::qry(dfn[p]);
			debug(res);
		}
		return res;
	}
}
using namespace acAuto;

bitset<N> rmv;

char s[N * 10];
inline void solve() {
	scanf("%d%d", &n, &k);
	for (int i = 1; i <= k; i++) {
		scanf("%s", s + 1);
		insert(s, i);
	}
	buildFail();
	dfs(0, 0);
	for (int i = 1; i <= k; i++) {
		sgt::add(dfn[e[i]], low[e[i]], 1);
		debug(dfn[e[i]], low[e[i]]);
	}

	for (int i = 1; i <= n; i++) {
		scanf("%s", s);
		debug(s);
		if (s[0] == '?') {
			printf("%d\n", query(s));
		} else if (s[0] == '+') {
			int x = 0;
			for (int j = 1; s[j]; j++)
				x = x * 10 + s[j] - '0';
			if (rmv[x]) {
				rmv[x] = 0;
				sgt::add(dfn[e[x]], low[e[x]], 1);
			}
		} else {
			int x = 0;
			for (int j = 1; s[j]; j++)
				x = x * 10 + s[j] - '0';
			if (!rmv[x]) {
				rmv[x] = 1;
				sgt::add(dfn[e[x]], low[e[x]], -1);
			}
		}
		debug(i, s, rmv);
	}
}

signed main() {
	solve();

	return 0;
}
```