# `core/router/router.ts`

History-API SPA router for the public site.

| | |
|---|---|
| **Source** | `src/core/router/router.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Route type re-exports — canonical definitions + docs live in ./types.js.

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

Wires the browser Back/Forward buttons into handleNavigation — popstate
fires only on traversal, so programmatic pushState/replaceState don't
double-trigger navigation. No-op under SSR.

### `beforeEach`

Registers a navigation guard; a hook may return a redirect path/object.

### `afterEach`

Registers a post-navigation hook (analytics, side effects).

### `subscribe`

Subscribes a listener to route changes.
- `@param` listener Callback receiving (to, from) descriptors.
- `@returns` unsubscribe function

### `notify`

Fans the route change out to subscribers; each call is wrapped so one
throwing listener can't break the rest (logged via devError).
- `@param` to Destination descriptor.
- `@param` from Origin descriptor — null on first navigation.

### `parsePath`

Pure URL → route-descriptor resolution — see parse-path.ts for the
route table and slug priority order.
- `@param` pathname Raw URL pathname (+search/hash tolerated).
- `@returns` The matched descriptor (404-shaped when nothing matches).

### `resolve`

Public alias of parsePath kept for API compatibility.

### `match`

Public alias of parsePath kept for API compatibility.

### `handleNavigation`

Full navigation pipeline — guards → history → meta → notify; see
navigate.ts for the stage order.
- `@param` path Destination URL path.
- `@param` replace When true, replace the current history entry instead of pushing.

### `push`

Navigates forward, pushing a history entry.

### `replace`

Navigates without adding a history entry (redirects, boot).

### `init`

Bootstraps the router from the current URL (replaces, not pushes).

### `router`

Shared router singleton — the whole app navigates through one instance
so currentRoute, hooks, and subscribers stay coherent.
