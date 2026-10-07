# `core/jsx.ts`

Zero-dependency native DOM JSX pragma.

| | |
|---|---|
| **Source** | `src/core/jsx.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Any child value `h()`/`Fragment` accept — nodes, scalars, nested arrays.

### (module scope)

Functional component tag — receives `{...props, children}` and returns a node.

### (module scope)

JSX tag position type — a tag name ('div', 'media-figure') or a functional component.

### `PROP_ATTR_LOOKUP`

camelCase-prop → attribute-name lookup (e.g. `viewBox` → `viewBox`,
`htmlFor` → `for`). Readonly view over the shared token map — cast once
here so every prop lookup is a plain object read instead of a re-cast.

### `h`

JSX factory function — every `render()` in the app funnels through here.
Creates real DOM nodes directly (no VDOM, no diffing): the element is
built, props applied, children appended, and the live node returned.

Prop routing, by key shape:
 - `onClick`/`onInput`/… (function) → `addEventListener(key[2:].toLowerCase(), fn)`
 - `className`/`class` → className (setAttribute for SVG, which lacks the prop)
 - `style` → cssText string, or object (camelCase props + `--*` custom props via setProperty)
 - `ref` (function) → called with the element after creation
 - `dangerouslySetInnerHTML={{__html}}` → sanitized innerHTML (DB HTML bodies)
 - `playsInline` → bare `playsinline` attribute (iOS Safari quirk)
 - boolean props (disabled/hidden/muted/…) → property + bare attribute
 - DOM props (value/checked/innerHTML/…) → property assignment + attribute mirror
 - everything else → `setAttribute(name, String(val))`
`null`/`undefined`/`false` props are skipped entirely (conditional attrs) —
a `false` must never emit `attr="false"`, which is truthy per HTML.
- `@param` tag Tag name string or functional component.
- `@param` props Props bag; null allowed (JSX emits null for bare elements).
- `@param` children Rest children — scalars, nodes, nested arrays.
- `@returns` The live element or fragment.

### `Fragment`

JSX Fragment factory — groups children without a wrapper element.
Returns a DocumentFragment whose children move into the parent on append
(the fragment itself is empty afterwards, which is intended — MDN: the
fragment's children are moved, not copied, into the insertion point).
- `@param` props `{ children }` bag emitted by the JSX transform.
- `@returns` Populated DocumentFragment.

### `appendChildren`

Appends the `children` rest-args to `parent`. Handles arbitrarily nested
arrays (JSX `list.map(...)` expressions inside children), skips the JSX
conditional-render sentinels (`null`/`undefined`/`false`), and wraps
anything that isn't a Node in a text node. Recursion (not a manual stack)
matches the self-similar child-array shape per the repo traversal rule.
- `@param` parent Node receiving the children.
- `@param` children Rest-args array forwarded from h()/Fragment.
