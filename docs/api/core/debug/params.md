# `core/debug/params.ts`

Boot-time `?debug=…` actions. Values:

| | |
|---|---|
| **Source** | `src/core/debug/params.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `debugParams`

All `debug` values on the current URL (empty outside a windowed context).

### `hasDebugFlag`

True when `flag` is present among the URL's `?debug=` values.

### `runDebugActions`

Runs the side-effecting debug flags once at boot. The toast test is async
(lazy <site-toast> chunk) — intentionally fire-and-forget so a slow chunk
load never blocks the app start.
