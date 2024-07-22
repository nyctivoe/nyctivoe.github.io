---
title: Dmoj - dynamic tree test (easy)
published: 2024-07-21
description: 'https://dmoj.ca/problem/ds5easy'
image: ''
tags: [Dmoj, Dynamic Tree, LCT, Data Structure]
category: 'Dmoj'
draft: false 
---
<a href="https://dmoj.ca/problem/ds5easy" target="_blank">Problem Link</a>

## Prerequisites
- <a href="https://nyctivoe.github.io/posts/link-cut-tree/" target="_blank">Link Cut Tree</a>

## Problem Description
There is a tree with `n` nodes (rooted at a given node) and we are given `m` operations. There are 8 different operations in total: 
1. **Reroot** the tree at `x`
2. **Set** `z` as the vertex weight for all nodes on the path from `x` to `y` (inclusive).
3. **Add** `z` to the vertex weight for all nodes on the path from `x` to `y` (inclusive).
4. **Query** the minimum vertex weight on the path from `x` to `y` (inclusive).
5. **Query** the maximum vertex weight on the path from `x` to `y` (inclusive).
6. **Query** the sum of vertex weights on the path from `x` to `y` (inclusive).
7. **Cut** the node `x` from its parent (if it have one) and **link** it to node `y`. If y is with the subtree of `x`, then don't link `x` to `y` and link `x` to its parent back.
8. **Query** find the lowest common ancester of node `x` and `y` (with the root taken into account).

## Solution

We will tackle each operations several at a time.

### Operation 1 and 8
It's obvious to see that operation 1 (rerooting), doesn't change much about the tree, the same path is still the same path. What it does change, is operation 8, asking about LCA of `x` and `y`. In order to properly maintain the root of the tree, we can store a variable `rt`, and reroot the tree to rt before each LCA query.

Then we have to think about how to find the LCA of node `x` and `y`. Here is how we can do it:
1. Check if `x` and `y` are the same node, if yes, return `x` or `y`.
2. Check if the depths of `x` is deeper than `y`, then swap them, ensuring `y` is deeper (or the same).
3. access `y` and then return access`x`. (the return value of an access function is the last non-zero node `z` that was processed before `x` becomes the root)

:::note[How to Calculate Depth of a Node]
First, call access(u) to make u the root of its auxiliary tree, effectively making all ancestors of u in the represented tree right children of their respective parents in the auxiliary tree.
Then, it performs a splay(u) operation to bring u to the root of the splay tree, ensuring that the operations are performed efficiently.
The depth of u is then returned as siz[u], which is the size of the subtree rooted at u in the splay tree, effectively representing the depth of u in the original tree.
```cpp
int depth(int u) {
  access(u); splay(u);
  return siz[u];
}
```
:::

Here is my implementation of LCA:
```cpp
int lca(int u, int v) {
    if (u == v) return u;
    if (depth(u) > depth(v)) swap(u, v);
    access(v);
    return access(u);
}
```

### Operation 7
With the help of a LCA function, operation 7 also becomes simple. When we carefully think about it, it's not hard to realize that the first cut operation is simple (as it's a basic cut function), the difficult part lies on the second part: where if `y` is in the subtree of `x`, link `x` back to its original parent. How do we check if `y` is in the subtree of `x`? We can just simply root the tree at `rt`, and run the LCA function, which will return `x` if and only if `y` is in the subtree of `x`. Now, this operation becomes trivial, as we can first check if `y` is in the subtree of `x`, and if so, just continue. Otherwise, cut `x` off and link it below `y`.

Here is my implementation:
```cpp
int x = read(), y = read();
st.makeroot(rt);
if (st.lca(x, y) == x)
    continue;
else {
    st.cut(x);
    st.link(x, y);
}
```

### Operation 2 and 3
Then consider operation 2 and 3. It's obvious that updating the path naively on the lct will promptly result in a TLE. Therefore, we use lazy-propegation to maintain lazy tags on each node and push them down when required (pushup/maintain operations are also needed to update information of the parent nodes). 

Therefore, we have store the following information within each node:
- Left and Right son
- Parent node
- Value(Weight)
- Size
- Sum
- Min & Max
- Lazy Tags (including add for adding value to node, a boolean set for if there a value that need to be setted, and an int set for the value to be set the node)
- Optional: (reverse lazy tags, as it's not required in this problem)

We now know what to save in our nodes, but how do we maintain them? Obviously we passdown lazy tags via a pushdown function, but we soon run into a problem, how to merge tags? For example, for a node `x`, it have a lazy tag add, and we are pushing it down. However, since the left son have a lazy set tag, so we cannot just add the lazy add tag value to the left son like we would normally. 


My solution to lazy tag merging is:
- In order to push down a lazy add tag, first check if a lazy set tag exist. If it does, then add it to the lazy set and update values. Otherwise, directly add the lazy add tag to the child node and the child node's lazy add tag.
- In order to push down a lazy set tag, I bruteforcely remove the chil's lazy add and lazy set tags and set the value.

Here is my ~~not so clean~~ code if it can help you understand.
```cpp
void pushdown(int x) {
    cls(0); // This resets all values at node 0.
    // Because for the node x, if it don't have a left child node, that value will be 0.
    // Also, because how I designed the tags, lazy set and lazy add tag CANNOT coexist
    // on any given node.
    if (lst[x]) {
        if (ch[x][0])
            lset[ch[x][0]] = lset[x], lst[ch[x][0]] = 1, 
            add[ch[x][0]] = 0, val[ch[x][0]] = lset[x],
            sum[ch[x][0]] = lset[x] * siz[ch[x][0]],
            mi[ch[x][0]] = lset[x], mx[ch[x][0]] = lset[x];
        if (ch[x][1])
            lset[ch[x][1]] = lset[x], lst[ch[x][1]] = 1, 
            add[ch[x][1]] = 0, val[ch[x][1]] = lset[x],
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
    if (rev[x]) { // this is optional
        if (ch[x][0])
            rev[ch[x][0]] ^= 1, swap(ch[ch[x][0]][0], ch[ch[x][0]][1]);
        if (ch[x][1])
            rev[ch[x][1]] ^= 1, swap(ch[ch[x][1]][0], ch[ch[x][1]][1]);
        rev[x] = 0;
    }
}
```

After understanding the pushdown function, the pushup/maintain function should be trivial.
```cpp
void maintain(int x) {
    cls(0);
    siz[x] = (siz[ch[x][0]] + 1 + siz[ch[x][1]]);
    sum[x] = (sum[ch[x][0]] + val[x] + sum[ch[x][1]]);
    mi[x] = min(val[x], min(mi[ch[x][0]], mi[ch[x][1]]));
    mx[x] = max(val[x], max(mx[ch[x][0]], mx[ch[x][1]]));
}
```

### Operation 4, 5, 6
After understand how to maintain these information within each node, these queries become trivial to implement. We just simply make `x` the root and access and splay `y`, which will take out the path of `x` to `y` in a splay. Then because x is the root, it definitly contains the information that we want. So just output what we need. 

Here is an implementation for finding the minimum:
```cpp
int x = read(), y = read();
st.makeroot(x);
st.access(y);
st.splay(y);
printf("%d\n", st.mi[y]); // findind the max and sum only differs here, where it asks st.mx[y] and st.sum[y] respectively
```

## Final Implementation
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