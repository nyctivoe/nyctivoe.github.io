---
title: SDOI 2018 - 荣誉称号 (Honorary Title)
published: 2024-07-29
description: 'Editorial'
image: ''
tags: [Tree DP]
category: 'SDOI'
draft: false 
---

<a href="https://loj.ac/p/2566" target="_blank"> Problem Link </a>

## Solution:

Too lazy to write the full solution. Just know that when you the lower bounds, one thing that we can think about is a binary tree. Then after we find the pattern, we can do a quick Tree DP to compute the answer.

## Full Implementation:
```cpp
// Eating, bathing, having a girlfriend, having an active social life is incidental, it gets in the way of code time.
// Writing code is the primary force that drives our lives so anything that interrupts that is wasteful.
#include <bits/stdc++.h>
#include <cstdint>
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
const int N = 1e7 + 5, K = 10, M = 205;
const ll inf = 2e18;

int a[N], b[N];
int n, k, m;
unsigned int SA, SB, SC; int p, A, B;
unsigned int rng61() {
    SA ^= SA << 16;
    SA ^= SA >> 5;
    SA ^= SA << 1;
    unsigned int t = SA;
    SA = SB;
    SB = SC;
    SC ^= t ^ SA;
    return SC;
}
void gen() {
    scanf("%d%d%d%d%u%u%u%d%d", &n, &k, &m, &p, &SA, &SB, &SC, &A, &B);
    for(int i = 1; i <= p; i++)scanf("%d%d", &a[i], &b[i]);
    for(int i = p + 1; i <= n; i++){
        a[i] = rng61() % A + 1;
        b[i] = rng61() % B + 1;
    }
}

ll dp[(1ll << (K + 1)) + 1][M];
ll ad[(1ll << (K + 1)) + 1][M];

inline void solve() {
    gen();

    for (ll i = 0; i <= (1ll << (k + 1)); i++)
        for (ll j = 0; j <= m; j++)
            dp[i][j] = inf, ad[i][j] = 0;

    for (ll i = 0; i < n; i++) {
        ll x = i + 1;
        while (x >= 1ll << (k + 1))
            x /= (1ll << (k + 1));
        ad[x][a[i + 1] % m] += b[i + 1];
    }

    for (ll i = (1ll << (k + 1)) - 1; i > 0; i--) {
        if (i >= 1ll << k) {
            for (ll j = 0, tmp; j < m; j++) {
                tmp = 0;
                for (ll l = 0; l < m; l++)
                    tmp += ((j - l + m) % m) * ad[i][l];
                dp[i][j] = tmp;
            }
        } else {
            for (ll j = 0, tmp; j < m; j++) {
                tmp = 0;
                for (ll l = 0; l < m; l++)
                    tmp += ((j - l + m) % m) * ad[i][l];
                    
                for (ll l = 0; l < m; l++)
                    dp[i][(j + l) % m] = min(dp[i][(j + l) % m], dp[i << 1][l] + dp[i << 1 | 1][l] + tmp);
            }
        }
    }

    printf("%lld\n", dp[1][0]);
}

signed main() {
    int t = read();
    while(t--)
        solve();

    return 0;
}
```