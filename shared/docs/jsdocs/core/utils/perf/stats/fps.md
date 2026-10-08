# `core/utils/perf/stats/fps.ts`

FPS sampler for the stats engine: counts rAF ticks and

| | |
|---|---|
| **Source** | `src/core/utils/perf/stats/fps.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `startFpsLoop`

Counts rAF ticks and derives frames/second on a rolling 1s window.
