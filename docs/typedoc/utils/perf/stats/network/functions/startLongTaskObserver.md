[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [utils/perf/stats/network](../README.md) / startLongTaskObserver

```ts
function startLongTaskObserver(engine): void
```

Defined in: [src/utils/perf/stats/network.ts:100](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/perf/stats/network.ts#L100)

Long-task CPU observer — measures main-thread blocking time (tasks

> 50ms). CPU% = busy_ms / window_ms * 100, clamped to [0, 99] at flush.

## Parameters

### engine

[`StatsEngine`](../../../stats-engine/classes/StatsEngine.md)

## Returns

`void`
