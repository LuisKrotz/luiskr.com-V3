[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/sizing](../README.md) / measureFit

```ts
function measureFit(c, observedWidth?): void;
```

Defined in: [website/components/carousel/custom-carousel/sizing.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/sizing.ts#L61)

Decides whether the items fit side-by-side (no carousel chrome) or need
the scroll track. Side-by-side requires: ≤2 items, viewport
≥ SIDE_BY_SIDE_BREAKPOINT, and projected total width ≤ host width.
The projection mirrors the shadow-DOM contract in media-figure.scss +
carousel-host.scss exactly: strip height is --mf-h (70dvh minus a pad
under 1024, fixed $space-* steps above), media width is
ratio·stripH floored at MEDIA_MIN_WIDTH on ≥375px viewports and capped
by the regular gutter cap or the landscape --mf-max-w ladder, and each
item adds its breakpoint padding + desktop side margin. Items missing
intrinsic sizes use GENERIC_DIMENSIONS defaults (conservative portrait)
so a partial CMS row can't silently flip to scroll mode.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

### observedWidth?

`number`

Fresh RO width when known — avoids a layout read.

## Returns

`void`
