[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/nav](../README.md) / scrollToElement

```ts
function scrollToElement(host, el): void
```

Defined in: [src/components/carousel/awards-carousel/nav.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/awards-carousel/nav.ts#L17)

Smooth-centers an element in the track. Formula (same geometry as
CustomCarousel): scrollLeft + (el.left − track.left) positions the
slide at the track's left edge; −(track.w − el.w)/2 recenters it so
the slide's midpoint sits on the track's midpoint.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

### el

`Element`

## Returns

`void`
