# `app/view.ts`

View outlet reconciliation for AppRoot — same-tag routes delegate to onRouteParamChange; new views lazy-import their chunk then cross-fade (instant under reduced motion).

| | |
|---|---|
| **Source** | `src/app/view.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `updateAppViewContent`

Updates app view content.

### (module scope)

The flipAppView value.
