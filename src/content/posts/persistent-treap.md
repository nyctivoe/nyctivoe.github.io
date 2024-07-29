---
title: Persistent Treap
published: 2024-07-26
description: 'Tutorial for Persistent Treap'
image: ''
tags: [Persistent Data Structure, Persistent Treap]
category: 'Data Structure'
draft: false 
---



# Full Implementation
```cpp
#include <bits/stdc++.h>
using namespace std;

#define ll long long

const ll N = 2e5 + 5;

int rts[N];
mt19937 _rand = mt19937(114514);
struct node {
    int l, r, rnd, sz, lzrev;
    ll val, sum;
    node() : l(0), r(0), val(0), rnd(0), sz(0), sum(0), lzrev(0){}
    node(int _l, int _r, int _val, int _rnd, int _sz, int _sum)
        : l(_l), r(_r), val(_val), rnd(_rnd), sz(_sz), sum(_sum), lzrev(0) {}
} tr[N * 55];
int num = 0;
inline int newnode(ll val) {
    tr[++num] = node(0, 0, val, _rand(), 1, val);
    return num;
}
inline int cpy(int p) {
    tr[++num] = tr[p];
    return num;
}

inline void maintain(int p) {
    if (!p)
        return;
    tr[p].sz = tr[tr[p].l].sz + tr[tr[p].r].sz + 1;
    tr[p].sum = tr[tr[p].l].sum + tr[tr[p].r].sum + tr[p].val;
}

inline void pushrev(int p) {
    if (!p)
        return;
    if (tr[p].lzrev) {
        if (tr[p].l && tr[p].r) {
            int x = cpy(tr[p].l), y = cpy(tr[p].r);
            tr[p].l = y, tr[p].r = x;
            tr[x].lzrev ^= 1, tr[y].lzrev ^= 1;
        } else if (tr[p].l) {
            int x = cpy(tr[p].l);
            tr[p].l = 0;
            tr[p].r = x;
            tr[x].lzrev ^= 1;
        } else if (tr[p].r) {
            int x = cpy(tr[p].r);
            tr[p].l = x;
            tr[p].r = 0;
            tr[x].lzrev ^= 1;
        }
        tr[p].lzrev = 0;
        maintain(p);
    }
}

inline void pushdown(int p) {
    pushrev(p);
}

void split(int p, int k, int &x, int &y) {
    if (tr[p].sz == 0)
        return void(x = y = 0);
    pushdown(p);
    if (tr[tr[p].l].sz < k) {
        k -= 1 + tr[tr[p].l].sz;
        x = cpy(p);
        split(tr[p].r, k, tr[x].r, y);
        maintain(x);
    }
    else {
        y = cpy(p);
        split(tr[p].l, k, x, tr[y].l);
        maintain(y);
    }
}

int merge(int x, int y) {
    if (!x || !y)
        return x + y;
    if (tr[x].rnd < tr[y].rnd) {
        pushdown(x);
        tr[x].r = merge(tr[x].r, y);
        maintain(x);
        return x;
    } else {
        pushdown(y);
        tr[y].l = merge(x, tr[y].l);
        maintain(y);
        return y;
    }
}

int x, y, z;
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);

    ll las = 0;
    int n; cin >> n;
    ll v, opt, l, r;
    for (int i = 1; i <= n; i++) {
        cin >> v >> opt;
        if (opt == 1) {
            cin >> l >> r;
            l ^= las, r ^= las;
            split(rts[v], l, x, y);
            rts[i] = merge(merge(x, newnode(r)), y);
        } else if (opt == 2) {
            cin >> l;
            l ^= las;
            split(rts[v], l, x, y);
            split(x, l - 1, x, z);
            rts[i] = merge(x, y);
        } else if (opt == 3) {
            cin >> l >> r;
            l ^= las, r ^= las;
            if (l > r)
                swap(l, r);
            split(rts[v], r, x, y);
            split(x, l - 1, x, z);
            z = cpy(z);
            tr[z].lzrev ^= 1;
            rts[i] = merge(merge(x, z), y);
        } else if (opt == 4) {
            cin >> l >> r;
            l ^= las, r ^= las;
            if (l > r)
                swap(l, r);
            
            split(rts[v], r, x, y);
            split(x, l - 1, x, z);
            las = tr[z].sum;
            rts[i] = merge(merge(x, z), y);
            cout << las << endl;
        }
    }

    return 0;
}
```