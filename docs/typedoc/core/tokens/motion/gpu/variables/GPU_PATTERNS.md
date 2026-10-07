[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/gpu](../README.md) / GPU\_PATTERNS

```ts
const GPU_PATTERNS: Readonly<{
  DEDICATED: RegExp
  APPLE: RegExp
  INTEGRATED: RegExp
  SOFTWARE: RegExp
}>
```

Defined in: [src/core/tokens/motion/gpu.ts:9](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/motion/gpu.ts#L9)

## File

tokens/motion/gpu.js

## Description

GPU detection & power-hint tokens — renderer-string
classifiers for WEBGL_debug_renderer_info output. Used to pick WebGL
`powerPreference` — requesting the discrete GPU only when one actually
exists avoids draining battery on integrated-only laptops.
