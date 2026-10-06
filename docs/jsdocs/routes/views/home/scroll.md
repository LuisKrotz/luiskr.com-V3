# `routes/views/home/scroll.ts`

Post-navigation scroll handling for &lt;view-home&gt;: same-view

| | |
|---|---|
| **Source** | `src/routes/views/home/scroll.ts` |
| **UX surface** | One page of the site per file — the URL the visitor lands on. |

## Members

### `scrollToSection`

Smooth-scrolls to a section id (shadow root first, then deep DOM).

### `onHomeRouteChange`

Router hook — section navigations re-scroll; others return to top.

### `scrollOnMount`

Mount-time scroll: honor a pending section target, else reset to top.
