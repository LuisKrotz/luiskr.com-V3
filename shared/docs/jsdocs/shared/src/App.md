# `shared/src/App.tsx`

&lt;app-root&gt; — the application's shell custom element.

| | |
|---|---|
| **Source** | `src/shared/src/App.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `AppRoot`

Application shell element. Extends the shared BaseComponent (shadow DOM,
scoped listeners, store subscription, _updateDom re-render pipeline).

### `_docObserver`

Watches document height so onBottom/activeSection never go stale.

### `modal`

Current modal descriptor from the store ({ open, class, transform }).

### `locale`

Active locale code (en, pt, gl, …).

### (module scope)

Lifecycle: runs once when <app-root> connects to the DOM.
Applies persisted preferences, boots data loading, wires the router
subscription, scroll/resize/theme listeners, and lazily imports the
modal/dialog/HUD chunks so they aren't on the critical path.

### (module scope)

Lifecycle: releases the intro loader + document observer when the element disconnects.

### (module scope)

Store-subscription callback: reloads locale data when the language
changes and re-applies modal open/close state to the shell.

### `_updateModalState`

Syncs modal state into the DOM without a full re-render:
  - toggles .modal-open on <html>/<body> (locks scroll via CSS)
  - copies the modal's modifier class onto the app wrapper
  - applies the iOS Safari scroll-lock: <main> becomes position:fixed
    at -scrollY so the page can't rubber-band behind the dialog
  - restores the scroll offset when the modal closes

### `initInputListeners`

Tracks the input method ('pointer' vs 'touch') in the store so styles
can suppress sticky hover states on touch devices. Prefers the unified
PointerEvent API, falls back to touchstart/mousedown.
Also blocks the context menu and drag on media elements (portfolio
imagery shouldn't be right-click-saved or dragged).

### `loadData`

Loads the locale's translation nodes (APP, slugs, components) via the
static-first SWR layer and pushes them into the store + already-mounted
children. Skips nodes already cached for the current locale.

### `updateSectionTops`

Measures the document offsets of the #about and #contact section markers
inside the home view's shadow DOM (deepQuerySelector pierces it) and
records whether both existed — a partial measure keeps
_sectionsMeasured false so checkScroll retries lazily.

### `checkScroll`

Scroll handler: computes near-bottom state and the active home section
(home/about/contact) from measured tops, then pushes both to <app-nav>
so it can switch to the --on-dark variant over the dark contact band.
No-ops on non-home routes except still feeding the nav its state.

### `_updateViewContent`

Reconciles #view-outlet with the target route's view tag. If the same
view type is already mounted (e.g. project→project), delegates to its
onRouteParamChange instead of remounting; otherwise flips the view.

### `_flipToView`

Swaps the outlet's child for a new route view element. Dynamically
imports the route chunk first (each route is a separate lazy chunk),
then cross-fades: .page-fade-out on the outgoing view, swap after
350ms, .page-fade-in on the incoming one. Reduced motion and
first-mount take the instant-swap path.

### (module scope)

JSX template: persistent chrome + routed outlet. The view tag is a
dynamic component (CurrentView = this.currentViewTag).

### (module scope)

Lifecycle: after each re-render, re-pushes translations and modal state into children.
