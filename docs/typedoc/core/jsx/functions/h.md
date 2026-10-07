[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/jsx](../README.md) / h

```ts
function h(tag, props, ...children): HTMLElement | DocumentFragment | SVGElement
```

Defined in: [src/core/jsx.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/jsx.ts#L54)

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
  `null`/`undefined`/`false` props are skipped entirely (conditional attrs).

## Parameters

### tag

[`JSXTag`](../type-aliases/JSXTag.md)

### props

`Record`\<`string`, `unknown`\> \| `null`

### children

...`unknown`[]

## Returns

`HTMLElement` \| `DocumentFragment` \| `SVGElement`
