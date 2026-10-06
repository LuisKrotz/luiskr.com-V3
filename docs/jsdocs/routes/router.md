# `routes/router.ts`

History-API SPA router for the public site.

| | |
|---|---|
| **Source** | `src/routes/router.ts` |
| **UX surface** | One page of the site per file — the URL the visitor lands on. |

## Members

### `Router`

History-API router: parses paths into route descriptors, runs before/after
hooks, updates history + title + canonical + scroll, and notifies
subscribers (<app-root> swaps the view element on notification).

### `routes`

Static route table — unused; resolution is imperative in parsePath.

### `currentRoute`

Last resolved route descriptor {name, view, lang, path, meta, params}.

### `listeners`

Subscriber callbacks fired by notify() on every successful nav.

### `beforeHooks`

Navigation guards; each may return a redirect path/{path}.

### `afterHooks`

Post-nav side-effect hooks (run after history+title are updated).

### (module scope)

Wires the browser Back/Forward buttons into handleNavigation.

### `beforeEach`

Registers a navigation guard; a hook may return a redirect path/object.

### `afterEach`

Registers a post-navigation hook (analytics, side effects).

### `subscribe`

Subscribes a listener to route changes.
- `@returns` unsubscribe function

### `notify`

Fans the route change out to subscribers; one bad listener can't break the rest.

### `parsePath`

Pure URL → route-descriptor resolution — see parse-path.ts for the
route table and slug priority order.

### `resolve`

Public alias of parsePath kept for API compatibility.

### `match`

Public alias of parsePath kept for API compatibility.

### `handleNavigation`

Full navigation pipeline — see navigate.ts.

### `push`

Navigates forward, pushing a history entry.

### `replace`

Navigates without adding a history entry (redirects, boot).

### `init`

Bootstraps the router from the current URL (replaces, not pushes).

### `router`

The router constant.
