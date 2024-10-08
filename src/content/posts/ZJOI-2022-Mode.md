---
title: ZJOI 2022 - Mode
published: 2024-07-31
description: 'Editorial'
image: ''
tags: [Sqrt Decomposition, Prefix Sum]
category: 'ZJOI'
draft: false 
---

<a href="https://loj.ac/p/3707" target="_blank"> Problem Link </a>

## Observations

- We first realize the configuration of the final result:
  - Because we can only minus a certain number within an interval, we are essentially making some number $y$ within the interval into $x$, and the $x$ to something else. 
  - Therefore, the final answer (for $x$) should be in the following configuration: $xxxxyyyyyxxxxx$ (number of x in $[1,l)$, number of y in $[l, r]$ - number of x in $[l, r]$, number of x in $(r, n]$).
- There are atmost $n$ colors.
- So we are essentially enumerating the number of colors on the outer side of the interval and the colors on the innerside.

## Solution

We will first precompute the positions of each color and find all unique colors. We can do sqrt decomposition on the colors.

Note that the situation inside the interval and outside the interval are essentially equivalent, we only analyze the situation inside the interval. We also enumerate what the numbers $j$ outside the interval are, and set numbers equal to $i$ in the original sequence to 1 and numbers equal to $j$ to -1. Thus, the original problem is equivalent to finding the maximum subarray sum. However, this time complexity is still too high. It is not hard to see that the left and right endpoints of the interval we choose must be touching $j$, so the effective transition point for the maximum subarray sum is $cnt_j$, which is exactly $o(n)$.

Now we just have to consider the other case: small + small. Still enumerating the numbers outside the interval, but this time we directly enumerate the frequency of the most frequent element inside the interval. This quantity clearly has monotonicity and can be preprocessed. Similarly, the interval endpoints must also be touching $i$. In terms of specific details, you would first enumerate $i$ and the starting position, and then enumerate the inner layer's answers.

Therefore, we guaranteed our solution to be $O(n\sqrt{n})$.

**Note:** There are several implementation details in this problem.

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
const int N = 2e5 + 5, blk = 450;
int n, a[N], tot[N];
int cnt[N], sum[N];
vector<int> b, lc[N];

inline void solve() {
    n = read(); b.clear(); 
    for (int i = 1; i <= n; i++)
        a[i] = read(), b.push_back(a[i]), lc[i].clear(), tot[i] = 0;
    b.push_back(0);
    sort(b.begin(), b.end());
    b.erase(unique(b.begin(), b.end()), b.end());

    for (int i = 1; i <= n; i++) {
        a[i] = lower_bound(b.begin(), b.end(), a[i]) - b.begin();
        lc[a[i]].push_back(i);
    }

    for (int i = 1; i < b.size(); i++)
        cnt[i] = lc[i].size();

    for (int c = 1; c < b.size(); c++) {
        if (cnt[c] <= blk)
            continue;

        for (int i = 1; i <= n; i++)
            sum[i] = sum[i - 1] + (a[i] == c);

        for (int i = 1; i < b.size(); i++) {
            int l = 0, r, s = 0;
            for (int j = 0; j < cnt[i]; j++) {
                r = lc[i][j];
                s = max(0, s - (sum[r] - sum[l])) + 1;
                tot[c] = max(tot[c], s);
                l = r;
            }
            l = s = 0;
            for (int j = 0; j < cnt[i]; j++) {
                r = lc[i][j];
                s = s + sum[r] - sum[l];
                tot[i] = max(tot[i], s);
                s = max(s - 1, 0);
                l = r;
            }
        }
    }

    auto solvesm = [&]() {
        int l, r, cur;
        for (int i = 1; i <= n; i++)
            sum[i] = 0;

        for (int i = 1; i <= n; i++) {
            int c = a[i];
            if (cnt[c] > blk)
                continue;

            cur = lower_bound(lc[c].begin(), lc[c].end(), i) - lc[c].begin();

            for (int j = cur; j >= 0; j--) {
                if (j == 0) l = 1;
                else l = lc[c][j - 1] + 1;
                r = lc[c][j];

                tot[c] = max(tot[c], sum[l] - (cur - j));

                while (l <= r && sum[r] < cur - j + 1) {
                    sum[r] = cur - j + 1;
                    r--;
                }
            }
        }
    };

    solvesm();
    reverse(a + 1, a + n + 1);
    for (int i = 1; i <= b.size(); i++) {
        reverse(lc[i].begin(), lc[i].end());
        for (int j = 0; j < lc[i].size(); j++)
            lc[i][j] = n + 1 - lc[i][j];
    }
    solvesm();

    int ans = 0;
    for (int i = 1; i < b.size(); i++) {
        ans = max(ans, tot[i] += cnt[i]);
    }

    printf("%d\n", ans);
    for (int i = 1; i < b.size(); i++)
        if (tot[i] >= ans)
            printf("%d\n", b[i]);
}

signed main() {
    int t = read();
    while(t--)
        solve();
}
```