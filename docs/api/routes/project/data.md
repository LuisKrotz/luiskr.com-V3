# `routes/project/data.ts`

Data plumbing for &lt;view-project&gt;: slug resolution from the

| | |
|---|---|
| **Source** | `src/routes/project/data.ts` |
| **UX surface** | One page of the site per file — the URL the visitor lands on. |

## Members

### `updateRobotsMeta`

Toggles the noindex meta for draft/hidden projects.

### `resolveProjectSlug`

Derives the project key from the route params, falling back to the URL.

### `initProject`

Initializes the resolved project record for the current route.

### `loadData`

Fetches the project node for the route's slug via SWR (optionally deferred).

### `onRouteParamChange`

Router hook — project→project navigations reload data without remounting.
