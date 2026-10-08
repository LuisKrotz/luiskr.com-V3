# `core/utils/canvas/loaders/menu-background/loop.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/menu-background/loop.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `REVEAL_OPEN_MS`

Reveal durations: slow bloom on open, quicker dissolve on close.

### `ALPHA_DARK`

Line alpha per theme — the field is a background texture, not content:
dark mode keeps a touch more since white hairlines on black blend
harder than deep blue on foam.

### `start`

Begins the render loop on menu open: resamples theme inks, sizes the
buffer, attaches the ResizeObserver, and either starts RAF or — under
reduced motion — draws one fully-revealed static frame.

### `release`

Eases the reveal back to 0 — used when the menu closes so the field
dissolves instead of cutting out. Rendering continues until stop()
lets the dissolve finish before the GPU goes idle.

### `animateReveal`

Starts (or restarts mid-flight) a timed reveal ease. Capturing the
current value as `_revealFrom` means an open→close→open sequence
reverses from wherever the field is, with no jump.

### `tickReveal`

Advances the reveal ease to the current timestamp. easeOutQuint
(1-(1-p)^5) opens: a fast bloom that settles gently; easeInOutQuart
closes: symmetric gather-and-vanish.

### `stop`

Stops the rAF loop + the resize observer.

### `handleResize`

Syncs buffer size + u_res uniform with the viewport.

### `loop`

rAF callback — draws the animated contour field each frame.

### `renderFrame`

Renders the noise field; a fixed staticTime renders one settled frame.
