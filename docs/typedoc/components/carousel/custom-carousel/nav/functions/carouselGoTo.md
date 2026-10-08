[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/nav](../README.md) / carouselGoTo

```ts
function carouselGoTo(c, idx): void
```

Defined in: [website/components/carousel/custom-carousel/nav.ts:87](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/carousel/custom-carousel/nav.ts#L87)

Navigate to slide idx — accepts out-of-range idx (idx<0 or idx≥len) by
scrolling to the CLONE slide at that edge, then scheduling an instant
teleport to its real twin (the infinite-loop illusion). Also lazy-loads
the new neighborhood and triggers `loadHighRes` on the active
<media-figure> so the target slide upgrades immediately rather than on
the next intersection tick. The double-modulo normalizes idx into
[0,len) — a single % yields −1 for negative input.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

### idx

`number`

Target index — may be −1 or len for edge wraps.

## Returns

`void`
