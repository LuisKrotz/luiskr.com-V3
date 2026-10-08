# `components/media/draw-text/trigger.ts`

| | |
|---|---|
| **Source** | `website/components/media/draw-text/trigger.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `isReducedMotion`

Reduced-motion gate — true when the OS/site prefers-reduced-motion flag
is on; draw-text skips its per-character animation in that case.
- `@returns` {boolean} whether reduced motion is active

### `setupTrigger`

Wires the active trigger mode (observer, hover, manual).

### `startAnimation`

Runs the reveal sequence (see file header for the timing math).
