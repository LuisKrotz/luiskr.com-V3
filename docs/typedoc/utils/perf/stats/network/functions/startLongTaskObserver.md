[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [utils/perf/stats/network](../README.md) / startLongTaskObserver

```ts
function startLongTaskObserver(engine): void
```

Defined in: [src/utils/perf/stats/network.ts:100](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats/network.ts#L100)

Long-task CPU observer — measures main-thread blocking time (tasks

> 50ms). CPU% = busy_ms / window_ms * 100, clamped to [0, 99] at flush.

## Parameters

### engine

[`StatsEngine`](../../../stats-engine/classes/StatsEngine.md)

## Returns

`void`
