# `core/utils/notify.ts`

User-facing notification service. A failure is surfaced as a

| | |
|---|---|
| **Source** | `src/core/utils/notify.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Options accepted by `notify`/`notifyError`/`notifyLoadFailed`.

### (module scope)

The <site-toast> element once its chunk has upgraded it.

### `_toastEl`

Lazily created <site-toast> singleton (created on first use, not boot).

### `_seen`

Dedupe registry: `${type}|${message}` → last-shown timestamp.

### `_globalBound`

True once global error handlers are bound — keeps init idempotent.

### `_ensureToast`

Finds or lazily mounts the toast element, upgrading the component on first
use so the <site-toast> chunk stays out of the boot bundle. An element
placed in light DOM by other means (SSR shell, tests) is adopted instead
of duplicated.

### `_toast`

Pushes an item into the toast element.
- `@returns` false when no DOM is available to host the element

### `_resolvePermission`

Resolves the effective Notification permission, requesting it when the
browser hasn't answered yet. requestPermission() may reject outside a
user gesture — the rejection degrades to the current (ungranted) state.

### `_nativeNotify`

Attempts a native OS notification. Returns false when construction throws
(insecure contexts, Android's service-worker-only model) and the SW
channel is absent or fails as well.

### `notify`

Surfaces a message to the user — native notification when allowed, the
in-page toast otherwise.
- `@param` message - body copy (localized by the caller)
- `@returns` which surface took the message

### `notifyError`

Generic failure shortcut — the localized "something went wrong" string.
Used by global handlers where the raw error detail belongs in the devlog
buffer (`core/devlog.ts`), not on screen.

### `notifyLoadFailed`

Resource/section load failure shortcut.

### `initGlobalErrorHandlers`

Wires window 'error' + 'unhandledrejection' to the generic error toast so
uncaught failures surface gracefully instead of only logging. Idempotent.
- `@returns` false outside a windowed context
