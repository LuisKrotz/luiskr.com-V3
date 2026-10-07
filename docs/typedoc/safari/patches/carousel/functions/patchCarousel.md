[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [safari/patches/carousel](../README.md) / patchCarousel

```ts
function patchCarousel(): void
```

Defined in: [src/safari/patches/carousel.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/patches/carousel.ts#L18)

Installs the carousel patch once <custom-carousel> registers: neuters
`_measureFit` (iOS layout thrash — reading fit metrics mid-layout
forces synchronous reflow on every slide) and wraps `_renderInitial`
to inject the safari-carousel stylesheet into the shadow root.

## Returns

`void`
