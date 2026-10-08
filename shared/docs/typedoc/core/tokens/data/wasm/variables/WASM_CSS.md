[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/wasm](../README.md) / WASM\_CSS

```ts
const WASM_CSS: Readonly<{
  GPU_CLASS: "wasm-gpu-accelerated";
  DEFAULT_WIDTH: "100%";
  DEFAULT_HEIGHT: "1.2em";
  DISPLAY: "inline-block";
  FALLBACK_WIDTH_PX: 200;
  FALLBACK_HEIGHT_PX: 24;
}>;
```

Defined in: [core/tokens/data/wasm.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/wasm.ts#L55)

Dynamic-CSS injector tokens — the managed <style> node's sole rule is
the GPU compositor-promotion utility class; skeleton defaults cover the
analytics-sizing helper's CSS fallbacks.
