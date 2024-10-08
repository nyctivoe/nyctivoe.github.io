---
title: NOI 2020 - Epicure
published: 2024-07-31
description: 'Editorial'
image: ''
tags: [Binary Lifting, Floyd]
category: 'NOI'
draft: false 
---

<a href="https://loj.ac/p/3339" target="_blank"> Problem Link </a>

## Solution

So first we can ignore the events and just simply use binary jumping to find the most optimal paths. However, binary jumping only works when all edge weights equals to 1. However, the edge weights are $\leq 5$, but not 1. Therefore, we can add additional nodes and link them with the original vertices.

After having the binary jump table, we can simply order the events in time and calculate from event to event. However, since it's sometimes not optimal to use all events, we can store a $dis$ array. For the answer, we can just output $dis[0]$.

## Full Implementation
```cpp
// Eating, bathing, having a girlfriend, having an active social life is incidental, it gets in the way of code time.
// Writing code is the primary force that drives our lives so anything that interrupts that is wasteful.
#include <bits/stdc++.h>
using namespace std;
/************************************/
inline long long read() { long long x = 0, f = 1; char ch = getchar(); while (ch<'0'|| ch>'9') { if(ch == '-') f = -1; ch = getchar(); } while (ch >= '0' && ch <= '9') { x = x * 10 + ch - '0'; ch = getchar();} return x * f; }
inline int read(char *s) { char ch = getchar(); int i = 1; while (ch == ' ' || ch == '\n') ch = getchar(); while (ch != ' ' && ch != '\n') s[i++] = ch, ch = getchar(); s[i] = '\0'; return i - 1; }
#define fileio(x) freopen((string(x) + ".in").c_str(), "r", stdin), freopen((string(x) + ".out").c_str(), "w", stdout)
typedef long long ll; typedef pair<int, int> pii; typedef pair<ll, ll> pll; typedef long double ld;
ll mod = 1e9 + 7;
#define fi first
#define se second
inline ll min(ll a, ll b) { return a < b ? a : b; } inline ll max(ll a, ll b) { return a > b ? a : b; }
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
const ll inf = 2e18, lg = 30;
const int N = 55;
int n, m, T, k;

struct event {
    ll t, x, y;
    event(ll t, ll x, ll y) : t(t), x(x), y(y) {}
};

ll c[N * 5]; 
ll jmp[lg + 1][N * 5][N * 5];

inline void solve() {
    n = read(), m = read(), T = read(), k = read();
    for (int i = 0; i <= 5 * n; i++)
        c[i] = 0;
    for (int i = 0; i < n; i++)
        c[5 * i] = read();

    for (int i = 0; i <= 5 * n; i++)
        for (int j = 0; j <= 5 * n; j++)
            for (int k = 0; k <= lg; k++)
                jmp[k][i][j] = -inf;

    for (int i = 0; i < n; i++)
        jmp[0][5 * i][5 * i + 1] = 0, 
        jmp[0][5 * i + 1][5 * i + 2] = 0, 
        jmp[0][5 * i + 2][5 * i + 3] = 0,
        jmp[0][5 * i + 3][5 * i + 4] = 0;

    n *= 5;

    for (int i = 0; i < m; i++) {
        int u = read(), v = read(), w = read();
        u = (u - 1) * 5;
        v = (v - 1) * 5;
        jmp[0][u + (w - 1)][v] = max(c[v], jmp[0][u + (w - 1)][v]);
    }

    ll evt = 0;
    vector<event> pe;
    pe.emplace_back(-1, -1, -1);
    for (int i = 0; i < k; i++) {
        ll t = read(), x = read(), y = read();
        x = (x - 1) * 5;
        if (t < T)
            pe.emplace_back(t, x, y);
        else if (t == T) {
            if (x == 0)
                evt = y;
        }
    }

    pe.emplace_back(T, 0, evt);
    sort(pe.begin(), pe.end(), [](const event &a, const event &b) { return a.t < b.t; });

    vector<event> ev;
    ev.emplace_back(0, -1, -1);
    int tmp = pe.size();
    for (int i = 1; i < tmp; i++) {
        event e = pe[i];
        ll lt = ev.back().t;
        for (int j = lg - 1; j >= 0; j--)
            if (e.t - lt >= (1ll << j)) {
                ev.emplace_back(lt + (1ll << j), -1, -1);
                lt += 1ll << j;
            }
        ev.back().x = e.x;
        ev.back().y = e.y;
    }

    for (int nl = 1; nl < lg; nl++)
        for (int m = 0; m < n; m++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (jmp[nl - 1][i][m] + jmp[nl - 1][m][j] > jmp[nl][i][j])
                        jmp[nl][i][j] = jmp[nl - 1][i][m] + jmp[nl - 1][m][j];
    
    vector<ll> dis(n, -inf);
    dis[0] = c[0];

    tmp = ev.size();
    for (int i = 1; i < tmp; i++) {
        event e = ev[i];
        int nlg = 64 - __builtin_clzll(ev[i].t - ev[i - 1].t) - 1;
        vector cur(n, -inf);
        for (int s = 0; s < n; s++)
            for (int t = 0; t < n; t++)
                cur[t] = max(cur[t], dis[s] + jmp[nlg][s][t]);

        if (e.x != -1)
            cur[e.x] += e.y;
        
        dis.swap(cur);
    }

    if (dis[0] <= -(inf / 2))
        cout << -1 << endl;
    else
        cout << dis[0] << endl;

    return;
}

signed main() {
#ifndef LOCAL
    fileio("delicacy");
#endif
    solve();

    return 0;
}
```