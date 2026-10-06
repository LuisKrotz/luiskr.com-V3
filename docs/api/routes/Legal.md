# `routes/Legal.tsx`

&lt;view-legal&gt; — the legal-page route (privacy policy, GDPR,

| | |
|---|---|
| **Source** | `src/routes/Legal.tsx` |
| **UX surface** | One page of the site per file — the URL the visitor lands on. |

## Members

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
