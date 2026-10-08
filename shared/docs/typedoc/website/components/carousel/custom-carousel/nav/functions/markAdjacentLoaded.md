[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/nav](../README.md) / markAdjacentLoaded

```ts
function markAdjacentLoaded(c, centerIdx): void;
```

Defined in: [website/components/carousel/custom-carousel/nav.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/nav.ts#L56)

Lazy-load window: flags slides within 2 ring positions of `centerIdx`
as loadable so their media src gets assigned. Distance is measured on
the ring — `min(|i−center|, len−|i−center|)` — so hovering at index 0
pre-loads the tail and vice versa. The two explicit edge lines cover
len<3 where ring distance alone under-marks.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

### centerIdx

`number`

Active slide index.

## Returns

`void`
