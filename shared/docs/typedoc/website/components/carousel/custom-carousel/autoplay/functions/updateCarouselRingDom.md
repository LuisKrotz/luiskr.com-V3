[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/autoplay](../README.md) / updateCarouselRingDom

```ts
function updateCarouselRingDom(c): void;
```

Defined in: [website/components/carousel/custom-carousel/autoplay.ts:197](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/autoplay.ts#L197)

Pushes progress into the DOM: the SVG ring's stroke-dashoffset (full
circumference = empty, 0 = full circle) and the WebGL arrows' arc.
The offset math lives in wasm-layout (SIMD-capable batch helper with a
JS fallback) since this runs per frame.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

The carousel host.

## Returns

`void`
