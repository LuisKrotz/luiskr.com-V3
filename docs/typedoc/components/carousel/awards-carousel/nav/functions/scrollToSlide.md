[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/nav](../README.md) / scrollToSlide

```ts
function scrollToSlide(host, idx): void
```

Defined in: [src/components/carousel/awards-carousel/nav.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/awards-carousel/nav.ts#L83)

Smooth scroll to slide idx (children offset +1 skips the last-clone).
Same centering math as scrollToElement but reads rects fresh — the
track may have scrolled between calls, so offsets come from
getBoundingClientRect, not offsetLeft.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

### idx

`number`

Real-slide index.

## Returns

`void`
