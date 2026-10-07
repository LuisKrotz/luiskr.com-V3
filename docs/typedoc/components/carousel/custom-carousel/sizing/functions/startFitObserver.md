[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/sizing](../README.md) / startFitObserver

```ts
function startFitObserver(c): void
```

Defined in: [src/components/carousel/custom-carousel/sizing.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/sizing.ts#L28)

Wires a ResizeObserver on the host that re-runs _measureFit on width
changes. Reports under FIT_EPS_PX of the last width are dropped —
scrollbars appearing/disappearing and sub-pixel reflow would otherwise
re-fit on every layout pass. The measurement defers one RAF so it runs
post-layout, and ResizeObserver absence (old engines) degrades to the
one-shot window-resize path.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
