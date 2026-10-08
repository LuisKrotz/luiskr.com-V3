[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/arrows](../README.md) / mountWebGLArrows

```ts
function mountWebGLArrows(c): void;
```

Defined in: [website/components/carousel/custom-carousel/arrows.ts:105](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/arrows.ts#L105)

Mounts the CarouselArrowWebGL widgets on the prev/next button canvases.
Idempotent per canvas: a live widget whose canvas was replaced by a
re-render is destroyed first (a canvas can't host two GL contexts), and
a widget on the same canvas is left alone — GL contexts are never
churned by renders.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
