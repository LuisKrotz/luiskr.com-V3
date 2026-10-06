# `utils/perf/stats/fps.ts`

FPS sampler for the stats engine: counts rAF ticks and

| | |
|---|---|
| **Source** | `src/utils/perf/stats/fps.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `startFpsLoop`

Counts rAF ticks and derives frames/second on a rolling 1s window.
