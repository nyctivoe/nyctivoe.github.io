---
title: MCMF Template
published: 2024-07-29
description: 'MCMF Template Cpp'
image: ''
tags: [MCMF, Template]
category: 'Template'
draft: false 
---

## Sample Problems:
- loj 2003

## Min Cost Max Flow Template
```cpp
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
```