[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-media-threads](../README.md) / MediaSegment

Defined in: [src/utils/wasm/wasm-media-threads.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L62)

One byte-range fetch request for parallel segment download.

## Properties

### url

```ts
url: string
```

Defined in: [src/utils/wasm/wasm-media-threads.ts:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L64)

URL of the resource (same file, different ranges).

---

### byteStart?

```ts
optional byteStart?: number;
```

Defined in: [src/utils/wasm/wasm-media-threads.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L66)

Inclusive start offset — defaults to 0 when omitted.

---

### byteEnd?

```ts
optional byteEnd?: number | null;
```

Defined in: [src/utils/wasm/wasm-media-threads.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L68)

Exclusive end offset — null fetches to EOF.
