# `core/tokens/jsx/props.ts`

JSX prop-application dictionaries — boolean-attribute set,

| | |
|---|---|
| **Source** | `src/core/tokens/jsx/props.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `PROP_ATTR_MAP`

camelCase JSX prop → lowercase HTML attribute spelling. The DOM accepts
only the lowercase form (`playsinline`, `readonly`, `tabindex`, `for`).

### `DOM_PROPS`

Properties that must be set via the DOM property (el[key] = val)
rather than el.setAttribute(key, val) so the browser reflects
the live state (e.g. slider thumb position, input text).

### `JSX_METADATA_PROPS`

Compiler-only JSX metadata. OXC/Babel may inject these in development
transforms; they describe source locations/runtime ownership and must never
leak into rendered HTML as `"[object Object]"` attributes.

### `JSX_PROPS`

Special prop names handled by `h()` before the generic setAttribute
fallback — event prefix detection, ref callbacks, sanitized HTML
injection, and the iOS playsinline quirk.
