[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/perf/stats-engine](../README.md) / StatsSnapshot

Defined in: [core/utils/perf/stats-engine.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L20)

Point-in-time metrics frame pushed to Stats-for-nerds subscribers.

## Properties

### fps

```ts
fps: number;
```

Defined in: [core/utils/perf/stats-engine.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L22)

Rolling frames-per-second over the last 1s window.

***

### networkBytesPerSec

```ts
networkBytesPerSec: number;
```

Defined in: [core/utils/perf/stats-engine.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L24)

Rolling network throughput estimate in bytes/sec.

***

### pendingRequests

```ts
pendingRequests: number;
```

Defined in: [core/utils/perf/stats-engine.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L26)

Currently in-flight fetches.

***

### memoryMB

```ts
memoryMB: number;
```

Defined in: [core/utils/perf/stats-engine.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L28)

JS heap size in MB (0 on engines without performance.memory).

***

### cpuPercent

```ts
cpuPercent: number;
```

Defined in: [core/utils/perf/stats-engine.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L30)

Main-thread busy fraction 0–100 estimated from longtasks.

***

### latencyMs

```ts
latencyMs: number;
```

Defined in: [core/utils/perf/stats-engine.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L32)

Rolling mean fetch round-trip in ms.
