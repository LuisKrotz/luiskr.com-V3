[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-media-threads](../README.md) / wasmMediaThreads

```ts
const wasmMediaThreads: WASMMediaThreadManager
```

Defined in: [src/utils/wasm/wasm-media-threads.ts:274](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-media-threads.ts#L274)

Shared media-threads singleton — the three memoization maps are global
so probes/prefetches/decodes are deduplicated across every surface.
