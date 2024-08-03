---
title: NOI 2024 - 集合 (set)
published: 2024-08-02
description: 'Editorial'
image: ''
tags: [Hashing, Two Pointers]
category: 'NOI'
draft: false 
---

<a href="https://qoj.ac/contest/1747/problem/9155" target="_blank"> Problem Link </a>

## Observations:

1. I think for this problem, the most important thing is to understand what the problem statement is essentially saying. 
2. After understanding the problem statement, we realize that the numbers themselves are important only within their repsective array. This is because when comparing array `a` and `b`, we really only care about the position. Then how do we comapre the positions quickly and update quickly? Hashing!
3. Another quick observation is that how this the problem works:
  - For example, if a range $[l, r]$ work, then surely $[l + 1, r]$ works.
  - If $[l, r]$ doesn't work, then surely $[l, r + 1]$ won't work either.

## Solution:

- We realize that we can use hashing to compare the two arrays. 
- One naturual thing to think about is definitely mo's, which amortizes our queries into a sqrt. Therefore giving us a $O(n\sqrt{q})$ solution. However this doesn't pass, so we need to think about something better.
- In order to proceed, we have to realize observation #3. This observation leads us to a two pointer solution, which have a time complexity of $O(n + q)$, enough to pass this problem.

*P.S. solved within 1h in virtual :fire:*

## Full Implementation:
```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll; typedef unsigned long long ull;

#define yes cout << "Yes\n"
#define no cout << "No\n"

ll n, m, q;
vector<array<int, 3>> a, b;

mt19937_64 _rng(chrono::system_clock::now().time_since_epoch().count());

vector<ull> rva, ap, bp;
ull hsh1, hsh2;
ull msk, rd1, rd2, rd3;

inline ull randshift(ull x) {
    if (!x)
        return x;
    x ^= msk;
    x ^= x << rd1, x ^= x >> rd2, x ^= x << rd3;
    return x;
}

inline void add(int i, int si) {
    for (auto j : a[i]) {
        hsh1 -= randshift(ap[j]);
        ap[j] += rva[i] * si;
        hsh1 += randshift(ap[j]);
    }

    for (auto j : b[i]) {
        hsh2 -= randshift(bp[j]);
        bp[j] += rva[i] * si;
        hsh2 += randshift(bp[j]);
    }
}

inline void solve() {
    cin >> n >> m >> q; 
    a.resize(n + 1), b.resize(n + 1); rva.resize(n + 1), ap.resize(m + 1), bp.resize(m + 1);
    vector<int> p(n + 1);
    for (int i = 1; i <= n; i++)
        p[i] = n;
    for (int i = 1; i <= n; i++) cin >> a[i][0] >> a[i][1] >> a[i][2];
    for (int i = 1; i <= n; i++) cin >> b[i][0] >> b[i][1] >> b[i][2];

    for (int t = 1; t <= 5; t++) {
        msk = _rng(); rd1 = _rng() % 20, rd2 = _rng() % 20, rd3 = _rng() % 20;
        for (int i = 0; i <= n; i++)
            rva[i] = _rng();

        int r = 0;
        for (int l = 1; l <= n; l++) {
            while (r <= n && hsh1 == hsh2) {
                r++;
                if (r <= n)
                    add(r, 1);
            }
            p[l] = min(p[l], r - 1);
            add(l, -1);
        }
    }

    for (int i = 1; i <= q; i++) {
        int l, r; cin >> l >> r;
        if (r <= p[l]) yes;
        else no;
    }
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);

    solve();

    return 0;
}
```