[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-media-threads](../README.md) / PrefetchResult

Defined in: [core/utils/wasm/wasm-media-threads.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L46)

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

Defined in: [core/utils/wasm/wasm-media-threads.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L48)

Variant the worker judged best (first byte-range to arrive / quality).

***

### poster?

```ts
optional poster?: ImageBitmap;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L50)

Poster frame decoded to a zero-copy ImageBitmap in the worker.
