[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/prefetch](../README.md) / NPU\_PREDICT

```ts
const NPU_PREDICT: Readonly<{
  PREFETCH_THRESHOLD: 0.6;
  HOVER_FULL_MS: 300;
  SPEED_FULL: 2;
  NPU_BASE: 0.4;
  NPU_HOVER_W: 0.45;
  NPU_SPEED_W: 0.15;
  NPU_CAP: 0.99;
  GPU_BASE: 0.38;
  GPU_HOVER_W: 0.47;
  GPU_SPEED_W: 0.15;
  GPU_CAP: 0.98;
  WASM_SPRING_TARGET: 300;
  WASM_SPRING_STIFFNESS: 120;
  WASM_SPRING_DAMPING: 10;
  WASM_POS_MIN: 0.2;
  WASM_CAP: 0.98;
  JS_BASE: 0.45;
  JS_HOVER_HALF_MS: 250;
  JS_HOVER_MAX: 0.5;
  JS_CAP: 0.95;
  DEVICE_TYPE: "npu";
}>;
```

Defined in: [core/tokens/motion/prefetch.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/prefetch.ts#L26)

NPU/GPU predictor scoring constants — the heuristic weights for
hover-dwell vs pointer-speed and the auto-prefetch confidence cutoff.
NPU/GPU tiers share the same linear blend (base + hover·w + (1−speed)·w)
with slightly different coefficients per compute target; the WASM
tier converts a spring-physics position into the same 0–1 scale.
