[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/dom](../README.md) / deepQuerySelector

```ts
function deepQuerySelector(selector, root?): Element | null;
```

Defined in: [core/utils/dom.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/dom.ts#L28)

Depth-first search for the FIRST element matching `selector`, descending
through every nested shadow root it passes. Order matches the visual
document order (parents before their shadow children). Recursion — not a
hand-rolled stack — matches the self-similar tree shape per repo rule 20.

## Parameters

### selector

`string`

CSS selector.

### root?

`DeepRoot` \| `null`

Subtree root; defaults to document when present.

## Returns

`Element` \| `null`

First match or null.
