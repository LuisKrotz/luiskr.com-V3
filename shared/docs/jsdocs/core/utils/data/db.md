# `core/utils/data/db.ts`

SWR-style data layer over Firebase RTDB.

| | |
|---|---|
| **Source** | `src/core/utils/data/db.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Minimal Firebase-style snapshot shape callers consume.

### (module scope)

Lazy chunk loaders per locale emitted by the i18n-boot-index plugin.

### `_snapshot`

Wraps a raw node value in the snapshot shape ({exists, val}) callers expect.

### `_fromBootstrap`

Resolves a translations path against the build-time snapshot of
database.json (per-locale lazy chunks). Returns undefined when the path is
not covered (non-translation paths, unknown locale) so the caller falls
back to the network.

### `warmBootstrap`

Starts downloading the core snapshot chunk for a locale right away so the
first render does not wait for an extra network hop after the route chunk.

### `_readLocalCache`

Reads the localStorage mirror of a node (offline fallback); null-safe.

### `_sortedStringify`

Key-order-insensitive stringify: Firebase may return object keys in a
different order than the build snapshot even when content is identical.
Array order is preserved (it is meaningful).

### `_writeLocalCache`

Persists a node to localStorage; swallows quota/security errors.

### `_fetchNetwork`

Fetches a node via the RTDB REST endpoint and mirrors it to localStorage.

### `fetchFirebaseDb`

Reads a database node.

Static first: translation paths resolve instantly from the build-time
snapshot of database.json, then revalidate against Firebase in the
background. When the live value differs, the cache is updated and
`onUpdate(snapshot)` is called so the caller can re-render with CMS edits
made after the last deploy. Non-translation paths go straight to the
network with the localStorage copy as offline fallback.
