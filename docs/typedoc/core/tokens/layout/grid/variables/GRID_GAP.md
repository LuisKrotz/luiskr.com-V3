[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/layout/grid](../README.md) / GRID\_GAP

```ts
const GRID_GAP: Readonly<{
  272: 13
  320: 21
  375: 21
  414: 21
  540: 34
  768: 55
  960: 55
  1024: 89
  1280: 89
  1440: 89
  1680: 144
  1920: 144
  2560: 233
  3840: 377
  5120: 377
  7680: 610
  10240: 610
}>
```

Defined in: [core/tokens/layout/grid.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/layout/grid.ts#L12)

Per-breakpoint grid padding (matches SASS $gap- values) and the mosaic column table shared with the WASM layout worker. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
