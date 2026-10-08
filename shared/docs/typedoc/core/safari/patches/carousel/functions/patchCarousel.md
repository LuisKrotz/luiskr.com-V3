[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/safari/patches/carousel](../README.md) / patchCarousel

```ts
function patchCarousel(): void;
```

Defined in: [core/safari/patches/carousel.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/safari/patches/carousel.ts#L18)

Installs the carousel patch once <custom-carousel> registers: neuters
`_measureFit` (iOS layout thrash — reading fit metrics mid-layout
forces synchronous reflow on every slide) and wraps `_renderInitial`
to inject the safari-carousel stylesheet into the shadow root.

## Returns

`void`
