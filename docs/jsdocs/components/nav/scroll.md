# `components/nav/scroll.ts`

| | |
|---|---|
| **Source** | `src/components/nav/scroll.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `smoothScrollTo`

window.scrollTo + the WASM smooth-scroll accelerator for one target.

### `pushPath`

pushState to `path` when it differs from the current one.

### `scrollToSectionEl`

Scrolls to a deep-queried section element, if present.

### `scrollToTop`

Smooth-scrolls the window back to the top.

### `goToAbout`

Navigates to (or scrolls to) the about section — route-aware.

### `scrollToContact`

Navigates to (or scrolls to) the contact footer — route-aware.
