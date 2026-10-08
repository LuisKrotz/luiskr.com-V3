[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-image-decoder](../README.md) / wasmImageDecoder

```ts
const wasmImageDecoder: WASMImageDecoder;
```

Defined in: [core/utils/wasm/wasm-image-decoder.ts:212](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-image-decoder.ts#L212)

Shared decoder singleton — the bitmap cache is global so a bitmap
decoded for one surface (mosaic) is reused by another (carousel).
