---
title: NOI 2013 - Calligraphy
published: 2024-07-30
description: 'Editorial'
image: ''
tags: [DP, Prefix Sum, Brute Force]
category: 'NOI'
draft: false 
---

<a href="https://loj.ac/p/2668" target="_blank"> Problem Link </a>

## Observations:

- The ranges are really small, so is there some bruteforce problem?
- Oh right, we can do dp and bruteforcly maintain the dp states with transitions.
  - But this is too slow naively, we need to optimize some summations with prefix sum.

## Solution:

This is not necessarily a difficult problem after you figured out the correct dp states:

1. The $i$th column.
2. The $j$th state.
   - There are a lot of states in this problem. We first realize that we can split $N$, $O$, $I$ each into 3 states. Then that's $9$.
   - We also have to maintain the transition (empty column) between $N$ to $O$ and $O$ to $I$. Then that's $2$.
   - Now we have $11$ in total.
3. The $l, r$ (top and bottom) of the previous rectangle.

However, we can't store states for all columns, otherwise we will have memory issues. Plus, we only really need the previous column for transition, so we just need a single set of arrays, like the following:
```cpp
int dp1[N][N], dp2[N][N], dp3[N][N], dp5[N][N], 
    dp6[N][N], dp7[N][N], dp9[N][N], dp10[N][N], 
    dp11[N][N], ps1[N][N], ps2[N][N]; // the dp states
int trans1 = -inf, trans2 = -inf; // initialized
```

After having these dp states, we need to figure out transitions. We can view the transitions as one massive simulation. Because I'm lazy and don't want to write out all transitions, refer to my code for them (or check out this blog by n685: [n685's blog](https://nhuang685.github.io/noi/dp/2024/07/30/noi2013-calligraphy.html). $orz$ ). The simulation should be simple to understand. 

**Note:** In the process of transitioning, we do need to find the sum of grids on the same column. naively adding them in the transition is too slow, so we just build a prefix sum array for each column and use that.

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
const int N = 155, M = 505, inf = 0x3f3f3f3;

int n, m, trans1 = -inf, trans2 = -inf;
int ans = -inf;
int a[M][N], ps[N];

int dp1[N][N], dp2[N][N], dp3[N][N], dp5[N][N], dp6[N][N], dp7[N][N], dp9[N][N], dp10[N][N], dp11[N][N], ps1[N][N], ps2[N][N];

signed main() {
    n = read(), m = read();
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            a[j][i] = read();
    
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n / 2; j++)
            swap(a[i][j], a[i][n - j + 1]);
    
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++) 
            dp1[i][j] = dp2[i][j] = dp3[i][j] = dp5[i][j] = dp6[i][j] = dp7[i][j] = dp9[i][j] = dp10[i][j] = dp11[i][j] = ps1[i][j] = ps2[i][j] = -inf;
    
    auto gets = [&](int l, int r) { return ps[r] - ps[l - 1]; };
    for (int j = 1; j <= m; j++) {
        for (int i = 1; i <= n; i++)
            ps[i] = ps[i - 1] + a[j][i];

        for (int l = 1; l <= n; l++)
            for (int r = l + 2; r <= n; r++)
                ans = max(ans, dp11[l][r] = max(dp11[l][r], dp10[l][r]) + a[j][l] + a[j][r]);

        for (int l = 1; l <= n; l++)
            for (int r = l + 2; r <= n; r++)
                dp10[l][r] = max(dp10[l][r], dp9[l][r]) + gets(l, r);

        for (int l = 1; l <= n; l++)
            for (int r = l + 2; r <= n; r++)
                dp9[l][r] = max(dp9[l][r], trans2) + a[j][l] + a[j][r];

        for (int l = 1; l <= n; l++)
            for (int r = l + 2; r <= n; r++)
                trans2 = max(trans2, dp7[l][r]);

        for (int l = 1; l <= n; l++)
            for (int r = l + 2; r <= n; r++)
                dp7[l][r] = dp6[l][r] + gets(l, r);

        for (int l = 1; l <= n; l++)
            for (int r = l + 2; r <= n; r++)
                dp6[l][r] = max(dp6[l][r], dp5[l][r]) + a[j][l] + a[j][r];

        for (int l = 1; l <= n; l++)
            for (int r = l + 2; r <= n; r++)
                dp5[l][r] = trans1 + gets(l, r);

        for (int l = 1; l <= n; l++)
            for (int r = l + 1; r <= n; r++)
                trans1 = max(trans1, dp3[l][r]);

        for (int l = 1; l <= n; l++)
            for (int r = l + 1, cur = -inf; r <= n; r++)
                dp3[l][r] = max(dp3[l][r], cur = max(cur, dp2[l][r - 1])) + gets(l, r);

        for (int r = 1; r <= n; r++)
            for (int l = r, cur = ps2[r + 1][r]; l; l--)
                dp2[l][r] = max(ps1[l - 1][r], cur = max(cur, ps2[l][r])) + gets(l, r);

        for (int l = 1; l <= n; l++)
            for (int r = l; r <= n; r++)
                dp1[l][r] = max(0, dp1[l][r]) + gets(l, r);

        for (int l = 1; l <= n; l++)
            for (int r = n; r; r--) 
                ps2[l][r] = max(dp2[l][r], ps2[l][r + 1]);

        for (int r = 1; r <= n; r++)
            for (int l = 1; l <= n; l++)
                ps1[l][r] = max(dp1[l][r], ps1[l - 1][r]);
    }

    printf("%d\n", ans);
}
```