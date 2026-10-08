[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-pool](../README.md) / wasmPool

```ts
const wasmPool: WasmWorkerPool;
```

Defined in: [core/utils/wasm/wasm-pool.ts:232](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-pool.ts#L232)

Shared pool singleton — all WASM dispatch callers funnel through one
instance so workers are spawned once and round-robin state is global.
