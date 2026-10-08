[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/nav](../README.md) / scrollToSlide

```ts
function scrollToSlide(host, idx): void;
```

Defined in: [website/components/carousel/awards-carousel/nav.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/nav.ts#L83)

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
