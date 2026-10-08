# `core/utils/wasm/wasm-pool.ts`

Round-robin dispatcher over a lazily-spawned pool of

| | |
|---|---|
| **Source** | `src/core/utils/wasm/wasm-pool.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

In-flight dispatch entry — the resolve that completes the caller's Promise.

### `_isMobile`

Coarse mobile detection — UA regex suffices here; precision isn't worth the parser.

### `WasmWorkerPool`

Round-robin pool of WASM workers — `size` is picked from hardware
concurrency (halved on mobile SoCs where thermal throttling makes wide
pools slower than narrow ones).

### `size`

Pool width — clamped cores (mobile ≤2, desktop 2–4).

### `workers`

Spawned Worker instances — populated lazily by _ensurePool.

### `nextWorkerIdx`

Round-robin cursor into `workers`.

### `pendingTasks`

Dispatch id → pending resolver.

### `taskIdSeq`

Monotonically increasing dispatch id — correlates replies to tasks.

### (module scope)

One-shot latch so _ensurePool spawns at most once.

### (module scope)

Lazily spawns `size` workers on first dispatch — module eval stays
free of Worker construction (mobile page-load freeze fix). SSR /
no-Worker engines leave the pool empty; dispatch then resolves null.

### `handleMessage`

Worker `message` handler — resolves the pending task matching the
reply's correlation id and drops it from the map. Replies without an
id are ignored (broadcast/telemetry messages).
- `@param` e The worker MessageEvent.

### (module scope)

Scans a payload shallowly (top-level values + one array level deep)
for ArrayBuffer / ImageBitmap instances — those can cross the worker
boundary by ownership transfer instead of structured-clone copy, so
large media payloads move zero-copy.
- `@param` payload The dispatch payload object.
- `@returns` Transferable instances found.

### `dispatch`

Posts { id, type, payload } to the next worker in round-robin order.
Serializes the payload safely (zero-copy transferables → structuredClone
→ JSON fallback) and resolves the worker's reply — or null when no
worker exists or posting throws.
- `@param` type WASM_ACTIONS message type the worker dispatches on.
- `@param` payload Serializable body — transferables are auto-extracted.
- `@param` transferables Explicit transfer list; auto-scan only runs when empty.
- `@returns` The worker's reply message data, or null on any failure.

### `wasmPool`

Shared pool singleton — all WASM dispatch callers funnel through one
instance so workers are spawned once and round-robin state is global.
