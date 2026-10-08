# `core/utils/motion/route-warmer.ts`

Post-load route-chunk warming.

| | |
|---|---|
| **Source** | `src/core/utils/motion/route-warmer.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `ROUTE_CHUNKS`

Small route chunks safe to warm during idle time.

### `_schedule`

Runs `cb` at the next idle slice — requestIdleCallback with a bounded
timeout when available, a short setTimeout fallback otherwise. Evaluated
per call so the probe reflects the live environment in tests.
- `@param` {Function} cb — the unit of warm work to defer

### `_warmNext`

Schedules the next route chunk import. Stops early when warming was
halted or the chain is exhausted; each chunk resolves or rejects into
`advance` so a failed chunk never stalls the rest of the chain.
- `@param` {number} index — position into ROUTE_CHUNKS

### `stopRouteWarming`

Halts the idle warm chain — any pending scheduled imports are skipped.

### `startRouteWarming`

Starts idle warming once `load` has fired (or immediately if it already has).
