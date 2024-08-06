---
title: ZJOI-2022-Tree
published: 2024-08-05
description: ''
image: ''
tags: [DP, Math]
category: 'ZJOI'
draft: false 
---

## Full Implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<int, int> pii;
#define fi first
#define se second

#define int ll

ll n, m, mod;

vector<vector<int>> dp[3];

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);

    cin >> n >> m;
    mod = m;

    for (int i = 0; i < 3; i++)
        dp[i].resize(n + 1, vector<int>(n + 1));
    for (int i = 1; i < n; i++)
        dp[1][1][i] = 1;

    int ans = 0;
    for (int i = 2, cur = 0; i <= n; i++) {
        ans = 0;
        for (auto &j : dp[cur])
            fill(j.begin(), j.end(), 0);
        for (int j = 1; j < i; j++) {
            for (int k = 1; k <= n - i + 1; k++) {
                // 3 cases, point i goes to S', point i goes to T', point i goes none
                dp[cur][j][k] = (dp[cur][j][k] + dp[cur ^ 1][j][k] * (mod - 2) % mod * j % mod * k % mod) % mod;
                dp[cur][j + 1][k] = (dp[cur][j + 1][k] + dp[cur ^ 1][j][k] * j % mod * k % mod) % mod;
                dp[cur][j][k - 1] = (dp[cur][j][k - 1] + dp[cur ^ 1][j][k] * j % mod * k % mod) % mod;
                if (k == 1)
                    ans = (ans + dp[cur ^ 1][j][k] * j % mod * k % mod) % mod;
            }
        }
        cout << ans << '\n';
        cur ^= 1;
    }

    return 0;
}
```