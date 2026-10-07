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

Defined in: [src/core/tokens/motion/gpu.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/motion/gpu.ts#L14)

GPU detection & power-hint tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
