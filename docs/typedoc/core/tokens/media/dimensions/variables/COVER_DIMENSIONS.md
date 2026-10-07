[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / COVER\_DIMENSIONS

```ts
const COVER_DIMENSIONS: Readonly<{
  COVER_WIDTH: 1600
  COVER_HEIGHT: 900
  COVER_HEIGHT_WIDE: 798
  FHD_WIDTH: 1920
  FHD_HEIGHT: 1080
  FHD_WIDTH_STR: '1920'
}>
```

Defined in: [src/core/tokens/media/dimensions.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/media/dimensions.ts#L12)

Canonical pixel dimensions + media timing tokens split per subsystem. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
