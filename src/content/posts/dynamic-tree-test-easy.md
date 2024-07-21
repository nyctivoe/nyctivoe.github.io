---
title: Dmoj - dynamic tree test (easy)
published: 2024-07-21
description: 'https://dmoj.ca/problem/ds5easy'
image: ''
tags: [Dmoj, LCT, Data Structure]
category: 'Dmoj'
draft: false 
---
<a href="https://dmoj.ca/problem/ds5easy" target="_blank">Problem Link</a>

## Prerequisites
- <a href="https://nyctivoe.github.io/posts/link-cut-tree/" target="_blank">Link Cut Tree</a>

## Problem Description
There is a tree with `n` nodes (rooted at a given node) and we are given `m` operations. There 8 different operations in total: 
1. **Reroot** the tree at `x`
2. **Set** `z` as the vertex weight for all nodes on the path from `x` to `y` (inclusive).
3. **Add** `z` to the vertex weight for all nodes on the path from `x` to `y` (inclusive).
4. **Query** the minimum vertex weight on the path from `x` to `y` (inclusive).
5. **Query** the maximum vertex weight on the path from `x` to `y` (inclusive).
6. **Query** the sum of vertex weights on the path from `x` to `y` (inclusive).
7. **Cut** the node `x` from its parent (if it have one) and **link** it to node `y`. If y is with the subtree of `x`, then don't link `x` to `y` and link `x` to its parent back.
8. **Query** find the lowest common ancester of node `x` and `y` (with the root taken into account).

## Solution

Let's first conside operation 2 and 3. It's obvious that updating the path naively on the lct will promptly result in a TLE. Therefore, we use lazy-propegation to maintain lazy tags on each node and push them down when required (pushup/maintain operations are also needed to update information of the parent nodes). 

Therefore, we find out we have store the following information within each node:
- Left and Right son
- Parent node
- Value(Weight)
- Size
- Sum
- Min & Max
- Lazy Tags (including add for adding value to node, a boolean set for if there a value that need to be setted, and an int set for the value to be set the node)
- Optional: (reverse lazy tags, as it's not required in this problem)

## Implementation
```cpp
#include <bits/stdc++.h>
using namespace std;
/************************************/
inline int64_t read() { int x = 0, f = 1; char ch = getchar(); while (ch<'0'|| ch>'9') { if(ch == '-') f = -1; ch = getchar(); } while (ch >= '0' && ch <= '9') { x = x * 10 + ch - '0'; ch = getchar();} return x * f; }
inline int read(char *s) { char ch = getchar(); int i = 1; while (ch == ' ' || ch == '\n') ch = getchar(); while (ch != ' ' && ch != '\n') s[i++] = ch, ch = getchar(); s[i] = '\0'; return i - 1; }
#define fileio(x) freopen((string(x) + ".in").c_str(), "r", stdin), freopen((string(x) + ".out").c_str(), "w", stdout)
typedef int64_t ll; typedef pair<int, int> pii; typedef pair<ll, ll> pll; typedef long double ld;
#define fi first
#define se second
inline int64_t min(int64_t a, int64_t b) { return a < b ? a : b; } inline int64_t max(int64_t a, int64_t b) { return a > b ? a : b; }
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
const ll N = 100005, inf = 2e18;
char op;

struct Splay {
    int ch[N][2], fa[N];
    int siz[N];
    int val[N];
    ll sum[N];
    int rev[N];
    ll add[N];
    int lset[N]; bool lst[N];
    ll mi[N], mx[N];

    void cls(int x) {
        ch[x][0] = ch[x][1] = fa[x] = siz[x] = val[x] = sum[x] = rev[x] = add[x] = 0;
        lset[x] = 0;
        lst[x] = 0;
        mi[x] = inf;
        mx[x] = -inf;
    }

    int getch(int x) { return (ch[fa[x]][1] == x); }
    int isroot(int x) {
        cls(0);
        return ch[fa[x]][0] != x && ch[fa[x]][1] != x;
    }
    void maintain(int x) {
        cls(0);
        siz[x] = (siz[ch[x][0]] + 1 + siz[ch[x][1]]);
        sum[x] = (sum[ch[x][0]] + val[x] + sum[ch[x][1]]);
        mi[x] = min(val[x], min(mi[ch[x][0]], mi[ch[x][1]]));
        mx[x] = max(val[x], max(mx[ch[x][0]], mx[ch[x][1]]));
    }
    void pushdown(int x) {
        cls(0);
        if (lst[x]) {
            if (ch[x][0])
                lset[ch[x][0]] = lset[x], lst[ch[x][0]] = 1, add[ch[x][0]] = 0, val[ch[x][0]] = lset[x],
                sum[ch[x][0]] = lset[x] * siz[ch[x][0]],
                mi[ch[x][0]] = lset[x], mx[ch[x][0]] = lset[x];
            if (ch[x][1])
                lset[ch[x][1]] = lset[x], lst[ch[x][1]] = 1, add[ch[x][1]] = 0, val[ch[x][1]] = lset[x],
                sum[ch[x][1]] = lset[x] * siz[ch[x][1]],
                mi[ch[x][1]] = lset[x], mx[ch[x][1]] = lset[x];
            lset[x] = 0;
            lst[x] = 0;
        }
        if (add[x]) {
            if (ch[x][0]) {
                if (lst[ch[x][0]]) {
                    lst[ch[x][0]] = 1, lset[ch[x][0]] = (1ll * lset[ch[x][0]] + add[x]);
                    val[ch[x][0]] = lset[ch[x][0]];
                    sum[ch[x][0]] = lset[ch[x][0]] * siz[ch[x][0]];
                    mi[ch[x][0]] = lset[ch[x][0]];
                    mx[ch[x][0]] = lset[ch[x][0]];
                } else {
                    add[ch[x][0]] = (add[ch[x][0]] + add[x]);
                    val[ch[x][0]] = (val[ch[x][0]] + add[x]);
                    sum[ch[x][0]] = (sum[ch[x][0]] + add[x] * siz[ch[x][0]]);
                    mi[ch[x][0]] = (mi[ch[x][0]] + add[x]);
                    mx[ch[x][0]] = (mx[ch[x][0]] + add[x]);
                }
            }
            if (ch[x][1]) {
                if (lst[ch[x][1]]) {
                    lst[ch[x][1]] = 1, lset[ch[x][1]] = (1ll * lset[ch[x][1]] + add[x]);
                    val[ch[x][1]] = lset[ch[x][1]];
                    sum[ch[x][1]] = lset[ch[x][1]] * siz[ch[x][1]];
                    mi[ch[x][1]] = lset[ch[x][1]];
                    mx[ch[x][1]] = lset[ch[x][1]];
                } else {
                    add[ch[x][1]] = (add[ch[x][1]] + add[x]);
                    val[ch[x][1]] = (val[ch[x][1]] + add[x]);
                    sum[ch[x][1]] = (sum[ch[x][1]] + add[x] * siz[ch[x][1]]);
                    mi[ch[x][1]] = (mi[ch[x][1]] + add[x]);
                    mx[ch[x][1]] = (mx[ch[x][1]] + add[x]);
                }
            }
            add[x] = 0;
        }
        if (rev[x]) {
            if (ch[x][0])
                rev[ch[x][0]] ^= 1, swap(ch[ch[x][0]][0], ch[ch[x][0]][1]);
            if (ch[x][1])
                rev[ch[x][1]] ^= 1, swap(ch[ch[x][1]][0], ch[ch[x][1]][1]);
            rev[x] = 0;
        }
    }

    void update(int x) {
        if (!isroot(x))
            update(fa[x]);
        pushdown(x);
    }

    void rotate(int x) {
        int y = fa[x], z = fa[y], chx = getch(x), chy = getch(y);
        fa[x] = z;
        if (!isroot(y))
            ch[z][chy] = x;
        ch[y][chx] = ch[x][chx ^ 1];
        fa[ch[x][chx ^ 1]] = y;
        ch[x][chx ^ 1] = y;
        fa[y] = x;
        maintain(y);
        maintain(x);
        maintain(z);
    }

    void splay(int x) {
        update(x);
        for (int f = fa[x]; f = fa[x], !isroot(x); rotate(x))
            if (!isroot(f))
                rotate(getch(x) == getch(f) ? f : x);
    }

    int access(int x) {
        int y = 0;
        for (; x; y = x, x = fa[x])
            splay(x), ch[x][1] = y, maintain(x);
        return y;
    }

    void makeroot(int x) {
        access(x);
        splay(x);
        swap(ch[x][0], ch[x][1]);
        rev[x] ^= 1;
    }

    int find(int x) {
        access(x);
        splay(x);
        while (ch[x][0])
            x = ch[x][0];
        splay(x);
        return x;
    }

    int depth(int u) {
        access(u); splay(u);
        return siz[u];
    }
    int lca(int u, int v) {
        if (u == v) return u;
        if (depth(u) > depth(v)) swap(u, v);
        access(v);
        return access(u);
    }

    void cut(int x) {
        access(x);
        splay(x);
        fa[ch[x][0]] = 0;
        ch[x][0] = 0;
        maintain(x);
    }

    void link(int x, int y) {
        makeroot(x);
        fa[x] = y;
    }
} st;

signed main() {
    int n = read(), q = read();
    for (int i = 1; i <= n; i++)
        st.val[i] = read(), st.maintain(i);
    for (int i = 1, u, v; i < n; i++) {
        u = read(), v = read();
        if (st.find(u) != st.find(v)) 
            st.makeroot(u), st.fa[u] = v;
    }

    int rt = read();
    
    while (q--) {
        int op = read();
        if (op == 0) {
            rt = read();
        } else if (op == 1) {
            int x = read(), y = read(), z = read(); // set value in the path from x to y, to z
            st.makeroot(x);
            st.access(y);
            st.splay(y);
            st.val[y] = z;
            st.mi[y] = st.mx[y] = z;
            st.lset[y] = z;
            st.lst[y] = 1;
        } else if (op == 2) {
            int x = read(), y = read(), z = read();
            st.makeroot(x);
            st.access(y);
            st.splay(y);
            st.val[y] = (st.val[y] + z);
            st.sum[y] = (st.sum[y] + st.siz[y] * z);
            st.add[y] = (st.add[y] + z);
            st.mi[y] = (st.mi[y] + z);
            st.mx[y] = (st.mx[y] + z);
        } else if (op == 3) { // find minium from x to y
            int x = read(), y = read();
            st.makeroot(x);
            st.access(y);
            st.splay(y);
            printf("%d\n", st.mi[y]);
        } else if (op == 4) {
            int x = read(), y = read();
            st.makeroot(x);
            st.access(y);
            st.splay(y);
            printf("%d\n", st.mx[y]);
        } else if (op == 5) {
            int x = read(), y = read();
            st.makeroot(x);
            st.access(y);
            st.splay(y);
            printf("%d\n", st.sum[y]);
        } else if (op == 6) {
            int x = read(), y = read();
            st.makeroot(rt);
            if (st.lca(x, y) == x)
                continue;
            else {
                st.cut(x);
                st.link(x, y);
            }
        } else if (op == 7) {
            int x = read(), y = read();
            st.makeroot(rt);
            int lc = st.lca(x, y);
            printf("%d\n", lc);
        }
    }
}
```