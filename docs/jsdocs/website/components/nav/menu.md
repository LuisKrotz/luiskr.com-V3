# `website/components/nav/menu.tsx`

Fullscreen menu overlay behavior for &lt;app-nav&gt;, extracted

| | |
|---|---|
| **Source** | `src/website/components/nav/menu.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Host surface the menu helpers need (satisfied by AppNav).

### `_menuOpen`

Menu overlay open flag.

### `_menuClosing`

Close animation in flight — guards double-close.

### `_menuSettled`

Open animation completed — close X may snap to drawn state.

### `_menuSettleTimer`

Settle-delay timer handle; cleared on destroy/close.

### `_menuBg`

Live menu-background widget over the fullscreen canvas.

### `_menuCloseBtn`

Live close-X widget.

### `_burgerBtn`

Live burger widget.

### `_burgerCanvasEl`

Persistent burger canvas (survives re-renders).

### `_menuCanvasEl`

Persistent menu background canvas.

### `_menuCloseCanvasEl`

Persistent close-X canvas.

### `_onDark`

True while the nav floats over a dark band (contrast variant).

### `$`

Shadow-scoped querySelector.

### `_updateDom`

Triggers a template re-render.

### `navBurgerCanvas`

The burger icon's canvas element — lazily created once and kept for
the component's lifetime so its WebGL context is never churned by
re-renders (canvas recreation would force a fresh GL context). Each
call also re-syncs the on-dark class and aria-label/expanded since
those change without recreating the element.
- `@param` host AppNav instance.
- `@param` label aria-label for the burger (localized "menu").
- `@returns` The persistent canvas element.

### `navMenuCanvas`

Canvas JSX for the WebGL menu background.

### `navMenuCloseCanvas`

Canvas JSX for the WebGL menu close (X) icon.

### `toggleNavMenu`

Opens/closes the fullscreen menu overlay.

### `openNavMenu`

Opens the menu: flips the state flags and re-renders — the new DOM
mounts the menu canvases, then onUpdated → mountNavMenuWebGL attaches
the widgets. Scroll-lock is handled by the CSS class on the wrapper.

### `mountNavMenuWebGL`

Binds the WebGL layers to the persistent menu canvases. Because the
canvas elements survive re-renders, each context is created once per
open cycle instead of once per store/router update.

### `mountNavBurgerWebGL`

Attaches BurgerButtonWebGL to the persistent burger canvas — or tears
it down when the canvas left the DOM (menu states that remove the
burger, e.g. 404). Idempotent: a live widget is never re-created.

### `closeNavMenu`

Closes the menu through the full dissolve cycle: adds the -closing
class (CSS plays the item fade-out), releases the contour field so it
dissolves back to center, then after MENU_CLOSE_DURATION destroys
all three GL widgets + their canvases and re-renders the closed nav.
The _menuClosing guard makes double-close (Esc + click) a no-op.
