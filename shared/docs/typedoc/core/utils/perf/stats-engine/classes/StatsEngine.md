[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/perf/stats-engine](../README.md) / StatsEngine

Defined in: [core/utils/perf/stats-engine.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L42)

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
_fps: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L44)

Last computed FPS value.

***

### \_frameCount

```ts
_frameCount: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L46)

Frames counted in the current rolling window.

***

### \_lastFrameTime

```ts
_lastFrameTime: number;
```

Defined in: [core/utils/perf/stats-engine.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L48)

Window start stamp for the FPS calc.

***

### \_networkBytes

```ts
_networkBytes: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L50)

Bytes seen this window from resource-timing entries.

***

### \_networkBytesPerSec

```ts
_networkBytesPerSec: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L52)

Derived bytes/sec over the window.

***

### \_networkBytesWindow

```ts
_networkBytesWindow: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L54)

Byte counter for the current window.

***

### \_networkWindowStart

```ts
_networkWindowStart: number;
```

Defined in: [core/utils/perf/stats-engine.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L56)

Window start stamp for the network calc.

***

### \_pendingRequests

```ts
_pendingRequests: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L58)

In-flight fetch counter (patched window.fetch drives it).

***

### \_requestCount

```ts
_requestCount: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L60)

Lifetime fetch count.

***

### \_memoryMB

```ts
_memoryMB: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L62)

Last read JS heap in MB.

***

### \_cpuPercent

```ts
_cpuPercent: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L64)

CPU load — estimated from long-task busy time in the flush window.

***

### \_longTaskBusyMs

```ts
_longTaskBusyMs: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L66)

Accumulated longtask busy ms for the current flush window.

***

### \_longTaskObserver

```ts
_longTaskObserver: PerformanceObserver | null = null;
```

Defined in: [core/utils/perf/stats-engine.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L68)

The 'longtask' PerformanceObserver (null where unsupported).

***

### \_latencyMs

```ts
_latencyMs: number = 0;
```

Defined in: [core/utils/perf/stats-engine.ts:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L70)

Latency — rolling average of fetch round-trip times (last 10 requests).

***

### \_latencySamples

```ts
_latencySamples: number[] = [];
```

Defined in: [core/utils/perf/stats-engine.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L72)

Rolling latency samples feeding _latencyMs.

***

### \_rafId

```ts
_rafId: number | null = null;
```

Defined in: [core/utils/perf/stats-engine.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L74)

rAF handle for the FPS loop.

***

### \_observers

```ts
_observers: Set<StatsObserver>;
```

Defined in: [core/utils/perf/stats-engine.ts:76](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L76)

Subscribed metric callbacks.

***

### \_observer

```ts
_observer: PerformanceObserver | null = null;
```

Defined in: [core/utils/perf/stats-engine.ts:78](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L78)

The 'resource' PerformanceObserver (network sampler).

***

### \_flushId

```ts
_flushId: number | null = null;
```

Defined in: [core/utils/perf/stats-engine.ts:80](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L80)

The aggregating flush setInterval handle.

***

### \_running

```ts
_running: boolean = false;
```

Defined in: [core/utils/perf/stats-engine.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L82)

Whether samplers are currently live.

## Methods

### subscribe()

```ts
subscribe(fn): void;
```

Defined in: [core/utils/perf/stats-engine.ts:90](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L90)

Registers a metrics callback and cold-starts the observers if needed —
lazy start keeps the engine free until the HUD opens.

#### Parameters

##### fn

`StatsObserver`

Subscriber receiving each StatsSnapshot.

#### Returns

`void`

***

### unsubscribe()

```ts
unsubscribe(fn): void;
```

Defined in: [core/utils/perf/stats-engine.ts:101](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L101)

Removes a callback; tears down all sampling when the last one leaves
so a closed HUD leaves zero observers running.

#### Parameters

##### fn

`StatsObserver`

The callback to remove.

#### Returns

`void`

***

### getSnapshot()

```ts
getSnapshot(): StatsSnapshot;
```

Defined in: [core/utils/perf/stats-engine.ts:109](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L109)

Point-in-time metrics object the HUD renders (fps, net, cpu, mem, latency).

#### Returns

[`StatsSnapshot`](../interfaces/StatsSnapshot.md)

***

### \_start()

```ts
_start(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:122](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L122)

Boots all four samplers (FPS loop, network, longtask, flush timer).

#### Returns

`void`

***

### \_startFpsLoop()

```ts
_startFpsLoop(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:137](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L137)

Counts rAF ticks and derives frames/second on a rolling 1s window.

#### Returns

`void`

***

### \_startNetworkObserver()

```ts
_startNetworkObserver(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L142)

Resource-timing observer + global fetch patch (see stats/network.ts).

#### Returns

`void`

***

### \_startLongTaskObserver()

```ts
_startLongTaskObserver(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:147](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L147)

Long-task CPU observer (see stats/network.ts).

#### Returns

`void`

***

### \_startFlushInterval()

```ts
_startFlushInterval(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:152](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L152)

Aggregating flush interval (see stats/flush.ts).

#### Returns

`void`

***

### \_stop()

```ts
_stop(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:157](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L157)

Cancels the rAF loop, disconnects observers, clears the flush timer.

#### Returns

`void`

***

### trackRequestStart()

```ts
trackRequestStart(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:187](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L187)

Manual in-flight counter increment for non-fetch request paths.

#### Returns

`void`

***

### trackRequestEnd()

```ts
trackRequestEnd(): void;
```

Defined in: [core/utils/perf/stats-engine.ts:192](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/perf/stats-engine.ts#L192)

Manual in-flight counter decrement (floor at 0).

#### Returns

`void`
