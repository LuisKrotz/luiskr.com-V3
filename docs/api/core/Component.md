# `core/Component.ts`

BaseComponent — Custom Element base class with Shadow DOM encapsulation,

| | |
|---|---|
| **Source** | `src/core/Component.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Loose reactive state bag — subclasses narrow via their own declarations.

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

### `_skeletonLayer`

Live WebGL skeleton layer, owned by syncSkeletonLayer()/destroySkeletonLayer().

### (module scope)

Lifecycle hooks — declared on the base so `?.()` calls are type-safe and
subclasses get a documented override point.

### `setState`

Set partial state and re-render content (NOT styles).

### `connectedCallback`

DOM insertion — runs onInit (data setup), the one-time style/content
build (_renderInitial), then onMounted + onUpdated so a first render is
indistinguishable from an update, and finally registers this element
with the WebGL skeleton scanner (no-op when no skeletons are present).

### `disconnectedCallback`

DOM removal — tears down in reverse order: scoped listeners, store
subscriptions, the WebGL skeleton layer for this element, then the
subclass's onDestroy (engine/audio/observer cleanup).

### (module scope)

Safe scoped querySelector inside Shadow Root.

### (module scope)

Safe scoped querySelectorAll inside Shadow Root.

### `addScopedListener`

Scoped event listener with automatic lifecycle cleanup.
Prevents duplicate listeners: if the same handler reference is registered
for the same target+event, subsequent calls are no-ops.

### `subscribe`

Subscribe to store changes with automatic lifecycle cleanup.

### (module scope)

Initial render: injects styles ONCE and creates the content node.
Called exactly once from connectedCallback().

### `_updateDom`

Update content without touching the style node.
Only the content wrapper is replaced — the <style> node
remains untouched, preventing style re-parsing and IntersectionObserver
destruction that occurred in the previous innerHTML = styleBlock + content approach.

### (module scope)

Applies the render output (DOM Node, DocumentFragment, or HTML string) to the content wrapper.

### `render`

Subclasses render() to return a JSX DOM Node or HTML string for the content area.
