# `cms/dev/firebase-mock.ts`

Dev-only offline stub for Firebase Auth + RTDB. Enabled by

| | |
|---|---|
| **Source** | `src/cms/dev/firebase-mock.ts` |
| **UX surface** | Offline dev mock — never shipped. |

## Members

### (module scope)

Fetches and caches the committed database snapshot once per session.

### (module scope)

Walks a `a/b/c` path down the snapshot; returns the node or undefined.

### `ref`

The ref constant.
- `@param` _db — the value
- `@param` path — the path
- `@returns` MockRef

### `child`

The child helper.

### `get`

Gets.
- `@param` r — the value

### `set`

Sets.
- `@param` r — the value
- `@param` v — the value

### `remove`

The remove helper.

### `update`

The update helper.

### `getDatabase`

Gets database.

### `onAuthChange`

The onAuthChange constant.
- `@param` cb — the callback

### `getDbInstance`

Gets db instance.

### `signInWithGoogle`

The sign in with google helper.

### `logoutUser`

The logout user helper.

### `fetchFirebaseDb`

Fetches firebase db.
- `@param` path — the path
