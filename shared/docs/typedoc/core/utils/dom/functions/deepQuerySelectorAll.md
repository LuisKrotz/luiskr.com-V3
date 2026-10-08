[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/dom](../README.md) / deepQuerySelectorAll

```ts
function deepQuerySelectorAll(
   selector, 
   root?, 
   results?
): Element[];
```

Defined in: [core/utils/dom.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/dom.ts#L61)

Same traversal as deepQuerySelector but collects EVERY match across all
shadow trees — used for sweeps like "pause every video on the page".
The results array is threaded through recursion (accumulator style) so
no intermediate arrays get concatenated per level.

## Parameters

### selector

`string`

CSS selector.

### root?

`DeepRoot` \| `null`

Subtree root; defaults to document.

### results?

`Element`[] = `[]`

Accumulator — internal recursion state, omit externally.

## Returns

`Element`[]

All matching elements in visual document order.
