[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/layout/breakpoints](../README.md) / BREAKPOINTS

```ts
const BREAKPOINTS: Readonly<{
  272: 272;
  320: 320;
  375: 375;
  414: 414;
  540: 540;
  768: 768;
  960: 960;
  1024: 1024;
  1280: 1280;
  1360: 1360;
  1440: 1440;
  1560: 1560;
  1680: 1680;
  1920: 1920;
  2100: 2100;
  2560: 2560;
  3840: 3840;
}>;
```

Defined in: [core/tokens/layout/breakpoints.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/layout/breakpoints.ts#L11)

Responsive breakpoint registry (px). Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
