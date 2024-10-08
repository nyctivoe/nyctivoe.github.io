---
title: SDOI 2018 - 战略游戏 (Strategy Game)
published: 2024-07-29
description: 'Editorial'
image: ''
tags: [Block Cut Tree, LCA]
category: 'SDOI'
draft: false 
---

<a href="https://loj.ac/p/2562" target="_blank"> Problem Link </a>

## Problem Statement:

Given a simple undirected connected graph. There are $q$ queries:

Each time, a set of points $S$ (where $2 \le |S| \le n$) is given, and you are asked how many points $u$ satisfy $u \notin S$ such that after deleting $u$, the points in $S$ are not all in the same connected component.

Each test point has multiple sets of data.

## Solution:

First, construct the block-cut tree, then the problem becomes asking for the number of circle nodes in the connected subgraph corresponding to $S$ in the circle-square tree, minus $|S|$.

How to calculate the number of circle nodes in the connected subgraph? Here is one method:
- Assign the weight of the circle node to the edge between it and its parent square node, and the problem transforms into finding the sum of edge weights. Then sort the points in $S$ according to their DFS order, and calculate the sum of distances between adjacent points in the sorted order (also include the distance between the first and last points). The answer is half of this distance sum, because each edge is traversed twice. If the node with the shallowest depth in the subgraph is a circle node, the answer needs to be incremented by 1, because we have not counted it.

Since there are multiple sets of data, make sure to initialize the arrays properly.

## Full Implementation:
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
ll mod = 1e9 + 7;
#define fi first
#define se second
inline int64_t min(int64_t a, int64_t b) { return a < b ? a : b; } inline int64_t max(int64_t a, int64_t b) { return a > b ? a : b; }
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
const ll N = 2e5 + 5;

ll n, m;

vector<int> G[N];
vector<int> T[N << 1];

namespace blockcircletree {
    int dfn[N << 1], low[N], dfc, cnt;
    int stk[N], tp;

    void Tarjan(int u) {
        low[u] = dfn[u] = ++dfc;
        stk[++tp] = u;
        for (int v : G[u]) {
            if (!dfn[v]) {
                Tarjan(v);
                low[u] = min(low[u], low[v]);
                if (low[v] == dfn[u]) {
                    cnt++;
                    for (int x = 0; x != v; --tp) {
                        x = stk[tp];
                        T[cnt].push_back(x);
                        T[x].push_back(cnt);
                    }
                    T[cnt].push_back(u);
                    T[u].push_back(cnt);
                }
            } else
                low[u] = min(low[u], dfn[v]);
        }
    }
}
using namespace blockcircletree;

namespace hld {
    int fa[N], dep[N], siz[N], son[N], top[N], id[N], rk[N], w[N], dis[N], cnt;
    void dfs1(int p, int f) {
        fa[p] = f, dep[p] = dep[f] + 1, siz[p] = 1, son[p] = 0;
        dis[p] = dis[f] + (p <= n);
        for (int v : T[p]) {
            if (v == f)
                continue;
            dfs1(v, p);
            siz[p] += siz[v];
            if (siz[v] > siz[son[p]])
                son[p] = v;
        }
    }

    void dfs2(int p, int tp) {
        top[p] = tp, id[p] = ++cnt, rk[cnt] = p;
        if (son[p])
            dfs2(son[p], tp);
        for (int v : T[p]) {
            if (v == fa[p] || v == son[p])
                continue;
            dfs2(v, v);
        }
    }
    void init() { cnt = 0; dfs1(1, 0), dfs2(1, 1); }
    inline int lca(int u, int v) {
        while (top[u] != top[v]) {
            if (dep[top[u]] < dep[top[v]]) swap(u, v);
            u = fa[top[u]];
        }
        return dep[u] < dep[v] ? u : v;
    }
}

inline void solve() {
    n = read(), m = read();
    for (int i = 1; i <= n; i++)
        G[i].clear(), dfn[i] = 0, low[i] = 0;
    for (int i = 1; i <= n * 2; i++)
        T[i].clear();

    for (int i = 1; i <= m; i++) {
        int u = read(), v = read();
        G[u].push_back(v), G[v].push_back(u);
    }

    cnt = n, dfc = 0;
    Tarjan(1), tp = 0;
    hld::init();

    int q = read();
    for (int i = 1; i <= q; i++) {
        int s = read();
        vector<int> c; c.push_back(0);
        for (int i = 1; i <= s; i++)
            c.push_back(read());
        sort(c.begin() + 1, c.end(), [&](int a, int b) { return hld::id[a] < hld::id[b]; });
        int ans = - 2 * s;
        for (int j = 1; j <= s; ++j) {
            int u = c[j], v = c[j % s + 1];
            ans += hld::dis[u] + hld::dis[v] - 2 * hld::dis[hld::lca(u, v)];
        }

        printf("%d\n", (ans / 2) + (hld::lca(c[1], c[s]) <= n));
    }
}

signed main() {
    int t = read();
    while (t--)
        solve();

    return 0;
}
```
