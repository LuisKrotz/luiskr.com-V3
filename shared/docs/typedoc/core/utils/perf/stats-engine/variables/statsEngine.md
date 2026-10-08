[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/perf/stats-engine](../README.md) / statsEngine

```ts
const statsEngine: StatsEngine;
```

Defined in: [core/utils/perf/stats-engine.ts:201](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L201)

Shared stats singleton — one engine serves every consumer so observers
(rAF loop, PerformanceObservers, fetch patch) exist at most once.
