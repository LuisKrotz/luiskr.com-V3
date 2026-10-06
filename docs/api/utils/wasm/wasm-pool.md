# `utils/wasm/wasm-pool.ts`

Round-robin dispatcher over a lazily-spawned pool of

| | |
|---|---|
| **Source** | `src/utils/wasm/wasm-pool.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `handleMessage`

Resolves the pending task matching the worker's reply id.

### `dispatch`

Posts { id, type, payload } to the next worker in round-robin order.
Serializes the payload safely (zero-copy transferables → structuredClone
→ JSON fallback) and resolves the worker's reply — or null when no
worker exists or posting throws.
