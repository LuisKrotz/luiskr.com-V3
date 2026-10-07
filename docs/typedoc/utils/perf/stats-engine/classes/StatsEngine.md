[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/perf/stats-engine](../README.md) / StatsEngine

Defined in: [src/utils/perf/stats-engine.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L37)

Metrics engine: starts observers lazily on first subscribe, stops them
when the last subscriber leaves (so the hidden HUD costs nothing).

## Constructors

### Constructor

```ts
new StatsEngine(): StatsEngine;
```

#### Returns

`StatsEngine`

## Properties

### \_fps

```ts
_fps: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L38)

---

### \_frameCount

```ts
_frameCount: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L39)

---

### \_lastFrameTime

```ts
_lastFrameTime: number
```

Defined in: [src/utils/perf/stats-engine.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L40)

---

### \_networkBytes

```ts
_networkBytes: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L41)

---

### \_networkBytesPerSec

```ts
_networkBytesPerSec: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L42)

---

### \_networkBytesWindow

```ts
_networkBytesWindow: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L43)

---

### \_networkWindowStart

```ts
_networkWindowStart: number
```

Defined in: [src/utils/perf/stats-engine.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L44)

---

### \_pendingRequests

```ts
_pendingRequests: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L45)

---

### \_requestCount

```ts
_requestCount: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L46)

---

### \_memoryMB

```ts
_memoryMB: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L47)

---

### \_cpuPercent

```ts
_cpuPercent: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L49)

---

### \_longTaskBusyMs

```ts
_longTaskBusyMs: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L50)

---

### \_longTaskObserver

```ts
_longTaskObserver: PerformanceObserver | null = null;
```

Defined in: [src/utils/perf/stats-engine.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L51)

---

### \_latencyMs

```ts
_latencyMs: number = 0
```

Defined in: [src/utils/perf/stats-engine.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L53)

---

### \_latencySamples

```ts
_latencySamples: number[] = [];
```

Defined in: [src/utils/perf/stats-engine.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L54)

---

### \_rafId

```ts
_rafId: number | null = null;
```

Defined in: [src/utils/perf/stats-engine.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L55)

---

### \_observers

```ts
_observers: Set<StatsObserver>
```

Defined in: [src/utils/perf/stats-engine.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L56)

---

### \_observer

```ts
_observer: PerformanceObserver | null = null;
```

Defined in: [src/utils/perf/stats-engine.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L57)

---

### \_flushId

```ts
_flushId: number | null = null;
```

Defined in: [src/utils/perf/stats-engine.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L58)

---

### \_running

```ts
_running: boolean = false
```

Defined in: [src/utils/perf/stats-engine.ts:59](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L59)

## Methods

### subscribe()

```ts
subscribe(fn): void;
```

Defined in: [src/utils/perf/stats-engine.ts:63](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L63)

Registers a metrics callback and cold-starts the observers if needed.

#### Parameters

##### fn

`StatsObserver`

#### Returns

`void`

---

### unsubscribe()

```ts
unsubscribe(fn): void;
```

Defined in: [src/utils/perf/stats-engine.ts:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L70)

Removes a callback; tears down all sampling when the last one leaves.

#### Parameters

##### fn

`StatsObserver`

#### Returns

`void`

---

### getSnapshot()

```ts
getSnapshot(): StatsSnapshot;
```

Defined in: [src/utils/perf/stats-engine.ts:78](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L78)

Point-in-time metrics object the HUD renders (fps, net, cpu, mem, latency).

#### Returns

[`StatsSnapshot`](../interfaces/StatsSnapshot.md)

---

### \_start()

```ts
_start(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L91)

Boots all four samplers (FPS loop, network, longtask, flush timer).

#### Returns

`void`

---

### \_startFpsLoop()

```ts
_startFpsLoop(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:106](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L106)

Counts rAF ticks and derives frames/second on a rolling 1s window.

#### Returns

`void`

---

### \_startNetworkObserver()

```ts
_startNetworkObserver(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:111](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L111)

Resource-timing observer + global fetch patch (see stats/network.ts).

#### Returns

`void`

---

### \_startLongTaskObserver()

```ts
_startLongTaskObserver(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L116)

Long-task CPU observer (see stats/network.ts).

#### Returns

`void`

---

### \_startFlushInterval()

```ts
_startFlushInterval(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:121](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L121)

Aggregating flush interval (see stats/flush.ts).

#### Returns

`void`

---

### \_stop()

```ts
_stop(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L126)

Cancels the rAF loop, disconnects observers, clears the flush timer.

#### Returns

`void`

---

### trackRequestStart()

```ts
trackRequestStart(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:156](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L156)

Manual in-flight counter increment for non-fetch request paths.

#### Returns

`void`

---

### trackRequestEnd()

```ts
trackRequestEnd(): void;
```

Defined in: [src/utils/perf/stats-engine.ts:161](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/perf/stats-engine.ts#L161)

Manual in-flight counter decrement (floor at 0).

#### Returns

`void`
