[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/prefetch](../README.md) / PREFETCH\_CONFIG

```ts
const PREFETCH_CONFIG: Readonly<{
  IDLE_TIMEOUT: 2000;
  FALLBACK_DELAY: 120;
  ROOT_MARGIN: "200px 0px";
  THRESHOLD: 0.1;
  PORTFOLIO_REGEX: RegExp;
}>;
```

Defined in: [core/tokens/motion/prefetch.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/prefetch.ts#L11)

Predictive-prefetch tuning tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
