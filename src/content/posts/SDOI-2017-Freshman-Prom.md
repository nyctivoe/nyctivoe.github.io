---
title: SDOI 2017 - 新生舞会 (Freshman Prom)
published: 2024-07-29
description: 'Editorial'
image: ''
tags: [MCMF, Binary Serach, Fractional Programming]
category: 'SDOI'
draft: false 
---

<a href="https://loj.ac/p/2003" target = "_blank"> Problem Link </a>

## Solution

**Observations:**
- So we are trying to find the max of $C$. It's usually really hard to directly get the maximum value of things, so we consider binary search on $C$. 
- Now we just need to think about how to check if a $C$ would work. How could we do that?
  - MCMF on a bipartite graph!
  - All boys are on the left, girls on the right.

**Solution:**

We realize that the maximum right bound of $C$ is $1e4$ (given by the problem statement), so we can set the left bound of binary search as 0 and right bound be $1e4$. 

We can then rearange the original equation:

$$C = \frac{a_1 + a_2 + \cdots + a_n}{b_1 + b_2 + \cdots + b_n}$$

to the following:

$$ (b_1 \times C - a_1) + (b_2 \times C + a_2) + \cdots + (b_n \times C - a_n) = 0$$

Then, what if we have $C_1$ and $C_2$ where both of them works but $C_2 \gt C_1$. So we can't just look for a $0$ solution in the mcmf. Instead, we have to make all possible $C$ to return a non-negative value. This leads us to the following construction:
- We connect from source node to boy nodes (flow = $1$, cost = $0$), boy nodes to girl nodes (flow = $1$, cost = $C \times b[i][j - n] - a[i][j - n]$), and girl nodes to tank (flow = $1$, cost = $0$). Then we can check if the max flow is exactly $n$, if it's not, then it's not a proper solution. Otherwise, we can check if the cost is non-negative. Non-negative means that the current $C$ is a valid solution.

**Quick Note:** To avoid using decimals in calculating mcmf, we can multiply all edge weights by $1e7$ and only take the integer part. This is garanteed to not overflow because the original numbers are pretty small.

## Full Implementation

<a href="https://loj.ac/s/2119241" target="_blank"> Submission Link </a>

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

const ll N = 100 + 5;
const ld eps = 1e-7;
const ll inf = 1e18;

ll n;
ll a[N][N], b[N][N];

ld l = 0, r = 10000, mid;

namespace mcmf {
    struct Edge {
        int u, v;
        long long cap, cost, flow;

        Edge(int _u, int _v, long long _cap, long long _cost) : u(_u), v(_v), cap(_cap), cost(_cost), flow(0) {}
    };

    int m, n, s, t;
    bool neg;
    vector<int> par;
    vector<long long> pi, dist;
    vector<Edge> edges;
    vector<vector<int>> adj;

    inline void init(int _n, int _s, int _t) {
        n = _n, s = _s, t = _t;
        m = 0;
        neg = false;
        par.clear();
        pi.clear();
        dist.clear();
        edges.clear();
        adj.clear();
        par.resize(n);
        pi.resize(n);
        dist.resize(n);
        adj.resize(n);
    }

    void addedge(int u, int v, long long cap, long long cost = 0) { // change cost if you are using cost
        edges.emplace_back(u, v, cap, cost);
        edges.emplace_back(v, u, 0, -cost);
        adj[u].push_back(m++);
        adj[v].push_back(m++);
        neg |= cost < 0;
    }

    bool path() {
        fill(dist.begin(), dist.end(), LLONG_MAX);
        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
        pq.emplace(dist[s] = 0, s);
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            if (d > dist[u])
                continue;
            for (int e : adj[u])
                if (edges[e].flow < edges[e].cap && dist[u] + edges[e].cost + pi[u] - pi[edges[e].v] < dist[edges[e].v]) {
                    par[edges[e].v] = e;
                    pq.emplace(dist[edges[e].v] = dist[u] + edges[e].cost + pi[u] - pi[edges[e].v], edges[e].v);
                }
        }
        return dist[t] < LLONG_MAX;
    }

    void setpi() {
        fill(pi.begin(), pi.end(), LLONG_MAX);
        pi[s] = 0;
        bool cycle;
        for (int i=0; i<n; i++) {
            cycle = false;
            for (const Edge &e : edges)
                if (e.cap > 0 && pi[e.u] < LLONG_MAX && pi[e.u] + e.cost < pi[e.v]) {
                    pi[e.v] = pi[e.u] + e.cost;
                    cycle = true;
                }
        }
        assert(!cycle);
    }

    pair<long long, long long> maxFlow(long long limit = LLONG_MAX) {
        if (neg)
            setpi();
        long long retFlow = 0, retCost = 0;
        while (limit > 0 && path()) {
            for (int u=0; u<n; u++)
                pi[u] += dist[u];
            long long f = limit;
            for (int u=t; u!=s; u=edges[par[u]].u) {
                f = min(f, edges[par[u]].cap - edges[par[u]].flow);
            }
            retFlow += f;
            retCost += f * (pi[t] - pi[s]);
            limit -= f;
            for (int u=t; u!=s; u=edges[par[u]].u) {
                edges[par[u]].flow += f;
                edges[par[u] ^ 1].flow -= f;
            }
        }
        return {retFlow, retCost};
    }
}

ll s, t;

inline bool chk() {
    mcmf::init(2 * n + 10, s, t);
    for (int i = 1; i <= n; i++)
        mcmf::addedge(s, i, 1, 0);
    for (int i = n + 1; i <= 2 * n; i++)
        mcmf::addedge(i, t, 1, 0);
    for (int i = 1; i <= n; i++)
        for (int j = n + 1; j <= 2 * n; j++) {
            ll cost = (mid * b[i][j - n] - a[i][j - n]) * 10000000;
            mcmf::addedge(i, j, 1, cost);
        }
    
    pll res = mcmf::maxFlow();
    if (res.fi != n)
        return false;

    if (res.se > 0)
        return true;
    return false;
}

signed main() {
    n = read();
    s = 2 * n + 1, t = 2 * n + 2;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            a[i][j] = read();

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            b[i][j] = read();

    while (r - l > eps) {
        mid = (l + r) / 2;
        if (chk())
            r = mid;
        else
            l = mid;
    }

    printf("%.6Lf\n", mid);

    return 0;
}
```



