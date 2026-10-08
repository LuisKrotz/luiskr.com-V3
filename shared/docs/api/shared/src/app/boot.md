# `shared/src/app/boot.ts`

App shell bootstrap — preference init, data load, lazy dialog/HUD chunk imports, router subscription with progress bar, scroll/resize/theme listeners, and the intro loader.

| | |
|---|---|
| **Source** | `src/shared/src/app/boot.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `deferIdle`

Schedules non-urgent work during idle time; falls back to a short
setTimeout on engines without requestIdleCallback. Evaluated per call
so the probe always reflects the live environment.

### `mountAppShell`

Mounts app shell.
- `@param` c — the component
