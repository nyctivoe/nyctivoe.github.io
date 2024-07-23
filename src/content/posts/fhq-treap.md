---
title: FHQ Treap
published: 2024-07-21
description: 'Tutorial for treap and fhq treap'
image: ''
tags: [Data Structure, Treap]
category: 'Data Structure'
draft: false 
---


# Introduction
Treap is a type of self balancing binary search tree. Treap satisifies properties of a binary search tree and heap, as the name indicates. 
:::note[Properties]
- Property of binary search tree: For any node, its `value` is less than its right son node and more than its left son node.
- Property of heap: For any node, its `value` is less/greater (min-heap/max-heap) than the `value` of its parent node. We will assume min-heap in the rest of this blog.
:::
It's not hard to realize that if treap uses the same `value` for both of these properties, it will eventually form a chain. Therefore, from the property of binary search tree, we introduce a randomized `priority` value to satisfy the property of heap. This randomized `priority` value help treap to maintain its shape and achieve a log<sub>2</sub>(n) query and insertion time complexity. With the help of a randomized `priority` value, the depth of the search tree will be close to log<sub>2</sub> (where n is the number of nodes), and the query complexity will also be log<sub>2</sub> (since it only takes that many recursions to find the target node).
:::note[An Intuitive Proof]
First, we need to recognize that the `priority` attribute of a node is directly related to its depth in the tree because of the heap property. 
We find that nodes with smaller depth, such as the root node, will have smaller `priority` attributes (in a min-heap). Additionally, in a naive search tree, nodes inserted earlier are more likely to have smaller levels. We can associate this `priority` attribute with the order of insertion, which helps us understand why a treap can randomize the order of node insertion through the `priority`.
:::
When inserting a new node into a treap, it is necessary to maintain both the tree and heap properties. To achieve this, two methods have been invented: rotation and split/merge. Treaps that use these two methods are called "rotational treaps" and "non-rotational treaps," respectively. In this blog, we will focus on non-rotational treaps and more specfically, FHQ treap.

# Core Operations
The non-rotational treap, also known as the split/merge treap, has only two core operations: split and merge. Through these two operations, it can often implement other operations more conveniently than the rotational treap. Below, we will introduce these two operations one by one.

## Split using Index

#### Sample Code
```cpp
void split(int p, int k, int &x, int &y) {
    if (!p)
        return void(x = y = 0);
    pushdown(p);
    if (tr[ls].sz < k)
        x = p, split(rs, k - tr[ls].sz - 1, rs, y);
    else 
        y = p, split(ls, k, x, ls);
    maintain(p);
}
```
#### Explanation
If the current tree has no child nodes, set `x` and `y` to 0 and return. If the current node's value is less than the target value, it should be assigned to tree `x`. Since the root node meets the condition, all nodes in its left subtree also meet the condition, so we only need to recursively search the right subtree. Nodes that meet the condition are kept in the right subtree, and those that do not are assigned to tree `y`. Similarly, the remaining code can be understood.

Finally, update the information that needs to be maintained in the problem (pushup operation). This may or may not be necessary.

After knowing how to split using index, it's also trivial to reimplement the split function to split using value (Assuming the treap is properly inserted into the treap with value).

Overall time complexity: $\log_{2}(n)$

## Merge

#### Sample Code
```cpp
int merge(int x, int y) {
    if (!x || !y)
        return x + y;
    if (tr[x].rnd < tr[y].rnd) {
        pushdown(x), tr[x].r = merge(tr[x].r, y);
        maintain(x);
        return x;
    } else {
        pushdown(y), tr[y].l = merge(x, tr[y].l);
        maintain(y);
        return y;
    }
}
```
#### Explanation
This operation takes the pointer to the left treap `x`, and the point to the right treap `y`. Generally, when we merge two treaps, they are originally split from a single treap. Therefore, it is not difficult to ensure that all node values in `x` are less than `y`. 

Because the two treaps are already ordered, when merging, we only need to consider which tree to "place on top" and which to "place below," which means determining which tree should be the subtree. Clearly, according to the heap property, we need to place the tree with the smaller `priority` on top (here we use a min-heap).

At the same time, we need to maintain the properties of the search tree. Therefore, if the root node of `x` has a smaller `priority` than that of `y`, then `x` becomes the new root, and `y`, having larger values, should merge with the right subtree of `x`. Conversely, if `y` has a smaller `priority`, then `y` becomes the new root, and `x`, having smaller values, should merge with the left subtree of `y`.

Overall time complexity: $\log_{2}(n)$

# Full Implementation
```cpp
#include <bits/stdc++.h>
using namespace std;

#define ll long long

const ll N = 7e5 + 5;

template <int mod> // modular int template
struct mint {
    unsigned int _v;
    mint() : _v(0) {}
    template <class T>
    mint(T v) { int64_t x = (int64_t)(v % (int64_t)(umod())); if (x < 0) x += umod(); _v = (unsigned int)(x); }
    mint(bool v) { _v = ((unsigned int)(v) % umod()); }
    static constexpr unsigned int umod() { return mod; }
    unsigned int val() const { return _v; }
    mint& operator++() { _v++; if (_v == umod()) _v = 0; return *this; }
    mint& operator--() { if (_v == 0) _v = umod(); _v--; return *this; }
    mint operator++(int) { mint result = *this; ++*this; return result; }
    mint operator--(int) { mint result = *this; --*this; return result; }
    mint& operator+=(const mint& rhs) {
        _v += rhs._v;
        if (_v >= umod()) _v -= umod();
        return *this;
    }
    mint& operator-=(const mint& rhs) {
        _v -= rhs._v;
        if (_v >= umod()) _v += umod();
        return *this;
    }
    mint& operator*=(const mint& rhs) {
        uint64_t z = _v;
        z *= rhs._v;
        _v = (unsigned int)(z % umod());
        return *this;
    }
    mint& operator/=(const mint& rhs) { return *this = *this * rhs.inv(); }
    mint operator+() const { return *this; }
    mint operator-() const { return mint() - *this; }
    mint pow(int64_t n) const {
        mint x = *this, r = 1;
        for (; n; n >>= 1) {
            if (n & 1) r *= x;
            x *= x;
        }
        return r;
    }
    mint inv() const { return pow(umod() - 2); }
    friend mint operator+(const mint& lhs, const mint& rhs) { return mint(lhs) += rhs; }
    friend mint operator-(const mint& lhs, const mint& rhs) { return mint(lhs) -= rhs; }
    friend mint operator*(const mint& lhs, const mint& rhs) { return mint(lhs) *= rhs; }
    friend mint operator/(const mint& lhs, const mint& rhs) { return mint(lhs) /= rhs; }
    friend bool operator==(const mint& lhs, const mint& rhs) { return lhs._v == rhs._v; }
    friend bool operator!=(const mint& lhs, const mint& rhs) { return lhs._v != rhs._v; }
};
const int64_t mod = 998244353;
using mint_t = mint<mod>;

struct fhq {
    mt19937 _rand = mt19937(114514);
#define ls tr[p].l
#define rs tr[p].r
    struct node {
        int l, r, rnd, sz, cnt, lzrev; // lz add
        mint_t val, sum, lzmul, lzadd;
        node() : l(0), r(0), val(0), rnd(0), sz(0), cnt(0), sum(0), lzrev(0), lzmul(1), lzadd(0) {}
        node(int _l, int _r, int _val, int _rnd, int _sz, int _cnt, int _sum)
            : l(_l), r(_r), val(_val), rnd(_rnd), sz(_sz), cnt(_cnt), sum(_sum), lzrev(0), lzmul(1), lzadd(0) {}
    } tr[N];
    int rt = 0, num = 0;
    inline int newnode(int val) {
        tr[++num] = node(0, 0, val, _rand(), 1, 1, val);
        return num;
    }

    inline void maintain(int p) {
        tr[p].sz = tr[ls].sz + tr[rs].sz + tr[p].cnt;
        tr[p].sum = tr[ls].sum + tr[rs].sum + tr[p].val * tr[p].cnt;
    }

    inline void pushrev(int p) {
        if (tr[p].lzrev) {
            swap(tr[ls].l, tr[ls].r);
            swap(tr[rs].l, tr[rs].r);
            tr[ls].lzrev ^= 1, tr[rs].lzrev ^= 1;
            tr[p].lzrev = 0;
        }
    }

    inline void pushadd(int p) {
        if (tr[p].lzmul != 1 || tr[p].lzadd != 0) {
            tr[ls].val = (tr[ls].val * tr[p].lzmul) + tr[p].lzadd;
            tr[ls].sum = ((tr[ls].sum * tr[p].lzmul) + (mint_t)tr[ls].sz * tr[p].lzadd);
            tr[ls].lzmul *= tr[p].lzmul;
            tr[ls].lzadd = (tr[ls].lzadd * tr[p].lzmul) + tr[p].lzadd;
            
            tr[rs].val = (tr[rs].val * tr[p].lzmul) + tr[p].lzadd;
            tr[rs].sum = ((tr[rs].sum * tr[p].lzmul) + (mint_t)tr[rs].sz * tr[p].lzadd);
            tr[rs].lzmul *= tr[p].lzmul;
            tr[rs].lzadd = (tr[rs].lzadd * tr[p].lzmul) + tr[p].lzadd;

            tr[p].lzadd = 0, tr[p].lzmul = 1;
        }
    }

    inline void pushdown(int p) {
        pushadd(p);
        pushrev(p);
    }

    void split(int p, int k, int &x, int &y) {
        if (!p)
            return void(x = y = 0);
        pushdown(p);
        if (tr[ls].sz < k)
            x = p, split(rs, k - tr[ls].sz - 1, rs, y);
        else 
            y = p, split(ls, k, x, ls);
        maintain(p);
    }

    int merge(int x, int y) {
        if (!x || !y)
            return x + y;
        if (tr[x].rnd < tr[y].rnd) {
            pushdown(x), tr[x].r = merge(tr[x].r, y);
            maintain(x);
            return x;
        } else {
            pushdown(y), tr[y].l = merge(x, tr[y].l);
            maintain(y);
            return y;
        }
    }

    inline void muladd(int l, int r, mint_t v, mint_t v2) {
        int x, y, z;
        split(rt, l - 1, x, y);
        split(y, r - l + 1, y, z);

        pushdown(y);
        tr[y].lzmul = v, tr[y].lzadd = v2;
        tr[y].val = tr[y].val * v + v2;
        tr[y].sum = tr[y].sum * v + (mint_t) tr[y].sz * v2;  

        rt = merge(merge(x, y), z);
    }

    inline void reverse(int l, int r) {
        int x, y, z;
        split(rt, l - 1, x, y);
        split(y, r - l + 1, y, z);
        tr[y].lzrev ^= 1;
        swap(tr[y].l, tr[y].r);
        rt = merge(merge(x, y), z);
    }

    inline void insert(int pos, int val) {
        int x, y;
        split(rt, pos, x, y);
        rt = merge(merge(x, newnode(val)), y);
    }

    inline void del(int pos) {
        int x, y, z;
        split(rt, pos - 1, x, y);
        split(y, 1, y, z);
        rt = merge(x, z);
    }
    
    inline mint_t qrysum(int l, int r) {
        int x, y, z;
        split(rt, l - 1, x, y);
        split(y, r - l + 1, y, z);
        mint_t res = tr[y].sum;
        merge(x, merge(y, z));
        return res;
    }

    inline void print() {
        function<void(int)> pdfs = [&](int p) {
            if (!p)
                return;
            pushdown(p);
            pdfs(ls);
            cout << tr[p].val.val() << ' ';
            pdfs(rs);
        };
        pdfs(rt);
        cout << endl;
    }

#undef ls
#undef rs
} treap;

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    int n, q;
    cin >> n >> q;
    for (int i = 1, x; i <= n; i++)
        cin >> x, treap.insert(i - 1, x);
    int op, l, r, b, c;
    for (int i = 1; i <= q; i++) {
        cin >> op;
        if (op == 0) {
            cin >> l >> b;
            treap.insert(l, b);
        } else if (op == 1) {
            cin >> l;
            treap.del(l + 1);
        } else if (op == 2) {
            cin >> l >> r; l++;
            treap.reverse(l, r);
        } else if (op == 3) {
            cin >> l >> r >> b >> c; l++;
            treap.muladd(l, r, b, c);
        } else {
            cin >> l >> r; l++;
            cout << treap.qrysum(l, r).val() << '\n';
        }
        // treap.print();
    }

    return 0;
}
```