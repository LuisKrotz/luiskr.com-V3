# `components/portfolio/Related.tsx`

&lt;portfolio-related&gt; — "related projects" strip at the

| | |
|---|---|
| **Source** | `src/components/portfolio/Related.tsx` |
| **UX surface** | Related-projects strip on case-study pages. |

## Members

### `PortfolioRelated`

The PortfolioRelated — related class.

### `_toggleNote`

Toggles the clamped footer disclaimer between one-line and full text.

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

Lifecycle: removes the router subscription.

### `fetchData`

Fires two SWR reads in parallel: the home page node (for the
portfoliolist join table) and the components/related node — see
related/data.ts.

### (module scope)

JSX template for the component's shadow DOM.
