[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-image-decoder](../README.md) / DecodeItem

Defined in: [src/utils/wasm/wasm-image-decoder.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-image-decoder.ts#L20)

One queued decode request — URL plus optional GPU resize hints.

## Properties

### url

```ts
url: string
```

Defined in: [src/utils/wasm/wasm-image-decoder.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-image-decoder.ts#L22)

CDN URL of the source image.

---

### width?

```ts
optional width?: number;
```

Defined in: [src/utils/wasm/wasm-image-decoder.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-image-decoder.ts#L24)

Target display width — passed to createImageBitmap as a resize hint.

---

### height?

```ts
optional height?: number;
```

Defined in: [src/utils/wasm/wasm-image-decoder.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-image-decoder.ts#L26)

Target display height — passed to createImageBitmap as a resize hint.
