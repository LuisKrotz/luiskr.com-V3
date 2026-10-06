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
