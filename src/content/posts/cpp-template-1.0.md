---
title:  Cpp Basic Template 1.0
published: 2024-07-19
description: ''
image: ''
tags: [Cpp]
category: 'Template'
draft: false 
---

## My C++ Basic Template

- Uses bits/stdc++.h for all headers.
- Fast read
- Fileio macro
- Redefined max and min
- Definied mod to be 1000000007
- Fast pow function for a $\log_{2}(V)$ time complexity and builtin mod
- Custom definitions:
  - first -> fi
  - second -> se
  - long long -> ll
  - pair\<int, int\> -> pii
  - pair\<long long, long long\> -> pll
  - long double -> ld

```cpp
#include <bits/stdc++.h>
using namespace std;
/************************************/
inline int64_t read() { int64_t x = 0, f = 1; char ch = getchar(); while (ch<'0'|| ch>'9') { if(ch == '-') f = -1; ch = getchar(); } while (ch >= '0' && ch <= '9') { x = x * 10 + ch - '0'; ch = getchar();} return x * f; }
inline int read(char *s) { char ch = getchar(); int i = 1; while (ch == ' ' || ch == '\n') ch = getchar(); while (ch != ' ' && ch != '\n') s[i++] = ch, ch = getchar(); s[i] = '\0'; return i - 1; }
#define fileio(x) freopen((string(x) + ".in").c_str(), "r", stdin), freopen((string(x) + ".out").c_str(), "w", stdout)
typedef int64_t ll; typedef pair<int, int> pii; typedef pair<ll, ll> pll; typedef long double ld;
#define fi first
#define se second
inline int64_t min(int64_t a, int64_t b) { return a < b ? a : b; } inline int64_t max(int64_t a, int64_t b) { return a > b ? a : b; }
ll fpow(ll a, ll b, ll md, ll cur = 1) { while (b) { { if (b % 2 == 1) cur *= a; } a *= a, b = b / 2, a %= md, cur %= md; } return cur % md; }
/************************************/
/*   Your code goes here   */
```