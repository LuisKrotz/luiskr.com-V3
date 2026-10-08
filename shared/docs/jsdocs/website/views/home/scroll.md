# `website/views/home/scroll.ts`

Post-navigation scroll handling for &lt;view-home&gt;: same-view

| | |
|---|---|
| **Source** | `src/website/views/home/scroll.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `scrollToSection`

Smooth-scrolls to a section id (shadow root first, then deep DOM).

### `onHomeRouteChange`

Router hook — section navigations re-scroll; others return to top.

### `scrollOnMount`

Mount-time scroll: honor a pending section target, else reset to top.
