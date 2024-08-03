---
title: NOI 2024 - 树的定向 (Tree)
published: 2024-08-03
description: 'Editorial'
image: ''
tags: [HLD, Small To Large Merging, BIT, DSU]
category: 'NOI'
draft: false 
---

<a href="https://qoj.ac/contest/1747/problem/9157" target="_blank"> Problem Link </a>

## Partial Solution 1

First of all, the bruteforce solution is simple to understand and implement, so we will skip it. Then we can take a closer look at special property A:

:::note[Observations]
- Notice that if in a pair (ai, bi), ai and bi are never adjacent on the tree, then we can color the vertices of the tree with red and blue such that no two vertices of the same color are adjacent.
- Then there are only two possible good orientations: either connect all red vertices to blue vertices, or connect all blue vertices to red vertices.
:::

Therefore, we just need to set the orientation of the first edge to 0 and then determine the orientations of the other edges accordingly.

## Partial Solution 2

Here we need to do some smart things...

:::note[Small Trick]
Now we can consider how to determine if there exists a valid orientation of the edges after fixing the orientations of some edges (just assume we already did, although we start without any).

1. If a pair $(a_i, b_i)$ satisfies the condition that there is already an edge in the reverse direction along the path from $a_i$ to $b_i$, then $a_i$ can no longer reach $b_i$. In this case, remove this pair from consideration.
2. If a pair $(a_i, b_i)$ does not satisfy the condition, it indicates that no valid orientation exists.
3. If a pair $(a_i, b_i)$ satisfies the condition where there is no reverse edge on the path from $a_i$ to $b_i$ and exactly one edge remains unassigned, then the orientation of this remaining edge must be the reverse of the direction on the path from $a_i$ to $b_i$. Set the orientation of this edge accordingly and remove the pair from consideration.

Continue this process of removing pairs until no more operations can be performed. At this point, we will have reduced the problem to a special case with property A. Hence, a valid orientation always exists.
:::

For each pair $(a_i, b_i)$, we maintain the count of edges with undetermined orientations and reverse edges along the path from $a_i$ to $b_i$. After determining the orientation of an edge, we update all pairs that include this edge. This approach allows us to solve the problem in $O(nm)$ time.

By performing $O(n)$ such checks, we can find the lexicographically smallest orientation. This results in an $O(n^2 m)$ algorithm.

### Optimization #1

Note that we don't need to redo everything from scratch each time. Instead, we can simultaneously perform the pair deletion operations while determining the lexicographically smallest orientation.

1. **For a pair $(a_i, b_i)$**: If there is already a reverse edge on the path from $a_i$ to $b_i$, then we don't need to consider this path anymore.

2. **For a pair $(a_i, b_i)$**: If there are no reverse edges on the path from $a_i$ to $b_i$ and exactly one edge remains unassigned, then the orientation of this edge must be the reverse of the orientation on the path from $a_i$ to $b_i$. We set the orientation of this edge accordingly and remove this pair from consideration.

3. **If no removable pairs are found**: We identify the first edge with an undetermined orientation and set its orientation to 0. (Similar to the analysis for property A, it can be proven that a valid orientation still exists with this approach.)

By following this strategy, we efficiently determine the orientation while maintaining the lexicographical order, leading to a more efficient, $O(nm)$, solution.

## Full Solution

We maintain a queue of "pending" edges. The goal is to ensure that after determining the orientation of an edge, we identify all new pending pairs $(a_i, b_i)$ such that:

- There is exactly one edge along the path from $a_i$ to $b_i$ with an undetermined orientation.
- All other edges along the path from $a_i$ to $b_i$ have orientations that match the direction of the path from $a_i$ to $b_i$.

There are a lot of ways to optimize this, I used small to large merging combined with DSU. I also used LCA with HLD, and Binary Indexed Tree to efficiently calculate and update the reversions.

Please do be aware that these implementation have a very large constant. Especially my solution, it will require you to have a really good constant factor (or just submit it 10 times, surely one will pass).

## Full Implementation

```cpp
// Eating, bathing, having a girlfriend, having an active social life is incidental, it gets in the way of code time.
// Writing code is the primary force that drives our lives so anything that interrupts that is wasteful.
#include <bits/stdc++.h>
using namespace std;
/************************************/
inline int64_t read() { int64_t x = 0, f = 1; char ch = getchar(); while (ch<'0'|| ch>'9') { if(ch == '-') f = -1; ch = getchar(); } while (ch >= '0' && ch <= '9') { x = x * 10 + ch - '0'; ch = getchar();} return x * f; }
inline int read(char *s) { char ch = getchar(); int i = 1; while (ch == ' ' || ch == '\n') ch = getchar(); while (ch != ' ' && ch != '\n') s[i++] = ch, ch = getchar(); s[i] = '\0'; return i - 1; }
#define fileio(x) freopen((string(x) + ".in").c_str(), "r", stdin), freopen((string(x) + ".out").c_str(), "w", stdout)
typedef int64_t ll; typedef pair<int, int> pii; typedef pair<ll, ll> pll; typedef long double ld;
#define fi first
#define se second
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
const int N = 500001;

int n, m;

int U[N], V[N], fr[N], to[N], tp[N], ans[N];
vector<int> G[N];

struct bit {
    int c[N];
    inline int lowbit(int p) { return p & -p; }
    inline void add(int p, int w) {
        for (; p <= n; p += lowbit(p))
            c[p] += w;
    }
    inline int qry(int p) {
        int res = 0;
        for (; p; p -= lowbit(p))
            res += c[p];
        return res;
    }
} eu, ed;

namespace hld {
    int cnt = 0;
    int dfn[N], low[N], sz[N], dep[N], hs[N], tp[N], fa[N];

    void dfs1(int p, int f) {
        fa[p] = f, dep[p] = dep[f] + 1, sz[p] = 1, hs[p] = 0;
        dfn[p] = ++cnt;

        for (int v : G[p]) {
            if (v == f)
                continue;
            dfs1(v, p);
            sz[p] += sz[v];
            if (sz[v] > sz[hs[p]])
                hs[p] = v;
        }

        low[p] = cnt;
    }

    void dfs2(int p, int top) {
        tp[p] = top;
        if (hs[p])
            dfs2(hs[p], top);
        for (int v : G[p]) {
            if (v == fa[p] || v == hs[p])
                continue;
            dfs2(v, v);
        }
    }

    inline int lca(int u, int v) {
        while (tp[u] != tp[v]) {
            if (dep[tp[u]] < dep[tp[v]])
                swap(u, v);
            u = fa[tp[u]];
        }
        return dep[u] < dep[v] ? u : v;
    }

    inline void build() {
        dfs1(1, 0);
        dfs2(1, 1);
    }
} // namespace hld
using hld::dfn, hld::low;

namespace dsu {
    queue<int> que;

    set<pii> edg[N], npi[N];
    int par[N];

    inline void init(int n) {
        iota(par + 1, par + n + 1, 1);
    }

    inline int find(int x) { return par[x] == x ? x : par[x] = find(par[x]); }

    inline bool chk(int p) {
        if (ed.qry(dfn[fr[p]]) - ed.qry(dfn[tp[p]]) + eu.qry(dfn[to[p]]) - eu.qry(dfn[tp[p]]))
            return false;
        return true;
    }
} // namespace dsu
using namespace dsu;

inline void chg(int p, int si) { // change one edge and change the answer
    ans[p] = si;
    int u = U[p], v = V[p];
    if (hld::fa[u] == v)
        swap(u, v), si ^= 1;

    if (si)
        eu.add(dfn[v], 1), eu.add(low[v] + 1, -1);
    else
        ed.add(dfn[v], 1), ed.add(low[v] + 1, -1);

    que.push(p);
}

inline void updans() { // update the answer array.
    while (!que.empty()) {
        int p = que.front();
        que.pop();

        int u = find(U[p]), v = find(V[p]), si = ans[p];
        int szu = edg[u].size() + npi[u].size(), szv = edg[v].size() + npi[v].size();
        if (szu < szv)
            swap(u, v), swap(szu, szv), si ^= 1;

        for (auto e : edg[v]) {
            auto it = npi[u].lower_bound(make_pair(e.fi, 0));
            while (it != npi[u].end() && it->fi == e.fi) {
                if (chk(it->se))
                    if (ans[e.se] == -1)
                        chg(e.se, find(U[e.se]) == v ? si ^ 1 : si);

                npi[e.fi].erase(make_pair(u, it->se)), npi[u].erase(it);
                it = npi[u].lower_bound(make_pair(e.fi, 0));
            }
        }

        vector<pii> qvc;
        for (auto c : npi[v]) {
            auto it = edg[u].lower_bound(make_pair(c.fi, 0));
            if (it != edg[u].end() && it->fi == c.fi) {
                if (chk(c.se))
                    if (ans[it->se] == -1)
                        chg(it->se, find(U[it->se]) == u ? si : si ^ 1);
                qvc.emplace_back(c);
            }
        }

        for (auto c : qvc) {
            npi[v].erase(c);
            npi[c.fi].erase(make_pair(v, c.se));
        }

        for (auto e : edg[v]) {
            if (e.fi != u) {
                edg[u].insert(e);
                edg[e.fi].insert(make_pair(u, e.se));
            }
            edg[u].erase(make_pair(v, e.se));
        }

        for (auto c : npi[v]) {
            npi[c.fi].erase(make_pair(v, c.se));
            npi[u].insert(c);
            npi[c.fi].insert(make_pair(u, c.se));
        }

        par[v] = u;
    }
}

inline void solve() {
    int c = read();
    n = read(), m = read();
    init(n);
    fill(ans, ans + n + 1, -1);

    for (int i = 1; i < n; i++) {
        U[i] = read(), V[i] = read(), G[U[i]].emplace_back(V[i]), G[V[i]].emplace_back(U[i]);
        edg[V[i]].insert(make_pair(U[i], i)), edg[U[i]].insert(make_pair(V[i], i));
    }

    hld::build();

    for (int i = 1; i <= m; i++) {
        fr[i] = read(), to[i] = read(), tp[i] = hld::lca(fr[i], to[i]);
        npi[to[i]].insert(make_pair(fr[i], i)), npi[fr[i]].insert(make_pair(to[i], i));
    }

    for (int i = 1; i < n; i++) {
        int u = U[i], v = V[i];
        auto it = npi[u].lower_bound(make_pair(v, 0));
        while (it != npi[u].end() && it->fi == v) {
            if (ans[i] == -1)
                chg(i, fr[it->se] == u);
            npi[v].erase(make_pair(u, it->se));
            npi[u].erase(it);
            it = npi[u].lower_bound(make_pair(v, 0));
        }
    }

    updans();

    for (int i = 1; i < n; i++)
        if (ans[i] == -1)
            chg(i, 0), updans();

    for (int i = 1; i < n; i++)
        putchar(ans[i] + '0');
    puts("");
}

signed main() {
    solve();
    return 0;
}
```