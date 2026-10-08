# `core/router/navigate.ts`

| | |
|---|---|
| **Source** | `src/core/router/navigate.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `ANCHOR_SCROLL_DELAY`

ms to wait before scrolling to an anchored route's marker element.

### `isCmsPath`

The CMS is a separate document/app (cms/index.html) — /cms and /admin
are hard navigations so the CMS boots in isolation. In production the
firebase.json rewrites cover this; in dev Vite resolves /cms to the
CMS document directly. The clean /cms path keeps index.html out of the
address bar — the rewrite stays internal to hosting.

### `syncDocumentHead`

document.title + canonical <link> sync for the resolved route.

### `syncScroll`

Anchored routes (#about/#contact) wait 300ms — long enough for the
home view's dynamic chunk to mount its shadow DOM — then
deepQuerySelector pierces that shadow to find the marker element.
All other routes hard-reset to top so the new view doesn't inherit
the previous page's scroll depth.

### (module scope)

Runs the redirect-capable before hooks; resolves true when nav proceeds.

### (module scope)

Full navigation pipeline — the space-playground chunk is preloaded
when navigated to, since it's excluded from the idle route warmer
for size.
