[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-pool](../README.md) / wasmPool

```ts
const wasmPool: WasmWorkerPool
```

Defined in: [core/utils/wasm/wasm-pool.ts:232](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-pool.ts#L232)

Shared pool singleton — all WASM dispatch callers funnel through one
instance so workers are spawned once and round-robin state is global.
