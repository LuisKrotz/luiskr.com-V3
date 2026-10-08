# `experiments/docs/copy-guard.ts`

Copy-protection layer for the docs source viewer.

| | |
|---|---|
| **Source** | `src/experiments/docs/copy-guard.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Disposer bag — each attach returns the remover.

### `guardToast`

The translated toast body — resolved by the caller from the docs-portal
CMS component node; falls back to the English literal so a missing
translation never silently swallows the warning.

### `hijackClipboard`

Rewrites an in-flight clipboard payload to the GitHub repo URL — the
paste target receives the repo link instead of protected source text.

### `attachCopyGuard`

Wires every guard listener onto `root` (typically the viewer container
or the component shadow root). `isProtected` gates interception so the
guard only bites while a protected page (source-code file) is open —
normal browsing of docs/reports keeps full clipboard freedom.
- `@param` root       Element/ShadowRoot to attach to.
- `@param` isProtected Whether the current view is guarded right now.
- `@param` getPath    Returns the current docs path for telemetry.
- `@param` toastText  Localized toast message getter.
- `@returns` Disposer removing every listener.
