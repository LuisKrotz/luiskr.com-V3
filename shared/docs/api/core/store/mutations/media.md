# `core/store/mutations/media.ts`

Media + debug-display mutations: stats-for-nerds, the

| | |
|---|---|
| **Source** | `src/core/store/mutations/media.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `pauseEl`

Pauses one video element, tolerating detached/unloaded nodes. `pause()`
can throw on elements whose media was released between query and call
(spec allows DOMException on invalid state) — a stale node must never
abort the sweep that pauses the remaining videos.
- `@param` v The video element, or nullish.

### `mediaMutations`

Media + display mutation group.
