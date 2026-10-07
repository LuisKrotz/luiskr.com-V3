[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/sizing](../README.md) / measureFit

```ts
function measureFit(c, observedWidth?): void
```

Defined in: [src/components/carousel/custom-carousel/sizing.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/sizing.ts#L58)

Decides whether the items fit side-by-side (no carousel chrome) or need
the scroll track. Side-by-side requires: ≤2 items, no landscape item
(too wide to pair), viewport ≥ SIDE_BY_SIDE_BREAKPOINT, and projected
total width ≤ host width. Projection: each item lays out at
maxH = MAX_HEIGHT_VH of viewport height, so rendered width ≈
(w/h)·maxH plus ITEM_GAP_PX flex gap. Items missing intrinsic sizes
use GENERIC_DIMENSIONS defaults (conservative portrait) so a partial
CMS row can't silently flip to scroll mode.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

### observedWidth?

`number`

Fresh RO width when known — avoids a layout read.

## Returns

`void`
