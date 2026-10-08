# `website/components/nav/flag.tsx`

Locale flag rendering + FlagWebGL lifecycle for &lt;app-nav&gt;,

| | |
|---|---|
| **Source** | `src/website/components/nav/flag.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Host surface the flag helpers need (satisfied by AppNav).

### `_navFlags`

Live flag widgets (max one — the menu flag).

### `_menuFlagCanvasEl`

Persistent per-locale flag canvas; rebuilt on locale change.

### `_menuFlagLang`

Locale the current flag canvas was built for.

### (module scope)

Active locale code.

### (module scope)

The active LANG_OPTIONS entry (code + label + flag cc).

### `navFlagCanvas`

Returns the persistent flag canvas for the current locale, rebuilding
it only when the locale changed — a new canvas means a new GL context,
so the old widget is destroyed first to keep total contexts bounded.
- `@param` host AppNav instance.
- `@returns` The per-locale canvas element.

### `renderNavLocaleFlag`

Flag button content: GL canvas + <img> fallback (split flag for dual-cc locales).

### `mountNavFlag`

Creates the FlagWebGL instance on the flag button's canvas.

### `destroyNavFlag`

Tears down the FlagWebGL instance.
