# `utils/media/local-media-cache.ts`

Three-tier media cache: in-memory Map (object URLs) →

| | |
|---|---|
| **Source** | `src/utils/media/local-media-cache.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `initStorage`

Opens the media IndexedDB, creating the blob store on first run. Resolves false when IDB is unavailable (private mode, SSR).

### `getWasmMediaHash`

Computes the media cache key in the WASM worker; falls back to a sanitized btoa when WASM fails.

### `getLocalMedia`

Resolves a URL to a cached object URL: memory → IndexedDB blob → localStorage string → null.

### `storeLocalMedia`

Persists a blob across all three tiers and returns its object URL.

### `fetchOrGetLocalMedia`

Cache-through read: returns the cached object URL if present, otherwise fetches same-origin, stores, and returns. Cross-origin URLs pass through untouched.

### `getCacheStats`

Diagnostic snapshot for the stats HUD (memory entries, IDB availability).
