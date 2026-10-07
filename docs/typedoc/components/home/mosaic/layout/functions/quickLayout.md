[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/home/mosaic/layout](../README.md) / quickLayout

```ts
function quickLayout(host): void
```

Defined in: [src/components/home/mosaic/layout.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/home/mosaic/layout.ts#L42)

Synchronous layout pass for urgent repaints. Same packing math as
layout() but skips the WASM round-trip so the DOM never waits on a
worker. See layout() for the packing geometry notes.

## Parameters

### host

[`HomeMosaic`](../../../HomeMosaic/classes/HomeMosaic.md)

## Returns

`void`
