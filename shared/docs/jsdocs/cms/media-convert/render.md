# `cms/media-convert/render.tsx`

| | |
|---|---|
| **Source** | `src/cms/media-convert/render.tsx` |
| **UX surface** | Batch image→WebP conversion pipeline UI. |

## Members

### `renderIdle`

Renders idle.
- `@param` host — the host component

### `renderProgress`

Renders the live progress bar for the media conversion batch —
label + a percent fill computed from done/total (0 when total is 0).
- `@param` {string} label — the phase label shown next to the bar
- `@param` {number} done — items completed so far
- `@param` {number} total — items in the batch

### `renderConverting`

Renders converting.
- `@param` host — the host component

### `renderDone`

Renders done.
- `@param` host — the host component

### `renderError`

Renders error.
- `@param` host — the host component

### `renderMediaConverter`

Renders media converter.
- `@param` host — the host component
