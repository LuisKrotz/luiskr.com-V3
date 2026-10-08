[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/jsx](../README.md) / h

```ts
function h(
   tag, 
   props, 
   ...children
): HTMLElement | DocumentFragment | SVGElement;
```

Defined in: [core/jsx.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/jsx.ts#L62)

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

## Parameters

### tag

[`JSXTag`](../type-aliases/JSXTag.md)

Tag name string or functional component.

### props

`Record`\<`string`, `unknown`\> \| `null`

Props bag; null allowed (JSX emits null for bare elements).

### children

...`unknown`[]

Rest children — scalars, nodes, nested arrays.

## Returns

`HTMLElement` \| `DocumentFragment` \| `SVGElement`

The live element or fragment.
