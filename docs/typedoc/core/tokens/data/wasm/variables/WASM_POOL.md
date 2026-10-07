[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/data/wasm](../README.md) / WASM\_POOL

```ts
const WASM_POOL: Readonly<{
  WORKER_URL: '/workers/wasm-worker.js'
  ENGINE_URL: '/wasm/engine.wasm'
  MOBILE_MAX: 2
  DESKTOP_MIN: 2
  DESKTOP_MAX: 4
  FALLBACK_CORES: 2
}>
```

Defined in: [src/core/tokens/data/wasm.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/data/wasm.ts#L40)

Frozen worker-pool sizing + asset tokens. Sole declaration site for the
worker script path and the pool-size caps — mobile SoCs thermal-throttle
under wide pools so the cap is tighter than desktop; the cores fallback
covers engines without navigator.hardwareConcurrency.
