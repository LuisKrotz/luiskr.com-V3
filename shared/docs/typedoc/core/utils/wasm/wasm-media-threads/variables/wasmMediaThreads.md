[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-media-threads](../README.md) / wasmMediaThreads

```ts
const wasmMediaThreads: WASMMediaThreadManager;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:274](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L274)

Shared media-threads singleton — the three memoization maps are global
so probes/prefetches/decodes are deduplicated across every surface.
