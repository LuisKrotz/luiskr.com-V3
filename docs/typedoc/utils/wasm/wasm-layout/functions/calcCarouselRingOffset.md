[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcCarouselRingOffset

```ts
function calcCarouselRingOffset(elapsed, duration, circumference): number
```

Defined in: [src/utils/wasm/wasm-layout.ts:97](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-layout.ts#L97)

Travel distance along the carousel ring for an elapsed fraction of the
loop duration: (elapsed/duration)·circumference — the stroke-dashoffset
driver for the autoplay progress ring.

## Parameters

### elapsed

`number`

Milliseconds into the current autoplay cycle.

### duration

`number`

Full cycle duration in ms.

### circumference

`number`

Ring's 2πr stroke length in px.

## Returns

`number`

Offset in px along the ring.
