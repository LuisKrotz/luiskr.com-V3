[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/wasm](../README.md) / WASM\_POOL

```ts
const WASM_POOL: Readonly<{
  WORKER_URL: "/scripts/workers/wasm-worker.js";
  ENGINE_URL: "/scripts/wasm/engine.wasm";
  MOBILE_MAX: 2;
  DESKTOP_MIN: 2;
  DESKTOP_MAX: 4;
  FALLBACK_CORES: 2;
}>;
```

Defined in: [core/tokens/data/wasm.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/wasm.ts#L41)

Frozen worker-pool sizing + asset tokens. Sole declaration site for the
worker script path and the pool-size caps — mobile SoCs thermal-throttle
under wide pools so the cap is tighter than desktop; the cores fallback
covers engines without navigator.hardwareConcurrency.
