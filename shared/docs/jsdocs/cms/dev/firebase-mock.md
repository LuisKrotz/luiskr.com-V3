# `cms/dev/firebase-mock.ts`

Dev-only offline stub for Firebase Auth + RTDB. Enabled by

| | |
|---|---|
| **Source** | `src/cms/dev/firebase-mock.ts` |
| **UX surface** | Offline dev mock — never shipped. |

## Members

### (module scope)

Fetches and caches the committed `database.json` snapshot once per
session — the mock's entire "remote" state.
- `@returns` The parsed database object.

### (module scope)

Walks a `a/b/c` path down the snapshot; returns the node or undefined.
Empty segments are filtered so trailing slashes can't produce misses.
- `@param` path Slash-separated RTDB-style path.
- `@returns` The node at the path, or undefined when absent.

### (module scope)

Minimal ref stand-in — just the path the SDK would encapsulate.

### `ref`

Mock of firebase/database `ref()` — wraps a path so `child()`/`get()`
can compose it like the real SDK.
- `@param` _db Unused database handle (kept for signature parity).
- `@param` path Root path for the ref.
- `@returns` A {__path} ref stand-in.

### `child`

Mock of firebase/database `child()` — appends a segment to a ref's path.
- `@param` r Parent ref.
- `@param` path Child segment.
- `@returns` A ref for the joined path.

### `get`

Mock of firebase/database `get()` — resolves the ref's path in the
snapshot and returns the SDK-shaped {exists, val} result.
- `@param` r The ref to read.
- `@returns` A snapshot-shaped promise.

### `set`

Mock of firebase/database `set()` — logs the write; nothing persists so
dev sessions stay reproducible against the committed snapshot.
- `@param` r Target ref.
- `@param` v Value that would be written.

### `remove`

Mock of firebase/database `remove()` — logs the delete, persists nothing.

### `update`

Mock of firebase/database `update()` — logs the patch, persists nothing.

### `getDatabase`

Mock of firebase/database `getDatabase()` — returns a marker handle.

### `MOCK_USER`

Fixed stand-in user so CMS screens render authenticated without OAuth.

### (module scope)

The MOCK_USER shape.

### `onAuthChange`

Mock onAuthChange — immediately reports the signed-in mock user and
returns a no-op unsubscribe.
- `@param` cb The auth-state callback.

### `getDbInstance`

Mock getDbInstance — returns the marker handle (no SDK).

### `signInWithGoogle`

Mock signInWithGoogle — resolves the mock user with no popup.

### `logoutUser`

Mock logoutUser — logs; the next onAuthChange still reports MOCK_USER.

### `fetchFirebaseDb`

Mock fetchFirebaseDb — reads straight from the committed snapshot.
- `@param` path Slash-separated DB path.
