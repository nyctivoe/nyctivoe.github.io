---
title: qoj Colorful Tree
published: 2024-07-24
description: 'Observations and Segment Trees'
image: ''
tags: [qoj, Graph Theory, Segment Tree]
category: 'qoj'
draft: false
---

<a href="https://qoj.ac/contest/911/problem/3845" target="_blank"> Problem Link </a>

## Prerequisites

1. Segment Tree (One that can dynamically create points, instead of prebuilding all trees)
2. Sparse Table for LCA

## Problem Description

You start off with a node of color `c`. Then there are in total q operations of 2 types:
1. 0 x c d: add a an edge with length d between a new point with index 1 higher than the last point to vertex `x`, and paint it with color `c`.
2. 1 x c: Change the vertex `x` to color `c`.
For each of those operations, you have to output the maximum distance of two vertices with distinct color on a tree.

## Solution

### LCA and Finding Distance Between Pairs of Nodes

So first we realize that there aren't really **deletion** operations in the problem, meaning operations after won't affect the tree's edges, other than adding more to it. Therefore, when we want to query the lca and distance on the tree, we can just use a sparse table and precompute everything after reading it in.
- The time complexity is $O(n\log_2n)$ precompute and $O(1)$ query.
- The space complexity is $O(n\log_2n)$.

**Implementation:**

```cpp
vector<pii> adj[N];

namespace sparsetable {
    const int K = 20;
    int dep[N * 2], fio[N * 2];
    pii st[N * 2][K];
    vector<int> et;
    bitset<N> vis;
    ll dist[N];

    void dfs(int p, int d) {
        vis[p] = true;
        dep[p] = d;
        fio[p] = et.size() + 1; // 1-indexed
        et.emplace_back(p);
        for (auto to : adj[p]) {
            if (!vis[to.fi]) {
                dfs(to.fi, d + 1);
                et.emplace_back(p);
            }
        }
    }

    void builddist(int p, int f) {
        for (auto to : adj[p]) {
            if (to.fi != f) {
                dist[to.fi] = dist[p] + to.se;
                builddist(to.fi, p);
            }
        }
    }

    inline void buildsparse() {
        int n = et.size();
        for (int i = 1; i <= n; i++)
            st[i][0] = make_pair(dep[et[i-1]], et[i-1]); // 1-indexed
        
        for (int j = 1; (1 << j) <= n; j++)
            for (int i = 1; i + (1 << j) - 1 <= n; i++)
                st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]); // 1-indexed
    }

    inline int lca(int u, int v) {
        int le = fio[u], ri = fio[v];
        if (le > ri) swap(le, ri);
        int j = __lg(ri - le + 1);
        return min(st[le][j], st[ri - (1 << j) + 1][j]).se; // 1-indexed
    }

    inline ll getdis(int u, int v) {
        if (u < 1 || u >= N || v < 1 || v >= N)
            return -1;
        return dist[u] + dist[v] - 2ll * dist[lca(u, v)];
    }
}
```

---

### Isolating Colors and Finding Diameter

The problem includes many colors, so let's first simplify it and think about only one. How can we dynamically maintain this tree such that if we only care about one color? We can use a segment tree to do this. In a node that's responsible to the range `l` to `r`, we can maintain a pair of integers, that represent the longest diameter for vertices with index from `l` to `r`, inclusive. 
In order to understand why that works, we have to first bring in several lemmas:
:::note[Lemma1]
For a set of nodes, we can simply maintain a pair of nodes that makes the diameter (there could be multiple of tese pairs but we can take any pair, I'll explain why formally later). When we want to merge two sets of nodes together and still have the correct pair, we can simply check between the 6 possible configurations between the two pairs of diameters.

Formally speaking, let the diameter of the first set be $(d1_a, d1_b)$ and the second set be $(d2_a, d2_b)$. The new diameter of the merged set will be one of $(d1_a, d1_b)$, $(d1_a, d2_a)$, $(d1_a, d2_b)$, $(d1_b, d2_a)$, $(d1_b, d2_b)$, $(d2_a, d2_b)$.
:::
:::note[Lemma2]
For a set of nodes with diameter $(a, b)$. When appending a now point `p`, we only need to consider $(p, a)$, $(p, b)$, and original $(a, b)$.
:::

The proof is rather intuitive and is left as an excercise for the readers.

Now we realize there are multiple colors, and we have maintain a segment like such for all colors. Therefore, we can have a segment tree that dynamically opens points. We arrive at a solution that as follows (just for this sub-problem):
- The default state of nodes on the segment tree is $(-1, -1)$
- When maintain the information at a point `p` on the segment tree, we can use Lemma 1 on it's left and right son.
- When inserting a node of color `c`, we update the diameter at leaf node as $(i, i)$ where `i` is the index of the vertex. Then we maintain from the leaf node to the root.
- When deleting a node of color `c` from the segment tree, we can treat it as an update of $(-1, -1)$ (effectly reseting the node). Then we maintain from the leaf node to the root.

The final time complexity is $O\log_2n$ update and $O(1)$ query (because we only need the pair at root node). 
The final space complxity is around $40n$.

**Implementation:**
```cpp
namespace colors {
    struct node {
        int ls, rs;
        pii di;
        node() {
            ls = rs = 0;
            di = make_pair(-1, -1);
        }
    } tr[N * 38];

    int cnt = 0;
    inline int newnode() { cnt++; tr[cnt] = node(); return cnt; }
    int rt[N];

    inline void maintain(int p) {
        pii l = tr[p].ls ? tr[tr[p].ls].di : make_pair(-1, -1), r = tr[p].rs ? tr[tr[p].rs].di : make_pair(-1, -1);
        ll dis1 = getdis(l.fi, l.se), dis2 = getdis(l.fi, r.fi), dis3 = getdis(l.fi, r.se), dis4 = getdis(l.se, r.fi), dis5 = getdis(l.se, r.se), dis6 = getdis(r.fi, r.se);
        ll mx = max({dis1, dis2, dis3, dis4, dis5, dis6});
        if (mx == dis1)
            tr[p].di = l;
        else if (mx == dis2)
            tr[p].di = {l.fi, r.fi};
        else if (mx == dis3)
            tr[p].di = {l.fi, r.se};
        else if (mx == dis4)
            tr[p].di = {l.se, r.fi};
        else if (mx == dis5)
            tr[p].di = {l.se, r.se};
        else
            tr[p].di = r;
    }

    void upd(int &p, int pl, int pr, int pos) {
        if (!p) p = newnode();
        if (pl == pr) {
            tr[p].di = make_pair(pos, pos);
            return;
        }
        int mid = (pl + pr) >> 1;
        if (pos <= mid)
            upd(tr[p].ls, pl, mid, pos);
        else
            upd(tr[p].rs, mid + 1, pr, pos);
        maintain(p);
    }

    void del(int &p, int pl, int pr, int pos) {
        if (!p) return;
        if (pl == pr) {
            tr[p].di = make_pair(-1, -1);
            return;
        }
        int mid = (pl + pr) >> 1;
        if (pos <= mid)
            del(tr[p].ls, pl, mid, pos);
        else
            del(tr[p].rs, mid + 1, pr, pos);
        maintain(p);
    }

    void init() {
        for (int i = 1; i <= q + 1; i++)
            rt[i] = 0;
        for (int i = 0; i <= cnt; i++)
            tr[i] = node();
        cnt = 0;
    }

    inline pii getdc(int c) {
        return tr[rt[c]].di;
    }
}
```

---

### Combine Colors together

After being able to dynamically maintain the diameter for each color, we have to think about how to satisfy the **'different color'** requirement. We realize that Lemma 1 in the previous section also kindof works, but only for the same colored pairs. So we consider also using segment tree (but just a regular one this time, since we only need one). We also need different colored node pairs. So, in each node of the segment tree, we will maintain two pairs of nodes (two diameters). But how do we maintain?

Let's set the point that we are trying to maintain be `p`, and its left son and right son to be `ls` and `rs` respectively (realistically $ls = p \times 2$ and $rs = p \times 2 + 1$). Let the most optimial pair of `ls` be $(lss_a, lss_b)$ and the most optimal pair of `rs` be $(rss_a, rss_b)$. Let the different colored pair of `ls` be $(lsd_a, lsd_b)$ and the different colored pait of `rs` be $(rsd_a, rsd_b)$. Then we can check between the 4 possible combinations of the same color pair of `ls` and `rs`, with the already existing different colored pairs (`lsd` and `rsd`). Now we will have the different colored pair for `p`. As for the same colored pair, we can just pick the bigger one out of `lss` and `rss`.

This proposed solution should work, but I was too dumb to realize that it was a thing. So instead, I stored the most optimal same colored pair and most optimal different colored pair. Then I bruteforced all possible combinations.

My solution works but at the cost of must higher constant.

The final time complexity is $O\log_2n$ for update and $O(1)$ for querying the root node.
The final space complexity is around $4n$

**Implementation:**
```cpp
const pair<pii, pii> cst = make_pair(make_pair(-1, -1), make_pair(-1, -1));

namespace sgt {
    struct node {
        pair<pii, pii> di;
        // fi -> same color pair
        // se -> dif color pair
        node() {
            di = cst;
        }
    } tr[N * 4];

    void init(int p, int pl, int pr) {
        tr[p].di = cst;
        if (pl == pr)
            return;
        int mid = (pl + pr) >> 1;
        init(p << 1, pl, mid);
        init(p << 1 | 1, mid + 1, pr);
    }

    inline void maintain(int p) {
        int ls = p << 1, rs = p << 1 | 1;
        tr[p].di.fi = (getdis(tr[ls].di.fi.fi, tr[ls].di.fi.se) > getdis(tr[rs].di.fi.fi, tr[rs].di.fi.se)) ? tr[ls].di.fi : tr[rs].di.fi;

        array<int, 4> ar; ar[0] = tr[ls].di.se.fi, ar[1] = tr[ls].di.se.se, ar[2] = tr[rs].di.se.fi, ar[3] = tr[rs].di.se.se;
        array<int, 4> sm; sm[0] = tr[ls].di.fi.fi, sm[1] = tr[ls].di.fi.se, sm[2] = tr[rs].di.fi.fi, sm[3] = tr[rs].di.fi.se;

        ll mxdis = 0;
        pii res = make_pair(-1, -1);
        ll dis;
        for (auto i : ar)
            for (auto j : sm) {
                if (cl[i] != cl[j]) {
                    dis = getdis(i, j);
                    if (dis > mxdis) {
                        mxdis = dis;
                        res = make_pair(i, j);
                    }
                }
            }

        for (int i = 0; i < 2; i++)
            for (int j = 2; j < 4; j++) {
                int x = sm[i], y = sm[j];
                if (cl[x] != cl[y]) {
                    dis = getdis(x, y);
                    if (dis > mxdis) {
                        mxdis = dis;
                        res = make_pair(x, y);
                    }
                }
            }

        for (int i = 0; i < 4; i++)
            for (int j = i + 1; j < 4; j++) {
                int x = ar[i], y = ar[j];
                if (cl[x] != cl[y]) {
                    dis = getdis(x, y);
                    if (dis > mxdis) {
                        mxdis = dis;
                        res = make_pair(x, y);
                    }
                }
            }

        tr[p].di.se = res;
    }

    void upd(int p, int pl, int pr, int pos, pll d) {
        if (pl == pr) {
            tr[p].di = {d, make_pair(-1, -1)};
            return;
        }
        int mid = (pl + pr) >> 1;
        if (pos <= mid)
            upd(p << 1, pl, mid, pos, d);
        else
            upd(p << 1 | 1, mid + 1, pr, pos, d);
        maintain(p);
    }

    const ll cnm = 0;
    inline ll getans() {
        if (tr[1].di.se == make_pair(-1, -1))
            return 0;
        return max(getdis(tr[1].di.se.fi, tr[1].di.se.se), cnm);
    }
}
```

---

### Puting The Solution Together

For each operation, we should update first in the color segment tree. Then we take the diamter from that color, update it to the segment tree that calculates the most optimal distinct color pair and output that.

The final time complexity is $O(\log_2n)$ for each update and $O(1)$ for query. Therefore, contributing the final time complexity of $O(q\log_2n)$ + reseting segment trees for multi-test. The space complexity is just about enough if you don't use `long long` for every array.

**Full Implementation:**
```cpp
// Eating, bathing, having a girlfriend, having an active social life is incidental, it gets in the way of code time.
// Writing code is the primary force that drives our lives so anything that interrupts that is wasteful.
#pragma GCC optimize("O3","unroll-loops")

#include <bits/stdc++.h>
using namespace std;

typedef long long ll; typedef pair<int, int> pii; typedef pair<ll, ll> pll; typedef long double ld;
ll mod = 1e9 + 7;
#define fi first
#define se second
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
#define ra 1, q + 1
const int N = 5e5 + 5;

int q, c;
vector<pii> adj[N];

namespace sparsetable {
    const int K = 20;
    int dep[N * 2], fio[N * 2];
    pii st[N * 2][K];
    vector<int> et;
    bitset<N> vis;
    ll dist[N];

    void dfs(int p, int d) {
        vis[p] = true;
        dep[p] = d;
        fio[p] = et.size() + 1; // 1-indexed
        et.emplace_back(p);
        for (auto to : adj[p]) {
            if (!vis[to.fi]) {
                dfs(to.fi, d + 1);
                et.emplace_back(p);
            }
        }
    }

    void builddist(int p, int f) {
        for (auto to : adj[p]) {
            if (to.fi != f) {
                dist[to.fi] = dist[p] + to.se;
                builddist(to.fi, p);
            }
        }
    }

    inline void buildsparse() {
        int n = et.size();
        for (int i = 1; i <= n; i++)
            st[i][0] = make_pair(dep[et[i-1]], et[i-1]); // 1-indexed
        
        for (int j = 1; (1 << j) <= n; j++)
            for (int i = 1; i + (1 << j) - 1 <= n; i++)
                st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]); // 1-indexed
    }

    inline int lca(int u, int v) {
        int le = fio[u], ri = fio[v];
        if (le > ri) swap(le, ri);
        int j = __lg(ri - le + 1);
        return min(st[le][j], st[ri - (1 << j) + 1][j]).se; // 1-indexed
    }

    inline ll getdis(int u, int v) {
        if (u < 1 || u >= N || v < 1 || v >= N)
            return -1;
        return dist[u] + dist[v] - 2ll * dist[lca(u, v)];
    }
}

using namespace sparsetable;

int cl[N];
namespace colors {
    struct node {
        int ls, rs;
        pii di;
        node() {
            ls = rs = 0;
            di = make_pair(-1, -1);
        }
    } tr[N * 38];

    int cnt = 0;
    inline int newnode() { cnt++; tr[cnt] = node(); return cnt; }
    int rt[N];

    inline void maintain(int p) {
        pii l = tr[p].ls ? tr[tr[p].ls].di : make_pair(-1, -1), r = tr[p].rs ? tr[tr[p].rs].di : make_pair(-1, -1);
        ll dis1 = getdis(l.fi, l.se), dis2 = getdis(l.fi, r.fi), dis3 = getdis(l.fi, r.se), dis4 = getdis(l.se, r.fi), dis5 = getdis(l.se, r.se), dis6 = getdis(r.fi, r.se);
        ll mx = max({dis1, dis2, dis3, dis4, dis5, dis6});
        if (mx == dis1)
            tr[p].di = l;
        else if (mx == dis2)
            tr[p].di = {l.fi, r.fi};
        else if (mx == dis3)
            tr[p].di = {l.fi, r.se};
        else if (mx == dis4)
            tr[p].di = {l.se, r.fi};
        else if (mx == dis5)
            tr[p].di = {l.se, r.se};
        else
            tr[p].di = r;
    }

    void upd(int &p, int pl, int pr, int pos) {
        if (!p) p = newnode();
        if (pl == pr) {
            tr[p].di = make_pair(pos, pos);
            return;
        }
        int mid = (pl + pr) >> 1;
        if (pos <= mid)
            upd(tr[p].ls, pl, mid, pos);
        else
            upd(tr[p].rs, mid + 1, pr, pos);
        maintain(p);
    }

    void del(int &p, int pl, int pr, int pos) {
        if (!p) return;
        if (pl == pr) {
            tr[p].di = make_pair(-1, -1);
            return;
        }
        int mid = (pl + pr) >> 1;
        if (pos <= mid)
            del(tr[p].ls, pl, mid, pos);
        else
            del(tr[p].rs, mid + 1, pr, pos);
        maintain(p);
    }

    void init() {
        for (int i = 1; i <= q + 1; i++)
            rt[i] = 0;
        for (int i = 0; i <= cnt; i++)
            tr[i] = node();
        cnt = 0;
    }

    inline pii getdc(int c) {
        return tr[rt[c]].di;
    }
}

const pair<pii, pii> cst = make_pair(make_pair(-1, -1), make_pair(-1, -1));

namespace sgt {
    struct node {
        pair<pii, pii> di;
        // fi -> same color pair
        // se -> dif color pair
        node() {
            di = cst;
        }
    } tr[N * 4];

    void init(int p, int pl, int pr) {
        tr[p].di = cst;
        if (pl == pr)
            return;
        int mid = (pl + pr) >> 1;
        init(p << 1, pl, mid);
        init(p << 1 | 1, mid + 1, pr);
    }

    inline void maintain(int p) {
        int ls = p << 1, rs = p << 1 | 1;
        tr[p].di.fi = (getdis(tr[ls].di.fi.fi, tr[ls].di.fi.se) > getdis(tr[rs].di.fi.fi, tr[rs].di.fi.se)) ? tr[ls].di.fi : tr[rs].di.fi;

        array<int, 4> ar; ar[0] = tr[ls].di.se.fi, ar[1] = tr[ls].di.se.se, ar[2] = tr[rs].di.se.fi, ar[3] = tr[rs].di.se.se;
        array<int, 4> sm; sm[0] = tr[ls].di.fi.fi, sm[1] = tr[ls].di.fi.se, sm[2] = tr[rs].di.fi.fi, sm[3] = tr[rs].di.fi.se;

        ll mxdis = 0;
        pii res = make_pair(-1, -1);
        ll dis;
        for (auto i : ar)
            for (auto j : sm) {
                if (cl[i] != cl[j]) {
                    dis = getdis(i, j);
                    if (dis > mxdis) {
                        mxdis = dis;
                        res = make_pair(i, j);
                    }
                }
            }

        for (int i = 0; i < 2; i++)
            for (int j = 2; j < 4; j++) {
                int x = sm[i], y = sm[j];
                if (cl[x] != cl[y]) {
                    dis = getdis(x, y);
                    if (dis > mxdis) {
                        mxdis = dis;
                        res = make_pair(x, y);
                    }
                }
            }

        for (int i = 0; i < 4; i++)
            for (int j = i + 1; j < 4; j++) {
                int x = ar[i], y = ar[j];
                if (cl[x] != cl[y]) {
                    dis = getdis(x, y);
                    if (dis > mxdis) {
                        mxdis = dis;
                        res = make_pair(x, y);
                    }
                }
            }

        tr[p].di.se = res;
    }

    void upd(int p, int pl, int pr, int pos, pll d) {
        if (pl == pr) {
            tr[p].di = {d, make_pair(-1, -1)};
            return;
        }
        int mid = (pl + pr) >> 1;
        if (pos <= mid)
            upd(p << 1, pl, mid, pos, d);
        else
            upd(p << 1 | 1, mid + 1, pr, pos, d);
        maintain(p);
    }

    const ll cnm = 0;
    inline ll getans() {
        if (tr[1].di.se == make_pair(-1, -1))
            return 0;
        return max(getdis(tr[1].di.se.fi, tr[1].di.se.se), cnm);
    }
}

array<int, 4> qry[N];
int t;
inline void solve() {
    cin >> q >> c;
    for (int i = 0; i <= q + 2; i++)
        adj[i].clear(), vis[i] = 0;
    et.clear();

    int po = 2;
    
    for (int i = 1; i <= q; i++) {
        int op; cin >> op;
        if (op == 0) {
            int x, y, z; cin >> x >> y >> z;
            adj[x].push_back(make_pair(po, z));
            qry[i][0] = op, qry[i][1] = x, qry[i][2] = y, qry[i][3] = z;
            po++;
        } else {
            int x, y; cin >> x >> y;
            qry[i][0] = op, qry[i][1] = x, qry[i][2] = y, qry[i][3] = -1;
        }
    }

    dfs(1, 1);
    builddist(1, 1);
    buildsparse();
    if (t != 1) {
        colors::init();
        sgt::init(1, ra);
    }
    cl[1] = c;
    colors::upd(colors::rt[c], ra, 1);
    sgt::upd(1, ra, c, colors::getdc(c));
    po = 2;
    for (int i = 1; i <= q; i++) {
        int op = qry[i][0], x = qry[i][1], cc = qry[i][2];
        if (op == 0) {
            cl[po] = cc;
            colors::upd(colors::rt[cc], ra, po);
            po++;
        } else {
            int oc = cl[x];
            cl[x] = cc;
            colors::del(colors::rt[oc], ra, x);
            colors::upd(colors::rt[cc], ra, x);
            sgt::upd(1, ra, oc, colors::getdc(oc));
        }

        sgt::upd(1, ra, cc, colors::getdc(cc));
        cout << sgt::getans() << '\n';
    }

    return;
}

signed main() {
    ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    cin >> t;
    for (int i = 1; i <= t; i++)
        solve();

    return 0;
}
```
