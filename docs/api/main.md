# `main.ts`

Public-site entry point (modern ESM bundle).

| | |
|---|---|
| **Source** | `src/main.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `mount`

Inserts <app-root> into #app if empty. Idempotent — safe to call on a timer
while the document finishes parsing.
- `@returns` {boolean} true when the root element now exists in the DOM

### `start`

Async boot sequence: loads Safari-specific workarounds only when needed,
starts the router, schedules idle route-chunk warming, and mounts the app
root (with a bounded retry loop for slow DOMContentLoaded edge cases).
