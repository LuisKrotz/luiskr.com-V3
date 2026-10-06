# `utils/perf/stats/flush.ts`

Flush interval for the stats engine: every INTERVAL_MS it

| | |
|---|---|
| **Source** | `src/utils/perf/stats/flush.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

Chrome-only `performance.memory` extension.

### `startFlushInterval`

Starts the interval that aggregates samples and notifies subscribers.
