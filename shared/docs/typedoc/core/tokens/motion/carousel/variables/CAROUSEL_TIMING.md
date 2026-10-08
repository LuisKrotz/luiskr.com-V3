[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/carousel](../README.md) / CAROUSEL\_TIMING

```ts
const CAROUSEL_TIMING: Readonly<{
  AUTOPLAY_DURATION: 5000;
  TELEPORT_DELAY: 420;
  NAVIGATION_SETTLE_DELAY: 400;
  SCROLL_DEBOUNCE_MS: 150;
  RING_REGRESS_STEP: 0.04;
}>;
```

Defined in: [core/tokens/motion/carousel.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/carousel.ts#L12)

Carousel timing/geometry tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
