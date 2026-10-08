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

Paths already warmed — Set so the dedupe check is O(1) per intent fire.

### (module scope)

Links already instrumented. WeakSet (not Set) deliberately holds no
strong refs — a link removed by a route swap can be GC'd without
unregistering, preventing the observer bookkeeping itself from leaking.

### (module scope)

Lazily-built IntersectionObserver; stays null where the API is absent.

### (module scope)

Prefers requestIdleCallback (2s timeout) so prefetches run in idle gaps;
falls back to a short setTimeout. Evaluated per call so the probe always
reflects the live environment. The timeout bound guarantees the prefetch
still fires within ~2s even on a continuously busy main thread — without
it requestIdleCallback may starve indefinitely.
- `@param` cb Work to run in the next idle gap.

### (module scope)

Builds the viewport-entrance observer; skips entirely where window or
IntersectionObserver is absent (SSR / minimal test DOMs).

### `observeLink`

Attaches predictive prefetch listeners to a link element.
Listens for viewport entrance, mouse hover, focus, and touchstart.
`once: true` auto-removes each intent listener after the first fire — a
link is prefetched at most once, so the listener is dead weight after
that. `passive: true` keeps touch/wheel-adjacent handlers off the
scroll-blocking path per MDN passive-listener semantics.
- `@param` element Anchor-like element carrying href or data-route.

### `scanAndObserve`

Scans root for unobserved links and attaches observers. Runs against a
Document, a ShadowRoot, or any Element — the querySelectorAll presence
check is what makes all three shapes safe.
- `@param` root Scope to scan; defaults to document when present.

### `prefetchRoute`

Preloads route data for a given path. Currently only `/portfolio/<slug>`
links carry a fetchable payload — the project node is pulled from
Firebase into `fetchFirebaseDb`'s memory/session cache, so the actual
navigation renders instantly from cache. Other routes are marked
prefetched and skipped (their code chunks are warmed by route-warmer).
Idempotent per path; skips the current route and external links.

### `predictiveLoader`

App-wide singleton — constructed at module eval so observation starts as
soon as the bootstrap imports it; the constructor's env guards make that
safe in SSR/test contexts.
