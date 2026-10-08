[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/ids/assets](../README.md) / ASSET\_IDS

```ts
const ASSET_IDS: Readonly<{
  CRITICAL_CSS: 'critical-css'
  WASM_DYNAMIC_CSS: 'wasm-dynamic-css'
  EARTH_CANVAS: 'earth-canvas'
  FILTER: 'filter'
}>
```

Defined in: [core/tokens/ids/assets.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/ids/assets.ts#L12)

Dynamically-created element id tokens (critical CSS, WASM style sheet, playground canvas) Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
