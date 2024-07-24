---
title: Modular int Template
published: 2024-07-22
description: ''
image: ''
tags: [Template]
category: 'Template'
draft: false 
---

Features:

- customizable mod, with Fp<1234567>, Fp<1000000007>, etc.
- can be use directly with cin and cout.
- builtint modular inverses
- includes most basic operations and comparisions.

```cpp
template <ll MOD> struct Fp {
    ll val;
    constexpr Fp(ll v = 0) noexcept : val(v % MOD) {
        if (val < 0)
            val += MOD;
    }
    constexpr ll getmod() const { return MOD; }
    constexpr Fp operator-() const noexcept { return val ? MOD - val : 0; }
    constexpr Fp operator+(const Fp &r) const noexcept {
        return Fp(*this) += r;
    }
    constexpr Fp operator-(const Fp &r) const noexcept {
        return Fp(*this) -= r;
    }
    constexpr Fp operator*(const Fp &r) const noexcept {
        return Fp(*this) *= r;
    }
    constexpr Fp operator/(const Fp &r) const noexcept {
        return Fp(*this) /= r;
    }
    constexpr Fp &operator+=(const Fp &r) noexcept {
        val += r.val;
        if (val >= MOD)
            val -= MOD;
        return *this;
    }
    constexpr Fp &operator-=(const Fp &r) noexcept {
        val -= r.val;
        if (val < 0)
            val += MOD;
        return *this;
    }
    constexpr Fp &operator*=(const Fp &r) noexcept {
        val = val * r.val % MOD;
        return *this;
    }
    constexpr Fp &operator/=(const Fp &r) noexcept {
        ll a = r.val, b = MOD, u = 1, v = 0;
        while (b) {
            ll t = a / b;
            a -= t * b, swap(a, b);
            u -= t * v, swap(u, v);
        }
        val = val * u % MOD;
        if (val < 0)
            val += MOD;
        return *this;
    }
    constexpr bool operator==(const Fp &r) const noexcept {
        return this->val == r.val;
    }
    constexpr bool operator!=(const Fp &r) const noexcept {
        return this->val != r.val;
    }
    friend constexpr istream &operator>>(istream &is, Fp<MOD> &x) noexcept {
        is >> x.val;
        x.val %= MOD;
        if (x.val < 0)
            x.val += MOD;
        return is;
    }
    friend constexpr ostream &operator<<(ostream &os, const Fp<MOD> &x) noexcept {
        return os << x.val;
    }
};

using mint = Fp<1000000007>;
```
