# `website/components/nav/scroll.ts`

| | |
|---|---|
| **Source** | `src/website/components/nav/scroll.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `smoothScrollTo`

window.scrollTo + the WASM smooth-scroll accelerator for one target.
Under reduced-motion the options-arg scrollTo is `instant` — the WASM
path gets the longer `SCROLL_DURATION_REDUCED` ramp instead so the jump
stays perceivable without feeling abrupt. The try/catch covers engines
(old Safari) that throw on the options-object signature — the
positional fallback loses smoothness but still lands.
- `@param` y Document-space scroll target in px.

### `pushPath`

pushState to `path` only when it differs — in-page section scrolls
shouldn't stack duplicate history entries for the same URL.
- `@param` path Localized route path.

### `scrollToSectionEl`

Scrolls to a deep-queried section element, if present. The element can
live inside a shadow tree, hence deepQuerySelector; id first, tag
fallback for markup that drops the id.
- `@param` selId `#id` selector.
- `@param` selTag Custom-element tag fallback.

### `scrollToTop`

Smooth-scrolls the window back to the top.

### `goToAbout`

Navigates to (or scrolls to) the about section — route-aware.

### `scrollToContact`

Navigates to (or scrolls to) the contact footer — route-aware.
