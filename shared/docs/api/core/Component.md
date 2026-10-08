# `core/Component.ts`

BaseComponent — Custom Element base class with Shadow DOM encapsulation,

| | |
|---|---|
| **Source** | `src/core/Component.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `_sharedSheets`

Module-level CSSStyleSheet cache keyed by the full style text. Each unique
style string is parsed once via `CSSStyleSheet.replaceSync` and the resulting
sheet is shared across every component instance through
`ShadowRoot.adoptedStyleSheets` — parsing CSS is the expensive part, so one
sheet per component class (not per element) is the intended ratio. The Map
also makes re-mounts free: the same key hits the same cached sheet.

### (module scope)

Component state bag — keys are declared per-component and narrowed by
each subclass's own types; `any` is deliberate (unknown would force a
cast at every read site).

### (module scope)

Minimal structural type for the store contract used here: anything exposing
`subscribe(fn) → unsubscribe`. The real store satisfies it, and tests can
pass a stub without importing the full singleton graph.

### `BaseComponent`

Base class every view/component extends. Owns the four things the app
relies on being uniform:
 1. Shadow root + one stylesheet injection strategy (adoptedStyleSheets
    with a shared-sheet cache, `<style>` fallback on old engines);
 2. `setState → render → _updateDom` reactive cycle;
 3. automatic teardown — scoped listeners, store subs, and the WebGL
    skeleton layer are released in disconnectedCallback;
 4. lifecycle hooks subclasses implement: render(), onInit, onMounted,
    onUpdated, onStoreUpdate(store), onDestroy.

### (module scope)

`?inline` SCSS text injected once per shadow root.

### (module scope)

Disposers for listeners added via addScopedListener(). Drained in
disconnectedCallback so elements never leak listeners across mounts —
critical for elements that move in the DOM (carousel reorder, route swap).

### (module scope)

Unsubscribe callbacks from store.subscribe(). Drained on disconnect so a
detached element stops receiving store pushes and can be GC'd.

### `_isMounted`

Whether the element is currently connected. Read by the store-subscription
wrapper to skip onStoreUpdate on detached elements (a store push arriving
between disconnect and GC must not re-render into a dead shadow root).

### (module scope)

The `<style>` fallback node, only populated on engines without constructable stylesheets.

### `_contentNode`

Persistent content wrapper inside the shadow root. _updateDom swaps only
this node's children — the style mechanism stays untouched (see file
header for why that split exists).

### `_skeletonLayer`

Live WebGL skeleton layer, owned by syncSkeletonLayer()/destroySkeletonLayer().

### (module scope)

Reactive state bag — written only through setState() so updates always re-render.

### (module scope)

Lifecycle hooks — declared on the base so `?.()` calls are type-safe and
subclasses get a documented override point. Order on first connect:
onInit → _renderInitial → onMounted → onUpdated.

### `constructor`

Attach an open shadow root and stash the component's `?inline` CSS text.
`mode: 'open'` keeps `element.shadowRoot` readable — the codebase and the
happy-dom tests both rely on that handle for assertions and scoped
queries; 'closed' would break both without buying real encapsulation.
- `@param` styles Component-local CSS text (Vite `?inline` import).

### `setState`

Set partial state and re-render content (NOT styles). Accepts either a
patch object or a React-style updater function — the function form is
required when the next state derives from the previous state, since
reads of `this.state` outside the updater can race with queued renders.
The merge is a shallow spread: keys not present in `next` survive, which
lets components update one field without re-sending the whole bag.
- `@param` updater Partial state patch, or (prevState) => patch.

### `connectedCallback`

DOM insertion — runs onInit (data setup), the one-time style/content
build (_renderInitial), then onMounted + onUpdated so a first render is
indistinguishable from an update, and finally registers this element
with the WebGL skeleton scanner (no-op when no skeletons are present).
Per the Custom Elements spec this callback can fire multiple times —
every branch below is written to be idempotent on re-mount.

### `disconnectedCallback`

DOM removal — tears down in reverse order: scoped listeners, store
subscriptions, the WebGL skeleton layer for this element, then the
subclass's onDestroy (engine/audio/observer cleanup). `_isMounted` flips
first so an in-flight store push during teardown hits the guard in
subscribe() rather than rendering into a disconnecting root.

### (module scope)

Safe scoped querySelector inside Shadow Root. Returns null instead of
throwing when the shadow root is absent (detached construction in tests).
- `@param` selector CSS selector evaluated against this.shadowRoot.
- `@returns` First matching element or null.

### (module scope)

Safe scoped querySelectorAll inside Shadow Root — materialized into a
real Array so callers get .map/.filter/forEach (NodeList lacks some
iteration methods on older engines).
- `@param` selector CSS selector evaluated against this.shadowRoot.
- `@returns` Array of matching elements (never null).

### `addScopedListener`

Scoped event listener with automatic lifecycle cleanup.
Prevents duplicate listeners: the DOM itself dedupes identical
(type, listener, capture) tuples per MDN addEventListener semantics, and
every registration is mirrored into _eventDisposers so disconnect removes
it even when the listener captured instance state.
- `@param` target EventTarget to listen on (null → no-op).
- `@param` event Event type token.
- `@param` handler Listener callback or listener object.
- `@param` options Passive/capture/once options forwarded verbatim.

### `subscribe`

Subscribe to store changes with automatic lifecycle cleanup. The wrapper
gates on _isMounted: a store push landing while the element is detached
(mid-move or already removed) is dropped instead of rendering into a
dead shadow root — the next connectedCallback renders fresh state anyway.
- `@param` store Store-like object exposing subscribe(); null/invalid → no-op.

### (module scope)

Initial render: injects styles ONCE and creates the content node.
Called exactly once from connectedCallback() — but on re-mount the shadow
root retains children from the previous mount, so both style and content
paths reuse existing nodes instead of duplicating them.

### `_updateDom`

Update content without touching the style node.
Only the content wrapper is replaced — the <style> node
remains untouched, preventing style re-parsing and IntersectionObserver
destruction that occurred in the previous innerHTML = styleBlock + content
approach (a single string assignment re-parsed all CSS and rebuilt every
tracked element on every state change).

### (module scope)

Applies the render output (DOM Node, DocumentFragment, or HTML string) to the content wrapper.
Three accepted shapes, resolved in priority order:
 - Node → `replaceChildren(node)` — the JSX fast path, keeps DOM identity.
 - Array → `replaceChildren(...filtered)` — fragment-style multi-root
   render; nullish entries are filtered so conditional JSX slots can just
   return null.
 - string/nullish → `innerHTML` — legacy string templates; '' clears.
- `@param` output Render result from render().

### `render`

Subclasses render() to return a JSX DOM Node or HTML string for the content area.
The base implementation returns an empty string so instantiating the base
class directly (tests, scaffolding) produces an empty-but-valid shadow root.
- `@returns` DOM output for _applyRenderOutput.
