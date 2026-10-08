[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/wiring](../README.md) / bindSpaceControls

```ts
function bindSpaceControls(c): void;
```

Defined in: [experiments/earth-playground/space/wiring.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/wiring.ts#L56)

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
