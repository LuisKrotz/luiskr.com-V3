[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/perf/stats-engine](../README.md) / statsEngine

```ts
const statsEngine: StatsEngine
```

Defined in: [src/utils/perf/stats-engine.ts:201](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/perf/stats-engine.ts#L201)

Shared stats singleton — one engine serves every consumer so observers
(rAF loop, PerformanceObservers, fetch patch) exist at most once.
