# `website/components/nav/AppNav.tsx`

&lt;app-nav&gt; — the persistent top navigation bar: logo, burger

| | |
|---|---|
| **Source** | `src/website/components/nav/AppNav.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `_PLAYGROUND_SLUGS`

Pre-computed set of every locale's localized earth-playground slug —
`isPlaygroundPage` needs O(1) membership tests on the last URL segment
(the route resolver may not have run yet when the getter first fires),
so all 16 locales' `earthPlayground` values are flattened once at module
load rather than re-built per check.

### (module scope)

The slice of the APP translation dictionary the nav template reads —
all fields optional since the dictionary arrives incrementally and the
template falls back to English snapshot copy per key.

### `AppNav`

<app-nav> — persistent top bar (logo, burger, locale flag, preferences
trigger) plus the fullscreen menu overlay. Owns four WebGL widgets
(burger, menu background, menu close, locale flag) on persistent
canvases that are never re-created by re-renders — one GL context per
widget for the element's lifetime.

### `_translations`

APP dictionary pushed by <app-root>; null until first fetch lands.

### `_translationsLocale`

Locale the pushed `_translations` were fetched for — the getter returns null on mismatch so stale copy never renders mid-switch.

### `activeSection`

Home anchor the scroll position sits in — drives nav-active styles.

### `onBottom`

Within 200px of document bottom — flips CTA to "scroll up".

### `_navFlags`

Live FlagWebGL widgets (currently max one — the menu flag).

### `_onDark`

True while the nav floats over a dark section — drives the --on-dark variant for contrast inversion.

### `_menuOpen`

Menu overlay is open.

### `_menuClosing`

Close animation in flight — blocks re-entry/double-close.

### `_menuSettled`

Open animation completed — close X can snap to drawn state on reopen.

### `_menuSettleTimer`

Handle for the settle delay; cleared on destroy so no timer outlives the element.

### `_menuBg`

MenuBackgroundWebGL instance — owns the fullscreen contour canvas.

### `_menuCloseBtn`

CloseButtonWebGL on the menu's X.

### `_burgerBtn`

BurgerButtonWebGL on the persistent burger canvas.

### `_burgerCanvasEl`

Burger button canvas host.

### `_menuCanvasEl`

Fullscreen menu background canvas host.

### `_menuCloseCanvasEl`

Menu close-X canvas host.

### `_menuFlagCanvasEl`

Menu flag canvas + the locale it was built for (rebuilt on change).

### `_navStoreSig`

Snapshot of the store inputs the template actually consumes —
compared in onStoreUpdate so unrelated commits (dialog open/close,
modal origin, scroll flags) don't force a DOM wipe that replays the
draw-text letter animation.

### `translations`

Setter/getter — the APP translation dictionary pushed by <app-root>.

### `currentRoute`

The router's active route descriptor.

### `isHomePage`

True on home/about/contact routes (nav shows section links).

### `isPlaygroundPage`

True on the playground route (nav renders in its alternate variant).
Three checks, in order: the resolved route name (fast path), the raw
last URL segment vs the canonical English segments (covers the window
before the first navigation resolves), and the precomputed set of all
16 locales' localized playground slugs.

### `locale`

Active locale code.

### `currentLang`

The active LANG_OPTIONS entry (code + label + flag).

### `currentLangLabel`

Display label for the active locale in the flag button.

### `_flagCanvas`

Returns the persistent flag canvas for the current locale, rebuilding
it only when the locale changed. The element survives re-renders so
the WebGL context is created once per language, not per render.
- `@returns` {HTMLCanvasElement}

### `renderLocaleFlag`

Mounts the FlagWebGL widget onto the nav flag button (theme + reduced-motion aware).

### (module scope)

Lifecycle: wires store subscription, scroll/nav event listeners, router subscription and mounts the WebGL nav widgets.

### (module scope)

Lifecycle: after re-render, re-mounts WebGL widgets that the new DOM replaced.

### (module scope)

Lifecycle: destroys the burger/menu/flag GL widgets and unbinds listeners.

### `_mountNavFlag`

Creates the FlagWebGL instance on the flag button's canvas.

### `_destroyNavFlag`

Tears down the FlagWebGL instance.

### `subscribeRouter`

Subscribes to route changes so nav state/links refresh per page.

### (module scope)

Store change → re-render only when a value the template consumes
actually moved: the locale, the live dictionaries `appText` resolves
against (app/components/slugs — mutations replace them wholesale, so
identity comparison works), the media-modal open flag (nav renders
empty behind it) and reduced-motion. Dialog open/close, modal-origin
and other commits leave the DOM alone — critically, while the menu
is open behind a dialog this keeps every <draw-text> label mounted
and already-drawn instead of replaying the letter animation.
Reduced-motion still reaches live flag widgets on every commit so
they freeze without waiting for a rebuild.

### `updateScrollState`

Receives active-section + near-bottom flags from <app-root>'s scroll tracker and toggles the --on-dark variant.

### `_bindEvents`

Binds click/scroll/menu-toggle handlers inside the shadow root.

### `scrollToTop`

Smooth-scrolls the window back to the top.

### `goToAbout`

Navigates to (or scrolls to) the about section — route-aware.

### `scrollToContact`

Navigates to (or scrolls to) the contact footer — route-aware.

### `handleLogo`

Logo click: navigates home, or scrolls top when already on home.

### `handleAbout`

About link click: routes to the localized about slug.

### `handleAction`

Contact/CTA click: routes to the localized contact slug.

### `_captureOrigin`

Records the clicked button's center point in store.modalOrigin — the
preferences/lang dialogs read it to zoom their "genie" open animation
out from the trigger instead of from screen center.

### `handlePreferences`

Opens the preferences modal (fires open-preferences-modal after capturing origin).

### `handleLang`

Opens the language dialog (fires open-lang-dialog after capturing origin).

### (module scope)

JSX template: logo button, burger, and the fullscreen menu overlay —
the markup lives in nav-render.tsx; this delegates with `this`.

### `_burgerCanvas`

Persistent burger canvas (aria-labeled) — created once, survives re-renders so its GL context does.

### `_menuCanvas`

Canvas JSX for the WebGL menu background.

### `_menuCloseCanvas`

Canvas JSX for the WebGL menu close (X) icon.

### `_toggleMenu`

Opens/closes the fullscreen menu overlay.

### `_openMenu`

Opens the menu (see nav-menu.ts for the state machine).

### `_mountMenuWebGL`

Binds the WebGL layers to the persistent menu canvases.

### `_mountBurgerWebGL`

Attaches BurgerButtonWebGL to the persistent burger canvas.

### `_closeMenu`

Closes the menu through the full dissolve cycle (see nav-menu.ts).
The _menuClosing guard makes double-close (Esc + click) a no-op.
