# `utils/perf/stats/network.ts`

Network sampler for the stats engine: a resource-timing

| | |
|---|---|
| **Source** | `src/utils/perf/stats/network.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `startNetworkObserver`

Resource-timing observer + global fetch patch.

### `startLongTaskObserver`

Long-task CPU observer — measures main-thread blocking time (tasks
> 50ms). CPU% = busy_ms / window_ms * 100, clamped to [0, 99] at flush.
