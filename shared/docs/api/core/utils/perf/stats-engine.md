# `core/utils/perf/stats-engine.ts`

Live performance-metrics collector behind the Stats-for-nerds

| | |
|---|---|
| **Source** | `src/core/utils/perf/stats-engine.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Point-in-time metrics frame pushed to Stats-for-nerds subscribers.

### `fps`

Rolling frames-per-second over the last 1s window.

### `networkBytesPerSec`

Rolling network throughput estimate in bytes/sec.

### `pendingRequests`

Currently in-flight fetches.

### `memoryMB`

JS heap size in MB (0 on engines without performance.memory).

### `cpuPercent`

Main-thread busy fraction 0–100 estimated from longtasks.

### `latencyMs`

Rolling mean fetch round-trip in ms.

### (module scope)

Subscriber callback receiving each flushed snapshot.

### `StatsEngine`

Metrics engine: starts observers lazily on first subscribe, stops them
when the last subscriber leaves (so the hidden HUD costs nothing).

### `_fps`

Last computed FPS value.

### `_frameCount`

Frames counted in the current rolling window.

### `_lastFrameTime`

Window start stamp for the FPS calc.

### `_networkBytes`

Bytes seen this window from resource-timing entries.

### `_networkBytesPerSec`

Derived bytes/sec over the window.

### `_networkBytesWindow`

Byte counter for the current window.

### `_networkWindowStart`

Window start stamp for the network calc.

### `_pendingRequests`

In-flight fetch counter (patched window.fetch drives it).

### `_requestCount`

Lifetime fetch count.

### `_memoryMB`

Last read JS heap in MB.

### `_cpuPercent`

CPU load — estimated from long-task busy time in the flush window.

### `_longTaskBusyMs`

Accumulated longtask busy ms for the current flush window.

### `_longTaskObserver`

The 'longtask' PerformanceObserver (null where unsupported).

### `_latencyMs`

Latency — rolling average of fetch round-trip times (last 10 requests).

### `_latencySamples`

Rolling latency samples feeding _latencyMs.

### `_rafId`

rAF handle for the FPS loop.

### `_observers`

Subscribed metric callbacks.

### `_observer`

The 'resource' PerformanceObserver (network sampler).

### `_flushId`

The aggregating flush setInterval handle.

### `_running`

Whether samplers are currently live.

### `subscribe`

Registers a metrics callback and cold-starts the observers if needed —
lazy start keeps the engine free until the HUD opens.
- `@param` fn Subscriber receiving each StatsSnapshot.

### `unsubscribe`

Removes a callback; tears down all sampling when the last one leaves
so a closed HUD leaves zero observers running.
- `@param` fn The callback to remove.

### `getSnapshot`

Point-in-time metrics object the HUD renders (fps, net, cpu, mem, latency).

### `_start`

Boots all four samplers (FPS loop, network, longtask, flush timer).

### `_startFpsLoop`

Counts rAF ticks and derives frames/second on a rolling 1s window.

### `_startNetworkObserver`

Resource-timing observer + global fetch patch (see stats/network.ts).

### `_startLongTaskObserver`

Long-task CPU observer (see stats/network.ts).

### `_startFlushInterval`

Aggregating flush interval (see stats/flush.ts).

### `_stop`

Cancels the rAF loop, disconnects observers, clears the flush timer.

### `trackRequestStart`

Manual in-flight counter increment for non-fetch request paths.

### `trackRequestEnd`

Manual in-flight counter decrement (floor at 0).

### `statsEngine`

Shared stats singleton — one engine serves every consumer so observers
(rAF loop, PerformanceObservers, fetch patch) exist at most once.
