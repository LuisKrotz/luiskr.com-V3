# `core/utils/perf/stats/flush.ts`

Flush interval for the stats engine: every INTERVAL_MS it

| | |
|---|---|
| **Source** | `src/core/utils/perf/stats/flush.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `INTERVAL_MS`

Numeric token — the sole declaration site for this value.

### (module scope)

Chrome-only `performance.memory` extension.

### `startFlushInterval`

Starts the interval that aggregates samples and notifies subscribers.
