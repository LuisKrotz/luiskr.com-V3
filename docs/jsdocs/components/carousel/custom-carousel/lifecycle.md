# `components/carousel/custom-carousel/lifecycle.ts`

| | |
|---|---|
| **Source** | `src/components/carousel/custom-carousel/lifecycle.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `onMounted`

Mount: first render pass, resize binding, fit observer, store sub.

### `onUnmounted`

Disconnects the ResizeObserver tracking the host width.

### `onStoreUpdate`

Store change → propagate reduced-motion to both arrows and gate
autoplay on reduced-motion / open-modal.

### `onDestroy`

Teardown: autoplay clock, WebGL arrows, observers, timers.
