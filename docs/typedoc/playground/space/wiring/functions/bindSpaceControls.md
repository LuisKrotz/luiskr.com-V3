[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/wiring](../README.md) / bindSpaceControls

```ts
function bindSpaceControls(c): void
```

Defined in: [src/playground/space/wiring.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/space/wiring.ts#L56)

Binds the whole panel via four delegated scoped listeners on the shadow
root: click (panel toggle, reopen, collapsible headers, data-action
buttons), focusin/focusout (keyboard traversal temporarily expands a
collapsed group while focus is inside), input (sliders), and change
(checkboxes) — the last two both route to _handleInput. Delegation means
a re-render doesn't lose handlers.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

## Returns

`void`
