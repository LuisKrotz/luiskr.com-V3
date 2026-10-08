# `core/utils/motion/scroll-state.ts`

Global "is the window currently scrolling" flag plus an

| | |
|---|---|
| **Source** | `src/core/utils/motion/scroll-state.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `handleScrollStop`

Fires when scrolling settles: clears the flag and drains pending callbacks.

### `handleScroll`

Marks scrolling as active and arms the 120ms debounce fallback for scrollend.

### `isScrolling`

True while a window scroll gesture is in progress.

### `onScrollStop`

Queues a one-shot callback for the next scroll stop; fires immediately
when the window isn't scrolling right now.
