---
title: NOI 2016 - Interval
published: 2024-07-30
description: 'Editorial'
image: ''
tags: [Coordinate Compression, Segment Tree, Lazy Propagation]
category: 'NOI'
draft: false 
---

<a href="https://loj.ac/p/2086" target="_blank"> Problem Link </a>

## Observations

- The answer must be a consecutive sequence of intervals after sorting the intervals based on the "length" defined in the problem.
- The intervals must be monotic:
  - Assume the intervals with id from %l% to $r$ doesn't satifisfy the requirement.
  - Then for any intervals with id from $a$ and $b$ such that $l \leq a \le r$ and $ a \le b \leq r$, they also won't work.
  - Therefore, this can be done with a 2 pointer.

## Solution

First, you realize the coordinates can get really big and naturally we can think about coordinate compression. Then with the 2 pointer observation given above, the only difficulty now is how to find if the intervals satify the requirements. This is actually not hard to do since we can just bruteforcly update everything in a segment tree with lazy propagation.

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
ll mod = 1e9 + 7;
#define fi first
#define se second
inline int64_t min(int64_t a, int64_t b) { return a < b ? a : b; } inline int64_t max(int64_t a, int64_t b) { return a > b ? a : b; }
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
#define int ll
const ll N = 5e5 + 5, M = 2e5 + 5;

ll n, m;

struct inte {
    ll l, r, d;
    inte() { l = r = d = 0; }
    inte(ll _l, ll _r, ll _d) { l = _l, r = _r, d = _d; }
} a[N];
ll cords[N << 2], tp = 0;

namespace sgt {
    struct node { // intersection point between pl and pr, the optimal answer
        ll num;
        ll lzadd;
        node() { num = lzadd = 0; }
    } tr[N << 3];

    inline void maintain(int p) {
        tr[p].num = max(tr[p << 1].num, tr[p << 1 | 1].num);
    }

    inline void pushdown(int p) {
        if (tr[p].lzadd) {
            tr[p << 1].num += tr[p].lzadd;
            tr[p << 1 | 1].num += tr[p].lzadd;
            tr[p << 1].lzadd += tr[p].lzadd;
            tr[p << 1 | 1].lzadd += tr[p].lzadd;
            tr[p].lzadd = 0;
        }
    }

    void build(int p, int pl, int pr) {
        if (pl == pr) {
            tr[p].num = 0;
            return;
        }
        int mid = (pl + pr) >> 1;
        build(p << 1, pl, mid);
        build(p << 1 | 1, mid + 1, pr);
        maintain(p);
    }

    void update(int l, int r, int v, int p, int pl, int pr) {
        if (l <= pl && pr <= r) {
            tr[p].num += v;
            tr[p].lzadd += v;
            return;
        }
        pushdown(p);
        int mid = (pl + pr) >> 1;
        if (l <= mid) update(l, r, v, p << 1, pl, mid);
        if (r > mid) update(l, r, v, p << 1 | 1, mid + 1, pr);
        maintain(p);
    }

    ll querymx() { return tr[1].num; }
}

signed main() {
    n = read(), m = read();

    for (int i = 1; i <= n; i++) {
        ll l = read(), r = read(), d = r - l;
        a[i] = inte(l, r, d);
        cords[++tp] = l, cords[++tp] = r;
    }

    sort(cords + 1, cords + 1 + tp);
    tp = unique(cords + 1, cords + 1 + tp) - cords - 1;
    for (int i = 1; i <= n; i++) {
        a[i].l = lower_bound(cords + 1, cords + 1 + tp, a[i].l) - cords;
        a[i].r = lower_bound(cords + 1, cords + 1 + tp, a[i].r) - cords;
    }
    sort(a + 1, a + 1 + n, [](const inte &a, const inte &b) {
        return a.d < b.d;
    });

    int l = 1, r = 0;
    for (int i = 1; i <= m; i++) {
        sgt::update(a[i].l, a[i].r, 1, 1, 1, tp);
        r = i;
    }
    ll ans = 1e18;
    while (r <= n) {
        ll curmx = sgt::querymx();
        if (curmx >= m) {
            ans = min(ans, a[r].d - a[l].d);
            sgt::update(a[l].l, a[l].r, -1, 1, 1, tp);
            l++;
        } else {
            r++;
            if (r <= n) 
                sgt::update(a[r].l, a[r].r, 1, 1, 1, tp);
        }
    }

    printf("%lld\n", ans == 1e18 ? -1 : ans);

    return 0;
}
```