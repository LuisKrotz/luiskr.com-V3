# `utils/perf/stats-engine.ts`

Live performance-metrics collector behind the Stats-for-nerds

| | |
|---|---|
| **Source** | `src/utils/perf/stats-engine.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `StatsEngine`

Metrics engine: starts observers lazily on first subscribe, stops them
when the last subscriber leaves (so the hidden HUD costs nothing).

### `subscribe`

Registers a metrics callback and cold-starts the observers if needed.

### `unsubscribe`

Removes a callback; tears down all sampling when the last one leaves.

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
