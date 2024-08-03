---
title: NOI 2024 - 百万富翁 (Millionaire)
published: 2024-08-02
description: 'Editorial'
image: ''
tags: [Constructive]
category: 'NOI'
draft: false 
---

## Observations:

- It's quite simple to tell that brute force is very easy, just ask every pair and then return the one have it greater than the other person it's comparing to $n - 1$ times.
- Then we look at the constraints for subtask 2, and we see we are allowed to query 20 times, and each time for $2e6$ pairs.
  - We quickly realize that $2^{20} \geq 1e6$, therefore, we think about divide and conquer.

## Solution:

Because the two subtasks are different, we are required to first write a brute force solution to subtask 1, which is as follows:

```cpp
namespace st1 {
    int n, t, s;
    inline void init(int n, int t, int s) {
        st1::n = n, st1::t = t, st1::s = s;
    }

    int main(int a, int b, int c) {
        init(a, b, c);
        vector<int> num(n);
        vector<int> qry1, qry2;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                qry1.push_back(i), qry2.push_back(j);
        vector<int> res = ask(qry1, qry2);
        for (int i = 0; i < res.size(); i++)
            num[res[i]]++;

        for (int i = 0; i < n; i++)
            if (num[i] == n - 1)
                return i;
        return -1;
    }
}
```

Then we can think about subtask 2 solution. Inspired by the divide and conquer, we can fire write a solution that does the deepest layer and then iterate upwards. This can to $11$ more points if you use 3 as block size (I tried in virtual). However, we soon realize that why do we have to keep on solving for one block size. Why don't we have something like 2 at the beginning and then some larger numbers later. 

The optimal block sizes can be figured out with a `dp` or `dfs`, but I didn't do that. I first set the first few small numbers and then randomly tested for the last few numbers. Which arrived at this 84 point solution:

```cpp
#include "richest.h"
#include <bits/stdc++.h>
using namespace std;

typedef pair<int, int> pii;
#define fi first
#define se second

const int N = 1000001;

namespace st1 {
    int n, t, s;
    inline void init(int n, int t, int s) {
        st1::n = n, st1::t = t, st1::s = s;
    }

    int main(int a, int b, int c) {
        init(a, b, c);
        vector<int> num(n);
        vector<int> qry1, qry2;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                qry1.push_back(i), qry2.push_back(j);
        vector<int> res = ask(qry1, qry2);
        for (int i = 0; i < res.size(); i++)
            num[res[i]]++;

        for (int i = 0; i < n; i++)
            if (num[i] == n - 1)
                return i;
        return -1;
    }
}

int sz[N];
vector<int> qry1, qry2, ans, lst;
inline void calc(vector<int> blk) {
    qry1.clear(); qry2.clear();
    static int pos;
    pos = 0;
    for (int i : blk) {
        for (int j = pos; j < pos + i; j++)
            for (int k = pos; k < j; k++)
                qry1.push_back(lst[j]), qry2.push_back(lst[k]);
        pos += i;
    }
    vector<int> ret = ask(qry1, qry2);
    for (int i : lst)
        sz[i] = 0;
    ans.clear();
    static int cnt;
    cnt = 0;
    pos = 0;
    for (int i : blk) {
        for (int j = pos; j < pos + i; j++)
            for (int k = pos; k < j; k++)
                sz[ret[cnt++]]++;
        for (int j = pos; j < pos + i; j++)
            if (sz[lst[j]] == i - 1)
                ans.push_back(lst[j]);
        pos += i;
    }
    lst = ans;
}

int richest(int n, int t, int s) {
    if (n <= 1000) {
        return st1::main(n, t, s);
    } else {
        vector<int> bsz; lst.clear();
        for (int i = 0; i < 500000; i++) 
            bsz.push_back(2);
        for (int i = 0; i < n; i++) 
            lst.push_back(i);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 250000; i++)
            bsz.push_back(2);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 125000; i++)
            bsz.push_back(2);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 62500; i++)
            bsz.push_back(2);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 20832; i++)
            bsz.push_back(3);
        bsz.push_back(4);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 3471; i++)
            bsz.push_back(6);
        bsz.push_back(7);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 160; i++)
            bsz.push_back(19);
        for (int i = 0; i < 24; i++)
            bsz.push_back(18);
        calc(bsz);
        bsz.clear();

        bsz.push_back(184);
        calc(bsz);
        return lst.front();
    }
}
```

## AC Implementation After Tweaking the Last Few Numbers

```cpp
#include "richest.h"
#include <bits/stdc++.h>
using namespace std;

typedef pair<int, int> pii;
#define fi first
#define se second

const int N = 1000001;

namespace st1 {
    int n, t, s;
    inline void init(int n, int t, int s) {
        st1::n = n, st1::t = t, st1::s = s;
    }

    int main(int a, int b, int c) {
        init(a, b, c);
        vector<int> num(n);
        vector<int> qry1, qry2;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                qry1.push_back(i), qry2.push_back(j);
        vector<int> res = ask(qry1, qry2);
        for (int i = 0; i < res.size(); i++)
            num[res[i]]++;

        for (int i = 0; i < n; i++)
            if (num[i] == n - 1)
                return i;
        return -1;
    }
}

int sz[N];
vector<int> qry1, qry2, ans, lst;
inline void calc(vector<int> blk) {
    qry1.clear(); qry2.clear();
    int pos = 0;
    for (int i : blk) {
        for (int j = pos; j < pos + i; j++)
            for (int k = pos; k < j; k++)
                qry1.push_back(lst[j]), qry2.push_back(lst[k]);
        pos += i;
    }
    vector<int> ret = ask(qry1, qry2);
    for (int i : lst)
        sz[i] = 0;
    ans.clear();
    int cnt = 0;
    pos = 0;
    for (int i : blk) {
        for (int j = pos; j < pos + i; j++)
            for (int k = pos; k < j; k++)
                sz[ret[cnt++]]++;
        for (int j = pos; j < pos + i; j++)
            if (sz[lst[j]] == i - 1)
                ans.push_back(lst[j]);
        pos += i;
    }
    lst = ans;
}

int richest(int n, int t, int s) {
    if (n <= 1000) {
        return st1::main(n, t, s);
    } else {
        vector<int> bsz; lst.clear();
        for (int i = 0; i < 500000; i++) 
            bsz.push_back(2);
        for (int i = 0; i < n; i++) 
            lst.push_back(i);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 250000; i++)
            bsz.push_back(2);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 125000; i++)
            bsz.push_back(2);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 62500; i++)
            bsz.push_back(2);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 20832; i++)
            bsz.push_back(3);
        bsz.push_back(4);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 3471; i++)
            bsz.push_back(6);
        bsz.push_back(7);
        calc(bsz);
        bsz.clear();

        for (int i = 0; i < 178; i++)
            bsz.push_back(19);
        for (int i = 0; i < 5; i++)
            bsz.push_back(18);
        calc(bsz);
        bsz.clear();

        bsz.push_back(183);
        calc(bsz);
        return lst.front();
    }
}
```