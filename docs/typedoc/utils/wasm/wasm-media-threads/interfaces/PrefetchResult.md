[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-media-threads](../README.md) / PrefetchResult

Defined in: [src/utils/wasm/wasm-media-threads.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L46)

Outcome of a quality-variant prefetch — the winning variant + poster.

## Indexable

```ts
[key: string]: unknown
```

Extra worker diagnostics — forward-compatible.

## Properties

### best?

```ts
optional best?: VideoVariant;
```

Defined in: [src/utils/wasm/wasm-media-threads.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L48)

Variant the worker judged best (first byte-range to arrive / quality).

---

### poster?

```ts
optional poster?: ImageBitmap;
```

Defined in: [src/utils/wasm/wasm-media-threads.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L50)

Poster frame decoded to a zero-copy ImageBitmap in the worker.
