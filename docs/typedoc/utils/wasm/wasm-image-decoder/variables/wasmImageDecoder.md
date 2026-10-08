[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-image-decoder](../README.md) / wasmImageDecoder

```ts
const wasmImageDecoder: WASMImageDecoder
```

Defined in: [core/utils/wasm/wasm-image-decoder.ts:212](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-image-decoder.ts#L212)

Shared decoder singleton — the bitmap cache is global so a bitmap
decoded for one surface (mosaic) is reused by another (carousel).
