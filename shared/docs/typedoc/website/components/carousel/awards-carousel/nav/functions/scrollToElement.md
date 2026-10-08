[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/nav](../README.md) / scrollToElement

```ts
function scrollToElement(host, el): void;
```

Defined in: [website/components/carousel/awards-carousel/nav.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/nav.ts#L20)

Smooth-centers an element in the track. Formula (same geometry as
CustomCarousel): scrollLeft + (el.left − track.left) positions the
slide at the track's left edge; −(track.w − el.w)/2 recenters it so
the slide's midpoint sits on the track's midpoint.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

### el

`Element`

Slide element to center.

## Returns

`void`
