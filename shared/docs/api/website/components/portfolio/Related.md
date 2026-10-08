# `website/components/portfolio/Related.tsx`

&lt;portfolio-related&gt; — "related projects" strip at the

| | |
|---|---|
| **Source** | `src/website/components/portfolio/Related.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `PortfolioRelated`

The PortfolioRelated — related class.

### `_toggleNote`

Toggles the clamped footer disclaimer between one-line and full text.

### `_measureNote`

Detects whether the clamped note actually overflows — CSS cannot
detect line-clamp truncation, so scrollHeight vs clientHeight does
it here. The flag drives the `is-truncated` class that reveals the
pulsing "···" affordance; measured only while collapsed (open state
is unclamped by definition, and the affordance hides anyway).

### `_watchNoteTruncation`

Binds a ResizeObserver to the note button so font loads, viewport
resizes and locale swaps re-evaluate truncation. The element is
recreated on every render, so the observer re-binds whenever the
node identity changes instead of watching a detached element.

### `storage`

CDN base URL for project media.

### `projectsList`

Maps the DB `related.projects` rows into display-ready cards — see
related/match.ts for the fuzzy link/image/title join against the
home portfoliolist.

### (module scope)

Lifecycle: seeds translations from the store (they may already be
loaded by the view), kicks the SWR fetch for the two DB nodes it
needs, and subscribes to the router — navigating between projects
re-runs the fuzzy match against the new page's related list.

### (module scope)

Lifecycle: removes the router subscription + the note observer.

### `fetchData`

Fires two SWR reads in parallel: the home page node (for the
portfoliolist join table) and the components/related node — see
related/data.ts.

### (module scope)

JSX template for the component's shadow DOM.
