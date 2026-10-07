# `core/devlog.ts`

Zero-console diagnostics sink (project rule: no console.* in

| | |
|---|---|
| **Source** | `src/core/devlog.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

One buffered diagnostic entry.

### `t`

Unix-ms timestamp of the call.

### `level`

'warn' | 'error' | 'info' — from LOG_LEVELS.

### `parts`

The original call arguments, unserialized.

### `_entries`

Ring buffer of recent diagnostics (bounded by DEV_LOG.MAX_ENTRIES).

### `push`

Appends an entry, evicting the oldest when the buffer is full.
- `@param` level — LOG_LEVELS value
- `@param` parts — original call arguments

### `devWarn`

Buffers a warning diagnostic.
- `@param` parts — warning detail

### `devError`

Buffers an error diagnostic.
- `@param` parts — error detail

### `devInfo`

Buffers an info diagnostic.
- `@param` parts — info detail

### `getDevLog`

Returns a copy of the buffered entries (oldest → newest).
- `@returns` buffered diagnostics

### `clearDevLog`

Empties the buffer — used by tests to isolate assertions.
