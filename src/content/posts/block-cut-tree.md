---
title: Block-Cut Tree Template
published: 2024-07-29
description: 'Template for Block-Cut Tree'
image: ''
tags: [Block Cut Tree]
category: 'Template'
draft: false 
---

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
const ll N = 2e5 + 5;

ll n, m;

vector<int> G[N];
vector<int> T[N << 1];

namespace blockcuttree {
    int dfn[N << 1], low[N], dfc, cnt;
    int stk[N], tp;

    void Tarjan(int u) {
        low[u] = dfn[u] = ++dfc;
        stk[++tp] = u;
        for (int v : G[u]) {
            if (!dfn[v]) {
                Tarjan(v);
                low[u] = min(low[u], low[v]);
                if (low[v] == dfn[u]) {
                    cnt++;
                    for (int x = 0; x != v; --tp) {
                        x = stk[tp];
                        T[cnt].push_back(x);
                        T[x].push_back(cnt);
                    }
                    T[cnt].push_back(u);
                    T[u].push_back(cnt);
                }
            } else
                low[u] = min(low[u], dfn[v]);
        }
    }
}
using namespace blockcuttree;

signed main() {
    n = read(), m = read();
    for (int i = 1; i <= n; i++)
        G[i].clear(), dfn[i] = 0, low[i] = 0;
    for (int i = 1; i <= m; i++) {
        int u = read(), v = read();
        G[u].push_back(v), G[v].push_back(u);
    }

    cnt = n, dfc = 0;
    for (int i = 1; i <= n; i++)
        if (!dfn[i])
            Tarjan(i), tp--;

    // here, G is the original, T is the new graph.
}
```
