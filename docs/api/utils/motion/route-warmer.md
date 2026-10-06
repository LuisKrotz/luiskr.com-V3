# `utils/motion/route-warmer.ts`

Post-load route-chunk warming.

| | |
|---|---|
| **Source** | `src/utils/motion/route-warmer.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `ROUTE_CHUNKS`

Small route chunks safe to warm during idle time.

### `stopRouteWarming`

Halts the idle warm chain — any pending scheduled imports are skipped.

### `startRouteWarming`

Starts idle warming once `load` has fired (or immediately if it already has).
