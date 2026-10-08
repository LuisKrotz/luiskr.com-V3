[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/media/draw-text/fit](../README.md) / setupFit

```ts
function setupFit(host): void;
```

Defined in: [website/components/media/draw-text/fit.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/draw-text/fit.ts#L116)

Installs the fit pipeline for a fitted host: immediate measure, a
ResizeObserver on the parent (the sizing constraint) for breakpoint /
orientation changes, and a one-shot refit once webfonts finish loading
(late font swaps can widen the same word by several percent).

## Parameters

### host

[`DrawText`](../../../DrawText/classes/DrawText.md)

— the draw-text element

## Returns

`void`
