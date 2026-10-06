# `core/predictive-loader.ts`

Intent-based predictive prefetching engine.

| | |
|---|---|
| **Source** | `src/core/predictive-loader.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `PredictiveLoader`

Predictive prefetch engine — makes internal navigation feel instant by
warming a link's data before the click lands. Two triggers:
 1. IntersectionObserver — a link scrolling within 200px of the viewport
    is treated as "user may click soon";
 2. intent events — pointerenter/focus/touchstart fire a prefetch
    immediately (hover ≈ click intent on desktop).
Actual fetches are deferred to idle time so prefetching never competes
with the user's current frame work.

### (module scope)

Builds the IntersectionObserver when the APIs exist (SSR/test-safe).
The schedule callback prefers requestIdleCallback with a 2s timeout
so prefetches run in idle gaps; falls back to a short setTimeout.

### `observeLink`

Attaches predictive prefetch listeners to a link element.
Listens for viewport entrance, mouse hover, focus, and touchstart.

### `scanAndObserve`

Scans root for unobserved links and attaches observers.

### `prefetchRoute`

Preloads route data for a given path. Currently only `/portfolio/<slug>`
links carry a fetchable payload — the project node is pulled from
Firebase into `fetchFirebaseDb`'s memory/session cache, so the actual
navigation renders instantly from cache. Other routes are marked
prefetched and skipped (their code chunks are warmed by route-warmer).
Idempotent per path; skips the current route and external links.
