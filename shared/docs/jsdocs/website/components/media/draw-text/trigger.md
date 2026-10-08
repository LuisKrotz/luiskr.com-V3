# `website/components/media/draw-text/trigger.ts`

| | |
|---|---|
| **Source** | `src/website/components/media/draw-text/trigger.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `isReducedMotion`

Reduced-motion gate — true when the OS/site prefers-reduced-motion flag
is on; draw-text skips its per-character animation in that case.
- `@returns` {boolean} whether reduced motion is active

### `_orderedT0`

Ordered-reveal session clock. Elements carrying the `ordered` attribute
treat `offset` as a scheduled start time on this shared clock rather
than a delay after their own trigger — so a document's draw-texts
cascade in document order even when several enter the viewport in the
same frame. `_orderedT0` anchors at the first ordered trigger; when an
ordered element triggers late (user scrolled past un-played items),
elapsed time is subtracted so it starts immediately instead of waiting
out a stale schedule. The clock resets when the last ordered element
disconnects (view swap), so each page starts a fresh session.

### `_orderedLive`

Connected `ordered` draw-texts — the session ends when this empties.

### `registerOrdered`

Registers an ordered element in the reveal session. Idempotent —
setupTrigger re-runs on text/attr changes, the Set dedups.
- `@param` host The draw-text host element.

### `teardownTrigger`

Drops the element from the ordered session; resets the shared clock
when the set empties so the next view starts a fresh cascade.
- `@param` host The draw-text host element.

### `resolveEffectiveOffset`

Resolves how long this element must still wait: ordered elements
subtract elapsed session time from their scheduled offset (never below
zero), unordered elements keep their raw offset semantics.
- `@param` host The draw-text host element.
- `@returns` The effective start offset in ms for this trigger.

### `setupTrigger`

Wires the active trigger mode (observer, hover, manual).

### `startAnimation`

Runs the reveal sequence (see file header for the timing math).
