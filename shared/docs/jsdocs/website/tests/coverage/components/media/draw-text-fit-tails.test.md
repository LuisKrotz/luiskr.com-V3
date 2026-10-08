# `website/tests/coverage/components/media/draw-text-fit-tails.test.js`

Coverage tails for draw-text/fit.ts — the opt-in `fit`

| | |
|---|---|
| **Source** | `src/website/tests/coverage/components/media/draw-text-fit-tails.test.js` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `mount`

Mounts a fitted draw-text inside a wrapper div (the sizing parent).
- `@param` attrs — attribute map applied before append
- `@returns` {{ el: HTMLElement, wrap: HTMLElement }}

### `stubRects`

Pins the wrapper's content width and every word span's rendered width
so the scale math is deterministic under happy-dom's zero-size rects.
- `@param` wrap — sizing parent
- `@param` el — the draw-text host
- `@param` avail — parent content-box width in px
- `@param` wordW — width each word reports in px

### `stubComputed`

Stubs getComputedStyle so fontSize/letterSpacing/padding resolve to
deterministic values regardless of the environment stylesheet.
- `@param` styles — partial computed-style record
