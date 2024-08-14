---
title: Modular int Template
published: 2024-07-22
description: ''
image: ''
tags: [Modular Int]
category: 'Template'
draft: false 
---

Benq's Modint Template

```cpp
const int MOD = 1e9 + 7;

struct mi {
    int v;
    explicit operator int() const { return v; }
    mi() { v = 0; }
    mi(long long _v) : v(_v % MOD) { v += (v < 0) * MOD; }
};
mi &operator+=(mi &a, mi b) {
    if ((a.v += b.v) >= MOD)
        a.v -= MOD;
    return a;
}
mi &operator-=(mi &a, mi b) {
    if ((a.v -= b.v) < 0)
        a.v += MOD;
    return a;
}
mi operator+(mi a, mi b) { return a += b; }
mi operator-(mi a, mi b) { return a -= b; }
mi operator*(mi a, mi b) { return mi((long long)a.v * b.v); }
mi &operator*=(mi &a, mi b) { return a = a * b; }
mi fpow(mi a, ll p) {
    return p == 0 ? 1 : fpow(a * a, p / 2) * (p & 1 ? a : 1);
}
mi operator/(mi a, mi b) { return a * fpow(b, MOD - 2); }
```
