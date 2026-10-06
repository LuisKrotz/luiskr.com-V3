# `components/nav/flag.tsx`

Locale flag rendering + FlagWebGL lifecycle for &lt;app-nav&gt;,

| | |
|---|---|
| **Source** | `src/components/nav/flag.tsx` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### (module scope)

Host surface the flag helpers need (satisfied by AppNav).

### `navFlagCanvas`

Returns the persistent flag canvas for the current locale, rebuilding
it only when the locale changed.

### `renderNavLocaleFlag`

Flag button content: GL canvas + <img> fallback (split flag for dual-cc locales).

### `mountNavFlag`

Creates the FlagWebGL instance on the flag button's canvas.

### `destroyNavFlag`

Tears down the FlagWebGL instance.
