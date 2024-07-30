---
title: Heavy Light Decomposition Template
published: 2024-07-29
description: 'A template for heavy light decomp w/ LCA'
image: ''
tags: [Heavy Light Decomposition, Template, Tree]
category: 'Template'
draft: false 
---

```cpp
vector<int> T[N << 1];

namespace hld {
    int fa[N], dep[N], siz[N], son[N], top[N], id[N], rk[N], w[N], dis[N], cnt;
    void dfs1(int p, int f) {
        fa[p] = f, dep[p] = dep[f] + 1, siz[p] = 1, son[p] = 0;
        dis[p] = dis[f] + 1;
        for (int v : T[p]) {
            if (v == f)
                continue;
            dfs1(v, p);
            siz[p] += siz[v];
            if (siz[v] > siz[son[p]])
                son[p] = v;
        }
    }

    void dfs2(int p, int tp) {
        top[p] = tp, id[p] = ++cnt, rk[cnt] = p;
        if (son[p])
            dfs2(son[p], tp);
        for (int v : T[p]) {
            if (v == fa[p] || v == son[p])
                continue;
            dfs2(v, v);
        }
    }
    
    void init() { cnt = 0; dfs1(1, 0), dfs2(1, 1); }

    inline int lca(int u, int v) {
        while (top[u] != top[v]) {
            if (dep[top[u]] < dep[top[v]]) swap(u, v);
            u = fa[top[u]];
        }
        return dep[u] < dep[v] ? u : v;
    }
}
```