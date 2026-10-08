# `website/views/legal/Legal.tsx`

&lt;view-legal&gt; — the legal-page route (privacy policy, GDPR,

| | |
|---|---|
| **Source** | `src/website/views/legal/Legal.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `ViewLegal`

The ViewLegal — legal class.

### (module scope)

Lifecycle: kicks off document loading.

### `onRouteParamChange`

Router hook — swapping between legal pages reloads the document without remounting.

### (module scope)

Lifecycle: cleans up listeners.

### (module scope)

Reloads when the locale changes.

### `loadData`

Fetches the legal document node (privacy-policy | gdpr | terms-of-use)
for the current locale. `wait` defers the DOM write — used after a
route swap so the old document's fade-out finishes before the new
skeleton→content swap (prevents a flash of loading state). SWR: the
callback fires immediately on cache hit AND on network revalidation.

### (module scope)

JSX template — two states: loaded renders the document's sections
(CMS HTML paragraphs via dangerouslySetInnerHTML — trusted content,
sanitized at write time in the CMS); loading renders 3 skeleton
sections mirroring the real title+paragraph geometry so the swap is
seamless. Text-only route: no media fetches at all.

### `drawPlan`

Ordered reveal plan — one running cursor across the whole document
so titles and paragraphs cascade in reading order even when several
sections are in the viewport at once. Each item's offset is the
cumulative duration of every item before it (chars × its section's
per-char delay) plus a global index step; the `ordered` attribute
makes draw-text read that offset against the shared session clock.
