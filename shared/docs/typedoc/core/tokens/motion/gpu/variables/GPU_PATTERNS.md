[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/gpu](../README.md) / GPU\_PATTERNS

```ts
const GPU_PATTERNS: Readonly<{
  DEDICATED: RegExp;
  APPLE: RegExp;
  INTEGRATED: RegExp;
  SOFTWARE: RegExp;
}>;
```

Defined in: [core/tokens/motion/gpu.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/gpu.ts#L14)

GPU detection & power-hint tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
