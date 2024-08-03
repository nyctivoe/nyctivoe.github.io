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

## Full Implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<int, int> pii;
#define fi first
#define se second

int n, m;

vector<int> U, V, fr, to, tp, ans;
vector<vector<int>> G;

struct bit {
    vector<int> c;
    inline void init(int n) { c.resize(n + 1); }
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
    vector<int> dfn, low, sz, dep, hs, tp, fa;

    inline void init(int n) {
        cnt = 0;
        dfn.resize(n + 1), low.resize(n + 1), dep.resize(n + 1), sz.resize(n + 1), hs.resize(n + 1),
            tp.resize(n + 1), fa.resize(n + 1);
    }

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
        init(n);
        dfs1(1, 0);
        dfs2(1, 1);
    }
} // namespace hld
using hld::dfn, hld::low;

namespace dsu {
    queue<int> que;

    vector<set<pii>> edg, npi;
    vector<int> par;

    inline void init(int n) {
        par.resize(n + 1);
        iota(par.begin(), par.end(), 0);
        edg.resize(n + 1), npi.resize(n + 1);
    }

    inline int find(int x) { return par[x] == x ? x : par[x] = find(par[x]); }

    inline bool chk(int p) {
        if (ed.qry(dfn[fr[p]]) - ed.qry(dfn[tp[p]]) + eu.qry(dfn[to[p]]) - eu.qry(dfn[tp[p]]))
            return false;
        return true;
    }

    void chg(int p, int si) {
        if (ans[p] != -1)
            return;
        ans[p] = si;
        int u = U[p], v = V[p];
        if (hld::fa[u] == v)
            swap(u, v), si ^= 1;
        if (si)
            eu.add(dfn[v], 1), eu.add(low[v] + 1, -1);
        else
            ed.add(dfn[v], 1), ed.add(low[v] + 1, -1);
        dsu::que.push(p);
    }
} // namespace dsu
using namespace dsu;

inline void solve() {
    int c;
    cin >> c >> n >> m;
    ed.init(n), eu.init(n);
    dsu::init(n);
    ans.resize(n + 1, -1);
    U.resize(n + 1), V.resize(n + 1);
    G.resize(n + 1);

    for (int i = 1; i < n; i++) {
        cin >> U[i] >> V[i], G[U[i]].push_back(V[i]), G[V[i]].push_back(U[i]);
        edg[V[i]].insert({U[i], i}), edg[U[i]].insert({V[i], i});
    }

    hld::build();

    fr.resize(m + 1), to.resize(m + 1), tp.resize(m + 1);
    for (int i = 1; i <= m; i++) {
        cin >> fr[i] >> to[i], tp[i] = hld::lca(fr[i], to[i]);
        npi[to[i]].insert({fr[i], i}), npi[fr[i]].insert({to[i], i});
    }

    for (int i = 1; i < n; i++) {
        int u = U[i], v = V[i];
        auto it = dsu::npi[u].lower_bound({v, 0});
        while (it != dsu::npi[u].end() && it->fi == v) {
            dsu::chg(i, fr[it->se] == u);
            dsu::npi[v].erase({u, it->se});
            dsu::npi[u].erase(it);
            it = dsu::npi[u].lower_bound({v, 0});
        }
    }

    auto upd = [&]() -> void {
        while (!que.empty()) {
            int p = que.front();
            que.pop();

            int u = find(U[p]), v = find(V[p]), si = ans[p];
            int su = edg[u].size() + npi[u].size();
            int sv = edg[v].size() + npi[v].size();
            if (su < sv)
                swap(u, v), swap(su, sv), si ^= 1;
            for (auto e : edg[v]) {
                auto it = npi[u].lower_bound({e.fi, 0});
                while (it != npi[u].end() && it->fi == e.fi) {
                    if (chk(it->se))
                        chg(e.se, find(U[e.se]) == v ? si ^ 1 : si);
                    npi[e.fi].erase({u, it->se});
                    npi[u].erase(it);
                    it = npi[u].lower_bound({e.fi, 0});
                }
            }

            vector<pii> pw;
            for (auto c : npi[v]) {
                auto it = edg[u].lower_bound({c.fi, 0});
                if (it != edg[u].end() && it->fi == c.fi) {
                    if (chk(c.se))
                        chg(it->se, find(U[it->se]) == u ? si : si ^ 1);
                    pw.push_back(c);
                }
            }
            
            for (const auto c : pw) {
                npi[v].erase(c);
                npi[c.fi].erase({v, c.se});
            }

            for (const auto e : edg[v]) {
                if (e.fi != u) {
                    edg[u].insert(e);
                    edg[e.fi].insert({u, e.se});
                }
                edg[u].erase({v, e.se});
            }

            for (const auto c : npi[v]) {
                npi[u].insert(c);
                npi[c.fi].erase({v, c.se});
                npi[c.fi].insert({u, c.se});
            }
            
            par[v] = u;
        }
    };

    upd();

    for (int i = 1; i < n; i++) {
        if (ans[i] == -1)
            dsu::chg(i, 0), upd();
    }

    for (int i = 1; i < n; i++)
        cout << char('0' + ans[i]);
    cout << "\n";
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    solve();
    return 0;
}
```