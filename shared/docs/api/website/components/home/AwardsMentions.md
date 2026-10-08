# `website/components/home/AwardsMentions.tsx`

&lt;awards-mentions&gt; — the footer band on internals/home: an

| | |
|---|---|
| **Source** | `src/website/components/home/AwardsMentions.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `AwardsMentions`

The AwardsMentions — mentions class.

### (module scope)

Setter/getter — section heading text.

### `items`

Setter/getter — award/mention entries for the carousel.

### `legalLinks`

Legal-page links for the footer row (see awards/data.ts).

### `_ensureData`

Loads the mentions + legal-links nodes when missing (SWR).

### `_setupCarousel`

Builds the auto-advance loop (see awards/carousel.ts).

### `_showProgress`

Shows the circular progress indicator for the current slide.

### `_hideProgress`

Hides the progress arc (paused/hover).

### `_restartProgressAnimation`

Resets the SVG progress arc so the next slide's timer animates from zero.

### `_bindLinks`

Wires internal links through the SPA router.

### (module scope)

JSX template for the component's shadow DOM.
