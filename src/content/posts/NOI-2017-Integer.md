---
title: NOI 2017 - 整数 (Integer)
published: 2024-08-01
description: ''
image: ''
tags: [Brute Force, Map, Cheese]
category: 'NOI'
draft: false 
---

## Observation

We can startoff directly with a naive $O(n\log_{n}^2)$ solution with bit carrying. This doesn't seem to pass. However, we can add a few $cheese$ to it. 

## Solution

First we realize that we can store all of the bits within a map. Also, we can maintain -1 in the bits as well. Therefore, whenever we query, we can just simply check the previous bit for a carry. We can update the map naivly using a while loop that decomposes $a$.

## Full Implementation

```cpp
// Eating, bathing, having a girlfriend, having an active social life is incidental, it gets in the way of code time.
// Writing code is the primary force that drives our lives so anything that interrupts that is wasteful.
#include <bits/stdc++.h>
using namespace std;
/************************************/
typedef long long ll; typedef pair<int, int> pii; typedef pair<ll, ll> pll; typedef long double ld;
inline ll read() { ll x = 0, f = 1; char ch = getchar(); while (ch<'0'|| ch>'9') { if(ch == '-') f = -1; ch = getchar(); } while (ch >= '0' && ch <= '9') { x = x * 10 + ch - '0'; ch = getchar();} return x * f; }
inline int read(char *s) { char ch = getchar(); int i = 1; while (ch == ' ' || ch == '\n') ch = getchar(); while (ch != ' ' && ch != '\n') s[i++] = ch, ch = getchar(); s[i] = '\0'; return i - 1; }
#define fileio(x) freopen((string(x) + ".in").c_str(), "r", stdin), freopen((string(x) + ".out").c_str(), "w", stdout)
ll mod = 1e9 + 7;
#define fi first
#define se second
inline ll min(ll a, ll b) { return a < b ? a : b; } inline ll max(ll a, ll b) { return a > b ? a : b; }
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
map<int, int> mp;

inline void solve() {
    int n = read();
    read(), read(), read();

    for (int i = 1; i <= n; i++) {
        if (read() == 1) {
            int a = read(), b = read();
            while(a) {
                auto &p = mp[b];
                p += a;
                a = p / 2;
                p -= a << 1;
                if (!p) mp.erase(b);
                ++b;
            }
        } else {
            int a = read();
            auto p = mp.lower_bound(a);
            int res = (p != mp.end() && p->fi == a);
            printf("%d\n", (abs(res - (p != mp.begin() && prev(p)->se < 0))) % 2);
        }
    }
}

signed main() {
#ifndef LOCAL
    // fileio("");
#endif
    int t = 1; //read();
    while(t--)
        solve();
    return 0;
}
```